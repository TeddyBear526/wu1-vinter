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
};
/* justera hur snabbt snön faller */
const speed = 50;

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

  particles = particles.filter((particle) => !particle.toDelete);

  if (particles.length < 0.01) {
    spawnParticles(49000);
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
