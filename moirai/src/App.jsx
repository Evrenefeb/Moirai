import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { calculateDecisionMatrix } from "./scripts/DecisionCalculation";
import Navbar from "./components/MoiraiNavbar/MoiraiNavbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import CriteriaTable from "./components/CriteriaTable/CriteriaTable.jsx";
import OperationsTable from "./components/OperationsTable/OperationsTable.jsx";
import "./color_palette.css";
import "./App.css";
import ResultsLeaderboard from "./components/ResultsLeaderboard/ResultsLeaderboard.jsx";
import VisualDashboard from "./components/VisualDashboard/VisualDashboard.jsx";
import AnalysisChat from "./components/AnalysisChat/AnalysisChat.jsx";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen.jsx";
import MoiraiFAB from "./components/MoiraiFAB/MoiraiFAB.jsx";
import HowToUseWebsite from "./components/HowToUse/HowToUseWebsite.jsx";

function App() {
  const [criteriaData, setCriteriaData] = useState([]);
  const [optionsData, setOptionsData] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tableName, setTableName] = useState(""); // YENİ: Tablo ismini burada tutuyoruz
  const [resetKey, setResetKey] = useState(0);

  const handleCriteriaChange = (newInfo) => {
    setCriteriaData(newInfo.data);
    setTableName(newInfo.tableName); // YENİ: CriteriaTable'dan gelen ismi güncelliyoruz
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
        setTimeout(() => {
          document
            .querySelector(".leaderboard-container")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleReset = () => {
    setResults([]);
    setCriteriaData([]);
    setOptionsData([]);
    setTableName(""); // YENİ: İsmi de sıfırlıyoruz
    setResetKey((prev) => prev + 1);
    toast("you successfully reset the tables.", { icon: "📜" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // App.jsx içindeki return kısmı:

  return (
    <>
      {isLoading && <LoadingScreen isLoading={isLoading} />}
      <Toaster
        position="top-center"
        toastOptions={{ className: "moirai-toast" }}
      />
      <Navbar />

      {/* YENİ EKLENEN KAPSAYICI: Sayfanın en az 1 tam ekran boyunda olmasını sağlar */}
      <div style={{ minHeight: "100vh", paddingBottom: "40px" }}>
        <div className="main-tables">
          <div className="left-panel">
            <CriteriaTable
              key={`criteria-${resetKey}`}
              onDataChange={handleCriteriaChange}
            />
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

        <MoiraiFAB onSubmit={handleRevealDestiny} onReset={handleReset} />

        {results.length > 0 && (
          <VisualDashboard results={results} criteria={criteriaData} />
        )}

        {results.length > 0 && (
          <AnalysisChat results={results} tableName={tableName} />
        )}

        {results.length < 1 && <HowToUseWebsite />}
      </div>

      <Footer />
    </>
  );
}

export default App;
