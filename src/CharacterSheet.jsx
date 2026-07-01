import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import { Link } from "react-router-dom";

function EditableField({
    label,
    value,
    onChange,
    type = "text",
    options = [],
    rightElement = null
}) {
    const textareaRef = useRef(null);

    const sharedStyle = {
        width: "100%",
        padding: 8,
        borderRadius: 6,
        border: "1px solid #444",
        background: "#333",
        color: "white",
        textAlign: "center",
        resize: "none", // importante: desativa resize manual
        overflow: "hidden" // importante: evita scroll interno
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                textareaRef.current.scrollHeight + "px";
        }
    }, [value]);

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
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={1}
                style={sharedStyle}
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
        marginTop: 0,
        textAlign: "center"
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
    const [statusSalvamento, setStatusSalvamento] = useState("");

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
            descricao: "Alcunhas: Doolittlear, Domar, Bestiae Sermo\n\nTalvez os vampiros tenham mais em comum com os animais do que com os humanos. Um perigoso conjunto de instintos os governa, e custa muito para que consigam controlar o impulso de simplesmente atacar.\nAssim como um cão selvagem acorrentado, a Besta de um vampiro jamais se deixa domar de fato.\nAlguns Membros encontram um modo de se tornarem um com suas Bestas. Aqueles que o fazem se tornam os mestres do Animalismo. Muitos acompanham o uso deste poder com uivos, rosnados, urros ou se comunicam com animais na 'língua' dos animais, embora isto seja uma afetação e não uma necessidade.\nA Disciplina Animalismo é muito usada entre vampiros que têm dificuldades de adaptação ou não gostam de viver entre os mortais. Muitas vezes classificada como um dos dons utilitários de Caim, permitindo que um vampiro sobreviva de sangue bruto ou faça amizade com seres irracionais, ela também é uma arma devastadora contra vampiros que escalam suas torres, e inquisidores que supôem que seus inimigos só andam sobre suas pernas. Um bando de ratos sedentos de sangue que invade a cobertura-refúgio de um Membro, o vampiro especialista em Animalismo que intimida a Besta do Xerife no Elísio ou o corvo com olhos vidrados que espia um capítulo da Sociedade de São Leopoldo — todos esses servem para fortalecer praticantes de Animalismo e enfraquecer seus inimigos.\n\nCaracterísticas\nNormalmente, os poderes de Animalismo que envolvem animais só podem ser usados em vertebrados. Além disso, qualquer uso do poder em herbívoros soma um à Dificuldade das rolagens de Habilidades envolvidas.\nTipo: Mental\nAmeaça à Máscara: Baixa para média. Apesar de conversar com animais parecer excêntrico, somente as aplicações mais violentas da Disciplina resultam em mais do que sobrancelhas erguidas.\nRessonância de Sangue: Sangue animal, preferivelmente selvagem.",
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
            descricao: "Alcunhas: Voyeurismo, Vidência, Anima Visus\n\nEstando entre os maiores dons e piores maldições que afligem os vampiros, a Disciplina Auspícios permite que os Membros distingam a verdade da mentira, sondem as mentes daqueles ao redor e percebam a realidade em um nível diferente do de outros seres. O que parece ser o poder supremo em previsão e visão concede aos seus usuários, talvez, conhecimento em excesso. Eles são capazes de detectar a lâmina de um assassino antes que ele golpeie ou invadir e revirar a cabeça de um inimigo, mas também podem sentir cada oscilação nas emoções, boas e más, ver coisas que não desejariam ter visto e distinguir futuros que não desejariam explorar.\nOs usuários de Auspícios atraem a paranoia, mas usar esta Disciplina é viciante. Uma vez que você saiba que a verdade está ao seu alcance, você a busca a cada oportunidade.\nOs Membros usam Auspícios de muitos modos. Alguns agem como espiões para suas cortes e facções; outros atuam por conta própria, chantageando mortais e imortais com segredos recolhidos em conversas discretas, alterações emocionais sutis e invasões telepáticas. Auspícios permite que seu usuário exerça o papel de detetive do domínio, estudando a cena da destruição de um vampiro atrás de pistas espirituais reveladoras, ou interrogando suspeitos com precisão sobrenatural.\n\nCaracterísticas\nSe desejarem, os Narradores podem realizar os testes de Auspícios para os personagens; isso permite que forneçam de modo mais convincente respostas corretas ou incorretas após rolagens fracassadas.\nTipo: Mental\nAmeaça à Máscara: Baixa. Auspícios nunca se manifesta de modo visível ao olho nu ou causa efeitos que não possam ser explicados racionalmente, a não ser que seja como mera sorte.\nRessonância de Sangue: Fleumática. Artistas (especialmente fotógrafos) e visionários, certos esquizofrênicos, usuários de substâncias psicoativas, detetives.",
            poderes: [
                {
                    nome: "NÍVEL 1 - SENTIDOS AGUÇADOS",
                    descricao: "Os sentidos do vampiro se aguçam a níveis sobrenaturais, concedendo-lhe o poder de ver em trevas totais, ouvir frequências ultrassônicas e sentir o medo de presas encurraladas.\nCusto: Gratuito (mas veja abaixo)\nParada de Dados: Raciocínio + Determinação\nSistema: O usuário adiciona seu valor de Auspícios a todas as suas rolagens de percepção. Se exposto a sensações extremas, como estouros, brilhos intensos ou odores pungentes enquanto o poder está ativo — o usuário deve obter sucesso em uma rolagem de Raciocínio + Determinação (Dificuldade 3 ou mais) para amortecer seus sentidos a tempo, ou a sobrecarga resulta em uma penalidade de -3 dados a todas as suas rolagens baseadas em percepção pelo restante da cena.\nDuração: Até ser desativado. Ter o poder ativo por períodos maiores (mais do que uma cena) sem descanso, especialmente em ambientes com estímulos muito intensos, pode necessitar do gasto de Força de Vontade, a critério do Narrador."
                },
                {
                    nome: "NÍVEL 1 - SENTIR O INVISÍVEL",
                    descricao: "Os sentidos do vampiro se sintonizam a dimensões além do mundano, o que lhe permite sentir presenças ocultas a olho nu. Isto pode significar qualquer coisa, de outro vampiro usando Ofuscação ou alguém usando Auspícios para espiar o personagem, a um fantasma no meio do aposento. Feitiços e rituais de Feitiçaria de Sangue inativos também podem ser encontrados com este poder, a critério do Narrador.\nCusto: Gratuito\nParadas de Dados: Raciocínio + Auspícios ou Determinação + Auspícios\nSistema: Sempre que algo sobrenatural estiver se escondendo em plena vista, o Narrador faz uma rolagem oculta de Raciocínio + Auspícios com uma Dificuldade à escolha dele. Contra uma entidade que esteja tentando permanecer oculta, o Narrador pode pedir uma rolagem cega (“Lisa, role sete dados para mim”) como uma disputa contra a parada relevante do alvo. (Por exemplo, detectar um vampiro usando Ofuscação seria uma rolagem de Raciocínio + Auspícios vs. Raciocínio + Ofuscação.) Se o vampiro estiver à procura de uma entidade sobrenatural escondida, ele rola Determinação + Auspícios.\nDuração: Passiva."
                },

                {
                    nome: "NÍVEL 2 - PREMONIÇÃO",
                    descricao: "O vampiro experimenta insights que podem assumir a forma de arrepios, inspirações repentinas ou até mesmo visões vívidas. Embora nunca sejam demasiadamente precisas, essas visões podem tirar o vampiro do caminho do perigo ou revelar uma verdade antes ignorada.\nCusto: Gratuito ou uma Checagem de Sangue\nParada de Dados: Determinação + Auspícios\nSistema: Sempre que o Narrador julgar apropriado, este poder concede ao personagem um toque ou dica repentina que o ajuda de algum modo: permitindo que encontre uma pista negligenciada ou salvando sua pele. Trata-se de uma visão súbita do próprio personagem caindo em uma armadilha, de um brilho sobre a segunda saída à direita durante uma perseguição, ou de um breve vislumbre de um esqueleto sob o assoalho do escritório do Príncipe. Este poder sempre dá ao Narrador licença para acelerar sutilmente o jogo ou mover a história na direção desejada.\nO limite sugerido é de uma premonição por cena, mesmo se mais de um personagem possuir Premonição.\nO usuário também pode provocar uma Premonição ao se concentrar em um alvo, realizar uma Checagem de Sangue e rolar Determinação + Auspícios. A quantidade de sucessos tirada determina o nível de detalhe obtido sobre o alvo, caso haja algum.\nDuração: Passiva."
                },

                {
                    nome: "NÍVEL 3 - COMPARTILHAR OS SENTIDOS",
                    descricao: "Ao estender o alcance da sua mente, o vampiro pode sentir o ambiente como se estivesse no lugar de outro mortal ou vampiro, passando a ver, ouvir e sentir com os sentidos dele. O usuário retém suas próprias percepções e ainda tem consciência dos seus arredores, embora o efeito exija algum costume. O usuário decide se se ligará a somente um, alguns ou todos os sentidos do alvo. Ao ser usado em um estranho, este poder requer linha de visão para ser acionado. No entanto, pode ser usado a maiores distâncias em alvos que ainda tenham um pouco do Sangue do usuário em seu corpo.\nCusto: Uma Checagem de Sangue\nParada de Dados: Determinação + Auspícios\nSistema: Role Determinação + Auspícios com Dificuldade 3. Esta Dificuldade pode auemntar por conta de distrações, distância ou outros fatores, tais como a quantidade do sangue do usuário que permanece no alvo. Este geralmente não tem consciência da intrusão, porém Sentir o Invisível pode fazer com que o passageiro seja notado. Para se livrar de um intruso, a vítima deve vencê-lo em uma rolagem de Raciocínio + Determinação vs. Raciocínio + Determinação. Um usuário de Auspícios expulso desse modo não pode realizar outra tentativa de Compartilhamento até a próxima noite.\nDuração: Uma cena."
                },

                {
                    nome: "NÍVEL 3 - PERSCRUTAR A ALMA",
                    descricao: "Ao se concentrar em uma pessoa, o vampiro pode perceber o estado da psiquê dela na forma de uma aura de cores mutáveis. Auras revelam pouca informação precisa, mas fornecem pistas a respeito de muitos assuntos, como estados emocionais, Ressonâncias e características sobrenaturais. Se estiver à procura de uma condição específica, o vampiro pode tentar detectá-la examinando superficialmente uma multidão. Esse tipo de investigação não fornece nenhum outro tipo de informação.\nCusto: Uma Checagem de Sangue\nParadas de Dados: Inteligência + Auspícios vs. Autocontrole + Subterfúgio\nSistema: Faça uma rolagem de Inteligência + Auspícios vs. Autocontrole + Subterfúgio. Em caso de vitória, o Narrador responde a verdade acerca de um número de perguntas igual à margem da rolagem a respeito da aura e da psiquê do alvo, incluindo:\n -O estado emocional do alvo\n- A Ressonância no sangue do alvo\n- Se o alvo é um vampiro, lobisomem, carniçal ou qualquer outro ser sobrenatural\n- Se o alvo está sob a influência de Feitiçaria de Sangue ou outro tipo de magia\n- Se o alvo cometeu Diablerie no último ano\n- Uma vitória crítica permite a descoberta de algo inesperado, a ser determinado pelo Narrador.\nAo examinar uma multidão, role contra uma Dificuldade determinada pelo número de pessoas e por distrações externas. bem como pelo tipo de características que se procura (encontrar um vampiro em uma sala pode ter Dificuldade 3, enquanto encontrar a pessoa mais inquieta em uma rave provavelmente teria Dificuldade 6 ou maior.\nDuração: Um turno, ou a critério do Narrador."
                },

                {
                    nome: "NÍVEL 4 - TOQUE DO ESPÍRITO",
                    descricao: "Ao tocar um objeto inanimado ou o solo de uma localização, o vampiro pode sentir o resíduo emocional deixado por aqueles que manusearam o objeto ou visitaram o local. O usuário obtém informações não somente sobre a aquela pessoa, mas também sobre o que foi feito e sob quais circunstâncias. Apesar de raramente claras, as informações muitas vezes oferecem indícios impossíveis de se obter mediante análise forense e dedução.\nCusto: Uma Checagem de Sangue\nParada de Dados: Inteligência + Auspícios\nSistema: Faça uma rolagem de Inteligência + Auspícios contra uma Dificuldade dependente da informação procurada. Vislumbrar o estado emocional do portador de uma arma usada em um assassinato há poucos dias teria Dificuldade 3, enquanto sentir os medos nos quais uma carta de 200 anos foi escrita pode chegar a Dificuldade 6 ou mais. Cada ponto na margem da rolagem permite que o usuário sinta aproximadamente um portador prévio do objeto e um conjunto de circunstâncias adicionais, contando retroativamente a partir do mais recente.\nDuração: Um turno."
                },

                {
                    nome: "NÍVEL 5 - CLARIVIDÊNCIA",
                    descricao: "Ao fechar seus olhos e entrar em um transe leve, o vampiro se torna mestre dos seus arredores. Em poucos minutos, consegue reunir informações de uma área equivalente a uma quadra (maior, se ao ar livre ou se se tratar de uma área menos populosa), o que normalmente demoraria muitas horas, talvez dias de trabalho e investigação. Uma vez conectado desse modo com seus arredores, o vampiro também pode receber informações sobre tudo o que acontece fora do comum na área.\nCusto: Uma Checagem de Sangue\nParada de Dados: Inteligência + Auspícios\nSistema: Role Inteligência + Auspícios contra uma Dificuldade baseada no nível de segurança e atividade da área. Usar Clarividência na sua própria mansão teria Dificuldade 3, enquanto uma favela desconhecida de uma cidade grande chegaria a 7 ou mais. O usuário adiciona seu valor base em Refúgio em dados extras à parada quando usa Clarividência em seu refúgio.\nO Narrador responde as perguntas do vampiro sobre a movimentação na área, o que as pessoas têm visto ou ouvido, tópicos de fofoca local, grandes surpresas ou impressões, e assim por diante. O jogador pode fazer aproximadamente uma pergunta por ponto da margem; respostas sobre informações deliberadamente escondidas podem consumir mais de um ponto. Uma vitória crítica revela algo maior, independentemente das perguntas feitas, assumindo-se que haja algo a ser revelado.\nO vampiro também pode monitorar clarividentemente eventos em progresso, mas isso exige que ele permaneça na área por tanto tempo quanto o efeito estiver ativo.\nDuração: Alguns minutos para a coleta de informações, até uma noite completa no caso de vigilância."
                },

                {
                    nome: "NÍVEL 5 - POSSESSÃO",
                    descricao: "Amálgama: Dominação 3\n\nCom este poder, o vampiro pode dominar a vontade de um mortal e possuir seu corpo por completo, usando-o como se fosse seu. Apesar da mente do alvo permanecer escondida do vampiro, este pode fazer tudo o que o alvo poderia ter feito ou ir a qualquer lugar onde ele poderia ter ido enquanto o poder permanecer ativo. Desse modo, o vampiro pode até mesmo experimentar a luz do sol, alimentos e a sensualidade física há muito negado a ele, com seu hospedeiro pagando o preço por quaisquer abusos que o vampiro cause ao corpo enquanto o possuía.\nCusto: Duas Checagens de Sangue\nParadas de Dados: Determinação + Auspícios vs. Determinação + Inteligência\nSistema: Este poder só pode ser usado em mortais. Se o mortal for um carniçal, em primeiro lugar ele deve ser Enlaçado pelo usuário. Antes que a possessão possa começar, o vampiro deve estabelecer contato visual com sua vítima (veja Dominação, pág. 254). O usuário então inicia um conflito de Determinação + Auspícios vs. Determinação + Inteligência com a vítima para tomar-lhe o corpo. Se o jogador do vampiro rolar uma falha total, a vítima fica imune a novas tentativas de Possessão pelo restante da história.\nAssim que o vampiro toma posse do corpo da vítima, seu próprio corpo entra em um transe semelhante ao Torpor, ficando completamente inconsciente dos seus arredores e do seu próprio estado físico, exceto no caso de dano Agravado, que rompe o transe e encerra seus efeitos. Um vampiro que esteja possuindo um mortal pode usar Auspícios, Presença e Dominação através dele. Se o possessor desejar estender a posse para as horas do dia, deve realizar uma rolagem para ficar acordado (pág. 219). Falha nesse caso encerra o poder. Qualquer dano Agravado ao alvo da possessão também pode encerrá-la — o usuário deve obter sucesso em uma rolagem de Determinação + Auspícios (Dificuldade 2 + o dano sofrido) para manter o controle. Se o alvo morrer durante a Possessão, o trauma espiritual resultante causará imediatamente no usuário 3 níveis de dano Agravado à Força de Vontade.\nEste poder não dá ao usuário a capacidade de ler mentes, usar as Habilidades ou imitar os modos da vítima. Quaisquer Habilidades usadas empregam os valores que o vampiro possui nelas, se as possuir.\nO usuário realiza uma rolagem de Manipulação + Performance vs. Raciocínio + Sagacidade para personificar com sucesso os modos e expressões da vítima.\nFinalmente, Possessão viola a vítima ainda mais profundamente do que um Laço de Sangue. O Narrador deve considerar conceder Máculas pelo uso desta Disciplina.\nDuração: Até ser encerrado, voluntariamente ou não."
                },

                {
                    nome: "NÍVEL 5 - TELEPATIA",
                    descricao: "Localizado nos mais altos níveis de Auspícios, agora o vampiro pode literalmente ler mentes, assim como projetar seus próprios pensamentos nas mentes de terceiros. Enquanto ler a mente de um mortal é relativamente simples, mentes não vivas exigem um esforço maior para serem penetradas.\nCusto: Uma Checagem de Sangue (mais 1 ponto de Força de Vontade contra vampiros involuntários)\nParadas de Dados: Determinação + Auspícios vs. Raciocínio + Subterfúgio\nSistema: O usuário não precisa rolar nenhum dado para projetar seus pensamentos em outra mente, vampírica ou mortal, embora isso exija linha de visão entre um e outro. Para ler a mente de um mortal que esteja à vista do usuário, ele deve rolar Determinação + Auspícios vs. Raciocínio + Subterfúgio enquanto encara seu alvo olho no olho. (A menos que o mortal tenha consentido, caso em que a rolagem não é necessária.) Uma vitória significa que o usuário pode distinguir pensamentos superficiais na forma de um fluxo de imagens, com uma margem maior permitindo que o usuário sonde em busca de memórias mais distantes ou enterradas. Uma vitória crítica fornece um panorama coerente dos pensamentos e intenções atuais do alvo. Para ler a mente de um vampiro involuntário, gaste 1 ponto de Força de Vontade antes de rolar.\nDuração: Aproximadamente um minuto por Checagem de Sangue. Aumente para uma cena completa no caso de alvos voluntários."
                }
            ]
        },
        {
            nome: "Celeridade",
            descricao: "Alcunhas: Boltear, Escorregar, Velocitas\n\nA capacidade de golpear rápido, esquivar-se de golpes e fugir de perseguidores permite que os Membros se tornem predadores extremamente efetivos. Celeridade permite que um vampiro se mova mais rápido do que qualquer criatura natural, embora faça mais do que conceder velocidade sobrenatural, com vampiros que a usam parecendo, de fato, pensar quase tão rapidamente quanto agem.\nEnquanto alguns vampiros usam esta Disciplina para golpear seus inimigos sem temer contra-ataques, outros simplesmente a usam para ir do ponto A ao B mais rapidamente do que outras pessoas a pé.\n\nCaracterísticas\nTipo: Física\nAmeaça à Máscara: Média para alta. A maioria dos poderes de Celeridade são claramente inumanos, mas o fato de ser muito difícil pegá-los em câmera costuma salvar a noite.\nRessonância de Sangue: Colérica. Medo e terror profundos, corredores, atletas, usuários de anfetamina e alcaloides, jogadores habituais de jogos de tiro em primeira pessoa e outros jogos de ação rápida.",
            poderes: [
                {
                    nome: "NÍVEL 1 - GRAÇA FELINA",
                    descricao: "O vampiro ganha equilíbrio e elegância iguais ou superiores às dos melhores trapezistas do mundo. Ele pode caminhar ou até correr sobre saliências e cabos sem esforço e manter o equilíbrio sobre suportes mais estreitos.\nCusto: Gratuito\nSistema: O usuário passa automaticamente em qualquer rolagem baseada em Destreza ou Atletismo necessária para manter o equilíbrio. Note que este poder não permite que o usuário se equilibre em suportes que não aguentem seu peso.\nDuração: Passiva"
                },
                {
                    nome: "NÍVEL 1 - REFLEXOS RÁPIDOS",
                    descricao: "Apesar de seus corpos ainda não serem capazes de desafiar as leis da natureza, os vampiros com este poder percebem eventos instantaneamente e podem reagir com presteza sobre-humana. Eles conseguem desviar de projéteis em movimento de poderem tentar se esquivar de flechas e até mesmo balas quando não dispõe de cobertura.\nCusto: Gratuito\nSistema: Com este poder, vampiros não sofrem penalidades em suas paradas de defesa por conta de falta de cobertura contra ataques feitos por Armas de Fogo. Eles também podem realizar uma ação menor (ver pág. 298) que valha até dois dados por turno, tal como preparar e recarregar uma arma.\nDuração: Passiva"
                },

                {
                    nome: "NÍVEL 2 - RAPIDEZ",
                    descricao: "Seu domínio de Celeridade agora permite que o vampiro se mova e reaja com velocidade atordoante.\nCusto: Uma Checagem de Sangue\nSistema: Adicione o valor de Celeridade à parada de dados de Destreza do usuário em testes de Destreza não relacionados à combate.\nUma vez por turno, o usuário também pode usar isso ao se defender com Destreza + Atletismo.\nDuração: Uma cena"
                },

                {
                    nome: "NÍVEL 3 - PISCADELA",
                    descricao: "O vampiro se projeta rapidamente de um oponente, confrontando-o ou escapando dele num piscar. Para um observador despreparado, o usuário parece quase se teleportar; uma rajada de vento sendo o único sinal da sua passagem.\nCusto: Uma Checagem de Sangue\nParadas de Dados: Destreza + Atletismo, ou conforme a necessidade\nSistema: O vampiro se move em linha reta até um alvo, cobrindo qualquer distância de até 50 metros, e ainda tem tempo para realizar uma ação, como atacar, durante o turno.\nSe o terreno for de algum modo perigoso, o personagem precisará realizar uma rolagem de Destreza + Atletismo para evitar tropeçar e parar no meio do caminho. O Narrador pode pedir outras disputas conforme a necessidade, especialmente se o vampiro estiver correndo contra um oponente distante para alcançar um objeto ou ação. Vampiros que se deslocam para atacar um inimigo com este poder agem como se já estivessem lutando com ele quando o turno tem início.\nDuração: Um turno"
                },

                {
                    nome: "NÍVEL 3 - TRAVESSIA",
                    descricao: "O vampiro pode correr ou escalar qualquer superfície com velocidade estonteante, incluindo superfícies verticais e até mesmo líquidas. Apesar de Travessia não conceder tração sobrenatural como a de insetos, correr ao longo de muros ou paredes acima impõe pouca dificuldade. Caminhar sobre água continua sendo impossível, mas o vampiro pode correr sobre água por uma distância limitada se tiver pego impulso.\nCusto: Uma Checagem de Sangue\nParada de Dados: Destreza + Atletismo\nSistema: Faça uma rolagem de Destreza + Atletismo com Dificuldade entre 3 (superfície inclinada com tração) e 6 (superfície vertical lisa ou extensão de água), dependendo da superfície e do ângulo.\Cada ponto de margem leva o vampiro mais longe: margem 0 leva a um alvo próximo, margem 1 a um alvo a maior distância, e assim por diante. O Narrador deve informar o jogador de antemão se um alvo está distante demais para travessia. Como regra geral, qualquer coisa sobre água e a mais de 60 metros (ou acima de 30 andares em uma construção) provavelmente excede o alcance deste poder.\nDuração: Um turno"
                },

                {
                    nome: "NÍVEL 4 - ELEGÂNCIA DIRETO DA FONTE",
                    descricao: "O sangue do vampiro fica saturado com o poder de Celeridade, repassando parte desse poder a qualquer um que beba dele. Embora esse ato também seja um primeiro passo para um Laço de Sangue, escravos ou servos já enlaçados não precisam se preocupar, e até mesmo aliados não enlaçados podem decidir arriscar um gole para experimentar o poder temporariamente.\nCusto: Uma Checagem de Sangue\nSistema: Beber diretamente do usuário uma quantidade de Sangue equivaente a uma Checagem de Sangue presenteia o bebedor com Celeridade temporária equivalente à metade dos pontos de Celeridade (arredondando para baixo) do doador. O bebedor ganha os mesmos poderes não amálgama do doador, até aquele nível.\nDuração: Uma noite; para vampiros, até a próxima alimentação ou até o vampiro alcançar Fome 5"
                },

                {
                    nome: "NÍVEL 4 - MIRA INFALÍVEL",
                    descricao: "Amálgama: Auspícios 2\n\nCom o mundo ao seu redor desacelerando até quase parar, o vampiro pode mirar e arremessar ou disparar qualquer arma em um alvo como se este estivesse parado.\nCusto: Uma Checagem de Sangue\nSistema: Use antes de realizar um ataque. O alvo não faz nenhuma rolagem para esquivar ou defender; realize o ataque com Dificuldade 1. Um oponente com Celeridade 5 pode anular este poder realizando sua própria Checagem de Sangue e se defendendo com a mesma velocidade.\nDuração: Um único ataque"
                },

                {
                    nome: "NÍVEL 5 - FRAÇÃO DE SEGUNDO",
                    descricao: "A velocidade com que o vampiro se movimenta alcança a da sua percepção sobrecarregada, o que permite que ele reaja a eventos de imediato. Emboscadores são emboscados por sua própria presa e favores pedidos são realizados antes que as palavras deixam as bocas dos suplicantes.\nCusto: Uma Checagem de Sangue\nSistema: O jogador pode substituir a narração dos eventos feita pelo Narrador, dentro do razoável. Ele pode dizer que seu personagem atravessa uma porta antes que ela se feche, evita uma emboscada após ela ter começado, sai do caminho de uma explosão, etc. A ação executada deve ser razoável e não pode levar mais do que alguns segundos de tempo real para ser completada. O Narrador decide quais Habilidades, se houver alguma, precisam ser testadas para que a ação iniciada com este poder seja bem-sucedida.\nDuração: Aproximadamente uma ação, conforme determinado pelo Narrador."
                },

                {
                    nome: "NÍVEL 5 - GOLPE RELÂMPAGO",
                    descricao: "Mais rápido do que a visão, o vampiro pode atacar com os punhos ou armas brancas tão rapidamente que o oponente é incapaz de se defender ou realizar uma ação evasiva.\nCusto: Uma Checagem de Sangue\nSistema: Use antes de realizar um ataque com Briga ou Armas Brancas. O oponente não faz nenhuma rolagem para esquivar ou defender; realize o ataque com Dificuldade 1. Um oponente que possua Celeridade 5 pode anular este poder realizando sua própria Checagem de Sangue e se defendendo na mesma velocidade.\nDuração: Um único ataque"
                }
            ]
        },
        {
            nome: "Dominação",
            descricao: "Alcunhas: Encantamento de Serpentes, Mesmerismo, Mentis Imperium\n\nDominação concede ao vampiro o poder de controlar as ações de terceiros, manipular suas memórias e forçá-los a realizar ações que não realizariam por vontade própria. Em sua forma mais básica, capacita um vampiro a fazer com que uma vítima esqueça a alimentação que acabou de suportar ou aproveitar. Em sua faceta mais perigosa, permite que os Membros escravizem multidões inteiras de gado. Trata-se da Besta no que tem de mais cruel e controlador.\nDominação age como um cacetete no policiamento da Máscara, cria servos submissos e reforça a autoconfiança do vampiro. Ao usarem esta Disciplina, os Membros se sentem omnipotentes, embora os mais sábios saibam que isso também pode ser uma forma de algema, que o Sangue desliza por seus braços e pernas.\n\nCaracterísticas\nA maioria dos poderes de Dominação requer contato visual com a vítima. Uma vez estabelecido esse contato, Dominação retém o olhar da vítima até o usuário emitir seu comando ou comandos, salvo interferência. Prender o olhar de alguém que esteja tentando evitar os olhos do vampiro requer uma disputa de Determinação + Intimidação do usuário contra Raciocínio + Percepção do alvo. Naturalmente, é impossível prender a atenção de alguém com os olhos fechados ou vendados, embora isso o torne vulnerável a outras táticas.\nO uso de Dominação em combate ou em situações agitadas é limitado a pessoas atacando ou interagindo de outro modo direto com o usuário, dado a atenção dos demais estar firmemente concentrada nos seus próprios conflitos.\nA menos que o usuário tenha à disposição meios sobrenaturais como Telepatia (Auspícios 5), ele deve comandar a vítima verbalmente. A vítima deve ser capaz de ouvir o usuário e entender sua língua.\nSem Decreto Terminal (Dominação 5), comandos que resultem em morte óbvia ou danos graves falham automaticamente. Alvos rolam para resistir a comandos que resultem em outros prejuízos sociais ou físicos (como ficar nu em público), comandos que façam o personagem ir contra suas Convicções, ou aqueles que teriam afeitos negativos para seus Pilares ou seus relacionamentos com eles. Consulte os poderes individuais para maiores detalhes. Vampiros não podem usar Dominação para extrair informações, pois a vítima se torna uma marionete sem cérebro sob a influência desta Disciplina. Por exemplo, o comando 'Fale', de Compleir, resultaria em uma tagarelice sem sentido, enquanto alguém Mesmerizado, a quem seja ordenado que diga o que sabe sobre o assassino literalmente diria 'o que sabe sobre o assassino'. Dominação não pode obrigar suas vítimas a fazer algo que não poderiam fazer sob ordens, como 'Durma'. Em últimos casos, o Narrador determina o que a Disciplina é capaz de realizar, mas deve cuidar para que Dominação continue sendo apenas uma Disciplina entre outras, e não a solução final para todos os problemas.\nDominação está no centro da predação e domínio vampíricos. Portanto, os vampiros devem resistir às tentativas de ser dominados. Um vampiro de geração mais baixa (mais forte) pode resistir a tentativas de Dominação feitas por vampiros de gerações mais altas com o gasto de um ponto de Força de Vontade, anulando o efeito completamente.\nNo caso de uma falha total em uma rolagem de qualquer poder de Dominação, o vampiro fica incapaz de Dominar o mesmo alvo pelo restante da história.\nDominação ameaça diretamente a Humanidade de um vampiro, especialmente se ele possui qualquer príncipio que envolve liberdade ou proíba violações da integridade humana. Usar esta Disciplina pode resultar em Máculas (pág. 239).\nTipo: Mental\nAmeaça à Máscara: Baixa. Tirando alguém que tente Dominar toda uma multidão para que salte do Corcovado, Dominação continua sendo uma das mais sutis Disciplinas vampíricas.\nRessonância de Sangue: Fleumática. O sangue do submisso ou do dominador, mestres e escravos, capitães da indústria, os poderes, líderes e seguidores de cultos.",
            poderes: [
                {
                    nome: "NÍVEL 1 - COMPELIR",
                    descricao: "Estabelecido contato visual, o vampiro pode ordenar que sua vítima realiza uma única ação, emitindo um comando que não seja maior do que uma sentença curta e possa ser completado em um único turno, a ser obedecido ao pé da letra. O narrador decide se interpretará comandos ambíguos de um modo inesperado ou desfavorável; uma opção é o comando simplesmente confundir a vítima e falhar.\nCusto: Gratuito\nParada de Dados: Carisma + Dominação vs. Inteligência + Determinação\nSistema: Nenhuma rolagem é necessária contra uma vítima mortal despreparada. Comandar uma vítima que resista, uma que o vampiro já tenha Dominado na mesma cena, ou outro vampiro requer uma disputa de Carisma + Dominação vs. Inteligência + Determinação. Comandos contrários à natureza da vítima também requerem uma disputa.\nDuração: Não mais do que uma única cena."
                },
                {
                    nome: "NÍVEL 1 - NUBLAR MEMÓRIA",
                    descricao: "Ao proferir a frase 'Esqueça!', o usuário pode fazer com que a vítima Dominada esqueça tanto o momento atual quanto os últimos minutos, o bastante para mascarar uma alimentação superficial ou um encontro casual. Nenhuma memória nova é formada e, se pressionada, a vítima perceberá que sofreu um apagão de alguns minutos.\nCusto: Gratuito\nParadas de Dados: Carisma + Dominação vs. Raciocínio + Determinação\nSistema: Nenhuma rolagem é exigida contra uma vítima mortal despreparada. Nublar a memória de uma vítima que resista ou de outro vampiro requer uma rolagem de Carisma + Determinação vs. Raciocínio + Determinação.\nDuração: indefinida."
                },
                {
                    nome: "NÍVEL 2 - DEMENTAÇÃO",
                    descricao: "Amálgama: Ofuscação 2\n\nEsse poder sutil não requer mais do que uma conversa casual, pois a influência insidiosa do vampiro se esconde nas entrelinhas e inflexões empregadas. A vítima fica cada vez mais agitada, conforme seus demônios internos borbulham até a superfície, eventualmente afogando toda a sua razão.\nCusto: Uma Checagem de Sangue por cena\nParada de Dados: Manipulação + Dominação vs Autocontrole + Inteligência\nSistema: Após iniciar uma conversa com a vítima, o usuário pode ativar esse poder. Enquanto a cena durar, ele poderá atacar um único indivíduo a cada turno em um conflito de Manipulação + Dominação vs Autocontrole + Inteligência, causando dano Superficial à Força de Vontade. Um mortal que fique Debilitado por causa deste poder experimenta um ataque nervoso ou um surto psicótico, cuja forma e natureza dependem da sua personalidade (e, talvez, da Ressonância de Sangue). Um vampiro que fique Debilitado por este poder deve imediatamente sucumbir a uma Compulsão escolhida pelo usuário.\nSe o usuário deseja afetar mais que uma vítima, ele precisa realizar uma Checagem do Sangue para cada uma.\nDuração: Uma cena"
                },
                {
                    nome: "NÍVEL 2 - MESMERISMO",
                    descricao: "O vampiro pode emitir comandos complexos para uma vítima, contanto que detenha o olhar dela e haja silêncio suficiente para que a ordem seja ouvida. As instruções devem ser executadas imediatamente o melhor que a vítima for capaz, e não devem conter quaisquer ações condicionais ('...caso você veja o Enrique, dê-lhe o documento'), já que isso exigiria que a vítima exercesse sua cognição.\nCusto: Uma Checagem de Sangue\nParada de Dados: Manipulação + Dominação vs Inteligência + Determinação.\nSistema: Nenhuma rolagem é necessária contra uma vítima mortal despreparada. Comandar uma vítima que resista ou outro vampiro requer uma disputa de Manipulação + Dominação vs. Inteligência + Determinação. Comandos contrários a natureza da vítima também requerem uma disputa.\nDuração: Até que o comando ser executado ou que a cena terminar, o que acontecer primeiro."
                },
                {
                    nome: "NÍVEL 3 - DIRETRIZ SUBMERSA",
                    descricao: "Ao usar Mesmerismo, o vampiro agora é capaz de implantar uma sugestão pós-hipnótica, o que permite que o comando fique dormente até a ocorrência de um estímulo específico. Esse gatilho pode ser qualquer coisa, de uma data específica ou uma pessoa ('Quando você encontrar Ronaldo, diga a ele essas palavras'), à audição de uma frase específica. A Diretriz Submersa nunca expira; é concebível que suas vítimas circulem por aí com uma ordem enterrada em suas mentes por anos. O usuário só pode emitir uma sugestão por vítima.\nCusto: Nenhum custo adicional\nSistema: Como Mesmerismo, embora o Narrador possa querer realizar rolagens em segredo. Não tem como saber se a sugestão submersa funciona até que a condição de seu acionamento ocorra.\nDuração: Passiva"
                },
                {
                    nome: "NÍVEL 3 - A MENTE ESQUECIDA",
                    descricao: "O vampiro pode reescrever fragmentos inteiros de memória da vítima, contanto que possa deter o olhar e a atenção completa e ininterrupta dela. O vampiro descreve verbalmente as novas memórias da vítima, que são aceitas por ela como se fossem suas. Este poder não permite que o usuário investigue as memórias verdadeiras da vítima; ele se parece mais com uma tatuagem reparadora.\nCusto: Uma Checagem do Sangue\nParada de Dados: Manipulação + Dominação vs Inteligência + Determinação\nSistema: O usuário rola uma disputa de Manipulação + Dominação vs Inteligência + Determinação. Cada ponto da margem permite que o usuário adicione ou remova uma memória extra. A vítima se lembra das edições como ideias vagas e nebulosas que podem ser desmascaradas sob um interrogatório minucioso. Uma vitória crítica cria uma gravação impecável, tão real quanto qualquer memória verdadeira.\nDuração: Indefinida"
                },
                {
                    nome: "NÍVEL 4 - RACIONALIZAR",
                    descricao: "As vítimas do vampiro agora acreditam que tudo o que fazem sob a influência de Dominação é resultado da sua própria vontade, e defendem suas ações, não improta o quão absurdas. Exposição prolongada a este poder pode resultar em traumas mentais graves à vítima. \nCusto: Nenhum custo adicional\nSistema: Se pressionada a respeito de sua crença, a vítima pode realizar um teste de Raciocínio + Percepção (Dificuldade 5). Uma vitória faz com que questione sua afirmação, e, possivelmente, sua sanidade.\nDuração: Indefinida"
                },
                {
                    nome: "NÍVEL 5 - DECRETO TERMINAL",
                    descricao: "Livre do obstáculo do instinto de autopreservação das suas vítimas, agora o vampiro pode emitir comandos que as levem a se ferir ou até morrer. Mortais podem ser obrigados a explodir seus próprios miolos, saltar de telhados ou ingerir veneno. Vampiros podem, com um pouco de esforço, ser forçados a se expor ao fogo ou luz solar.\nCusto: Nenhum custo adicional em Fome, porém o custo em Humanidade é potencialmente grave.\nSistema: Comandos terminais agora devem ser resistidos (veja os poderes individuais para as rolagens envolvidas), ao invés de falharem automaticamente.\nDuração: Passiva."
                },
                {
                    nome: "NÍVEL 5 - MANIPULAÇÃO EM MASSA",
                    descricao: "O vampiro pode comandar aglomerações inteiras de mortais, e, em alguns casos, até grupos de vampiros. O vampiro pode usar este poder tanto para dar instruções quanto para manipular memórias.\nCusto: Uma Checagem do Sangue, além do custo do poder amplificado.\nSistema: O vampiro pode amplificar qualquer um dos seus outros poderes para afetar um grupo mortais ou vampiros. Todas as vítimas precisam ver os olhos do usuário. O usuário realiza qualquer rolagem necessária contra o oponente mais forte do grupo.\nDuração: A mesma do poder amplificado."
                }
            ]
        },
        {
            nome: "Fortitude",
            descricao: "Apelidos: Murar, Pele de Pedra, Resistentia\n\nMuito estimada pelos imortais, a Fortitude concede o poder de resistir a ataques físicas e mentais. Poucos vampiros sobrevivem mais do que um século sem ao menos um ponto de Fortitude, especialmente em um mundo onde a violência é comum e nem mesmo os Membros estão a salvo. Nas noites de hoje, menos vampiros usam Fortitude para resistir ao sol do que a ataques violentos, ao fogo e coerção sobrenatural.\nAqueles que possuem Fortitude exemplificam os pilares impassíveis da sociedade dos Membros, sendo capazes, como são, de aguentar golpes e encantamentos sem se mover ou demonstrar sinais de desgaste. Poucos vampiros se sentem tão seguros em sua imortalidade como os anciões Sangue Azul e Ferais.\n\nCaracterísticas\nTipo: Física\nAmeaça à Máscara: Média. Sem dúvida testemunhas reagem ao verem alguém que tome uma surra fatal ou uma saraivada de balas e se erga aparentemente ileso. |Explicações favoritas incluem lembranças imprecisas devidas ao susto (as balas só pareceram acertar), efeitos especiais (pegadinhas de YouTube), ou a racionalizações do tipo 'devia estar drogada'.\nRessonância do Sangue: Melancólico. Sobreviventes da guerra, abuso ou desgraças; maratonistas; alpinistas; soldados e forças especiais; pessoas com sistemas imunológicos muito poderosos.",
            poderes: [
                {
                    nome: "NÍVEL 1 - MENTE INESCRUTÁVEL",
                    descricao: "O usuário ganha o poder místico de resistir a qualquer tentativa de influenciá-lo por meio de encantos comuns, coerção e artimanhas. Alguns exibem sua Mente Inescrutável na forma de uma calma zen, enquanto outros de uma obstinação sobrenatural.\nCusto: Gratuito\nSistema: O usuário adiciona uma quantidade de dados extras igual ao seu valor em Fortitude a todas as rolagens feitas para resistir à coerção, intimidação, sedução, ou qualquer outra tentativa de influenciá-lo contra sua vontade. Este poder também funciona contra outros poderes, como Dominação e Presença.\nDuração: Passiva"
                },
                {
                    nome: "NÍVEL 1 - RESILIÊNCIA",
                    descricao: "Dotado de resistência sobrenatural, o usuário pode fortalecer a sua Vitalidade.\nCusto: Gratuito\nSistema: O usuário adiciona seu valor de Fortitude à sua trilha de Vitalidade.\nDuração: Passiva"
                },
                {
                    nome: "NÍVEL 2 - FERAS TENAZES",
                    descricao: "Amálgama: Animalismo 1\n\nO usuário compartilha uma pequena porção de sua resistência antinatural com os animais que ele influencia. Tanto enxames quanto grandes feras exibem uma resistência a pequenos ferimentos quase igual à do próprio vampiro.\nCusto: Gratuito (para famulur); Uma Checagem de Sangue (para outros animais)\nParada de Dados: Vigor + Animalismo (para animais que não sejam famuli)\nSistema: O vampiro pode decidir estender alguns dos seus poderes de Fortitude a animais afetados por seu Animalismo. Qualquer animal assim imbuído ganha uma quantidade de níveis de Vitalidade adicional igual ao valor que o vampiro tem em Fortitude. Usar este poder em seu famulus não tem custo e é automático. Para imbuir outros animais além do famulus, o usuário deve realizar uma Checagem de Sangue e um teste de Vigor + Animalismo (Dificuldade 3). É possível fortificar um animal por ponto da margem. Quando o efeito for encerrado, remova a Vitalidade não marcada primeiro; o pode resultar na morte do animal.\nDuração: Uma cena."
                },
                {
                    nome: "NÍEL 2 - TENACIDADE",
                    descricao: "Todos os vampiros com este poder exibem uma capacidade inata de ignorar dano que, de outro modo, incomodaria ou mesmo debilitaria outros da sua espécie. Apesar deste poder sozinho não conceder proteção contra Perdições e outras formas de dano Agravado, a proteção que ele confere aumenta a longo prazo.\nCusto: Uma Checagem de Sangue\nSistema: Subtraia a Fortitude do defensor de todo dano Superficial que ele sofrer. Isso ocorre antes do dano ser diminuído pela metade, e não pode reduzi-lo a menos de um.\nDuração: Uma cena"
                },
                {
                    nome: "NÍVEL 3 - DESAFIO À PERDIÇÃO",
                    descricao: "Ao se preparar com um uso deste poder, o vampiro pode ficar temporariamente resistente ao fogo e a luz do sol, bem como a outros ferimentos graves que o ameacem com a Morte Final.\nCusto: Uma Checagem de Sangue\nParada de Dados: Raciocínio + Sobrevivência (para ativar por reflexo)\nSistema: Ao sofrer dano Agravado, o usuário pode converter uma quantidade igual ao seu valor em Fortitude desse dano em dano Superficial. Ele não pode curar o dano convertido em Superficial pelo restante da cena. Este poder converte uma quantidade de dano por cena, não por ferimento ou por ataque.\nUma vez expirado esse poder,o usuário pode renová-lo fazendo outra Checagem de Sangue. Quando colocado em perigo inesperadamente e receber dano Agravado, poderá ativar este poder com um reflexo, rolando Raciocínio + Sobrevivência (Dificuldade 3). Se falhar, o poder não será ativado; se for bem-sucedido, deverá realizar uma Checagem de Sangue para pagar pelo uso.\nDuração: Uma cena ou até o poder expirar, o que ocorrer primeiro."
                },
                {
                    nome: "NÍVEL 3 - FORTIFICAR A FACHADA INTERIOR",
                    descricao: "Em vez de endurecer a estrutura física do vampiro, este poder permite que ele proteja seus pensamentos e emoções de escrutínio sobrenatural. Sua mente parece estar completamente vazia, enquanto sua aura parece, por falta de termo mais adequado, insípida.\nCusto: Gratuito\nSistema: Aumenta a Dificuldade de usar Perscrutar a Alma (Auspícios 3), Telepatia (Auspícios 5) e poderes do mesmo tipo no usuário em metade do valor que ele possui em Fortitude (arredondado para cima). Se as regras permitirem que ele resista a esses poderes, em vez de aumenta a Dificuldade do uso deles, conforme explicado, ele adicionará seu valor de Fortitude às paradas de dados usadas para acionar aqueles poderes.\nDuração: Uma cena."
                },
                {
                    nome: "NÍVEL 4 - RESISTÊNCIA DIRETO DA FONTE",
                    descricao: "O Sangue do vampiro fica saturado com o poder da Fortitude, transmitindo parte desse poder a qualquer um que beba dele. Este é o equivalente para Fortitude de Elegância Direto da Fonte (pág. 254).\nCusto: Uma Checagem de Sangue\nSistema: Beber o equivalente a uma Checagem de Sangue diretamente do usuário concede ao bebedor Fortitude temporária igual à metade dos pontos de Fortitude do doador (arredondado para baixo). O bebedor ganha os mesmos poderes que o doador tem, até aquele nível.\nDuração: Uma noite; para vampiros, até a próxima alimentação ou até o vampiro alcançar Fome 5"
                },
                {
                    nome: "NÍVEL 5 - PELE DE MÁRMORE",
                    descricao: "O poder do Sangue faz com que a pele do vampiro endureça, adquirindo um brilho semelhante ao do mármore, apesar de flexível e capaz de parar praticamente quase qualquer golpe antes de quebrar momentaneamente e se refazer. Um vampiro que use este poder é quase impossível de destruir completamente, salvo por um golpe de sorte ou restrição física.\nCusto: Duas Checagens de Sangue\nSistema: Com este poder ativo, o vampiro ignora a primeira fonte de dano físico que o atingir em cada turno, incluindo fogo, mas não luz solar. Se surgir alguma dúvida sobre qual fonte é a 'primeira', o Narrador decide baseado na narrativa ou o vampiro ignora a fonte única causadora de maior dano naquele turno. Uma vitória crítica em uma rolagem de ataque ignora supera este poder.\nDuração: Uma cena"
                },
                {
                    nome: "NÍVEL 5 - PODER VINDO DA DOR",
                    descricao: "Agora ferimentos e debilitações só alimentam os poderes do vampiro, que fica mais forte e veloz a cada golpe recebido. Somente a destruição total pode parar aquele que emprega este poder de Fortitude.\nCusto: Uma Checagem de Sangue\nSistema: Ao ativar este poder, o vampiro para de sofrer quaisquer penalidades de dados derivadas de dano à Vitalidade que ele tenha sofrido, como a penalidade de Debilitação. Além disso, ele pode aumentar um Atributo Físico em um ponto (características derivadas não são afetadas) para cada nível de dano em sua trilha de Vitalidade, Agravado ou Superficial. Os Atributos do usuário não podem exceder um valor igual ao seu Surto de Sangue + 6 por meio deste poder. "
                }
            ]
        },
        {
            nome: "Ofuscação",
            descricao: "Apelidos: Furtivo, Encapuzado, Disfarçado, Oculto.\n\nPara qualquer caçador a habilidade de se esconder, mover sem ser visto e se camuflar se mostra vital.\nPara os Membros praticantes de Ofuscação a Disciplina concede a cobertura perfeita para se aproximar de uma vítima, disfarçar-se como alguém inofensivo e escapar quando a coisa fica quente demais.\n\nPeritos em Ofuscação podem utilizar a Disciplina para esgueirar-se nas sombras enquanto espionam, mudar de aparência na multidão enquanto estão sendo vigiados e até espalhar o dom para um grupo de vampiros procurando esconderijo.",
            poderes: [
                {
                    nome: "NÍVEL 1 - MANTO DE SOMBRAS",
                    descricao: "Permanecendo perfeitamente imóvel, o usuário se mistura com o ambiente.\n\nEnquanto ele tiver qualquer tipo de cobertura, não fizer barulho e não se mover, só pode ser detectado através de meios mecânicos e sobrenaturais.\n\nCusto: Grátis.\nSistema: Siga as regras gerais de Ofuscação. O efeito dura até que o usuário se mova ou seja detectado por outros meios.\nDuração: Uma cena."
                },

                {
                    nome: "NÍVEL 1 - SILÊNCIO DA MORTE",
                    descricao: "Popular entre os Banu Haqim, esse poder silencia completamente o usuário, anulando todos os sons emitidos por ele.\n\nAssim como os outros poderes de Ofuscação, este só funciona em pessoas dentro do alcance de voz e não engana microfones e outros detectores de sons eletrônicos.\n\nCusto: Grátis.\nSistema: O usuário silencia seus passos, roupas, pequenas colisões e outros sons advindos de si mesmo.\nDuração: Uma cena."
                },

                {
                    nome: "NÍVEL 2 - PASSAGEM INVISÍVEL",
                    descricao: "Com esse poder o vampiro pode agora se mover por aí enquanto permanece oculto.\n\nO usuário é funcionalmente invisível, apesar das limitações comuns de Ofuscação.\n\nCusto: Um Rouse Check.\nSistema: Enquanto o usuário não emitir cheiros muito fortes ou sons mais altos que um sussurro, este poder funciona automaticamente.\nDuração: Uma cena ou até ser detectado."
                },

                {
                    nome: "NÍVEL 3 - FANTASMA NA MÁQUINA",
                    descricao: "O usuário agora pode transmitir os efeitos da Ofuscação através de mídias eletrônicas.\n\nIsso permite que o vampiro apareça invisível ou disfarçado em transmissões ao vivo.\n\nCusto: Sem custo adicional.\nSistema: Observadores adicionam +3 na dificuldade de testes para identificar o usuário em gravações.\nDuração: A do poder usado em conjunto."
                },

                {
                    nome: "NÍVEL 3 - MÁSCARA DE MIL FACES",
                    descricao: "Ao invés de desaparecer, o vampiro pode tomar a aparência de um estranho ordinário.\n\nEsse poder permite que o usuário interaja e se comunique normalmente.\n\nCusto: Um Rouse Check.\nSistema: Qualquer um que olhar o vampiro verá um rosto esquecível do mesmo gênero, porte e altura aproximados do usuário.\nDuração: Uma cena."
                },

                {
                    nome: "NÍVEL 4 - DESAPARECER",
                    descricao: "Pré-requisito: Manto das Sombras.\n\nO vampiro pode ativar Manto das Sombras e Passagem Invisível mesmo enquanto estiver sob observação direta.\n\nCusto: O mesmo do poder aumentado.\nParada de Dados: Raciocínio + Ofuscação vs Raciocínio + Prontidão.\nDuração: O mesmo do poder aumentado."
                },

                {
                    nome: "NÍVEL 4 - OCULTAR",
                    descricao: "Amálgama: Auspícios 3.\n\nPermite ocultar um objeto inanimado como uma porta, carro ou casa pequena.\n\nCusto: Um Rouse Check.\nParada de Dados: Inteligência + Ofuscação.\nDuração: Uma noite, com uma noite adicional por sucesso extra."
                },

                {
                    nome: "NÍVEL 5 - DISFARCE DO IMPOSTOR",
                    descricao: "Pré-requisito: Máscara das Mil Faces.\n\nCom preparo, o vampiro pode assumir a aparência de um indivíduo específico.\n\nCusto: Um Rouse Check.\nParada de Dados: Raciocínio + Ofuscação, Manipulação + Performance.\nDuração: Uma cena."
                },

                {
                    nome: "NÍVEL 5 - OCULTAR O GRUPO",
                    descricao: "O vampiro pode abrigar seus companheiros sob o manto de Ofuscação.\n\nCusto: Um Rouse Check além do custo do poder estendido.\nSistema: Estende poderes de Ofuscação para aliados voluntários.\nDuração: O mesmo do poder estendido."
                }
            ]
        },
        {
            nome: "Potência",
            descricao: "Apelidos: Bruto, Poderio do Sangue.\n\nExiste um ditado popular entre os membros do Clã Brujah: “Você só subestima nossa força uma vez.” Potência é uma força movida por vitae além da capacidade de outros vampiros. Mais poderosa do que qualquer droga anabolizante, mas mais não-natural do que o físico de qualquer bodybuilder, Potência é a Besta liberta através dos punhos, pés, membros, e o poder corporal cru do vampiro. A Disciplina é usada para mais coisas além de bater em coisas, apesar de cumprir muito bem essa tarefa. É a habilidade do vampiro de forçar seu corpo a fazer coisas que seriam impossíveis para os mortais replicar. Potência supera as outras Disciplinas no quesito incongruência, um Nosferatu aparentemente velho que golpeia mais forte que um mortal peso pesado ou um Brujah Abraçado ainda criança que pode decapitar um alvo com um único corte.\n\nCaracterísticas\nTipo: Físico.\nAmeaça à Máscara: Média para alta. Pequenas demonstrações da Disciplina podem passar como “força absurda”, mas assim que o pavimento rachar e prédios começarem a desabar essa explicação perde a pouca credibilidade que tem.\nRessonância de Sangue: Colérico. Os fortes e saudáveis; atletas e jovens homens e mulheres no seu auge, ratos de academia, lutadores de luta livre, trabalhadores da construção civil e lenhadores, descarregadores.",
            poderes: [
                {
                    nome: "NÍVEL 1 - CORPO LETAL",
                    descricao: "Usando esse poder, o usuário é capaz de causar dano assustador a mortais, rasgando pele e quebrando ossos com a mão nua.\n\nCusto: Grátis.\nSistema: Os ataques desarmados do usuário agora podem causar dano Agravado à Vitalidade de mortais, se desejado. Ele também ignora um nível de armadura por nível de Potência do usuário.\nDuração: Passiva."
                },
                {
                    nome: "NÍVEL 1 - SALTO VERTIGINOSO",
                    descricao: "Possuindo uma força profana não apenas nos seus braços e punhos, o usuário pode saltar muito mais alto e distante do que qualquer mortal.\n\nCusto: Grátis.\nSistema: O usuário pode pular um número de metros igual a três vezes seu nível de Potência verticalmente, e cinco vezes seu nível de Potência horizontalmente. O usuário não precisa pegar impulso para fazer esses saltos.\nDuração: Passiva."
                },
                {
                    nome: "NÍVEL 2 - PODERIO",
                    descricao: "Vampiros com Potência ganham uma força muito maior do seu Sangue do que os que não a têm.\n\nCusto: Uma Checagem de Sangue.\nSistema: Quando ativado, adicione o valor de Potência do usuário ao seu valor de dano desarmado, bem como às suas façanhas de Força.\nDuração: Uma cena."
                },
                {
                    nome: "NÍVEL 3 - ALIMENTAÇÃO BRUTAL",
                    descricao: "Conhecido como o “Beijo Selvagem”, este poder permite que o usuário empregue uma profana força interior quando estiver drenando o sangue da vítima. Em meros segundos, o atacante engole torrentes de sangue enquanto está ferindo sua vítima.\n\nCusto: Grátis.\nSistema: O vampiro pode drenar um humano completamente em segundos, geralmente dentro de um único turno. Cada ponto de Fome saciado causa um ponto de dano Agravado à Vitalidade da vítima. Usar Alimentação Brutal em um vampiro causa apenas dano Superficial. Em combate, Alimentação Brutal vem imediatamente depois de um ataque de Briga bem sucedido usando as presas.\nDuração: Uma alimentação."
                },
                {
                    nome: "NÍVEL 3 - CENTELHA DA FÚRIA",
                    descricao: "Amálgama: Presença 3.\n\nCombinando Potência e Presença, o vampiro pode incitar raiva e até frenesi em espectadores tão facilmente quanto admiração ou terror.\n\nCusto: Um Checagem de Sangue.\nParada de Dados: Manipulação + Potência.\nSistema: Quando ativo, o usuário pode adicionar seu valor de Potência a qualquer tentativa de irritar ou incitar uma pessoa ou multidão à violência. Contra vampiros, pode forçar um teste de frenesi de fúria com Dificuldade 3.\nDuração: Uma cena."
                },
                {
                    nome: "NÍVEL 3 - PEGADA SOBRENATURAL",
                    descricao: "Focando sua força sobrenatural nos dedos das mãos e pés, o vampiro consegue escalar paredes e tetos, mesmo sem suporte.\n\nCusto: Uma Checagem de Sangue.\nSistema: O vampiro é automaticamente bem sucedido em testes para escalar superfícies não metálicas. Também pode se pendurar em paredes ou tetos por até uma cena. Isso deixa rastros visíveis de dano na superfície.\nDuração: Uma cena."
                },
                {
                    nome: "NÍVEL 4 - FORÇA DIRETO DA FONTE",
                    descricao: "O Sangue do vampiro fica saturado com o poder da Potência, conferindo parte desse poder a quem o beber.\n\nCusto: Uma Checagem de Sangue.\nSistema: Beber o equivalente a Uma Checagem de Sangue diretamente do usuário concede Potência temporária igual à metade da Potência do doador (arredondado para baixo), incluindo seus poderes até aquele nível.\nDuração: Uma noite; para vampiros, até a próxima alimentação ou Fome 5."
                },
                {
                    nome: "NÍVEL 5 - PUNHO DE CAIM",
                    descricao: "As mãos nuas do vampiro podem infligir ferimentos graves, letais tanto para mortais quanto para outros vampiros.\n\nCusto: Uma Checagem de Sangue.\nSistema: Por uma cena, o usuário pode infligir dano Agravado à Vitalidade de mortais e seres sobrenaturais usando Briga. Ele literalmente rasga carne e rompe membros com as mãos nuas.\nDuração: Uma cena."
                },
                {
                    nome: "NÍVEL 5 - TERREMOTO",
                    descricao: "Sua força torna-se energia elemental. O vampiro pode bater no chão, criando uma onda de choque que derruba os oponentes.\n\nCusto: Duas Checagem de Sangue.\nSistema: Qualquer um em um raio de cinco metros deve fazer um teste de Destreza + Esportes (Dificuldade 3). Falhas derrubam o alvo. O poder causa dano colateral massivo em pisos, paredes e estruturas. Só pode ser usado uma vez por cena.\nDuração: Um uso."
                }
            ]
        },
        {
            nome: "Presença",
            descricao: "Apelidos: Super-estrelato, Encantamento, Sublimitas.\n\nA maioria dos vampiros são criaturas de graça e letalidade. Associado com violência aterradora e beleza devastadora, o Membro incorpora opostos, alternando entre pesadelos e sonhos dependendo do observador e do capricho do vampiro. Presença é uma disciplina que expressa essa existência bipolar. Usada para atrair vítimas ou dispersá-las em medo, Presença permite controle de massas, manipulação emocional e devoção forçada. O maior medo de um mortal poderia aparecer na frente dele e subitamente parecer a criatura mais radiante da Terra.\n\nMuitos praticantes de Presença usam essa Disciplina para conseguir se alimentar com facilidade, enquanto outros usam para se esgueirar na noite como criaturas de terror, fazendo o gado de mente fraca fugir horrorizado, incertos do que acabaram de ver. Eficaz como uma isca, bem como uma proteção, vampiros com Presença aproveitam uma vida noturna fácil ao custo de se esquecerem quais sentimentos projetados neles são normais e quais são forçados.\n\nCaracterísticas\nPresença afeta as emoções de seus alvos, não suas mentes. Apesar disso ser útil naquelas vítimas que estão cientes (diferente de Dominação), eles não estão sob controle direto do usuário e são frequentemente imprevisíveis. Para ser afetado pela Presença, o alvo precisa estar na presença física do usuário ou pelo menos dentro do alcance de sua voz.\n\nTipo: Mental.\nAmeaça à Máscara: Baixa-Média.\nRessonância de Sangue: Otimista.",
            poderes: [
                {
                    nome: "NÍVEL 1 - AMEDONTRAR",
                    descricao: "Ao invés de atrair pessoas, o vampiro usa Presença para repeli-las. Com esse poder o usuário aparece ameaçador e exala uma aura de perigo poderosa o bastante para fazer a maioria dos mortais evitar sua atenção.\n\nCusto: Grátis.\nSistema: Adicione o valor de Presença do usuário em qualquer teste de Intimidação. Atacar o usuário requer um teste de Perseverança + Autocontrole com Dificuldade 2. Vampiros não podem usar Fascínio e Ameaça simultaneamente.\\n⬛ Duração: Uma cena ou até que cesse voluntariamente."
                },
                {
                    nome: "NÍVEL 1 - FASCÍNIO",
                    descricao: "Qualquer um na presença do vampiro tem sua atenção inexplicavelmente atraída para ele.\n\nCusto: Grátis.\nParada de Dados: Manipulação + Presença vs Autocontrole + Inteligência.\nSistema: Adicione o valor de Presença para qualquer teste envolvendo Persuasão, Performance ou Carisma. Alvos podem resistir com um teste resistido.\nDuração: Uma cena ou até que cesse voluntariamente."
                },
                {
                    nome: "NÍVEL 2 - BEIJO INDELÉVEL",
                    descricao: "O Beijo do vampiro induz um quase-êxtase em mortais, tornando-os viciados.\n\nCusto: Grátis.\nSistema: O usuário adiciona dados iguais à sua Presença para testes de Carisma contra o alvo mordido. O alvo pode tentar resistir semanalmente.\nDuração: Até o alvo resistir com sucesso."
                },
                {
                    nome: "NÍVEL 3 - OLHAR ATERRORIZANTE",
                    descricao: "Expondo brevemente sua natureza vampírica, o usuário incita terror absoluto em um alvo.\n\nCusto: Uma Checagem de Sangue.\nParada de Dados: Carisma + Presença vs Autocontrole + Perseverança.\nSistema: Mortais podem fugir, congelar ou se curvar de medo. Vampiros podem entrar em Rötschreck.\nDuração: Um turno."
                },
                {
                    nome: "NÍVEL 3 - TRANSE",
                    descricao: "O vampiro foca sua atração sobrenatural em uma única pessoa, gerando admiração e paixão intensas.\n\nCusto: Uma Checagem de Sangue.\nParada de Dados: Carisma + Presença vs Autocontrole + Raciocínio.\nSistema: Se bem sucedido, o alvo faz o possível para agradar o vampiro, desde que não envolva dano grave a si ou aos seus entes queridos.\nDuração: Uma hora mais uma por sucesso extra."
                },
                {
                    nome: "NÍVEL 4 - CONVOCAR",
                    descricao: "O vampiro pode chamar para si qualquer pessoa previamente afetada por seus poderes ou que tenha provado seu sangue.\n\nCusto: Uma Checagem de Sangue.\nParada de Dados: Manipulação + Presença vs Autocontrole + Inteligência.\nSistema: O alvo sente o chamado e tenta chegar até o vampiro, desde que isso não o coloque em perigo físico ou financeiro.\nDuração: Uma noite."
                },
                {
                    nome: "NÍVEL 4 - VOZ IRRESISTÍVEL",
                    descricao: "Amálgama: Dominação 1.\n\nA presença do usuário se torna um condutor para Dominação.\n\nCusto: Sem custo adicional.\nSistema: A voz do usuário passa a ser suficiente para aplicar Dominação, desde que seja ouvida diretamente.\nDuração: Passiva."
                },
                {
                    nome: "NÍVEL 5 - MAGNETISMO DE ESTRELA",
                    descricao: "Os poderes de Presença agora afetam pessoas em transmissões ao vivo ou chamadas telefônicas.\n\nCusto: Uma Checagem de Sangue adicional.\nSistema: Fascínio, Amedontrar e Transe podem ser transmitidos por telas ou telefone. Gravações não mantêm o efeito.\nDuração: A do poder usado."
                },
                {
                    nome: "NÍVEL 5 - MAJESTADE",
                    descricao: "No auge da Disciplina, o vampiro amplifica sua presença até níveis sobrenaturais.\n\nCusto: Duas Checagens de Sangue.\nParada de Dados: Carisma + Presença vs Autocontrole + Perseverança.\nSistema: Qualquer um que tente agir contra o usuário deve vencer um teste resistido ou ficará incapaz de enfrentá-lo.\nDuração: Uma cena."
                }
            ]
        },
        {
            nome: "Proteanismo",
            descricao: "Apelidos: Morfar, Troca-peles, Mutante.\n\nLobisomens desprezam os vampiros por possuírem essa habilidade. Eles consideram-na uma zombaria contra a própria natureza, já que seres não-vivos se transformam em lobos e morcegos, portando garras e presas como um dos seus semelhantes. Além disso, Metamorfose tem se espalhado através do Sangue praticamente desde quando os Membros surgiram. O poder de mudar, trocar de forma, e se tornar um predador ainda mais mortal é tão natural para o vampiro quanto é para o lupino.\n\nPraticantes de Metamorfose utilizam a Disciplina por conta de sua versatilidade. O poder permite ao vampiro se tornar uma besta, transformar seus membros em armas, ou mudar sua forma para uma névoa a fim de impedir uma captura, deslizar por dentro de fechaduras ou por frestas em uma janela.\n\nCaracterísticas\nTipo: Físico.\nAmeaça à Máscara: Alta.\nRessonância de Sangue: Sangue animal, principalmente dos animais correspondentes à forma transmutada.",
            poderes: [
                {
                    nome: "NÍVEL 1 - OLHOS DA BESTA",
                    descricao: "O vampiro pode fazer surgir um brilho vermelho sobrenatural em seus olhos, dando visão a ele mesmo na ausência total de luz.\n\nCusto: Grátis.\nSistema: Nenhum teste é exigido para ativar Olhos da Besta. Enquanto ativo, o usuário ignora qualquer penalidade da visão imposta pela escuridão, incluindo sobrenatural. Enquanto ativo, a aparência inumana dos olhos confere dois dados bônus nas paradas de Intimidação contra mortais.\nDuração: Tão longa quanto desejada."
                },
                {
                    nome: "NÍVEL 1 - PESO PENA",
                    descricao: "O vampiro pode reduzir sua densidade e massa efetiva, fazendo com que fique quase sem peso. Isso permite evitar sensores de pressão e reduzir danos de quedas e colisões.\n\nCusto: Grátis.\nParada de Dados: Raciocínio + Sobrevivência.\nSistema: Se tiver tempo para se preparar, nenhum teste é exigido. Como reação, requer teste de Raciocínio + Sobrevivência (Dificuldade 3). Enquanto ativo, o vampiro é imune a dano por quedas, colisões e arremessos.\nDuração: Tão longa quanto desejada."
                },
                {
                    nome: "NÍVEL 2 - ARMAS FERAIS",
                    descricao: "O vampiro pode estender suas armas naturais até proporções monstruosas, geralmente garras ou presas alongadas.\n\nCusto: Uma Checagem de Sangue.\nSistema: Nenhum teste é necessário. O vampiro adiciona +2 ao dano de Briga e causa dano Agravado à Vitalidade de mortais. O dano Superficial infligido com Armas Ferais não é dividido pela metade.\nDuração: Uma cena."
                },
                {
                    nome: "NÍVEL 3 - FUSÃO COM A TERRA",
                    descricao: "Tornando-se um com o solo, o vampiro mergulha na terra e pode permanecer oculto até a noite seguinte.\n\nCusto: Uma Checagem de Sangue.\nSistema: Nenhum teste necessário, mas deve estar sobre superfície natural como terra, rocha ou grama. Não funciona em concreto ou asfalto. Leva um turno para mergulhar. Objetos carregados ficam para trás.\nDuração: Um dia ou mais, ou até ser perturbado."
                },
                {
                    nome: "NÍVEL 3 - MUDANÇA DE FORMA",
                    descricao: "O vampiro pode assumir a forma de um animal aproximadamente do mesmo tamanho de sua massa original.\n\nCusto: Uma Checagem de Sangue.\nSistema: Nenhum teste necessário. A transformação leva um turno. O vampiro ganha atributos físicos, sentidos e habilidades do animal, além de suas limitações.\nDuração: Uma cena, a menos que encerre antes."
                },
                {
                    nome: "NÍVEL 4 - METAMORFOSE",
                    descricao: "Pré-requisito: Mudança de Forma.\n\nEsse poder concede uma forma animal adicional ao usuário, permitindo também alterar seu tamanho. Formas comuns incluem morcegos, ratos, insetos grandes e cobras.\n\nCusto: Uma Checagem de Sangue.\nSistema: O mesmo de Mudança de Forma.\nDuração: Uma cena, a menos que encerre antes."
                },
                {
                    nome: "NÍVEL 5 - FORMA DE NÉVOA",
                    descricao: "O vampiro ganha o poder de se transformar em uma nuvem brumosa. Pode atravessar canos, fendas e rachaduras, sendo vulnerável apenas a fogo, luz solar e ataques sobrenaturais.\n\nCusto: De Uma a Três Checagens de Sangue .\nSistema: Nenhum teste necessário. A transformação leva três turnos, podendo ser acelerada com ativações extras de sangue. Em forma de névoa, move-se em velocidade de caminhada e percebe o ambiente por meios místicos.\nDuração: Uma cena, a menos que encerre antes."
                },
                {
                    nome: "NÍVEL 5 - CORAÇÃO VAGANTE",
                    descricao: "Tendo dominado Metamorfose, até mesmo o interior do vampiro se torna maleável. Seu coração move-se livremente dentro do tórax, tornando extremamente difícil estaqueá-lo.\n\nCusto: Grátis.\nSistema: Aumenta em 3 a Dificuldade para estaquear o vampiro fora de combate. Em combate corpo-a-corpo, apenas um sucesso crítico permite atingir o coração. Mesmo estaqueado, o usuário pode tentar expulsar a estaca com Força + Perseverança (Dificuldade 5) uma vez por hora.\nDuração: Passiva."
                }
            ]
        },
        {
            nome: "Feitiçaria de Sangue",
            descricao: "Apelidos: Um Tipo de Magia, Taumaturgia, Quietus.\n\nOs Tremere sustentam que Feitiçaria de Sangue, ou “Taumaturgia” como eles chamam, são invenção sua. Só para ouvir os Banu Haqim darem sua versão, “Quietus” era seu direito de sangue muito antes dos Tremere se tornarem vampiros. Outros clãs fazem a mesma afirmação. Enquanto sua origem é obscura, a terrível natureza de Feitiçaria de Sangue não é. Poucos Membros confiam em possuidores de um poder que pode manipular a vitae em suas veias e transformá-la em veneno.\n\nDiferentemente das outras Disciplinas, praticantes de Feitiçaria de Sangue necessitam de professores para evoluir e aprender Rituais.\n\nCaracterísticas\nTipo: Feitiçaria.\nAmeaça à Máscara: Baixa-Alta.\nRessonância de Sangue: Sanguíneo.",
            poderes: [
                {
                    nome: "NÍVEL 1 - UM GOSTO POR SANGUE",
                    descricao: "Provando uma gota de sangue, o usuário pode determinar algumas características básicas do seu possuidor.\n\nCusto: Grátis.\nParada de Dados: Determinação + Feitiçaria de Sangue.\nSistema: O usuário toca o sangue em sua língua e faz um teste de Perseverança + Feitiçaria de Sangue (Dificuldade 3). Com sucesso, determina ressonância, intensidade e natureza do sangue. Um sucesso crítico também pode revelar Diablerie e geração aproximada.\nDuração: Não aplicável."
                },
                {
                    nome: "NÍVEL 1 - VITAE CORROSIVO",
                    descricao: "Alterando as propriedades de parte do seu próprio Sangue, o usuário pode torná-lo altamente corrosivo.\n\nCusto: Um ou mais Checagens de Sangue.\nSistema: O usuário força o Sangue por uma ferida aberta e o derrama sobre um objeto sem vida para corroê-lo. Cada ativação corrói cerca de 35 cm de matéria.\nDuração: Não aplicável."
                },
                {
                    nome: "NÍVEL 2 - EXTINGUIR VITAE",
                    descricao: "O usuário remove propriedades místicas do sangue de outro vampiro, aumentando sua Fome.\n\nCusto: Uma Checagem de Sangue.\nParada de Dados: Inteligência + Feitiçaria de Sangue vs Vigor + Autocontrole.\nSistema: Em sucesso, aumenta a Fome do alvo em 1; sucesso crítico aumenta em 2.\nDuração: Não aplicável."
                },
                {
                    nome: "NÍVEL 3 - PICADA DE ESCORPIÃO",
                    descricao: "O vampiro transmute parte de seu sangue em veneno paralisante capaz de afetar mortais e vampiros.\n\nCusto: Uma ou mais Checagens de Sangue.\nParada de Dados: Força + Feitiçaria de Sangue vs Vigor + Ocultismo ou Fortitude.\nSistema: O sangue envenenado pode banhar armas ou ser cuspido. Se acertar, causa dano agravado em mortais e superficial não reduzido em vampiros.\nDuração: O veneno permanece potente por uma cena."
                },
                {
                    nome: "NÍVEL 3 - SANGUE POTENTE",
                    descricao: "O vampiro concentra seu Sangue, aumentando temporariamente sua Potência de Sangue.\n\nCusto: Uma Checagem de Sangue.\nParada de Dados: Determinação + Feitiçaria de Sangue.\nSistema: Teste contra Dificuldade 2 + Potência de Sangue atual. Sucesso aumenta em 1; sucesso crítico em 2.\nDuração: Uma cena ou uma noite."
                },
                {
                    nome: "NÍVEL 4 - ROUBO DE VITAE",
                    descricao: "Misticamente, o vampiro abre uma ferida arterial em um mortal e puxa o sangue até sua boca à distância.\n\nCusto: Uma Checagem de Sangue.\nParada de Dados: Raciocínio + Feitiçaria de Sangue vs Raciocínio + Ocultismo.\nSistema: Em sucesso, o vampiro pode se alimentar à distância em velocidade dobrada (tripla com crítico).\nDuração: Uma alimentação."
                },
                {
                    nome: "NÍVEL 5 - CALDEIRÃO DE SANGUE",
                    descricao: "O usuário ferve o sangue da vítima em suas próprias veias, causando dor extrema e dano massivo.\n\nCusto: Uma Checagem de Sangue e ganha uma ou mais Máculas.\nParada de Dados: Perseverança + Feitiçaria de Sangue vs Autocontrole + Ocultismo ou Fortitude.\nSistema: Cada sucesso extra causa 1 ponto de dano Agravado. Mortais que sofrem dano morrem gritando. Vampiros ganham 1 Fome por ponto de dano.\nDuração: Um turno."
                },
                {
                    nome: "NÍVEL 5 - CARÍCIA DE BAAL",
                    descricao: "O vampiro transmute seu sangue em um veneno extremamente agressivo, letal para mortais e vampiros.\n\nCusto: Uma ou mais Checagens de Sangue.\nParada de Dados: Força + Feitiçaria de Sangue vs Vigor + Ocultismo ou Fortitude.\nSistema: Funciona como Picada de Escorpião, mas causa dano Agravado também em vampiros. Mortais morrem instantaneamente ao sofrer dano.\nDuração: O veneno permanece potente por uma cena."
                }
            ]
        }
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

    const [mostrarPainelTeste, setMostrarPainelTeste] = useState(true);
    const [cronicas, setCronicas] = useState([]);

    const infoFields = [
        { key: "nome", label: "Nome" },
        { key: "conceito", label: "Conceito" },
        {
            key: "predador",
            label: "Predador",
            type: "select",
            options: predatorTypes
        },
        {
            key: "cronica",
            label: "Crônica",
            type: "select",
            options: cronicas
        },
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
        async function carregarCronicas() {
            const { data, error } = await supabase
                .from("cronicas")
                .select("nome");

            if (error) {
                console.error(error);
                return;
            }

            setCronicas(data.map((c) => c.nome));
        }

        carregarCronicas();
    }, []);

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


    useEffect(() => {
        const timeout = setTimeout(() => {
            salvarFichaAutomaticamente();
        }, 1000); // salva 1s após parar de editar

        return () => clearTimeout(timeout);
    }, [
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
    ]);

    async function salvarFichaAutomaticamente() {
        setStatusSalvamento("salvando");

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
            .update({ data: ficha })
            .eq("nome", infoBasica.nome);

        if (error) {
            console.error(error);
            setStatusSalvamento("erro");
        } else {
            console.log("Ficha salva automaticamente");
            setStatusSalvamento("salvo");

            setTimeout(() => {
                setStatusSalvamento("");
            }, 2000);
        }
    }

    const [carac1, setCarac1] = useState("");
    const [carac2, setCarac2] = useState("");

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
            {statusSalvamento && (
                <div
                    style={{
                        position: "fixed",
                        top: "20px",
                        right: "20px",
                        zIndex: 10000,
                        padding: "12px 20px",
                        borderRadius: "12px",
                        color: "white",
                        fontWeight: "bold",
                        background:
                            statusSalvamento === "salvando"
                                ? "#d97706"
                                : statusSalvamento === "salvo"
                                    ? "#16a34a"
                                    : "#dc2626",
                        boxShadow: "0 0 15px rgba(0,0,0,0.4)"
                    }}
                >
                    {statusSalvamento === "salvando" && "Salvando..."}
                    {statusSalvamento === "salvo" && "✓ Salvo"}
                    {statusSalvamento === "erro" && "Erro ao salvar"}
                </div>
            )}
            <>
                <div
                    style={{
                        position: "fixed",
                        right: "25px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 9999
                    }}
                >
                    <button
                        onClick={() => setMostrarPainelTeste(!mostrarPainelTeste)}
                        style={{
                            position: "absolute",
                            left: "-90px",
                            top: "20px",
                            width: "90px",
                            height: "45px",
                            borderRadius: "12px 0 0 12px",
                            border: "2px solid #8b0000",
                            borderRight: "none",
                            background: "#8b0000",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "bold",
                            boxShadow: "-4px 0 15px rgba(139,0,0,0.4)"
                        }}
                    >
                        {mostrarPainelTeste ? "Ocultar" : "Mostrar"}
                    </button>

                    {mostrarPainelTeste && (
                        <div
                            style={{
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
                                    fontWeight: "bold"
                                }}
                            >
                                Teste
                            </h3>

                            <select
                                value={carac1}
                                onChange={(e) => setCarac1(e.target.value)}
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
                                    justifyContent: "space-between"
                                }}
                            >
                                <span style={{ color: "white", fontWeight: "bold" }}>
                                    Modificador
                                </span>

                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button onClick={() => setModificador(modificador - 1)}>
                                        -
                                    </button>

                                    <span style={{ color: "white" }}>
                                        {modificador > 0 ? `+${modificador}` : modificador}
                                    </span>

                                    <button onClick={() => setModificador(modificador + 1)}>
                                        +
                                    </button>
                                </div>
                            </div>

                            <button onClick={fazerTeste}>
                                Rolar{" "}
                                {Math.max(
                                    1,
                                    getValorCaracteristica(carac1) +
                                    getValorCaracteristica(carac2) +
                                    modificador
                                )}{" "}
                                dados
                            </button>

                            <button onClick={usarSurtoDeSangue}>
                                Usar Surto de Sangue
                            </button>

                            <button onClick={() => setMostrarHistorico(!mostrarHistorico)}>
                                {mostrarHistorico
                                    ? "Ocultar Histórico"
                                    : "Mostrar Histórico"}
                            </button>
                        </div>
                    )}
                </div>

                {mostrarHistorico && mostrarPainelTeste && (
                    <div
                        style={{
                            position: "fixed",
                            right: "330px",
                            top: "50%",
                            transform: "translateY(-50%)"
                        }}
                    >
                        {/* histórico */}
                    </div>
                )}
            </>
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
                        <h3 style={{
                            marginLeft: "45%"
                        }}>Físicos</h3>

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
                        <h3 style={{
                            marginLeft: "45%"
                        }}>Sociais</h3>

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
                        <h3 style={{
                            marginLeft: "45%"
                        }}>Mentais</h3>

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
                        <h3 style={{
                            marginLeft: "45%"
                        }}>Físicas</h3>

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
                        <h3 style={{
                            marginLeft: "45%"
                        }}>Sociais</h3>

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
                        <h3 style={{
                            marginLeft: "45%"
                        }}>Mentais</h3>

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

            <div style={styles.twoColumns}>
                {/* COLUNA ESQUERDA */}
                <div style={styles.column}>
                    <section style={styles.card}>
                        <h2 style={styles.sectionTitle}></h2>

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
                </div>

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
            <Link to="/mestre">
                <button>Painel Mestre</button>
            </Link>
        </div >
    );
}
