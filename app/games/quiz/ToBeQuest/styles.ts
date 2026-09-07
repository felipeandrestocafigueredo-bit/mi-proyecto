/* ==========================================================
   TO BE QUEST
   STYLES
   Arquitectura 3.0
========================================================== */

export const TOBE_CSS = `

@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Baloo+2:wght@600;700;800&family=Nunito:wght@500;700;800&display=swap');

/*==========================================================
    Fondo
==========================================================*/

.tobe-container{
    width:100%;
    max-width:950px;
    margin:auto;
    font-family:'Nunito',sans-serif;
}

/*==========================================================
    Tarjetas
==========================================================*/

.tobe-card{
    background:#FFFFFF;
    border-radius:22px;
    padding:24px;
    box-shadow:0 12px 35px rgba(0,0,0,.12);
}

/*==========================================================
    Botones
==========================================================*/

.tobe-btn{
    width:100%;
    padding:16px;
    border:none;
    border-radius:18px;
    cursor:pointer;
    font-size:1rem;
    font-weight:800;
    font-family:'Nunito',sans-serif;
    transition:.25s;
}

.tobe-btn:hover{
    transform:translateY(-2px);
    box-shadow:0 10px 25px rgba(0,0,0,.18);
}

.tobe-btn:active{
    transform:scale(.98);
}

/*==========================================================
    Opciones
==========================================================*/

.tobe-option{
    width:100%;
    padding:16px;
    border-radius:16px;
    border:2px solid #E5E7EB;
    background:#FFFFFF;
    cursor:pointer;
    font-size:1rem;
    font-weight:700;
    transition:.25s;
}

.tobe-option:hover{
    border-color:#3B82F6;
    background:#EFF6FF;
}

.tobe-option.correct{
    background:#DCFCE7;
    border-color:#22C55E;
    color:#166534;
}

.tobe-option.wrong{
    background:#FEE2E2;
    border-color:#EF4444;
    color:#991B1B;
}

/*==========================================================
    Barra progreso
==========================================================*/

.tobe-progress{
    width:100%;
    height:14px;
    background:#E5E7EB;
    border-radius:40px;
    overflow:hidden;
}

.tobe-progress-fill{
    height:100%;
    border-radius:40px;
    background:linear-gradient(90deg,#3B82F6,#06B6D4);
    transition:.35s;
}

/*==========================================================
    Badge tiempo
==========================================================*/

.tobe-timer{
    padding:6px 14px;
    border-radius:50px;
    color:#FFFFFF;
    font-weight:800;
    font-size:.9rem;
}

/*==========================================================
    Estadísticas
==========================================================*/

.tobe-stats{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(140px,1fr));
    gap:16px;
}

.tobe-stat{
    background:#F8FAFC;
    border-radius:16px;
    padding:18px;
    text-align:center;
    border:1px solid #E5E7EB;
}

.tobe-stat h2{
    margin:0;
    color:#3B82F6;
    font-family:'Fredoka',sans-serif;
}

.tobe-stat small{
    color:#64748B;
    font-weight:700;
}

/*==========================================================
    Estrellas
==========================================================*/

.tobe-stars{
    font-size:2rem;
    letter-spacing:6px;
}

/*==========================================================
    Animaciones
==========================================================*/

@keyframes tbPop{
    0%{
        transform:scale(.85);
        opacity:0;
    }
    100%{
        transform:scale(1);
        opacity:1;
    }
}

@keyframes tbPulse{
    0%,100%{
        transform:scale(1);
    }
    50%{
        transform:scale(1.05);
    }
}

@keyframes tbShake{
    0%,100%{
        transform:translateX(0);
    }
    20%{
        transform:translateX(-6px);
    }
    40%{
        transform:translateX(6px);
    }
    60%{
        transform:translateX(-4px);
    }
    80%{
        transform:translateX(4px);
    }
}

.tobe-pop{
    animation:tbPop .35s ease;
}

.tobe-pulse{
    animation:tbPulse .8s ease;
}

.tobe-shake{
    animation:tbShake .45s ease;
}

`;
