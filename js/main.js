/* Om du vill ändra snöfärgen */
const spawnParticles = (amount) => {
  for (let i = 0; i < amount; i++) {
    const randColor = [
      randomInt(0, 256),
      randomInt(0, 256),
      randomInt(0, 256),
    ];
    particles.push(new Particle(randomInt(0, canvas.width), 0, randColor));
  }
  
    // Play a single ping for this spawn batch (use amount as intensity)
  if (allowSound) {
      playPing(amount);
  }
};

// Play a short ping (throttled). `intensity` scales pitch/volume.
const playPing = (intensity = 1) => {
  if (!allowSound) return;
  const now = performance.now();
  if (now - lastPingTime < PING_MIN_INTERVAL) return;
  lastPingTime = now;
  const ac = ensureAudioContext();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = 'sine';
  osc.frequency.value = 800 + Math.min(2000, intensity * 10);
  gain.gain.value = Math.min(0.5, 0.08 + Math.log1p(intensity) * 0.05);
  osc.connect(gain);
  gain.connect(ac.destination);
  const t = ac.currentTime;
  gain.gain.setValueAtTime(gain.gain.value, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  osc.start(t);
  osc.stop(t + 0.07);
};
/* justera hur snabbt snön faller */
const speed = 5;

/* Ändra här nedanför på egen risk */

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const canvas = document.createElement("canvas");
canvas.setAttribute("id", "bg");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");
const pi2 = 2 * Math.PI;

const bodyElement = document.querySelector("body");
bodyElement.appendChild(canvas);

let particles = [];

// Ask for sound permission
const allowSound = confirm("May we play sound?");

// Audio: reuse a single AudioContext and throttle pings to avoid overload
let audioContext = null;
let lastPingTime = 0;
const PING_MIN_INTERVAL = 80; // milliseconds

function ensureAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

window.onscroll = () => {
  canvas.setAttribute("style", `top: ${window.scrollY}px`);
};

const step = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.draw();
    particle.update();
  });

  const previousLength = particles.length;
  particles = particles.filter((particle) => !particle.toDelete);
  const deleted = previousLength - particles.length;

  // Spawn as many as were deleted each frame, or init if empty
  if (deleted > 0 || particles.length === 0) {
    spawnParticles(deleted > 0 ? deleted : 5000);
  }

  window.requestAnimationFrame(step);
};

window.requestAnimationFrame(step);

/* Ladda in text från URL-parametrar */
const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const title = params.get('title');
  const message = params.get('message');
  return { title, message };
};

const { title, message } = getQueryParams();
console.log(`Title: ${title}, Message: ${message}`);

if (title || message) {
  const titleElement = document.querySelector("#title");
  if (titleElement) titleElement.textContent = title;
  const messageElement = document.querySelector("#message");
  if (messageElement) messageElement.textContent = message;
}
