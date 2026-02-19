import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Radar, Doughnut } from 'react-chartjs-2';
import { Container, Row, Col } from 'reactstrap';
import { useTheme } from '../../ThemeContext'; 
import './VisualDashboard.css';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, PointElement, LineElement, Filler);

const VisualDashboard = ({ results = [], criteria = [] }) => {
  const { theme } = useTheme();

  // --- 1. STATE MANAGEMENT ---

  const [selectedCriterionId, setSelectedCriterionId] = useState(null);

  
  // Doğru: State'i sonuçlara göre başlat
const [selectedCandidateId, setSelectedCandidateId] = useState(() => {
  return results.length > 0 ? results[0].id : null;
});

  
  const getCriteriaColor = (index, alpha = 0.6) => {
    const hue = (index * 137.508) % 360; 
    return `hsla(${hue}, 65%, 50%, ${alpha})`;
  };

  // TODO : BU REN İŞLEME EKRANI %99 İHTİMALLE YANLIŞ , BUNU DİĞER KOMPONENTLARIN İŞLEME BİÇİMİNE DÖNDÜR
  const themeColors = useMemo(() => {
    const isDark = theme === 'dark';
    return {
      textColor: isDark ? '#A3A3A3' : '#57534E',
      gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      backdropColor: 'transparent',
      radarFill: isDark ? 'rgba(237, 224, 200, 0.2)' : 'rgba(166, 124, 82, 0.2)', 
      radarBorder: isDark ? '#EDE0C8' : '#A67C52',
      pointColor: isDark ? '#2A9D8F' : '#D4AF37', 
    };
  }, [theme]);


  
  const radarChartData = useMemo(() => {
    if (!selectedCandidateId || results.length === 0) return null;

    const candidate = results.find(r => r.id === selectedCandidateId);
    if (!candidate) return null;

    
    const dataValues = criteria.map(c => candidate.rawScores[c.name] || 0);

    return {
      labels: criteria.map(c => c.name),
      datasets: [{
        label: candidate.name,
        data: dataValues,
        backgroundColor: themeColors.radarFill,
        borderColor: themeColors.radarBorder,
        pointBackgroundColor: themeColors.pointColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: themeColors.pointColor,
        borderWidth: 2,
        fill: true,
      }],
    };
  }, [selectedCandidateId, results, criteria, themeColors]);


 
  const doughnutChartData = useMemo(() => {
   
    if (selectedCriterionId) {
      const criterion = criteria.find(c => c.id === selectedCriterionId);
      if (!criterion) return null;

   
      const labels = results.map(r => r.name);
      const data = results.map(r => r.rawScores[criterion.name] || 0);
      
  
      const colors = results.map((_, i) => getCriteriaColor(i, 0.7));
      const borders = results.map((_, i) => getCriteriaColor(i, 1));

      return {
      labels: labels,
      datasets: [{
        label: `${criterion.name} Score`,
        data: data,
        backgroundColor: colors,
        borderColor: borders,
        borderWidth: 1,
      }]
    };
    } 
    
    
    else {
      return {
        //TODO : BURAYA KRİTERLERİN TOPLAM PUANLARININ YÜZDE KAÇI OLDUĞUNU GÖSTER, DAHA ÇOK BİLGİ VEREN BİR TOOLTİP EKRANI YAP
        labels: criteria.map(c => c.name),
        datasets: [{
          label: 'Weight',
          data: criteria.map(c => c.weight),
          backgroundColor: criteria.map((_, i) => getCriteriaColor(i, 0.7)),
          borderColor: themeColors.gridColor,
          borderWidth: 1,
        }]
      };
    }
  }, [selectedCriterionId, criteria, results, themeColors]);



  
  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: themeColors.gridColor },
        grid: { color: themeColors.gridColor },
        pointLabels: {
          color: themeColors.textColor,
          font: { family: 'Cinzel', size: 11 }
        },
        ticks: {
          display: false, 
          backdropColor: 'transparent'
        },
        suggestedMin: 0,
        suggestedMax: 10 
      }
    },
    plugins: {
      legend: { display: false } 
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        bodyFont: { family: 'Cinzel', size: 13 },
        callbacks: {
          label: function(context) {
            // Senaryo 2: Bir kriter seçiliyse (Adayları kıyaslıyorsak)
            if (selectedCriterionId) {
              const candidate = results[context.dataIndex]; 
              const breakdownData = candidate?.breakdown[selectedCriterionName];

              if (breakdownData) {
                // Array döndürmek tooltip'te satır atlamayı sağlar
                return [
                  `Ham Puan: ${breakdownData.givenScore} / 10`,
                  `Ağırlıklı Puan: ${breakdownData.contributionValue}`
                ];
              }
              return `Puan: ${context.raw}`; // Veri bulunamazsa fallback
            } 
            
            // Senaryo 1: Genel ağırlıkları gösteriyorsak
            else {
               return `Ağırlık Puanı: ${context.raw}`;
            }
          }
        }
      }
    }
  };


  if (!results || results.length === 0) {
    return (
      <div className="visual-container">
         <div className="visual-header-block">
            <h3 className="visual-header-title">Visual Analysis Workspace</h3>
         </div>
         <div className="visual-body d-flex justify-content-center align-items-center" style={{minHeight:'200px'}}>
         </div>
      </div>
    );
  }

  const selectedCriterionName = criteria.find(c => c.id === selectedCriterionId)?.name || "General Weights";

  return (
    <div className="visual-container">
      
      {/* HEADER */}
      <div className="visual-header-block">
        <h3 className="visual-header-title">Visual Analysis Workspace</h3>
        <div style={{color: 'var(--brand-primary)', fontSize:'0.8rem'}}>MOIRAI ANALYTICS</div>
      </div>

      <div className="visual-body">
        <Container fluid>
          <Row className="g-4">
            
            <Col md="3">
              <h5 className="panel-title">SELECTIONS</h5>
              <div className="interactive-list">
                {results.map((candidate) => (
                  <div 
                    key={candidate.id}
                    className={`list-item ${selectedCandidateId === candidate.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCandidateId(candidate.id)}
                  >
                    <span>{candidate.name}</span>
                    <span className="indicator">●</span>
                  </div>
                ))}
              </div>
            </Col>

            <Col md="3" className="d-flex flex-column align-items-center">
              <h5 className="panel-title">
                  {results.find(r => r.id === selectedCandidateId)?.name || "Candidate"} Stats
              </h5>
              <div className="chart-container">
                {radarChartData && <Radar data={radarChartData} options={radarOptions} />}
              </div>
            </Col>

            <Col md="3" className="d-flex flex-column align-items-center">
              <h5 className="panel-title">
                  {selectedCriterionId ? selectedCriterionName.toUpperCase() : "WEIGHT DISTRIBUTION"}
              </h5>
              <div className="chart-container">
                {doughnutChartData && <Doughnut data={doughnutChartData} options={doughnutOptions} />}
              </div>
            </Col>

            <Col md="3">
              <h5 className="panel-title">CRITERIA (OVERRIDE)</h5>
              <div className="interactive-list">
                 <div 
                    className={`list-item ${selectedCriterionId === null ? 'selected' : ''}`}
                    onClick={() => setSelectedCriterionId(null)}
                    style={{ fontStyle: 'italic', opacity: 0.8 }}
                  >
                    <span>● General Weights</span>
                    <span className="indicator">◄</span>
                  </div>

                {criteria.map((c) => (
                  <div 
                    key={c.id}
                    className={`list-item ${selectedCriterionId === c.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCriterionId(c.id)}
                  >
                    <span>{c.name}</span>
                    <span className="indicator">►</span>
                  </div>
                ))}
              </div>
            </Col>

          </Row>
        </Container>
      </div>
    </div>
  );
};

export default VisualDashboard;