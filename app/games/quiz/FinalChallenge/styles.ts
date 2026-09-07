/* ==========================================================
   FINAL CHALLENGE
   STYLES
   Arquitectura 3.0
========================================================== */

export const FINAL_CSS = `

@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&family=Nunito:wght@500;700;800&display=swap');

:root{
    --fc-primary:#2563EB;
    --fc-secondary:#F59E0B;
    --fc-success:#22C55E;
    --fc-danger:#EF4444;
    --fc-dark:#0F172A;
    --fc-light:#F8FAFC;
    --fc-card:#FFFFFF;
}

/* =======================================================
   Contenedor
======================================================= */

.fc-container{
    width:100%;
    max-width:900px;
    margin:auto;
    padding:20px;
    font-family:'Nunito',sans-serif;
}

/* =======================================================
   Tarjetas
======================================================= */

.fc-card{
    background:var(--fc-card);
    border-radius:22px;
    padding:22px;
    box-shadow:0 10px 25px rgba(0,0,0,.08);
    border:1px solid rgba(0,0,0,.05);
}

/* =======================================================
   Botones
======================================================= */

.fc-btn{
    border:none;
    border-radius:18px;
    padding:14px 20px;
    font-size:1rem;
    font-weight:800;
    cursor:pointer;
    transition:.25s;
    font-family:'Fredoka',sans-serif;
}

.fc-btn:hover{
    transform:translateY(-2px);
    box-shadow:0 8px 18px rgba(0,0,0,.15);
}

.fc-btn:active{
    transform:scale(.98);
}

/* =======================================================
   Opciones
======================================================= */

.fc-option{
    width:100%;
    padding:16px;
    border-radius:18px;
    background:#F8FAFC;
    border:2px solid transparent;
    cursor:pointer;
    transition:.25s;
    font-size:1rem;
    font-weight:700;
    display:flex;
    align-items:center;
    gap:14px;
}

.fc-option:hover{
    border-color:#2563EB;
    background:#EFF6FF;
}

.fc-option.correct{
    background:#DCFCE7;
    border-color:#22C55E;
}

.fc-option.wrong{
    background:#FEE2E2;
    border-color:#EF4444;
}

/* =======================================================
   Barra progreso
======================================================= */

.fc-progress{
    height:14px;
    background:#E5E7EB;
    border-radius:30px;
    overflow:hidden;
}

.fc-progress-fill{
    height:100%;
    background:linear-gradient(
    90deg,
    #2563EB,
    #F59E0B
);
    border-radius:30px;
    transition:.35s;
}

/* =======================================================
   Temporizador
======================================================= */

.fc-timer{
    padding:8px 18px;
    border-radius:30px;
    font-weight:800;
    color:#FFF;
    display:inline-flex;
    align-items:center;
    gap:6px;
}

/* =======================================================
   Estadísticas
======================================================= */

.fc-stats{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(120px,1fr));
    gap:14px;
}

.fc-stat{
    background:#FFFFFF;
    padding:16px;
    border-radius:18px;
    text-align:center;
    box-shadow:0 4px 10px rgba(0,0,0,.05);
}

.fc-stat h2{
    margin:0;
    font-size:1.7rem;
    color:#1E3A8A;
}

.fc-stat small{
    color:#64748B;
    font-weight:700;
}

/* =======================================================
   Estrellas
======================================================= */

.fc-stars{
    font-size:2rem;
    letter-spacing:4px;
}

/* =======================================================
   Podio
======================================================= */

.fc-podium{
    display:flex;
    justify-content:center;
    align-items:flex-end;
    gap:16px;
    margin-top:25px;
}

.fc-place{
    display:flex;
    flex-direction:column;
    align-items:center;
    padding:16px;
    border-radius:18px;
    background:#FFF;
    box-shadow:0 8px 18px rgba(0,0,0,.08);
}

.fc-place.first{
    background:linear-gradient(
    180deg,
    #FDE68A,
    #F59E0B
);
}

.fc-place.second{
    background:linear-gradient(
    180deg,
    #E5E7EB,
    #CBD5E1
);
}

.fc-place.third{
    background:linear-gradient(
    180deg,
    #F5D0A9,
    #C08457
);
}

/* =======================================================
   Animaciones
======================================================= */

@keyframes fcPop{
    0%{
        opacity:0;
        transform:scale(.85);
    }
    100%{
        opacity:1;
        transform:scale(1);
    }
}

.fc-pop{
    animation:fcPop .35s ease;
}

@keyframes fcPulse{
    0%,100%{
        transform:scale(1);
    }
    50%{
        transform:scale(1.05);
    }
    100%{
        transform:scale(1);
    }
}

.fc-pulse{
    animation:fcPulse 1s infinite;
}

`;
