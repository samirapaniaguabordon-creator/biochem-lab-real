export type Question = {
  id: string
  topic: string
  question: string
  options: string[]
  answer: number
  explanation: string
}

export type Flashcard = {
  id: string
  topic: string
  front: string
  back: string
}

export const quizTopics = [
  'Enzimología',
  'Metabolismo de carbohidratos',
  'Bioenergética',
  'Metabolismo de lípidos',
  'Integración metabólica',
] as const

export const questions: Question[] = [
  { id: 'q1', topic: 'Enzimología', question: '¿Qué efecto tiene un inhibidor competitivo sobre los parámetros cinéticos?', options: ['Disminuye Vmax, Km sin cambios', 'Aumenta Km, Vmax sin cambios', 'Disminuye Km y Vmax', 'Aumenta Km y disminuye Vmax'], answer: 1, explanation: 'El inhibidor competitivo compite por el sitio activo; con suficiente sustrato se alcanza la misma Vmax, pero se necesita más [S] para llegar a Vmax/2.' },
  { id: 'q2', topic: 'Enzimología', question: 'Km se define como:', options: ['La velocidad máxima de la enzima', 'La [S] a la que v₀ = Vmax/2', 'La concentración de enzima total', 'El número de recambio'], answer: 1, explanation: 'Km es la concentración de sustrato a la que la velocidad es la mitad de la máxima.' },
  { id: 'q3', topic: 'Enzimología', question: 'Las estatinas actúan como inhibidores de:', options: ['Acetil-CoA carboxilasa', 'HMG-CoA sintasa', 'HMG-CoA reductasa', 'Lipoproteína lipasa'], answer: 2, explanation: 'Las estatinas inhiben competitivamente la HMG-CoA reductasa, enzima limitante de la síntesis de colesterol.' },
  { id: 'q4', topic: 'Enzimología', question: 'En una gráfica de Lineweaver-Burk, el corte con el eje Y corresponde a:', options: ['−1/Km', '1/Vmax', 'Km/Vmax', 'Vmax'], answer: 1, explanation: 'La ecuación 1/v = (Km/Vmax)(1/[S]) + 1/Vmax tiene ordenada al origen 1/Vmax.' },
  { id: 'q5', topic: 'Metabolismo de carbohidratos', question: '¿Cuál es la enzima limitante de la glucólisis?', options: ['Hexoquinasa', 'Piruvato quinasa', 'Fosfofructoquinasa-1', 'Aldolasa'], answer: 2, explanation: 'La PFK-1 cataliza el paso comprometido y está regulada alostéricamente por ATP, AMP, citrato y fructosa-2,6-bisfosfato.' },
  { id: 'q6', topic: 'Metabolismo de carbohidratos', question: 'El principal activador alostérico de la PFK-1 en el hígado es:', options: ['Citrato', 'Fructosa-2,6-bisfosfato', 'Glucosa-6-fosfato', 'Acetil-CoA'], answer: 1, explanation: 'La fructosa-2,6-bisfosfato, producida por la PFK-2 en respuesta a insulina, es el activador más potente de la PFK-1.' },
  { id: 'q7', topic: 'Metabolismo de carbohidratos', question: '¿Qué enzima falta en el músculo y le impide liberar glucosa a la sangre?', options: ['Glucógeno fosforilasa', 'Glucosa-6-fosfatasa', 'Hexoquinasa', 'Fosfoglucomutasa'], answer: 1, explanation: 'Solo hígado y riñón expresan glucosa-6-fosfatasa; el músculo usa la glucosa-6-P para su propia glucólisis.' },
  { id: 'q8', topic: 'Metabolismo de carbohidratos', question: 'La piruvato carboxilasa requiere como cofactor:', options: ['Tiamina', 'Biotina', 'Piridoxal fosfato', 'Cobalamina'], answer: 1, explanation: 'Las carboxilasas (piruvato carboxilasa, acetil-CoA carboxilasa, propionil-CoA carboxilasa) usan biotina.' },
  { id: 'q9', topic: 'Metabolismo de carbohidratos', question: 'El fluoruro se añade a los tubos de glucemia porque inhibe:', options: ['Hexoquinasa', 'Enolasa', 'Aldolasa', 'Lactato deshidrogenasa'], answer: 1, explanation: 'El fluoruro inhibe la enolasa, deteniendo la glucólisis de las células sanguíneas en la muestra.' },
  { id: 'q10', topic: 'Bioenergética', question: '¿Cuál es la enzima limitante del ciclo de Krebs?', options: ['Citrato sintasa', 'Isocitrato deshidrogenasa', 'Fumarasa', 'Malato deshidrogenasa'], answer: 1, explanation: 'La isocitrato deshidrogenasa se activa por ADP y Ca²⁺ y se inhibe por ATP y NADH.' },
  { id: 'q11', topic: 'Bioenergética', question: '¿Qué enzima del ciclo de Krebs forma parte de la cadena respiratoria?', options: ['Aconitasa', 'Succinato deshidrogenasa', 'α-cetoglutarato deshidrogenasa', 'Succinil-CoA sintetasa'], answer: 1, explanation: 'La succinato deshidrogenasa es el complejo II; está anclada a la membrana mitocondrial interna.' },
  { id: 'q12', topic: 'Bioenergética', question: 'El cianuro inhibe:', options: ['Complejo I', 'Complejo III', 'Complejo IV', 'ATP sintasa'], answer: 2, explanation: 'El cianuro se une al hierro férrico del citocromo a₃ en la citocromo c oxidasa (complejo IV).' },
  { id: 'q13', topic: 'Bioenergética', question: 'Un desacoplante como el 2,4-dinitrofenol produce:', options: ['Menor consumo de O₂ y más ATP', 'Mayor consumo de O₂, menos ATP y calor', 'Detención del transporte de electrones', 'Inhibición directa de la ATP sintasa'], answer: 1, explanation: 'Disipa el gradiente de protones: la cadena trabaja más rápido, consume más O₂ y la energía se pierde como calor.' },
  { id: 'q14', topic: 'Bioenergética', question: '¿Cuántos NADH se producen por cada vuelta del ciclo de Krebs?', options: ['1', '2', '3', '4'], answer: 2, explanation: 'Isocitrato DH, α-cetoglutarato DH y malato DH generan un NADH cada una.' },
  { id: 'q15', topic: 'Metabolismo de lípidos', question: 'La CPT-I es inhibida por:', options: ['Acetil-CoA', 'Malonil-CoA', 'Citrato', 'Carnitina'], answer: 1, explanation: 'El malonil-CoA (de la síntesis de ácidos grasos) inhibe la CPT-I, evitando que se degraden ácidos grasos recién sintetizados.' },
  { id: 'q16', topic: 'Metabolismo de lípidos', question: '¿Por qué el hígado no puede usar cuerpos cetónicos?', options: ['Carece de mitocondrias', 'Carece de tioforasa', 'Carece de HMG-CoA sintasa', 'Carece de CPT-I'], answer: 1, explanation: 'El hígado no expresa succinil-CoA:acetoacetato CoA transferasa (tioforasa), necesaria para activar el acetoacetato.' },
  { id: 'q17', topic: 'Metabolismo de lípidos', question: 'La deficiencia de MCAD se caracteriza por:', options: ['Hiperglucemia con cetosis', 'Hipoglucemia hipocetósica en ayuno', 'Hipercolesterolemia familiar', 'Anemia hemolítica'], answer: 1, explanation: 'Sin beta-oxidación de cadena media no hay acetil-CoA para la cetogénesis ni energía para la gluconeogénesis.' },
  { id: 'q18', topic: 'Metabolismo de lípidos', question: 'La enzima limitante de la síntesis de ácidos grasos es:', options: ['Ácido graso sintasa', 'ATP-citrato liasa', 'Acetil-CoA carboxilasa', 'Enzima málica'], answer: 2, explanation: 'La acetil-CoA carboxilasa forma malonil-CoA; se activa por citrato e insulina.' },
  { id: 'q19', topic: 'Integración metabólica', question: 'En el ayuno prolongado, el cerebro obtiene gran parte de su energía de:', options: ['Ácidos grasos libres', 'Cuerpos cetónicos', 'Glucógeno cerebral', 'Aminoácidos'], answer: 1, explanation: 'Los ácidos grasos no atraviesan bien la barrera hematoencefálica; los cuerpos cetónicos sí, y reducen el consumo de glucosa.' },
  { id: 'q20', topic: 'Integración metabólica', question: 'Una HbA1c de 7,2% indica:', options: ['Hipoglucemia reciente', 'Glucemia normal', 'Criterio diagnóstico de diabetes', 'Anemia ferropénica'], answer: 2, explanation: 'Una HbA1c ≥ 6,5% es criterio diagnóstico de diabetes mellitus.' },
]

export const flashcards: Flashcard[] = [
  { id: 'f1', topic: 'Enzimología', front: 'Inhibición no competitiva', back: 'Km sin cambios, Vmax disminuida. El inhibidor se une a un sitio distinto del activo.' },
  { id: 'f2', topic: 'Enzimología', front: 'Ecuación de Michaelis-Menten', back: 'v₀ = Vmax·[S] / (Km + [S])' },
  { id: 'f3', topic: 'Metabolismo de carbohidratos', front: 'Enzimas irreversibles de la glucólisis', back: 'Hexoquinasa/glucoquinasa, fosfofructoquinasa-1 y piruvato quinasa.' },
  { id: 'f4', topic: 'Metabolismo de carbohidratos', front: 'Enzimas exclusivas de la gluconeogénesis', back: 'Piruvato carboxilasa, PEP carboxiquinasa, fructosa-1,6-bisfosfatasa y glucosa-6-fosfatasa.' },
  { id: 'f5', topic: 'Metabolismo de carbohidratos', front: 'Enfermedad de von Gierke', back: 'Glucogenosis tipo I: deficiencia de glucosa-6-fosfatasa. Hipoglucemia grave, acidosis láctica, hepatomegalia.' },
  { id: 'f6', topic: 'Metabolismo de carbohidratos', front: 'Ciclo de Cori', back: 'El lactato del músculo y eritrocitos va al hígado, se convierte en glucosa por gluconeogénesis y regresa a los tejidos.' },
  { id: 'f7', topic: 'Bioenergética', front: 'Cofactores de la piruvato deshidrogenasa', back: 'Tiamina (B1), lipoato, CoA (B5), FAD (B2) y NAD⁺ (B3).' },
  { id: 'f8', topic: 'Bioenergética', front: 'Rendimiento de NADH y FADH₂', back: 'NADH ≈ 2,5 ATP; FADH₂ ≈ 1,5 ATP.' },
  { id: 'f9', topic: 'Bioenergética', front: 'Inhibidor del complejo I', back: 'Rotenona y amital.' },
  { id: 'f10', topic: 'Bioenergética', front: 'Oligomicina', back: 'Inhibe la ATP sintasa (subunidad F₀).' },
  { id: 'f11', topic: 'Bioenergética', front: 'Termogenina (UCP-1)', back: 'Proteína desacoplante de la grasa parda que genera calor disipando el gradiente de protones.' },
  { id: 'f12', topic: 'Metabolismo de lípidos', front: 'Rendimiento neto del palmitato', back: '106 ATP (108 brutos − 2 de activación).' },
  { id: 'f13', topic: 'Metabolismo de lípidos', front: 'Cuerpos cetónicos', back: 'Acetoacetato, β-hidroxibutirato y acetona.' },
  { id: 'f14', topic: 'Metabolismo de lípidos', front: 'Enzima limitante de la cetogénesis', back: 'HMG-CoA sintasa mitocondrial.' },
  { id: 'f15', topic: 'Integración metabólica', front: 'Efectos de la insulina', back: '↑ Glucogénesis, lipogénesis y síntesis proteica; ↑ GLUT4; ↓ gluconeogénesis, lipólisis y cetogénesis.' },
  { id: 'f16', topic: 'Integración metabólica', front: 'Vía de los polioles', back: 'Aldosa reductasa convierte glucosa en sorbitol; su acumulación causa cataratas y neuropatía diabética.' },
]
