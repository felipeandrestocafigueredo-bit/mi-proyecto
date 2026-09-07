/* ============================================================
   PANDY ADVENTURE
   Styles (Arquitectura 3.0)
   ============================================================ */

export const PA_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@500;700;800&display=swap');

/* =====================================================
   ANIMACIONES
===================================================== */

@keyframes pandaBounce{
    0%,100%{
        transform:translateY(0) rotate(-2deg);
    }
    50%{
        transform:translateY(-12px) rotate(2deg);
    }
}

@keyframes pandaJump{
    0%{
        transform:translateX(-50%) translateY(0) rotate(0);
    }

    30%{
        transform:translateX(-50%) translateY(-38px) rotate(-8deg);
    }

    55%{
        transform:translateX(-50%) translateY(0) rotate(6deg);
    }

    100%{
        transform:translateX(-50%) translateY(0) rotate(0);
    }
}

@keyframes pandaShake{

    0%,100%{
        transform:translateX(-50%) rotate(0);
    }

    20%{
        transform:translateX(-58%) rotate(-8deg);
    }

    40%{
        transform:translateX(-42%) rotate(8deg);
    }

    60%{
        transform:translateX(-56%) rotate(-5deg);
    }

    80%{
        transform:translateX(-44%) rotate(5deg);
    }
}

@keyframes itemBob{

    0%,100%{
        transform:translateY(0) scale(1);
    }

    50%{
        transform:translateY(-8px) scale(1.07);
    }

}

@keyframes paConfetti{

    0%{
        transform:translate(0,0) rotate(0);
        opacity:1;
    }

    100%{
        transform:translate(var(--dx),160px) rotate(var(--rot));
        opacity:0;
    }

}


/* =====================================================
   CONTENEDOR GENERAL
===================================================== */

.pa-game{

    display:flex;
    flex-direction:column;
    position:relative;

    width:100%;
    height:100%;

    overflow:hidden;

    border-radius:18px;

    color:white;

    font-family:'Nunito',sans-serif;

}


/* =====================================================
   HUD
===================================================== */

.pa-hud{

    display:flex;
    align-items:center;
    gap:8px;

    padding:10px 12px;

}

.pa-pill{

    background:rgba(255,255,255,.12);

    border:1px solid rgba(255,255,255,.18);

    border-radius:30px;

    padding:4px 10px;

    font-size:.78rem;

    font-weight:800;

}


/* =====================================================
   PROGRESS
===================================================== */

.pa-progress{

    width:100%;
    height:6px;

    background:rgba(255,255,255,.15);

    overflow:hidden;

}

.pa-progress-fill{

    height:100%;

    background:linear-gradient(
        90deg,
        #95E1D3,
        #FFD93D
    );

}


/* =====================================================
   MISIÓN
===================================================== */

.pa-banner{

    margin:8px;

    padding:10px;

    border-radius:18px;

    background:rgba(255,255,255,.12);

    backdrop-filter:blur(8px);

}


/* =====================================================
   ESCENARIO
===================================================== */

.pa-stage{

    position:relative;

    flex:1;

    overflow:hidden;

}

.pa-item{

    position:absolute;

    text-align:center;

    animation:itemBob 1.8s ease-in-out infinite;

}

.pa-item-emoji{

    font-size:2.7rem;

    filter:drop-shadow(0 6px 10px rgba(0,0,0,.35));

}

.pa-item-label{

    margin-top:4px;

    padding:2px 8px;

    background:rgba(0,0,0,.35);

    border-radius:20px;

    font-size:.62rem;

    font-weight:800;

}


/* =====================================================
   PANDA
===================================================== */

.pa-panda{

    position:absolute;

    bottom:2%;

    transform:translateX(-50%);

    font-size:3.5rem;

    filter:drop-shadow(0 8px 14px rgba(0,0,0,.45));

}

.pa-panda.idle{

    animation:pandaBounce 1.2s ease-in-out infinite;

}

.pa-panda.jump{

    animation:pandaJump .7s ease forwards;

}

.pa-panda.shake{

    animation:pandaShake .55s ease forwards;

}


/* =====================================================
   BOTONES CARRILES
===================================================== */

.pa-lanes{

    display:flex;

    border-top:1px solid rgba(255,255,255,.08);

}

.pa-lane{

    flex:1;

    background:rgba(255,255,255,.05);

    border:none;

    color:white;

    padding:12px 6px;

    cursor:pointer;

    transition:.18s;

}

.pa-lane:hover{

    background:rgba(255,255,255,.12);

}

.pa-lane.active{

    background:rgba(46,196,182,.25);

}


/* =====================================================
   FEEDBACK
===================================================== */

.pa-feedback{

    position:absolute;

    inset:0;

    display:flex;

    align-items:center;

    justify-content:center;

    background:rgba(0,0,0,.35);

    backdrop-filter:blur(4px);

}

.pa-feedback-card{

    width:260px;

    background:rgba(10,17,40,.95);

    border-radius:24px;

    padding:20px;

    text-align:center;

    border:2px solid rgba(255,255,255,.12);

}


/* =====================================================
   CONFETTI
===================================================== */

.pa-confetti{

    position:fixed;

    pointer-events:none;

    animation:paConfetti 1s ease-out forwards;

    z-index:60;

}
`;
