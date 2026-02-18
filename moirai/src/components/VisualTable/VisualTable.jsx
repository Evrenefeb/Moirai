// VisualTable.jsx
import React, { useState, useMemo } from 'react';
import RadarChart from "../../components/RadarChart/RadarChart.jsx"; 
import DoughnutChart from "../../components/DoughtnutChart/DoughtnutChart.jsx";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';


// ChartJS bileşenlerini kaydet
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement
);

// 1. SABİT RENK PALETİ (Tutarlılık için)
const CHART_COLORS = [
  'rgba(255, 99, 132, 1)',   // Kırmızı
  'rgba(54, 162, 235, 1)',   // Mavi
  'rgba(255, 206, 86, 1)',   // Sarı
  'rgba(75, 192, 192, 1)',   // Yeşil
  'rgba(153, 102, 255, 1)',  // Mor
  'rgba(255, 159, 64, 1)',   // Turuncu
  'rgba(201, 203, 207, 1)'   // Gri
];

const VisualTable = ({ results, criteria }) => {
  // --- STATE YÖNETİMİ ---
  
  // Radar'da hangi ürünler görünecek? (ID listesi)
  // Varsayılan: İlk 3 sıradaki ürün (sonuçlar zaten sıralı geliyorsa)
  const [radarSelection, setRadarSelection] = useState(
    results.slice(0, 3).map(r => r.id)
  );

  // Donut şu an kimi gösteriyor? (null = Global Ağırlıklar, ID = O ürünün detayı)
  const [focusedOptionId, setFocusedOptionId] = useState(null);

  // Hangi kriter vurgulandı? (Sıralama ve Radar ekseni için)
  const [highlightedCriterion, setHighlightedCriterion] = useState(null);


  // --- MANTIK: SIRALAMA & FİLTRELEME ---
  
  // Listeyi neye göre sıralayacağız?
  const sortedResults = useMemo(() => {
    let data = [...results];
    if (highlightedCriterion) {
      // Seçili kriterin puanına göre sırala (High to Low)
      data.sort((a, b) => {
        const valA = a.breakdown[highlightedCriterion]?.contributionValue || 0;
        const valB = b.breakdown[highlightedCriterion]?.contributionValue || 0;
        return valB - valA;
      });
    } else {
      // Genel skora göre sırala
      data.sort((a, b) => b.finalScore - a.finalScore);
    }
    return data;
  }, [results, highlightedCriterion]);


  // --- CHART VERİLERİ ---

  // 1. RADAR CHART VERİSİ
  const radarData = {
    labels: criteria.map(c => c.name), // Eksenler = Kriterler
    datasets: results
      .filter(r => radarSelection.includes(r.id)) // Sadece seçili ürünler
      .map((r, i) => {
        // Renk ataması: Ürünün orijinal indexine göre renk verelim ki değişmesin
        const colorIndex = results.findIndex(res => res.id === r.id) % CHART_COLORS.length;
        const color = CHART_COLORS[colorIndex];
        
        return {
          label: r.name,
          // Radar verisi: Her kriterdeki HAM puanı (veya normalize edilmiş puanı)
          data: criteria.map(c => r.rawScores[c.name] || 0),
          backgroundColor: color.replace('1)', '0.2)'), // Şeffaf dolgu
          borderColor: color,
          borderWidth: 2,
        };
      })
  };

  // Radar Options (Highlight mantığı burada)
  const radarOptions = {
    scales: {
      r: {
        pointLabels: {
          // Highlight edilen kriterin yazısını kalınlaştır/büyüt
          font: (context) => {
            const label = context.chart.data.labels[context.index];
            if (label === highlightedCriterion) {
              return { size: 14, weight: 'bold' };
            }
            return { size: 11 };
          },
          color: (context) => {
             const label = context.chart.data.labels[context.index];
             return label === highlightedCriterion ? '#FF5722' : '#666';
          }
        },
        suggestedMin: 0,
        suggestedMax: 10, // Puanlama 10 üzerinden varsayıyoruz
      }
    }
  };


  // 2. DOUGHNUT CHART VERİSİ
  const getDoughnutData = () => {
    // MOD A: Global Ağırlıklar (Hiçbir ürün odaklanmamışsa)
    if (!focusedOptionId) {
      return {
        labels: criteria.map(c => c.name),
        datasets: [{
          label: 'Kriter Ağırlığı (%)',
          data: criteria.map(c => c.weight), // Ağırlıklar
          backgroundColor: criteria.map((_, i) => CHART_COLORS[i % CHART_COLORS.length].replace('1)', '0.7)')),
          borderColor: '#fff',
          borderWidth: 2,
        }]
      };
    }

    // MOD B: Seçili Ürünün Puan Dağılımı
    const product = results.find(r => r.id === focusedOptionId);
    return {
      labels: criteria.map(c => c.name),
      datasets: [{
        label: `${product.name} Puan Katkısı`,
        // Breakdown verisinden katkı puanlarını alıyoruz
        data: criteria.map(c => product.breakdown[c.name]?.contributionValue || 0),
        backgroundColor: criteria.map((_, i) => CHART_COLORS[i % CHART_COLORS.length].replace('1)', '0.7)')),
        borderColor: '#fff',
        borderWidth: 2,
      }]
    };
  };

  // Donut Tıklama Olayı (Senaryo 1'in Kalbi)
  const handleDoughnutClick = (event, elements) => {
    if (!elements || elements.length === 0) {
      // Boşa tıklanırsa highlight'ı kaldır
      setHighlightedCriterion(null);
      return;
    }
    
    // Tıklanan dilimin indexini bul
    const dataIndex = elements[0].index;
    const clickedLabel = getDoughnutData().labels[dataIndex]; // Kriter ismi
    
    // State'i güncelle (Highlight ve Sort tetiklenir)
    setHighlightedCriterion(clickedLabel === highlightedCriterion ? null : clickedLabel);
  };


  return (
    <div className="dashboard-container">
      
      {/* --- SOL PANEL: SELECTION LIST --- */}
      <div className="panel list-panel">
        <h4>
            {highlightedCriterion ? `Sıralama: ${highlightedCriterion}` : 'Sonuç Listesi'}
        </h4>
        <div className="list-scroll">
            {sortedResults.map((r, idx) => (
            <div 
                key={r.id} 
                className={`list-item ${focusedOptionId === r.id ? 'focused' : ''}`}
            >
                <div className="item-rank">#{idx + 1}</div>
                <div className="item-info">
                    <span className="item-name">{r.name}</span>
                    <span className="item-score">
                        {highlightedCriterion 
                            ? r.breakdown[highlightedCriterion]?.contributionValue.toFixed(1) // Kriter puanı
                            : r.finalScore.toFixed(1) // Genel puan
                        }
                    </span>
                </div>
                
                <div className="item-actions">
                    {/* Göz İkonu: Donut'a Odaklar */}
                    <button 
                        className={`icon-btn ${focusedOptionId === r.id ? 'active' : ''}`}
                        onClick={() => setFocusedOptionId(focusedOptionId === r.id ? null : r.id)}
                        title="Donut Grafiğinde İncele"
                    >
                        👁️
                    </button>

                    {/* Checkbox: Radar'a Ekler */}
                    <input 
                        type="checkbox"
                        checked={radarSelection.includes(r.id)}
                        onChange={() => {
                            if (radarSelection.includes(r.id)) {
                                setRadarSelection(radarSelection.filter(id => id !== r.id));
                            } else {
                                setRadarSelection([...radarSelection, r.id]);
                            }
                        }}
                        title="Radar Grafiğine Ekle"
                    />
                </div>
            </div>
            ))}
        </div>
      </div>

      {/* --- ORTA PANEL: DOUGHNUT (Context/Input/Breakdown) --- */}
      <div className="panel chart-panel">
        <h4>
            {focusedOptionId 
                ? `${results.find(r=>r.id===focusedOptionId)?.name} Analizi` 
                : 'Kriter Ağırlıkları (Global)'}
        </h4>
        <div style={{ height: '300px', position: 'relative' }}>
             <Doughnut 
                data={getDoughnutData()} 
                options={{
                    onClick: handleDoughnutClick,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }} 
            />
            {/* Eğer focused moddaysak geri dönme tuşu */}
            {focusedOptionId && (
                <button 
                    className="reset-donut-btn"
                    onClick={() => setFocusedOptionId(null)}
                >
                    🔙 Genel Görünüm
                </button>
            )}
        </div>
        <p className="hint-text">
            {focusedOptionId 
             ? "Dilimlere tıklayarak listeyi o kritere göre sıralayabilirsin." 
             : "Kriterlerin genel ağırlığı. Bir ürüne odaklanmak için listedeki 👁️ ikonuna bas."}
        </p>
      </div>

      {/* --- SAĞ PANEL: RADAR (Comparison) --- */}
      <div className="panel chart-panel">
        <h4>Karşılaştırma (Radar)</h4>
        <div style={{ height: '300px' }}>
            {radarSelection.length > 0 ? (
                <Radar 
                    data={radarData}
                    options={radarOptions} 
                />
            ) : (
                <div className="empty-state">
                    Listeden karşılaştırmak için ürün seçin (☑️)
                </div>
            )}
        </div>
      </div>

    </div>
  );
};

export default VisualTable;