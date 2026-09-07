/* ==========================================================
   QUIZ MULTIPLE
   Arquitectura 3.0
   Styles
========================================================== */

export const QUIZ_CSS = `

@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@600;700;800&display=swap');

/* ======================================================
   Animaciones
====================================================== */

@keyframes quizFade{
    from{
        opacity:0;
        transform:translateY(20px);
    }
    to{
        opacity:1;
        transform:translateY(0);
    }
}

@keyframes quizPop{
    0%{
        transform:scale(.8);
    }
    60%{
        transform:scale(1.08);
    }
    100%{
        transform:scale(1);
    }
}

@keyframes quizShake{
    0%,100%{
        transform:translateX(0);
    }
    25%{
        transform:translateX(-6px);
    }
    50%{
        transform:translateX(6px);
    }
    75%{
        transform:translateX(-4px);
    }
}

@keyframes quizPulse{
    0%,100%{
        transform:scale(1);
    }
    50%{
        transform:scale(1.05);
    }
}

@keyframes quizProgress{
    from{
        width:0%;
    }
}

/* ======================================================
   Tarjeta principal
====================================================== */

.quiz-card{
    animation:quizFade .35s ease;
    border-radius:20px;
}

/* ======================================================
   Pregunta
====================================================== */

.quiz-question{
    font-family:'Fredoka',sans-serif;
    font-size:1.2rem;
    font-weight:700;
    color:#2D3047;
    text-align:center;
}

/* ======================================================
   Opciones
====================================================== */

.quiz-option{
    width:100%;
    padding:16px;
    border-radius:16px;
    border:none;
    cursor:pointer;
    transition:.20s;
    font-family:'Nunito',sans-serif;
    font-size:1rem;
    font-weight:700;
    background:white;
    box-shadow:0 5px 10px rgba(0,0,0,.08);
}

.quiz-option:hover{
    transform:translateY(-2px);
    box-shadow:0 8px 18px rgba(0,0,0,.15);
}

.quiz-option.correct{
    background:#22C55E;
    color:white;
    animation:quizPop .35s;
}

.quiz-option.wrong{
    background:#EF4444;
    color:white;
    animation:quizShake .35s;
}

.quiz-option.disabled{
    pointer-events:none;
    opacity:.75;
}

/* ======================================================
   Barra progreso
====================================================== */

.quiz-progress{
    width:100%;
    height:8px;
    background:#E5E7EB;
    border-radius:20px;
    overflow:hidden;
}

.quiz-progress-fill{
    height:100%;
    background:linear-gradient(
        90deg,
        #6C5CE7,
        #2EC4B6
    );
    animation:quizProgress .4s ease;
}

/* ======================================================
   Timer
====================================================== */

.quiz-timer{
    font-weight:800;
    font-size:.9rem;
    color:#6C5CE7;
}

/* ======================================================
   Feedback
====================================================== */

.quiz-feedback{
    animation:quizPop .3s;
    font-family:'Fredoka',sans-serif;
    font-size:1.1rem;
    font-weight:700;
}

/* ======================================================
   Botones
====================================================== */

.quiz-btn{
    cursor:pointer;
    border:none;
    border-radius:40px;
    padding:14px 22px;
    font-family:'Fredoka',sans-serif;
    font-weight:700;
    transition:.2s;
}

.quiz-btn:hover{
    transform:translateY(-2px);
}

/* ======================================================
   Podio
====================================================== */

.quiz-stars{
    animation:quizPulse 1.5s infinite;
}

`;
