// import './color_palette.css'
// import './App.css'
// import Navbar from './components/MoiraiNavbar/MoiraiNavbar.jsx'
// import Footer from './components/Footer/Footer.jsx'
// import CriteriaTable from './components/CriteriaTable/CriteriaTable.jsx'
// import OperationsTable from './components/OperationsTable/OperationsTable.jsx';
// import { useState } from 'react'

// function App() {
//   const [criteriaData, setCriteriaData] = useState([]);
//   const [optionsData, setOptionsData] = useState([]);

//   const handleCriteriaChange = (newInfo) => {
//     setCriteriaData(newInfo.data);
//   };

//   return (
//     <>
//       <Navbar />
      
//       <div className='main-tables'> 
//         <div className="left-panel">
//           <CriteriaTable onDataChange={handleCriteriaChange}/>
//         </div>
//         <div className="right-panel">
//           {criteriaData.length >= 0 && (
//              <OperationsTable criteria={criteriaData} onDataChange={setOptionsData}/>
//           )}
//         </div>
//       </div>
      
//       <Footer />
//     </>
//   )
// }


// export default App



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

function App() {
  const [criteriaData, setCriteriaData] = useState([]);
  const [optionsData, setOptionsData] = useState([]);
  const [results, setResults] = useState([]);

  const handleCriteriaChange = (newInfo) => {
    setCriteriaData(newInfo.data);
  };

  const handleRevealDestiny = () => {
    try {
      const calculatedResults = calculateDecisionMatrix(criteriaData, optionsData);
      
      // 2. SONUCU STATE'E KAYDET (Böylece Leaderboard otomatik görünür)
      setResults(calculatedResults);
      
      toast.success(`Kazanan: ${calculatedResults[0].name}`);
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <>
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
          
      <Footer />
    </>
  )
}

export default App;