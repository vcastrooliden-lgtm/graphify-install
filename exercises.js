// Ilustraciones animadas (figuras de palitos, 2 posturas alternando en loop)
// que muestran cómo se hace cada ejercicio. Todo es SVG + CSS, sin videos ni
// imágenes externas, para que funcione offline y sin depender de licencias.
//
// Cada entrada de POSES tiene dos posturas (a/b). El renderer dibuja una
// figura simple (cabeza + torso + 2 brazos + 2 piernas) para cada postura y
// el CSS (ver styles.css, clases .fig-pose-a/.fig-pose-b) las hace alternar
// con un crossfade, dando la sensación de movimiento.

const POSES = {
  walk: {
    a: {
      head: [50, 14], neck: [50, 21], hip: [50, 50],
      shoulderL: [43, 23], elbowL: [36, 34], handL: [40, 46],
      shoulderR: [57, 23], elbowR: [64, 32], handR: [70, 20],
      hipL: [45, 50], kneeL: [38, 66], footL: [30, 80],
      hipR: [55, 50], kneeR: [60, 68], footR: [66, 88],
    },
    b: {
      head: [50, 14], neck: [50, 21], hip: [50, 50],
      shoulderL: [43, 23], elbowL: [36, 32], handL: [30, 20],
      shoulderR: [57, 23], elbowR: [64, 34], handR: [60, 46],
      hipL: [45, 50], kneeL: [40, 68], footL: [34, 88],
      hipR: [55, 50], kneeR: [62, 66], footR: [70, 80],
    },
  },
  bike: {
    a: {
      head: [62, 30], neck: [58, 36], hip: [48, 58],
      shoulderL: [56, 38], elbowL: [66, 42], handL: [76, 44],
      shoulderR: [56, 38], elbowR: [66, 46], handR: [76, 48],
      hipL: [46, 58], kneeL: [40, 70], footL: [46, 86],
      hipR: [50, 58], kneeR: [56, 62], footR: [62, 72],
    },
    b: {
      head: [62, 30], neck: [58, 36], hip: [48, 58],
      shoulderL: [56, 38], elbowL: [66, 42], handL: [76, 44],
      shoulderR: [56, 38], elbowR: [66, 46], handR: [76, 48],
      hipL: [46, 58], kneeL: [52, 60], footL: [58, 70],
      hipR: [50, 58], kneeR: [44, 72], footR: [50, 88],
    },
  },
  squat: {
    a: {
      head: [50, 16], neck: [50, 23], hip: [50, 48],
      shoulderL: [43, 25], elbowL: [38, 38], handL: [36, 50],
      shoulderR: [57, 25], elbowR: [62, 38], handR: [64, 50],
      hipL: [45, 48], kneeL: [43, 66], footL: [42, 88],
      hipR: [55, 48], kneeR: [57, 66], footR: [58, 88],
    },
    b: {
      head: [50, 38], neck: [50, 45], hip: [50, 66],
      shoulderL: [43, 47], elbowL: [38, 58], handL: [38, 68],
      shoulderR: [57, 47], elbowR: [62, 58], handR: [62, 68],
      hipL: [42, 66], kneeL: [36, 78], footL: [40, 88],
      hipR: [58, 66], kneeR: [64, 78], footR: [60, 88],
    },
  },
  lunge: {
    a: {
      head: [52, 20], neck: [52, 27], hip: [50, 50],
      shoulderL: [46, 29], elbowL: [40, 38], handL: [38, 48],
      shoulderR: [54, 29], elbowR: [60, 38], handR: [62, 48],
      hipL: [46, 50], kneeL: [38, 66], footL: [32, 84],
      hipR: [54, 50], kneeR: [66, 64], footR: [78, 80],
    },
    b: {
      head: [52, 30], neck: [52, 37], hip: [50, 58],
      shoulderL: [46, 39], elbowL: [40, 48], handL: [38, 56],
      shoulderR: [54, 39], elbowR: [60, 48], handR: [62, 56],
      hipL: [46, 58], kneeL: [36, 72], footL: [30, 86],
      hipR: [54, 58], kneeR: [70, 74], footR: [84, 82],
    },
  },
  plank: {
    a: {
      head: [20, 48], neck: [28, 50], hip: [60, 54],
      shoulderL: [28, 50], elbowL: [28, 64], handL: [26, 72],
      shoulderR: [28, 50], elbowR: [28, 64], handR: [30, 72],
      hipL: [60, 54], kneeL: [78, 55], footL: [92, 56],
      hipR: [60, 54], kneeR: [78, 57], footR: [92, 60],
    },
    b: {
      head: [20, 49], neck: [28, 51], hip: [60, 56],
      shoulderL: [28, 51], elbowL: [28, 65], handL: [26, 73],
      shoulderR: [28, 51], elbowR: [28, 65], handR: [30, 73],
      hipL: [60, 56], kneeL: [78, 57], footL: [92, 58],
      hipR: [60, 56], kneeR: [78, 59], footR: [92, 62],
    },
  },
  sideplank: {
    a: {
      head: [22, 42], neck: [30, 44], hip: [58, 48],
      shoulderL: [30, 44], elbowL: [30, 60], handL: [28, 68],
      shoulderR: [30, 44], elbowR: [30, 28], handR: [30, 14],
      hipL: [58, 48], kneeL: [76, 50], footL: [92, 50],
      hipR: [58, 50], kneeR: [76, 52], footR: [92, 53],
    },
    b: {
      head: [22, 40], neck: [30, 42], hip: [58, 45],
      shoulderL: [30, 42], elbowL: [30, 58], handL: [28, 66],
      shoulderR: [30, 42], elbowR: [30, 26], handR: [30, 12],
      hipL: [58, 45], kneeL: [76, 47], footL: [92, 47],
      hipR: [58, 47], kneeR: [76, 49], footR: [92, 50],
    },
  },
  pushup: {
    a: {
      head: [20, 44], neck: [28, 46], hip: [60, 50],
      shoulderL: [28, 46], elbowL: [30, 58], handL: [30, 70],
      shoulderR: [28, 46], elbowR: [26, 58], handR: [26, 70],
      hipL: [60, 50], kneeL: [78, 52], footL: [92, 53],
      hipR: [60, 50], kneeR: [78, 54], footR: [92, 56],
    },
    b: {
      head: [20, 58], neck: [28, 58], hip: [60, 60],
      shoulderL: [28, 58], elbowL: [24, 64], handL: [30, 70],
      shoulderR: [28, 58], elbowR: [22, 64], handR: [26, 70],
      hipL: [60, 60], kneeL: [78, 58], footL: [92, 56],
      hipR: [60, 60], kneeR: [78, 60], footR: [92, 59],
    },
  },
  row: {
    a: {
      head: [34, 34], neck: [38, 38], hip: [48, 55],
      shoulderL: [38, 38], elbowL: [38, 50], handL: [40, 60],
      shoulderR: [40, 40], elbowR: [46, 50], handR: [50, 64],
      hipL: [45, 55], kneeL: [42, 72], footL: [40, 90],
      hipR: [52, 55], kneeR: [56, 72], footR: [58, 90],
    },
    b: {
      head: [34, 34], neck: [38, 38], hip: [48, 55],
      shoulderL: [38, 38], elbowL: [38, 50], handL: [40, 60],
      shoulderR: [40, 40], elbowR: [52, 42], handR: [46, 40],
      hipL: [45, 55], kneeL: [42, 72], footL: [40, 90],
      hipR: [52, 55], kneeR: [56, 72], footR: [58, 90],
    },
  },
  lateralraise: {
    a: {
      head: [50, 16], neck: [50, 23], hip: [50, 50],
      shoulderL: [43, 25], elbowL: [40, 38], handL: [38, 50],
      shoulderR: [57, 25], elbowR: [60, 38], handR: [62, 50],
      hipL: [45, 50], kneeL: [44, 70], footL: [43, 90],
      hipR: [55, 50], kneeR: [56, 70], footR: [57, 90],
    },
    b: {
      head: [50, 16], neck: [50, 23], hip: [50, 50],
      shoulderL: [43, 25], elbowL: [28, 24], handL: [16, 24],
      shoulderR: [57, 25], elbowR: [72, 24], handR: [84, 24],
      hipL: [45, 50], kneeL: [44, 70], footL: [43, 90],
      hipR: [55, 50], kneeR: [56, 70], footR: [57, 90],
    },
  },
  crunch: {
    a: {
      head: [82, 60], neck: [74, 58], hip: [40, 60],
      shoulderL: [74, 58], elbowL: [78, 50], handL: [80, 44],
      shoulderR: [74, 58], elbowR: [78, 66], handR: [80, 72],
      hipL: [40, 60], kneeL: [26, 50], footL: [14, 58],
      hipR: [40, 62], kneeR: [26, 54], footR: [14, 62],
    },
    b: {
      head: [66, 44], neck: [62, 48], hip: [40, 60],
      shoulderL: [62, 48], elbowL: [68, 40], handL: [72, 34],
      shoulderR: [62, 48], elbowR: [68, 54], handR: [72, 58],
      hipL: [40, 60], kneeL: [26, 50], footL: [14, 58],
      hipR: [40, 62], kneeR: [26, 54], footR: [14, 62],
    },
  },
  legraise: {
    a: {
      head: [84, 58], neck: [76, 58], hip: [50, 60],
      shoulderL: [76, 58], elbowL: [80, 52], handL: [84, 48],
      shoulderR: [76, 58], elbowR: [80, 64], handR: [84, 68],
      hipL: [50, 60], kneeL: [30, 66], footL: [12, 70],
      hipR: [50, 62], kneeR: [30, 70], footR: [12, 74],
    },
    b: {
      head: [84, 58], neck: [76, 58], hip: [50, 60],
      shoulderL: [76, 58], elbowL: [80, 52], handL: [84, 48],
      shoulderR: [76, 58], elbowR: [80, 64], handR: [84, 68],
      hipL: [50, 60], kneeL: [46, 38], footL: [42, 16],
      hipR: [50, 62], kneeR: [48, 40], footR: [44, 18],
    },
  },
  shoulderpress: {
    a: {
      head: [50, 16], neck: [50, 23], hip: [50, 50],
      shoulderL: [43, 25], elbowL: [36, 28], handL: [34, 20],
      shoulderR: [57, 25], elbowR: [64, 28], handR: [66, 20],
      hipL: [45, 50], kneeL: [44, 70], footL: [43, 90],
      hipR: [55, 50], kneeR: [56, 70], footR: [57, 90],
    },
    b: {
      head: [50, 16], neck: [50, 23], hip: [50, 50],
      shoulderL: [43, 25], elbowL: [40, 12], handL: [38, 2],
      shoulderR: [57, 25], elbowR: [60, 12], handR: [62, 2],
      hipL: [45, 50], kneeL: [44, 70], footL: [43, 90],
      hipR: [55, 50], kneeR: [56, 70], footR: [57, 90],
    },
  },
  deadlift: {
    a: {
      head: [50, 16], neck: [50, 23], hip: [50, 50],
      shoulderL: [43, 25], elbowL: [40, 38], handL: [40, 50],
      shoulderR: [57, 25], elbowR: [60, 38], handR: [60, 50],
      hipL: [45, 50], kneeL: [44, 70], footL: [43, 90],
      hipR: [55, 50], kneeR: [56, 70], footR: [57, 90],
    },
    b: {
      head: [28, 38], neck: [34, 40], hip: [52, 48],
      shoulderL: [34, 40], elbowL: [32, 54], handL: [34, 68],
      shoulderR: [34, 40], elbowR: [36, 54], handR: [38, 68],
      hipL: [48, 48], kneeL: [46, 66], footL: [44, 88],
      hipR: [56, 48], kneeR: [58, 66], footR: [60, 88],
    },
  },
  burpee: {
    a: {
      head: [50, 12], neck: [50, 19], hip: [50, 46],
      shoulderL: [43, 21], elbowL: [38, 10], handL: [34, 2],
      shoulderR: [57, 21], elbowR: [62, 10], handR: [66, 2],
      hipL: [45, 46], kneeL: [44, 68], footL: [43, 90],
      hipR: [55, 46], kneeR: [56, 68], footR: [57, 90],
    },
    b: {
      head: [20, 46], neck: [28, 48], hip: [60, 52],
      shoulderL: [28, 48], elbowL: [28, 62], handL: [26, 70],
      shoulderR: [28, 48], elbowR: [28, 62], handR: [30, 70],
      hipL: [60, 52], kneeL: [78, 54], footL: [92, 55],
      hipR: [60, 52], kneeR: [78, 56], footR: [92, 58],
    },
  },
  mountainclimber: {
    a: {
      head: [20, 46], neck: [28, 48], hip: [58, 50],
      shoulderL: [28, 48], elbowL: [28, 62], handL: [26, 70],
      shoulderR: [28, 48], elbowR: [28, 62], handR: [30, 70],
      hipL: [58, 50], kneeL: [46, 64], footL: [36, 76],
      hipR: [58, 52], kneeR: [78, 54], footR: [94, 56],
    },
    b: {
      head: [20, 46], neck: [28, 48], hip: [58, 50],
      shoulderL: [28, 48], elbowL: [28, 62], handL: [26, 70],
      shoulderR: [28, 48], elbowR: [28, 62], handR: [30, 70],
      hipL: [58, 50], kneeL: [78, 52], footL: [94, 54],
      hipR: [58, 52], kneeR: [46, 66], footR: [36, 78],
    },
  },
  glutebridge: {
    a: {
      head: [84, 60], neck: [76, 60], hip: [52, 62],
      shoulderL: [76, 60], elbowL: [78, 66], handL: [80, 70],
      shoulderR: [76, 60], elbowR: [78, 54], handR: [80, 50],
      hipL: [52, 62], kneeL: [34, 54], footL: [20, 62],
      hipR: [52, 64], kneeR: [34, 58], footR: [20, 66],
    },
    b: {
      head: [84, 60], neck: [76, 60], hip: [56, 46],
      shoulderL: [76, 60], elbowL: [78, 66], handL: [80, 70],
      shoulderR: [76, 60], elbowR: [78, 54], handR: [80, 50],
      hipL: [56, 46], kneeL: [34, 50], footL: [20, 62],
      hipR: [56, 48], kneeR: [34, 54], footR: [20, 66],
    },
  },
  hipstretch: {
    a: {
      head: [48, 26], neck: [48, 32], hip: [48, 54],
      shoulderL: [42, 34], elbowL: [38, 44], handL: [38, 54],
      shoulderR: [54, 34], elbowR: [58, 44], handR: [58, 54],
      hipL: [44, 54], kneeL: [34, 66], footL: [28, 84],
      hipR: [52, 54], kneeR: [64, 72], footR: [74, 82],
    },
    b: {
      head: [46, 30], neck: [47, 36], hip: [48, 56],
      shoulderL: [41, 38], elbowL: [37, 46], handL: [37, 56],
      shoulderR: [53, 38], elbowR: [57, 46], handR: [57, 56],
      hipL: [44, 56], kneeL: [34, 66], footL: [28, 84],
      hipR: [52, 56], kneeR: [64, 72], footR: [74, 82],
    },
  },
};

const EXERCISE_LABELS = {
  walk: "Caminata",
  bike: "Bicicleta",
  squat: "Sentadilla",
  lunge: "Zancada",
  plank: "Plancha",
  sideplank: "Plancha lateral",
  pushup: "Flexión",
  row: "Remo",
  lateralraise: "Elevación lateral",
  crunch: "Crunch",
  legraise: "Elevación de piernas",
  shoulderpress: "Press de hombro",
  deadlift: "Peso muerto",
  burpee: "Burpee",
  mountainclimber: "Escalador",
  glutebridge: "Puente de glúteo",
  hipstretch: "Estiramiento de cadera",
};

function figurePoseMarkup(pose, opts) {
  const pt = (p) => `${p[0]},${p[1]}`;
  const line = (a, b, cls) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" class="${cls}"/>`;
  const poly = (a, b, c) => `<polyline points="${pt(a)} ${pt(b)} ${pt(c)}" class="fig-limb"/>`;
  const dumbbell = (p) =>
    opts.weights
      ? `<rect x="${p[0] - 4}" y="${p[1] - 2.5}" width="8" height="5" rx="1.5" class="fig-prop" transform="rotate(20 ${p[0]} ${p[1]})"/>`
      : "";

  return [
    line(pose.neck, pose.hip, "fig-torso"),
    poly(pose.shoulderL, pose.elbowL, pose.handL),
    poly(pose.shoulderR, pose.elbowR, pose.handR),
    poly(pose.hipL, pose.kneeL, pose.footL),
    poly(pose.hipR, pose.kneeR, pose.footR),
    dumbbell(pose.handL),
    dumbbell(pose.handR),
    `<circle cx="${pose.head[0]}" cy="${pose.head[1]}" r="7" class="fig-head"/>`,
  ].join("");
}

// No inventamos enlaces a un video puntual de YouTube (podría estar roto, privado
// o ni siquiera ser el correcto). En su lugar armamos una búsqueda de YouTube con
// el nombre real del ejercicio: siempre da resultados válidos y vigentes.
function exerciseVideoUrl(key, extraText) {
  const label = EXERCISE_LABELS[key] || "";
  const query = `${extraText || label} ejercicio técnica correcta`.trim();
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

// Devuelve el marcado SVG completo (con ambas posturas) para una clave de ejercicio.
function renderExerciseFigure(key, { weights = false, showGround = true } = {}) {
  const poses = POSES[key];
  if (!poses) return "";
  const ground = showGround ? `<line x1="6" y1="94" x2="94" y2="94" class="fig-ground"/>` : "";
  return `
    <svg viewBox="0 0 100 100" class="exercise-fig" role="img" aria-label="${EXERCISE_LABELS[key] || key}">
      ${ground}
      <g class="fig-pose-a">${figurePoseMarkup(poses.a, { weights })}</g>
      <g class="fig-pose-b">${figurePoseMarkup(poses.b, { weights })}</g>
    </svg>
  `;
}
