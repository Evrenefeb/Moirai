import { useState, useEffect } from "react";
import { sendMessagesToLLM } from "../../services/openrouterapi";
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
    setAnalysis("");

    // 1. YAPAY ZEKANIN BEYNİ (System Prompt)
    const systemMessage = {
      role: "system",
      content: `You are an impartial and analytical decision-support assistant. Your goal is to help the user evaluate and compare their options effectively.
      - Do not roleplay.
      - Avoid all positivity bias, unnecessary praise, or artificial optimism; evaluate the results with strict objectivity and realism.
      - Analyze the decision matrix results using clear, understandable, and comparative language however , avoid number talk.
      - Clearly highlight the relative strengths and weaknesses of the options based on their weighted contributions.
      - Keep your tone concise, direct, and straight to the point.
      - Keep your response strictly under 80 words.`
    };

    // 2. KULLANICI VERİSİ (User Prompt)
    const userMessage = {
      role: "user",
      content: `Analyze the following decision matrix results and compare the options:\n` +
      results.map((item) =>
          `- ${item.name} (Final Score: ${item.finalScore}): ` +
          Object.keys(item.breakdown)
            .map((key) => `${key} impact: ${item.breakdown[key].contributionValue}`)
            .join(", ")
      ).join("\n")
    };

    try {
      const response = await sendMessagesToLLM([systemMessage, userMessage]);
      setAnalysis(response);
    } catch (error) {
      setAnalysis("Error: " + error.message);
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
            <strong>Moirai AI Analysis</strong>
            </div>
          </AccordionHeader>
          <AccordionBody accordionId="1" className="AI-response-body">
            <div className="message assistant" style={{ minHeight: "100px" }}>
              {loading ? (
                <p className="loading">Moirai is reviewing your prompt...</p>
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
