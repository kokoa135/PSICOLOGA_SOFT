const fs = require('fs');

let code = fs.readFileSync('generate_tests.cjs', 'utf8');

const espq_cats = ['Afabilidad (A)', 'Inteligencia (B)', 'Estabilidad (C)', 'Excitabilidad (D)', 'Dominancia (E)', 'Entusiasmo (F)', 'Conciencia (G)', 'Emprendimiento (H)', 'Sensibilidad (I)', 'Desarrollo (J)', 'Astucia (N)', 'Aprensión (O)', 'Tensión (Q4)'];
const espq_q = [];

const espq_pairs = [
    ["Jugar con muchos niños", "Jugar con un solo amigo"],
    ["Resolver un rompecabezas", "Dibujar libremente"],
    ["Enojarte si pierdes", "Estar tranquilo aunque pierdas"],
    ["Quedarte sentado leyendo", "Correr por todo el parque"],
    ["Ser el líder del juego", "Dejar que otros decidan a qué jugar"],
    ["Estar alegre todo el día", "Estar callado y pensativo"],
    ["Hacer la tarea primero", "Jugar primero y hacer la tarea después"],
    ["Hablar con niños nuevos", "Quedarte con los amigos que ya conoces"],
    ["Sentir pena si ves a alguien llorar", "No darle mucha importancia"],
    ["Hacer un trabajo en grupo", "Hacer el trabajo tú solo"],
    ["Guardar un secreto muy bien", "Contárselo a tu mejor amigo"],
    ["Tener miedo a la oscuridad", "Dormir con la luz apagada sin problemas"],
    ["Morderte las uñas si estás nervioso", "Respirar profundo para calmarte"],
    ["Escuchar a la profesora", "Hablar con tu compañero de al lado"],
    ["Inventar un cuento nuevo", "Escuchar un cuento que ya conoces"]
];

for(let i=0; i<160; i++) {
    let cat = espq_cats[i % 13];
    let pair = espq_pairs[i % espq_pairs.length];
    espq_q.push({
        id: i+1,
        text: `¿Qué prefieres o qué te describe mejor?`,
        category: cat,
        options: [
            { label: pair[0], value: 1 },
            { label: pair[1], value: 2 }
        ]
    });
}

// Replace ESPQ questions
if(code.includes('const espq_q = [')) {
   code = code.replace(/const espq_q = \[.*?\];/s, "const espq_q = " + JSON.stringify(espq_q, null, 4) + ";");
}

fs.writeFileSync('generate_tests.cjs', code, 'utf8');
console.log('generate_tests.cjs updated with specific options for ESPQ.');
