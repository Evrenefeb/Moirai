import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { calculateDecisionMatrix } from './scripts/DecisionCalculation';

import Navbar from './components/MoiraiNavbar/MoiraiNavbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import CriteriaTable from './components/CriteriaTable/CriteriaTable.jsx';
import OperationsTable from './components/OperationsTable/OperationsTable.jsx';
import SubmitButton from './components/SubmitButton/SubmitButton.jsx';

import './color_palette.css';
import './App.css';

function App() {
  const [criteriaData, setCriteriaData] = useState([]);
  const [optionsData, setOptionsData] = useState([]);

  const handleCriteriaChange = (newInfo) => {
    setCriteriaData(newInfo.data);
  };

  const handleRevealDestiny = () => {
    try {
      const results = calculateDecisionMatrix(criteriaData, optionsData);
      console.log("🔮 Moirai Results:", results);

      

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
      
      <SubmitButton onClick={handleRevealDestiny} />

      <Footer />
    </>
  )
}

export default App;