/* ==========================================================
   SNAP CARDS
   STYLES
   Arquitectura 3.0
========================================================== */

export const SNAP_CSS = `

.snap-container{

    width:100%;

    max-width:1000px;

    margin:0 auto;

    padding:20px;

    display:flex;

    flex-direction:column;

    gap:20px;

    animation:snapFade .35s ease;

}

.snap-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    gap:15px;

    flex-wrap:wrap;

}

.snap-title{

    font-size:2rem;

    font-weight:700;

    color:#6C5CE7;

    margin:0;

}

.snap-board{

    display:grid;

    grid-template-columns:repeat(auto-fit,minmax(120px,1fr));

    gap:16px;

}

.snap-card{

    background:#ffffff;

    border-radius:18px;

    border:3px solid transparent;

    cursor:pointer;

    padding:18px;

    display:flex;

    justify-content:center;

    align-items:center;

    text-align:center;

    min-height:110px;

    transition:all .25s ease;

    font-weight:700;

    font-size:1rem;

    box-shadow:0 8px 18px rgba(0,0,0,.10);

}

.snap-card:hover{

    transform:translateY(-4px);

    border-color:#6C5CE7;

}

.snap-card.correct{

    background:#4CAF50;

    color:#fff;

    border-color:#43A047;

}

.snap-card.wrong{

    background:#FF6B6B;

    color:#fff;

    border-color:#E53935;

}

.snap-card.disabled{

    opacity:.55;

    cursor:default;

    pointer-events:none;

}

.snap-progress{

    width:100%;

    height:14px;

    background:#E5E7EB;

    border-radius:999px;

    overflow:hidden;

}

.snap-progress-fill{

    height:100%;

    background:linear-gradient(90deg,#6C5CE7,#2EC4B6);

    transition:width .35s ease;

}

.snap-stats{

    display:flex;

    justify-content:space-between;

    gap:15px;

    flex-wrap:wrap;

}

.snap-stat{

    flex:1;

    min-width:120px;

    background:#fff;

    border-radius:16px;

    padding:15px;

    text-align:center;

    box-shadow:0 6px 16px rgba(0,0,0,.08);

}

.snap-stat h2{

    margin:0;

    color:#6C5CE7;

    font-size:1.5rem;

}

.snap-stat small{

    color:#64748B;

    font-weight:600;

}

.snap-btn{

    background:#6C5CE7;

    color:white;

    border:none;

    border-radius:16px;

    padding:12px 22px;

    cursor:pointer;

    font-weight:700;

    font-size:1rem;

    transition:.25s;

}

.snap-btn:hover{

    transform:translateY(-2px);

    background:#5946D2;

}

.snap-finish{

    display:flex;

    flex-direction:column;

    align-items:center;

    gap:18px;

    text-align:center;

    padding:30px;

}

@keyframes snapFade{

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

    .snap-board{

        grid-template-columns:repeat(2,1fr);

    }

}

@media(max-width:500px){

    .snap-board{

        grid-template-columns:1fr;

    }

}
`;
