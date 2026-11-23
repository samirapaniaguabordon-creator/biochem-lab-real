export type PathwayStep = {
  id: string
  from: string
  to: string
  enzyme: string
  phase?: string
  energy?: string
  irreversible?: boolean
  rateLimiting?: boolean
  description: string
  regulation?: string
  clinical?: string
}

export type Pathway = {
  id: string
  name: string
  short: string
  location: string
  layout: 'linear' | 'cycle'
  overview: string
  equation: string
  yield: string
  keyRegulation: string[]
  steps: PathwayStep[]
}

export const pathways: Pathway[] = [
  {
    id: 'glucolisis',
    name: 'Glucólisis',
    short: 'Glucólisis',
    location: 'Citosol de todas las células',
    layout: 'linear',
    overview:
      'Oxidación de una molécula de glucosa (6C) a dos moléculas de piruvato (3C). Es la vía central del catabolismo de carbohidratos y la única fuente de ATP en eritrocitos, que carecen de mitocondrias.',
    equation: 'Glucosa + 2 NAD⁺ + 2 ADP + 2 Pi → 2 Piruvato + 2 NADH + 2 ATP + 2 H₂O',
    yield: 'Ganancia neta: 2 ATP + 2 NADH',
    keyRegulation: [
      'PFK-1 es la enzima limitante: activada por AMP y fructosa-2,6-bisfosfato; inhibida por ATP y citrato.',
      'Hexoquinasa se inhibe por su producto (glucosa-6-P); la glucoquinasa hepática no.',
      'Piruvato quinasa se activa por fructosa-1,6-bisfosfato (anteroalimentación) y se inhibe por fosforilación (glucagón).',
    ],
    steps: [
      { id: 'g1', phase: 'Fase de inversión', from: 'Glucosa', to: 'Glucosa-6-fosfato', enzyme: 'Hexoquinasa / Glucoquinasa', energy: '−1 ATP', irreversible: true, description: 'Fosforilación de la glucosa que la atrapa dentro de la célula, ya que la G6P no atraviesa el transportador GLUT.', regulation: 'Hexoquinasa: Km bajo, inhibida por G6P. Glucoquinasa (hígado, páncreas): Km alto, inducida por insulina, regulada por proteína reguladora de glucoquinasa.', clinical: 'Mutaciones en glucoquinasa causan MODY tipo 2.' },
      { id: 'g2', phase: 'Fase de inversión', from: 'Glucosa-6-fosfato', to: 'Fructosa-6-fosfato', enzyme: 'Fosfoglucosa isomerasa', description: 'Isomerización reversible de una aldosa a una cetosa.' },
      { id: 'g3', phase: 'Fase de inversión', from: 'Fructosa-6-fosfato', to: 'Fructosa-1,6-bisfosfato', enzyme: 'Fosfofructoquinasa-1 (PFK-1)', energy: '−1 ATP', irreversible: true, rateLimiting: true, description: 'Paso comprometido y principal punto de control de la glucólisis.', regulation: 'Activadores: AMP, fructosa-2,6-bisfosfato. Inhibidores: ATP, citrato, H⁺.' },
      { id: 'g4', phase: 'Fase de inversión', from: 'Fructosa-1,6-bisfosfato', to: 'DHAP + Gliceraldehído-3-P', enzyme: 'Aldolasa A', description: 'Ruptura de la hexosa en dos triosas fosfato.', clinical: 'La aldolasa B (hígado) es deficiente en la intolerancia hereditaria a la fructosa.' },
      { id: 'g5', phase: 'Fase de inversión', from: 'Dihidroxiacetona fosfato', to: 'Gliceraldehído-3-fosfato', enzyme: 'Triosa fosfato isomerasa', description: 'Convierte DHAP en una segunda molécula de G3P; a partir de aquí todo ocurre por duplicado.' },
      { id: 'g6', phase: 'Fase de rendimiento (×2)', from: 'Gliceraldehído-3-fosfato', to: '1,3-Bisfosfoglicerato', enzyme: 'Gliceraldehído-3-P deshidrogenasa', energy: '+2 NADH', description: 'Única oxidación de la vía; incorpora fosfato inorgánico formando un enlace de alta energía.', clinical: 'Inhibida por arsenato, que desacopla la producción de ATP en el paso siguiente.' },
      { id: 'g7', phase: 'Fase de rendimiento (×2)', from: '1,3-Bisfosfoglicerato', to: '3-Fosfoglicerato', enzyme: 'Fosfoglicerato quinasa', energy: '+2 ATP', description: 'Primera fosforilación a nivel de sustrato.', clinical: 'En eritrocitos, el desvío por la bisfosfoglicerato mutasa produce 2,3-BPG, que reduce la afinidad de la hemoglobina por O₂.' },
      { id: 'g8', phase: 'Fase de rendimiento (×2)', from: '3-Fosfoglicerato', to: '2-Fosfoglicerato', enzyme: 'Fosfoglicerato mutasa', description: 'Traslado del grupo fosfato del carbono 3 al carbono 2.' },
      { id: 'g9', phase: 'Fase de rendimiento (×2)', from: '2-Fosfoglicerato', to: 'Fosfoenolpiruvato', enzyme: 'Enolasa', description: 'Deshidratación que genera un compuesto de muy alta energía.', clinical: 'El fluoruro inhibe la enolasa; por eso se usa en tubos para medir glucemia.' },
      { id: 'g10', phase: 'Fase de rendimiento (×2)', from: 'Fosfoenolpiruvato', to: 'Piruvato', enzyme: 'Piruvato quinasa', energy: '+2 ATP', irreversible: true, description: 'Segunda fosforilación a nivel de sustrato.', regulation: 'Activada por fructosa-1,6-bisfosfato; inhibida por ATP, alanina y fosforilación dependiente de glucagón.', clinical: 'Su deficiencia es la segunda causa enzimática de anemia hemolítica tras la deficiencia de G6PD.' },
    ],
  },
  {
    id: 'krebs',
    name: 'Ciclo de Krebs',
    short: 'Krebs',
    location: 'Matriz mitocondrial',
    layout: 'cycle',
    overview:
      'También llamado ciclo de los ácidos tricarboxílicos. Oxida el acetil-CoA a CO₂ y captura la energía en forma de NADH, FADH₂ y GTP. Es una vía anfibólica: también aporta precursores biosintéticos.',
    equation: 'Acetil-CoA + 3 NAD⁺ + FAD + GDP + Pi + 2 H₂O → 2 CO₂ + 3 NADH + FADH₂ + GTP + CoA',
    yield: 'Por vuelta: 3 NADH + 1 FADH₂ + 1 GTP ≈ 10 ATP',
    keyRegulation: [
      'Isocitrato deshidrogenasa es la enzima limitante: activada por ADP y Ca²⁺; inhibida por ATP y NADH.',
      'α-cetoglutarato deshidrogenasa se inhibe por succinil-CoA y NADH.',
      'Citrato sintasa se inhibe por ATP, NADH, succinil-CoA y citrato.',
    ],
    steps: [
      { id: 'k1', from: 'Acetil-CoA + Oxalacetato', to: 'Citrato', enzyme: 'Citrato sintasa', irreversible: true, description: 'Condensación de acetil-CoA (2C) con oxalacetato (4C) formando citrato (6C).', regulation: 'Inhibida por ATP, NADH, succinil-CoA y citrato.' },
      { id: 'k2', from: 'Citrato', to: 'Isocitrato', enzyme: 'Aconitasa', description: 'Isomerización a través del intermediario cis-aconitato.', clinical: 'Inhibida por fluoroacetato (raticida), que se convierte en fluorocitrato.' },
      { id: 'k3', from: 'Isocitrato', to: 'α-Cetoglutarato', enzyme: 'Isocitrato deshidrogenasa', energy: '+1 NADH, +CO₂', irreversible: true, rateLimiting: true, description: 'Primera descarboxilación oxidativa del ciclo.', regulation: 'Activada por ADP y Ca²⁺; inhibida por ATP y NADH.' },
      { id: 'k4', from: 'α-Cetoglutarato', to: 'Succinil-CoA', enzyme: 'Complejo α-cetoglutarato deshidrogenasa', energy: '+1 NADH, +CO₂', irreversible: true, description: 'Segunda descarboxilación oxidativa. Requiere los mismos cofactores que la piruvato deshidrogenasa: tiamina (B1), lipoato, CoA (B5), FAD (B2) y NAD⁺ (B3).', clinical: 'La deficiencia de tiamina (alcoholismo, Wernicke-Korsakoff) afecta esta enzima.' },
      { id: 'k5', from: 'Succinil-CoA', to: 'Succinato', enzyme: 'Succinil-CoA sintetasa', energy: '+1 GTP', description: 'Única fosforilación a nivel de sustrato del ciclo.', clinical: 'El succinil-CoA también es precursor del grupo hemo.' },
      { id: 'k6', from: 'Succinato', to: 'Fumarato', enzyme: 'Succinato deshidrogenasa', energy: '+1 FADH₂', description: 'Única enzima del ciclo unida a la membrana mitocondrial interna; forma parte del complejo II de la cadena respiratoria.', clinical: 'Inhibida competitivamente por malonato.' },
      { id: 'k7', from: 'Fumarato', to: 'Malato', enzyme: 'Fumarasa', description: 'Hidratación estereoespecífica del fumarato a L-malato.' },
      { id: 'k8', from: 'Malato', to: 'Oxalacetato', enzyme: 'Malato deshidrogenasa', energy: '+1 NADH', description: 'Regenera el oxalacetato y cierra el ciclo. Reacción desfavorable impulsada por el consumo rápido de oxalacetato.' },
    ],
  },
  {
    id: 'gluconeogenesis',
    name: 'Gluconeogénesis',
    short: 'Gluconeogénesis',
    location: 'Hígado (90%) y corteza renal · mitocondria, citosol y RE',
    layout: 'linear',
    overview:
      'Síntesis de glucosa a partir de precursores no glucídicos (lactato, alanina, glicerol, propionato). Mantiene la glucemia durante el ayuno, una vez agotado el glucógeno hepático.',
    equation: '2 Piruvato + 4 ATP + 2 GTP + 2 NADH + 6 H₂O → Glucosa + 4 ADP + 2 GDP + 6 Pi + 2 NAD⁺',
    yield: 'Costo: 6 enlaces de alta energía por glucosa',
    keyRegulation: [
      'Fructosa-1,6-bisfosfatasa es la enzima limitante: inhibida por fructosa-2,6-bisfosfato y AMP.',
      'Piruvato carboxilasa requiere biotina y se activa por acetil-CoA.',
      'El glucagón y el cortisol inducen PEPCK; la insulina la reprime.',
    ],
    steps: [
      { id: 'gn1', phase: 'Rodeo 1: Piruvato → PEP', from: 'Piruvato', to: 'Oxalacetato', enzyme: 'Piruvato carboxilasa', energy: '−1 ATP', irreversible: true, description: 'Carboxilación en la mitocondria. El oxalacetato sale al citosol como malato (lanzadera).', regulation: 'Activada alostéricamente por acetil-CoA (señal de beta-oxidación activa). Cofactor: biotina.' },
      { id: 'gn2', phase: 'Rodeo 1: Piruvato → PEP', from: 'Oxalacetato', to: 'Fosfoenolpiruvato', enzyme: 'PEP carboxiquinasa (PEPCK)', energy: '−1 GTP', irreversible: true, description: 'Descarboxilación y fosforilación simultáneas.', regulation: 'Inducida transcripcionalmente por glucagón (vía AMPc) y cortisol.' },
      { id: 'gn3', phase: 'Reacciones reversibles', from: 'Fosfoenolpiruvato', to: 'Fructosa-1,6-bisfosfato', enzyme: 'Enzimas reversibles de la glucólisis', energy: '−1 ATP, −1 NADH (por triosa)', description: 'Enolasa, fosfoglicerato mutasa, fosfoglicerato quinasa, G3P deshidrogenasa, triosa fosfato isomerasa y aldolasa actúan en sentido inverso.' },
      { id: 'gn4', phase: 'Rodeo 2', from: 'Fructosa-1,6-bisfosfato', to: 'Fructosa-6-fosfato', enzyme: 'Fructosa-1,6-bisfosfatasa', irreversible: true, rateLimiting: true, description: 'Hidrólisis del fosfato en C1. Paso comprometido de la gluconeogénesis.', regulation: 'Inhibida por fructosa-2,6-bisfosfato y AMP; activada por citrato.' },
      { id: 'gn5', phase: 'Rodeo 2', from: 'Fructosa-6-fosfato', to: 'Glucosa-6-fosfato', enzyme: 'Fosfoglucosa isomerasa', description: 'Isomerización reversible.' },
      { id: 'gn6', phase: 'Rodeo 3', from: 'Glucosa-6-fosfato', to: 'Glucosa', enzyme: 'Glucosa-6-fosfatasa', irreversible: true, description: 'Ocurre en el lumen del retículo endoplásmico. Solo hígado y riñón la expresan, por eso el músculo no libera glucosa a la sangre.', clinical: 'Su deficiencia causa la enfermedad de von Gierke (glucogenosis tipo I): hipoglucemia grave, acidosis láctica y hepatomegalia.' },
    ],
  },
  {
    id: 'beta-oxidacion',
    name: 'Beta-oxidación',
    short: 'β-oxidación',
    location: 'Matriz mitocondrial (activación en citosol)',
    layout: 'linear',
    overview:
      'Degradación de ácidos grasos en unidades de acetil-CoA mediante ciclos repetidos de cuatro reacciones. Es la principal fuente de energía del corazón y del músculo en reposo durante el ayuno.',
    equation: 'Palmitoil-CoA + 7 FAD + 7 NAD⁺ + 7 CoA + 7 H₂O → 8 Acetil-CoA + 7 FADH₂ + 7 NADH',
    yield: 'Palmitato (16C): 106 ATP netos',
    keyRegulation: [
      'CPT-I es el punto de control: inhibida por malonil-CoA (primer intermediario de la síntesis de ácidos grasos).',
      'La relación insulina/glucagón determina los niveles de malonil-CoA.',
      'Alta relación NADH/NAD⁺ y acetil-CoA/CoA inhiben la vía.',
    ],
    steps: [
      { id: 'b1', phase: 'Activación y transporte', from: 'Ácido graso', to: 'Acil-CoA', enzyme: 'Acil-CoA sintetasa', energy: '−2 ATP (ATP → AMP)', description: 'Activación en la membrana mitocondrial externa. Consume dos enlaces de alta energía.' },
      { id: 'b2', phase: 'Activación y transporte', from: 'Acil-CoA (citosol)', to: 'Acil-CoA (matriz)', enzyme: 'Carnitina palmitoiltransferasa I y II', rateLimiting: true, description: 'Lanzadera de carnitina: CPT-I forma acilcarnitina, la translocasa la cruza y CPT-II regenera el acil-CoA en la matriz.', regulation: 'CPT-I inhibida por malonil-CoA.', clinical: 'Deficiencia de CPT-II: mialgias y mioglobinuria tras ejercicio prolongado.' },
      { id: 'b3', phase: 'Espiral (se repite)', from: 'Acil-CoA', to: 'trans-Δ²-Enoil-CoA', enzyme: 'Acil-CoA deshidrogenasa', energy: '+1 FADH₂', description: 'Oxidación que forma un doble enlace trans entre los carbonos α y β.', clinical: 'La deficiencia de MCAD (cadena media) causa hipoglucemia hipocetósica en ayuno; se detecta en el tamizaje neonatal.' },
      { id: 'b4', phase: 'Espiral (se repite)', from: 'trans-Δ²-Enoil-CoA', to: 'L-3-Hidroxiacil-CoA', enzyme: 'Enoil-CoA hidratasa', description: 'Hidratación del doble enlace.' },
      { id: 'b5', phase: 'Espiral (se repite)', from: 'L-3-Hidroxiacil-CoA', to: '3-Cetoacil-CoA', enzyme: '3-Hidroxiacil-CoA deshidrogenasa', energy: '+1 NADH', description: 'Segunda oxidación, ahora del carbono β.' },
      { id: 'b6', phase: 'Espiral (se repite)', from: '3-Cetoacil-CoA', to: 'Acil-CoA (n−2) + Acetil-CoA', enzyme: 'β-Cetotiolasa', description: 'Ruptura tiolítica que libera acetil-CoA y un acil-CoA dos carbonos más corto que vuelve a entrar en la espiral.' },
    ],
  },
  {
    id: 'cetogenesis',
    name: 'Cetogénesis',
    short: 'Cetogénesis',
    location: 'Mitocondria hepática',
    layout: 'linear',
    overview:
      'Producción de cuerpos cetónicos (acetoacetato y β-hidroxibutirato) cuando el acetil-CoA de la beta-oxidación supera la capacidad del ciclo de Krebs, porque el oxalacetato se desvía a gluconeogénesis.',
    equation: '2 Acetil-CoA → Acetoacetato + 2 CoA',
    yield: 'β-hidroxibutirato: ~21,5 ATP al oxidarse en tejidos periféricos',
    keyRegulation: [
      'HMG-CoA sintasa mitocondrial es la enzima limitante; se induce en ayuno y por glucagón.',
      'La insulina suprime la cetogénesis al aumentar el malonil-CoA (inhibe CPT-I).',
      'El cerebro adapta su metabolismo y obtiene hasta 2/3 de su energía de cuerpos cetónicos en ayuno prolongado.',
    ],
    steps: [
      { id: 'c1', phase: 'Síntesis hepática', from: '2 Acetil-CoA', to: 'Acetoacetil-CoA', enzyme: 'Tiolasa', description: 'Condensación de dos acetil-CoA (reacción inversa al último paso de la beta-oxidación).' },
      { id: 'c2', phase: 'Síntesis hepática', from: 'Acetoacetil-CoA + Acetil-CoA', to: 'HMG-CoA', enzyme: 'HMG-CoA sintasa mitocondrial', rateLimiting: true, description: 'Paso comprometido. La isoforma citosólica participa en la síntesis de colesterol.' },
      { id: 'c3', phase: 'Síntesis hepática', from: 'HMG-CoA', to: 'Acetoacetato + Acetil-CoA', enzyme: 'HMG-CoA liasa', description: 'Libera el primer cuerpo cetónico.', clinical: 'Su deficiencia causa hipoglucemia hipocetósica y acidosis metabólica en lactantes.' },
      { id: 'c4', phase: 'Síntesis hepática', from: 'Acetoacetato', to: 'β-Hidroxibutirato', enzyme: 'β-Hidroxibutirato deshidrogenasa', energy: '−1 NADH', description: 'Reducción favorecida por la alta relación NADH/NAD⁺ del ayuno.', clinical: 'Las tiras reactivas de nitroprusiato detectan acetoacetato, no β-hidroxibutirato, y pueden subestimar la cetoacidosis.' },
      { id: 'c5', phase: 'Síntesis hepática', from: 'Acetoacetato', to: 'Acetona + CO₂', enzyme: 'Descarboxilación espontánea', description: 'Producto volátil que se elimina por la respiración.', clinical: 'Responsable del aliento afrutado en la cetoacidosis diabética.' },
      { id: 'c6', phase: 'Utilización periférica', from: 'Acetoacetato + Succinil-CoA', to: 'Acetoacetil-CoA → 2 Acetil-CoA', enzyme: 'Succinil-CoA:acetoacetato CoA transferasa (tioforasa)', description: 'Activa el acetoacetato en músculo, corazón y cerebro para que entre al ciclo de Krebs.', clinical: 'El hígado carece de tioforasa, por lo que no puede consumir los cuerpos cetónicos que produce.' },
    ],
  },
  {
    id: 'fosforilacion-oxidativa',
    name: 'Fosforilación oxidativa',
    short: 'Fosf. oxidativa',
    location: 'Membrana mitocondrial interna',
    layout: 'linear',
    overview:
      'La cadena de transporte de electrones transfiere electrones de NADH y FADH₂ al oxígeno, bombeando protones al espacio intermembrana. El gradiente electroquímico impulsa a la ATP sintasa (teoría quimiosmótica de Mitchell).',
    equation: 'NADH + H⁺ + ½ O₂ + ~2,5 ADP + ~2,5 Pi → NAD⁺ + H₂O + ~2,5 ATP',
    yield: 'NADH ≈ 2,5 ATP · FADH₂ ≈ 1,5 ATP',
    keyRegulation: [
      'Control respiratorio: la velocidad depende de la disponibilidad de ADP.',
      'Los desacoplantes (2,4-DNP, UCP-1) disipan el gradiente: aumenta el consumo de O₂ y se genera calor sin ATP.',
      'Los inhibidores detienen el flujo de electrones y la síntesis de ATP simultáneamente.',
    ],
    steps: [
      { id: 'o1', phase: 'Cadena de transporte de electrones', from: 'NADH', to: 'Ubiquinona (CoQ)', enzyme: 'Complejo I · NADH deshidrogenasa', energy: '4 H⁺ bombeados', description: 'Contiene FMN y centros hierro-azufre. Principal punto de entrada de electrones.', clinical: 'Inhibido por rotenona (pesticida), amital y metformina (parcialmente).' },
      { id: 'o2', phase: 'Cadena de transporte de electrones', from: 'Succinato (FADH₂)', to: 'Ubiquinona (CoQ)', enzyme: 'Complejo II · Succinato deshidrogenasa', energy: '0 H⁺ bombeados', description: 'También es enzima del ciclo de Krebs. Por no bombear protones, el FADH₂ rinde menos ATP.' },
      { id: 'o3', phase: 'Cadena de transporte de electrones', from: 'Ubiquinol (CoQH₂)', to: 'Citocromo c', enzyme: 'Complejo III · Citocromo bc₁', energy: '4 H⁺ bombeados', description: 'Ciclo Q: transfiere electrones de un transportador liposoluble a uno hidrosoluble.', clinical: 'Inhibido por antimicina A.' },
      { id: 'o4', phase: 'Cadena de transporte de electrones', from: 'Citocromo c', to: 'O₂ → H₂O', enzyme: 'Complejo IV · Citocromo c oxidasa', energy: '2 H⁺ bombeados', irreversible: true, description: 'Contiene cobre y hemo a/a₃. Reduce el oxígeno, aceptor final de electrones.', clinical: 'Inhibido por cianuro, monóxido de carbono, azida y sulfuro de hidrógeno.' },
      { id: 'o5', phase: 'Síntesis de ATP', from: 'ADP + Pi (gradiente de H⁺)', to: 'ATP', enzyme: 'Complejo V · ATP sintasa (F₀F₁)', energy: '~2,7 H⁺ por ATP', description: 'El flujo de protones a través de F₀ hace girar el rotor y F₁ cataliza la síntesis de ATP (mecanismo de cambio de unión de Boyer).', clinical: 'Inhibida por oligomicina.' },
      { id: 'o6', phase: 'Síntesis de ATP', from: 'ATP (matriz) + ADP (citosol)', to: 'ATP (citosol) + ADP (matriz)', enzyme: 'ATP-ADP translocasa', description: 'Intercambia ATP por ADP a través de la membrana interna.', clinical: 'Inhibida por atractilósido y ácido bongkréquico.' },
    ],
  },
]

export function getPathway(id: string) {
  return pathways.find((p) => p.id === id)
}
