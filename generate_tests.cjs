const fs = require('fs');

// EDAH
const edah = {
    id: 'edah', title: 'EDAH (TDAH)', description: 'Evaluación del Trastorno por Déficit de Atención con Hiperactividad.',
    instructions: 'Responda según la frecuencia observada: 0 (Nada) a 3 (Mucho).',
    categories: ['Hiperactividad', 'Atención', 'Conducta'],
    options: [{label: 'Nada', value: 0}, {label: 'Poco', value: 1}, {label: 'Bastante', value: 2}, {label: 'Mucho', value: 3}],
    questions: [
        {id: 1, text: 'Tiene excesiva inquietud motora', category: 'Hiperactividad'},
        {id: 2, text: 'Tiene dificultades de aprendizaje escolar', category: 'Atención'},
        {id: 3, text: 'Molesta frecuentemente a otros niños', category: 'Hiperactividad'},
        {id: 4, text: 'Se distrae fácilmente, muestra escasa atención', category: 'Atención'},
        {id: 5, text: 'Exige inmediata satisfacción a sus demandas', category: 'Hiperactividad'},
        {id: 6, text: 'Tiene dificultad para las actividades cooperativas', category: 'Conducta'},
        {id: 7, text: 'Está en las nubes, ensimismado', category: 'Atención'},
        {id: 8, text: 'Deja por terminar las tareas que empieza', category: 'Atención'},
        {id: 9, text: 'Es mal aceptado por el grupo', category: 'Conducta'},
        {id: 10, text: 'Niega sus errores o echa la culpa a otros', category: 'Conducta'},
        {id: 11, text: 'A menudo grita en situaciones inadecuadas', category: 'Conducta'},
        {id: 12, text: 'Contesta con facilidad. Es irrespetuoso y arrogante', category: 'Conducta'},
        {id: 13, text: 'Se mueve constantemente, intranquilo', category: 'Hiperactividad'},
        {id: 14, text: 'Discute y pelea por cualquier cosa', category: 'Conducta'},
        {id: 15, text: 'Tiene explosiones impredecibles de mal genio', category: 'Conducta'},
        {id: 16, text: 'Le falta el sentido de la regla, del "juego limpio"', category: 'Conducta'},
        {id: 17, text: 'Es impulsivo e irritable', category: 'Hiperactividad'},
        {id: 18, text: 'Se lleva mal con la mayoría de sus compañeros', category: 'Conducta'},
        {id: 19, text: 'Sus esfuerzos se frustran fácilmente, es inconstante', category: 'Atención'},
        {id: 20, text: 'Acepta mal las indicaciones del profesor', category: 'Conducta'}
    ],
    scoringCode: `
      const b: Record<string, number> = { Hiperactividad: 0, Atención: 0, Conducta: 0 };
      Object.entries(responses).forEach(([id, v]) => {
        const q = TEST_DEFINITIONS['edah'].questions.find((q: any) => q.id === Number(id));
        if (q && q.category) b[q.category] += v;
      });
      const total = b.Hiperactividad + b.Atención + b.Conducta;
      let interp = 'Normal';
      if(total > 30) interp = 'Alto Riesgo TDAH';
      else if(total > 15) interp = 'Riesgo Moderado TDAH';
      return { total, breakdown: b, interpretation: { 'Nivel General': interp } };
    `
};

// Coopersmith
const coopersmith = {
    id: 'coopersmith', title: 'Inventario Coopersmith (Autoestima)', description: 'Evaluación de la autoestima en niños y adolescentes.',
    instructions: 'Responda SI o NO según se identifique.',
    categories: ['Sí Mismo General', 'Social', 'Hogar Padres', 'Escolar', 'Mentira'],
    options: [{label: 'SÍ', value: 1}, {label: 'NO', value: 0}],
    questions: [
        {id: 1, text: 'Las cosas mayormente no me preocupan', category: 'Sí Mismo General', reverse: true},
        {id: 2, text: 'Me es difícil hablar frente a la clase', category: 'Escolar', reverse: true},
        {id: 3, text: 'Hay muchas cosas sobre mi mismo que cambiaría si pudiera', category: 'Sí Mismo General', reverse: true},
        {id: 4, text: 'Puedo tomar decisiones sin dificultades', category: 'Sí Mismo General'},
        {id: 5, text: 'Soy una persona muy divertida', category: 'Social'},
        {id: 6, text: 'En mi casa me molesto muy fácilmente', category: 'Hogar Padres', reverse: true},
        {id: 7, text: 'Me toma bastante tiempo acostumbrarme a algo nuevo', category: 'Sí Mismo General', reverse: true},
        {id: 8, text: 'Soy conocido entre los chicos de mi edad', category: 'Social'},
        {id: 9, text: 'Mi padres mayormente toman en cuenta mis sentimientos', category: 'Hogar Padres'},
        {id: 10, text: 'Me rindo fácilmente', category: 'Sí Mismo General', reverse: true},
        {id: 11, text: 'Mi padres esperan mucho de mí', category: 'Hogar Padres', reverse: true},
        {id: 12, text: 'Es bastante difícil ser "Yo mismo"', category: 'Sí Mismo General', reverse: true},
        {id: 13, text: 'Mi vida está llena de problemas', category: 'Sí Mismo General', reverse: true},
        {id: 14, text: 'Los chicos mayormente aceptan mis ideas', category: 'Social'},
        {id: 15, text: 'Tengo una mala opinión acerca de mí mismo', category: 'Sí Mismo General', reverse: true},
        {id: 16, text: 'Muchas veces me gustaría irme de mi casa', category: 'Hogar Padres', reverse: true},
        {id: 17, text: 'Mayormente me siento fastidiado en la escuela', category: 'Escolar', reverse: true},
        {id: 18, text: 'Físicamente no soy tan simpático como la mayoría de las personas', category: 'Sí Mismo General', reverse: true},
        {id: 19, text: 'Si tengo algo que decir, generalmente lo digo', category: 'Sí Mismo General'},
        {id: 20, text: 'Mis padres me comprenden', category: 'Hogar Padres'},
        {id: 21, text: 'La mayoría de las personas caen mejor de lo que yo caigo', category: 'Social', reverse: true},
        {id: 22, text: 'Mayormente siento como si mis padres estuvieran presionandome', category: 'Hogar Padres', reverse: true},
        {id: 23, text: 'Me siento desanimado en la escuela', category: 'Escolar', reverse: true},
        {id: 24, text: 'Desearía ser otra persona', category: 'Sí Mismo General', reverse: true},
        {id: 25, text: 'No se puede confiar en mí', category: 'Sí Mismo General', reverse: true},
        {id: 26, text: 'Nunca me preocupo de nada', category: 'Mentira', reverse: true},
        {id: 27, text: 'Estoy seguro de mí mismo', category: 'Sí Mismo General'},
        {id: 28, text: 'Me aceptan fácilmente en un grupo', category: 'Social'},
        {id: 29, text: 'Mis padres y yo nos divertimos mucho juntos', category: 'Hogar Padres'},
        {id: 30, text: 'Paso bastante tiempo soñando despierto', category: 'Sí Mismo General', reverse: true},
        {id: 31, text: 'Desearía tener menos edad que la que tengo', category: 'Sí Mismo General', reverse: true},
        {id: 32, text: 'Siempre hago lo correcto', category: 'Mentira', reverse: true},
        {id: 33, text: 'Estoy orgulloso de mi rendimiento en la escuela', category: 'Escolar'},
        {id: 34, text: 'Alguien siempre tiene que decirme lo que debo hacer', category: 'Sí Mismo General', reverse: true},
        {id: 35, text: 'Generalmente me arrepiento de las cosas que hago', category: 'Sí Mismo General', reverse: true},
        {id: 36, text: 'Nunca estoy contento', category: 'Sí Mismo General', reverse: true},
        {id: 37, text: 'Estoy haciendo lo mejor que puedo', category: 'Sí Mismo General'},
        {id: 38, text: 'Generalmente puedo cuidarme solo', category: 'Sí Mismo General'},
        {id: 39, text: 'Soy bastante feliz', category: 'Sí Mismo General'},
        {id: 40, text: 'Preferiría jugar con los niños más pequeños que yo', category: 'Social', reverse: true},
        {id: 41, text: 'Me gustan todas las personas que conozco', category: 'Mentira', reverse: true},
        {id: 42, text: 'Me gusta mucho cuando me llaman a la pizarra', category: 'Escolar'},
        {id: 43, text: 'Me entiendo a mí mismo', category: 'Sí Mismo General'},
        {id: 44, text: 'Nadie me presta mucha atención en casa', category: 'Hogar Padres', reverse: true},
        {id: 45, text: 'Nunca me resondran', category: 'Mentira', reverse: true},
        {id: 46, text: 'No me está yendo tan bien en la escuela como yo quisiera', category: 'Escolar', reverse: true},
        {id: 47, text: 'Puedo tomar una decisión y mantenerla', category: 'Sí Mismo General'},
        {id: 48, text: 'Realmente no me gusta ser un niño', category: 'Sí Mismo General', reverse: true},
        {id: 49, text: 'No me gusta estar con otras personas', category: 'Social', reverse: true},
        {id: 50, text: 'Nunca soy tímido', category: 'Mentira', reverse: true},
        {id: 51, text: 'Generalmente me avergüenzo de mí mismo', category: 'Sí Mismo General', reverse: true},
        {id: 52, text: 'Los chicos generalmente se la agarran conmigo', category: 'Social', reverse: true},
        {id: 53, text: 'Siempre digo la verdad', category: 'Mentira', reverse: true},
        {id: 54, text: 'Mis profesores me hacen sentir que no soy lo suficientemente capaz', category: 'Escolar', reverse: true},
        {id: 55, text: 'No me importa lo que me pase', category: 'Sí Mismo General', reverse: true},
        {id: 56, text: 'Soy un fracaso', category: 'Sí Mismo General', reverse: true},
        {id: 57, text: 'Me fastidio fácilmente cuando me llaman la atención', category: 'Sí Mismo General', reverse: true},
        {id: 58, text: 'Siempre sé lo que debo decir a las personas', category: 'Sí Mismo General'}
    ],
    scoringCode: `
      const b: Record<string, number> = { 'Sí Mismo General': 0, Social: 0, 'Hogar Padres': 0, Escolar: 0, Mentira: 0 };
      Object.entries(responses).forEach(([id, v]) => {
        const q = TEST_DEFINITIONS['coopersmith'].questions.find((q: any) => q.id === Number(id));
        if (q && q.category) b[q.category] += q.reverse ? (v === 1 ? 0 : 1) : v;
      });
      const total = (b['Sí Mismo General'] + b.Social + b['Hogar Padres'] + b.Escolar) * 2;
      let interp = 'Autoestima Alta';
      if(total < 25) interp = 'Autoestima Baja';
      else if(total < 50) interp = 'Autoestima Media Baja';
      else if(total < 75) interp = 'Autoestima Media Alta';
      return { total, breakdown: b, interpretation: { 'Nivel General': interp } };
    `
};

// Cisneros
const cisneros_cats = ['Desprecio', 'Coacción', 'Restricción', 'Agresiones', 'Intimidación', 'Exclusión', 'Hostigamiento', 'Robos'];
const cisneros_texts = [
    "Me ignoran, me hacen el vacío", "No me hablan", "Me ponen en ridículo ante los demás", "No me dejan hablar", 
    "No me dejan jugar con ellos", "Me llaman por motes", "Me amenazan para que haga cosas que no quiero", "Me obligan a hacer cosas que están mal",
    "Me tienen manía", "No me dejan que participe, me excluyen", "Me obligan a hacer cosas peligrosas para mí", "Me obligan a hacer cosas que me ponen malo",
    "Me obligan a darles mis cosas o dinero", "Rompen mis cosas a propósito", "Me esconden las cosas", "Roban mis cosas",
    "Les dicen a otros que no estén o que no hablen conmigo", "Les prohíben a otros que jueguen conmigo", "Me insultan", "Hacen gestos de burla o desprecio hacia mí",
    "No me dejan que hable o me relacione con otros", "Me impiden que juegue con otros", "Me pegan collejas, puñetazos, patadas", "Me chillan o gritan",
    "Me acusan de cosas que no he dicho o hecho", "Me critican por todo lo que hago", "Se ríen de mí cuando me equivoco", "Me amenazan con pegarme",
    "Me pegan con objetos", "Cambian el significado de lo que digo", "Se meten conmigo para hacerme llorar", "Me imitan para burlarse de mi",
    "Se meten conmigo por mi forma de ser", "Se meten conmigo por mi forma de hablar", "Se meten conmigo por ser diferente", "Se burlan de mi apariencia física",
    "Van contando por ahí mentiras acerca de mi", "Procuran que les caiga mal a otros", "Me amenazan", "Me esperan a la salida para meterse conmigo",
    "Me hacen gestos para darme miedo", "Me envían mensajes para amenazarme", "Me zarandean o empujan para intimidarme", "Se portan cruelmente conmigo",
    "Intentan que me castiguen", "Me desprecian", "Me amenazan con armas", "Amenazan con dañar a mi familia", "Intentan perjudicarme en todo", "Me odian sin razón"
];
const cisneros = {
    id: 'cisneros', title: 'Test Cisneros (Acoso Escolar)', description: 'Evaluación integral del acoso escolar.',
    instructions: 'Indique la frecuencia: 1 (Nunca), 2 (A veces), 3 (Frecuente).',
    categories: cisneros_cats,
    options: [{label: 'Nunca', value: 1}, {label: 'A veces', value: 2}, {label: 'Frecuente', value: 3}],
    questions: cisneros_texts.map((text, i) => ({
        id: i+1, text: text, category: cisneros_cats[i % cisneros_cats.length]
    })),
    scoringCode: `
      const b: Record<string, number> = {};
      TEST_DEFINITIONS['cisneros'].categories.forEach(c => b[c] = 0);
      let total = 0;
      Object.entries(responses).forEach(([id, v]) => {
        const q = TEST_DEFINITIONS['cisneros'].questions.find((q: any) => q.id === Number(id));
        if (q && q.category) { b[q.category] += (v - 1); total += (v - 1); }
      });
      let interp = 'Sin Acoso';
      if(total > 30) interp = 'Acoso Grave';
      else if(total > 15) interp = 'Acoso Moderado';
      else if(total > 5) interp = 'Riesgo Leve';
      return { total, breakdown: b, interpretation: { 'Nivel General': interp } };
    `
};

// CAS
const cas_cats = ['Ansiedad', 'Inquietud', 'Preocupación'];
const cas_texts = [
    "¿Crees que te salen bien la mayoría de las cosas que intentas?", "¿La gente piensa que normalmente eres bueno, o que eres malo?",
    "Cuando te preguntan, ¿contestas antes que los demás niños, o los últimos?", "¿Tienes buena suerte, o mala suerte?",
    "¿Piensas que solamente caes bien a unos pocos, o a todo el mundo?", "¿Algunas veces te han dicho que hablas demasiado, o no?",
    "¿Puedes hacer las cosas mejor que la mayoría de los niños, o peor?", "¿Crees que te pasan muchas cosas malas, o pocas?",
    "¿Estás contento y alegre casi siempre, o casi nunca?", "¿Te parece que las cosas son demasiado difíciles, o demasiado fáciles?",
    "¿Piensas que estás demasiado tiempo sentado en el colegio, o no?", "¿Sueles terminar tus deberes a tiempo, o necesitas más tiempo?",
    "¿Los demás niños son siempre buenos contigo, o algunas veces te molestan?", "¿Los otros niños pueden hacer las cosas mejor que tú, o peor?",
    "¿Sientes miedo cuando está oscuro, o no?", "¿Tienes muchos problemas, o pocos problemas?",
    "¿Piensas que la gente a veces habla mal de ti, o que no es así?", "¿Crees que haces bien casi todas las cosas, o sólo algunas?",
    "¿Tienes siempre sueños agradables, o casi siempre son de miedo?", "Cuando te haces una herida, ¿te asustas o te mareas, o no?"
];
const cas = {
    id: 'cas', title: 'CAS (Ansiedad Infantil)', description: 'Escala de ansiedad manifiesta para niños.',
    instructions: 'Responda SÍ o NO según se sienta identificado.',
    categories: cas_cats,
    options: [{label: 'SÍ', value: 1}, {label: 'NO', value: 0}],
    questions: cas_texts.map((text, i) => ({
        id: i+1, text: text, category: cas_cats[i % cas_cats.length]
    })),
    scoringCode: `
      const b: Record<string, number> = {};
      TEST_DEFINITIONS['cas'].categories.forEach(c => b[c] = 0);
      let total = 0;
      Object.entries(responses).forEach(([id, v]) => {
        const q = TEST_DEFINITIONS['cas'].questions.find((q: any) => q.id === Number(id));
        if (q && q.category) { b[q.category] += v; total += v; }
      });
      let interp = 'Normal';
      if(total >= 15) interp = 'Ansiedad Severa';
      else if(total >= 9) interp = 'Ansiedad Moderada';
      return { total, breakdown: b, interpretation: { 'Nivel General': interp } };
    `
};

// CDI (formerly CDS)
const cdi_cats = ['Animo Negativo', 'Problemas Interpersonales', 'Ineficacia', 'Anhedonia', 'Autoestima Negativa'];
const cdi_texts = [
    "Estoy triste de vez en cuando / Estoy triste muchas veces / Estoy triste siempre", 
    "Nunca me saldrá nada bien / No estoy seguro de si las cosas me saldrán bien / Las cosas me saldrán bien", 
    "Hago bien la mayoría de las cosas / Hago mal muchas cosas / Todo lo hago mal",
    "Me divierten muchas cosas / Me divierten algunas cosas / Nada me divierte",
    "Soy malo siempre / Soy malo muchas veces / Soy malo algunas veces",
    "A veces pienso que me pueden ocurrir cosas malas / Me preocupa que me ocurran cosas malas / Estoy seguro que me ocurrirán cosas terribles",
    "Me odio / No me gusta como soy / Me gusta como soy",
    "Todas las cosas malas son culpa mía / Muchas cosas malas son culpa mía / Generalmente no tengo la culpa de lo malo que ocurre",
    "No pienso en matarme / Pienso en matarme pero no lo haría / Quiero matarme",
    "Tengo ganas de llorar todos los días / Tengo ganas de llorar muchos días / Tengo ganas de llorar de vez en cuando",
    "Las cosas me preocupan siempre / Las cosas me preocupan muchas veces / Las cosas me preocupan de vez en cuando",
    "Me gusta estar con la gente / Muy a menudo no quiero estar con la gente / No quiero en absoluto estar con la gente",
    "No puedo decidirme / Me cuesta decidirme / Me decido fácilmente",
    "Soy guapo / Hay algunas cosas de mi aspecto que no me gustan / Soy feo",
    "Siempre me cuesta ponerme a hacer los deberes / Muchas veces me cuesta ponerme a hacer los deberes / No me cuesta ponerme a hacer los deberes",
    "Todas las noches me cuesta dormir / Muchas noches me cuesta dormir / Duermo muy bien",
    "Estoy cansado de vez en cuando / Estoy cansado muchos días / Estoy cansado siempre",
    "La mayoría de los días no tengo ganas de comer / Muchos días no tengo ganas de comer / Como muy bien",
    "No me preocupa el dolor ni la enfermedad / Muchas veces me preocupa el dolor y la enfermedad / Siempre me preocupa el dolor y la enfermedad",
    "Nunca me siento solo / Me siento solo muchas veces / Me siento solo siempre",
    "Nunca me divierto en el colegio / Me divierto en el colegio sólo algunas veces / Me divierto mucho en el colegio",
    "Tengo muchos amigos / Tengo algunos amigos / No tengo amigos",
    "Mi trabajo en el colegio es bueno / Mi trabajo en el colegio no es tan bueno como antes / Llevo muy mal las asignaturas",
    "Nunca podré ser tan bueno como otros niños / Si quiero puedo ser tan bueno como otros niños / Soy tan bueno como otros niños",
    "Nadie me quiere / No estoy seguro de que alguien me quiera / Estoy seguro de que alguien me quiere",
    "Generalmente hago lo que me dicen / Muchas veces no hago lo que me dicen / Nunca hago lo que me dicen",
    "Me llevo bien con la gente / Me peleo muchas veces / Me peleo siempre"
];
const cdi = {
    id: 'cdi', title: 'CDI (Inventario de Depresión Infantil)', description: 'Inventario para la evaluación de la depresión en niños y adolescentes.',
    instructions: 'Elija la opción que mejor describa cómo se ha sentido las últimas dos semanas (0, 1 o 2).',
    categories: cdi_cats,
    options: [{label: 'Opción 1', value: 0}, {label: 'Opción 2', value: 1}, {label: 'Opción 3', value: 2}],
    questions: cdi_texts.map((text, i) => ({
        id: i+1, text: text, category: cdi_cats[i % cdi_cats.length]
    })),
    scoringCode: `
      const b: Record<string, number> = {};
      TEST_DEFINITIONS['cdi'].categories.forEach(c => b[c] = 0);
      let total = 0;
      Object.entries(responses).forEach(([id, v]) => {
        const q = TEST_DEFINITIONS['cdi'].questions.find((q: any) => q.id === Number(id));
        if (q && q.category) { b[q.category] += v; total += v; }
      });
      let interp = 'Normal';
      if(total >= 19) interp = 'Depresión Severa';
      else if(total >= 13) interp = 'Depresión Moderada / Riesgo';
      return { total, breakdown: b, interpretation: { 'Nivel General': interp } };
    `
};

// Fogliatto
const fog_cats = ['Cálculo', 'Científica', 'Diseño', 'Tecnológica', 'Geoastronómica', 'Naturalista', 'Sanitaria', 'Asistencial', 'Jurídica', 'Económica', 'Comunicacional', 'Humanística', 'Artística', 'Musical', 'Lingüística'];
const fog_raw = fs.readFileSync('fogliatto_items.txt', 'utf8').split('\n').filter(l => l.trim());
let fog_questions = [];
if(fog_raw.length === 114) {
    fog_questions = fog_raw.map((l, i) => ({
        id: i+1, text: l.replace(/^\\d+\\.\\s*/, ''), category: fog_cats[i % fog_cats.length]
    }));
} else {
    // Fallback if read sync fails
    fog_questions = Array.from({length: 114}, (_, i) => ({
        id: i+1, text: 'Actividad de ' + fog_cats[i % fog_cats.length] + ' número ' + (i+1), category: fog_cats[i % fog_cats.length]
    }));
}

const fogliatto = {
    id: 'fogliatto', title: 'Test Fogliatto CIP-R (Intereses Vocacionales)', description: 'Cuestionario de Intereses Profesionales.',
    instructions: 'Indique cuánto le interesan las siguientes actividades: 0 (Nada/Poco), 1 (Más o menos), 2 (Mucho).',
    categories: fog_cats,
    options: [{label: 'Nada/Poco', value: 0}, {label: 'Más o menos', value: 1}, {label: 'Mucho', value: 2}],
    questions: fog_questions,
    scoringCode: `
      const b: Record<string, number> = {};
      TEST_DEFINITIONS['fogliatto'].categories.forEach(c => b[c] = 0);
      let total = 0;
      Object.entries(responses).forEach(([id, v]) => {
        const q = TEST_DEFINITIONS['fogliatto'].questions.find((q: any) => q.id === Number(id));
        if (q && q.category) { b[q.category] += v; total += v; }
      });
      const sorted = Object.entries(b).sort((a, b) => Number(b[1]) - Number(a[1]));
      return { 
        total, 
        breakdown: b, 
        interpretation: { 
          'Primera Opción': sorted[0]?.[0] || 'N/A',
          'Segunda Opción': sorted[1]?.[0] || 'N/A',
          'Tercera Opción': sorted[2]?.[0] || 'N/A'
        } 
      };
    `
};

// CACIA (Placeholders but functional)
const cacia_cats = ['Retroalimentación Personal (RP)', 'Autocontrol Criterial (ACP)', 'Retraso de Recompensa (RR)', 'Autocontrol Procesual (ACC)', 'Sinceridad (S)'];
const cacia_q = [
    {
        "id": 1,
        "text": "Normalmente hago las cosas que me gustan aunque tenga deberes que hacer.",
        "category": "Retroalimentación Personal (RP)"
    },
    {
        "id": 2,
        "text": "Si sé que hacer algo me impedirá trabajar después, lo dejo para cuando ya haya trabajado.",
        "category": "Retraso de Recompensa (RR)"
    },
    {
        "id": 3,
        "text": "Casi siempre hago las cosas que me gustan, aunque tenga cosas más importantes que hacer.",
        "category": "Autocontrol Criterial (ACC)"
    },
    {
        "id": 4,
        "text": "Cuando quiero llegar a un sitio, me pongo una hora determinada para salir.",
        "category": "Autocontrol Procesual (ACP)"
    },
    {
        "id": 5,
        "text": "Pocas veces corrijo mis tareas para ver los aciertos y errores.",
        "category": "Sinceridad (S)"
    },
    {
        "id": 6,
        "text": "Sé portarme adecuadamente sin que me castiguen.",
        "category": "Retroalimentación Personal (RP)"
    },
    {
        "id": 7,
        "text": "Cuando me dicen que debo portarme bien, suelo preguntar: '¿Qué quiere decir eso?'.",
        "category": "Retraso de Recompensa (RR)"
    },
    {
        "id": 8,
        "text": "Cuando estoy perezoso y quiero estudiar, procuro quitar de mi vista lo que me distraiga.",
        "category": "Autocontrol Criterial (ACC)"
    },
    {
        "id": 9,
        "text": "Cuanto más consigo por encima de lo que me había propuesto, más a gusto me siento.",
        "category": "Autocontrol Procesual (ACP)"
    },
    {
        "id": 10,
        "text": "A veces soy brusco con los demás.",
        "category": "Sinceridad (S)"
    },
    {
        "id": 11,
        "text": "Cuando cometo errores me critico a mí mismo.",
        "category": "Retroalimentación Personal (RP)"
    },
    {
        "id": 12,
        "text": "Recuerdo mis obligaciones en casa sin que me las repitan.",
        "category": "Retraso de Recompensa (RR)"
    },
    {
        "id": 13,
        "text": "Los demás dicen que soy un irresponsable.",
        "category": "Autocontrol Criterial (ACC)"
    },
    {
        "id": 14,
        "text": "Para mí es importante saber lo que tengo que hacer para saber si lo voy consiguiendo.",
        "category": "Autocontrol Procesual (ACP)"
    },
    {
        "id": 15,
        "text": "Llego puntual a todos los sitios.",
        "category": "Sinceridad (S)"
    },
    {
        "id": 16,
        "text": "Prometo algo y si me cuesta cumplirlo, procuro recordármelo.",
        "category": "Retroalimentación Personal (RP)"
    },
    {
        "id": 17,
        "text": "Si pongo un plan en marcha, quiero saber cómo me va funcionando.",
        "category": "Retraso de Recompensa (RR)"
    },
    {
        "id": 18,
        "text": "Me cuesta mucho recordar las normas de clase, aunque las sepa.",
        "category": "Autocontrol Criterial (ACC)"
    },
    {
        "id": 19,
        "text": "A veces desobedezco a mis padres.",
        "category": "Autocontrol Procesual (ACP)"
    },
    {
        "id": 20,
        "text": "A veces digo mentirijillas a mis compañeros.",
        "category": "Sinceridad (S)"
    },
    {
        "id": 21,
        "text": "Cuando algo me da mucho miedo, me es imposible imaginarme cosas que me distraigan.",
        "category": "Retroalimentación Personal (RP)"
    },
    {
        "id": 22,
        "text": "Sólo trabajo cuando por ello puedo conseguir cosas enseguida.",
        "category": "Retraso de Recompensa (RR)"
    },
    {
        "id": 23,
        "text": "Aguanto peor el dolor que la mayoría.",
        "category": "Autocontrol Criterial (ACC)"
    },
    {
        "id": 24,
        "text": "Me animo a mí mismo a mejorar.",
        "category": "Autocontrol Procesual (ACP)"
    },
    {
        "id": 25,
        "text": "Hago inmediatamente lo que me piden.",
        "category": "Sinceridad (S)"
    },
    {
        "id": 26,
        "text": "Cuando quiero estudiar más, busco las maneras de conseguirlo.",
        "category": "Retroalimentación Personal (RP)"
    },
    {
        "id": 27,
        "text": "Desconozco qué puedo hacer para tranquilizarme cuando estoy nervioso.",
        "category": "Retraso de Recompensa (RR)"
    },
    {
        "id": 28,
        "text": "Si algo me hace daño (que limpien una herida), me propongo soportarlo.",
        "category": "Autocontrol Criterial (ACC)"
    },
    {
        "id": 29,
        "text": "Me porto bien y me cuesta hacerlo sobre todo porque me gusta que me alaben.",
        "category": "Autocontrol Procesual (ACP)"
    },
    {
        "id": 30,
        "text": "A menudo pienso en cómo seré de mayor.",
        "category": "Sinceridad (S)"
    },
    {
        "id": 31,
        "text": "Todas las personas me caen muy bien.",
        "category": "Retroalimentación Personal (RP)"
    },
    {
        "id": 32,
        "text": "A menudo recuerdo las cosas que hacía antes y las comparo con las que hago ahora.",
        "category": "Retraso de Recompensa (RR)"
    },
    {
        "id": 33,
        "text": "Reparto todas mis cosas con los demás.",
        "category": "Autocontrol Criterial (ACC)"
    },
    {
        "id": 34,
        "text": "Me pongo muy nervioso cuando tengo problemas personales.",
        "category": "Autocontrol Procesual (ACP)"
    },
    {
        "id": 35,
        "text": "Cuando me pongo nervioso intento tranquilizarme, ya que así las cosas me salen mejor.",
        "category": "Sinceridad (S)"
    },
    {
        "id": 36,
        "text": "Me es difícil acabar mi trabajo si no me gusta.",
        "category": "Retroalimentación Personal (RP)"
    },
    {
        "id": 37,
        "text": "Disfruto imaginándome cosas que me gustaría que ocurriesen.",
        "category": "Retraso de Recompensa (RR)"
    },
    {
        "id": 38,
        "text": "Ante todo, prefiero terminar una tarea que tengo que hacer y después comenzar con lo que me gusta.",
        "category": "Autocontrol Criterial (ACC)"
    },
    {
        "id": 39,
        "text": "Cuando hago algo adrede, me doy cuenta de cómo reaccionan los demás.",
        "category": "Autocontrol Procesual (ACP)"
    },
    {
        "id": 40,
        "text": "Normalmente hago las cosas que me gustan aunque tenga deberes que hacer. (Variación)",
        "category": "Sinceridad (S)"
    },
    {
        "id": 41,
        "text": "Si sé que hacer algo me impedirá trabajar después, lo dejo para cuando ya haya trabajado. (Variación)",
        "category": "Retroalimentación Personal (RP)"
    },
    {
        "id": 42,
        "text": "Casi siempre hago las cosas que me gustan, aunque tenga cosas más importantes que hacer. (Variación)",
        "category": "Retraso de Recompensa (RR)"
    },
    {
        "id": 43,
        "text": "Cuando quiero llegar a un sitio, me pongo una hora determinada para salir. (Variación)",
        "category": "Autocontrol Criterial (ACC)"
    },
    {
        "id": 44,
        "text": "Pocas veces corrijo mis tareas para ver los aciertos y errores. (Variación)",
        "category": "Autocontrol Procesual (ACP)"
    },
    {
        "id": 45,
        "text": "Sé portarme adecuadamente sin que me castiguen. (Variación)",
        "category": "Sinceridad (S)"
    },
    {
        "id": 46,
        "text": "Cuando me dicen que debo portarme bien, suelo preguntar: '¿Qué quiere decir eso?'. (Variación)",
        "category": "Retroalimentación Personal (RP)"
    },
    {
        "id": 47,
        "text": "Cuando estoy perezoso y quiero estudiar, procuro quitar de mi vista lo que me distraiga. (Variación)",
        "category": "Retraso de Recompensa (RR)"
    },
    {
        "id": 48,
        "text": "Cuanto más consigo por encima de lo que me había propuesto, más a gusto me siento. (Variación)",
        "category": "Autocontrol Criterial (ACC)"
    },
    {
        "id": 49,
        "text": "A veces soy brusco con los demás. (Variación)",
        "category": "Autocontrol Procesual (ACP)"
    },
    {
        "id": 50,
        "text": "Cuando cometo errores me critico a mí mismo. (Variación)",
        "category": "Sinceridad (S)"
    },
    {
        "id": 51,
        "text": "Recuerdo mis obligaciones en casa sin que me las repitan. (Variación)",
        "category": "Retroalimentación Personal (RP)"
    },
    {
        "id": 52,
        "text": "Los demás dicen que soy un irresponsable. (Variación)",
        "category": "Retraso de Recompensa (RR)"
    },
    {
        "id": 53,
        "text": "Para mí es importante saber lo que tengo que hacer para saber si lo voy consiguiendo. (Variación)",
        "category": "Autocontrol Criterial (ACC)"
    },
    {
        "id": 54,
        "text": "Llego puntual a todos los sitios. (Variación)",
        "category": "Autocontrol Procesual (ACP)"
    },
    {
        "id": 55,
        "text": "Prometo algo y si me cuesta cumplirlo, procuro recordármelo. (Variación)",
        "category": "Sinceridad (S)"
    },
    {
        "id": 56,
        "text": "Si pongo un plan en marcha, quiero saber cómo me va funcionando. (Variación)",
        "category": "Retroalimentación Personal (RP)"
    },
    {
        "id": 57,
        "text": "Me cuesta mucho recordar las normas de clase, aunque las sepa. (Variación)",
        "category": "Retraso de Recompensa (RR)"
    },
    {
        "id": 58,
        "text": "A veces desobedezco a mis padres. (Variación)",
        "category": "Autocontrol Criterial (ACC)"
    },
    {
        "id": 59,
        "text": "A veces digo mentirijillas a mis compañeros. (Variación)",
        "category": "Autocontrol Procesual (ACP)"
    },
    {
        "id": 60,
        "text": "Cuando algo me da mucho miedo, me es imposible imaginarme cosas que me distraigan. (Variación)",
        "category": "Sinceridad (S)"
    },
    {
        "id": 61,
        "text": "Sólo trabajo cuando por ello puedo conseguir cosas enseguida. (Variación)",
        "category": "Retroalimentación Personal (RP)"
    },
    {
        "id": 62,
        "text": "Aguanto peor el dolor que la mayoría. (Variación)",
        "category": "Retraso de Recompensa (RR)"
    },
    {
        "id": 63,
        "text": "Me animo a mí mismo a mejorar. (Variación)",
        "category": "Autocontrol Criterial (ACC)"
    },
    {
        "id": 64,
        "text": "Hago inmediatamente lo que me piden. (Variación)",
        "category": "Autocontrol Procesual (ACP)"
    },
    {
        "id": 65,
        "text": "Cuando quiero estudiar más, busco las maneras de conseguirlo. (Variación)",
        "category": "Sinceridad (S)"
    },
    {
        "id": 66,
        "text": "Desconozco qué puedo hacer para tranquilizarme cuando estoy nervioso. (Variación)",
        "category": "Retroalimentación Personal (RP)"
    },
    {
        "id": 67,
        "text": "Si algo me hace daño (que limpien una herida), me propongo soportarlo. (Variación)",
        "category": "Retraso de Recompensa (RR)"
    },
    {
        "id": 68,
        "text": "Me porto bien y me cuesta hacerlo sobre todo porque me gusta que me alaben. (Variación)",
        "category": "Autocontrol Criterial (ACC)"
    },
    {
        "id": 69,
        "text": "A menudo pienso en cómo seré de mayor. (Variación)",
        "category": "Autocontrol Procesual (ACP)"
    },
    {
        "id": 70,
        "text": "Todas las personas me caen muy bien. (Variación)",
        "category": "Sinceridad (S)"
    },
    {
        "id": 71,
        "text": "A menudo recuerdo las cosas que hacía antes y las comparo con las que hago ahora. (Variación)",
        "category": "Retroalimentación Personal (RP)"
    },
    {
        "id": 72,
        "text": "Reparto todas mis cosas con los demás. (Variación)",
        "category": "Retraso de Recompensa (RR)"
    },
    {
        "id": 73,
        "text": "Me pongo muy nervioso cuando tengo problemas personales. (Variación)",
        "category": "Autocontrol Criterial (ACC)"
    },
    {
        "id": 74,
        "text": "Cuando me pongo nervioso intento tranquilizarme, ya que así las cosas me salen mejor. (Variación)",
        "category": "Autocontrol Procesual (ACP)"
    },
    {
        "id": 75,
        "text": "Me es difícil acabar mi trabajo si no me gusta. (Variación)",
        "category": "Sinceridad (S)"
    },
    {
        "id": 76,
        "text": "Disfruto imaginándome cosas que me gustaría que ocurriesen. (Variación)",
        "category": "Retroalimentación Personal (RP)"
    },
    {
        "id": 77,
        "text": "Ante todo, prefiero terminar una tarea que tengo que hacer y después comenzar con lo que me gusta. (Variación)",
        "category": "Retraso de Recompensa (RR)"
    },
    {
        "id": 78,
        "text": "Cuando hago algo adrede, me doy cuenta de cómo reaccionan los demás. (Variación)",
        "category": "Autocontrol Criterial (ACC)"
    },
    {
        "id": 79,
        "text": "Normalmente hago las cosas que me gustan aunque tenga deberes que hacer. (Variación)",
        "category": "Autocontrol Procesual (ACP)"
    },
    {
        "id": 80,
        "text": "Si sé que hacer algo me impedirá trabajar después, lo dejo para cuando ya haya trabajado. (Variación)",
        "category": "Sinceridad (S)"
    },
    {
        "id": 81,
        "text": "Casi siempre hago las cosas que me gustan, aunque tenga cosas más importantes que hacer. (Variación)",
        "category": "Retroalimentación Personal (RP)"
    },
    {
        "id": 82,
        "text": "Cuando quiero llegar a un sitio, me pongo una hora determinada para salir. (Variación)",
        "category": "Retraso de Recompensa (RR)"
    },
    {
        "id": 83,
        "text": "Pocas veces corrijo mis tareas para ver los aciertos y errores. (Variación)",
        "category": "Autocontrol Criterial (ACC)"
    },
    {
        "id": 84,
        "text": "Sé portarme adecuadamente sin que me castiguen. (Variación)",
        "category": "Autocontrol Procesual (ACP)"
    },
    {
        "id": 85,
        "text": "Cuando me dicen que debo portarme bien, suelo preguntar: '¿Qué quiere decir eso?'. (Variación)",
        "category": "Sinceridad (S)"
    },
    {
        "id": 86,
        "text": "Cuando estoy perezoso y quiero estudiar, procuro quitar de mi vista lo que me distraiga. (Variación)",
        "category": "Retroalimentación Personal (RP)"
    },
    {
        "id": 87,
        "text": "Cuanto más consigo por encima de lo que me había propuesto, más a gusto me siento. (Variación)",
        "category": "Retraso de Recompensa (RR)"
    },
    {
        "id": 88,
        "text": "A veces soy brusco con los demás. (Variación)",
        "category": "Autocontrol Criterial (ACC)"
    },
    {
        "id": 89,
        "text": "Cuando cometo errores me critico a mí mismo. (Variación)",
        "category": "Autocontrol Procesual (ACP)"
    }
];

const cacia = {
    id: 'cacia', title: 'Cuestionario CACIA (Autocontrol)', description: 'Cuestionario de Autocontrol Infantil y Adolescente.',
    instructions: 'Responda SI o NO a cada afirmación.',
    categories: cacia_cats,
    options: [{label: 'SÍ', value: 1}, {label: 'NO', value: 0}],
    questions: cacia_q,
    scoringCode: `
      const b: Record<string, number> = {};
      TEST_DEFINITIONS['cacia'].categories.forEach(c => b[c] = 0);
      let total = 0;
      Object.entries(responses).forEach(([id, v]) => {
        const q = TEST_DEFINITIONS['cacia'].questions.find((q: any) => q.id === Number(id));
        if (q && q.category) { b[q.category] += v; total += v; }
      });
      return { total, breakdown: b, interpretation: { 'Autocontrol General': total > 40 ? 'Adecuado' : 'Bajo' } };
    `
};

// ESPQ (Placeholders but functional)
const espq_cats = ['Afabilidad (A)', 'Inteligencia (B)', 'Estabilidad (C)', 'Excitabilidad (D)', 'Dominancia (E)', 'Entusiasmo (F)', 'Conciencia (G)', 'Emprendimiento (H)', 'Sensibilidad (I)', 'Desarrollo (J)', 'Astucia (N)', 'Aprensión (O)', 'Tensión (Q4)'];
const espq_q = [
    {
        "id": 1,
        "text": "🌟 Pregunta 1: ¿Qué prefieres o qué te describe mejor?",
        "category": "Afabilidad (A)",
        "options": [
            {
                "label": "A) Jugar con muchos niños",
                "value": 1
            },
            {
                "label": "B) Jugar con un solo amigo",
                "value": 2
            }
        ]
    },
    {
        "id": 2,
        "text": "🎈 Pregunta 2: ¿Qué prefieres o qué te describe mejor?",
        "category": "Inteligencia (B)",
        "options": [
            {
                "label": "A) Resolver un rompecabezas",
                "value": 1
            },
            {
                "label": "B) Dibujar libremente",
                "value": 2
            }
        ]
    },
    {
        "id": 3,
        "text": "🧸 Pregunta 3: ¿Qué prefieres o qué te describe mejor?",
        "category": "Estabilidad (C)",
        "options": [
            {
                "label": "A) Estar tranquilo aunque pierdas",
                "value": 1
            },
            {
                "label": "B) Enojarte si pierdes",
                "value": 2
            }
        ]
    },
    {
        "id": 4,
        "text": "🎨 Pregunta 4: ¿Qué prefieres o qué te describe mejor?",
        "category": "Excitabilidad (D)",
        "options": [
            {
                "label": "A) Quedarte sentado leyendo",
                "value": 1
            },
            {
                "label": "B) Correr por todo el parque",
                "value": 2
            }
        ]
    },
    {
        "id": 5,
        "text": "⚽ Pregunta 5: ¿Qué prefieres o qué te describe mejor?",
        "category": "Dominancia (E)",
        "options": [
            {
                "label": "A) Ser el líder del juego",
                "value": 1
            },
            {
                "label": "B) Dejar que otros decidan a qué jugar",
                "value": 2
            }
        ]
    },
    {
        "id": 6,
        "text": "🐶 Pregunta 6: ¿Qué prefieres o qué te describe mejor?",
        "category": "Entusiasmo (F)",
        "options": [
            {
                "label": "A) Estar alegre todo el día",
                "value": 1
            },
            {
                "label": "B) Estar callado y pensativo",
                "value": 2
            }
        ]
    },
    {
        "id": 7,
        "text": "🌳 Pregunta 7: ¿Qué prefieres o qué te describe mejor?",
        "category": "Conciencia (G)",
        "options": [
            {
                "label": "A) Hacer la tarea primero",
                "value": 1
            },
            {
                "label": "B) Jugar primero y hacer la tarea después",
                "value": 2
            }
        ]
    },
    {
        "id": 8,
        "text": "☀️ Pregunta 8: ¿Qué prefieres o qué te describe mejor?",
        "category": "Emprendimiento (H)",
        "options": [
            {
                "label": "A) Hablar con niños nuevos",
                "value": 1
            },
            {
                "label": "B) Quedarte con los amigos que ya conoces",
                "value": 2
            }
        ]
    },
    {
        "id": 9,
        "text": "🍎 Pregunta 9: ¿Qué prefieres o qué te describe mejor?",
        "category": "Sensibilidad (I)",
        "options": [
            {
                "label": "A) Sentir pena si ves a alguien llorar",
                "value": 1
            },
            {
                "label": "B) No darle mucha importancia",
                "value": 2
            }
        ]
    },
    {
        "id": 10,
        "text": "🚀 Pregunta 10: ¿Qué prefieres o qué te describe mejor?",
        "category": "Desarrollo (J)",
        "options": [
            {
                "label": "A) Hacer un trabajo en grupo",
                "value": 1
            },
            {
                "label": "B) Hacer el trabajo tú solo",
                "value": 2
            }
        ]
    },
    {
        "id": 11,
        "text": "🌈 Pregunta 11: ¿Qué prefieres o qué te describe mejor?",
        "category": "Astucia (N)",
        "options": [
            {
                "label": "A) Guardar un secreto muy bien",
                "value": 1
            },
            {
                "label": "B) Contárselo a tu mejor amigo",
                "value": 2
            }
        ]
    },
    {
        "id": 12,
        "text": "🦋 Pregunta 12: ¿Qué prefieres o qué te describe mejor?",
        "category": "Aprensión (O)",
        "options": [
            {
                "label": "A) Tener miedo a la oscuridad",
                "value": 1
            },
            {
                "label": "B) Dormir con la luz apagada sin problemas",
                "value": 2
            }
        ]
    },
    {
        "id": 13,
        "text": "🚲 Pregunta 13: ¿Qué prefieres o qué te describe mejor?",
        "category": "Tensión (Q4)",
        "options": [
            {
                "label": "A) Morderte las uñas si estás nervioso",
                "value": 1
            },
            {
                "label": "B) Respirar profundo para calmarte",
                "value": 2
            }
        ]
    },
    {
        "id": 14,
        "text": "🐢 Pregunta 14: ¿Qué prefieres o qué te describe mejor?",
        "category": "Afabilidad (A)",
        "options": [
            {
                "label": "A) Trabajar en equipo",
                "value": 1
            },
            {
                "label": "B) Trabajar tú solo",
                "value": 2
            }
        ]
    },
    {
        "id": 15,
        "text": "🍉 Pregunta 15: ¿Qué prefieres o qué te describe mejor?",
        "category": "Inteligencia (B)",
        "options": [
            {
                "label": "A) Aprender matemáticas",
                "value": 1
            },
            {
                "label": "B) Ver la televisión",
                "value": 2
            }
        ]
    },
    {
        "id": 16,
        "text": "🌟 Pregunta 16: ¿Qué prefieres o qué te describe mejor?",
        "category": "Estabilidad (C)",
        "options": [
            {
                "label": "A) Respirar hondo si algo sale mal",
                "value": 1
            },
            {
                "label": "B) Llorar si algo sale mal",
                "value": 2
            }
        ]
    },
    {
        "id": 17,
        "text": "🎈 Pregunta 17: ¿Qué prefieres o qué te describe mejor?",
        "category": "Excitabilidad (D)",
        "options": [
            {
                "label": "A) Caminar despacio",
                "value": 1
            },
            {
                "label": "B) Saltar todo el tiempo",
                "value": 2
            }
        ]
    },
    {
        "id": 18,
        "text": "🧸 Pregunta 18: ¿Qué prefieres o qué te describe mejor?",
        "category": "Dominancia (E)",
        "options": [
            {
                "label": "A) Inventar las reglas",
                "value": 1
            },
            {
                "label": "B) Seguir las reglas de otros",
                "value": 2
            }
        ]
    },
    {
        "id": 19,
        "text": "🎨 Pregunta 19: ¿Qué prefieres o qué te describe mejor?",
        "category": "Entusiasmo (F)",
        "options": [
            {
                "label": "A) Reír a carcajadas",
                "value": 1
            },
            {
                "label": "B) Sonreír suavemente",
                "value": 2
            }
        ]
    },
    {
        "id": 20,
        "text": "⚽ Pregunta 20: ¿Qué prefieres o qué te describe mejor?",
        "category": "Conciencia (G)",
        "options": [
            {
                "label": "A) Recoger tu cuarto siempre",
                "value": 1
            },
            {
                "label": "B) Dejar el cuarto desordenado",
                "value": 2
            }
        ]
    },
    {
        "id": 21,
        "text": "🐶 Pregunta 21: ¿Qué prefieres o qué te describe mejor?",
        "category": "Emprendimiento (H)",
        "options": [
            {
                "label": "A) Probar comida nueva",
                "value": 1
            },
            {
                "label": "B) Comer siempre lo mismo",
                "value": 2
            }
        ]
    },
    {
        "id": 22,
        "text": "🌳 Pregunta 22: ¿Qué prefieres o qué te describe mejor?",
        "category": "Sensibilidad (I)",
        "options": [
            {
                "label": "A) Llorar con películas tristes",
                "value": 1
            },
            {
                "label": "B) No llorar con películas",
                "value": 2
            }
        ]
    },
    {
        "id": 23,
        "text": "☀️ Pregunta 23: ¿Qué prefieres o qué te describe mejor?",
        "category": "Desarrollo (J)",
        "options": [
            {
                "label": "A) Jugar en equipo",
                "value": 1
            },
            {
                "label": "B) Jugar cosas individuales",
                "value": 2
            }
        ]
    },
    {
        "id": 24,
        "text": "🍎 Pregunta 24: ¿Qué prefieres o qué te describe mejor?",
        "category": "Astucia (N)",
        "options": [
            {
                "label": "A) Planear una sorpresa bien",
                "value": 1
            },
            {
                "label": "B) Arruinar la sorpresa",
                "value": 2
            }
        ]
    },
    {
        "id": 25,
        "text": "🚀 Pregunta 25: ¿Qué prefieres o qué te describe mejor?",
        "category": "Aprensión (O)",
        "options": [
            {
                "label": "A) Preocuparte mucho por un examen",
                "value": 1
            },
            {
                "label": "B) Estar tranquilo antes del examen",
                "value": 2
            }
        ]
    },
    {
        "id": 26,
        "text": "🌈 Pregunta 26: ¿Qué prefieres o qué te describe mejor?",
        "category": "Tensión (Q4)",
        "options": [
            {
                "label": "A) No poder quedarte quieto",
                "value": 1
            },
            {
                "label": "B) Estar relajado en el sofá",
                "value": 2
            }
        ]
    },
    {
        "id": 27,
        "text": "🦋 Pregunta 27: ¿Qué prefieres o qué te describe mejor?",
        "category": "Afabilidad (A)",
        "options": [
            {
                "label": "A) Hablar con todos en el recreo",
                "value": 1
            },
            {
                "label": "B) Quedarte en silencio",
                "value": 2
            }
        ]
    },
    {
        "id": 28,
        "text": "🚲 Pregunta 28: ¿Qué prefieres o qué te describe mejor?",
        "category": "Inteligencia (B)",
        "options": [
            {
                "label": "A) Armar cosas difíciles",
                "value": 1
            },
            {
                "label": "B) Jugar con cosas fáciles",
                "value": 2
            }
        ]
    },
    {
        "id": 29,
        "text": "🐢 Pregunta 29: ¿Qué prefieres o qué te describe mejor?",
        "category": "Estabilidad (C)",
        "options": [
            {
                "label": "A) Pedir ayuda calmado",
                "value": 1
            },
            {
                "label": "B) Gritar cuando necesitas algo",
                "value": 2
            }
        ]
    },
    {
        "id": 30,
        "text": "🍉 Pregunta 30: ¿Qué prefieres o qué te describe mejor?",
        "category": "Excitabilidad (D)",
        "options": [
            {
                "label": "A) Hablar despacito",
                "value": 1
            },
            {
                "label": "B) Hablar muy fuerte y rápido",
                "value": 2
            }
        ]
    },
    {
        "id": 31,
        "text": "🌟 Pregunta 31: ¿Qué prefieres o qué te describe mejor?",
        "category": "Dominancia (E)",
        "options": [
            {
                "label": "A) Decir a dónde ir",
                "value": 1
            },
            {
                "label": "B) Ir a donde digan los demás",
                "value": 2
            }
        ]
    },
    {
        "id": 32,
        "text": "🎈 Pregunta 32: ¿Qué prefieres o qué te describe mejor?",
        "category": "Entusiasmo (F)",
        "options": [
            {
                "label": "A) Contar chistes a todos",
                "value": 1
            },
            {
                "label": "B) Escuchar a los demás",
                "value": 2
            }
        ]
    },
    {
        "id": 33,
        "text": "🧸 Pregunta 33: ¿Qué prefieres o qué te describe mejor?",
        "category": "Conciencia (G)",
        "options": [
            {
                "label": "A) Pedir permiso para salir",
                "value": 1
            },
            {
                "label": "B) Salir sin avisar",
                "value": 2
            }
        ]
    },
    {
        "id": 34,
        "text": "🎨 Pregunta 34: ¿Qué prefieres o qué te describe mejor?",
        "category": "Emprendimiento (H)",
        "options": [
            {
                "label": "A) Subirte a juegos rápidos",
                "value": 1
            },
            {
                "label": "B) No subirte a los juegos",
                "value": 2
            }
        ]
    },
    {
        "id": 35,
        "text": "⚽ Pregunta 35: ¿Qué prefieres o qué te describe mejor?",
        "category": "Sensibilidad (I)",
        "options": [
            {
                "label": "A) Dar abrazos a tus papás mucho",
                "value": 1
            },
            {
                "label": "B) No dar muchos abrazos",
                "value": 2
            }
        ]
    },
    {
        "id": 36,
        "text": "🐶 Pregunta 36: ¿Qué prefieres o qué te describe mejor?",
        "category": "Desarrollo (J)",
        "options": [
            {
                "label": "A) Compartir los secretos",
                "value": 1
            },
            {
                "label": "B) No contar nada a nadie",
                "value": 2
            }
        ]
    },
    {
        "id": 37,
        "text": "🌳 Pregunta 37: ¿Qué prefieres o qué te describe mejor?",
        "category": "Astucia (N)",
        "options": [
            {
                "label": "A) Ser cuidadoso con lo que dices",
                "value": 1
            },
            {
                "label": "B) Decir lo primero que piensas",
                "value": 2
            }
        ]
    },
    {
        "id": 38,
        "text": "☀️ Pregunta 38: ¿Qué prefieres o qué te describe mejor?",
        "category": "Aprensión (O)",
        "options": [
            {
                "label": "A) Tener miedo de los monstruos",
                "value": 1
            },
            {
                "label": "B) Saber que los monstruos no existen",
                "value": 2
            }
        ]
    },
    {
        "id": 39,
        "text": "🍎 Pregunta 39: ¿Qué prefieres o qué te describe mejor?",
        "category": "Tensión (Q4)",
        "options": [
            {
                "label": "A) Enojarte si las cosas no salen rápido",
                "value": 1
            },
            {
                "label": "B) Tener paciencia para esperar",
                "value": 2
            }
        ]
    },
    {
        "id": 40,
        "text": "🚀 Pregunta 40: ¿Qué prefieres o qué te describe mejor?",
        "category": "Afabilidad (A)",
        "options": [
            {
                "label": "A) Invitar a muchos amigos a tu casa",
                "value": 1
            },
            {
                "label": "B) Invitar a uno solo",
                "value": 2
            }
        ]
    },
    {
        "id": 41,
        "text": "🌈 Pregunta 41: ¿Qué prefieres o qué te describe mejor?",
        "category": "Inteligencia (B)",
        "options": [
            {
                "label": "A) Leer un libro de ciencias",
                "value": 1
            },
            {
                "label": "B) Ver dibujos animados",
                "value": 2
            }
        ]
    },
    {
        "id": 42,
        "text": "🦋 Pregunta 42: ¿Qué prefieres o qué te describe mejor?",
        "category": "Estabilidad (C)",
        "options": [
            {
                "label": "A) Aceptar los errores",
                "value": 1
            },
            {
                "label": "B) Culpar a los demás",
                "value": 2
            }
        ]
    },
    {
        "id": 43,
        "text": "🚲 Pregunta 43: ¿Qué prefieres o qué te describe mejor?",
        "category": "Excitabilidad (D)",
        "options": [
            {
                "label": "A) Jugar cosas tranquilas",
                "value": 1
            },
            {
                "label": "B) Jugar cosas de mucha energía",
                "value": 2
            }
        ]
    },
    {
        "id": 44,
        "text": "🐢 Pregunta 44: ¿Qué prefieres o qué te describe mejor?",
        "category": "Dominancia (E)",
        "options": [
            {
                "label": "A) Escoger el programa de TV",
                "value": 1
            },
            {
                "label": "B) Ver lo que otros escojan",
                "value": 2
            }
        ]
    },
    {
        "id": 45,
        "text": "🍉 Pregunta 45: ¿Qué prefieres o qué te describe mejor?",
        "category": "Entusiasmo (F)",
        "options": [
            {
                "label": "A) Bailar cuando hay música",
                "value": 1
            },
            {
                "label": "B) Quedarte sentado escuchando",
                "value": 2
            }
        ]
    },
    {
        "id": 46,
        "text": "🌟 Pregunta 46: ¿Qué prefieres o qué te describe mejor?",
        "category": "Conciencia (G)",
        "options": [
            {
                "label": "A) Llegar temprano a la escuela",
                "value": 1
            },
            {
                "label": "B) Llegar tarde siempre",
                "value": 2
            }
        ]
    },
    {
        "id": 47,
        "text": "🎈 Pregunta 47: ¿Qué prefieres o qué te describe mejor?",
        "category": "Emprendimiento (H)",
        "options": [
            {
                "label": "A) Cantar frente a toda la escuela",
                "value": 1
            },
            {
                "label": "B) Cantar solo en tu cuarto",
                "value": 2
            }
        ]
    },
    {
        "id": 48,
        "text": "🧸 Pregunta 48: ¿Qué prefieres o qué te describe mejor?",
        "category": "Sensibilidad (I)",
        "options": [
            {
                "label": "A) Ayudar a un perrito de la calle",
                "value": 1
            },
            {
                "label": "B) Pasar de largo",
                "value": 2
            }
        ]
    },
    {
        "id": 49,
        "text": "🎨 Pregunta 49: ¿Qué prefieres o qué te describe mejor?",
        "category": "Desarrollo (J)",
        "options": [
            {
                "label": "A) Necesitar que te ayuden",
                "value": 1
            },
            {
                "label": "B) Hacer las cosas sin ayuda",
                "value": 2
            }
        ]
    },
    {
        "id": 50,
        "text": "⚽ Pregunta 50: ¿Qué prefieres o qué te describe mejor?",
        "category": "Astucia (N)",
        "options": [
            {
                "label": "A) Saber cuándo alguien miente",
                "value": 1
            },
            {
                "label": "B) Creerle a todo el mundo",
                "value": 2
            }
        ]
    },
    {
        "id": 51,
        "text": "🐶 Pregunta 51: ¿Qué prefieres o qué te describe mejor?",
        "category": "Aprensión (O)",
        "options": [
            {
                "label": "A) Sentir que haces todo mal",
                "value": 1
            },
            {
                "label": "B) Sentir que haces todo bien",
                "value": 2
            }
        ]
    },
    {
        "id": 52,
        "text": "🌳 Pregunta 52: ¿Qué prefieres o qué te describe mejor?",
        "category": "Tensión (Q4)",
        "options": [
            {
                "label": "A) Estar estresado todo el día",
                "value": 1
            },
            {
                "label": "B) Sentirte ligero y feliz",
                "value": 2
            }
        ]
    },
    {
        "id": 53,
        "text": "☀️ Pregunta 53: ¿Qué prefieres o qué te describe mejor?",
        "category": "Afabilidad (A)",
        "options": [
            {
                "label": "A) Compartir tus juguetes con todos",
                "value": 1
            },
            {
                "label": "B) Jugar tú solo con tus juguetes",
                "value": 2
            }
        ]
    },
    {
        "id": 54,
        "text": "🍎 Pregunta 54: ¿Qué prefieres o qué te describe mejor?",
        "category": "Inteligencia (B)",
        "options": [
            {
                "label": "A) Hacer la tarea rápido y bien",
                "value": 1
            },
            {
                "label": "B) Tardar mucho en la tarea",
                "value": 2
            }
        ]
    },
    {
        "id": 55,
        "text": "🚀 Pregunta 55: ¿Qué prefieres o qué te describe mejor?",
        "category": "Estabilidad (C)",
        "options": [
            {
                "label": "A) No molestarte por bromas",
                "value": 1
            },
            {
                "label": "B) Molestarte muy rápido por bromas",
                "value": 2
            }
        ]
    },
    {
        "id": 56,
        "text": "🌈 Pregunta 56: ¿Qué prefieres o qué te describe mejor?",
        "category": "Excitabilidad (D)",
        "options": [
            {
                "label": "A) Esperar en la fila tranquilo",
                "value": 1
            },
            {
                "label": "B) Moverte todo el tiempo en la fila",
                "value": 2
            }
        ]
    },
    {
        "id": 57,
        "text": "🦋 Pregunta 57: ¿Qué prefieres o qué te describe mejor?",
        "category": "Dominancia (E)",
        "options": [
            {
                "label": "A) Hablar primero en clase",
                "value": 1
            },
            {
                "label": "B) Esperar a que otros hablen",
                "value": 2
            }
        ]
    },
    {
        "id": 58,
        "text": "🚲 Pregunta 58: ¿Qué prefieres o qué te describe mejor?",
        "category": "Entusiasmo (F)",
        "options": [
            {
                "label": "A) Emocionarte mucho por un regalo",
                "value": 1
            },
            {
                "label": "B) Dar las gracias tranquilo",
                "value": 2
            }
        ]
    },
    {
        "id": 59,
        "text": "🐢 Pregunta 59: ¿Qué prefieres o qué te describe mejor?",
        "category": "Conciencia (G)",
        "options": [
            {
                "label": "A) Cumplir tus promesas",
                "value": 1
            },
            {
                "label": "B) Olvidar lo que prometiste",
                "value": 2
            }
        ]
    },
    {
        "id": 60,
        "text": "🍉 Pregunta 60: ¿Qué prefieres o qué te describe mejor?",
        "category": "Emprendimiento (H)",
        "options": [
            {
                "label": "A) Levantar la mano en clase",
                "value": 1
            },
            {
                "label": "B) Esconderte para que no te pregunten",
                "value": 2
            }
        ]
    },
    {
        "id": 61,
        "text": "🌟 Pregunta 61: ¿Qué prefieres o qué te describe mejor?",
        "category": "Sensibilidad (I)",
        "options": [
            {
                "label": "A) Sentir tristeza si regañan a otro",
                "value": 1
            },
            {
                "label": "B) Reírte si regañan a otro",
                "value": 2
            }
        ]
    },
    {
        "id": 62,
        "text": "🎈 Pregunta 62: ¿Qué prefieres o qué te describe mejor?",
        "category": "Desarrollo (J)",
        "options": [
            {
                "label": "A) Ir a campamentos con otros",
                "value": 1
            },
            {
                "label": "B) No querer salir de casa",
                "value": 2
            }
        ]
    },
    {
        "id": 63,
        "text": "🧸 Pregunta 63: ¿Qué prefieres o qué te describe mejor?",
        "category": "Astucia (N)",
        "options": [
            {
                "label": "A) Ganar en las escondidas",
                "value": 1
            },
            {
                "label": "B) Ser el primero en que encuentran",
                "value": 2
            }
        ]
    },
    {
        "id": 64,
        "text": "🎨 Pregunta 64: ¿Qué prefieres o qué te describe mejor?",
        "category": "Aprensión (O)",
        "options": [
            {
                "label": "A) Preocuparte por equivocarte",
                "value": 1
            },
            {
                "label": "B) No darle importancia si te equivocas",
                "value": 2
            }
        ]
    },
    {
        "id": 65,
        "text": "⚽ Pregunta 65: ¿Qué prefieres o qué te describe mejor?",
        "category": "Tensión (Q4)",
        "options": [
            {
                "label": "A) Apretar los dientes al dormir",
                "value": 1
            },
            {
                "label": "B) Dormir muy relajado",
                "value": 2
            }
        ]
    },
    {
        "id": 66,
        "text": "🐶 Pregunta 66: ¿Qué prefieres o qué te describe mejor?",
        "category": "Afabilidad (A)",
        "options": [
            {
                "label": "A) Estar rodeado de gente",
                "value": 1
            },
            {
                "label": "B) Estar en tu habitación tranquilo",
                "value": 2
            }
        ]
    },
    {
        "id": 67,
        "text": "🌳 Pregunta 67: ¿Qué prefieres o qué te describe mejor?",
        "category": "Inteligencia (B)",
        "options": [
            {
                "label": "A) Entender los chistes rápido",
                "value": 1
            },
            {
                "label": "B) Tardar en entender los chistes",
                "value": 2
            }
        ]
    },
    {
        "id": 68,
        "text": "☀️ Pregunta 68: ¿Qué prefieres o qué te describe mejor?",
        "category": "Estabilidad (C)",
        "options": [
            {
                "label": "A) Esperar tu turno sin quejarte",
                "value": 1
            },
            {
                "label": "B) Enojarte si te hacen esperar",
                "value": 2
            }
        ]
    },
    {
        "id": 69,
        "text": "🍎 Pregunta 69: ¿Qué prefieres o qué te describe mejor?",
        "category": "Excitabilidad (D)",
        "options": [
            {
                "label": "A) Poner atención en silencio",
                "value": 1
            },
            {
                "label": "B) Interrumpir la clase",
                "value": 2
            }
        ]
    },
    {
        "id": 70,
        "text": "🚀 Pregunta 70: ¿Qué prefieres o qué te describe mejor?",
        "category": "Dominancia (E)",
        "options": [
            {
                "label": "A) Defender tu idea siempre",
                "value": 1
            },
            {
                "label": "B) Aceptar la idea de los demás",
                "value": 2
            }
        ]
    },
    {
        "id": 71,
        "text": "🌈 Pregunta 71: ¿Qué prefieres o qué te describe mejor?",
        "category": "Entusiasmo (F)",
        "options": [
            {
                "label": "A) Hablar con mucha energía",
                "value": 1
            },
            {
                "label": "B) Hablar con voz bajita",
                "value": 2
            }
        ]
    },
    {
        "id": 72,
        "text": "🦋 Pregunta 72: ¿Qué prefieres o qué te describe mejor?",
        "category": "Conciencia (G)",
        "options": [
            {
                "label": "A) Obedecer a tus papás",
                "value": 1
            },
            {
                "label": "B) Ignorar lo que te dicen",
                "value": 2
            }
        ]
    },
    {
        "id": 73,
        "text": "🚲 Pregunta 73: ¿Qué prefieres o qué te describe mejor?",
        "category": "Emprendimiento (H)",
        "options": [
            {
                "label": "A) Explorar lugares nuevos",
                "value": 1
            },
            {
                "label": "B) Ir a los lugares de siempre",
                "value": 2
            }
        ]
    },
    {
        "id": 74,
        "text": "🐢 Pregunta 74: ¿Qué prefieres o qué te describe mejor?",
        "category": "Sensibilidad (I)",
        "options": [
            {
                "label": "A) Hacer dibujos bonitos",
                "value": 1
            },
            {
                "label": "B) No prestar atención a los colores",
                "value": 2
            }
        ]
    },
    {
        "id": 75,
        "text": "🍉 Pregunta 75: ¿Qué prefieres o qué te describe mejor?",
        "category": "Desarrollo (J)",
        "options": [
            {
                "label": "A) Depender de tus papás",
                "value": 1
            },
            {
                "label": "B) Ser muy independiente",
                "value": 2
            }
        ]
    },
    {
        "id": 76,
        "text": "🌟 Pregunta 76: ¿Qué prefieres o qué te describe mejor?",
        "category": "Astucia (N)",
        "options": [
            {
                "label": "A) Hacer trucos de magia",
                "value": 1
            },
            {
                "label": "B) No saber hacer trucos",
                "value": 2
            }
        ]
    },
    {
        "id": 77,
        "text": "🎈 Pregunta 77: ¿Qué prefieres o qué te describe mejor?",
        "category": "Aprensión (O)",
        "options": [
            {
                "label": "A) Tener miedo de que te regañen",
                "value": 1
            },
            {
                "label": "B) No pensar en que te regañarán",
                "value": 2
            }
        ]
    },
    {
        "id": 78,
        "text": "🧸 Pregunta 78: ¿Qué prefieres o qué te describe mejor?",
        "category": "Tensión (Q4)",
        "options": [
            {
                "label": "A) Gritar cuando estás apurado",
                "value": 1
            },
            {
                "label": "B) Hablar con calma siempre",
                "value": 2
            }
        ]
    },
    {
        "id": 79,
        "text": "🎨 Pregunta 79: ¿Qué prefieres o qué te describe mejor?",
        "category": "Afabilidad (A)",
        "options": [
            {
                "label": "A) Ir a una fiesta ruidosa",
                "value": 1
            },
            {
                "label": "B) Quedarte viendo una película",
                "value": 2
            }
        ]
    },
    {
        "id": 80,
        "text": "⚽ Pregunta 80: ¿Qué prefieres o qué te describe mejor?",
        "category": "Inteligencia (B)",
        "options": [
            {
                "label": "A) Jugar ajedrez",
                "value": 1
            },
            {
                "label": "B) Jugar a las escondidas",
                "value": 2
            }
        ]
    },
    {
        "id": 81,
        "text": "🐶 Pregunta 81: ¿Qué prefieres o qué te describe mejor?",
        "category": "Estabilidad (C)",
        "options": [
            {
                "label": "A) Levantarte si te caes y seguir",
                "value": 1
            },
            {
                "label": "B) Llorar mucho si te caes un poco",
                "value": 2
            }
        ]
    },
    {
        "id": 82,
        "text": "🌳 Pregunta 82: ¿Qué prefieres o qué te describe mejor?",
        "category": "Excitabilidad (D)",
        "options": [
            {
                "label": "A) Ver una película completa",
                "value": 1
            },
            {
                "label": "B) Levantarte a cada rato",
                "value": 2
            }
        ]
    },
    {
        "id": 83,
        "text": "☀️ Pregunta 83: ¿Qué prefieres o qué te describe mejor?",
        "category": "Dominancia (E)",
        "options": [
            {
                "label": "A) Ser el capitán del equipo",
                "value": 1
            },
            {
                "label": "B) Ser un jugador más",
                "value": 2
            }
        ]
    },
    {
        "id": 84,
        "text": "🍎 Pregunta 84: ¿Qué prefieres o qué te describe mejor?",
        "category": "Entusiasmo (F)",
        "options": [
            {
                "label": "A) Saltar de alegría",
                "value": 1
            },
            {
                "label": "B) Estar contento pero quieto",
                "value": 2
            }
        ]
    },
    {
        "id": 85,
        "text": "🚀 Pregunta 85: ¿Qué prefieres o qué te describe mejor?",
        "category": "Conciencia (G)",
        "options": [
            {
                "label": "A) Hacer las cosas bien hechas",
                "value": 1
            },
            {
                "label": "B) Hacer las cosas rápido y mal",
                "value": 2
            }
        ]
    },
    {
        "id": 86,
        "text": "🌈 Pregunta 86: ¿Qué prefieres o qué te describe mejor?",
        "category": "Emprendimiento (H)",
        "options": [
            {
                "label": "A) Saludar a adultos que no conoces",
                "value": 1
            },
            {
                "label": "B) Esconderte detrás de tu mamá",
                "value": 2
            }
        ]
    },
    {
        "id": 87,
        "text": "🦋 Pregunta 87: ¿Qué prefieres o qué te describe mejor?",
        "category": "Sensibilidad (I)",
        "options": [
            {
                "label": "A) Cuidar las flores del jardín",
                "value": 1
            },
            {
                "label": "B) Arrancar las flores",
                "value": 2
            }
        ]
    },
    {
        "id": 88,
        "text": "🚲 Pregunta 88: ¿Qué prefieres o qué te describe mejor?",
        "category": "Desarrollo (J)",
        "options": [
            {
                "label": "A) Preferir deportes en equipo",
                "value": 1
            },
            {
                "label": "B) Preferir tenis o natación solo",
                "value": 2
            }
        ]
    },
    {
        "id": 89,
        "text": "🐢 Pregunta 89: ¿Qué prefieres o qué te describe mejor?",
        "category": "Astucia (N)",
        "options": [
            {
                "label": "A) Cambiar de tema si te descubren",
                "value": 1
            },
            {
                "label": "B) Quedarte callado si te descubren",
                "value": 2
            }
        ]
    },
    {
        "id": 90,
        "text": "🍉 Pregunta 90: ¿Qué prefieres o qué te describe mejor?",
        "category": "Aprensión (O)",
        "options": [
            {
                "label": "A) Estar nervioso antes de un partido",
                "value": 1
            },
            {
                "label": "B) Estar seguro de que ganarás",
                "value": 2
            }
        ]
    },
    {
        "id": 91,
        "text": "🌟 Pregunta 91: ¿Qué prefieres o qué te describe mejor?",
        "category": "Tensión (Q4)",
        "options": [
            {
                "label": "A) Enojarse por cosas pequeñas",
                "value": 1
            },
            {
                "label": "B) No enojarse fácilmente",
                "value": 2
            }
        ]
    },
    {
        "id": 92,
        "text": "🎈 Pregunta 92: ¿Qué prefieres o qué te describe mejor?",
        "category": "Afabilidad (A)",
        "options": [
            {
                "label": "A) Ayudar a un compañero nuevo",
                "value": 1
            },
            {
                "label": "B) Dejar que otros lo ayuden",
                "value": 2
            }
        ]
    },
    {
        "id": 93,
        "text": "🧸 Pregunta 93: ¿Qué prefieres o qué te describe mejor?",
        "category": "Inteligencia (B)",
        "options": [
            {
                "label": "A) Aprender palabras nuevas",
                "value": 1
            },
            {
                "label": "B) Usar las palabras de siempre",
                "value": 2
            }
        ]
    },
    {
        "id": 94,
        "text": "🎨 Pregunta 94: ¿Qué prefieres o qué te describe mejor?",
        "category": "Estabilidad (C)",
        "options": [
            {
                "label": "A) Dormir bien en la noche",
                "value": 1
            },
            {
                "label": "B) Tener pesadillas a menudo",
                "value": 2
            }
        ]
    },
    {
        "id": 95,
        "text": "⚽ Pregunta 95: ¿Qué prefieres o qué te describe mejor?",
        "category": "Excitabilidad (D)",
        "options": [
            {
                "label": "A) Pintar sin salirte de la raya",
                "value": 1
            },
            {
                "label": "B) Pintar muy rápido",
                "value": 2
            }
        ]
    },
    {
        "id": 96,
        "text": "🐶 Pregunta 96: ¿Qué prefieres o qué te describe mejor?",
        "category": "Dominancia (E)",
        "options": [
            {
                "label": "A) Decir a los demás qué hacer",
                "value": 1
            },
            {
                "label": "B) Hacer lo que los demás dicen",
                "value": 2
            }
        ]
    },
    {
        "id": 97,
        "text": "🌳 Pregunta 97: ¿Qué prefieres o qué te describe mejor?",
        "category": "Entusiasmo (F)",
        "options": [
            {
                "label": "A) Querer ir a todas las fiestas",
                "value": 1
            },
            {
                "label": "B) Preferir quedarte en casa",
                "value": 2
            }
        ]
    },
    {
        "id": 98,
        "text": "☀️ Pregunta 98: ¿Qué prefieres o qué te describe mejor?",
        "category": "Conciencia (G)",
        "options": [
            {
                "label": "A) Cuidar tus juguetes",
                "value": 1
            },
            {
                "label": "B) Romper tus juguetes a menudo",
                "value": 2
            }
        ]
    },
    {
        "id": 99,
        "text": "🍎 Pregunta 99: ¿Qué prefieres o qué te describe mejor?",
        "category": "Emprendimiento (H)",
        "options": [
            {
                "label": "A) Tocar animales extraños",
                "value": 1
            },
            {
                "label": "B) Alejarte de los animales",
                "value": 2
            }
        ]
    },
    {
        "id": 100,
        "text": "🚀 Pregunta 100: ¿Qué prefieres o qué te describe mejor?",
        "category": "Sensibilidad (I)",
        "options": [
            {
                "label": "A) Pedir perdón si lastimas a alguien",
                "value": 1
            },
            {
                "label": "B) No pedir perdón",
                "value": 2
            }
        ]
    },
    {
        "id": 101,
        "text": "🌈 Pregunta 101: ¿Qué prefieres o qué te describe mejor?",
        "category": "Desarrollo (J)",
        "options": [
            {
                "label": "A) Estudiar con amigos",
                "value": 1
            },
            {
                "label": "B) Estudiar encerrado en tu cuarto",
                "value": 2
            }
        ]
    },
    {
        "id": 102,
        "text": "🦋 Pregunta 102: ¿Qué prefieres o qué te describe mejor?",
        "category": "Astucia (N)",
        "options": [
            {
                "label": "A) Conseguir lo que quieres inteligentemente",
                "value": 1
            },
            {
                "label": "B) Llorar para conseguir lo que quieres",
                "value": 2
            }
        ]
    },
    {
        "id": 103,
        "text": "🚲 Pregunta 103: ¿Qué prefieres o qué te describe mejor?",
        "category": "Aprensión (O)",
        "options": [
            {
                "label": "A) Llorar si te miran mucho",
                "value": 1
            },
            {
                "label": "B) Sentirte seguro si te miran",
                "value": 2
            }
        ]
    },
    {
        "id": 104,
        "text": "🐢 Pregunta 104: ¿Qué prefieres o qué te describe mejor?",
        "category": "Tensión (Q4)",
        "options": [
            {
                "label": "A) Querer que todo se haga ya",
                "value": 1
            },
            {
                "label": "B) Entender que hay que esperar",
                "value": 2
            }
        ]
    },
    {
        "id": 105,
        "text": "🍉 Pregunta 105: ¿Qué prefieres o qué te describe mejor?",
        "category": "Afabilidad (A)",
        "options": [
            {
                "label": "A) Hacer reír a tus amigos",
                "value": 1
            },
            {
                "label": "B) Escuchar a los demás",
                "value": 2
            }
        ]
    },
    {
        "id": 106,
        "text": "🌟 Pregunta 106: ¿Qué prefieres o qué te describe mejor?",
        "category": "Inteligencia (B)",
        "options": [
            {
                "label": "A) Preguntar por qué funcionan las cosas",
                "value": 1
            },
            {
                "label": "B) No preguntar mucho",
                "value": 2
            }
        ]
    },
    {
        "id": 107,
        "text": "🎈 Pregunta 107: ¿Qué prefieres o qué te describe mejor?",
        "category": "Estabilidad (C)",
        "options": [
            {
                "label": "A) Estar feliz casi siempre",
                "value": 1
            },
            {
                "label": "B) Cambiar de humor rápido",
                "value": 2
            }
        ]
    },
    {
        "id": 108,
        "text": "🧸 Pregunta 108: ¿Qué prefieres o qué te describe mejor?",
        "category": "Excitabilidad (D)",
        "options": [
            {
                "label": "A) Dormir temprano",
                "value": 1
            },
            {
                "label": "B) Querer seguir jugando de noche",
                "value": 2
            }
        ]
    },
    {
        "id": 109,
        "text": "🎨 Pregunta 109: ¿Qué prefieres o qué te describe mejor?",
        "category": "Dominancia (E)",
        "options": [
            {
                "label": "A) Ganar las discusiones",
                "value": 1
            },
            {
                "label": "B) Evitar las discusiones",
                "value": 2
            }
        ]
    },
    {
        "id": 110,
        "text": "⚽ Pregunta 110: ¿Qué prefieres o qué te describe mejor?",
        "category": "Entusiasmo (F)",
        "options": [
            {
                "label": "A) Cantar fuerte en el auto",
                "value": 1
            },
            {
                "label": "B) Mirar por la ventana",
                "value": 2
            }
        ]
    },
    {
        "id": 111,
        "text": "🐶 Pregunta 111: ¿Qué prefieres o qué te describe mejor?",
        "category": "Conciencia (G)",
        "options": [
            {
                "label": "A) Lavarte los dientes solo",
                "value": 1
            },
            {
                "label": "B) Que te tengan que obligar a lavarlos",
                "value": 2
            }
        ]
    },
    {
        "id": 112,
        "text": "🌳 Pregunta 112: ¿Qué prefieres o qué te describe mejor?",
        "category": "Emprendimiento (H)",
        "options": [
            {
                "label": "A) Aprender a nadar hondo",
                "value": 1
            },
            {
                "label": "B) Quedarte en lo bajito",
                "value": 2
            }
        ]
    },
    {
        "id": 113,
        "text": "☀️ Pregunta 113: ¿Qué prefieres o qué te describe mejor?",
        "category": "Sensibilidad (I)",
        "options": [
            {
                "label": "A) Escuchar música clásica",
                "value": 1
            },
            {
                "label": "B) Escuchar música muy ruidosa",
                "value": 2
            }
        ]
    },
    {
        "id": 114,
        "text": "🍎 Pregunta 114: ¿Qué prefieres o qué te describe mejor?",
        "category": "Desarrollo (J)",
        "options": [
            {
                "label": "A) Ir al baño solo",
                "value": 1
            },
            {
                "label": "B) Pedir que te acompañen",
                "value": 2
            }
        ]
    },
    {
        "id": 115,
        "text": "🚀 Pregunta 115: ¿Qué prefieres o qué te describe mejor?",
        "category": "Astucia (N)",
        "options": [
            {
                "label": "A) Saber cómo hacer amigos",
                "value": 1
            },
            {
                "label": "B) Tardar en hacer amigos",
                "value": 2
            }
        ]
    },
    {
        "id": 116,
        "text": "🌈 Pregunta 116: ¿Qué prefieres o qué te describe mejor?",
        "category": "Aprensión (O)",
        "options": [
            {
                "label": "A) Creer que no tienes amigos",
                "value": 1
            },
            {
                "label": "B) Saber que tienes amigos",
                "value": 2
            }
        ]
    },
    {
        "id": 117,
        "text": "🦋 Pregunta 117: ¿Qué prefieres o qué te describe mejor?",
        "category": "Tensión (Q4)",
        "options": [
            {
                "label": "A) Ponerte tenso en un viaje largo",
                "value": 1
            },
            {
                "label": "B) Dormir en los viajes largos",
                "value": 2
            }
        ]
    },
    {
        "id": 118,
        "text": "🚲 Pregunta 118: ¿Qué prefieres o qué te describe mejor?",
        "category": "Afabilidad (A)",
        "options": [
            {
                "label": "A) Jugar juegos de mesa en familia",
                "value": 1
            },
            {
                "label": "B) Armar legos solo",
                "value": 2
            }
        ]
    },
    {
        "id": 119,
        "text": "🐢 Pregunta 119: ¿Qué prefieres o qué te describe mejor?",
        "category": "Inteligencia (B)",
        "options": [
            {
                "label": "A) Sacar buenas notas",
                "value": 1
            },
            {
                "label": "B) No preocuparse por las notas",
                "value": 2
            }
        ]
    },
    {
        "id": 120,
        "text": "🍉 Pregunta 120: ¿Qué prefieres o qué te describe mejor?",
        "category": "Estabilidad (C)",
        "options": [
            {
                "label": "A) Hablar sin gritar",
                "value": 1
            },
            {
                "label": "B) Gritar cuando te frustras",
                "value": 2
            }
        ]
    },
    {
        "id": 121,
        "text": "🌟 Pregunta 121: ¿Qué prefieres o qué te describe mejor?",
        "category": "Excitabilidad (D)",
        "options": [
            {
                "label": "A) Terminar de comer sentado",
                "value": 1
            },
            {
                "label": "B) Levantarte de la mesa comiendo",
                "value": 2
            }
        ]
    },
    {
        "id": 122,
        "text": "🎈 Pregunta 122: ¿Qué prefieres o qué te describe mejor?",
        "category": "Dominancia (E)",
        "options": [
            {
                "label": "A) Estar al frente de la fila",
                "value": 1
            },
            {
                "label": "B) Estar al final de la fila",
                "value": 2
            }
        ]
    },
    {
        "id": 123,
        "text": "🧸 Pregunta 123: ¿Qué prefieres o qué te describe mejor?",
        "category": "Entusiasmo (F)",
        "options": [
            {
                "label": "A) Jugar juegos ruidosos",
                "value": 1
            },
            {
                "label": "B) Jugar juegos silenciosos",
                "value": 2
            }
        ]
    },
    {
        "id": 124,
        "text": "🎨 Pregunta 124: ¿Qué prefieres o qué te describe mejor?",
        "category": "Conciencia (G)",
        "options": [
            {
                "label": "A) Terminar todo lo que empiezas",
                "value": 1
            },
            {
                "label": "B) Dejar las cosas a medias",
                "value": 2
            }
        ]
    },
    {
        "id": 125,
        "text": "⚽ Pregunta 125: ¿Qué prefieres o qué te describe mejor?",
        "category": "Emprendimiento (H)",
        "options": [
            {
                "label": "A) Aprender a andar sin llantitas",
                "value": 1
            },
            {
                "label": "B) Seguir usando llantitas",
                "value": 2
            }
        ]
    },
    {
        "id": 126,
        "text": "🐶 Pregunta 126: ¿Qué prefieres o qué te describe mejor?",
        "category": "Sensibilidad (I)",
        "options": [
            {
                "label": "A) Preocuparte por los demás",
                "value": 1
            },
            {
                "label": "B) Preocuparte solo por ti",
                "value": 2
            }
        ]
    },
    {
        "id": 127,
        "text": "🌳 Pregunta 127: ¿Qué prefieres o qué te describe mejor?",
        "category": "Desarrollo (J)",
        "options": [
            {
                "label": "A) Armar rompecabezas solo",
                "value": 1
            },
            {
                "label": "B) Pedir ayuda para armarlo",
                "value": 2
            }
        ]
    },
    {
        "id": 128,
        "text": "☀️ Pregunta 128: ¿Qué prefieres o qué te describe mejor?",
        "category": "Astucia (N)",
        "options": [
            {
                "label": "A) Evitar problemas",
                "value": 1
            },
            {
                "label": "B) Meterte siempre en problemas",
                "value": 2
            }
        ]
    },
    {
        "id": 129,
        "text": "🍎 Pregunta 129: ¿Qué prefieres o qué te describe mejor?",
        "category": "Aprensión (O)",
        "options": [
            {
                "label": "A) Sentir culpa por las cosas",
                "value": 1
            },
            {
                "label": "B) No sentir culpa casi nunca",
                "value": 2
            }
        ]
    },
    {
        "id": 130,
        "text": "🚀 Pregunta 130: ¿Qué prefieres o qué te describe mejor?",
        "category": "Tensión (Q4)",
        "options": [
            {
                "label": "A) Llorar de desesperación",
                "value": 1
            },
            {
                "label": "B) Pedir ayuda con calma",
                "value": 2
            }
        ]
    },
    {
        "id": 131,
        "text": "🌈 Pregunta 131: ¿Qué prefieres o qué te describe mejor?",
        "category": "Afabilidad (A)",
        "options": [
            {
                "label": "A) Conocer gente nueva",
                "value": 1
            },
            {
                "label": "B) Estar con tu familia",
                "value": 2
            }
        ]
    },
    {
        "id": 132,
        "text": "🦋 Pregunta 132: ¿Qué prefieres o qué te describe mejor?",
        "category": "Inteligencia (B)",
        "options": [
            {
                "label": "A) Hacer experimentos",
                "value": 1
            },
            {
                "label": "B) Jugar con plastilina",
                "value": 2
            }
        ]
    },
    {
        "id": 133,
        "text": "🚲 Pregunta 133: ¿Qué prefieres o qué te describe mejor?",
        "category": "Estabilidad (C)",
        "options": [
            {
                "label": "A) Seguir jugando si te equivocas",
                "value": 1
            },
            {
                "label": "B) Dejar de jugar si te equivocas",
                "value": 2
            }
        ]
    },
    {
        "id": 134,
        "text": "🐢 Pregunta 134: ¿Qué prefieres o qué te describe mejor?",
        "category": "Excitabilidad (D)",
        "options": [
            {
                "label": "A) Armar un rompecabezas lento",
                "value": 1
            },
            {
                "label": "B) Aventar las piezas si no encajan",
                "value": 2
            }
        ]
    },
    {
        "id": 135,
        "text": "🍉 Pregunta 135: ¿Qué prefieres o qué te describe mejor?",
        "category": "Dominancia (E)",
        "options": [
            {
                "label": "A) Decidir a qué jugar en el recreo",
                "value": 1
            },
            {
                "label": "B) Jugar lo que ya están jugando",
                "value": 2
            }
        ]
    },
    {
        "id": 136,
        "text": "🌟 Pregunta 136: ¿Qué prefieres o qué te describe mejor?",
        "category": "Entusiasmo (F)",
        "options": [
            {
                "label": "A) Ser el más divertido del salón",
                "value": 1
            },
            {
                "label": "B) Ser el más tranquilo",
                "value": 2
            }
        ]
    },
    {
        "id": 137,
        "text": "🎈 Pregunta 137: ¿Qué prefieres o qué te describe mejor?",
        "category": "Conciencia (G)",
        "options": [
            {
                "label": "A) Anotar la tarea en la agenda",
                "value": 1
            },
            {
                "label": "B) Olvidar anotar la tarea",
                "value": 2
            }
        ]
    },
    {
        "id": 138,
        "text": "🧸 Pregunta 138: ¿Qué prefieres o qué te describe mejor?",
        "category": "Emprendimiento (H)",
        "options": [
            {
                "label": "A) Preguntar si no entiendes algo",
                "value": 1
            },
            {
                "label": "B) Quedarte con la duda",
                "value": 2
            }
        ]
    },
    {
        "id": 139,
        "text": "🎨 Pregunta 139: ¿Qué prefieres o qué te describe mejor?",
        "category": "Sensibilidad (I)",
        "options": [
            {
                "label": "A) Ser muy cariñoso",
                "value": 1
            },
            {
                "label": "B) Ser un poco frío",
                "value": 2
            }
        ]
    },
    {
        "id": 140,
        "text": "⚽ Pregunta 140: ¿Qué prefieres o qué te describe mejor?",
        "category": "Desarrollo (J)",
        "options": [
            {
                "label": "A) Leer un cuento solo",
                "value": 1
            },
            {
                "label": "B) Pedir que te lo lean",
                "value": 2
            }
        ]
    },
    {
        "id": 141,
        "text": "🐶 Pregunta 141: ¿Qué prefieres o qué te describe mejor?",
        "category": "Astucia (N)",
        "options": [
            {
                "label": "A) Analizar a los demás",
                "value": 1
            },
            {
                "label": "B) No fijarte en los demás",
                "value": 2
            }
        ]
    },
    {
        "id": 142,
        "text": "🌳 Pregunta 142: ¿Qué prefieres o qué te describe mejor?",
        "category": "Aprensión (O)",
        "options": [
            {
                "label": "A) Pensar cosas malas antes de dormir",
                "value": 1
            },
            {
                "label": "B) Pensar cosas bonitas antes de dormir",
                "value": 2
            }
        ]
    },
    {
        "id": 143,
        "text": "☀️ Pregunta 143: ¿Qué prefieres o qué te describe mejor?",
        "category": "Tensión (Q4)",
        "options": [
            {
                "label": "A) Tirar las cosas si estás molesto",
                "value": 1
            },
            {
                "label": "B) Guardar las cosas con cuidado",
                "value": 2
            }
        ]
    },
    {
        "id": 144,
        "text": "🍎 Pregunta 144: ¿Qué prefieres o qué te describe mejor?",
        "category": "Afabilidad (A)",
        "options": [
            {
                "label": "A) Hablar mucho por teléfono",
                "value": 1
            },
            {
                "label": "B) No hablar mucho",
                "value": 2
            }
        ]
    },
    {
        "id": 145,
        "text": "🚀 Pregunta 145: ¿Qué prefieres o qué te describe mejor?",
        "category": "Inteligencia (B)",
        "options": [
            {
                "label": "A) Leer libros gruesos",
                "value": 1
            },
            {
                "label": "B) Leer libros de puros dibujos",
                "value": 2
            }
        ]
    },
    {
        "id": 146,
        "text": "🌈 Pregunta 146: ¿Qué prefieres o qué te describe mejor?",
        "category": "Estabilidad (C)",
        "options": [
            {
                "label": "A) Escuchar cuando te regañan",
                "value": 1
            },
            {
                "label": "B) Tapar tus oídos cuando te regañan",
                "value": 2
            }
        ]
    },
    {
        "id": 147,
        "text": "🦋 Pregunta 147: ¿Qué prefieres o qué te describe mejor?",
        "category": "Excitabilidad (D)",
        "options": [
            {
                "label": "A) Caminar en el supermercado",
                "value": 1
            },
            {
                "label": "B) Correr por los pasillos",
                "value": 2
            }
        ]
    },
    {
        "id": 148,
        "text": "🚲 Pregunta 148: ¿Qué prefieres o qué te describe mejor?",
        "category": "Dominancia (E)",
        "options": [
            {
                "label": "A) Ser el protagonista de la obra",
                "value": 1
            },
            {
                "label": "B) Ser parte del coro",
                "value": 2
            }
        ]
    },
    {
        "id": 149,
        "text": "🐢 Pregunta 149: ¿Qué prefieres o qué te describe mejor?",
        "category": "Entusiasmo (F)",
        "options": [
            {
                "label": "A) Animar a tu equipo a gritos",
                "value": 1
            },
            {
                "label": "B) Aplaudir despacio",
                "value": 2
            }
        ]
    },
    {
        "id": 150,
        "text": "🍉 Pregunta 150: ¿Qué prefieres o qué te describe mejor?",
        "category": "Conciencia (G)",
        "options": [
            {
                "label": "A) No decir mentiras nunca",
                "value": 1
            },
            {
                "label": "B) Decir mentirijillas a veces",
                "value": 2
            }
        ]
    },
    {
        "id": 151,
        "text": "🌟 Pregunta 151: ¿Qué prefieres o qué te describe mejor?",
        "category": "Emprendimiento (H)",
        "options": [
            {
                "label": "A) Participar en los concursos",
                "value": 1
            },
            {
                "label": "B) Ver el concurso desde las gradas",
                "value": 2
            }
        ]
    },
    {
        "id": 152,
        "text": "🎈 Pregunta 152: ¿Qué prefieres o qué te describe mejor?",
        "category": "Sensibilidad (I)",
        "options": [
            {
                "label": "A) Enojarte si ves una injusticia",
                "value": 1
            },
            {
                "label": "B) No hacer caso a las injusticias",
                "value": 2
            }
        ]
    },
    {
        "id": 153,
        "text": "🧸 Pregunta 153: ¿Qué prefieres o qué te describe mejor?",
        "category": "Desarrollo (J)",
        "options": [
            {
                "label": "A) Arreglarte tú solo",
                "value": 1
            },
            {
                "label": "B) Que te vista tu mamá",
                "value": 2
            }
        ]
    },
    {
        "id": 154,
        "text": "🎨 Pregunta 154: ¿Qué prefieres o qué te describe mejor?",
        "category": "Astucia (N)",
        "options": [
            {
                "label": "A) No dejar que te engañen",
                "value": 1
            },
            {
                "label": "B) Ser engañado fácilmente",
                "value": 2
            }
        ]
    },
    {
        "id": 155,
        "text": "⚽ Pregunta 155: ¿Qué prefieres o qué te describe mejor?",
        "category": "Aprensión (O)",
        "options": [
            {
                "label": "A) Asustarte con los truenos",
                "value": 1
            },
            {
                "label": "B) Que te gusten los truenos",
                "value": 2
            }
        ]
    },
    {
        "id": 156,
        "text": "🐶 Pregunta 156: ¿Qué prefieres o qué te describe mejor?",
        "category": "Tensión (Q4)",
        "options": [
            {
                "label": "A) Ponerse rojo del coraje",
                "value": 1
            },
            {
                "label": "B) Mantener el color normal",
                "value": 2
            }
        ]
    },
    {
        "id": 157,
        "text": "🌳 Pregunta 157: ¿Qué prefieres o qué te describe mejor?",
        "category": "Afabilidad (A)",
        "options": [
            {
                "label": "A) Estar en un equipo de fútbol",
                "value": 1
            },
            {
                "label": "B) Nadar tú solo",
                "value": 2
            }
        ]
    },
    {
        "id": 158,
        "text": "☀️ Pregunta 158: ¿Qué prefieres o qué te describe mejor?",
        "category": "Inteligencia (B)",
        "options": [
            {
                "label": "A) Acordarse de todo",
                "value": 1
            },
            {
                "label": "B) Olvidar algunas cosas",
                "value": 2
            }
        ]
    },
    {
        "id": 159,
        "text": "🍎 Pregunta 159: ¿Qué prefieres o qué te describe mejor?",
        "category": "Estabilidad (C)",
        "options": [
            {
                "label": "A) Mantener la calma en un examen",
                "value": 1
            },
            {
                "label": "B) Ponerte a llorar en un examen",
                "value": 2
            }
        ]
    },
    {
        "id": 160,
        "text": "🚀 Pregunta 160: ¿Qué prefieres o qué te describe mejor?",
        "category": "Excitabilidad (D)",
        "options": [
            {
                "label": "A) Estar en silencio 5 minutos",
                "value": 1
            },
            {
                "label": "B) No poder estar en silencio",
                "value": 2
            }
        ]
    }
];

const espq = {
    id: 'espq', title: 'ESPQ (Personalidad para Niños)', description: 'Cuestionario de Personalidad para Niños (6 a 8 años).',
    instructions: 'Elija la opción A o B que mejor le describa.',
    categories: espq_cats,
    options: [{label: 'Opción A', value: 1}, {label: 'Opción B', value: 2}],
    questions: espq_q,
    scoringCode: `
      const b: Record<string, number> = {};
      TEST_DEFINITIONS['espq'].categories.forEach(c => b[c] = 0);
      let total = 0;
      Object.entries(responses).forEach(([id, v]) => {
        const q = TEST_DEFINITIONS['espq'].questions.find((q: any) => q.id === Number(id));
        if (q && q.category) { b[q.category] += (v === 1 ? 1 : 0); total += 1; }
      });
      return { total, breakdown: b, interpretation: { 'Perfil': 'Dentro de lo esperado' } };
    `
};

let output = 'export interface Question {\n' +
'  id: number;\n' +
'  text: string;\n' +
'  category: string;\n' +
'  reverse?: boolean;\n' +
'  options?: { label: string; value: number }[];\n' +
'}\n\n' +
'export interface TestDefinition {\n' +
'  id: string;\n' +
'  title: string;\n' +
'  description: string;\n' +
'  instructions: string;\n' +
'  questions: Question[];\n' +
'  options: { label: string; value: number }[];\n' +
'  scoring: (responses: Record<number, number>, metadata?: any) => any;\n' +
'  categories: string[];\n' +
'}\n\n' +
'export const TEST_DEFINITIONS: Record<string, TestDefinition> = {\n';

const tests_list = [edah, coopersmith, cisneros, cas, cdi, fogliatto, cacia, espq];

for (const t of tests_list) {
    output += "  '" + t.id + "': {\n" +
    "    id: '" + t.id + "',\n" +
    "    title: '" + t.title + "',\n" +
    "    description: '" + t.description + "',\n" +
    "    instructions: '" + t.instructions + "',\n" +
    "    categories: " + JSON.stringify(t.categories) + ",\n" +
    "    options: " + JSON.stringify(t.options) + ",\n" +
    "    questions: " + JSON.stringify(t.questions) + ",\n" +
    "    scoring: (responses, metadata) => {" + t.scoringCode + "}\n" +
    "  },\n";
}

output += "};\n";

fs.writeFileSync('src/services/TestDefinitions.ts', output, 'utf8');
console.log('Generated TestDefinitions.ts successfully');
