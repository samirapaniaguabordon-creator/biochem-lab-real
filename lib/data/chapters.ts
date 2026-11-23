export type Lesson = {
  id: string
  title: string
  minutes: number
  summary: string
  content: string[]
  keyPoints: string[]
  clinical?: string
  pathwayId?: string
}

export type Chapter = {
  id: string
  number: number
  title: string
  description: string
  lessons: Lesson[]
}

export const chapters: Chapter[] = [
  {
    id: 'enzimologia',
    number: 1,
    title: 'Enzimología',
    description: 'Propiedades de las enzimas, cinética y mecanismos de regulación.',
    lessons: [
      {
        id: 'enz-1',
        title: 'Conceptos fundamentales de las enzimas',
        minutes: 20,
        summary: 'Las enzimas son catalizadores biológicos que disminuyen la energía de activación sin alterar el equilibrio de la reacción.',
        content: [
          'Las enzimas son, en su mayoría, proteínas que aceleran las reacciones químicas hasta 10¹⁷ veces. Actúan estabilizando el estado de transición, lo que reduce la energía de activación (Eₐ). No modifican la constante de equilibrio ni el ΔG de la reacción.',
          'El sitio activo es una hendidura tridimensional donde se une el sustrato. El modelo de ajuste inducido (Koshland) propone que la enzima cambia de conformación al unir el sustrato, en lugar de ser un molde rígido (modelo llave-cerradura de Fischer).',
          'Muchas enzimas requieren cofactores: iones metálicos (Zn²⁺, Mg²⁺, Fe²⁺) o coenzimas orgánicas, generalmente derivadas de vitaminas. La apoenzima unida a su cofactor forma la holoenzima activa.',
        ],
        keyPoints: [
          'Disminuyen Eₐ, no cambian ΔG ni Keq.',
          'Son específicas para su sustrato y su reacción.',
          'Las coenzimas suelen derivar de vitaminas del complejo B.',
          'Se clasifican en 7 clases (EC): oxidorreductasas, transferasas, hidrolasas, liasas, isomerasas, ligasas y translocasas.',
        ],
        clinical: 'La medición de enzimas séricas (troponina no es enzima, pero CK-MB, ALT, AST y lipasa sí) permite diagnosticar daño tisular específico.',
      },
      {
        id: 'enz-2',
        title: 'Cinética de Michaelis-Menten',
        minutes: 25,
        summary: 'La velocidad de reacción depende de la concentración de sustrato de forma hiperbólica, descrita por Vmax y Km.',
        content: [
          'La ecuación de Michaelis-Menten describe la velocidad inicial (v₀) de una reacción enzimática: v₀ = Vmax · [S] / (Km + [S]). A concentraciones bajas de sustrato la velocidad crece casi linealmente; a concentraciones altas se aproxima a Vmax.',
          'Km es la concentración de sustrato a la que se alcanza la mitad de la velocidad máxima. Un Km bajo indica alta afinidad aparente de la enzima por su sustrato. Vmax es proporcional a la concentración total de enzima.',
          'La representación de Lineweaver-Burk (dobles recíprocos) linealiza la ecuación: 1/v₀ = (Km/Vmax)·(1/[S]) + 1/Vmax. El corte en el eje Y es 1/Vmax y en el eje X es −1/Km.',
        ],
        keyPoints: [
          'Km = [S] cuando v₀ = Vmax/2.',
          'Km bajo → mayor afinidad (ej.: hexoquinasa vs. glucoquinasa).',
          'Vmax depende de la cantidad de enzima.',
          'kcat (número de recambio) = Vmax / [E]total.',
        ],
        pathwayId: 'glucolisis',
      },
      {
        id: 'enz-3',
        title: 'Inhibición y regulación enzimática',
        minutes: 25,
        summary: 'Los inhibidores reversibles alteran Km y/o Vmax de forma característica; las enzimas alostéricas permiten un control fino del metabolismo.',
        content: [
          'Inhibición competitiva: el inhibidor compite con el sustrato por el sitio activo. Aumenta el Km aparente y no cambia la Vmax; se revierte con exceso de sustrato. Ejemplo: metotrexato sobre dihidrofolato reductasa.',
          'Inhibición no competitiva: el inhibidor se une a un sitio distinto, reduce la Vmax y no modifica el Km. No se revierte aumentando el sustrato. La inhibición acompetitiva disminuye tanto Km como Vmax.',
          'Las enzimas alostéricas presentan cinética sigmoidea y suelen catalizar pasos limitantes. También se regulan por modificación covalente (fosforilación por quinasas dependientes de hormonas), inducción/represión génica y proteólisis de zimógenos.',
        ],
        keyPoints: [
          'Competitiva: ↑Km, Vmax igual.',
          'No competitiva: Km igual, ↓Vmax.',
          'Acompetitiva: ↓Km y ↓Vmax.',
          'Inhibidores irreversibles: aspirina (COX), organofosforados (acetilcolinesterasa).',
        ],
        clinical: 'Las estatinas son inhibidores competitivos de la HMG-CoA reductasa, enzima limitante de la síntesis de colesterol.',
      },
    ],
  },
  {
    id: 'carbohidratos',
    number: 2,
    title: 'Metabolismo de carbohidratos',
    description: 'Glucólisis, gluconeogénesis y metabolismo del glucógeno.',
    lessons: [
      {
        id: 'carb-1',
        title: 'Glucólisis',
        minutes: 30,
        summary: 'Vía citosólica de diez pasos que convierte glucosa en dos piruvatos, con ganancia neta de 2 ATP y 2 NADH.',
        content: [
          'La glucólisis se divide en una fase de inversión (pasos 1–5), que consume 2 ATP, y una fase de rendimiento (pasos 6–10), que produce 4 ATP y 2 NADH. Ocurre en el citosol de todas las células y no requiere oxígeno.',
          'Tres reacciones son irreversibles y constituyen los puntos de regulación: hexoquinasa/glucoquinasa, fosfofructoquinasa-1 y piruvato quinasa. La PFK-1 es el paso limitante y comprometido.',
          'En condiciones anaeróbicas, el piruvato se reduce a lactato por la lactato deshidrogenasa para regenerar el NAD⁺ necesario para continuar la glucólisis. En aerobiosis, el piruvato entra a la mitocondria y se convierte en acetil-CoA.',
        ],
        keyPoints: [
          'Enzimas irreversibles: HK, PFK-1, PK.',
          'PFK-1: enzima limitante.',
          'Fructosa-2,6-bisfosfato: principal activador de PFK-1 en hígado.',
          'Eritrocitos dependen exclusivamente de la glucólisis.',
        ],
        clinical: 'La deficiencia de piruvato quinasa causa anemia hemolítica crónica por falta de ATP en el eritrocito.',
        pathwayId: 'glucolisis',
      },
      {
        id: 'carb-2',
        title: 'Gluconeogénesis',
        minutes: 30,
        summary: 'Síntesis de novo de glucosa en hígado y riñón a partir de lactato, aminoácidos y glicerol.',
        content: [
          'La gluconeogénesis no es la glucólisis invertida: comparte siete reacciones reversibles pero utiliza cuatro enzimas exclusivas para rodear los pasos irreversibles: piruvato carboxilasa, PEP carboxiquinasa, fructosa-1,6-bisfosfatasa y glucosa-6-fosfatasa.',
          'Los principales sustratos son el lactato (ciclo de Cori), la alanina (ciclo glucosa-alanina), el glicerol de los triglicéridos y el propionato. Los ácidos grasos de cadena par no son gluconeogénicos, ya que el acetil-CoA no puede convertirse en piruvato.',
          'La regulación es recíproca con la glucólisis: el glucagón disminuye la fructosa-2,6-bisfosfato, lo que inhibe la PFK-1 y libera la inhibición de la fructosa-1,6-bisfosfatasa.',
        ],
        keyPoints: [
          'Cuatro enzimas exclusivas de rodeo.',
          'Piruvato carboxilasa: mitocondrial, requiere biotina, activada por acetil-CoA.',
          'Ácidos grasos de cadena par no producen glucosa.',
          'Costo: 6 ATP/GTP por glucosa.',
        ],
        clinical: 'El consumo de alcohol aumenta la relación NADH/NAD⁺ e inhibe la gluconeogénesis, pudiendo causar hipoglucemia en ayuno.',
        pathwayId: 'gluconeogenesis',
      },
      {
        id: 'carb-3',
        title: 'Metabolismo del glucógeno',
        minutes: 20,
        summary: 'El glucógeno es la reserva de glucosa en hígado (para la glucemia) y músculo (para uso propio).',
        content: [
          'La glucogénesis requiere UDP-glucosa como donador; la glucógeno sintasa forma enlaces α-1,4 y la enzima ramificante crea enlaces α-1,6 cada 8–10 residuos.',
          'La glucogenólisis la cataliza la glucógeno fosforilasa (requiere piridoxal fosfato, B6), que libera glucosa-1-fosfato. La enzima desramificante elimina las ramificaciones.',
          'La regulación es hormonal y recíproca: el glucagón y la adrenalina fosforilan y activan la fosforilasa, e inactivan la sintasa. La insulina hace lo contrario mediante la proteína fosfatasa-1.',
        ],
        keyPoints: [
          'Glucógeno sintasa: enzima limitante de la síntesis.',
          'Glucógeno fosforilasa: enzima limitante de la degradación.',
          'Fosforilación activa la fosforilasa e inactiva la sintasa.',
          'El músculo no libera glucosa por carecer de glucosa-6-fosfatasa.',
        ],
        clinical: 'Enfermedad de McArdle (tipo V): deficiencia de fosforilasa muscular, con calambres e intolerancia al ejercicio.',
      },
    ],
  },
  {
    id: 'bioenergetica',
    number: 3,
    title: 'Bioenergética',
    description: 'Ciclo de Krebs, cadena respiratoria y producción de ATP.',
    lessons: [
      {
        id: 'bioe-1',
        title: 'Ciclo de Krebs',
        minutes: 30,
        summary: 'Vía final común de oxidación de carbohidratos, lípidos y aminoácidos que ocurre en la matriz mitocondrial.',
        content: [
          'El complejo piruvato deshidrogenasa une la glucólisis con el ciclo de Krebs al convertir piruvato en acetil-CoA. Requiere cinco cofactores: tiamina pirofosfato, lipoato, CoA, FAD y NAD⁺.',
          'En cada vuelta, el acetil-CoA se condensa con oxalacetato y, tras ocho reacciones, se liberan 2 CO₂, se generan 3 NADH, 1 FADH₂ y 1 GTP, y se regenera el oxalacetato.',
          'El ciclo es anfibólico: el citrato sale para la síntesis de ácidos grasos, el α-cetoglutarato y el oxalacetato forman aminoácidos, y el succinil-CoA es precursor del hemo.',
        ],
        keyPoints: [
          'Enzima limitante: isocitrato deshidrogenasa.',
          'Por vuelta: 3 NADH, 1 FADH₂, 1 GTP, 2 CO₂.',
          'Succinato deshidrogenasa = complejo II.',
          'Regulado por la carga energética (ATP/ADP, NADH/NAD⁺).',
        ],
        clinical: 'La deficiencia de tiamina en el alcoholismo crónico afecta la piruvato y la α-cetoglutarato deshidrogenasa, causando encefalopatía de Wernicke.',
        pathwayId: 'krebs',
      },
      {
        id: 'bioe-2',
        title: 'Cadena respiratoria y fosforilación oxidativa',
        minutes: 30,
        summary: 'Los electrones de NADH y FADH₂ fluyen hacia el O₂ generando un gradiente de protones que impulsa la síntesis de ATP.',
        content: [
          'La cadena está formada por cuatro complejos (I–IV) y dos transportadores móviles: la ubiquinona (coenzima Q) y el citocromo c. Los complejos I, III y IV bombean protones hacia el espacio intermembrana.',
          'La teoría quimiosmótica de Mitchell establece que la fuerza protón-motriz (gradiente químico de pH y potencial eléctrico) es utilizada por la ATP sintasa para fosforilar ADP.',
          'Los inhibidores bloquean el transporte de electrones y la síntesis de ATP. Los desacoplantes, en cambio, permiten que los protones regresen sin pasar por la ATP sintasa: el transporte de electrones continúa pero la energía se disipa como calor.',
        ],
        keyPoints: [
          'NADH ≈ 2,5 ATP; FADH₂ ≈ 1,5 ATP.',
          'Oxígeno: aceptor final de electrones.',
          'Cianuro y CO inhiben el complejo IV.',
          'UCP-1 (termogenina) produce calor en la grasa parda.',
        ],
        clinical: 'La intoxicación por cianuro produce acidosis láctica grave e hipoxia celular a pesar de una saturación de O₂ normal.',
        pathwayId: 'fosforilacion-oxidativa',
      },
    ],
  },
  {
    id: 'lipidos',
    number: 4,
    title: 'Metabolismo de lípidos',
    description: 'Beta-oxidación, cetogénesis y síntesis de ácidos grasos.',
    lessons: [
      {
        id: 'lip-1',
        title: 'Beta-oxidación de ácidos grasos',
        minutes: 25,
        summary: 'Proceso mitocondrial que degrada ácidos grasos en acetil-CoA mediante ciclos de cuatro reacciones.',
        content: [
          'Los ácidos grasos se activan a acil-CoA en el citosol. Los de cadena larga necesitan la lanzadera de carnitina para entrar en la mitocondria; la CPT-I es el paso regulador y se inhibe por malonil-CoA.',
          'Cada vuelta de la espiral (oxidación, hidratación, oxidación, tiólisis) acorta la cadena en dos carbonos y produce 1 FADH₂, 1 NADH y 1 acetil-CoA.',
          'Los ácidos grasos de cadena impar generan propionil-CoA, que se convierte en succinil-CoA (requiere biotina y vitamina B12) y es gluconeogénico. Los de cadena muy larga se oxidan inicialmente en peroxisomas.',
        ],
        keyPoints: [
          'CPT-I: punto de control, inhibida por malonil-CoA.',
          'Palmitato: 7 vueltas → 8 acetil-CoA.',
          'Rendimiento neto del palmitato: 106 ATP.',
          'Cadena impar → propionil-CoA → succinil-CoA.',
        ],
        clinical: 'La deficiencia de MCAD causa hipoglucemia hipocetósica en ayuno y puede manifestarse como muerte súbita del lactante.',
        pathwayId: 'beta-oxidacion',
      },
      {
        id: 'lip-2',
        title: 'Cetogénesis y cuerpos cetónicos',
        minutes: 20,
        summary: 'En ayuno prolongado el hígado convierte el exceso de acetil-CoA en cuerpos cetónicos, combustible alternativo para cerebro y músculo.',
        content: [
          'Durante el ayuno, el oxalacetato hepático se desvía a gluconeogénesis y el acetil-CoA de la beta-oxidación se acumula. La HMG-CoA sintasa mitocondrial lo canaliza hacia la síntesis de acetoacetato.',
          'El acetoacetato se reduce a β-hidroxibutirato o se descarboxila espontáneamente a acetona. Son hidrosolubles y no requieren transportadores en sangre.',
          'Los tejidos extrahepáticos los reconvierten en acetil-CoA mediante la tioforasa. En la diabetes tipo 1 no controlada, la ausencia de insulina produce cetogénesis descontrolada y cetoacidosis.',
        ],
        keyPoints: [
          'Enzima limitante: HMG-CoA sintasa mitocondrial.',
          'Cuerpos cetónicos: acetoacetato, β-hidroxibutirato, acetona.',
          'El hígado no los usa (sin tioforasa).',
          'Los eritrocitos tampoco (sin mitocondrias).',
        ],
        clinical: 'La cetoacidosis diabética se presenta con respiración de Kussmaul, aliento afrutado, deshidratación y acidosis con anión gap elevado.',
        pathwayId: 'cetogenesis',
      },
      {
        id: 'lip-3',
        title: 'Síntesis de ácidos grasos',
        minutes: 20,
        summary: 'Vía citosólica y anabólica que construye palmitato a partir de acetil-CoA usando NADPH.',
        content: [
          'El acetil-CoA sale de la mitocondria como citrato (lanzadera de citrato). En el citosol, la ATP-citrato liasa lo regenera.',
          'La acetil-CoA carboxilasa (ACC) forma malonil-CoA; es la enzima limitante, requiere biotina, se activa por citrato e insulina y se inhibe por palmitoil-CoA, glucagón y AMPK.',
          'La ácido graso sintasa, complejo multifuncional, añade dos carbonos por ciclo hasta formar palmitato (16C). El NADPH proviene de la vía de las pentosas fosfato y de la enzima málica.',
        ],
        keyPoints: [
          'Enzima limitante: acetil-CoA carboxilasa.',
          'Malonil-CoA inhibe CPT-I (evita ciclo fútil).',
          'Requiere NADPH (pentosas fosfato).',
          'Producto final: palmitato.',
        ],
      },
    ],
  },
  {
    id: 'integracion',
    number: 5,
    title: 'Integración metabólica',
    description: 'Adaptaciones al ayuno, la alimentación y la enfermedad.',
    lessons: [
      {
        id: 'integ-1',
        title: 'Estado de alimentación y ayuno',
        minutes: 25,
        summary: 'La relación insulina/glucagón coordina el uso de combustibles entre hígado, músculo, tejido adiposo y cerebro.',
        content: [
          'En el estado posprandial, la insulina promueve la captación de glucosa (GLUT4), la glucogénesis, la lipogénesis y la síntesis proteica. Predominan las vías anabólicas.',
          'En el ayuno temprano (4–24 h), el glucagón estimula la glucogenólisis hepática y, progresivamente, la gluconeogénesis. El tejido adiposo libera ácidos grasos y glicerol por lipólisis.',
          'En el ayuno prolongado (más de 3 días), la cetogénesis aumenta y el cerebro utiliza cuerpos cetónicos, lo que reduce la necesidad de gluconeogénesis a partir de proteínas musculares.',
        ],
        keyPoints: [
          'Insulina: anabólica; glucagón: catabólico.',
          'Glucógeno hepático se agota en ~24 h.',
          'Cerebro: glucosa → cuerpos cetónicos en ayuno prolongado.',
          'Eritrocitos siempre requieren glucosa.',
        ],
      },
      {
        id: 'integ-2',
        title: 'Diabetes mellitus: correlación bioquímica',
        minutes: 25,
        summary: 'La deficiencia o resistencia a la insulina reproduce un estado de "ayuno metabólico" pese a la hiperglucemia.',
        content: [
          'En la diabetes tipo 1, la destrucción autoinmune de las células β causa ausencia absoluta de insulina. El hígado actúa como en ayuno: gluconeogénesis, glucogenólisis y cetogénesis sin freno.',
          'En la diabetes tipo 2, la resistencia a la insulina en músculo, hígado y tejido adiposo se acompaña de disfunción progresiva de las células β. La cetoacidosis es rara porque la insulina residual inhibe la lipólisis.',
          'La hiperglucemia crónica produce glicación no enzimática de proteínas (HbA1c) y activa la vía de los polioles (aldosa reductasa), contribuyendo a retinopatía, neuropatía y nefropatía.',
        ],
        keyPoints: [
          'DM1: cetoacidosis diabética.',
          'DM2: estado hiperosmolar hiperglucémico.',
          'HbA1c refleja la glucemia de 2–3 meses.',
          'Sorbitol acumulado → cataratas y neuropatía.',
        ],
        clinical: 'Una HbA1c ≥ 6,5% es criterio diagnóstico de diabetes mellitus.',
      },
    ],
  },
]

export const allLessons = chapters.flatMap((c) => c.lessons.map((l) => ({ ...l, chapterId: c.id, chapterTitle: c.title })))

export function getChapter(id: string) {
  return chapters.find((c) => c.id === id)
}
