export interface LearningStandard {
  description: string;
}

export interface MonthGameInfo {
  title: string;
  description: string;
  standards: LearningStandard[];
}

const MONTH_GAME_INFO: MonthGameInfo[] = [
  {
    title: "Desafío de Enero",
    description: "Evaluación mensual con vocabulario y actividades del mes.",
    standards: [
      { description: "Identifica vocabulario cotidiano y saludos básicos." },
      { description: "Usa frases sencillas para presentarse y saludar." },
    ],
  },
  {
    title: "Desafío de Febrero",
    description: "Reconoce rutinas, horarios y expresiones de uso diario.",
    standards: [
      { description: "Reconoce verbos de rutina y adverbios de tiempo." },
      { description: "Formula preguntas simples para pedir información." },
    ],
  },
  {
    title: "Desafío de Marzo",
    description: "Aplica el presente simple en contextos escolares y personales.",
    standards: [
      { description: "Usa el presente simple con sujeto y verbo correcto." },
      { description: "Describe actividades diarias con claridad." },
    ],
  },
  {
    title: "Desafío de Abril",
    description: "Muestra dominio del vocabulario del hogar, la escuela y la familia.",
    standards: [
      { description: "Nombra objetos, lugares y relaciones familiares." },
      { description: "Da instrucciones cortas y responde de forma apropiada." },
    ],
  },
  {
    title: "Desafío de Mayo",
    description: "Comprende descripciones breves y comunica preferencias personales.",
    standards: [
      { description: "Interpreta adjetivos básicos y expresiones de gusto." },
      { description: "Expresa opiniones y preferencias con frases sencillas." },
    ],
  },
  {
    title: "Desafío de Junio",
    description: "Practica la descripción de personas, lugares y actividades.",
    standards: [
      { description: "Usa estructuras descriptivas para hablar de personas y lugares." },
      { description: "Describe situaciones cotidianas con coherencia." },
    ],
  },
  {
    title: "Desafío de Julio",
    description: "Evalúa la capacidad para contar historias cortas y compartir ideas.",
    standards: [
      { description: "Organiza secuencias temporales con conectores básicos." },
      { description: "Narra experiencias y responde preguntas de seguimiento." },
    ],
  },
  {
    title: "Desafío de Agosto",
    description: "Aplica tiempos verbales para hablar del pasado y del presente.",
    standards: [
      { description: "Diferencia acciones presentes y pasadas en frases simples." },
      { description: "Cuenta hechos recientes usando vocabulario apropiado." },
    ],
  },
  {
    title: "Desafío de Septiembre",
    description: "Comprende instrucciones, preguntas y respuestas en contexto escolar.",
    standards: [
      { description: "Identifica preguntas, órdenes e instrucciones básicas." },
      { description: "Responde con cortesía en situaciones escolares." },
    ],
  },
  {
    title: "Desafío de Octubre",
    description: "Demuestra control del vocabulario para hablar de experiencias y metas.",
    standards: [
      { description: "Usa vocabulario de metas, emociones y actividades." },
      { description: "Expresa intención, deseo y opinión con claridad." },
    ],
  },
  {
    title: "Desafío de Noviembre",
    description: "Valora la comprensión lectora y la expresión oral de textos breves.",
    standards: [
      { description: "Lee frases breves e identifica ideas principales." },
      { description: "Responde a textos cortos con argumentos sencillos." },
    ],
  },
  {
    title: "Desafío de Diciembre",
    description: "Cierre del año con la integración de contenidos del curso.",
    standards: [
      { description: "Integra vocabulario y estructuras del año escolar." },
      { description: "Comunica ideas, opiniones y experiencias con coherencia." },
    ],
  },
];

export { MONTH_GAME_INFO };

export default MONTH_GAME_INFO;
