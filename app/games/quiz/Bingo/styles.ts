/* ==========================================================
   BINGO
   STYLES
   Arquitectura Oficial 3.0
========================================================== */

export const BINGO_CSS = `

.bingo-container{
    width:100%;
    max-width:1100px;
    margin:auto;
    padding:20px;
    display:flex;
    flex-direction:column;
    gap:20px;
    font-family:Inter,sans-serif;
}

.bingo-title{
    text-align:center;
    font-size:2rem;
    font-weight:700;
    color:#4F46E5;
}

.bingo-board{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:12px;
    width:100%;
}

.bingo-cell{
    background:white;
    border:2px solid #CBD5E1;
    border-radius:16px;
    min-height:110px;
    display:flex;
    justify-content:center;
    align-items:center;
    text-align:center;
    cursor:pointer;
    transition:.25s;
    font-weight:700;
    padding:10px;
}

.bingo-cell:hover{
    transform:translateY(-3px);
    border-color:#4F46E5;
}

.bingo-cell.marked{
    background:#22C55E;
    color:white;
    border-color:#22C55E;
}

.bingo-cell.correct{
    animation:bingoCorrect .35s ease;
}

.bingo-cell.wrong{
    animation:bingoWrong .35s ease;
}

.bingo-progress{
    width:100%;
    height:16px;
    background:#E2E8F0;
    border-radius:50px;
    overflow:hidden;
}

.bingo-progress-fill{
    height:100%;
    background:#4F46E5;
    transition:.3s;
}

.bingo-stats{
    display:flex;
    justify-content:space-between;
    gap:15px;
    flex-wrap:wrap;
}

.bingo-stat{
    flex:1;
    min-width:120px;
    background:white;
    border-radius:15px;
    padding:15px;
    text-align:center;
    box-shadow:0 3px 10px rgba(0,0,0,.08);
}

.bingo-stat h2{
    margin:0;
    color:#4F46E5;
}

.bingo-message{
    text-align:center;
    font-size:1.2rem;
    font-weight:700;
    color:#334155;
}

.bingo-button{
    background:#4F46E5;
    color:white;
    border:none;
    border-radius:12px;
    padding:12px 24px;
    cursor:pointer;
    font-size:1rem;
    font-weight:600;
    transition:.25s;
}

.bingo-button:hover{
    background:#4338CA;
}

.bingo-finish{
    text-align:center;
    display:flex;
    flex-direction:column;
    gap:20px;
    padding:30px;
}

@keyframes bingoCorrect{
    0%{transform:scale(.8);}
    100%{transform:scale(1);}
}

@keyframes bingoWrong{
    0%,100%{
        transform:translateX(0);
    }
    25%{
        transform:translateX(-6px);
    }
    75%{
        transform:translateX(6px);
    }
}

@media(max-width:768px){
    .bingo-board{
        grid-template-columns:repeat(2,1fr);
    }
    .bingo-stats{
        flex-direction:column;
    }
}

`;
