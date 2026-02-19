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
import RadarChart from './components/RadarChart/RadarChart.jsx';
import VisualDashboard from './components/VisualDashboard/VisualDashboard.jsx';
import { Chart } from 'chart.js';
import ChatComponent from './components/ChatComponent/ChatComponent.jsx';
import LoadingScreen from './components/LoadingScreen/LoadingScreen.jsx';

function App() {
  const [criteriaData, setCriteriaData] = useState([]);
  const [optionsData, setOptionsData] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCriteriaChange = (newInfo) => {
    setCriteriaData(newInfo.data);
  };

  const handleRevealDestiny = () => {
  setIsLoading(true); // Loading ekranını tetikle

  // 5 saniye bekle
  setTimeout(() => {
    try {
      const calculatedResults = calculateDecisionMatrix(criteriaData, optionsData);
      setResults(calculatedResults);
      toast.success(`Kazanan: ${calculatedResults[0].name}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      // İşlem başarılı olsa da hata verse de loading ekranını kapat
      setIsLoading(false);
    }
  }, 5000); //TODO  bu yükleme ekranı sabit 5 saniye duruyo , bunu dinamik hale getirmek istiyorum
};
  return (
    <>
    {isLoading && <LoadingScreen />}
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: 'moirai-toast', 
        }}
      />
      <Navbar />
      
      <div className='main-tables'> 
        <div className="left-panel">
          <CriteriaTable onDataChange={handleCriteriaChange}/>
        </div>
        <div className="right-panel">
          {criteriaData.length >= 0 && (
             <OperationsTable criteria={criteriaData} onDataChange={setOptionsData}/>
          )}
        </div>
      </div>
      <div className="main-tables">
         <div style={{ width: '100%', padding: '0 10px' }}>
            <ResultsLeaderboard results={results} criteria={criteriaData} />
         </div>
      </div>
      
      <div className="action-area">
        <button className="seal-button" onClick={handleRevealDestiny}>
          <span className="seal-icon">⚖️</span>
          <span className="seal-text">Reveal Destiny</span>
        </button>
      </div>

          <VisualDashboard results={results} criteria={criteriaData} />
          

      <ChatComponent />
                
      <Footer />
      
    </>
  )
}

export default App;