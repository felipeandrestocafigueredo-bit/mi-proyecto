-- =============================================================================
-- MIGRATION 003 — Insert Missing Lessons (5 records)
-- =============================================================================
-- Fuente: alignment-sql-preview.sql — PASO 1
--         audit-integracion-supabase.md §2.1 (148 + 5 = 153 registros)
--
-- Estas lecciones existen localmente pero no en Supabase.
-- Se insertan con contenido exacto de la fuente local.
-- No se modifica ningún lesson_id existente.
-- Usa ON CONFLICT (lesson_id) DO NOTHING para ser idempotente.
-- =============================================================================

-- --------------------------------------------------------------------------
-- 1.1 g67-oct-s3 — Celebrations and traditions
-- --------------------------------------------------------------------------
INSERT INTO public.lessons (
    lesson_id,
    grade_code,
    month_index,
    week_index,
    title,
    content
) VALUES (
    'g67-oct-s3',
    'g67',
    9,
    1,
    '',
    '{
        "topic": "Celebrations and traditions",
        "fecha": "19 – 25 oct",
        "vocab": [
            {"topic":"Celebrations and traditions","cat":"A","catLabel":"Celebrations","emoji":"🎃","en":"Halloween","es":"Halloween"},
            {"topic":"Celebrations and traditions","cat":"A","catLabel":"Celebrations","emoji":"🎄","en":"Christmas","es":"Navidad"},
            {"topic":"Celebrations and traditions","cat":"A","catLabel":"Celebrations","emoji":"💝","en":"Valentine''s Day","es":"Día de San Valentín"},
            {"topic":"Celebrations and traditions","cat":"B","catLabel":"Traditions","emoji":"🪔","en":"Diwali","es":"Diwali"},
            {"topic":"Celebrations and traditions","cat":"B","catLabel":"Traditions","emoji":"🥚","en":"Easter","es":"Pascua"},
            {"topic":"Celebrations and traditions","cat":"B","catLabel":"Traditions","emoji":"🦃","en":"Thanksgiving","es":"Acción de Gracias"},
            {"topic":"Celebrations and traditions","cat":"B","catLabel":"Traditions","emoji":"🎆","en":"Independence Day","es":"Día de la Independencia"},
            {"topic":"Celebrations and traditions","cat":"B","catLabel":"Traditions","emoji":"🧧","en":"Lunar New Year","es":"Año Nuevo Lunar"}
        ],
        "games": ["pandyMemory","snapCards","quizMultiple"],
        "resources": [
            {"title":"British Council — Celebrations","desc":"Vocabulary de celebraciones internacionales","url":"https://learnenglishkids.britishcouncil.org/word-games/celebrations"},
            {"title":"ESL Games World — Festivals","desc":"Juegos de festivals y tradiciones","url":"https://www.eslgamesworld.com/members/games/vocabulary/festivals/"},
            {"title":"Wordwall — Holidays","desc":"Actividades de holidays y celebrations","url":"https://wordwall.net/resource/holidays"}
        ],
        "badge": "",
        "presentation": [
            {
                "objective": "Learn about international celebrations and traditions.",
                "rewards": [{"emoji":"⭐","title":"+100 XP"},{"emoji":"🏆","title":"Weekly Badge"},{"emoji":"🎯","title":"New Achievement"}],
                "tips": ["Research a celebration from another country","Compare traditions with your own culture","Practice saying celebration names in English"]
            }
        ],
        "slides": [],
        "worksheets": []
    }'::jsonb
) ON CONFLICT (lesson_id) DO NOTHING;

-- --------------------------------------------------------------------------
-- 1.2 g67-oct-s4 — Integrated practice: description and can
-- --------------------------------------------------------------------------
INSERT INTO public.lessons (
    lesson_id,
    grade_code,
    month_index,
    week_index,
    title,
    content
) VALUES (
    'g67-oct-s4',
    'g67',
    9,
    2,
    '',
    '{
        "topic": "Integrated practice: description and can",
        "fecha": "26 oct – 1 nov",
        "vocab": [
            {"topic":"Integrated practice","cat":"A","catLabel":"Description","emoji":"👤","en":"He is tall","es":"Él es alto"},
            {"topic":"Integrated practice","cat":"A","catLabel":"Description","emoji":"👤","en":"She has curly hair","es":"Ella tiene cabello rizado"},
            {"topic":"Integrated practice","cat":"A","catLabel":"Description","emoji":"🏡","en":"They can swim","es":"Ellos pueden nadar"},
            {"topic":"Integrated practice","cat":"B","catLabel":"Abilities","emoji":"✋","en":"I can speak English","es":"Puedo hablar inglés"},
            {"topic":"Integrated practice","cat":"B","catLabel":"Abilities","emoji":"✋","en":"She can play piano","es":"Ella puede tocar piano"},
            {"topic":"Integrated practice","cat":"B","catLabel":"Abilities","emoji":"✋","en":"We can run fast","es":"Podemos correr rápido"},
            {"topic":"Integrated practice","cat":"B","catLabel":"Abilities","emoji":"❓","en":"Can you cook?","es":"¿Puedes cocinar?"},
            {"topic":"Integrated practice","cat":"B","catLabel":"Abilities","emoji":"❓","en":"Can they dance?","es":"¿Pueden bailar?"}
        ],
        "games": ["wordRace","snapCards","quizMultiple"],
        "resources": [
            {"title":"British Council — Can/Could","desc":"Ejercicios de can y could","url":"https://learnenglish.britishcouncil.org/grammar/beginner-to-pre-intermediate/can-could"},
            {"title":"ESL Games Plus — Abilities","desc":"Juego de habilidades y abilities","url":"https://www.eslgamesplus.com/"},
            {"title":"Wordwall — Can/Can''t","desc":"Actividades de can y can''t","url":"https://wordwall.net/resource/can-cant"}
        ],
        "badge": "",
        "presentation": [
            {
                "objective": "Integrate physical description with abilities using can.",
                "rewards": [{"emoji":"⭐","title":"+100 XP"},{"emoji":"🏆","title":"Weekly Badge"},{"emoji":"🎯","title":"New Achievement"}],
                "tips": ["Combine adjectives and can: ''She is tall and can run''","Practice questions: ''Can you...?''","Use both description and ability in sentences"]
            }
        ],
        "slides": [],
        "worksheets": []
    }'::jsonb
) ON CONFLICT (lesson_id) DO NOTHING;

-- --------------------------------------------------------------------------
-- 1.3 g67-nov-s2 — Final evaluation for the fourth term
-- --------------------------------------------------------------------------
INSERT INTO public.lessons (
    lesson_id,
    grade_code,
    month_index,
    week_index,
    title,
    content
) VALUES (
    'g67-nov-s2',
    'g67',
    10,
    1,
    '',
    '{
        "topic": "Final evaluation for the fourth term",
        "fecha": "9 – 15 nov",
        "vocab": [
            {"topic":"Fourth term review","cat":"A","catLabel":"Grammar","emoji":"📝","en":"Present simple","es":"Presente simple"},
            {"topic":"Fourth term review","cat":"A","catLabel":"Grammar","emoji":"📝","en":"Present continuous","es":"Presente continuo"},
            {"topic":"Fourth term review","cat":"A","catLabel":"Grammar","emoji":"📝","en":"There is/are","es":"There is/are"},
            {"topic":"Fourth term review","cat":"B","catLabel":"Vocabulary","emoji":"📚","en":"Weather","es":"Clima"},
            {"topic":"Fourth term review","cat":"B","catLabel":"Vocabulary","emoji":"📚","en":"Transport","es":"Transporte"},
            {"topic":"Fourth term review","cat":"B","catLabel":"Vocabulary","emoji":"📚","en":"Family","es":"Familia"},
            {"topic":"Fourth term review","cat":"B","catLabel":"Vocabulary","emoji":"📚","en":"Prepositions","es":"Preposiciones"},
            {"topic":"Fourth term review","cat":"B","catLabel":"Vocabulary","emoji":"📚","en":"Possessives","es":"Posesivos"}
        ],
        "games": ["finalChallenge","bingo","quizMultiple"],
        "resources": [
            {"title":"Google Forms — Final Evaluation","desc":"Evaluación final del cuarto período","url":"https://forms.google.com/"},
            {"title":"Quizlet — P4 Review","desc":"Repaso general del cuarto período","url":"https://quizlet.com/"},
            {"title":"Kahoot — Final Quiz","desc":"Quiz final del período","url":"https://kahoot.com/schools-u/"}
        ],
        "badge": "Evaluación",
        "presentation": [
            {
                "objective": "Complete the final evaluation covering fourth-term vocabulary and grammar.",
                "rewards": [{"emoji":"⭐","title":"+200 XP"},{"emoji":"🏆","title":"Term Badge"},{"emoji":"🎯","title":"Final Achievement"}],
                "tips": ["Review all grammar: present simple, continuous, there is/are","Practice all vocabulary from the term","Take your time and check your answers"]
            }
        ],
        "slides": [],
        "worksheets": []
    }'::jsonb
) ON CONFLICT (lesson_id) DO NOTHING;

-- --------------------------------------------------------------------------
-- 1.4 g67-nov-s3 — Feedback and end-of-school-year closing
-- --------------------------------------------------------------------------
INSERT INTO public.lessons (
    lesson_id,
    grade_code,
    month_index,
    week_index,
    title,
    content
) VALUES (
    'g67-nov-s3',
    'g67',
    10,
    2,
    '',
    '{
        "topic": "Feedback and end-of-school-year closing",
        "fecha": "16 – 22 nov",
        "vocab": [
            {"topic":"Closing","cat":"A","catLabel":"Reflection","emoji":"💡","en":"I learned","es":"Aprendí"},
            {"topic":"Closing","cat":"A","catLabel":"Reflection","emoji":"💡","en":"I improved","es":"Mejoré"},
            {"topic":"Closing","cat":"A","catLabel":"Reflection","emoji":"💡","en":"My goal","es":"Mi meta"},
            {"topic":"Closing","cat":"B","catLabel":"Closing","emoji":"📋","en":"Review","es":"Repaso"},
            {"topic":"Closing","cat":"B","catLabel":"Closing","emoji":"📋","en":"Feedback","es":"Retroalimentación"},
            {"topic":"Closing","cat":"B","catLabel":"Closing","emoji":"📋","en":"Achievement","es":"Logro"},
            {"topic":"Closing","cat":"B","catLabel":"Closing","emoji":"🚀","en":"Next year","es":"Próximo año"},
            {"topic":"Closing","cat":"B","catLabel":"Closing","emoji":"🚀","en":"Keep learning","es":"Sigue aprendiendo"}
        ],
        "games": ["finalChallenge","bingo","quizMultiple"],
        "resources": [
            {"title":"Google Forms — Self-Assessment","desc":"Autoevaluación final del año","url":"https://forms.google.com/"},
            {"title":"Mentimeter — Year Feedback","desc":"Retroalimentación del año escolar","url":"https://www.mentimeter.com/"},
            {"title":"Canva — Year Poster","desc":"Póster de cierre del año","url":"https://www.canva.com/posters/"}
        ],
        "badge": "Retroalimentación",
        "presentation": [
            {
                "objective": "Reflect on the school year and set goals for next year.",
                "rewards": [{"emoji":"⭐","title":"+100 XP"},{"emoji":"🏆","title":"Year Badge"},{"emoji":"🎯","title":"New Achievement"}],
                "tips": ["Describe your progress: ''I improved my...''","Set goals for next year","Acknowledge your achievements"]
            }
        ],
        "slides": [],
        "worksheets": []
    }'::jsonb
) ON CONFLICT (lesson_id) DO NOTHING;

-- --------------------------------------------------------------------------
-- 1.5 g1011-nov-s1 — Formal Writing (Letters, Emails)
-- --------------------------------------------------------------------------
INSERT INTO public.lessons (
    lesson_id,
    grade_code,
    month_index,
    week_index,
    title,
    content
) VALUES (
    'g1011-nov-s1',
    'g1011',
    10,
    3,
    '',
    '{
        "topic": "Formal Writing (Letters, Emails)",
        "fecha": "2 – 8 nov",
        "vocab": [
            {"topic":"Formal writing","cat":"A","catLabel":"Structure","emoji":"📝","en":"Dear Sir/Madam","es":"Dear Sir/Madam"},
            {"topic":"Formal writing","cat":"A","catLabel":"Structure","emoji":"📝","en":"Yours faithfully","es":"Yours faithfully"},
            {"topic":"Formal writing","cat":"A","catLabel":"Structure","emoji":"📝","en":"I am writing to","es":"I am writing to"},
            {"topic":"Formal writing","cat":"B","catLabel":"Email","emoji":"📧","en":"Dear Mr. Smith","es":"Dear Mr. Smith"},
            {"topic":"Formal writing","cat":"B","catLabel":"Email","emoji":"📧","en":"Kind regards","es":"Kind regards"},
            {"topic":"Formal writing","cat":"B","catLabel":"Email","emoji":"📧","en":"Please find attached","es":"Please find attached"},
            {"topic":"Formal writing","cat":"B","catLabel":"Email","emoji":"📧","en":"I look forward to","es":"I look forward to"},
            {"topic":"Formal writing","cat":"B","catLabel":"Email","emoji":"📧","en":"Sincerely","es":"Sincerely"}
        ],
        "games": ["wordRace","snapCards","quizMultiple"],
        "resources": [
            {"title":"British Council — Formal Writing","desc":"Guía de escritura formal en inglés","url":"https://learnenglish.britishcouncil.org/writing"},
            {"title":"ESL Games Plus — Writing","desc":"Ejercicios de escritura formal","url":"https://www.eslgamesplus.com/"},
            {"title":"Wordwall — Formal Letters","desc":"Plantillas de cartas formales","url":"https://wordwall.net/resource/formal-letters"}
        ],
        "badge": "",
        "presentation": [
            {
                "objective": "Master formal writing structures for letters and emails.",
                "rewards": [{"emoji":"⭐","title":"+100 XP"},{"emoji":"🏆","title":"Weekly Badge"},{"emoji":"🎯","title":"New Achievement"}],
                "tips": ["Use formal salutations and closings","Structure: introduction, body, conclusion","Avoid contractions in formal writing"]
            }
        ],
        "slides": [],
        "worksheets": []
    }'::jsonb
) ON CONFLICT (lesson_id) DO NOTHING;
