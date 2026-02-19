import { useState, useEffect } from "react";
import { sendMessageToLLM } from "../../services/openrouterapi";
// import "./ChatComponent.css"; 

function AnalysisChat({ results }) {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (results && results.length > 0) {
      performAIAnalysis();
    }
  }, [results]); // results değiştiğinde (butona basılınca) tetiklenir

  const performAIAnalysis = async () => {
    setLoading(true);
    setAnalysis(""); // Eski analizi temizle

    // Veriyi prompt haline getiriyoruz
    const prompt = `Aşağıdaki karar matrisi sonuçlarını analiz et ve en mantıklı seçeneği nedenleriyle açıkla:
    ${results.map(item => 
      `- ${item.name} (Final Skor: ${item.finalScore}): ` + 
      Object.keys(item.breakdown)
            .map(key => `${key} katkısı: ${item.breakdown[key].contributionValue}`)
            .join(", ")
    ).join("\n")}
    
    Lütfen kısa bir yorum yap.
    Yourumu yaparken sayısal değerlerden bahsetme
    Bilimsel bir ton kullanma
    Tavisye veren bir dost biçiminde açıkla
    Yorumunu yaparken 80 kelimeyi geçmesin`;

    try {
      const response = await sendMessageToLLM(prompt);
      setAnalysis(response);
    } catch (error) {
      setAnalysis("Analiz sırasında bir hata oluştu. Hata:" + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analysis-container" style={{ padding: '20px', marginTop: '20px' }}>
      <h3>🤖 Yapay Zeka Karar Analizi</h3>
      <div className="message assistant" style={{ minHeight: '100px' }}>
        {loading ? (
          <p className="loading">Moirai verileri yorumluyor...</p>
        ) : (
          <p>{analysis}</p>
        )}
      </div>
    </div>
  );
}

export default AnalysisChat;