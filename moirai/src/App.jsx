import './color_palette.css'
import './App.css'
import Navbar from './components/MoiraiNavbar/MoiraiNavbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import CriteriaTable from './components/CriteriaTable/CriteriaTable.jsx'
import OperationsTable from './components/OperationsTable/OperationsTable.jsx';
import { useState } from 'react'

// function App() {
//   const [criteriaData, setCriteriaData] = useState([]);
//   const [optionsData, setOptionsData] = useState([]);
// const handleCriteriaChange = (newInfo) => {
//     setCriteriaData(newInfo.data);
//   };
//   return (
//     <>
//     <Navbar />
//     <div className='main-tables'>
//       <CriteriaTable onDataChange={handleCriteriaChange}/>
//       <OperationsTable criteria={criteriaData}  data={setOptionsData}/>
//     </div>
    
//     <Footer />
//     </>
//   )
// }

function App() {
  const [criteriaData, setCriteriaData] = useState([]);
  const [optionsData, setOptionsData] = useState([]);

  const handleCriteriaChange = (newInfo) => {
    setCriteriaData(newInfo.data);
  };

  return (
    <>
      <Navbar />
      
      {/* Ana Taşıyıcı */}
      <div className='main-tables'>
        
        {/* SOL KUTU (SABİT OLACAK) */}
        <div className="left-panel">
          <CriteriaTable onDataChange={handleCriteriaChange}/>
        </div>

        {/* SAĞ KUTU (ESNEK OLACAK) */}
        <div className="right-panel">
          {/* Ufak bir kontrol: Kriter yoksa sağ tablo boşuna yer kaplamasın */}
          {criteriaData.length >= 0 && (
             <OperationsTable criteria={criteriaData} onDataChange={setOptionsData}/>
          )}
        </div>

      </div>
      
      <Footer />
    </>
  )
}


export default App
