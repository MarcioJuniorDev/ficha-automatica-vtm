import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

function EditableField({
  label,
  value,
  onChange,
  type = "text",
  options = [],
  rightElement = null
}) {
  const sharedStyle = {
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "1px solid #444",
    background: "#333",
    color: "white",
    textAlign: "center"
  };

  const field =
    type === "select" ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={sharedStyle}
      >
        <option value="">Selecione...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ) : (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={1}
        style={{ ...sharedStyle, resize: "vertical" }}
      />
    );

  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", marginBottom: 4 }}>
        {label}
      </label>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <div style={{ flex: 1 }}>{field}</div>
        {rightElement}
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

function StatDots({ label, stat, onChange, reverse = false }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        width: "100%"
      }}
    >
      <strong style={{ textAlign: "center", minHeight: "40px" }}>
        {label}
      </strong>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <button
          onClick={() =>
            stat.atual > 0 &&
            onChange({
              ...stat,
              atual: stat.atual - 1
            })
          }
          style={buttonStyle}
        >
          -
        </button>

        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: reverse ? "row-reverse" : "row"
          }}
        >
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
                marginRight: reverse ? "0px" : "3px",
                marginLeft: reverse ? "3px" : "0px"
              }}
            >
              {i < stat.atual ? "●" : "○"}
            </span>
          ))}
        </div>

        <button
          onClick={() =>
            stat.atual < stat.max &&
            onChange({
              ...stat,
              atual: stat.atual + 1
            })
          }
          style={buttonStyle}
        >
          +
        </button>
      </div>

      <span>
        {stat.atual}/{stat.max}
      </span>
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

  twoColumns: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start"
  },

  column: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  }
};

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

  function getValorCaracteristica(nome) {
    if (nome in atributos) {
      return atributos[nome];
    }

    if (nome in pericias) {
      return pericias[nome];
    }

    return 0;
  }

  const [usouSurtoSangue, setUsouSurtoSangue] = useState(false);

  function usarSurtoDeSangue() {
    const msgSurto = fnRolarDado(1, "CS");
    setUsouSurtoSangue(true);

    const valor1 = getValorCaracteristica(carac1);
    const valor2 = getValorCaracteristica(carac2);

    let totalDados = valor1 + valor2 + modificador + blood.surto;

    const msgTeste = fnRolarDado(totalDados, "TS");

    setAlertMessage(
      `${msgSurto}\n\nTeste:\n${msgTeste}`
    );
    adicionarHistorico(carac1 + " + " + carac2 + "\n" + `${msgSurto}\n\nTeste:\n${msgTeste}`);
  }

  function fazerTeste() {
    const valor1 = getValorCaracteristica(carac1);
    const valor2 = getValorCaracteristica(carac2);

    let totalDados = valor1 + valor2 + modificador;

    if (usouSurtoSangue) {
      totalDados += blood.surto;
      setUsouSurtoSangue(false);
    }

    fnRolarDado(totalDados, "TS");
    setPodeRerrolar(true);
  }

  function StatBar({
    label,
    max,
    superficial,
    agravado,
    onSupChange,
    onAgrChange
  }) {
    return (
      <div style={{ marginBottom: "25px", width: "100%" }}>
        <strong style={{ fontSize: "18px" }}>
          {label} ({max})
        </strong>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${max}, 1fr)`,
            gap: "4px",
            marginTop: "10px",
            marginBottom: "15px"
          }}
        >
          {[...Array(max)].map((_, i) => {
            let bg = "#222";

            if (i < agravado) {
              bg = "#111";
            } else if (i < agravado + superficial) {
              bg = "#8b0000";
            }

            return (
              <div
                key={i}
                style={{
                  height: "28px",
                  borderRadius: "4px",
                  border: "1px solid #555",
                  background: bg
                }}
              />
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <div>
            <span>Superficial: {superficial}</span>
            <div>
              <button onClick={() => onSupChange(superficial - 1)}>-</button>
              <button onClick={() => onSupChange(superficial + 1)}>+</button>
            </div>
          </div>

          <div>
            <span>Agravado: {agravado}</span>
            <div>
              <button onClick={() => onAgrChange(agravado - 1)}>-</button>
              <button onClick={() => onAgrChange(agravado + 1)}>+</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function adicionarHistorico(texto) {
    setHistoricoRolagens((prev) =>
      [
        { id: Date.now(), texto },
        ...prev
      ].slice(0, 20)
    );
  }

  function fnRolarDado(dices, type) {
    let roll;
    let success = 0;
    let dicesRolled = 0;
    const results = [];

    if (dices <= 0) {
      dices = 1;
    }

    while (dicesRolled < dices) {
      const roll = Math.floor(Math.random() * 10) + 1;
      results.push(roll);
      dicesRolled++;
    }

    switch (type) {
      case "CS":
        roll = results[0];
        success = roll > 5;

        if (!success) {
          setStats({
            ...stats,
            fome: {
              ...stats.fome,
              atual: Math.min(stats.fome.atual + 1, stats.fome.max)
            }
          });
        }

        return (
          success
            ? `Sucesso. (${roll})`
            : `Falha. (${roll}) (fome aumentada)`
        );

        setAlertMessage(
          success
            ? `Sucesso. (${roll})`
            : `Falha. (${roll})`
        );
        break;

      case "TR":
        for (let i = 0; i < results.length; i++) {
          if (results[i] > 5) {
            success++;
          }
        }

        if (success > 0) {
          // Remove todas as máculas
          setStats({
            ...stats,
            maculas: {
              ...stats.maculas,
              atual: 0
            }
          });

          setAlertMessage(
            `Remorso sentido: ${success} sucesso(s). Máculas removidas.`
          );
        } else {
          // Perde 1 humanidade e remove máculas
          setStats({
            ...stats,
            humanidade: {
              ...stats.humanidade,
              atual: Math.max(stats.humanidade.atual - 1, 0)
            },
            maculas: {
              ...stats.maculas,
              atual: 0
            }
          });

          setAlertMessage(
            "A Besta venceu. -1 Humanidade e Máculas removidas."
          );
        }
        break;

      case "TS":
        let tens = 0;
        let hungerTens = 0;
        let hungerOnes = 0;

        const hungerDice = stats.fome.atual;
        let normalResults = results.slice(0, results.length - hungerDice);
        const hungerResults = results.slice(results.length - hungerDice);

        // Salva para rerrolagem posterior
        setLastNormalRoll(normalResults);
        setLastHungerRoll(hungerResults);

        for (let i = 0; i < results.length; i++) {
          const roll = results[i];
          const isHungerDie = i >= results.length - hungerDice;

          if (roll > 5) success++;

          if (roll === 10) {
            tens++;
            if (isHungerDie) hungerTens++;
          }

          if (roll === 1 && isHungerDie) {
            hungerOnes++;
          }
        }

        success += Math.floor(tens / 2) * 2;

        let msg =
          `${success} sucesso(s)\n` +
          `Normais: [${normalResults.join(", ")}]\n` +
          `Fome: [${hungerResults.join(", ")}]`;

        const hasCritical = tens >= 2;
        const isMessyCritical = hasCritical && hungerTens > 0;
        const isBestialFailure = success === 0 && hungerOnes > 0;

        if (isMessyCritical) msg += "\nCRÍTICO BESTIAL!";
        else if (isBestialFailure) msg += "\nFALHA BESTIAL!";

        setAlertMessage(msg);
        adicionarHistorico(carac1 + " + " + carac2 + "\n" + msg);
        return msg;
        break;
    }

    console.log(results);
  }

  const [lastNormalRoll, setLastNormalRoll] = useState([]);
  const [lastHungerRoll, setLastHungerRoll] = useState([]);

  function rerrolarForcaVontade() {
    const danoTotalFW =
      stats.danoSupF.atual + stats.danoAgrF.atual;

    if (danoTotalFW >= stats.forcaVontade.max) {
      setAlertMessage(
        "Sem Força de Vontade disponível para rerrolar."
      );
      setPodeRerrolar(false);
      return;
    }

    let rerolled = [...lastNormalRoll];
    let rerolls = 0;

    for (let i = 0; i < rerolled.length; i++) {
      if (rerolled[i] < 6 && rerolls < 3) {
        rerolled[i] = Math.floor(Math.random() * 10) + 1;
        rerolls++;
      }
    }

    setLastNormalRoll(rerolled);

    setStats({
      ...stats,
      danoSupF: {
        ...stats.danoSupF,
        atual: Math.min(
          stats.danoSupF.atual + 1,
          stats.forcaVontade.max - stats.danoAgrF.atual
        )
      }
    });

    const combined = [...rerolled, ...lastHungerRoll];
    fnRecalcularTeste(combined);
    setPodeRerrolar(false);
  }

  function fnRecalcularTeste(results) {
    let success = 0;
    let tens = 0;
    let hungerTens = 0;
    let hungerOnes = 0;

    const hungerDice = stats.fome.atual;
    const normalResults = results.slice(0, results.length - hungerDice);
    const hungerResults = results.slice(results.length - hungerDice);

    for (let i = 0; i < results.length; i++) {
      const roll = results[i];
      const isHungerDie = i >= results.length - hungerDice;

      if (roll > 5) success++;

      if (roll === 10) {
        tens++;
        if (isHungerDie) hungerTens++;
      }

      if (roll === 1 && isHungerDie) {
        hungerOnes++;
      }
    }

    success += Math.floor(tens / 2) * 2;

    let msg =
      `RERROLAGEM\n` +
      `${success} sucesso(s)\n` +
      `Normais: [${normalResults.join(", ")}]\n` +
      `Fome: [${hungerResults.join(", ")}]`;

    const hasCritical = tens >= 2;
    const isMessyCritical = hasCritical && hungerTens > 0;
    const isBestialFailure = success === 0 && hungerOnes > 0;

    if (isMessyCritical) msg += "\nCRÍTICO BESTIAL!";
    else if (isBestialFailure) msg += "\nFALHA BESTIAL!";

    setAlertMessage(msg);
    adicionarHistorico(carac1 + " + " + carac2 + "\n" + msg);
  }

  const clans = [
    "Brujah",
    "Gangrel",
    "Malkavianos",
    "Nosferatu",
    "Toreador",
    "Tremere",
    "Ventrue",
    "Caitiff",
    "Sangue-ralo"
  ];

  const disciplinasTodas = [
    {
      nome: "Animalismo",
      descricao: "Alcunhas: Doolittlear, Domar, Bestiae Sermo\nTalvez os vampiros tenham mais em comum com os animais do que com os humanos. Um perigoso conjunto de instintos os governa, e custa muito para que consigam controlar o impulso de simplesmente atacar.\nAssim como um cão selvagem acorrentado, a Besta de um vampiro jamais se deixa domar de fato.\nAlguns Membros encontram um modo de se tornarem um com suas Bestas. Aqueles que o fazem se tornam os mestres do Animalismo. Muitos acompanham o uso deste poder com uivos, rosnados, urros ou se comunicam com animais na 'língua' dos animais, embora isto seja uma afetação e não uma necessidade.\nA Disciplina Animalismo é muito usada entre vampiros que têm dificuldades de adaptação ou não gostam de viver entre os mortais. Muitas vezes classificada como um dos dons utilitários de Caim, permitindo que um vampiro sobreviva de sangue bruto ou faça amizade com seres irracionais, ela também é uma arma devastadora contra vampiros que escalam suas torres, e inquisidores que supôem que seus inimigos só andam sobre suas pernas. Um bando de ratos sedentos de sangue que invade a cobertura-refúgio de um Membro, o vampiro especialista em Animalismo que intimida a Besta do Xerife no Elísio ou o corvo com olhos vidrados que espia um capítulo da Sociedade de São Leopoldo — todos esses servem para fortalecer praticantes de Animalismo e enfraquecer seus inimigos.\n\nCaracterísticas\nNormalmente, os poderes de Animalismo que envolvem animais só podem ser usados em vertebrados. Além disso, qualquer uso do poder em herbívoros soma um à Dificuldade das rolagens de Habilidades envolvidas.\nTipo: Mental\nAmeaça à Máscara: Baixa para média. Apesar de conversar com animais parecer excêntrico, somente as aplicações mais violentas da Disciplina resultam em mais do que sobrancelhas erguidas.\nRessonância de Sangue: Sangue animal, preferivelmente selvagem.",
      poderes: [
        {
          nome: "NÍVEL 1 - FAMULUS ENLAÇADO",
          descricao: "Ao Enlaçar um animal, o vampiro pode transformá-lo em um famulus, o que cria um vínculo mental com ele e facilita o uso de outros poderes de Animalismo. Apesar de este poder sozinho não permitir a comunicação em mão dupla com o animal, este pode seguir instruções verbais simples como “parado” e “venha aqui”. O animal ataca para defender a si e ao seu mestre, mas não pode ser persuadido a lutar contra algo que normalmente ele não atacaria.\nParada de Dados:Carisma + Empatia com Animais\nCusto: O animal deve ser alimentado com o Sangue do usuário em três noites distintas, cada qual exigindo uma Checagem de Sangue do usuário. A quantidade de Sangue necessária para sustentar o estado de carniçal do animal após isso é insignificante. Jogadores que iniciam com este poder já completaram esse processo e podem escolher um famulus à vontade.\nSistema: Sem o uso de Sussurros Selvagens, abaixo, dar ordens ao animal requer uma rolagem de Carisma + Empatia com Animais (Dificuldade 2); aumente essa dificuldade no caso de ordens mais complexas. Um vampiro só pode ter um famulus; entretanto, pode conseguir um novo se o atual morrer. Um vampiro pode usar Sussurros Selvagens (Animalismo 2) e Comunhão de Espíritos (Animalismo 4) em seu famulus sem custo.\nDuração: Somente a morte liberta um famulus uma vez enlaçado. Enquanto receber Sangue vampírico regularmente, o famulus não envelhecerá."
        },
        {
          nome: "NÍVEL 1 - SENTIR A BESTA",
          descricao: "O vampiro pode sentir a Besta presente em mortais, vampiros e outros seres sobrenaturais, o que lhe confere uma noção da natureza, fome e hostilidade desses seres.\nCusto: Gratuito\nParada de Dados: Determinação + Animalismo vs. Autocontrole + Subterfúgio\nSistema: Uma vitória permite que o usuário sinta o nível de hostilidade do alvo (se este está pronto para fazer mal ou determinado a causá-lo) e determine se ele abriga uma Besta sobrenatural, descobrindo se se trata de um vampiro ou de outro tipo de criatura sobrenatural. Em caso de vitória, um crítico confere ao usuário informações sobre o tipo exato de criatura (por exemplo, um lobisomem), assim como sobre seu nível de Fome (ou equivalente) e Ressonância.\nEste poder pode ser usado tanto ativa quanto passivamente, avisando o usuário sobre intenções agressivas em suas imediações.\nDuração: Passiva."
        },
        {
          nome: "NÍVEL 2 - SUSSURROS SELVAGENS",
          descricao: "O vampiro pode entrar em comunhão tanto com as feras dos ermos quanto com as da cidade.\nSussurros Selvagens permite a comunicação em mão dupla com animais. Um gato pode não estar interessado em debater o uso da cor por Tarsila do Amaral, mas discutiria alegremente a falta de presas nas cercanias do edifício marrom do outro lado da rua. Dependendo da perícia do vampiro, ele pode até persuadir animais a prestarem serviços; como humanos, os animais raramente concordam com propostas que vão contra a sua natureza ou os coloquem em perigo.\nVampiros também podem usar Sussurros Selvagens para convocar determinado tipo de animal (veja as limitações do Animalismo, acima), porém os animais devem estar presentes para responder. Nada impede um vampiro de tentar convocar uma orca no Parque do Ibirapuera, mas com baixíssimas chances de sucesso. Animais convocados escutam o que o convocador tem a dizer, mas se dispersam ou atacam quando ameaçados.\nParadas de Dados: Manipulação + Animalismo, Carisma + Animalismo\nCusto: Uma Checagem de Sangue por tipo de animal escolhido para a cena. Permite uma convocação e comunicação ilimitada. Não tem custo quando usado em um famulus.\nSistema: Comunicar ideias simples não requer nenhum teste. Persuadir um animal a prestar um serviço requer uma rolagem de Manipulação + Animalismo; a Dificuldade depende da tarefa dada. Pedir a um pássaro que fique de olho em qualquer um que adentre o parque à noite tem Dificuldade 3, enquanto ordenar que qualquer animal defenda um local com a própria vida tem Dificuldade 6.\nConvocar animais usa uma rolagem de Carisma + Animalismo; a Dificuldade depende da escassez dos animais convocados. A quantidade de animais convocados depende da margem de sucesso; uma vitória crítica convoca a maioria, senão todos, os animais do tipo na região.\nDuração: Uma cena."
        },
        {
          nome: "NÍVEL 3 - ENXAME NÃO VIVO",
          descricao: "Amálgama: Ofuscação 2\n\nGeralmente visto entre os Nosferatu, este poder perturbador permite que seu usuário estenda sua influência animal a enxames de insetos, como moscas ou baratas. Certos vampiros chegam ao ponto de adotar enxames como famuli (plural de famulus), dando-lhes um lar permanente no interior das dobras e orifícios da sua carne deformada.\nCusto: Nenhum custo adicional\nSistema: Este poder estende todos os poderes anteriores restritos a vertebrados a enxames de insetos, tratando um enxame como uma única criatura. Um vampiro pode Enlaçar o enxame como a um famulus, e alguns usuários até conferem ao enxame a capacidade de se aninhar dentro das cavidades dos seus corpos. Isto oculta o enxame da vista ao mesmo tempo que permite que sugue as quantidades ínfimas de Sangue de que precisa para se sustentar indefinidamente. Enquanto estiver aninhado, o enxame só pode ser detectado por raios-X.\nEnxames causam pouco dano em combate. Eles têm Vitalidade 5 e uma parada de 8 dados para resistir a ataques. Enxames sofrem dano Superficial de Briga; fogo e inseticida causam dano Agravado. Vampiros podem usar enxames para espiar, como distrações (resultando em uma penalidade de dois dados a qualquer rolagem de um único indivíduo envolto pelo enxame), ou para intimidar mortais (adicione entre um e três dados a paradas de Intimidação, dependendo do tipo de inseto e das fobias da vítima). Tanto jogadores quanto Narradores podem, sem dúvida, imaginar usos ainda mais criativos para este poder.\nDuração: Passiva."
        },
        {
          nome: "NÍVEL 3 - SUBJUGAR A BESTA",
          descricao: "Ao encarar um alvo olho no olho, o vampiro intimida a Besta dele, fazendo com que ela adormeça temporariamente. Mortais assim afetados ficam apáticos, incapazes de realizar quaisquer ações, exceto proteger suas vidas, enquanto os impulsos bestiais de um vampiro diminuem temporariamente, para o bem ou para o mal.\nCusto: Uma Checagem de Sangue\nParadas de Dados: Carisma + Animalismo vs. Vigor + Determinação\nSistema: Role Carisma + Animalismo vs. Vigor + Determinação. Uma vitória contra um alvo mortal o incapacita naquela cena, causando letargia grave. Ele só pode agir para se autopreservar, e não contra o usuário ou qualquer outro indivíduo. Uma vitória contra um vampiro o impede de realizar Surtos de Sangue. Enquanto sua Besta estiver subjugada, um vampiro fica imune a críticos bestiais. Contra vampiros, este poder dura um turno, mais um número de turnos igual à margem de vitória obtida na disputa. Uma vitória crítica contra um vampiro também encerra seu frenesi.\nDuração: Uma cena ou uma quantidade de turnos igual à margem do teste, mais um."
        },
        {
          nome: "NÍVEL 3 - SUCULÊNCIA ANIMAL",
          descricao: "O vampiro pode saciar Fome adicional ao se alimentar de animais. Ele também pode consumir seu famulus, com isso ganhando muito mais sustento do que conseguiria de um animal de constituição similar e absorvendo um pouco da sua característica primária.\nCusto: Gratuito\nSistema: Alimentar-se de animais sacia 1 nível adicional de Fome, e o vampiro conta sua Potência de Sangue como dois níveis abaixo no que tange à penalidade por saciar a Fome com sangue animal.\nConsumir o próprio famulus sacia 4 de Fome, independentemente do tamanho do animal. Esse ato nunca remove o último dado de Fome. Além disso, consumir o próprio famulus aumenta o Atributo do vampiro mais associado com aquele animal (conforme determinado pelo Narrador) em 2 pontos. Consumir um gato poderia aumentar Destreza ou Autocontrole; consumir um cachorro poderia aumentar Carisma ou Determinação Narradores podem variar a recompensa pelo consumo de um famulus: drenar uma coruja poderia aumentar o Atributo que compôe qualquer parada de percepção em dois pontos, ou fazê-lo em paradas que envolvem em sabedoria. O bônus dura até a próxima alimentação do vampiro ou até sua Fome alcançar 5.\nDuração: Passiva."
        },
        {
          nome: "NÍVEL 4 - COMUNHÃO DE ESPÍRITOS",
          descricao: "O vampiro pode transferir completamente sua mente para o corpo de um animal. Ele pode controlar o animal e usar seus sentidos livremente, mesmo durante o dia, caso consiga permanecer acordado. Enquanto faz isso, o corpo do vampiro fica imóvel, como se estivesse em Torpor.\nCusto: Uma Checagem de Sangue. Gratuito se usado no famulus do usuário.\nParada de Dados: Manipulação + Animalismo\nSistema: Faça um teste de Manipulação + Animalismo, Dificuldade 4. Em caso de vitória, o vampiro pode habitar o corpo do animal por uma cena. No caso de uma vitória crítica, o vampiro pode habitar o animal indefinidamente.\nEstender esta possessão para as horas diurnas requer que o vampiro fique acordado (pág. 219); ver o sol exige um teste para frenesi de terror, embora a luz solar não cause dano ao animal possuído. O usuário abstrai seu corpo original, mas dano ao corpo tira o usuário do transe e liberta o animal. A morte deste último também encerra o transe, causando ainda 1 ponto de dano Agravado à Força de Vontade do usuário devido ao choque.\nDuração: Uma cena / indefinidamente (veja acima)."
        },
        {
          nome: "NÍVEL 5 - CONTROLE ANIMAL",
          descricao: "O poder que o vampiro detém sobre feras cresceu a um ponto em que ele pode comandar bandos como se fossem extensões do seu próprio corpo. Com um gesto, animais sacrificam suas vidas às dúzias, até às centenas, para apaziguar seu mestre.\nCusto: Duas Checagens de Sangue.\nParada de Dados: Carisma + Animalismo\nSistema: Escolha um tipo de animal e faça uma rolagem de Carisma + Animalismo com uma Dificuldade determinada pela natureza dos animais e pela ordem dada. Fazer com que um bando de corvos procure um indivíduo específico (com meios para identificá-lo) é relativamente fácil (Dificuldade 3), porém, fazer com que os cães de uma matilha sacrifiquem suas vidas em um ataque suicida contra outro vampiro é mais desafiador (Dificuldade 5).\nO poder não permite que seu usuário convoque animais, contudo obriga aqueles presentes a obedecerem. O vampiro pode ordenar que os animais retornem após completarem a tarefa, caso tenham meios para fazê-lo.\nDuração: Uma única cena ou até a ordem ser cumprida, o que for mais rápida."
        },
        {
          nome: "NÍVEL 5 - EXPULSAR A BESTA",
          descricao: "Em um momento de terror ou frenesi de fúria, o vampiro pode projetar sua Besta, transferindo-a para um alvo (mortal ou vampiro) próximo. Este experimenta imediatamente o frenesi no lugar do usuário da Disciplina, entrando em um ataque de ira implacável ou fugindo em pânico, dependendo do gatilho.\nCusto: Uma Checagem de Sangue\nParadas de Dados: Raciocínio + Animalismo vs. Autocontrole + Determinação\nSistema: No lugar de uma rolagem de Força de Vontade para resistir a um frenesi de terror ou fúria, role Raciocínio + Animalismo vs. Autocontrole + Determinação do alvo. Se o usuário falhar, ele entra em frenesi como se tivesse falhado na rolagem de Força de Vontade. Em caso de sucesso, o alvo experimenta o frenesi no lugar do usuário. Estímulos posteriores ainda podem provocar um frenesi no usuário que, no entanto, pode usar este poder enquanto puder realizar Checagens de Sangue e tiver alvos à disposição.\nEste poder não pode transferir um frenesi de Fome.\nDuração: A duração do frenesi (consulte a pág. 220)."
        }
      ]
    },
    {
      nome: "Auspícios",
      descricao: "",
      poderes: [
        {
          nome: "NÍVEL 1 - SENTIDOS AGUÇADOS",
          descricao: ""
        },
        {
          nome: "NÍVEL 1 - SENTIR O INVISÍVEL",
          descricao: ""
        },

        {
          nome: "NÍVEL 2 - PREMONIÇÃO",
          descricao: ""
        },

        {
          nome: "NÍVEL 3 - COMPARTILHAR OS SENTIDOS",
          descricao: ""
        },

        {
          nome: "NÍVEL 3 - PERSCRUTAR A ALMA",
          descricao: ""
        },

        {
          nome: "NÍVEL 4 - TOQUE DO ESPÍRITO",
          descricao: ""
        },

        {
          nome: "NÍVEL 5 - CLARIVIDÊNCIA",
          descricao: ""
        },

        {
          nome: "NÍVEL 5 - POSSESSÃO",
          descricao: ""
        },

        {
          nome: "NÍVEL 5 - TELEPATIA",
          descricao: ""
        }
      ]
    },
    {
      nome: "Celeridade",
      descricao: "",
      poderes: [
        {
          nome: "NÍVEL 1 - GRAÇA FELINA",
          descricao: ""
        },
        {
          nome: "NÍVEL 1 - REFLEXOS RÁPIDOS",
          descricao: ""
        },

        {
          nome: "NÍVEL 2 - RAPIDEZ",
          descricao: ""
        },

        {
          nome: "NÍVEL 3 - PISCADELA",
          descricao: ""
        },

        {
          nome: "NÍVEL 3 - TRAVESSIA",
          descricao: ""
        },

        {
          nome: "NÍVEL 4 - ELEGÂNCIA DIRETO DA FONTE",
          descricao: ""
        },

        {
          nome: "NÍVEL 4 - MIRA INFALÍVEL",
          descricao: ""
        },

        {
          nome: "NÍVEL 5 - FRAÇÃO DE SEGUNDO",
          descricao: ""
        },

        {
          nome: "NÍVEL 5 - GOLPE RELÂMPAGO",
          descricao: ""
        }
      ]
    },
    {
      nome: "Dominação",
      descricao: "",
      poderes: [
        {
          nome: "NÍVEL 1 - COMPELIR",
          descricao: ""
        },
        {
          nome: "NÍVEL 1 - NUBLAR MEMÓRIA",
          descricao: ""
        },
        {
          nome: "NÍVEL 2 - DEMENTAÇÃO",
          descricao: ""
        },
        {
          nome: "NÍVEL 2 - MESMERISMO",
          descricao: ""
        },
        {
          nome: "NÍVEL 3 - DIRETRIZ SUBMERSA",
          descricao: ""
        },
        {
          nome: "NÍVEL 3 - A MENTE ESQUECIDA",
          descricao: ""
        },
        {
          nome: "NÍVEL 4 - RACIONALIZAR",
          descricao: ""
        },
        {
          nome: "NÍVEL 5 - DECRETO TERMINAL",
          descricao: ""
        },
        {
          nome: "NÍVEL 5 - MANIPULAÇÃO EM MASSA",
          descricao: ""
        }
      ]
    },
    {
      nome: "Fortitude",
      descricao: "",
      poderes: [
        {
          nome: "NÍVEL 1 - MENTE INESCRUTÁVEL",
          descricao: ""
        },
        {
          nome: "NÍVEL 1 - RESILIÊNCIA",
          descricao: ""
        },
        {
          nome: "NÍVEL 2 - FERAS TENAZES",
          descricao: ""
        },
        {
          nome: "NÍEL 2 - TENACIDADE",
          descricao: ""
        },
        {
          nome: "NÍVEL 3 - DESAFIO À PERDIÇÃO",
          descricao: ""
        },
        {
          nome: "NÍVEL 3 - FORTIFICAR A FACHADA INTERIOR",
          descricao: ""
        },
        {
          nome: "NÍVEL 4 - RESISTÊNCIA DIRETO DA FONTE",
          descricao: ""
        },
        {
          nome: "NÍVEL 5 - PELE DE MÁRMORE",
          descricao: ""
        },
        {
          nome: "NÍVEL 5 - PODER VINDO DA DOR",
          descricao: ""
        }
      ]
    },
    {
      nome: "Ofuscação",
      descricao: "",
      poderes: [
        {
          nome: "NÍVEL 1 - MANTO DE SOMBRAS",
          descricao: ""
        },

        {
          nome: "NÍVEL 1 - SILÊNCIO DA MORTE",
          descricao: ""
        },

        {
          nome: "NÍVEL 2 - PASSAGEM INVISÍVEL",
          descricao: ""
        },

        {
          nome: "NÍVEL 3 - FANTASMA NA MÁQUINA",
          descricao: ""
        },

        {
          nome: "NÍVEL 3 - MÁSCARA DE MIL FACES",
          descricao: ""
        },

        {
          nome: "NÍVEL 4 - DESAPARECER",
          descricao: ""
        },

        {
          nome: "NÍVEL 4 - OCULTAR",
          descricao: ""
        },

        {
          nome: "NÍVEL 5 - DISFARCE DO IMPOSTOR",
          descricao: ""
        },

        {
          nome: "NÍVEL 5 - OCULTAR O GRUPO",
          descricao: ""
        }
      ]
    },
    {
      nome: "Potência",
      descricao: "",
      poderes: [
        {
          nome: "NÍVEL 1 - CORPO LETAL",
          descricao: ""
        },
        {
          nome: "NÍVEL 1 - SALTO VERTIGINOSO",
          descricao: ""
        },
        {
          nome: "NÍVEL 2 - PODERIO",
          descricao: ""
        },
        {
          nome: "NÍVEL 3 - ALIMENTAÇÃO BRUTAL",
          descricao: ""
        },
        {
          nome: "NÍVEL 3 - CENTELHA DA FÚRIA",
          descricao: ""
        },
        {
          nome: "NÍVEL 3 - PEGADA SOBRENATURAL",
          descricao: ""
        },
        {
          nome: "NÍVEL 4 - FORÇA DIRETO DA FONTE",
          descricao: ""
        },
        {
          nome: "NÍVEL 5 - PUNHO DE CAIM",
          descricao: ""
        },
        {
          nome: "NÍVEL 5 - TERREMOTO",
          descricao: ""
        }
      ]
    },
    {
      nome: "Presença",
      descricao: "",
      poderes: [
        {
          nome: "NÍVEL 1 - AMEDONTRAR",
          descricao: ""
        },
        {
          nome: "NÍVEL 1 - FASCÍNIO",
          descricao: ""
        },
        {
          nome: "NÍVEL 2 - BEIJO INDELÉVEL",
          descricao: ""
        },
        {
          nome: "NÍVEL 3 - OLHAR ATERRORIZANTE",
          descricao: ""
        },
        {
          nome: "NÍVEL 3 - TRANSE",
          descricao: ""
        },
        {
          nome: "NÍVEL 4 - CONVOCAR",
          descricao: ""
        },
        {
          nome: "NÍVEL 4 - VOZ IRRESISTÍVEL",
          descricao: ""
        },
        {
          nome: "NÍVEL 5 - MAGNETISMO DE ESTRELA",
          descricao: ""
        },
        {
          nome: "NÍVEL 5 - MAJESTADE",
          descricao: ""
        }
      ]
    },
    {
      nome: "Proteanismo",
      descricao: "",
      poderes: [
        {
          nome: "NÍVEL 1 - OLHOS DA BESTA",
          descricao: ""
        },
        {
          nome: "NÍVEL 1 - PESO PENA",
          descricao: ""
        },
        {
          nome: "NÍVEL 2 - ARMAS FERAIS",
          descricao: ""
        },
        {
          nome: "NÍVEL 3 - FUSÃO COM A TERRA",
          descricao: ""
        },
        {
          nome: "NÍVEL 3 - MUDANÇA DE FORMA",
          descricao: ""
        },
        {
          nome: "NÍVEL 4 - METAMORFOSE",
          descricao: ""
        },
        {
          nome: "NÍVEL 5 - CORAÇÃO VAGANTE",
          descricao: ""
        },
        {
          nome: "NÍVEL 5 - FORMA DE NÉVOA",
          descricao: ""
        }
      ]
    },
    {
      nome: "Feitiçaria de Sangue",
      descricao: "",
      poderes: [
        {
          nome: "NÍVEL 1 - UM GOSTO POR SANGUE",
          descricao: ""
        },
        {
          nome: "NÍVEL 1 - VITAE CORROSIVO",
          descricao: ""
        },
        {
          nome: "NÍVEL 2 - EXTINGUIR VITAE",
          descricao: ""
        },
        {
          nome: "NÍVEL 3 - PICADA DE ESCORPIÃO",
          descricao: ""
        },
        {
          nome: "NÍVEL 3 - SANGUE POTENTE",
          descricao: ""
        },
        {
          nome: "NÍVEL 4 - ROUBO DE VITAE",
          descricao: ""
        },
        {
          nome: "NÍVEL 5 - CALDEIRÃO DE SANGUE",
          descricao: ""
        },
        {
          nome: "NÍVEL 5 - CARÍCIA DE BAAL",
          descricao: ""
        }
      ]
    },
  ];

  const predatorTypes = [
    "Consensualista",
    "Fazendeiro",
    "Osíris",
    "Sacoleiro",
    "Sandman",
    "Sanguessuga",
    "Scene Queen",
    "Sereia",
    "Trinchador",
    "Vira-lata"
  ];

  const infoFields = [
    { key: "nome", label: "Nome" },
    { key: "conceito", label: "Conceito" },
    {
      key: "predador",
      label: "Predador",
      type: "select",
      options: predatorTypes
    },
    { key: "cronica", label: "Crônica" },
    { key: "ambicao", label: "Ambição" },
    {
      key: "cla",
      label: "Clã",
      type: "select",
      options: clans
    },
    { key: "senhor", label: "Senhor" },
    { key: "desejo", label: "Desejo" },
    { key: "geracao", label: "Geração" }
  ];

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
    fome: { atual: 0, max: 5 },
    maculas: { atual: 0, max: 10 },

    danoSupV: { atual: 0, max: 10 },
    danoAgrV: { atual: 0, max: 10 },

    danoSupF: { atual: 0, max: 10 },
    danoAgrF: { atual: 0, max: 10 }
  });

  useEffect(() => {
    setStats((prev) => ({
      ...prev,
      vida: {
        ...prev.vida,
        max: atributos.vigor + 3
      },
      forcaVontade: {
        ...prev.forcaVontade,
        max: atributos.compostura + atributos.determinacao
      }
    }));
  }, [
    atributos.vigor,
    atributos.compostura,
    atributos.determinacao
  ]);

  useEffect(() => {
    let desgraça = "";
    switch (infoBasica.cla) {
      case "Brujah":
        desgraça = "O Sangue dos Brujah fervilha com fúria mal contida, que explode sob a menor provocação. Subtraia uma quantidade de dados igual à Gravidade da Perdição do Brujah de qualquer parada para resistir a um Frenesi de fúria, o que não pode reduzir a parada a menos do que um dado.";
        break;

      case "Gangrel":
        desgraça = "Os Gangrel se relacionam com sua Besta da mesma forma que os demais Membros se relacionam com os Gangrel: com desconfiança. Quando em frenesi, os Gangrel ganham um ou mais de um aspecto animalesco: um traço físico, um odor ou um comportamento. Esses aspectos duram por mais uma noite depois do frenesi, persistindo como uma ressaca após uma farra.\nCada aspecto reduz um Atributo em 1 ponto — o Narrador pode decidir que uma língua bifurcada ou um odor de urso reduzem Carisma, enquanto orelhas de morcego reduzem Determinação (“todos esses sons me distraem”). Na dúvida, o aspecto reduz Inteligência ou Manipulação.\nA quantidade de aspectos que um Gangrel manifesta é igual à sua Gravidade da Perdição. Se seu personagem curtir a Onda do Frenesi (consulte a pág. 219), você pode escolher manifestar apenas um aspecto, portanto sofrendo apenas uma penalidade em um Atributo.";
        break;

      case "Malkavianos":
        desgraça = "Afli̱gidos por sua linhagem, todos os Malkavianos são amaldiçoados com pelo menos um tipo de transtorno mental. Dependendo de sua história e do estado da sua mente ao morrer, eles podem experimentar delírios, visões de clareza terrível ou algo totalmente diferente.\nQuando um Malkaviano sofre uma Falha Bestial ou uma Compulsão, sua Perdição vem à tona. Nesse caso, o personagem sofre uma penalidade igual à sua Gravidade da Perdição em uma categoria de parada de dados (Física, Social ou Mental) durante toda a cena. Isso se soma a todas as penalidades devidas a Compulsões.\nDurante a criação do personagem, o jogador e o Narrador decidem qual tipo de penalidade é comum e a natureza exata da aflição que acomete o personagem.";
        break;

      case "Nosferatu":
        desgraça = "Hediondos e vis, considera-se que todos os Nosferatu possuem o Defeito Repulsivo (-2) e jamais podem aumentar seu valor de Qualidade Visual. Além disso, qualquer tentativa de esconder suas deformidades resultado em uma penalidade à parada de dados igual à Gravidade da Perdição do personagem (o que inclui poderes de Disciplina, como Máscara de Mil faces e Disfarce do Impostor).\nA maioria dos Nosferatu nao quebra a Máscara ao serem avistados. Eles são vistos pelos mortais como grotesco e quase sempre aterrorizantes, mas nem sempre de modo sobrenatural.";
        break;

      case "Toreador":
        desgraça = "Os Toreador exemplificam o velho ditado segundo o qual a arte no sangue assume formas estranhas. Eles  desejam tão intensamente a beleza que acabem sofrendo em sua ausência. Enquanto seu personagem se encontrar em um ambiente menos do que belo, suas paradas de dados usadas para acionar Disciplinas sofrem um redutor equivalente a sua Gravidade da Perdição. O Narrador decide especificamente como a beleza ou feiura do ambiente em que um Toreador se encontra (incluindo roupas, bonecas de sangue etc.) o penalizam, baseando-se no senso estético do personagem. Dito isso, até os devotos da Escole Âshcan jamais acham as ruas comuns perfeitamente belas.\n Essa obsessão com a estética também faz com que as divas se percam em momentos de beleza e com que uma falha Bestial geralmente resulte em um transe de arrebatemento,conforme detalhado nas regras de Compulsões (pág. 208),";
        break;

      case "Tremere":
        desgraça = "Houve um tempo em que o clă foi definido por uma rigida hierarquia de Laços de Sangue que iam do topo à base da Pirâmide. Entretanto, após a queda de Viena, seu Sangue recuou e abortou todas essas conexões. O Vitae Tremere não tem mais a capacidade de criar Laços de Sangue com outros Membros, embora os próprios Tremere possam ser Enlaçados por Membros de outros clăs. Um Tremere ainda consegue enlaçar mortais e carniçais, embora seu Vitae corrompido precise ser consumido um número de vezes extra igual à Gravidade da Perdição do vampiro para que o laço se forme. Alguns pensam que essa mudança é a a vingança do Antediluviano devorado por Tremere, outros a atribuem a uma simples mutação. Seja como for, o cla estuda seu proprio Vitae atentamente para descobrir so se o processo pode ser revertido e se, de fato, eles desejam isso";
        break;

      case "Ventrue":
        desgraça = "Os Ventrue possuem paladares refinados. Quando um Bórgia bebe sangue de qualquer mortal que não seja da sua preferência, ele precisa fazer um grande esforço de vontade para que o sangue não volte na forma de vômito escarlate.\nOs gostos variam grandemente, indo desde sangues azuis que só se alimentam de morenas genuínas, de indivíduos com descendência suíça ou homossexuais, àqueles que só bebem de soldados, de mortais que sofrem de transtorno de estresse pós-traumático ou de usuários de metanfetamina. Com um teste de Determinação + Percepção (Dificuldade 4 ou maior), seu personagem pode sentir se um mortal possui o sangue desejado.\nSe você quer que seu personagem se alimente de tudo que não seja seu tipo de vítima predileta, você deve gastar uma quantidade de pontos de Força de Vontade igual à Gravidade da Perdição do personagem.";
        break;

      case "Caitiff":
        desgraça = "Intocados pelos Antediluvianos, os Caitiff não compartilham nenhuma perdição. Personagens Caitiff começam com o Defeito Suspeito 1 e você não pode adquirir Status para eles durante a criação de personagem. O Narrador sempre pode impor uma penalidade de um ou dois dados a testes Sociais contra Membros que saibam que eles são Caitiffs, a despeito do seu eventual Status.\nAlém disso, aumentar uma das Disciplinas de um Caitiff cust seis vezes o nível adquirido em pontos de experiência.";
        break;
    }
    setLore((prev) => ({
      ...prev,
      desgraça
    }));
  }, [
    infoBasica.cla
  ]);

  const [alertMessage, setAlertMessage] = useState("");

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
    { nome: "", nivel: 0, poderes: [""] }
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
    preludio: "",
    ressonancia: ""
  });

  const [notes, setNotes] = useState("");
  const [carac1, setCarac1] = useState("");
  const [carac2, setCarac2] = useState("");

  async function salvarFicha() {
    const ficha = {
      infoBasica,
      atributos,
      pericias,
      disciplinas,
      stats,
      blood,
      extras,
      exp,
      lore,
      vantagensDefeitos,
      notes
    };

    const { error } = await supabase
      .from("fichas")
      .upsert(
        {
          nome: infoBasica.nome,
          data: ficha
        },
        {
          onConflict: "nome"
        }
      );

    if (error) {
      console.error(error);
      setAlertMessage("Erro ao salvar.");
    } else {
      setAlertMessage("Ficha salva/substituída!");
    }
  }

  const [nomeBusca, setNomeBusca] = useState("");

  async function carregarFicha() {
    const { data, error } = await supabase
      .from("fichas")
      .select("*")
      .eq("nome", nomeBusca)
      .single();

    if (error || !data) {
      setAlertMessage("Ficha não encontrada.");
      return;
    }

    const ficha = data.data;

    setInfoBasica(ficha.infoBasica);
    setAtributos(ficha.atributos);
    setPericias(ficha.pericias);
    setDisciplinas(ficha.disciplinas);
    setStats(ficha.stats);
    setBlood(ficha.blood);
    setExtras(ficha.extras);
    setExp(ficha.exp);
    setLore(ficha.lore);
    setVantagensDefeitos(ficha.vantagensDefeitos);
    setNotes(ficha.notes)

    setAlertMessage("Ficha carregada!");
  }

  function getAllOptions() {
    return [
      ...Object.keys(atributos).map((key) => ({
        value: key,
        label: `[Atributo] ${key}`
      })),

      ...Object.keys(pericias).map((key) => ({
        value: key,
        label: `[Perícia] ${key}`
      })),

      ...disciplinas.map((disc, index) => ({
        value: `disciplina-${index}`,
        label: `[Disciplina] ${disc.nome || `Disciplina ${index + 1}`}`
      }))
    ];
  }

  const [podeRerrolar, setPodeRerrolar] = useState(false);
  const [modificador, setModificador] = useState(0);
  const [historicoRolagens, setHistoricoRolagens] = useState([]);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  return (
    <div style={styles.page}>
      <div
        style={{
          position: "fixed",
          right: "25px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          width: "280px",
          padding: "20px",
          background: "#1a1a1a",
          border: "2px solid #8b0000",
          borderRadius: "16px",
          boxShadow: "0 0 25px rgba(0,0,0,0.7)"
        }}
      >
        <h3
          style={{
            margin: 0,
            padding: "14px",
            textAlign: "center",
            background: "linear-gradient(180deg, #8b0000, #5a0000)",
            color: "white",
            borderRadius: "12px",
            fontSize: "26px",
            fontWeight: "bold",
            letterSpacing: "1px",
            boxShadow: "inset 0 0 10px rgba(255,255,255,0.1)"
          }}
        >
          Teste
        </h3>

        <select
          value={carac1}
          onChange={(e) => setCarac1(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #8b0000",
            background: "#2b2b2b",
            color: "white",
            fontSize: "16px",
            outline: "none"
          }}
        >
          <option value="">Selecione...</option>
          {getAllOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={carac2}
          onChange={(e) => setCarac2(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #8b0000",
            background: "#2b2b2b",
            color: "white",
            fontSize: "16px",
            outline: "none"
          }}
        >
          <option value="">Selecione...</option>
          {getAllOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px"
          }}
        >
          <span style={{ color: "white", fontWeight: "bold" }}>
            Modificador
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setModificador(modificador - 1)}
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "8px",
                border: "none",
                background: "#8b0000",
                color: "white",
                fontSize: "20px",
                cursor: "pointer"
              }}
            >
              -
            </button>

            <span
              style={{
                minWidth: "40px",
                textAlign: "center",
                color: "white",
                fontSize: "18px"
              }}
            >
              {modificador > 0 ? `+${modificador}` : modificador}
            </span>

            <button
              onClick={() => setModificador(modificador + 1)}
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "8px",
                border: "none",
                background: "#008000",
                color: "white",
                fontSize: "20px",
                cursor: "pointer"
              }}
            >
              +
            </button>
          </div>
        </div>

        <button onClick={fazerTeste}>
          Rolar {Math.max(1,
            getValorCaracteristica(carac1) +
            getValorCaracteristica(carac2) +
            modificador
          )} dados
        </button>

        <button
          onClick={usarSurtoDeSangue}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            background: "#8b0000",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Usar Surto de Sangue
        </button>

        <button
          onClick={() => setMostrarHistorico(!mostrarHistorico)}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #555",
            background: mostrarHistorico ? "#8b0000" : "#333",
            color: "white",
            cursor: "pointer",
            fontSize: "15px"
          }}
        >
          {mostrarHistorico ? "Ocultar Histórico" : "Mostrar Histórico"}
        </button>

        {mostrarHistorico && (
          <div
            style={{
              position: "fixed",
              right: "330px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "350px",
              maxHeight: "500px",
              overflowY: "auto",
              background: "#1a1a1a",
              border: "2px solid #444",
              borderRadius: "16px",
              padding: "20px",
              color: "white",
              zIndex: 9998
            }}
          >
            <h3 style={{ marginTop: 0, textAlign: "center" }}>
              Histórico de Rolagens
            </h3>

            {historicoRolagens.length === 0 ? (
              <p>Nenhuma rolagem ainda.</p>
            ) : (
              historicoRolagens.map((roll) => (
                <div
                  key={roll.id}
                  style={{
                    background: "#2b2b2b",
                    padding: "12px",
                    marginBottom: "10px",
                    borderRadius: "8px",
                    whiteSpace: "pre-line"
                  }}
                >
                  {roll.texto}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <h1 style={styles.sectionTitle}>Ficha VTM V5</h1>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Informações Básicas</h2>

        <div style={styles.grid3}>
          {infoFields.map((field) => (
            <EditableField
              key={field.key}
              label={field.label}
              type={field.type}
              options={field.options}
              value={infoBasica[field.key]}
              onChange={(value) =>
                setInfoBasica({
                  ...infoBasica,
                  [field.key]: value
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
        <h2 style={styles.sectionTitle}></h2>

        <div style={styles.statsGrid}>
          <StatBar
            label="Vitalidade"
            max={stats.vida.max}
            superficial={stats.danoSupV.atual}
            agravado={stats.danoAgrV.atual}
            onMaxChange={(value) =>
              setStats({
                ...stats,
                vida: {
                  ...stats.vida,
                  max: value
                }
              })
            }
            onSupChange={(value) =>
              setStats({
                ...stats,
                danoSupV: {
                  ...stats.danoSupV,
                  atual: Math.max(
                    0,
                    Math.min(
                      value,
                      stats.vida.max - stats.danoAgrV.atual
                    )
                  )
                }
              })
            }
            onAgrChange={(value) =>
              setStats({
                ...stats,
                danoAgrV: {
                  ...stats.danoAgrV,
                  atual: Math.max(
                    0,
                    Math.min(
                      value,
                      stats.vida.max - stats.danoSupV.atual
                    )
                  )
                }
              })
            }
          />

          <StatBar
            label="Força de Vontade"
            max={stats.forcaVontade.max}
            superficial={stats.danoSupF.atual}
            agravado={stats.danoAgrF.atual}
            onMaxChange={(value) =>
              setStats({
                ...stats,
                forcaVontade: {
                  ...stats.forcaVontade,
                  max: value
                }
              })
            }
            onSupChange={(value) =>
              setStats({
                ...stats,
                danoSupF: {
                  ...stats.danoSupF,
                  atual: Math.max(
                    0,
                    Math.min(
                      value,
                      stats.forcaVontade.max - stats.danoAgrF.atual
                    )
                  )
                }
              })
            }
            onAgrChange={(value) =>
              setStats({
                ...stats,
                danoAgrF: {
                  ...stats.danoAgrF,
                  atual: Math.max(
                    0,
                    Math.min(
                      value,
                      stats.forcaVontade.max - stats.danoSupF.atual
                    )
                  )
                }
              })
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

          <div
            style={{
              gridColumn: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <StatDots
              label="Máculas"
              stat={stats.maculas}
              reverse={true}
              onChange={(v) =>
                setStats({ ...stats, maculas: v })
              }
            />
          </div>

          {/* BOTÃO EMBAIXO DE FOME */}
          <div
            style={{
              gridColumn: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <button
              onClick={() => (fnRolarDado(1, "CS"))}
              style={{
                padding: "10px 15px",
                background: "#8b0000",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Checagem de Sangue
            </button>
          </div>

          <div
            style={{
              gridColumn: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <button
              onClick={() => fnRolarDado(10 - (stats.humanidade.atual + stats.maculas.atual), "TR")}
              style={{
                padding: "10px 15px",
                background: "#8b0000",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Testar Remorso
            </button>
          </div>
        </div>
      </section >

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Habilidades</h2>

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

        {disciplinas.map((disc, index) => {
          const disciplinaSelecionada = disciplinasTodas.find(
            (d) => d.nome === disc.nome
          );

          return (
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
                type="select"
                options={disciplinasTodas.map((d) => d.nome)}
                value={disc.nome}
                onChange={(value) => {
                  const copy = [...disciplinas];
                  copy[index].nome = value;
                  copy[index].poderes = [""];
                  setDisciplinas(copy);
                }}
                rightElement={
                  <button
                    onClick={() =>
                      alert(disciplinaSelecionada?.descricao || "Sem descrição")
                    }
                    style={{
                      padding: "10px 14px",
                      minWidth: "130px",
                      height: "42px",
                      borderRadius: "10px",
                      border: "1px solid #aa2222",
                      background: "linear-gradient(180deg, #8b0000, #5a0000)",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                      boxShadow: "0 0 8px rgba(139,0,0,0.4)"
                    }}
                  >
                    Ver descrição
                  </button>
                }
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

              {disc.poderes.map((poder, poderIndex) => {
                const poderSelecionado = disciplinaSelecionada?.poderes.find(
                  (p) => p.nome === poder
                );

                return (
                  <div key={poderIndex} style={{ marginBottom: "12px" }}>
                    <EditableField
                      label={`Poder ${poderIndex + 1}`}
                      type="select"
                      options={
                        disciplinaSelecionada
                          ? disciplinaSelecionada.poderes.map((p) => p.nome)
                          : []
                      }
                      value={poder}
                      onChange={(value) => {
                        const copy = [...disciplinas];
                        copy[index].poderes[poderIndex] = value;
                        setDisciplinas(copy);
                      }}
                      rightElement={
                        <button
                          onClick={() =>
                            alert(poderSelecionado?.descricao || "Sem descrição")
                          }
                          style={{
                            padding: "10px 14px",
                            minWidth: "130px",
                            height: "42px",
                            borderRadius: "10px",
                            border: "1px solid #aa2222",
                            background: "linear-gradient(180deg, #8b0000, #5a0000)",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                            boxShadow: "0 0 8px rgba(139,0,0,0.4)"
                          }}
                        >
                          Ver descrição
                        </button>
                      }
                    />

                    <button
                      disabled={disc.poderes.length === 1}
                      onClick={() => {
                        const copy = [...disciplinas];
                        copy[index].poderes = copy[index].poderes.filter(
                          (_, i) => i !== poderIndex
                        );
                        setDisciplinas(copy);
                      }}
                      style={{
                        marginTop: "6px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "none",
                        background: disc.poderes.length === 1 ? "#555" : "#8b0000",
                        color: "white",
                        cursor: disc.poderes.length === 1 ? "not-allowed" : "pointer"
                      }}
                    >
                      Remover Poder
                    </button>
                  </div>
                );
              })}

              {/* Adicionar poder */}
              <button
                onClick={() => {
                  const copy = [...disciplinas];
                  copy[index].poderes.push("");
                  setDisciplinas(copy);
                }}
                style={{
                  marginTop: "10px",
                  marginRight: "10px",
                  padding: "10px 14px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#006400",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                + Poder
              </button>

              {/* Remover disciplina */}
              <button
                disabled={disciplinas.length === 1}
                onClick={() =>
                  setDisciplinas(
                    disciplinas.filter((_, i) => i !== index)
                  )
                }
                style={{
                  marginTop: "10px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "none",
                  background:
                    disciplinas.length === 1 ? "#555" : "#8b0000",
                  color: "white",
                  fontWeight: "bold",
                  cursor:
                    disciplinas.length === 1 ? "not-allowed" : "pointer"
                }}
              >
                Remover Disciplina
              </button>
            </div>
          );
        })}

        {/* Adicionar disciplina */}
        <button
          onClick={() =>
            setDisciplinas([
              ...disciplinas,
              { nome: "", nivel: 0, poderes: [""] }
            ])
          }
          style={{
            width: "100%",
            padding: "14px",
            marginTop: "15px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(180deg, #006400, #004d00)",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Adicionar Disciplina
        </button>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Vantagens e Defeitos</h2>
        {vantagensDefeitos.map((disc, index) => (
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
                const copy = [...vantagensDefeitos];
                copy[index].nome = value;
                setVantagensDefeitos(copy);
              }}
            />

            <EditableDots
              label="Nível"
              value={disc.nivel}
              onChange={(value) => {
                const copy = [...vantagensDefeitos];
                copy[index].nivel = value;
                setVantagensDefeitos(copy);
              }}
            />

            <button
              onClick={() =>
                setVantagensDefeitos([
                  ...vantagensDefeitos,
                  { nome: "", nivel: 0 }
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
              + Vantagem
            </button>

            <button
              disabled={vantagensDefeitos.length === 1}
              onClick={() =>
                setVantagensDefeitos(
                  vantagensDefeitos.filter((_, i) => i !== index)
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
              - Vantagem
            </button>
          </div>
        ))}
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Notas</h2>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Escreva aqui suas notas..."
          rows={8}
          style={{
            width: "95%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #444",
            background: "#333",
            color: "white",
            resize: "vertical",
            fontFamily: "Arial",
            lineHeight: "1.4"
          }}
        />
      </section>

      {/* COLUNA DIREITA */}
      <div style={styles.column}>
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Potência de Sangue</h2>

          <StatDots
            label="Potência"
            stat={{ atual: blood.potencia, max: 10 }}
            onChange={(v) =>
              setBlood({ ...blood, potencia: v.atual })
            }
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              columnGap: "25px"
            }}
          >
            <EditableField
              label="Surto de Sangue"
              type="number"
              value={blood.surto}
              onChange={(v) =>
                setBlood({ ...blood, surto: v })
              }
            />

            <EditableField
              label="Cura por Sangue"
              type="number"
              value={blood.cura}
              onChange={(v) =>
                setBlood({ ...blood, cura: v })
              }
            />

            <EditableField
              label="Poder Bônus"
              type="number"
              value={blood.bonus}
              onChange={(v) =>
                setBlood({ ...blood, bonus: v })
              }
            />

            <EditableField
              label="Re-rolar Fome"
              type="number"
              value={blood.reroll}
              onChange={(v) =>
                setBlood({ ...blood, reroll: v })
              }
            />

            <EditableField
              label="Penalidade Alimentícia"
              type="number"
              value={blood.penalidade}
              onChange={(v) =>
                setBlood({ ...blood, penalidade: v })
              }
            />

            <EditableField
              label="Severidade da Desgraça"
              type="number"
              value={blood.desgraca}
              onChange={(v) =>
                setBlood({ ...blood, desgraca: v })
              }
            />
          </div>
        </section>



        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Experiência</h2>

          <EditableField
            label="EXP Total"
            type="number"
            value={exp.total}
            onChange={(v) =>
              setExp({ ...exp, total: v })
            }
          />

          <EditableField
            label="EXP Gasta"
            type="number"
            value={exp.gasta}
            onChange={(v) =>
              setExp({ ...exp, gasta: v })
            }
          />
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Detalhes</h2>

          <EditableField
            label="Idade verdadeira"
            value={extras.idadeReal}
            onChange={(v) =>
              setExtras({ ...extras, idadeReal: v })
            }
          />

          <EditableField
            label="Idade aparente"
            value={extras.idadeAparente}
            onChange={(v) =>
              setExtras({ ...extras, idadeAparente: v })
            }
          />

          <EditableField
            label="Data de nascimento"
            value={extras.nascimento}
            onChange={(v) =>
              setExtras({ ...extras, nascimento: v })
            }
          />

          <EditableField
            label="Data de morte"
            value={extras.morte}
            onChange={(v) =>
              setExtras({ ...extras, morte: v })
            }
          />

          <EditableField
            label="Aparência"
            value={extras.aparencia}
            onChange={(v) =>
              setExtras({ ...extras, aparencia: v })
            }
          />

          <EditableField
            label="Características distintas"
            value={extras.caracteristicas}
            onChange={(v) =>
              setExtras({ ...extras, caracteristicas: v })
            }
          />

          <EditableField
            label="Prelúdio"
            value={extras.preludio}
            onChange={(v) =>
              setExtras({ ...extras, preludio: v })
            }
          />

          <EditableField
            label="Ressonância"
            value={extras.ressonancia}
            onChange={(v) =>
              setExtras({ ...extras, ressonancia: v })
            }
          />
        </section>
      </div>
      {
        alertMessage && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#222",
              color: "white",
              padding: "35px 50px",
              borderRadius: "12px",
              border: `3px solid ${alertMessage.startsWith("Sucesso") ? "#00aa00" : "#8b0000"
                }`,
              zIndex: 9999,
              textAlign: "center",
              minWidth: "300px"
            }}
          >
            <h2
              style={{
                fontSize: "48px",
                margin: 0,
                color:
                  alertMessage.startsWith("Sucesso")
                    ? "#00ff66"
                    : "#ff4444"
              }}
            >
              {alertMessage}
            </h2>
            {podeRerrolar && (
              <button onClick={rerrolarForcaVontade} style={{
                marginTop: "20px",
                padding: "10px 20px",
                background:
                  alertMessage.startsWith("Sucesso")
                    ? "#008800"
                    : "#8b0000",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "point"
              }}>
                Rerrolar(Força de Vontade)
              </button>
            )}
            <button
              onClick={() => setAlertMessage("")}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                marginLeft: "10px",
                background:
                  alertMessage.startsWith("Sucesso")
                    ? "#008800"
                    : "#8b0000",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Fechar
            </button>
          </div>
        )
      }

      <input
        value={nomeBusca}
        onChange={(e) => setNomeBusca(e.target.value)}
        placeholder="Nome do personagem"
      />

      <button onClick={carregarFicha}

        style={{
          marginLeft: "10px",
          padding: "12px 20px",
          background: "gray",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          boxShadow: "0 0 10px rgba(0,0,0,0.4)"
        }}>
        Buscar ficha
      </button>

      <button
        onClick={salvarFicha}
        style={{
          marginLeft: "20px",
          padding: "12px 20px",
          background: "gray",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          boxShadow: "0 0 10px rgba(0,0,0,0.4)"
        }}
      >
        Salvar Ficha
      </button>
    </div >
  );
}
