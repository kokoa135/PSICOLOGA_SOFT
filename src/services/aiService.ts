/**
 * AI Service for psychological note decoding
 * Expanded based on deep analysis of SessionFuel Copilot
 */

export interface AIDecodingResult {
  distortions: string[];
  schemas: string[];
  beliefs: string[];
  attachment: string[];
  dissonances: string[];
  metacognition: string;
  emotionalTone: 'Positivo' | 'Neutral' | 'Negativo' | 'Mixto';
  keyTopics: string[];
  summary: string;
  nextStepHints: string[];
}

export const decodeSessionNotes = (notes: string): AIDecodingResult => {
  const lowercaseNotes = notes.toLowerCase();
  
  const distortions: string[] = [];
  const schemas: string[] = [];
  const beliefs: string[] = [];
  const attachment: string[] = [];
  const dissonances: string[] = [];
  
  // 1. Cognitive Distortions (Yellow Badge Style)
  if (lowercaseNotes.includes('siempre') || lowercaseNotes.includes('nunca') || lowercaseNotes.includes('todos') || lowercaseNotes.includes('nadie')) {
    distortions.push('Sobregeneralización');
    distortions.push('Pensamiento Todo o Nada');
  }
  if (lowercaseNotes.includes('seguro que') || lowercaseNotes.includes('va a salir mal') || lowercaseNotes.includes('terrible')) {
    distortions.push('Catastrofismo');
  }
  if (lowercaseNotes.includes('seguro piensa') || lowercaseNotes.includes('me juzgan')) {
    distortions.push('Lectura de Intenciones');
  }
  if (lowercaseNotes.includes('debería') || lowercaseNotes.includes('tengo que') || lowercaseNotes.includes('obligado')) {
    distortions.push('Afirmaciones de Debería');
  }
  
  // 2. Early Maladaptive Schemas (Purple Badge Style)
  if (lowercaseNotes.includes('solo') || lowercaseNotes.includes('me dejarán') || lowercaseNotes.includes('perder')) {
    schemas.push('Abandono / Inestabilidad');
  }
  if (lowercaseNotes.includes('no soy suficiente') || lowercaseNotes.includes('fallo') || lowercaseNotes.includes('vergüenza')) {
    schemas.push('Imperfección / Vergüenza');
  }
  if (lowercaseNotes.includes('no puedo') || lowercaseNotes.includes('necesito que me ayuden')) {
    schemas.push('Dependencia / Incompetencia');
  }

  // 3. Limiting Beliefs (Pink Badge Style)
  if (lowercaseNotes.includes('no valgo') || lowercaseNotes.includes('incapaz')) {
    beliefs.push('Inutilidad percibida');
  }
  if (lowercaseNotes.includes('mundo peligroso') || lowercaseNotes.includes('no puedo confiar')) {
    beliefs.push('Mundo hostil');
  }

  // 4. Attachment Patterns (Red Badge Style)
  if (lowercaseNotes.includes('me agobia') || lowercaseNotes.includes('espacio') || lowercaseNotes.includes('independiente')) {
    attachment.push('Evitativo');
  }
  if (lowercaseNotes.includes('miedo a que se vaya') || lowercaseNotes.includes('necesito saber')) {
    attachment.push('Ansioso-Ambivalente');
  }

  // 5. Cognitive Dissonances
  if (lowercaseNotes.includes('sé que debo') && lowercaseNotes.includes('pero no lo hago')) {
    dissonances.push('Conflicto Acción-Valor');
  }
  
  // Emotional Tone Analysis
  let tone: AIDecodingResult['emotionalTone'] = 'Neutral';
  const positiveWords = ['mejor', 'feliz', 'logré', 'pude', 'esperanza', 'tranquilo', 'paz'];
  const negativeWords = ['triste', 'miedo', 'peor', 'dolor', 'angustia', 'llanto', 'culpa'];
  
  const posCount = positiveWords.filter(w => lowercaseNotes.includes(w)).length;
  const negCount = negativeWords.filter(w => lowercaseNotes.includes(w)).length;
  
  if (posCount > negCount) tone = 'Positivo';
  else if (negCount > posCount) tone = 'Negativo';
  else if (posCount > 0 && negCount > 0) tone = 'Mixto';

  return {
    distortions,
    schemas,
    beliefs,
    attachment,
    dissonances,
    metacognition: lowercaseNotes.length > 200 ? 'Alta (Capacidad de auto-observación detallada)' : 'Media-Baja',
    emotionalTone: tone,
    keyTopics: ['Autoconcepto', 'Relaciones Interpersonales'],
    summary: `El análisis detecta una prevalencia de ${distortions[0] || 'patrones emocionales'} vinculados a un esquema de ${schemas[0] || 'autoestima'}.`,
    nextStepHints: [
      'Explorar el origen de la rumiación sobre el futuro.',
      'Validar las emociones de soledad expresadas en la sesión.',
      'Prescribir ejercicio de "Anclaje 5-4-3-2-1" para rumiaciones.'
    ]
  };
};

export const suggestExercises = (result: AIDecodingResult) => {
  const suggestions = [];
  if (result.distortions.includes('Catastrofismo')) suggestions.push('Manejo del Pánico');
  if (result.distortions.includes('Sobregeneralización')) suggestions.push('Reestructuración Cognitiva');
  if (result.emotionalTone === 'Negativo') suggestions.push('Respiración 4-7-8');
  if (result.beliefs.length > 0) suggestions.push('Carta al Niño Interior');
  return suggestions;
};
