// Datos de la rutina semanal (ver rutina-diaria-ejercicio.md)
// Las claves usan el índice de Date#getDay(): 0=domingo ... 6=sábado
const ROUTINE = {
  1: {
    day: "Lunes",
    title: "Cardio en caminadora + fuerza de piernas",
    focus: "Piernas",
    warmup: "3 minutos caminata suave en caminadora",
    stations: [
      "Caminadora a ritmo rápido o trote suave",
      "Sentadillas con peso corporal",
      "Zancadas alternadas sin peso",
      "Plancha abdominal",
    ],
    cooldown: "2 minutos caminata lenta y estiramiento de piernas",
  },
  2: {
    day: "Martes",
    title: "Bicicleta estática + fuerza de tren superior",
    focus: "Tren superior",
    warmup: "3 minutos bicicleta suave",
    stations: [
      "Bicicleta estática fuerte",
      "Flexiones de pecho (de rodillas si hace falta)",
      "Remo con mancuerna, un brazo a la vez",
      "Elevaciones laterales con mancuernas livianas",
    ],
    cooldown: "2 minutos bicicleta suave y estiramiento de brazos y espalda",
  },
  3: {
    day: "Miércoles",
    title: "Caminadora en intervalos + core",
    focus: "Core",
    warmup: "3 minutos caminata suave",
    stations: [
      "Caminadora a máxima inclinación, ritmo moderado",
      "Abdominales tipo crunch",
      "Elevación de piernas acostado",
      "Plancha lateral, alternando lados cada 15 segundos",
    ],
    cooldown: "2 minutos caminata lenta y estiramiento de core",
  },
  4: {
    day: "Jueves",
    title: "Bicicleta estática + fuerza de cuerpo completo con pesas",
    focus: "Cuerpo completo",
    warmup: "3 minutos bicicleta suave",
    stations: [
      "Bicicleta fuerte",
      "Sentadilla con mancuernas",
      "Press de hombro con mancuernas",
      "Peso muerto con mancuernas, técnica controlada",
    ],
    cooldown: "2 minutos bicicleta suave y estiramiento general",
  },
  5: {
    day: "Viernes",
    title: "Caminadora + circuito funcional sin máquina",
    focus: "Funcional",
    warmup: "3 minutos caminata suave",
    stations: [
      "Caminadora, trote suave",
      "Burpees modificados (sin salto si las rodillas molestan)",
      "Escaladores (mountain climbers)",
      "Puente de glúteo",
    ],
    cooldown: "2 minutos caminata lenta y estiramiento",
  },
  6: {
    day: "Sábado",
    title: "Bicicleta suave + movilidad y fuerza ligera",
    focus: "Movilidad",
    warmup: "3 minutos bicicleta muy suave",
    stations: [
      "Bicicleta ritmo moderado",
      "Sentadilla sumo sin peso",
      "Remo con banda o mancuerna liviana",
      "Estiramiento activo de cadera",
    ],
    cooldown: "2 minutos bicicleta muy suave y estiramiento completo",
  },
  0: {
    day: "Domingo",
    title: "Descanso activo",
    focus: "Recuperación",
    rest: true,
    description:
      "Caminata libre de 15 a 20 minutos a paso cómodo, o descanso total si el cuerpo lo pide. Este día es clave para la recuperación muscular.",
  },
};

const WARMUP_SECONDS = 3 * 60;
const CIRCUIT_SECONDS = 15 * 60;
const COOLDOWN_SECONDS = 2 * 60;
const STATION_SECONDS = 60;

const GOAL = {
  startWeight: 96,
  targetLoss: 10,
  get targetWeight() {
    return this.startWeight - this.targetLoss;
  },
};

// Construye la lista de fases de la sesión guiada para un día con circuito.
function buildSessionPhases(routine) {
  const phases = [];
  phases.push({
    type: "warmup",
    label: "Calentamiento",
    detail: routine.warmup,
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
        detail: station,
        duration: STATION_SECONDS,
      });
      elapsed += STATION_SECONDS;
    }
    round += 1;
  }

  phases.push({
    type: "cooldown",
    label: "Enfriamiento",
    detail: routine.cooldown,
    duration: COOLDOWN_SECONDS,
  });

  return phases;
}
