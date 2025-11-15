import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://apiask.fly.dev/api/tutor";

export default function App() {
  const [pergunta, setPergunta] = useState("");
  const [alternativas, setAlternativas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [pontos, setPontos] = useState(0);

  const carregarPergunta = async () => {
    setLoading(true);
    setFeedback("");

    try {
      const { data } = await axios.get(`${API_URL}/pergunta`);
      setPergunta(data.pergunta);

      const linhas = data.pergunta.split("\n");
      const alts = linhas.filter((l) => /^[A-E]\)/i.test(l.trim()));
      setAlternativas(alts);
    } catch (error) {
      console.log(error);
      setFeedback("Erro ao carregar pergunta");
    }

    setLoading(false);
  };

  const responder = async (alt) => {
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/resposta`, {
        alternativa: alt[0],
      });

      if (data.acertou) {
        setFeedback("✅ Você acertou! (+10 pontos)");
        setPontos((p) => p + 10);
      } else {
        setFeedback(`❌ Errou! A certa era: ${data.correta} (-5 pontos)`);
        setPontos((p) => Math.max(0, p - 5)); // não deixa ficar negativo
      }

      setTimeout(() => carregarPergunta(), 2000);
    } catch (error) {
      console.log(error);
      setFeedback("Erro ao enviar resposta");
    }

    setLoading(false);
  };

  useEffect(() => {
    carregarPergunta();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.titulo}>Tutor de Programação</h1>

        <div style={styles.pontos}>⭐ Pontos: {pontos}</div>

        {loading ? (
          <div style={styles.loading}>Carregando...</div>
        ) : (
          <>
            <p style={styles.pergunta}>{pergunta}</p>

            {alternativas.map((alt, index) => (
              <button
                key={index}
                style={styles.botao}
                onClick={() => responder(alt)}
              >
                {alt}
              </button>
            ))}

            {feedback !== "" && (
              <p style={{ ...styles.feedback, opacity: feedback ? 1 : 0 }}>
                {feedback}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width: "100vw",
    margin: 0,
    padding: 0,
    backgroundColor: "#0a0a0a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#1c1c1c",
    width: "90%",
    maxWidth: 600,
    padding: 30,
    borderRadius: 16,
    boxShadow: "0 0 25px rgba(0,0,0,0.6)",
    border: "1px solid #222",
  },

  titulo: {
    fontSize: 30,
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },

  pontos: {
    fontSize: 22,
    color: "#4ade80",
    textAlign: "center",
    marginBottom: 25,
  },

  pergunta: {
    fontSize: 18,
    color: "#ddd",
    whiteSpace: "pre-line",
    marginBottom: 20,
    lineHeight: "1.6",
  },

  botao: {
    width: "100%",
    backgroundColor: "#333",
    padding: "14px 18px",
    borderRadius: 10,
    marginBottom: 12,
    border: "1px solid #444",
    color: "white",
    fontSize: 18,
    cursor: "pointer",
    transition: "0.25s",
  },

  feedback: {
    marginTop: 20,
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    transition: "0.3s",
  },

  loading: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 18,
  },
};

// adiciona hover nos botões
styles.botao[":hover"] = {
  backgroundColor: "#444",
};
