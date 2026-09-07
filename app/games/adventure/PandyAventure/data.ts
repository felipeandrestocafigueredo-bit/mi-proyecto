/*
===========================================================
PANDY ADVENTURE
MARZO
===========================================================
*/

export interface WorldWord {
    word: string;
    emoji: string;
}

export interface World {
    id: string;
    name: string;
    icon: string;
    grade: number;
    grad: [string, string];
    words: WorldWord[];
}

export const PA_WORLDS: World[] = [
    {
        id:"mar-1",
        name:"There is / There are",
        icon:"📦",
        grade:6,
        grad:["#1a3a6b","#0f2040"],
        words:[
            {word:"chair",emoji:"🪑"},
            {word:"window",emoji:"🪟"},
            {word:"book",emoji:"📚"},
            {word:"board",emoji:"🖥️"},
            {word:"pencil",emoji:"✏️"},
            {word:"door",emoji:"🚪"},
            {word:"table",emoji:"🪴"},
            {word:"clock",emoji:"🕐"},
        ],
    },
    {
        id:"mar-2",
        name:"Singular & Plural",
        icon:"📝",
        grade:6,
        grad:["#3b1f6b","#220f3d"],
        words:[
            {word:"book → books",emoji:"📚"},
            {word:"child → children",emoji:"👶"},
            {word:"tooth → teeth",emoji:"🦷"},
            {word:"box → boxes",emoji:"📦"},
            {word:"person → people",emoji:"👥"},
            {word:"chair → chairs",emoji:"🪑"},
            {word:"bus → buses",emoji:"🚌"},
            {word:"leaf → leaves",emoji:"🍃"},
        ],
    },
    {
        id:"mar-3",
        name:"Physical Adjectives",
        icon:"👁️",
        grade:6,
        grad:["#1a5c3a","#0f3d26"],
        words:[
            {word:"tall",emoji:"📏"},
            {word:"short",emoji:"📐"},
            {word:"curly",emoji:"🌀"},
            {word:"straight",emoji:"〰️"},
            {word:"blonde",emoji:"👱"},
            {word:"brown",emoji:"🟤"},
            {word:"slim",emoji:"🧍"},
            {word:"beard",emoji:"🧔"},
        ],
    },
    {
        id:"mar-4",
        name:"Review",
        icon:"🎓",
        grade:6,
        grad:["#7c1a1a","#4a0f0f"],
        words:[
            {word:"mistake",emoji:"❌"},
            {word:"improve",emoji:"📈"},
            {word:"learn",emoji:"🧠"},
            {word:"practice",emoji:"💪"},
            {word:"review",emoji:"🔄"},
            {word:"goal",emoji:"🎯"},
            {word:"progress",emoji:"🚀"},
            {word:"success",emoji:"🏆"},
        ],
    },
];



export const PA_POSITIVE:string[]=[
    "¡Correcto! 🌟",
    "¡Excelente! 🎉",
    "¡Perfecto! 💯",
    "¡Genial! 🔥",
    "¡Brillante! ✨",
];



export const PA_ENCOURAGE:string[]=[
    "¡Inténtalo! 💪",
    "¡Casi!",
    "¡Tú puedes! ⭐",
    "¡Otra vez!"
];



export const PA_LANES:number[]=[20,50,80];
