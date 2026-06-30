import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function CronicaViewer({ cronica, onVoltar }) {
    const [fichas, setFichas] = useState([]);
    const [fichaSelecionada, setFichaSelecionada] = useState(null);

    useEffect(() => {
        carregarFichas();
    }, []);

    async function carregarFichas() {
        const { data, error } = await supabase
            .from("fichas")
            .select("*");

        if (error) {
            console.error(error);
            alert("Erro ao carregar fichas");
            return;
        }

        const fichasDaCronica = (data || []).filter(
            (ficha) =>
                ficha.data?.infoBasica?.cronica?.trim().toLowerCase() ===
                cronica.nome.trim().toLowerCase()
        );

        setFichas(fichasDaCronica);

        if (fichasDaCronica.length > 0) {
            setFichaSelecionada(fichasDaCronica[0]);
        }
    }
console.log(fichas);
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
                    marginBottom: "20px"
                }}
            >
                <h1>{cronica.nome}</h1>

                <button
                    onClick={onVoltar}
                    style={{
                        padding: "10px 20px",
                        background: "#8b0000",
                        color: "white",
                        border: "none",
                        borderRadius: "8px"
                    }}
                >
                    Voltar
                </button>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "350px 1fr",
                    gap: "20px"
                }}
            >
                {/* Lista */}
                <div
                    style={{
                        background: "#1b1b1b",
                        padding: "20px",
                        borderRadius: "12px"
                    }}
                >
                    <h2>Fichas</h2>

                    {fichas.map((ficha) => (
                        <div
                            key={ficha.id}
                            onClick={() => setFichaSelecionada(ficha)}
                            style={{
                                padding: "12px",
                                marginBottom: "10px",
                                background: "#2b2b2b",
                                borderRadius: "10px",
                                cursor: "pointer"
                            }}
                        >
                            {ficha.data?.infoBasica?.nome || ficha.nome}
                        </div>
                    ))}
                </div>

                {/* Detalhes */}
                <div
                    style={{
                        background: "#1b1b1b",
                        padding: "20px",
                        borderRadius: "12px"
                    }}
                >
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