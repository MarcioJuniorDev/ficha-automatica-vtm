import { useState } from "react";
import { supabase } from "./supabase";
import CronicaViewer from "./Cronica";

export default function DMPannel() {
  const [nomeCronica, setNomeCronica] = useState("");
  const [senhaCronica, setSenhaCronica] = useState("");

  const [novaCronica, setNovaCronica] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const [cronicaAtual, setCronicaAtual] = useState(null);
  const [fichas, setFichas] = useState([]);
  const [fichaSelecionada, setFichaSelecionada] = useState(null);

  const [paginaCronica, setPaginaCronica] = useState(false);

  async function criarCronica() {
    if (!novaCronica || !novaSenha) {
      alert("Preencha nome e senha.");
      return;
    }

    const { error } = await supabase.from("cronicas").insert([
      {
        nome: novaCronica,
        senha: novaSenha
      }
    ]);

    if (error) {
      console.error(error);
      alert("Erro ao criar crônica.");
      return;
    }

    alert("Crônica criada com sucesso!");
    setNovaCronica("");
    setNovaSenha("");
  }

  async function entrarCronica() {
    const { data, error } = await supabase
      .from("cronicas")
      .select("*")
      .eq("nome", nomeCronica)
      .eq("senha", senhaCronica)
      .single();

    if (error || !data) {
      alert("Crônica não encontrada ou senha incorreta.");
      return;
    }

    setCronicaAtual(data);

    // DEBUG: ver todas as fichas
    const { data: todasFichas, error: fichasError } =
      await supabase.from("fichas").select("*");

    console.log("TODAS AS FICHAS:", todasFichas);

    if (fichasError) {
      console.error(fichasError);
      return;
    }

    const fichasDaCronica = todasFichas.filter(
      (f) => f.data?.infoBasica?.cronica === data.nome
    );

    console.log("FICHAS FILTRADAS:", fichasDaCronica);

    setFichas(fichasDaCronica);
  }

  function sairCronica() {
    setCronicaAtual(null);
    setFichas([]);
    setFichaSelecionada(null);
    setNomeCronica("");
    setSenhaCronica("");
  }

  if (!cronicaAtual) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background:
            "radial-gradient(circle at top, #2b0000 0%, #111 60%)",
          padding: "30px"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
            width: "900px",
            maxWidth: "100%"
          }}
        >
          {/* Entrar */}
          <div
            style={{
              padding: "35px",
              background: "#1b1b1b",
              border: "2px solid #8b0000",
              borderRadius: "18px",
              boxShadow: "0 0 25px rgba(139,0,0,0.35)"
            }}
          >
            <h1 style={{ color: "white", textAlign: "center" }}>
              Painel do Mestre
            </h1>

            <input
              placeholder="Nome da crônica"
              value={nomeCronica}
              onChange={(e) => setNomeCronica(e.target.value)}
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Senha"
              value={senhaCronica}
              onChange={(e) => setSenhaCronica(e.target.value)}
              style={inputStyle}
            />

            <button onClick={entrarCronica} style={redButton}>
              Entrar
            </button>
          </div>

          {/* Criar */}
          <div
            style={{
              padding: "35px",
              background: "#1b1b1b",
              border: "2px solid #006400",
              borderRadius: "18px",
              boxShadow: "0 0 25px rgba(0,100,0,0.35)"
            }}
          >
            <h1 style={{ color: "white", textAlign: "center" }}>
              Criar Crônica
            </h1>

            <input
              placeholder="Nome da crônica"
              value={novaCronica}
              onChange={(e) => setNovaCronica(e.target.value)}
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              style={inputStyle}
            />

            <button onClick={criarCronica} style={greenButton}>
              Criar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "white",
        padding: "20px"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px"
        }}
      >
        <h1>{cronicaAtual.nome}</h1>

        <button onClick={sairCronica} style={redButton}>
          Sair
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "350px 1fr",
          gap: "20px"
        }}
      >
        <div style={panelStyle}>
          <h2>Fichas</h2>

          {fichas.length === 0 && <p>Nenhuma ficha encontrada.</p>}

          {fichas.map((ficha) => (
            <div
              key={ficha.id}
              onClick={() =>
                setFichaSelecionada(
                  fichaSelecionada?.id === ficha.id ? null : ficha
                )
              }
              style={{
                padding: "14px",
                marginBottom: "10px",
                background: "#2b2b2b",
                borderRadius: "10px",
                cursor: "pointer",
                border: "1px solid #444"
              }}
            >
              <strong>{ficha.nome}</strong>
            </div>
          ))}
        </div>

        <div style={panelStyle}>
          {!fichaSelecionada ? (
            <h2>Selecione uma ficha</h2>
          ) : (
            <pre
  style={{
    color: "white",
    whiteSpace: "pre-wrap",
    overflowX: "auto"
  }}
>
  {JSON.stringify(fichaSelecionada.data, null, 2)}
</pre>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #555",
  background: "#2b2b2b",
  color: "white",
  boxSizing: "border-box"
};

const redButton = {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(180deg,#a00000,#650000)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
};

const greenButton = {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(180deg,#008000,#004d00)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
};

const panelStyle = {
  background: "#1b1b1b",
  borderRadius: "12px",
  padding: "20px"
};