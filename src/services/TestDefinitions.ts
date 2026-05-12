
export interface Question {
  id: number;
  text: string;
  category: string;
  reverse?: boolean;
}

export interface TestDefinition {
  id: string;
  title: string;
  description: string;
  instructions: string;
  questions: Question[];
  options: { label: string; value: number }[];
  scoring: (responses: Record<number, number>, metadata?: any) => any;
  categories: string[];
}

export const TEST_DEFINITIONS: Record<string, TestDefinition> = {
  'edah': {
    id: 'edah',
    title: 'EDAH (TDAH)',
    description: 'Evaluación del Trastorno por Déficit de Atención con Hiperactividad.',
    instructions: 'Responda según la frecuencia observada: 0 (Nada) a 3 (Mucho).',
    categories: ['Hiperactividad', 'Atención', 'Conducta'],
    options: [{ label: 'Nada', value: 0 }, { label: 'Poco', value: 1 }, { label: 'Bastante', value: 2 }, { label: 'Mucho', value: 3 }],
    questions: [
      { id: 1, text: 'Tiene excesiva inquietud motora', category: 'Hiperactividad' },
      { id: 2, text: 'Tiene dificultades de aprendizaje escolar', category: 'Atención' },
      { id: 3, text: 'Molesta frecuentemente a otros niños', category: 'Hiperactividad' },
      { id: 4, text: 'Se distrae fácilmente, muestra escasa atención', category: 'Atención' },
      { id: 5, text: 'Exige inmediata satisfacción a sus demandas', category: 'Hiperactividad' },
      { id: 6, text: 'Tiene dificultad para las actividades cooperativas', category: 'Conducta' },
      { id: 7, text: 'Está en las nubes, ensimismado', category: 'Atención' },
      { id: 8, text: 'Deja por terminar las tareas que empieza', category: 'Atención' },
      { id: 9, text: 'Es mal aceptado por el grupo', category: 'Conducta' },
      { id: 10, text: 'Niega sus errores o echa la culpa a otros', category: 'Conducta' },
      { id: 11, text: 'A menudo grita en situaciones inadecuadas', category: 'Conducta' },
      { id: 12, text: 'Contesta con facilidad. Es irrespetuoso y arrogante', category: 'Conducta' },
      { id: 13, text: 'Se mueve constantemente, intranquilo', category: 'Hiperactividad' },
      { id: 14, text: 'Discute y pelea por cualquier cosa', category: 'Conducta' },
      { id: 15, text: 'Tiene explosiones impredecibles de mal genio', category: 'Conducta' },
      { id: 16, text: 'Le falta el sentido de la regla, del "juego limpio"', category: 'Conducta' },
      { id: 17, text: 'Es impulsivo e irritable', category: 'Hiperactividad' },
      { id: 18, text: 'Se lleva mal con la mayoría de sus compañeros', category: 'Conducta' },
      { id: 19, text: 'Sus esfuerzos se frustran fácilmente, es inconstante', category: 'Atención' },
      { id: 20, text: 'Acepta mal las indicaciones del profesor', category: 'Conducta' }
    ],
    scoring: (responses, metadata) => {
      const b: any = { Hiperactividad: 0, Atención: 0, Conducta: 0 };
      Object.entries(responses).forEach(([id, v]) => {
        const q = TEST_DEFINITIONS['edah'].questions.find(q => q.id === Number(id));
        if (q) b[q.category] += v;
      });
      return { total: b.Hiperactividad + b.Atención + b.Conducta, breakdown: b };
    }
  },
  'coopersmith': {
    id: 'coopersmith',
    title: 'Inventario Coopersmith (Autoestima)',
    description: 'Evaluación de la autoestima en niños y adolescentes.',
    instructions: 'Responda SI si se identifica con la frase, NO si no es así.',
    categories: ['Personal', 'Social', 'Hogar', 'Escolar'],
    options: [{ label: 'SÍ', value: 1 }, { label: 'NO', value: 0 }],
    questions: [
      { id: 1, text: 'Me gustaría ser otra persona', category: 'Personal', reverse: true },
      { id: 2, text: 'Me es difícil hablar frente a la clase', category: 'Escolar', reverse: true },
      { id: 3, text: 'Puedo tomar decisiones fácilmente', category: 'Personal' },
      { id: 4, text: 'Soy una persona divertida', category: 'Social' },
      { id: 5, text: 'En casa me enojo fácilmente', category: 'Hogar', reverse: true },
      { id: 6, text: 'Me toma mucho tiempo acostumbrarme a algo nuevo', category: 'Personal', reverse: true },
      { id: 7, text: 'Soy popular entre mis compañeros', category: 'Social' },
      { id: 8, text: 'Mis padres esperan demasiado de mí', category: 'Hogar', reverse: true },
      { id: 9, text: 'Mis profesores me hacen sentir que no soy bueno', category: 'Escolar', reverse: true },
      { id: 10, text: 'Me siento seguro de mí mismo', category: 'Personal' }
      // Expandable to 58
    ],
    scoring: (responses) => {
      const b: any = { Personal: 0, Social: 0, Hogar: 0, Escolar: 0 };
      Object.entries(responses).forEach(([id, v]) => {
        const q = TEST_DEFINITIONS['coopersmith'].questions.find(q => q.id === Number(id));
        if (q) b[q.category] += q.reverse ? (v === 1 ? 0 : 1) : v;
      });
      return { total: Object.values(b).reduce((a: any, c: any) => a + c, 0), breakdown: b };
    }
  },
  'cisneros': {
    id: 'cisneros',
    title: 'Test Cisneros (Bullying)',
    description: 'Detección de acoso escolar y maltrato entre iguales.',
    instructions: 'Indique la frecuencia de cada comportamiento.',
    categories: ['Aislamiento', 'Hostigamiento', 'Coacción', 'Agresión'],
    options: [{ label: 'Nunca', value: 1 }, { label: 'A veces', value: 2 }, { label: 'Frecuente', value: 3 }],
    questions: [
      { id: 1, text: 'No me hablan', category: 'Aislamiento' },
      { id: 2, text: 'Me ignoran, me hacen el vacío', category: 'Aislamiento' },
      { id: 3, text: 'Me ponen en ridículo ante los demás', category: 'Hostigamiento' },
      { id: 4, text: 'No me dejan hablar', category: 'Aislamiento' },
      { id: 5, text: 'Me llaman por motes', category: 'Hostigamiento' },
      { id: 6, text: 'Me obligan a hacer cosas que no quiero', category: 'Coacción' },
      { id: 7, text: 'Rompen mis cosas a propósito', category: 'Agresión' },
      { id: 8, text: 'Me pegan o empujan', category: 'Agresión' }
    ],
    scoring: (responses) => {
      const b: any = { Aislamiento: 0, Hostigamiento: 0, Coacción: 0, Agresión: 0 };
      Object.entries(responses).forEach(([id, v]) => {
        const q = TEST_DEFINITIONS['cisneros'].questions.find(q => q.id === Number(id));
        if (q) b[q.category] += (v - 1);
      });
      return { total: Object.values(b).reduce((a: any, c: any) => a + c, 0), breakdown: b };
    }
  },
  'cas': {
    id: 'cas',
    title: 'CAS (Ansiedad Infantil)',
    description: 'Escala de ansiedad manifiesta para niños.',
    instructions: 'Responda SÍ o NO según se sienta identificado.',
    categories: ['Ansiedad Fisiológica', 'Inquietud', 'Preocupación Social'],
    options: [{ label: 'SÍ', value: 1 }, { label: 'NO', value: 0 }],
    questions: [
      { id: 1, text: 'Me cuesta quedarme dormido por las noches', category: 'Ansiedad Fisiológica' },
      { id: 2, text: 'Me preocupo por cosas que pueden pasar', category: 'Inquietud' },
      { id: 3, text: 'Sudo o tiemblo cuando tengo un examen', category: 'Ansiedad Fisiológica' },
      { id: 4, text: 'Me da miedo lo que piensen de mí', category: 'Preocupación Social' }
    ],
    scoring: (responses) => {
      const b: any = { 'Ansiedad Fisiológica': 0, Inquietud: 0, 'Preocupación Social': 0 };
      Object.entries(responses).forEach(([id, v]) => {
        const q = TEST_DEFINITIONS['cas'].questions.find(q => q.id === Number(id));
        if (q) b[q.category] += v;
      });
      return { total: Object.values(b).reduce((a: any, c: any) => a + c, 0), breakdown: b };
    }
  },
  'cds': {
    id: 'cds',
    title: 'CDS (Depresión Infantil)',
    description: 'Cuestionario para la evaluación de la depresión en niños.',
    instructions: 'Marque el grado de acuerdo con cada frase.',
    categories: ['Respuesta Afectiva', 'Problemas Sociales', 'Autoestima'],
    options: [{ label: 'Nunca', value: 0 }, { label: 'A veces', value: 1 }, { label: 'Siempre', value: 2 }],
    questions: [
      { id: 1, text: 'Me siento triste sin motivo', category: 'Respuesta Afectiva' },
      { id: 2, text: 'Prefiero estar solo que con amigos', category: 'Problemas Sociales' },
      { id: 3, text: 'Siento que no hago nada bien', category: 'Autoestima' }
    ],
    scoring: (responses) => {
      const b: any = { 'Respuesta Afectiva': 0, 'Problemas Sociales': 0, Autoestima: 0 };
      Object.entries(responses).forEach(([id, v]) => {
        const q = TEST_DEFINITIONS['cds'].questions.find(q => q.id === Number(id));
        if (q) b[q.category] += v;
      });
      return { total: Object.values(b).reduce((a: any, c: any) => a + c, 0), breakdown: b };
    }
  },
  'fogliatto': {
    id: 'fogliatto',
    title: 'Test Fogliatto (Intereses)',
    description: 'Cuestionario de intereses vocacionales.',
    instructions: 'Indique cuánto le interesan las siguientes actividades.',
    categories: ['Científico', 'Artístico', 'Social', 'Administrativo', 'Tecnológico'],
    options: [{ label: 'Nada', value: 0 }, { label: 'Algo', value: 1 }, { label: 'Mucho', value: 2 }],
    questions: [
      { id: 1, text: 'Investigar el origen de las enfermedades', category: 'Científico' },
      { id: 2, text: 'Diseñar edificios o casas', category: 'Artístico' },
      { id: 3, text: 'Ayudar a personas con problemas', category: 'Social' },
      { id: 4, text: 'Organizar archivos o documentos', category: 'Administrativo' },
      { id: 5, text: 'Reparar aparatos electrónicos', category: 'Tecnológico' }
    ],
    scoring: (responses) => {
      const b: any = { Científico: 0, Artístico: 0, Social: 0, Administrativo: 0, Tecnológico: 0 };
      Object.entries(responses).forEach(([id, v]) => {
        const q = TEST_DEFINITIONS['fogliatto'].questions.find(q => q.id === Number(id));
        if (q) b[q.category] += v;
      });
      return { total: Object.values(b).reduce((a: any, c: any) => a + c, 0), breakdown: b };
    }
  }
};
