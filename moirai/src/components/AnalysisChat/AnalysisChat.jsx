import { useState, useEffect } from "react";
import { sendMessageToLLM } from "../../services/openrouterapi";
import {
  UncontrolledAccordion,
  AccordionItem,
  AccordionBody,
  Accordion,
  AccordionHeader,
} from "reactstrap";

import "./AnalysisChat.css";

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
    ${results
      .map(
        (item) =>
          `- ${item.name} (Final Skor: ${item.finalScore}): ` +
          Object.keys(item.breakdown)
            .map(
              (key) =>
                `${key} katkısı: ${item.breakdown[key].contributionValue}`,
            )
            .join(", "),
      )
      .join("\n")}
    
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
    <div>
      <UncontrolledAccordion defaultOpen={["1", "2"]} className="AIresponse">
        <AccordionItem className="AI-response-item">
          <AccordionHeader targetId="1">
            <div className="AI-response-title">
            <strong>Moirai AI Analysis</strong>
            </div>
          </AccordionHeader>
          <AccordionBody accordionId="1" className="AI-response-body">
            <div className="message assistant" style={{ minHeight: "100px" }}>
              {loading ? (
                <p className="loading">Moirai verileri yorumluyor...</p>
              ) : (
                <p>{analysis}</p>
              )}
            </div>
          </AccordionBody>
        </AccordionItem>
      </UncontrolledAccordion>
    </div>
  );
}

export default AnalysisChat;
