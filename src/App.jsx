import React, { useState } from "react";

function TraitDots({ trait, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 8
      }}
    >
      <span>{trait.nome}</span>

      <div>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            onClick={() =>
              onChange({ ...trait, pontos: n })
            }
            style={{ cursor: "pointer" }}
          >
            {n <= trait.pontos ? "●" : "○"}
          </span>
        ))}
      </div>
    </div>
  );
}

function CounterStat({ label, stat, onChange }) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px"
      }}
    >
      <strong>{label}</strong>

      {/* Atual */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={() =>
            stat.atual > 0 &&
            onChange({ ...stat, atual: stat.atual - 1 })
          }
          style={buttonStyle}
        >
          -
        </button>

        <span>{stat.atual}</span>

        <button
          onClick={() =>
            stat.atual < stat.max &&
            onChange({ ...stat, atual: stat.atual + 1 })
          }
          style={buttonStyle}
        >
          +
        </button>
      </div>

      {/* Máximo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={() =>
            stat.max > 1 &&
            onChange({
              ...stat,
              max: stat.max - 1,
              atual: Math.min(stat.atual, stat.max - 1)
            })
          }
          style={buttonStyle}
        >
          - Max
        </button>

        <span>Máx: {stat.max}</span>

        <button
          onClick={() =>
            onChange({
              ...stat,
              max: stat.max + 1
            })
          }
          style={buttonStyle}
        >
          + Max
        </button>
      </div>
    </div>
  );
}

function StatDots({ label, stat, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px"
      }}
    >
      <strong>{label}</strong>

      <div>
        {[...Array(stat.max)].map((_, i) => (
          <span
            key={i}
            onClick={() =>
              onChange({
                ...stat,
                atual: stat.atual === i + 1 ? 0 : i + 1
              })
            }
            style={{
              cursor: "pointer",
              fontSize: "20px",
              marginRight: "3px"
            }}
          >
            {i < stat.atual ? "●" : "○"}
          </span>
        ))}
      </div>

      <span>
        {stat.atual}/{stat.max}
      </span>
    </div>
  );
}

function EditableField({ label, value, onChange, type = "text" }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", marginBottom: 4 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(type === "number" ? Number(e.target.value) : e.target.value)
        }
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 6,
          border: "1px solid #444",
          background: "#333",
          color: "white"
        }}
      />
    </div>
  );
}
function EditableDots({ label, value, onChange, max = 5 }) {
  return (
    <div
      style={{
        marginBottom: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center" // centraliza tudo
      }}
    >
      {/* Texto */}
      <div
        style={{
          marginBottom: 6,
          textAlign: "center",
          minHeight: "20px"
        }}
      >
        {label}
      </div>

      {/* Controles */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px"
        }}
      >
        {/* Botão - */}
        <button
          onClick={() => value > 0 && onChange(value - 1)}
          style={buttonStyle}
        >
          -
        </button>

        {/* Bolinhas */}
        <div
          style={{
            minWidth: "140px",
            textAlign: "center"
          }}
        >
          {[...Array(max)].map((_, i) => {
            const n = i + 1;

            return (
              <span
                key={n}
                onClick={() => onChange(value === n ? 0 : n)}
                style={{
                  cursor: "pointer",
                  fontSize: 22,
                  marginRight: 4
                }}
              >
                {n <= value ? "●" : "○"}
              </span>
            );
          })}
        </div>

        {/* Botão + */}
        <button
          onClick={() => value < max && onChange(value + 1)}
          style={buttonStyle}
        >
          +
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  width: "30px",
  height: "30px",
  border: "none",
  borderRadius: "6px",
  background: "#444",
  color: "white",
  cursor: "pointer",
  fontSize: "18px"
};

const styles = {
  page: {
    background: "#111",
    color: "white",
    minHeight: "100vh",
    padding: 20,
    fontFamily: "Arial",
  },

  card: {
    background: "#222",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },

  sectionTitle: {
    color: "white",
    marginTop: 0
  },

  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    alignItems: "start"
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px"
  },

  doubleColumn: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    alignItems: "start"
  }
};

const infoFields = [
  ["nome", "Nome"],
  ["conceito", "Conceito"],
  ["predador", "Predador"],
  ["cronica", "Crônica"],
  ["ambicao", "Ambição"],
  ["cla", "Clã"],
  ["senhor", "Senhor"],
  ["desejo", "Desejo"],
  ["geracao", "Geração"]
]

const statFields = [
  ["vida", "Vida"],
  ["forcaVontade", "Força de Vontade"],
  ["humanidade", "Humanidade"],
  ["fome", "Fome"],
  ["potencia_sangue", "Potência de Sangue"],
  ["surto_sangue", "Surto de Sangue"],
  ["cura_sangue", "Cura de Sangue"],
  ["poder_bonus", "Poder Bônus"],
  ["re_rolar_fome", "Re-rolar Fome"],
  ["penalidade_alimenticia", "Penalidade Alimentícia"],
  ["severidade_desgraca", "Severidade da Desgraça"],
  ["exp_total", "EXP Total"],
  ["exp_gasta", "EXP Gasta"]
];

const atributosLabels = {
  forca: "Força",
  destreza: "Destreza",
  vigor: "Vigor",
  carisma: "Carisma",
  manipulacao: "Manipulação",
  compostura: "Compostura",
  inteligencia: "Inteligência",
  raciocinio: "Raciocínio",
  determinacao: "Determinação"
};

export default function CharacterSheet() {
  const [infoBasica, setInfoBasica] = useState({
  nome: "",
  conceito: "",
  predador: "",
  cronica: "",
  ambicao: "",
  cla: "",
  senhor: "",
  desejo: "",
  geracao: ""
});

  const [atributos, setAtributos] = useState({
    forca: 1,
    destreza: 1,
    vigor: 1,
    carisma: 1,
    manipulacao: 1,
    compostura: 1,
    inteligencia: 1,
    raciocinio: 1,
    determinacao: 1
  });

  const [stats, setStats] = useState({
  vida: { atual: 0, max: 10 },
  forcaVontade: { atual: 0, max: 10 },
  humanidade: { atual: 0, max: 10 },
  fome: { atual: 0, max: 5 }
});

  const [pericias, setPericias] = useState({
    esportes: 0,
    briga: 0,
    oficios: 0,
    conducao: 0,
    armasDeFogo: 0,
    armasBrancas: 0,
    roubo: 0,
    furtividade: 0,
    sobrevivencia: 0,
    empatiaComAnimais: 0,
    etiqueta: 0,
    intuicao: 0,
    intimidacao: 0,
    lideranca: 0,
    performance: 0,
    persuasao: 0,
    manha: 0,
    labia: 0,
    academicos: 0,
    consciencia: 0,
    financas: 0,
    investigacao: 0,
    medicina: 0,
    ocultismo: 0,
    politica: 0,
    ciencia: 0,
    tecnologia: 0
  });

  const [disciplinas, setDisciplinas] = useState([
    { nome: "", nivel: 0, poderes: "" }
  ]);

  const [lore, setLore] = useState({
    principios: "",
    laços: "",
    convicções: "",
    desgraça: ""
  });

  const [vantagensDefeitos, setVantagensDefeitos] = useState([
  { nome: "", pontos: 0 },
]);

const [blood, setBlood] = useState({
  potencia: 2,
  surto: 0,
  cura: 0,
  bonus: 0,
  reroll: 0,
  penalidade: 0,
  desgraca: 0
});

const [exp, setExp] = useState({
  total: 0,
  gasta: 0
});

const [extras, setExtras] = useState({
  idadeReal: 0,
  idadeAparente: 0,
  nascimento: "",
  morte: "",
  aparencia: "",
  caracteristicas: "",
  preludio: ""
});

  return (
    <div style={styles.page}>
      <h1>Ficha VTM V5</h1>

      <section style={styles.card}>
  <h2 style={styles.sectionTitle}>Informações Básicas</h2>

  <div style={styles.grid3}>
    {infoFields.map(([key, label]) => (
      <EditableField
        key={key}
        label={label}
        value={infoBasica[key]}
        onChange={(value) =>
          setInfoBasica({
            ...infoBasica,
            [key]: value
          })
        }
      />
    ))}
  </div>
</section>

      <section style={styles.card}>
  <h2 style={styles.sectionTitle}>Atributos</h2>

  <div style={styles.grid3}>
    {/* Físicos */}
    <div>
      <h3>Físicos</h3>

      <EditableDots
        label="Força"
        value={atributos.forca}
        onChange={(v) =>
          setAtributos({ ...atributos, forca: v })
        }
      />

      <EditableDots
        label="Destreza"
        value={atributos.destreza}
        onChange={(v) =>
          setAtributos({ ...atributos, destreza: v })
        }
      />

      <EditableDots
        label="Vigor"
        value={atributos.vigor}
        onChange={(v) =>
          setAtributos({ ...atributos, vigor: v })
        }
      />
    </div>

    {/* Sociais */}
    <div>
      <h3>Sociais</h3>

      <EditableDots
        label="Carisma"
        value={atributos.carisma}
        onChange={(v) =>
          setAtributos({ ...atributos, carisma: v })
        }
      />

      <EditableDots
        label="Manipulação"
        value={atributos.manipulacao}
        onChange={(v) =>
          setAtributos({ ...atributos, manipulacao: v })
        }
      />

      <EditableDots
        label="Compostura"
        value={atributos.compostura}
        onChange={(v) =>
          setAtributos({ ...atributos, compostura: v })
        }
      />
    </div>

    {/* Mentais */}
    <div>
      <h3>Mentais</h3>

      <EditableDots
        label="Inteligência"
        value={atributos.inteligencia}
        onChange={(v) =>
          setAtributos({ ...atributos, inteligencia: v })
        }
      />

      <EditableDots
        label="Raciocínio"
        value={atributos.raciocinio}
        onChange={(v) =>
          setAtributos({ ...atributos, raciocinio: v })
        }
      />

      <EditableDots
        label="Determinação"
        value={atributos.determinacao}
        onChange={(v) =>
          setAtributos({ ...atributos, determinacao: v })
        }
      />
    </div>
  </div>
</section>

      <section style={styles.card}>
  <h2 style={styles.sectionTitle}>Stats</h2>

  <div style={styles.statsGrid}>
    <StatDots
      label="Vida"
      stat={stats.vida}
      onChange={(v) => setStats({ ...stats, vida: v })}
    />

    <StatDots
      label="Força de Vontade"
      stat={stats.forcaVontade}
      onChange={(v) =>
        setStats({ ...stats, forcaVontade: v })
      }
    />

    <StatDots
      label="Humanidade"
      stat={stats.humanidade}
      onChange={(v) =>
        setStats({ ...stats, humanidade: v })
      }
    />

    <StatDots
      label="Fome"
      stat={stats.fome}
      onChange={(v) =>
        setStats({ ...stats, fome: v })
      }
    />
  </div>
</section>

      <section style={styles.card}>
  <h2 style={styles.sectionTitle}>Perícias</h2>

  <div style={styles.grid3}>
    {/* Físicas */}
    <div>
      <h3>Físicas</h3>

      <EditableDots
        label="Esportes"
        value={pericias.esportes}
        onChange={(v) => setPericias({ ...pericias, esportes: v })}
      />
      <EditableDots
        label="Briga"
        value={pericias.briga}
        onChange={(v) => setPericias({ ...pericias, briga: v })}
      />
      <EditableDots
        label="Ofícios"
        value={pericias.oficios}
        onChange={(v) => setPericias({ ...pericias, oficios: v })}
      />
      <EditableDots
        label="Condução"
        value={pericias.conducao}
        onChange={(v) => setPericias({ ...pericias, conducao: v })}
      />
      <EditableDots
        label="Armas de Fogo"
        value={pericias.armasDeFogo}
        onChange={(v) => setPericias({ ...pericias, armasDeFogo: v })}
      />
      <EditableDots
        label="Armas Brancas"
        value={pericias.armasBrancas}
        onChange={(v) => setPericias({ ...pericias, armasBrancas: v })}
      />
      <EditableDots
        label="Roubo"
        value={pericias.roubo}
        onChange={(v) => setPericias({ ...pericias, roubo: v })}
      />
      <EditableDots
        label="Furtividade"
        value={pericias.furtividade}
        onChange={(v) => setPericias({ ...pericias, furtividade: v })}
      />
      <EditableDots
        label="Sobrevivência"
        value={pericias.sobrevivencia}
        onChange={(v) => setPericias({ ...pericias, sobrevivencia: v })}
      />
    </div>

    {/* Sociais */}
    <div>
      <h3>Sociais</h3>

      <EditableDots
        label="Empatia c/ Animais"
        value={pericias.empatiaComAnimais}
        onChange={(v) => setPericias({ ...pericias, empatiaComAnimais: v })}
      />
      <EditableDots
        label="Etiqueta"
        value={pericias.etiqueta}
        onChange={(v) => setPericias({ ...pericias, etiqueta: v })}
      />
      <EditableDots
        label="Intuição"
        value={pericias.intuicao}
        onChange={(v) => setPericias({ ...pericias, intuicao: v })}
      />
      <EditableDots
        label="Intimidação"
        value={pericias.intimidacao}
        onChange={(v) => setPericias({ ...pericias, intimidacao: v })}
      />
      <EditableDots
        label="Liderança"
        value={pericias.lideranca}
        onChange={(v) => setPericias({ ...pericias, lideranca: v })}
      />
      <EditableDots
        label="Performance"
        value={pericias.performance}
        onChange={(v) => setPericias({ ...pericias, performance: v })}
      />
      <EditableDots
        label="Persuasão"
        value={pericias.persuasao}
        onChange={(v) => setPericias({ ...pericias, persuasao: v })}
      />
      <EditableDots
        label="Manha"
        value={pericias.manha}
        onChange={(v) => setPericias({ ...pericias, manha: v })}
      />
      <EditableDots
        label="Lábia"
        value={pericias.labia}
        onChange={(v) => setPericias({ ...pericias, labia: v })}
      />
    </div>

    {/* Mentais */}
    <div>
      <h3>Mentais</h3>

      <EditableDots
        label="Acadêmicos"
        value={pericias.academicos}
        onChange={(v) => setPericias({ ...pericias, academicos: v })}
      />
      <EditableDots
        label="Consciência"
        value={pericias.consciencia}
        onChange={(v) => setPericias({ ...pericias, consciencia: v })}
      />
      <EditableDots
        label="Finanças"
        value={pericias.financas}
        onChange={(v) => setPericias({ ...pericias, financas: v })}
      />
      <EditableDots
        label="Investigação"
        value={pericias.investigacao}
        onChange={(v) => setPericias({ ...pericias, investigacao: v })}
      />
      <EditableDots
        label="Medicina"
        value={pericias.medicina}
        onChange={(v) => setPericias({ ...pericias, medicina: v })}
      />
      <EditableDots
        label="Ocultismo"
        value={pericias.ocultismo}
        onChange={(v) => setPericias({ ...pericias, ocultismo: v })}
      />
      <EditableDots
        label="Política"
        value={pericias.politica}
        onChange={(v) => setPericias({ ...pericias, politica: v })}
      />
      <EditableDots
        label="Ciência"
        value={pericias.ciencia}
        onChange={(v) => setPericias({ ...pericias, ciencia: v })}
      />
      <EditableDots
        label="Tecnologia"
        value={pericias.tecnologia}
        onChange={(v) => setPericias({ ...pericias, tecnologia: v })}
      />
    </div>
  </div>
</section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Disciplinas</h2>
        {disciplinas.map((disc, index) => (
  <div
    key={index}
    style={{
      marginBottom: "20px",
      padding: "15px",
      border: "1px solid #444",
      borderRadius: "8px"
    }}
  >
    <EditableField
      label="Nome"
      value={disc.nome}
      onChange={(value) => {
        const copy = [...disciplinas];
        copy[index].nome = value;
        setDisciplinas(copy);
      }}
    />

    <EditableDots
      label="Nível"
      value={disc.nivel}
      onChange={(value) => {
        const copy = [...disciplinas];
        copy[index].nivel = value;
        setDisciplinas(copy);
      }}
    />

    <EditableField
      label="Poderes"
      value={disc.poderes}
      onChange={(value) => {
        const copy = [...disciplinas];
        copy[index].poderes = value;
        setDisciplinas(copy);
      }}
    />

      <button
          onClick={() =>
            setDisciplinas([
              ...disciplinas,
              { nome: "", nivel: 0, poderes: "" }
            ])
          }

          style={{
        marginTop: "10px",
        padding: "8px 12px",
        background: "#028b00",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
      }}
        >
          + Disciplina
        </button>

    <button
      disabled={disciplinas.length === 1}
      onClick={() =>
      setDisciplinas(
      disciplinas.filter((_, i) => i !== index)
        )
      }
      style={{
        marginTop: "10px",
        padding: "8px 12px",
        background: "#8b0000",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
      }}
    >
      - Disciplina
    </button>
  </div>
))}
      </section>
<div style={styles.doubleColumn}>
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Lore</h2>
        {Object.entries(lore).map(([key, value]) => (
          <EditableField
            key={key}
            label={key}
            value={value}
            onChange={(v) =>
              setLore({ ...lore, [key]: v })
            }
          />
        ))}
      </section>

      <section style={styles.card}>
  <h2 style={styles.sectionTitle}>Potência de Sangue</h2>

  <StatDots
    label="Potência"
    stat={{ atual: blood.potencia, max: 10 }}
    onChange={(v) =>
      setBlood({ ...blood, potencia: v.atual })
    }
  />

  <EditableField
    label="Surto de Sangue"
    type="number"
    value={blood.surto}
    onChange={(v) => setBlood({ ...blood, surto: v })}
  />

  <EditableField
    label="Cura por Sangue"
    type="number"
    value={blood.cura}
    onChange={(v) => setBlood({ ...blood, cura: v })}
  />
</section>
</div>

<div style={styles.doubleColumn}>
<section style={styles.card}>
  <h2 style={styles.sectionTitle}>Experiência</h2>

  <EditableField
    label="EXP Total"
    type="number"
    value={exp.total}
    onChange={(v) => setExp({ ...exp, total: v })}
  />

  <EditableField
    label="EXP Gasta"
    type="number"
    value={exp.gasta}
    onChange={(v) => setExp({ ...exp, gasta: v })}
  />
</section>

<section style={styles.card}>
  <h2 style={styles.sectionTitle}>Detalhes</h2>

  <EditableField
    label="Idade Verdadeira"
    value={extras.idadeReal}
    onChange={(v) =>
      setExtras({ ...extras, idadeReal: v })
    }
  />

  <EditableField
    label="Aparência"
    value={extras.aparencia}
    onChange={(v) =>
      setExtras({ ...extras, aparencia: v })
    }
  />
</section>
</div>
    </div>
  );
}