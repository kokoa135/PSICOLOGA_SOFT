const fs = require('fs');

const espq_cats = ['Afabilidad (A)', 'Inteligencia (B)', 'Estabilidad (C)', 'Excitabilidad (D)', 'Dominancia (E)', 'Entusiasmo (F)', 'Conciencia (G)', 'Emprendimiento (H)', 'Sensibilidad (I)', 'Desarrollo (J)', 'Astucia (N)', 'Aprensión (O)', 'Tensión (Q4)'];
const espq_q = [];

// Base variations for each factor to ensure uniqueness across 160 items
const base_pairs = {
    'Afabilidad (A)': [
        ["Jugar con muchos niños", "Jugar con un solo amigo"],
        ["Trabajar en equipo", "Trabajar tú solo"],
        ["Hablar con todos en el recreo", "Quedarte en silencio"],
        ["Invitar a muchos amigos a tu casa", "Invitar a uno solo"],
        ["Compartir tus juguetes con todos", "Jugar tú solo con tus juguetes"],
        ["Estar rodeado de gente", "Estar en tu habitación tranquilo"],
        ["Ir a una fiesta ruidosa", "Quedarte viendo una película"],
        ["Ayudar a un compañero nuevo", "Dejar que otros lo ayuden"],
        ["Hacer reír a tus amigos", "Escuchar a los demás"],
        ["Jugar juegos de mesa en familia", "Armar legos solo"],
        ["Conocer gente nueva", "Estar con tu familia"],
        ["Hablar mucho por teléfono", "No hablar mucho"],
        ["Estar en un equipo de fútbol", "Nadar tú solo"]
    ],
    'Inteligencia (B)': [
        ["Resolver un rompecabezas", "Dibujar libremente"],
        ["Aprender matemáticas", "Ver la televisión"],
        ["Armar cosas difíciles", "Jugar con cosas fáciles"],
        ["Leer un libro de ciencias", "Ver dibujos animados"],
        ["Hacer la tarea rápido y bien", "Tardar mucho en la tarea"],
        ["Entender los chistes rápido", "Tardar en entender los chistes"],
        ["Jugar ajedrez", "Jugar a las escondidas"],
        ["Aprender palabras nuevas", "Usar las palabras de siempre"],
        ["Preguntar por qué funcionan las cosas", "No preguntar mucho"],
        ["Sacar buenas notas", "No preocuparse por las notas"],
        ["Hacer experimentos", "Jugar con plastilina"],
        ["Leer libros gruesos", "Leer libros de puros dibujos"],
        ["Acordarse de todo", "Olvidar algunas cosas"]
    ],
    'Estabilidad (C)': [
        ["Estar tranquilo aunque pierdas", "Enojarte si pierdes"],
        ["Respirar hondo si algo sale mal", "Llorar si algo sale mal"],
        ["Pedir ayuda calmado", "Gritar cuando necesitas algo"],
        ["Aceptar los errores", "Culpar a los demás"],
        ["No molestarte por bromas", "Molestarte muy rápido por bromas"],
        ["Esperar tu turno sin quejarte", "Enojarte si te hacen esperar"],
        ["Levantarte si te caes y seguir", "Llorar mucho si te caes un poco"],
        ["Dormir bien en la noche", "Tener pesadillas a menudo"],
        ["Estar feliz casi siempre", "Cambiar de humor rápido"],
        ["Hablar sin gritar", "Gritar cuando te frustras"],
        ["Seguir jugando si te equivocas", "Dejar de jugar si te equivocas"],
        ["Escuchar cuando te regañan", "Tapar tus oídos cuando te regañan"],
        ["Mantener la calma en un examen", "Ponerte a llorar en un examen"]
    ],
    'Excitabilidad (D)': [
        ["Quedarte sentado leyendo", "Correr por todo el parque"],
        ["Caminar despacio", "Saltar todo el tiempo"],
        ["Hablar despacito", "Hablar muy fuerte y rápido"],
        ["Jugar cosas tranquilas", "Jugar cosas de mucha energía"],
        ["Esperar en la fila tranquilo", "Moverte todo el tiempo en la fila"],
        ["Poner atención en silencio", "Interrumpir la clase"],
        ["Ver una película completa", "Levantarte a cada rato"],
        ["Pintar sin salirte de la raya", "Pintar muy rápido"],
        ["Dormir temprano", "Querer seguir jugando de noche"],
        ["Terminar de comer sentado", "Levantarte de la mesa comiendo"],
        ["Armar un rompecabezas lento", "Aventar las piezas si no encajan"],
        ["Caminar en el supermercado", "Correr por los pasillos"],
        ["Estar en silencio 5 minutos", "No poder estar en silencio"]
    ],
    'Dominancia (E)': [
        ["Ser el líder del juego", "Dejar que otros decidan a qué jugar"],
        ["Inventar las reglas", "Seguir las reglas de otros"],
        ["Decir a dónde ir", "Ir a donde digan los demás"],
        ["Escoger el programa de TV", "Ver lo que otros escojan"],
        ["Hablar primero en clase", "Esperar a que otros hablen"],
        ["Defender tu idea siempre", "Aceptar la idea de los demás"],
        ["Ser el capitán del equipo", "Ser un jugador más"],
        ["Decir a los demás qué hacer", "Hacer lo que los demás dicen"],
        ["Ganar las discusiones", "Evitar las discusiones"],
        ["Estar al frente de la fila", "Estar al final de la fila"],
        ["Decidir a qué jugar en el recreo", "Jugar lo que ya están jugando"],
        ["Ser el protagonista de la obra", "Ser parte del coro"],
        ["Mandar a tus hermanos", "Obedecer a tus hermanos"]
    ],
    'Entusiasmo (F)': [
        ["Estar alegre todo el día", "Estar callado y pensativo"],
        ["Reír a carcajadas", "Sonreír suavemente"],
        ["Contar chistes a todos", "Escuchar a los demás"],
        ["Bailar cuando hay música", "Quedarte sentado escuchando"],
        ["Emocionarte mucho por un regalo", "Dar las gracias tranquilo"],
        ["Hablar con mucha energía", "Hablar con voz bajita"],
        ["Saltar de alegría", "Estar contento pero quieto"],
        ["Querer ir a todas las fiestas", "Preferir quedarte en casa"],
        ["Cantar fuerte en el auto", "Mirar por la ventana"],
        ["Jugar juegos ruidosos", "Jugar juegos silenciosos"],
        ["Ser el más divertido del salón", "Ser el más tranquilo"],
        ["Animar a tu equipo a gritos", "Aplaudir despacio"],
        ["Hacer fiestas enormes", "Celebrar solo con tu familia"]
    ],
    'Conciencia (G)': [
        ["Hacer la tarea primero", "Jugar primero y hacer la tarea después"],
        ["Recoger tu cuarto siempre", "Dejar el cuarto desordenado"],
        ["Pedir permiso para salir", "Salir sin avisar"],
        ["Llegar temprano a la escuela", "Llegar tarde siempre"],
        ["Cumplir tus promesas", "Olvidar lo que prometiste"],
        ["Obedecer a tus papás", "Ignorar lo que te dicen"],
        ["Hacer las cosas bien hechas", "Hacer las cosas rápido y mal"],
        ["Cuidar tus juguetes", "Romper tus juguetes a menudo"],
        ["Lavarte los dientes solo", "Que te tengan que obligar a lavarlos"],
        ["Terminar todo lo que empiezas", "Dejar las cosas a medias"],
        ["Anotar la tarea en la agenda", "Olvidar anotar la tarea"],
        ["No decir mentiras nunca", "Decir mentirijillas a veces"],
        ["Comer todas las verduras", "Dejar la comida en el plato"]
    ],
    'Emprendimiento (H)': [
        ["Hablar con niños nuevos", "Quedarte con los amigos que ya conoces"],
        ["Probar comida nueva", "Comer siempre lo mismo"],
        ["Subirte a juegos rápidos", "No subirte a los juegos"],
        ["Cantar frente a toda la escuela", "Cantar solo en tu cuarto"],
        ["Levantar la mano en clase", "Esconderte para que no te pregunten"],
        ["Explorar lugares nuevos", "Ir a los lugares de siempre"],
        ["Saludar a adultos que no conoces", "Esconderte detrás de tu mamá"],
        ["Tocar animales extraños", "Alejarte de los animales"],
        ["Aprender a nadar hondo", "Quedarte en lo bajito"],
        ["Aprender a andar sin llantitas", "Seguir usando llantitas"],
        ["Preguntar si no entiendes algo", "Quedarte con la duda"],
        ["Participar en los concursos", "Ver el concurso desde las gradas"],
        ["Pedir algo en una tienda tú solo", "Que lo pida tu papá"]
    ],
    'Sensibilidad (I)': [
        ["Sentir pena si ves a alguien llorar", "No darle mucha importancia"],
        ["Llorar con películas tristes", "No llorar con películas"],
        ["Dar abrazos a tus papás mucho", "No dar muchos abrazos"],
        ["Ayudar a un perrito de la calle", "Pasar de largo"],
        ["Sentir tristeza si regañan a otro", "Reírte si regañan a otro"],
        ["Hacer dibujos bonitos", "No prestar atención a los colores"],
        ["Cuidar las flores del jardín", "Arrancar las flores"],
        ["Pedir perdón si lastimas a alguien", "No pedir perdón"],
        ["Escuchar música clásica", "Escuchar música muy ruidosa"],
        ["Preocuparte por los demás", "Preocuparte solo por ti"],
        ["Ser muy cariñoso", "Ser un poco frío"],
        ["Enojarte si ves una injusticia", "No hacer caso a las injusticias"],
        ["Tener una mascota muy cuidada", "No querer tener mascotas"]
    ],
    'Desarrollo (J)': [
        ["Hacer un trabajo en grupo", "Hacer el trabajo tú solo"],
        ["Jugar en equipo", "Jugar cosas individuales"],
        ["Compartir los secretos", "No contar nada a nadie"],
        ["Necesitar que te ayuden", "Hacer las cosas sin ayuda"],
        ["Ir a campamentos con otros", "No querer salir de casa"],
        ["Depender de tus papás", "Ser muy independiente"],
        ["Preferir deportes en equipo", "Preferir tenis o natación solo"],
        ["Estudiar con amigos", "Estudiar encerrado en tu cuarto"],
        ["Ir al baño solo", "Pedir que te acompañen"],
        ["Armar rompecabezas solo", "Pedir ayuda para armarlo"],
        ["Leer un cuento solo", "Pedir que te lo lean"],
        ["Arreglarte tú solo", "Que te vista tu mamá"],
        ["Creer todo lo que dicen", "Dudar y comprobarlo tú mismo"]
    ],
    'Astucia (N)': [
        ["Guardar un secreto muy bien", "Contárselo a tu mejor amigo"],
        ["Planear una sorpresa bien", "Arruinar la sorpresa"],
        ["Ser cuidadoso con lo que dices", "Decir lo primero que piensas"],
        ["Saber cuándo alguien miente", "Creerle a todo el mundo"],
        ["Ganar en las escondidas", "Ser el primero en que encuentran"],
        ["Hacer trucos de magia", "No saber hacer trucos"],
        ["Cambiar de tema si te descubren", "Quedarte callado si te descubren"],
        ["Conseguir lo que quieres inteligentemente", "Llorar para conseguir lo que quieres"],
        ["Saber cómo hacer amigos", "Tardar en hacer amigos"],
        ["Evitar problemas", "Meterte siempre en problemas"],
        ["Analizar a los demás", "No fijarte en los demás"],
        ["No dejar que te engañen", "Ser engañado fácilmente"],
        ["Saber negociar", "Aceptar siempre lo primero"]
    ],
    'Aprensión (O)': [
        ["Tener miedo a la oscuridad", "Dormir con la luz apagada sin problemas"],
        ["Preocuparte mucho por un examen", "Estar tranquilo antes del examen"],
        ["Tener miedo de los monstruos", "Saber que los monstruos no existen"],
        ["Sentir que haces todo mal", "Sentir que haces todo bien"],
        ["Preocuparte por equivocarte", "No darle importancia si te equivocas"],
        ["Tener miedo de que te regañen", "No pensar en que te regañarán"],
        ["Estar nervioso antes de un partido", "Estar seguro de que ganarás"],
        ["Llorar si te miran mucho", "Sentirte seguro si te miran"],
        ["Creer que no tienes amigos", "Saber que tienes amigos"],
        ["Sentir culpa por las cosas", "No sentir culpa casi nunca"],
        ["Pensar cosas malas antes de dormir", "Pensar cosas bonitas antes de dormir"],
        ["Asustarte con los truenos", "Que te gusten los truenos"],
        ["Pedir que te dejen la luz prendida", "Apagar tú mismo la luz"]
    ],
    'Tensión (Q4)': [
        ["Morderte las uñas si estás nervioso", "Respirar profundo para calmarte"],
        ["No poder quedarte quieto", "Estar relajado en el sofá"],
        ["Enojarte si las cosas no salen rápido", "Tener paciencia para esperar"],
        ["Estar estresado todo el día", "Sentirte ligero y feliz"],
        ["Apretar los dientes al dormir", "Dormir muy relajado"],
        ["Gritar cuando estás apurado", "Hablar con calma siempre"],
        ["Enojarse por cosas pequeñas", "No enojarse fácilmente"],
        ["Querer que todo se haga ya", "Entender que hay que esperar"],
        ["Ponerte tenso en un viaje largo", "Dormir en los viajes largos"],
        ["Llorar de desesperación", "Pedir ayuda con calma"],
        ["Tirar las cosas si estás molesto", "Guardar las cosas con cuidado"],
        ["Ponerse rojo del coraje", "Mantener el color normal"],
        ["Querer pegar si te enojas", "Alejarte para calmarte"]
    ]
};

for(let i=0; i<160; i++) {
    let cat = espq_cats[i % 13];
    let pool = base_pairs[cat];
    let pair = pool[Math.floor(i / 13) % pool.length];
    
    // Add some random variation if we loop past the 13 available questions for a factor to make it perfectly 160 unique.
    let varA = pair[0];
    let varB = pair[1];
    if (Math.floor(i / 13) >= pool.length) {
        varA += " hoy";
        varB += " hoy";
    }

    espq_q.push({
        id: i+1,
        text: `¿Qué prefieres o qué te describe mejor?`,
        category: cat,
        options: [
            { label: varA, value: 1 },
            { label: varB, value: 2 }
        ]
    });
}

let code = fs.readFileSync('generate_tests.cjs', 'utf8');

if(code.includes('const espq_q = [')) {
   code = code.replace(/const espq_q = \[.*?\];/s, "const espq_q = " + JSON.stringify(espq_q, null, 4) + ";");
}

fs.writeFileSync('generate_tests.cjs', code, 'utf8');
console.log('generate_tests.cjs updated with 160 unique options for ESPQ.');
