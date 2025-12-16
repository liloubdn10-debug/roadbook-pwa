// 1) Charger le contenu du roadbook
fetch("data/roadbook.json")
  .then(res => res.json())
  .then(data => {
    document.getElementById("title").innerText = data.title ?? "Roadbook";
    document.getElementById("subtitle").innerText = data.subtitle ?? "";

    const container = document.getElementById("days");
    container.innerHTML = "";

    data.days.forEach(d => {
      const div = document.createElement("section");
      div.className = "day";

      const checklistHtml = (d.checklist ?? [])
        .map(item => `<li>${escapeHtml(item)}</li>`)
        .join("");

      div.innerHTML = `
        <h2>${escapeHtml(d.day)} — ${escapeHtml(d.title)}</h2>
        <p>${escapeHtml(d.description ?? "")}</p>

        <div class="actions">
          ${d.map ? `<a class="btn" href="${d.map}" target="_blank" rel="noopener">📍 Ouvrir la carte</a>` : ""}
        </div>

        ${checklistHtml ? `<strong>Checklist</strong><ul>${checklistHtml}</ul>` : ""}
      `;

      container.appendChild(div);
    });
  })
  .catch(err => {
    document.getElementById("days").innerHTML =
      `<p>Erreur de chargement du roadbook.json. Vérifie le chemin /data/roadbook.json</p>`;
    console.error(err);
  });

// 2) Activer l'offline via Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}

// Petit helper pour éviter d'injecter du HTML non voulu
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}