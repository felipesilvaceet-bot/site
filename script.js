/* ============================================================
   SUAS FOTOS: coloque os arquivos na pasta "img/" e ajuste a lista.
   s = caminho da foto | t = título | c = categoria | r = formato
   r: "tall" (vertical), "wide" (horizontal) ou "square" (quadrada)
   Enquanto o arquivo não existir, aparece um bloco colorido no lugar.
   Categorias: evento (aniversários e festas) e esporte
   ============================================================ */
const photos = [
  { s: "img/evento-01.jpg",  t: "Brincando na piscina",  c: "evento",  r: "tall"   },
  { s: "img/esporte-01.jpg", t: "Falta",          c: "esporte", r: "wide"   },
  { s: "img/evento-02.jpg",  t: "Pula-Pula",  c: "evento",  r: "square" },
  { s: "img/esporte-02.jpg", t: "Lance decisivo",     c: "esporte", r: "tall"   },
  { s: "img/esporte-03.jpg", t: "Defesa",   c: "esporte", r: "square" },
  { s: "img/evento-03.jpg",  t: "Balão com idade", c: "evento",  r: "wide"   },
  { s: "img/esporte-04.jpg", t: "Arbitragem", c: "esporte", r: "wide"   },
  { s: "img/evento-04.jpg",  t: "Festa fumaça",     c: "evento",  r: "tall"   },
  { s: "img/esporte-05.jpg", t: "Tiro de escanteio",    c: "esporte", r: "tall"   },
  { s: "img/esporte-06.jpg", t: "Fitdance",        c: "esporte", r: "wide"   }
];

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lbMedia = document.getElementById("lb-media");
const lbCap = document.getElementById("lb-cap");
let visible = [], current = 0;

/* bloco de substituição quando a foto ainda não existe */
function placeholder(p, i) {
  const el = document.createElement("div");
  const hue = (i * 47 + 20) % 360;
  el.className = "ph " + p.r;
  el.style.background = `linear-gradient(145deg, hsl(${hue} 32% 24%), hsl(${(hue + 40) % 360} 40% 10%))`;
  el.textContent = p.t;
  return el;
}
function media(p, i) {
  const img = new Image();
  img.src = p.s; img.alt = p.t; img.loading = "lazy";
  img.onerror = () => img.replaceWith(placeholder(p, i));
  return img;
}

function render(filter = "todos") {
  gallery.innerHTML = "";
  visible = photos.map((p, i) => ({ ...p, i })).filter(p => filter === "todos" || p.c === filter);
  visible.forEach((p, n) => {
    const fig = document.createElement("figure");
    fig.className = "photo";
    fig.style.animationDelay = n * 40 + "ms";
    fig.tabIndex = 0;
    fig.setAttribute("role", "button");
    fig.setAttribute("aria-label", "Ampliar: " + p.t);
    fig.append(media(p, p.i));
    const cap = document.createElement("figcaption");
    cap.textContent = p.t;
    fig.append(cap);
    fig.addEventListener("click", () => open(n));
    fig.addEventListener("keydown", e => { if (e.key === "Enter") open(n); });
    gallery.append(fig);
  });
}

document.querySelectorAll(".chip").forEach(btn =>
  btn.addEventListener("click", () => {
    document.querySelector(".chip.active").classList.remove("active");
    btn.classList.add("active");
    render(btn.dataset.filter);
  })
);

/* lightbox */
function show() {
  const p = visible[current];
  lbMedia.innerHTML = "";
  lbMedia.append(media(p, p.i));
  lbCap.textContent = p.t;
}
function open(n) { current = n; show(); lightbox.hidden = false; document.body.style.overflow = "hidden"; }
function close() { lightbox.hidden = true; document.body.style.overflow = ""; }
function step(d) { current = (current + d + visible.length) % visible.length; show(); }

lightbox.querySelector(".lb-close").onclick = close;
lightbox.querySelector(".prev").onclick = () => step(-1);
lightbox.querySelector(".next").onclick = () => step(1);
lightbox.addEventListener("click", e => { if (e.target === lightbox) close(); });
document.addEventListener("keydown", e => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") close();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

/* menu mobile */
const burger = document.querySelector(".burger"), menu = document.getElementById("menu");
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  menu.classList.remove("open"); burger.setAttribute("aria-expanded", false);
}));

/* animação de entrada ao rolar */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();
render();
