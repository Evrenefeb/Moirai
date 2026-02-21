import { useState, useEffect } from "react";
import { sendMessageToLLM } from "../../services/openrouterapi";
import {
  UncontrolledAccordion,
  AccordionItem,
  AccordionBody,
  AccordionHeader,
} from "reactstrap";

import ReactMarkdown from "react-markdown"; 

import "./AnalysisChat.css";

function AnalysisChat({ results, tableName }) { // YENİ: tableName prop'u eklendi
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (results && results.length > 0) {
      performAIAnalysis();
    }
  }, [results]); 

  const performAIAnalysis = async () => {
    setLoading(true);
    setAnalysis(""); 

    // prompt tableName ile zenginleştirildi
    const prompt = `Analiz Konusu: ${tableName || "Genel Karar"}
    Aşağıdaki karar matrisi sonuçlarını analiz et ve en mantıklı seçeneği nedenleriyle açıkla:
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
    
    Lütfen ${tableName ? tableName + " hakkında " : ""}kısa bir yorum yap.
    Yorumunu yaparken sayısal değerlerden bahsetme.
    Bilimsel bir ton kullanma.
    Tavsiye veren bir dost biçiminde açıkla.
    Yorumunu yaparken 80 kelimeyi geçmesin.`;

    try {
      const response = await sendMessageToLLM(prompt);
      setAnalysis(response);
    } catch (error) {
      setAnalysis("Error:" + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <UncontrolledAccordion  className="AIresponse">
        <AccordionItem className="AI-response-item">
          <AccordionHeader targetId="1">
            <div className="AI-response-title">
              <strong>Moirai AI Analysis {tableName ? `- ${tableName}` : ''}</strong>
            </div>
          </AccordionHeader>
          <AccordionBody accordionId="1" className="AI-response-body">
            <div className="message assistant" style={{ minHeight: "100px" }}>
              {loading ? (
                <p className="loading">Moirai is reviewing your prompt...</p>
              ) : (
                <ReactMarkdown>{analysis}</ReactMarkdown>
              )}
            </div>
          </AccordionBody>
        </AccordionItem>
      </UncontrolledAccordion>
    </div>
  );
}

export default AnalysisChat;