// ---------- stats (niveau 1 tot 5, pas aan naar de waarheid) ----------
const stats = [
  { naam: "Python", niveau: 3 },
  { naam: "HTML", niveau: 2 },
  { naam: "CSS", niveau: 2 },
  { naam: "JavaScript", niveau: 2 },

];

const $ = (id) => document.getElementById(id);

$("stat-list").innerHTML = stats.map((s) => `
  <div class="stat"><span>${s.naam}</span>
  <div class="bar"><i data-w="${s.niveau * 20}"></i></div>
  <b>LVL ${s.niveau}</b></div>`).join("");

// balken vullen zodra ze in beeld komen
const io = new IntersectionObserver((items) => {
  items.forEach((it) => {
    if (it.isIntersecting) {
      it.target.style.width = it.target.dataset.w + "%";
      io.unobserve(it.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll(".bar i").forEach((b) => io.observe(b));

// ---------- lobby / contact ----------
const EMAIL = "thomas.roelandt@outlook.be";
let missie = "Vraag";

function bouw() {
  const naam = $("naam").value.trim();
  const bericht = $("bericht").value.trim();

  const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  $("logtxt").innerHTML =
    `<span class="k">[SYSTEEM]</span> lobby geopend\n` +
    `<span class="k">[SYSTEEM]</span> wachten op speler...\n` +
    `<span class="k">[SPELER]</span> ${esc(naam) || "..."}\n` +
    `<span class="k">[MISSIE]</span> ${esc(missie)}\n` +
    `<span class="k">[CHAT]</span> ${esc(bericht) || "..."}\n`;

  const subject = `Portfolio · ${missie}${naam ? " van " + naam : ""}`;
  const body = `Missie: ${missie}\nSpeler: ${naam || "-"}\n\n${bericht}\n`;
  $("gmail").href = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  $("mailapp").href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return `Aan: ${EMAIL}\nOnderwerp: ${subject}\n\n${body}`;
}

$("missions").addEventListener("click", (e) => {
  const m = e.target.closest(".mis");
  if (!m) return;
  document.querySelectorAll(".mis").forEach((x) => x.classList.remove("on"));
  m.classList.add("on");
  missie = m.dataset.v;
  bouw();
});
$("naam").addEventListener("input", bouw);
$("bericht").addEventListener("input", bouw);
$("form").addEventListener("submit", (e) => e.preventDefault());

$("kopieer").addEventListener("click", async () => {
  const label = $("kopieer").querySelector("span");
  try { await navigator.clipboard.writeText(bouw()); label.textContent = "Gekopieerd!"; }
  catch (err) { label.textContent = "Niet gelukt"; }
  setTimeout(() => (label.textContent = "Kopieer"), 1800);
});

bouw();
