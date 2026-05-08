/* =========================
   💜 ELEMENTS
========================= */

const themeSelect = document.getElementById("theme-select");
const biasSelect = document.getElementById("bias-select");

const biasButton = document.getElementById("bias-mode");
const musicButton = document.getElementById("music-mode");
const eraButton = document.getElementById("era-mode");

const canvas = document.getElementById("particles");
const ctx = canvas?.getContext("2d");

const html = document.documentElement;
const body = document.body;

/* =========================
   💾 SAVED SETTINGS
========================= */

const DEFAULT_THEME = "jack-hope";
const DEFAULT_BIAS = "jhope";

let currentTheme =
  localStorage.getItem("theme") || DEFAULT_THEME;

let currentBias =
  localStorage.getItem("bias") || DEFAULT_BIAS;

html.setAttribute("data-theme", currentTheme);
body.dataset.bias = currentBias;

if (themeSelect) themeSelect.value = currentTheme;
if (biasSelect) biasSelect.value = currentBias;

/* =========================
   🏷 THEME LABEL
========================= */

function updateThemeLabel(theme) {
  const themeName =
    document.getElementById("theme-name");

  if (!themeName) return;

  const formattedTheme = theme
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );

  themeName.textContent = formattedTheme;
}

updateThemeLabel(currentTheme);

/* =========================
   🎛 THEME CONTROLS
========================= */

function setTheme(theme, saveTheme = true) {
  if (!theme || theme === currentTheme) return;

  currentTheme = theme;

  html.setAttribute("data-theme", theme);

  updateThemeLabel(theme);

  if (themeSelect) {
    themeSelect.value = theme;
  }

  if (saveTheme) {
    localStorage.setItem("theme", theme);
  }

  createParticles();
}

if (themeSelect) {
  themeSelect.addEventListener("change", () => {
    stopEraMode();
    setTheme(themeSelect.value);
  });
}

/* =========================
   💜 BIAS MODE
========================= */

if (biasButton) {
  biasButton.addEventListener("click", () => {
    body.classList.toggle("bias-mode");

    biasButton.textContent =
      body.classList.contains("bias-mode")
        ? "💜 Bias ON"
        : "💜 Bias";
  });
}

if (biasSelect) {
  biasSelect.addEventListener("change", () => {
    currentBias = biasSelect.value;

    body.dataset.bias = currentBias;

    localStorage.setItem("bias", currentBias);
  });
}

/* =========================
   🎧 MUSIC MODE
========================= */

if (musicButton) {
  musicButton.addEventListener("click", () => {
    body.classList.toggle("music-mode");

    musicButton.textContent =
      body.classList.contains("music-mode")
        ? "🎧 Music ON"
        : "🎧 Music";
  });
}

/* =========================
   🎬 BTS ERA MODE
========================= */

const eraThemes = [
  "arirang",
  "dark-wild",
  "hyyh",
  "wings",
  "love-yourself",
  "mots",
  "be",
  "proof",
];

let eraModeActive = false;
let currentEraIndex = 0;
let eraInterval = null;

function activateEraTheme() {
  const eraTheme = eraThemes[currentEraIndex];

  setTheme(eraTheme, false);

  currentEraIndex =
    (currentEraIndex + 1) % eraThemes.length;
}

function startEraMode() {
  if (eraModeActive) return;

  eraModeActive = true;

  body.classList.add("era-mode");

  if (eraButton) {
    eraButton.textContent = "🎬 Era ON";
  }

  currentEraIndex =
    eraThemes.indexOf(currentTheme);

  if (currentEraIndex === -1) {
    currentEraIndex = 0;
  }

  activateEraTheme();

  eraInterval = setInterval(() => {
    activateEraTheme();
  }, 5000);
}

function stopEraMode() {
  if (!eraModeActive) return;

  eraModeActive = false;

  clearInterval(eraInterval);
  eraInterval = null;

  body.classList.remove("era-mode");

  if (eraButton) {
    eraButton.textContent = "🎬 Era";
  }

  const savedTheme =
    localStorage.getItem("theme") || DEFAULT_THEME;

  setTheme(savedTheme, false);
}

if (eraButton) {
  eraButton.addEventListener("click", () => {
    eraModeActive
      ? stopEraMode()
      : startEraMode();
  });
}

/* =========================
   ✨ PARTICLE STATE
========================= */

let particles = [];
let sparkles = [];

const mouse = {
  x: null,
  y: null,
  radius: 180,
};

/* =========================
   🖱 MOUSE EVENTS
========================= */

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

window.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

window.addEventListener("click", (event) => {
  createSparkleBurst(
    event.clientX,
    event.clientY
  );
});

/* =========================
   🖼 CANVAS SETUP
========================= */

function resizeCanvas() {
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

/* =========================
   🎨 THEME COLORS
========================= */

function getThemeColors() {
  const styles = getComputedStyle(html);

  return {
    pink:
      styles.getPropertyValue("--pink").trim() ||
      "#ff4fd8",

    purple:
      styles.getPropertyValue("--purple").trim() ||
      "#6a0dad",

    mint:
      styles.getPropertyValue("--mint").trim() ||
      "#79ffe1",
  };
}

function getCurrentTheme() {
  return html.getAttribute("data-theme");
}

/* =========================
   ✨ PARTICLES
========================= */

function createParticles() {
  if (!canvas) return;

  particles = [];

  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,

      size: Math.random() * 14 + 16,

      speedX:
        (Math.random() - 0.5) * 0.4,

      speedY:
        (Math.random() - 0.5) * 0.4,

      rotation:
        Math.random() * Math.PI * 2,

      spin:
        (Math.random() - 0.5) * 0.01,
    });
  }
}

function createSparkleBurst(x, y) {
  for (let i = 0; i < 12; i++) {
    sparkles.push({
      x,
      y,

      size: Math.random() * 2 + 1,

      speedX:
        (Math.random() - 0.5) * 3,

      speedY:
        (Math.random() - 0.5) * 3,

      life: 1,
    });
  }
}

function reactToMouse(particle) {
  if (
    mouse.x === null ||
    mouse.y === null
  ) {
    return;
  }

  const dx = particle.x - mouse.x;
  const dy = particle.y - mouse.y;

  const distance =
    Math.sqrt(dx * dx + dy * dy);

  if (distance >= mouse.radius) return;

  const angle = Math.atan2(dy, dx);

  const force =
    (mouse.radius - distance) /
    mouse.radius;

  particle.x +=
    Math.cos(angle) * force * 6;

  particle.y +=
    Math.sin(angle) * force * 6;
}

/* =========================
   ✨ SPARKLES
========================= */

function getSparkleStyle() {
  const theme = getCurrentTheme();

  const styles = {
    size: 1,
    lineWidth: 1.8,
    glow: 18,
    alpha: 1,
    lifeLoss: 0.025,
  };

  if (theme === "golden") {
    styles.size = 1.5;
    styles.lineWidth = 2.4;
    styles.glow = 28;
    styles.alpha = 0.9;
    styles.lifeLoss = 0.018;
  }

  if (
    theme === "jack-box" ||
    theme === "jack-hope"
  ) {
    styles.size = 1.1;
    styles.lineWidth = 2.6;
    styles.glow = 16;
    styles.alpha = 1.1;
    styles.lifeLoss = 0.035;
  }

  if (theme === "mots") {
    styles.size = 1.4;
    styles.lineWidth = 2;
    styles.glow = 24;
    styles.alpha = 0.85;
    styles.lifeLoss = 0.02;
  }

  return styles;
}

function drawSparkle(sparkle, color) {
  const style = getSparkleStyle();

  const pop =
    1 + (1 - sparkle.life) * 0.6;

  const size =
    sparkle.size * style.size * pop;

  ctx.save();

  ctx.globalAlpha =
    sparkle.life * style.alpha;

  ctx.strokeStyle = color;
  ctx.lineWidth = style.lineWidth;

  ctx.shadowBlur = style.glow;
  ctx.shadowColor = color;

  ctx.beginPath();

  ctx.moveTo(
    sparkle.x - size,
    sparkle.y
  );

  ctx.lineTo(
    sparkle.x + size,
    sparkle.y
  );

  ctx.moveTo(
    sparkle.x,
    sparkle.y - size
  );

  ctx.lineTo(
    sparkle.x,
    sparkle.y + size
  );

  ctx.stroke();

  ctx.restore();
}

/* =========================
   💜 BTS LOGO
========================= */

function drawBtsLogo(
  x,
  y,
  size,
  color,
  rotation
) {
  ctx.save();

  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.strokeStyle = color;

  ctx.lineWidth = size * 0.08;

  ctx.shadowBlur = 10;
  ctx.shadowColor = color;

  ctx.beginPath();

  ctx.moveTo(
    -size * 0.35,
    -size * 0.45
  );

  ctx.lineTo(
    -size * 0.08,
    -size * 0.3
  );

  ctx.lineTo(
    -size * 0.08,
    size * 0.45
  );

  ctx.lineTo(
    -size * 0.35,
    size * 0.3
  );

  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();

  ctx.moveTo(
    size * 0.35,
    -size * 0.45
  );

  ctx.lineTo(
    size * 0.08,
    -size * 0.3
  );

  ctx.lineTo(
    size * 0.08,
    size * 0.45
  );

  ctx.lineTo(
    size * 0.35,
    size * 0.3
  );

  ctx.closePath();
  ctx.stroke();

  ctx.restore();
}

/* =========================
   🎬 ANIMATION LOOP
========================= */

function updateSparkles(colors) {
  const sparkleStyle =
    getSparkleStyle();

  sparkles.forEach(
    (sparkle, index) => {
      sparkle.life -=
        sparkleStyle.lifeLoss;

      sparkle.x += sparkle.speedX;
      sparkle.y += sparkle.speedY;

      const color =
        index % 3 === 0
          ? colors.pink
          : index % 3 === 1
            ? colors.purple
            : colors.mint;

      drawSparkle(sparkle, color);
    }
  );

  sparkles = sparkles.filter(
    (sparkle) => sparkle.life > 0
  );
}

function updateParticles(colors) {
  const speed =
    body.classList.contains(
      "music-mode"
    )
      ? 2
      : 1;

  particles.forEach(
    (particle, index) => {
      particle.x +=
        particle.speedX * speed;

      particle.y +=
        particle.speedY * speed;

      particle.rotation +=
        particle.spin * speed;

      reactToMouse(particle);

      if (particle.x < -80) {
        particle.x = canvas.width + 80;
      }

      if (
        particle.x >
        canvas.width + 80
      ) {
        particle.x = -80;
      }

      if (particle.y < -80) {
        particle.y = canvas.height + 80;
      }

      if (
        particle.y >
        canvas.height + 80
      ) {
        particle.y = -80;
      }

      const color =
        index % 3 === 0
          ? colors.pink
          : index % 3 === 1
            ? colors.purple
            : colors.mint;

      drawBtsLogo(
        particle.x,
        particle.y,
        particle.size,
        color,
        particle.rotation
      );
    }
  );
}

function drawParticles() {
  if (!canvas || !ctx) return;

  const colors = getThemeColors();

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  updateSparkles(colors);
  updateParticles(colors);

  requestAnimationFrame(drawParticles);
}

/* =========================
   🚀 START
========================= */

createParticles();
drawParticles();