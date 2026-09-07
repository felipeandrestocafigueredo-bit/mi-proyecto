/* ==========================================================
   WORD RACE
   STYLES
   Arquitectura 3.0
========================================================== */

export const WORDRACE_CSS = `

.wordrace-container{
    width:100%;
    max-width:1000px;
    margin:0 auto;
    padding:20px;
    display:flex;
    flex-direction:column;
    gap:20px;
    animation:wordFade .35s ease;
}

.wordrace-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:15px;
    flex-wrap:wrap;
}

.wordrace-title{
    font-size:2rem;
    font-weight:700;
    color:#3B82F6;
    margin:0;
}

.wordrace-progress{
    width:100%;
    height:14px;
    background:#E5E7EB;
    border-radius:999px;
    overflow:hidden;
}

.wordrace-progress-fill{
    height:100%;
    background:linear-gradient(90deg,#3B82F6,#06B6D4);
    transition:width .35s ease;
}

.wordrace-board{
    display:flex;
    justify-content:center;
    align-items:center;
    flex-wrap:wrap;
    gap:10px;
    min-height:90px;
}

.wordrace-letter{
    width:60px;
    height:60px;
    border-radius:14px;
    background:#FFFFFF;
    border:3px solid #CBD5E1;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:1.7rem;
    font-weight:700;
    text-transform:uppercase;
    transition:.25s;
}

.wordrace-letter.correct{
    background:#22C55E;
    color:#FFFFFF;
    border-color:#16A34A;
}

.wordrace-letter.wrong{
    background:#EF4444;
    color:#FFFFFF;
    border-color:#DC2626;
}

.wordrace-keyboard{
    display:grid;
    grid-template-columns:repeat(10,1fr);
    gap:8px;
}

.wordrace-key{
    background:#FFFFFF;
    border:2px solid #CBD5E1;
    border-radius:12px;
    padding:12px;
    font-size:1rem;
    font-weight:700;
    cursor:pointer;
    transition:.2s;
}

.wordrace-key:hover{
    background:#3B82F6;
    color:#FFFFFF;
    border-color:#3B82F6;
}

.wordrace-key:disabled{
    opacity:.45;
    cursor:default;
}

.wordrace-stats{
    display:flex;
    justify-content:space-between;
    gap:15px;
    flex-wrap:wrap;
}

.wordrace-stat{
    flex:1;
    min-width:120px;
    background:#FFFFFF;
    border-radius:16px;
    padding:15px;
    text-align:center;
    box-shadow:0 6px 16px rgba(0,0,0,.08);
}

.wordrace-stat h2{
    margin:0;
    color:#3B82F6;
    font-size:1.5rem;
}

.wordrace-stat small{
    color:#64748B;
    font-weight:600;
}

.wordrace-message{
    text-align:center;
    font-size:1.2rem;
    font-weight:700;
    color:#334155;
}

.wordrace-button{
    background:#3B82F6;
    color:#FFFFFF;
    border:none;
    border-radius:16px;
    padding:12px 24px;
    cursor:pointer;
    font-size:1rem;
    font-weight:700;
    transition:.25s;
}

.wordrace-button:hover{
    background:#2563EB;
    transform:translateY(-2px);
}

.wordrace-finish{
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:18px;
    text-align:center;
    padding:30px;
}

@keyframes wordFade{
    from{
        opacity:0;
        transform:translateY(15px);
    }
    to{
        opacity:1;
        transform:translateY(0);
    }
}

@media(max-width:768px){
    .wordrace-keyboard{
        grid-template-columns:repeat(7,1fr);
    }
}

@media(max-width:500px){
    .wordrace-keyboard{
        grid-template-columns:repeat(5,1fr);
    }
    .wordrace-letter{
        width:48px;
        height:48px;
        font-size:1.3rem;
    }
}
`;
