// Datos de la rutina semanal (ver rutina-diaria-ejercicio.md)
// Las claves usan el índice de Date#getDay(): 0=domingo ... 6=sábado
//
// Cada estación/calentamiento/enfriamiento tiene un "key" que apunta a una
// animación en exercises.js (ver POSES ahí) para mostrar cómo se hace.
const ROUTINE = {
  1: {
    day: "Lunes",
    title: "Cardio en caminadora + fuerza de piernas",
    focus: "Piernas",
    warmup: { text: "3 minutos caminata suave en caminadora", key: "walk" },
    stations: [
      { text: "Caminadora a ritmo rápido o trote suave", key: "walk" },
      { text: "Sentadillas con peso corporal", key: "squat" },
      { text: "Zancadas alternadas sin peso", key: "lunge" },
      { text: "Plancha abdominal", key: "plank" },
    ],
    cooldown: { text: "2 minutos caminata lenta y estiramiento de piernas", key: "walk" },
  },
  2: {
    day: "Martes",
    title: "Bicicleta estática + fuerza de tren superior",
    focus: "Tren superior",
    warmup: { text: "3 minutos bicicleta suave", key: "bike" },
    stations: [
      { text: "Bicicleta estática fuerte", key: "bike" },
      { text: "Flexiones de pecho (de rodillas si hace falta)", key: "pushup" },
      { text: "Remo con mancuerna, un brazo a la vez", key: "row", weights: true },
      { text: "Elevaciones laterales con mancuernas livianas", key: "lateralraise", weights: true },
    ],
    cooldown: { text: "2 minutos bicicleta suave y estiramiento de brazos y espalda", key: "bike" },
  },
  3: {
    day: "Miércoles",
    title: "Caminadora en intervalos + core",
    focus: "Core",
    warmup: { text: "3 minutos caminata suave", key: "walk" },
    stations: [
      { text: "Caminadora a máxima inclinación, ritmo moderado", key: "walk" },
      { text: "Abdominales tipo crunch", key: "crunch" },
      { text: "Elevación de piernas acostado", key: "legraise" },
      { text: "Plancha lateral, alternando lados cada 15 segundos", key: "sideplank" },
    ],
    cooldown: { text: "2 minutos caminata lenta y estiramiento de core", key: "walk" },
  },
  4: {
    day: "Jueves",
    title: "Bicicleta estática + fuerza de cuerpo completo con pesas",
    focus: "Cuerpo completo",
    warmup: { text: "3 minutos bicicleta suave", key: "bike" },
    stations: [
      { text: "Bicicleta fuerte", key: "bike" },
      { text: "Sentadilla con mancuernas", key: "squat", weights: true },
      { text: "Press de hombro con mancuernas", key: "shoulderpress", weights: true },
      { text: "Peso muerto con mancuernas, técnica controlada", key: "deadlift", weights: true },
    ],
    cooldown: { text: "2 minutos bicicleta suave y estiramiento general", key: "bike" },
  },
  5: {
    day: "Viernes",
    title: "Caminadora + circuito funcional sin máquina",
    focus: "Funcional",
    warmup: { text: "3 minutos caminata suave", key: "walk" },
    stations: [
      { text: "Caminadora, trote suave", key: "walk" },
      { text: "Burpees modificados (sin salto si las rodillas molestan)", key: "burpee" },
      { text: "Escaladores (mountain climbers)", key: "mountainclimber" },
      { text: "Puente de glúteo", key: "glutebridge" },
    ],
    cooldown: { text: "2 minutos caminata lenta y estiramiento", key: "walk" },
  },
  6: {
    day: "Sábado",
    title: "Bicicleta suave + movilidad y fuerza ligera",
    focus: "Movilidad",
    warmup: { text: "3 minutos bicicleta muy suave", key: "bike" },
    stations: [
      { text: "Bicicleta ritmo moderado", key: "bike" },
      { text: "Sentadilla sumo sin peso", key: "squat" },
      { text: "Remo con banda o mancuerna liviana", key: "row" },
      { text: "Estiramiento activo de cadera", key: "hipstretch" },
    ],
    cooldown: { text: "2 minutos bicicleta muy suave y estiramiento completo", key: "bike" },
  },
  0: {
    day: "Domingo",
    title: "Descanso activo",
    focus: "Recuperación",
    rest: true,
    restKey: "walk",
    description:
      "Caminata libre de 15 a 20 minutos a paso cómodo, o descanso total si el cuerpo lo pide. Este día es clave para la recuperación muscular.",
  },
};

const WARMUP_SECONDS = 3 * 60;
const CIRCUIT_SECONDS = 15 * 60;
const COOLDOWN_SECONDS = 2 * 60;
const STATION_SECONDS = 60;

const DEFAULT_GOAL = {
  startWeight: 96,
  targetLoss: 10,
};

// Construye la lista de fases de la sesión guiada para un día con circuito.
function buildSessionPhases(routine) {
  const phases = [];
  phases.push({
    type: "warmup",
    label: "Calentamiento",
    detail: routine.warmup.text,
    exerciseKey: routine.warmup.key,
    weights: false,
    duration: WARMUP_SECONDS,
  });

  let elapsed = 0;
  let round = 1;
  while (elapsed < CIRCUIT_SECONDS) {
    for (const station of routine.stations) {
      if (elapsed >= CIRCUIT_SECONDS) break;
      phases.push({
        type: "station",
        label: `Ronda ${round}`,
        detail: station.text,
        exerciseKey: station.key,
        weights: Boolean(station.weights),
        duration: STATION_SECONDS,
      });
      elapsed += STATION_SECONDS;
    }
    round += 1;
  }

  phases.push({
    type: "cooldown",
    label: "Enfriamiento",
    detail: routine.cooldown.text,
    exerciseKey: routine.cooldown.key,
    weights: false,
    duration: COOLDOWN_SECONDS,
  });

  return phases;
}
