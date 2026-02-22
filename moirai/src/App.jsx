import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { calculateDecisionMatrix } from './scripts/DecisionCalculation';
import Navbar from './components/MoiraiNavbar/MoiraiNavbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import CriteriaTable from './components/CriteriaTable/CriteriaTable.jsx';
import OperationsTable from './components/OperationsTable/OperationsTable.jsx';
import './color_palette.css';
import './App.css';
import ResultsLeaderboard from './components/ResultsLeaderboard/ResultsLeaderboard.jsx';
import VisualDashboard from './components/VisualDashboard/VisualDashboard.jsx';
import AnalysisChat from './components/AnalysisChat/AnalysisChat.jsx';
import LoadingScreen from './components/LoadingScreen/LoadingScreen.jsx';

import MoiraiFAB from './components/MoiraiFAB/MoiraiFAB.jsx'; 
import HeroSection from './components/HeroSection/HeroSection.jsx';

function App() {
  const [criteriaData, setCriteriaData] = useState([]);
  const [optionsData, setOptionsData] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  
  const [resetKey, setResetKey] = useState(0); 

  const handleCriteriaChange = (newInfo) => {
    setCriteriaData(newInfo.data);
  };

  const handleRevealDestiny = () => {
    setIsLoading(true); 

    setTimeout(() => {
      try {
        const calculatedResults = calculateDecisionMatrix(
          criteriaData,
          optionsData,
        );
        setResults(calculatedResults); 
        toast.success(`Kazanan: ${calculatedResults[0].name}`);
        
        // EKRANI AŞAĞI KAYDIR
        setTimeout(() => {
          document.querySelector('.leaderboard-container')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }, 1500); // 5 saniye çok uzundu, 1.5 saniye ideal bir dramatik efekttir
  };

  // YENİ: RESET FONKSİYONU
  const handleReset = () => {
    setResults([]); // Grafikleri ve liderlik tablosunu gizler
    setCriteriaData([]); // Arka plandaki veriyi temizler
    setOptionsData([]);  // Arka plandaki veriyi temizler
    setResetKey(prev => prev + 1); // TABLOLARI SIFIRLAR! (Sihir burada)
    
    toast("you successfully reset the tables.", { icon: '📜' });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // En başa kaydır
  };

  // App.jsx içindeki return kısmı:

  return (
    <>
      {isLoading && <LoadingScreen isLoading={isLoading} />}
      <Toaster position="top-center" toastOptions={{ className: "moirai-toast" }} />
      <Navbar />

      <HeroSection />

      <div style={{ minHeight: '100vh', paddingBottom: '40px' }}>
        
        <div className="main-tables">
          <div className="left-panel">
            <CriteriaTable key={`criteria-${resetKey}`} onDataChange={handleCriteriaChange} />
          </div>
          <div className="right-panel">
            {criteriaData.length >= 0 && (
              <OperationsTable
                key={`options-${resetKey}`}
                criteria={criteriaData}
                onDataChange={setOptionsData}
              />
            )}
          </div>
        </div>

        <div className="main-tables">
          <div style={{ width: "100%", padding: "0 10px" }}>
            <ResultsLeaderboard results={results} criteria={criteriaData} />
          </div>
        </div>

        <MoiraiFAB 
          onSubmit={handleRevealDestiny} 
          onReset={handleReset} 
        />

        {results.length > 0 && <VisualDashboard results={results} criteria={criteriaData} /> }

        {results.length > 0 && <AnalysisChat results={results} />}

      </div> 

      
      <Footer />
    </>
  );
}

export default App;