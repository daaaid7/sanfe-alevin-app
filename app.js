const teams = [
  { name: "CLUB ATLETICO ARJONILLA", played: 3, won: 3, drawn: 0, lost: 0, points: 9, form: "GGG" },
  { name: "URGAVONA C.F.", played: 3, won: 2, drawn: 1, lost: 0, points: 7, form: "EGG" },
  { name: "VILLARGORDO C.F.", played: 3, won: 2, drawn: 1, lost: 0, points: 7, form: "GGE" },
  { name: "ASOC.DVA. LOPERA", played: 3, won: 2, drawn: 0, lost: 1, points: 6, form: "GPG" },
  { name: "C.D. JABALQUINTO", played: 2, won: 2, drawn: 0, lost: 0, points: 6, form: "GG" },
  { name: "C.D. UTICA", played: 3, won: 1, drawn: 1, lost: 1, points: 4, form: "EGP" },
  { name: 'SAN FELIPE U.D. C.D. "B"', short: "SF", played: 3, won: 1, drawn: 1, lost: 1, points: 4, form: "PGE", sanfe: true },
  { name: "C.D. ATLETICO MENGIBAR", played: 2, won: 1, drawn: 0, lost: 1, points: 3, form: "PG" },
  { name: "CLUB DEPORTIVO COLEGIO ALTOCASTILLO", played: 3, won: 1, drawn: 0, lost: 2, points: 3, form: "GPP" },
  { name: 'RECREATIVO DE BAILEN C.F. "B"', played: 3, won: 1, drawn: 0, lost: 2, points: 3, form: "PPG" },
  { name: "ATLETICO JAEN F.C.", played: 2, won: 0, drawn: 0, lost: 2, points: 0, form: "PP" },
  { name: 'CLUB DEPORTIVO JAEN 2021 "B"', played: 3, won: 0, drawn: 0, lost: 3, points: 0, form: "PPP" },
  { name: "CLUB DEPORTIVO ATLÉTICO BAILÉN 1808", played: 3, won: 0, drawn: 0, lost: 3, points: 0, form: "PPP" },
];

const results = [
  { date: "27 sep", opponent: "Villargordo C.F.", short: "VC", score: "1 — 1", status: "Empate", type: "draw" },
  { date: "18 sep", opponent: "Colegio Altocastillo", short: "CA", score: "2 — 1", status: "Victoria", type: "win" },
  { date: "11 sep", opponent: "Atlético Arjonilla", short: "AA", score: "0 — 10", status: "Derrota", type: "loss" },
];

function loadSaved(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

const players = loadSaved("sanfe.players", [
  { number: 1, name: "Diego Martín", role: "Portero", position: "Porteros", initials: "DM" },
  { number: 13, name: "Álvaro Cano", role: "Portero", position: "Porteros", initials: "AC" },
  { number: 2, name: "Sergio Lara", role: "Lateral derecho", position: "Defensas", initials: "SL" },
  { number: 4, name: "Pablo Moreno", role: "Defensa central", position: "Defensas", initials: "PM" },
  { number: 5, name: "Iván Torres", role: "Defensa central", position: "Defensas", initials: "IT" },
  { number: 3, name: "Hugo Vidal", role: "Lateral izquierdo", position: "Defensas", initials: "HV" },
  { number: 6, name: "Adrián Gil", role: "Mediocentro", position: "Centrocampistas", initials: "AG" },
  { number: 8, name: "Marcos Ruiz", role: "Centrocampista", position: "Centrocampistas", initials: "MR" },
  { number: 10, name: "Nico Vega", role: "Mediapunta", position: "Centrocampistas", initials: "NV" },
  { number: 7, name: "Leo Campos", role: "Extremo derecho", position: "Delanteros", initials: "LC" },
  { number: 9, name: "Javi Santos", role: "Delantero centro", position: "Delanteros", initials: "JS" },
  { number: 11, name: "Eric Molina", role: "Extremo izquierdo", position: "Delanteros", initials: "EM", injured: true },
]);

const attendanceRecords = loadSaved("sanfe.attendanceRecords", {});
const fixedCalendarEvents = loadSaved("sanfe.fixedCalendarEvents", {
  nextTraining: { title: "Entrenamiento de equipo", type: "Entrenamiento", date: "2026-09-30", venue: "Jaén - Jamarguillo", active: true },
  tacticsTraining: { title: "Entrenamiento · Táctica", type: "Entrenamiento", date: "2026-10-02", venue: "Jaén - Jamarguillo", active: true },
  nextMatch: { title: "San Felipe vs Urgavona C.F.", type: "Partido", date: "2026-10-03", time: "12:15", venue: "Jaén - Jamarguillo", active: true },
});
const trainingSchedule = fixedCalendarEvents.nextTraining;
let attendanceSession = trainingSchedule.date;
const attendanceSheetUrl = "https://docs.google.com/spreadsheets/d/17zKX5UQtnNfV9UsbxblF8dekFOkySxBz7SIU6rTXMxk/edit?usp=sharing";
const calendarEvents = loadSaved("sanfe.events", []);
const galleryPhotos = loadSaved("sanfe.gallery", []);

const navItems = [...document.querySelectorAll(".nav-link")];
const pageContent = document.querySelector("#page-content");
const breadcrumbCurrent = document.querySelector("#breadcrumb-current");
document.querySelector(".nav-count").textContent = players.length;
const modeSwitch = document.querySelector("#mode-switch");
const coachDialog = document.querySelector("#coach-dialog");
const coachForm = document.querySelector("#coach-form");
const editorDialog = document.querySelector("#editor-dialog");
const editorForm = document.querySelector("#editor-form");
const editorFields = document.querySelector("#editor-fields");
let coachMode = false;
let activeView = "clasificacion";
let rosterFilter = "Todos";
let selectedPlayerPhoto;
let calendarMonth = new Date(2026, 8, 1);

const icons = {
  calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
};

function pageHeading(title, subtitle, actions = "") {
  return `<div class="page-heading"><div><span class="eyebrow">CLUB DE FÚTBOL SANFE</span><h1>${title}</h1><p>${subtitle}</p></div>${actions ? `<div class="heading-actions">${actions}</div>` : ""}</div>`;
}

function formatEventDate(date, options = { weekday: "long", day: "numeric", month: "long" }) {
  const formatted = new Intl.DateTimeFormat("es-ES", options).format(new Date(`${date}T12:00:00`));
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function teamMark(short, sanfe = false) {
  return `<span class="team-mark${sanfe ? " team-mark-sanfe" : ""}">${short}</span>`;
}

function standingsTable() {
  return `<div class="table-wrap"><table class="standings-table"><thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>Pts</th><th>Forma</th></tr></thead><tbody>${teams.map((team, index) => `<tr class="${team.sanfe ? "is-sanfe" : ""}"><td class="position">${index + 1}</td><td><span class="team-cell">${teamMark(team.short || team.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2), team.sanfe)}${team.name}</span></td><td>${team.played}</td><td>${team.won}</td><td>${team.drawn}</td><td>${team.lost}</td><td class="points-cell">${team.points}</td><td><span class="form-list">${[...team.form].map((value) => `<span class="form-tag ${value === "G" ? "form-win" : value === "E" ? "form-draw" : "form-loss"}">${value}</span>`).join("")}</span></td></tr>`).join("")}</tbody></table></div>`;
}

function recentResults(limit = 3) {
  return `<div class="recent-list">${results.slice(0, limit).map((result, index) => `<div class="recent-row"><div class="recent-opponent"><span class="result-chip ${result.type === "draw" ? "draw" : result.type === "loss" ? "loss" : ""}"></span>${teamMark(result.short)}<span class="recent-meta"><strong>${result.opponent}</strong><small>${result.date} · Jornada ${3 - index}</small></span></div><strong class="recent-score">${result.score}</strong></div>`).join("")}</div>`;
}

function renderClasificacion() {
  const actions = '<span class="season-pill"><span></span> 4.ª Andaluza Alevín · Grupo 5</span>';
  pageContent.innerHTML = `${pageHeading("Clasificación", "San Felipe U.D. C.D. “B” · Temporada 2026–2027", actions)}<div class="stats-grid"><div class="stat-card"><span>Posición</span><strong>7.º</strong><small>Grupo 5 · jornada 3</small></div><div class="stat-card"><span>Puntos</span><strong>4</strong><small>en 3 partidos</small></div><div class="stat-card"><span>Victorias</span><strong>1</strong><small>1 empate · 1 derrota</small></div><div class="stat-card"><span>Próximo partido</span><strong>03 oct</strong><small>Urgavona C.F. · 12:15</small></div></div><div class="dashboard-grid" style="margin-top:16px"><div class="left-column"><section class="panel"><div class="panel-header"><h2>Grupo 5 · Jornada 3</h2><a href="https://www.rfaf.es/pnfg/NPcd/NFG_VisClasificacion?cod_primaria=1000120&amp;codgrupo=48466321&amp;codcompeticion=48466316" target="_blank" rel="noopener noreferrer">Tabla oficial RFAF ↗</a></div>${standingsTable()}<div class="source-note">Datos de la Real Federación Andaluza de Fútbol · 27 sep 2026</div></section><section class="panel activity-panel"><div class="panel-header"><h2>Lo que pasa en el club</h2><a href="#calendario" data-route="calendario">Ver calendario</a></div><div class="activity-item"><span class="activity-icon">${icons.calendar}</span><div><strong>Entrenamiento de hoy</strong><p>Campo Municipal San Fernando · <time>20:00 h</time></p></div></div><div class="activity-item"><span class="activity-icon">${icons.pin}</span><div><strong>Próximo partido: Urgavona C.F.</strong><p>Sábado, 3 de octubre · <time>12:15 h</time></p></div></div></section></div><div class="right-column"><section class="panel fixture-card"><div class="fixture-top"><span>${icons.calendar} PRÓXIMO PARTIDO</span><span class="matchday-badge">JORNADA 4</span></div><div class="fixture-match"><div class="fixture-team"><span class="fixture-crest home">SF</span><strong>San Felipe</strong></div><div class="fixture-vs">VS<small>SÁB · 12:15</small></div><div class="fixture-team"><span class="fixture-crest">UR</span><strong>Urgavona C.F.</strong></div></div><div class="fixture-bottom"><span>${icons.pin} Campo Municipal · San Fernando</span><strong>EN CASA</strong></div></section><section class="panel"><div class="panel-header"><h2>Últimos resultados</h2><a href="#resultados" data-route="resultados">Ver todos</a></div>${recentResults(3)}</section><a class="team-rfaf-link" href="https://www.rfaf.es/pnfg/NPcd/NFG_VisEquipos?cod_primaria=1000119&amp;Codigo_Equipo=786018" target="_blank" rel="noopener noreferrer">Ficha oficial de San Felipe en RFAF ↗</a></div></div>`;
}

function addEditorField(labelText, name, value, type = "text", options = []) {
  const label = document.createElement("label");
  label.className = "editor-field";
  label.textContent = labelText;
  let control;
  if (type === "select") {
    control = document.createElement("select");
    options.forEach((option) => control.add(new Option(option, option)));
  } else {
    control = document.createElement("input");
    control.type = type;
  }
  control.name = name;
  control.value = value ?? "";
  control.required = true;
  label.append(control);
  editorFields.append(label);
}

function addPlayerPhotoField(player) {
  const field = document.createElement("div");
  field.className = "photo-editor-field";
  const preview = document.createElement("img");
  preview.className = "photo-preview";
  preview.alt = `Foto de ${player.name || "jugador"}`;
  preview.hidden = !player.photo;
  if (player.photo) preview.src = player.photo;
  const placeholder = document.createElement("span");
  placeholder.className = "photo-placeholder";
  placeholder.textContent = player.initials || "SF";
  placeholder.hidden = Boolean(player.photo);
  const fileLabel = document.createElement("label");
  fileLabel.className = "photo-file-label";
  fileLabel.textContent = "Foto del jugador";
  const input = document.createElement("input");
  input.type = "file";
  input.name = "photoFile";
  input.accept = "image/*";
  input.setAttribute("aria-label", "Seleccionar foto del jugador");
  const clearButton = document.createElement("button");
  clearButton.className = "outline-button";
  clearButton.type = "button";
  clearButton.textContent = "Quitar foto";
  clearButton.hidden = !player.photo;
  input.addEventListener("change", async () => {
    const [file] = input.files;
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      input.setCustomValidity("Selecciona un archivo de imagen.");
      input.reportValidity();
      return;
    }
    input.setCustomValidity("");
    try {
      selectedPlayerPhoto = await compressPlayerPhoto(file);
      preview.src = selectedPlayerPhoto;
      preview.hidden = false;
      placeholder.hidden = true;
      clearButton.hidden = false;
    } catch {
      input.setCustomValidity("No se pudo cargar esa imagen.");
      input.reportValidity();
    }
  });
  clearButton.addEventListener("click", () => {
    selectedPlayerPhoto = null;
    preview.removeAttribute("src");
    preview.hidden = true;
    placeholder.hidden = false;
    clearButton.hidden = true;
    input.value = "";
  });
  const previewWrap = document.createElement("span");
  previewWrap.className = "photo-preview-wrap";
  previewWrap.append(preview, placeholder);
  const controls = document.createElement("span");
  controls.className = "photo-picker-controls";
  controls.append(fileLabel, input, clearButton);
  field.append(previewWrap, controls);
  editorFields.append(field);
}

async function compressPlayerPhoto(file, maxDimension = 512, quality = 0.82) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", quality);
}

function openEditor(type, index = null) {
  if (!coachMode) return;
  editorFields.replaceChildren();
  editorForm.dataset.type = type;
  editorForm.dataset.index = index === null ? "" : String(index);
  if (type === "player") {
    const player = index === null ? { number: 22, name: "", role: "", position: "Defensas", injured: false } : players[index];
    document.querySelector("#editor-title").textContent = index === null ? "Añadir jugador" : "Editar jugador";
    addEditorField("Dorsal", "number", player.number, "number");
    addEditorField("Nombre", "name", player.name);
    addEditorField("Posición", "position", player.position, "select", ["Porteros", "Defensas", "Centrocampistas", "Delanteros"]);
    addEditorField("Demarcación", "role", player.role);
    addEditorField("Disponibilidad", "availability", player.injured ? "En recuperación" : "Disponible", "select", ["Disponible", "En recuperación"]);
    addPlayerPhotoField(player);
    selectedPlayerPhoto = undefined;
  } else if (type === "fixed-event") {
    const fixedEvent = fixedCalendarEvents[index];
    document.querySelector("#editor-title").textContent = "Editar evento fijado";
    addEditorField("Nombre del evento", "title", fixedEvent.title);
    addEditorField("Fecha", "date", fixedEvent.date, "date");
    addEditorField("Lugar", "venue", fixedEvent.venue);
    if (fixedEvent.type === "Partido") addEditorField("Hora", "time", fixedEvent.time, "time");
  } else {
    const event = index === null ? { title: "", type: "Entrenamiento", date: trainingSchedule.date, location: trainingSchedule.venue } : calendarEvents[index];
    document.querySelector("#editor-title").textContent = index === null ? "Añadir evento" : "Editar evento";
    addEditorField("Nombre del evento", "title", event.title);
    addEditorField("Tipo", "type", event.type, "select", ["Entrenamiento", "Partido", "Otro"]);
    addEditorField("Fecha", "date", event.date, "date");
    addEditorField("Lugar", "location", event.location);
    const typeSelect = editorFields.querySelector('[name="type"]');
    const updateTimeField = () => {
      const timeField = editorFields.querySelector('[name="time"]')?.closest("label");
      if (typeSelect.value === "Entrenamiento") timeField?.remove();
      else if (!timeField) addEditorField("Hora", "time", event.time || "12:00", "time");
    };
    if (event.type !== "Entrenamiento") addEditorField("Hora", "time", event.time || "12:00", "time");
    typeSelect.addEventListener("change", updateTimeField);
  }
  editorDialog.showModal();
}

function renderPlantilla() {
  const filters = ["Todos", "Porteros", "Defensas", "Centrocampistas", "Delanteros"];
  const visiblePlayers = rosterFilter === "Todos" ? players : players.filter((player) => player.position === rosterFilter);
  const leagueGoals = results.reduce((total, result) => total + Number(result.score.split("—")[0]), 0);
  document.querySelector(".nav-count").textContent = players.length;
  const actions = coachMode ? '<button class="solid-button" data-action="add-player">+ Añadir jugador</button>' : "";
  pageContent.innerHTML = `${pageHeading("La plantilla", `${players.length} jugadores. Un mismo escudo.`, actions)}<div class="stats-grid roster-stats"><div class="stat-card"><span>Jugadores</span><strong>${players.length}</strong><small>equipo Alevín</small></div><div class="stat-card"><span>Goles esta temporada</span><strong>${leagueGoals}</strong><small>en ${results.length} partidos de liga</small></div><div class="stat-card"><span>Disponibles</span><strong>${players.filter((player) => !player.injured).length}</strong><small>${players.filter((player) => player.injured).length} en recuperación</small></div></div><div class="section-heading"><h2>Equipo Alevín</h2><span>Mostrando ${visiblePlayers.length} jugadores</span></div><div class="roster-filters">${filters.map((filter) => `<button class="filter-button ${rosterFilter === filter ? "is-active" : ""}" data-filter="${filter}" aria-pressed="${rosterFilter === filter}">${filter}</button>`).join("")}</div><div class="roster-grid" style="margin-top:13px">${visiblePlayers.map((player) => { const index = players.indexOf(player); const avatar = player.photo ? `<img class="player-avatar player-photo" src="${player.photo}" alt="Foto de ${player.name}" />` : `<span class="player-avatar">${player.initials}</span>`; return `<article class="player-card"><span class="player-status ${player.injured ? "injured" : ""}" title="${player.injured ? "En recuperación" : "Disponible"}"></span><div class="player-topline"><span>${player.position.toUpperCase()}</span><span class="player-number">${String(player.number).padStart(2, "0")}</span></div>${avatar}<h3>${player.name}</h3><p>${player.role}${player.injured ? " · En recuperación" : ""}</p>${coachMode ? `<div class="player-actions"><button type="button" data-action="edit-player" data-index="${index}">Editar</button><button type="button" data-action="remove-player" data-index="${index}">Quitar</button></div>` : ""}</article>`; }).join("")}</div>`;
}

function renderResultados() {
  const counts = results.reduce((summary, result) => {
    summary[result.type] += 1;
    return summary;
  }, { win: 0, draw: 0, loss: 0 });
  pageContent.innerHTML = `${pageHeading("Resultados", "Jornadas disputadas · 4.ª Andaluza Alevín, Grupo 5.", '<a class="outline-button" href="https://www.rfaf.es/pnfg/NPcd/NFG_VisClasificacion?cod_primaria=1000120&amp;codgrupo=48466321&amp;codcompeticion=48466316" target="_blank" rel="noopener noreferrer">Clasificación RFAF ↗</a>')}<div class="stats-grid"><div class="stat-card"><span>Partidos jugados</span><strong>${results.length}</strong><small>de 26 jornadas</small></div><div class="stat-card"><span>Victorias</span><strong>${counts.win}</strong><small>4 puntos sumados</small></div><div class="stat-card"><span>Empates</span><strong>${counts.draw}</strong><small>en la jornada 3</small></div><div class="stat-card"><span>Derrotas</span><strong>${counts.loss}</strong><small>temporada 2026 / 27</small></div></div><section class="panel section-panel"><div class="panel-header"><h2>Temporada 2026 / 27</h2><span class="season-pill"><span></span> Jornada 3 de 26</span></div><div class="results-list">${results.map((result, index) => `<div class="result-row"><span class="result-date">${result.date} · ${3 - index}ª jor.</span><span class="result-club">${teamMark("SF", true)} San Felipe <span class="result-dash">—</span> ${result.opponent} ${teamMark(result.short)}</span><strong class="result-score">${result.score}</strong><span class="result-status ${result.type === "draw" ? "draw" : result.type === "loss" ? "loss" : ""}">${result.status}</span></div>`).join("")}</div><div class="source-note">Resultados publicados por RFAF · jornada 3 (27 sep 2026)</div></section>`;
}

function renderGaleria() {
  const uploadControl = coachMode ? '<label class="solid-button gallery-upload"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m0 0L7 9m5-5 5 5M4 16v4h16v-4"/></svg>Subir fotos<input id="gallery-upload" type="file" accept="image/*" multiple /></label>' : "";
  pageContent.innerHTML = `${pageHeading("Galería", "Fotos del equipo Alevín.", uploadControl)}<div class="gallery-grid" id="gallery-grid"></div>`;
  const gallery = pageContent.querySelector("#gallery-grid");
  if (!galleryPhotos.length) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state gallery-empty";
    emptyState.textContent = "La galería está vacía";
    gallery.append(emptyState);
    return;
  }
  galleryPhotos.forEach((photo, index) => {
    const figure = document.createElement("figure");
    figure.className = "gallery-item";
    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = photo.caption || "Foto del equipo Sanfe";
    image.loading = "lazy";
    const caption = document.createElement("figcaption");
    const name = document.createElement("strong");
    name.textContent = photo.caption || "Sanfe";
    const date = document.createElement("time");
    date.textContent = photo.date;
    caption.append(name, date);
    if (coachMode) {
      const removeButton = document.createElement("button");
      removeButton.className = "gallery-remove";
      removeButton.type = "button";
      removeButton.dataset.action = "remove-photo";
      removeButton.dataset.photoIndex = String(index);
      removeButton.textContent = "Quitar";
      removeButton.setAttribute("aria-label", `Quitar foto ${photo.caption || "de Sanfe"}`);
      caption.append(removeButton);
    }
    figure.append(image, caption);
    gallery.append(figure);
  });
}

function renderCalendario() {
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const monthName = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(calendarMonth);
  const firstDay = new Date(year, month, 1).getDay();
  const mondayOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const previousDays = new Date(year, month, 0).getDate();
  const eventDays = {};
  [...Object.values(fixedCalendarEvents), ...calendarEvents].forEach((event) => {
    if (event.active === false) return;
    const eventDate = new Date(`${event.date}T12:00:00`);
    if (eventDate.getFullYear() === year && eventDate.getMonth() === month) eventDays[eventDate.getDate()] = event.type === "Partido" ? "match" : "training";
  });
  const cells = Array.from({ length: 42 }, (_, index) => {
    const day = index - mondayOffset + 1;
    const outsideMonth = day < 1 || day > daysInMonth;
    const number = day < 1 ? previousDays + day : day > daysInMonth ? day - daysInMonth : day;
    const event = outsideMonth ? "" : eventDays[day] || "";
    const today = !outsideMonth && day === 29 && month === 8 && year === 2026;
    return `<div class="calendar-day ${outsideMonth ? "muted" : ""} ${today ? "today" : ""} ${event ? `has-event ${event === "match" ? "has-match" : ""}` : ""}">${number}</div>`;
  });
  pageContent.innerHTML = `${pageHeading("Calendario", "Entrenamientos y partidos, todo en su sitio.", '<button class="solid-button" data-action="calendar-subscribe">+ Añadir evento</button>')}<section class="panel section-panel"><div class="panel-header"><h2>Agenda del equipo</h2><div class="calendar-toolbar"><button class="month-arrow" data-month="-1" aria-label="Mes anterior">${icons.arrowLeft}</button><strong>${monthName}</strong><button class="month-arrow" data-month="1" aria-label="Mes siguiente">${icons.arrowRight}</button></div></div><div class="calendar-grid">${["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => `<span class="calendar-weekday">${day}</span>`).join("")}${cells.join("")}</div><div class="calendar-legend"><span><i class="legend-dot"></i>Entrenamiento · 20:00 h</span><span><i class="legend-dot match"></i>Partido · 12:15 h</span></div></section><div class="section-heading"><h2>Próximos eventos</h2><span>Septiembre — octubre 2026</span></div><div class="dashboard-grid"><div class="left-column"><section class="panel"><div class="panel-header"><h2>Martes, 29 de septiembre</h2><span class="season-pill"><span></span> HOY</span></div><div class="recent-list"><div class="recent-row"><div class="recent-opponent"><span class="activity-icon">${icons.clock}</span><span class="recent-meta"><strong>Entrenamiento de equipo</strong><small>Campo Municipal San Fernando</small></span></div><strong class="recent-score">20:00</strong></div></div></section><section class="panel"><div class="panel-header"><h2>Viernes, 2 de octubre</h2><span class="season-pill">ENTRENAMIENTO</span></div><div class="recent-list"><div class="recent-row"><div class="recent-opponent"><span class="activity-icon">${icons.clock}</span><span class="recent-meta"><strong>Entrenamiento · Táctica</strong><small>Campo Municipal San Fernando</small></span></div><strong class="recent-score">20:00</strong></div></div></section></div><div class="right-column"><section class="panel"><div class="panel-header"><h2>Domingo, 4 de octubre</h2></div><div class="recent-list"><div class="recent-row"><div class="recent-opponent"><span class="fixture-crest home">SF</span><span class="recent-meta"><strong>Sanfe vs Atlético Sur</strong><small>Jornada 6 · En casa</small></span></div><strong class="recent-score">11:30</strong></div></div></section></div></div>`;
}

function updateCalendarTools() {
  const addButton = pageContent.querySelector('[data-action="calendar-subscribe"]');
  if (coachMode) {
    addButton.dataset.action = "add-event";
    addButton.textContent = "+ Añadir evento";
  } else {
    addButton.remove();
  }
  if (!calendarEvents.length) return;
  const heading = document.createElement("div");
  heading.className = "section-heading";
  heading.innerHTML = `<h2>Eventos añadidos por el equipo</h2><span>${calendarEvents.length} eventos</span>`;
  const panel = document.createElement("section");
  panel.className = "panel section-panel calendar-events";
  const list = document.createElement("div");
  list.className = "recent-list";
  calendarEvents.forEach((event, index) => {
    const row = document.createElement("div");
    row.className = "recent-row calendar-event-row";
    const details = document.createElement("div");
    details.className = "recent-opponent";
    const meta = document.createElement("span");
    meta.className = "recent-meta";
    const title = document.createElement("strong");
    title.textContent = event.title;
    const date = document.createElement("small");
    date.textContent = `${new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" }).format(new Date(`${event.date}T12:00:00`))} · ${event.type} · ${event.location}`;
    meta.append(title, date);
    details.append(meta);
    row.append(details);
    if (coachMode) {
      const actions = document.createElement("span");
      actions.className = "event-actions";
      actions.innerHTML = `<button type="button" data-action="edit-event" data-index="${index}">Editar</button><button type="button" data-action="remove-event" data-index="${index}">Quitar</button>`;
      row.append(actions);
    }
    const time = document.createElement("strong");
    time.className = "recent-score";
    time.textContent = event.type === "Entrenamiento" ? "" : event.time || "";
    time.hidden = event.type === "Entrenamiento" || !event.time;
    row.append(time);
    list.append(row);
  });
  panel.append(list);
  pageContent.append(heading, panel);
}

function renderAsistencia() {
  const sessionDate = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${attendanceSession}T12:00:00`));
  const actions = coachMode ? `<a class="outline-button" href="${attendanceSheetUrl}" target="_blank" rel="noopener noreferrer">Abrir hoja de datos ↗</a><button class="solid-button" data-action="download-attendance">Exportar CSV</button>` : "";
  const rows = players.map((player) => {
    const key = `${attendanceSession}:${player.number}`;
    const status = attendanceRecords[key] || "";
    const statusElement = `<span class="attendance-status ${status ? `status-${status.toLowerCase()}` : "status-empty"}">${status || "Sin pasar lista"}</span>`;
    const controls = coachMode ? `<div class="attendance-controls">${["Asiste", "Falta", "Justificado"].map((option) => `<button type="button" class="attendance-choice ${status === option ? "is-selected" : ""}" data-attendance="${player.number}" data-status="${option}" aria-pressed="${status === option}">${option}</button>`).join("")}</div>` : "";
    return `<div class="attendance-row"><div class="attendance-player"><span class="attendance-avatar">${player.initials}</span><span>${player.name}</span></div><span class="attendance-role">${player.role}</span>${statusElement}${controls}</div>`;
  }).join("");
  pageContent.innerHTML = `${pageHeading("Asistencia", "Registro del entrenamiento del equipo Alevín.", actions)}
    <section class="panel section-panel">
      <div class="panel-header"><h2>Entrenamiento · ${sessionDate}</h2><span class="season-pill"><span></span> ENTRENAMIENTO</span></div>
      <div class="attendance-top"><div class="attendance-session"><strong>${trainingSchedule.venue}</strong><span>${coachMode ? "Registro del equipo para esta sesión" : "Registro de asistencia de esta sesión"}</span></div></div>
      <div class="attendance-list">${rows}</div>
    </section>`;
}

function downloadAttendanceCSV() {
  const escapeCell = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const rows = [["Fecha", "Dorsal", "Jugador", "Estado"], ...players.map((player) => [attendanceSession, player.number, player.name, attendanceRecords[`${attendanceSession}:${player.number}`] || "Sin pasar lista"])];
  const csv = rows.map((row) => row.map(escapeCell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `sanfe-asistencia-${attendanceSession}.csv`;
  document.body.append(link);
  link.click();
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
    link.remove();
  }, 1000);
}

function updateCalendarFixture() {
  const matchCard = pageContent.querySelector(".right-column .panel");
  if (!matchCard) return;
  const event = fixedCalendarEvents.nextMatch;
  if (event.active === false) {
    matchCard.hidden = true;
    return;
  }
  matchCard.hidden = false;
  matchCard.querySelector(".panel-header h2").textContent = formatEventDate(event.date);
  matchCard.querySelector(".recent-meta strong").textContent = event.title;
  matchCard.querySelector(".recent-meta small").textContent = `Jornada 4 · Local, ${event.venue}`;
  const score = matchCard.querySelector(".recent-score");
  score.textContent = event.time || "";
  score.hidden = !event.time;
}

function updateFixedCalendarCards() {
  const leftPanels = pageContent.querySelectorAll(".left-column .panel");
  const fixedCards = [
    { id: "nextTraining", panel: leftPanels[0] },
    { id: "tacticsTraining", panel: leftPanels[1] },
    { id: "nextMatch", panel: pageContent.querySelector(".right-column .panel") },
  ];
  fixedCards.forEach(({ id, panel }) => {
    if (!panel) return;
    const event = fixedCalendarEvents[id];
    const header = panel.querySelector(".panel-header");
    header.querySelectorAll("[data-fixed-event]").forEach((button) => button.remove());
    header.classList.toggle("has-fixed-actions", coachMode && event.active !== false);
    if (event.active === false) {
      panel.hidden = true;
      return;
    }
    panel.hidden = false;
    const title = panel.querySelector(".recent-meta strong");
    const details = panel.querySelector(".recent-meta small");
    const score = panel.querySelector(".recent-score");
    if (header.querySelector("h2")) header.querySelector("h2").textContent = formatEventDate(event.date);
    if (title) title.textContent = event.title;
    if (details) details.textContent = event.venue;
    if (score) {
      const hasTime = event.type === "Partido" && event.time;
      score.textContent = hasTime ? event.time : "";
      score.hidden = !hasTime;
    }
    const badge = header.querySelector(".season-pill");
    if (badge) badge.textContent = id === "nextTraining" ? "PRÓXIMO" : event.type.toUpperCase();
    if (coachMode) {
      for (const [action, label] of [["edit-fixed-event", "Editar"], ["remove-fixed-event", "Quitar"]]) {
        const button = document.createElement("button");
        button.className = "fixed-event-edit";
        button.type = "button";
        button.dataset.action = action;
        button.dataset.fixedEvent = id;
        button.textContent = label;
        button.setAttribute("aria-label", `${label} ${event.title}`);
        header.append(button);
      }
    }
  });
}

function updateTrainingLabels() {
  const trainingActive = trainingSchedule.active !== false;
  const match = fixedCalendarEvents.nextMatch;
  const matchActive = match.active !== false;
  const dateLabel = trainingActive ? formatEventDate(trainingSchedule.date) : "Sin entrenamiento programado";
  const sidebarTraining = document.querySelector(".next-training");
  sidebarTraining.querySelector("strong").textContent = dateLabel;
  sidebarTraining.querySelector("small").textContent = trainingActive ? trainingSchedule.venue : "";
  sidebarTraining.querySelector(".live-dot").hidden = !trainingActive;

  if (activeView === "clasificacion") {
    const activity = pageContent.querySelectorAll(".activity-item")[0];
    if (activity) {
      activity.hidden = !trainingActive;
      activity.querySelector("strong").textContent = trainingSchedule.title;
      activity.querySelector("p").textContent = `${dateLabel} · ${trainingSchedule.venue}`;
    }
    const matchLocation = pageContent.querySelector(".fixture-card .fixture-bottom span");
    const matchActivity = pageContent.querySelectorAll(".activity-item")[1];
    if (matchActivity) matchActivity.hidden = !matchActive;
    if (matchLocation && matchActive) matchLocation.innerHTML = `${icons.pin} ${match.venue}`;
    if (matchActivity) {
      matchActivity.querySelector("strong").textContent = `Próximo partido: ${match.title}`;
      matchActivity.querySelector("p").textContent = `${formatEventDate(match.date)} · ${match.time}`;
    }
    const matchStat = pageContent.querySelector(".stats-grid .stat-card:last-child");
    if (matchStat) matchStat.hidden = !matchActive;
    if (matchStat) {
      matchStat.querySelector("strong").textContent = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" }).format(new Date(`${match.date}T12:00:00`));
      matchStat.querySelector("small").textContent = `${match.title.split(" vs ").at(-1)} · ${match.time}`;
    }
    const fixture = pageContent.querySelector(".fixture-card");
    if (fixture) fixture.hidden = !matchActive;
    const fixtureTeams = pageContent.querySelectorAll(".fixture-card .fixture-team strong");
    const [homeTeam, awayTeam] = match.title.split(" vs ");
    if (fixtureTeams[0]) fixtureTeams[0].textContent = homeTeam;
    if (fixtureTeams[1]) fixtureTeams[1].textContent = awayTeam || "";
    const fixtureTime = pageContent.querySelector(".fixture-card .fixture-vs small");
    if (fixtureTime) fixtureTime.textContent = `${new Intl.DateTimeFormat("es-ES", { weekday: "short" }).format(new Date(`${match.date}T12:00:00`)).toUpperCase()} · ${match.time}`;
  }

  if (activeView === "calendario") {
    const trainingLegend = pageContent.querySelector(".calendar-legend .legend-dot")?.parentElement;
    if (trainingLegend) trainingLegend.textContent = "Entrenamiento";
  }

  if (activeView === "asistencia") {
    const venue = pageContent.querySelector(".attendance-session strong");
    if (venue) venue.textContent = trainingActive ? trainingSchedule.venue : "Sin entrenamiento programado";
    const attendanceList = pageContent.querySelector(".attendance-list");
    if (attendanceList) attendanceList.hidden = !trainingActive;
    const heading = pageContent.querySelector(".section-panel .panel-header h2");
    if (heading) heading.textContent = trainingActive ? `Entrenamiento · ${formatEventDate(trainingSchedule.date)}` : "Asistencia";
    const label = pageContent.querySelector(".section-panel .panel-header .season-pill");
    if (label) label.hidden = !trainingActive;
  }
}

const renderers = { clasificacion: () => { renderClasificacion(); updateTrainingLabels(); }, plantilla: renderPlantilla, resultados: renderResultados, calendario: () => { renderCalendario(); updateCalendarFixture(); updateFixedCalendarCards(); updateCalendarTools(); updateTrainingLabels(); }, galeria: renderGaleria, asistencia: () => { renderAsistencia(); updateTrainingLabels(); } };
const viewNames = { clasificacion: "Clasificación", plantilla: "Plantilla", resultados: "Resultados", calendario: "Calendario", galeria: "Galería", asistencia: "Asistencia" };

function navigate(view) {
  if (!renderers[view]) return;
  activeView = view;
  navItems.forEach((item) => {
    const selected = item.dataset.view === view;
    item.classList.toggle("is-active", selected);
    if (selected) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });
  breadcrumbCurrent.textContent = viewNames[view];
  renderers[view]();
}

document.querySelector("#main-nav").addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]");
  if (button) navigate(button.dataset.view);
});

pageContent.addEventListener("click", (event) => {
  const route = event.target.closest("[data-route]");
  if (route) {
    event.preventDefault();
    navigate(route.dataset.route);
    return;
  }
  const filter = event.target.closest("[data-filter]");
  if (filter) {
    rosterFilter = filter.dataset.filter;
    renderPlantilla();
    return;
  }
  const monthButton = event.target.closest("[data-month]");
  if (monthButton) {
    calendarMonth.setMonth(calendarMonth.getMonth() + Number(monthButton.dataset.month));
    renderers.calendario();
    return;
  }
  const attendanceButton = event.target.closest("[data-attendance]");
  if (attendanceButton) {
    if (!coachMode) return;
    const playerNumber = Number(attendanceButton.dataset.attendance);
    attendanceRecords[`${attendanceSession}:${playerNumber}`] = attendanceButton.dataset.status;
    saveData("sanfe.attendanceRecords", attendanceRecords);
    renderers.asistencia();
    return;
  }
  const action = event.target.closest("[data-action]");
  if (!action) return;
  if (!coachMode) return;
  if (action.dataset.action === "download-attendance") {
    downloadAttendanceCSV();
    return;
  }
  if (action.dataset.action === "remove-photo") {
    const photoIndex = Number(action.dataset.photoIndex);
    if (window.confirm("¿Quitar esta foto de la galería?")) {
      galleryPhotos.splice(photoIndex, 1);
      saveData("sanfe.gallery", galleryPhotos);
      renderGaleria();
    }
    return;
  }
  if (action.dataset.action === "add-player") {
    openEditor("player");
    return;
  }
  if (action.dataset.action === "edit-player") {
    openEditor("player", Number(action.dataset.index));
    return;
  }
  if (action.dataset.action === "remove-player") {
    if (window.confirm("¿Quitar a este jugador de la plantilla?")) {
      players.splice(Number(action.dataset.index), 1);
      saveData("sanfe.players", players);
      renderPlantilla();
    }
    return;
  }
  if (action.dataset.action === "add-event") {
    openEditor("event");
    return;
  }
  if (action.dataset.action === "edit-fixed-event") {
    openEditor("fixed-event", action.dataset.fixedEvent);
    return;
  }
  if (action.dataset.action === "remove-fixed-event") {
    const fixedEvent = fixedCalendarEvents[action.dataset.fixedEvent];
    if (window.confirm(`¿Quitar “${fixedEvent.title}” del calendario?`)) {
      fixedEvent.active = false;
      saveData("sanfe.fixedCalendarEvents", fixedCalendarEvents);
      renderers.calendario();
    }
    return;
  }
  if (action.dataset.action === "edit-event") {
    openEditor("event", Number(action.dataset.index));
    return;
  }
  if (action.dataset.action === "remove-event") {
    calendarEvents.splice(Number(action.dataset.index), 1);
    saveData("sanfe.events", calendarEvents);
    renderers.calendario();
    return;
  }
});

pageContent.addEventListener("change", async (event) => {
  const input = event.target.closest("#gallery-upload");
  if (!input || !coachMode) return;
  const files = [...input.files].filter((file) => file.type.startsWith("image/"));
  if (!files.length) return;
  try {
    for (const file of files) {
      galleryPhotos.unshift({
        src: await compressPlayerPhoto(file, 1200, 0.76),
        caption: file.name.replace(/\.[^.]+$/, ""),
        date: new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric" }).format(new Date()),
      });
    }
    saveData("sanfe.gallery", galleryPhotos);
    renderGaleria();
  } catch {
    window.alert("No se pudieron cargar una o más fotos. Prueba con imágenes más pequeñas.");
  }
});

editorForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!coachMode) {
    editorDialog.close();
    return;
  }
  const values = Object.fromEntries(new FormData(editorForm));
  const index = editorForm.dataset.index === "" ? null : Number(editorForm.dataset.index);
  if (editorForm.dataset.type === "fixed-event") {
    const fixedEventId = editorForm.dataset.index;
    const fixedEvent = fixedCalendarEvents[fixedEventId];
    fixedEvent.title = values.title.trim();
    fixedEvent.date = values.date;
    fixedEvent.venue = values.venue.trim();
    if (fixedEvent.type === "Partido") fixedEvent.time = values.time;
    if (fixedEventId === "nextTraining") attendanceSession = fixedEvent.date;
    saveData("sanfe.fixedCalendarEvents", fixedCalendarEvents);
  } else if (editorForm.dataset.type === "player") {
    const photo = selectedPlayerPhoto !== undefined ? selectedPlayerPhoto : index === null ? "" : players[index].photo || "";
    const player = {
      number: Number(values.number),
      name: values.name.trim(),
      role: values.role.trim(),
      position: values.position,
      initials: values.name.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
      injured: values.availability === "En recuperación",
      photo,
    };
    if (index === null) players.push(player);
    else players[index] = player;
    saveData("sanfe.players", players);
  } else {
    const calendarEvent = { title: values.title.trim(), type: values.type, date: values.date, location: values.location.trim() };
    if (values.type !== "Entrenamiento") calendarEvent.time = values.time;
    if (index === null) calendarEvents.push(calendarEvent);
    else calendarEvents[index] = calendarEvent;
    saveData("sanfe.events", calendarEvents);
  }
  editorDialog.close();
  renderers[activeView]();
});

document.querySelector(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  navigate("clasificacion");
});

modeSwitch.addEventListener("click", () => {
  if (coachMode) {
    coachMode = false;
    modeSwitch.querySelector("span").textContent = "Modo padre / jugador";
    modeSwitch.setAttribute("aria-pressed", "false");
    renderers[activeView]();
    return;
  }
  document.querySelector("#coach-error").hidden = true;
  coachForm.reset();
  coachDialog.showModal();
  document.querySelector("#coach-code").focus();
});

document.querySelector("#coach-cancel").addEventListener("click", () => coachDialog.close());
document.querySelector("#editor-cancel").addEventListener("click", () => editorDialog.close());

coachForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (document.querySelector("#coach-code").value !== "4321") {
    document.querySelector("#coach-error").hidden = false;
    document.querySelector("#coach-code").select();
    return;
  }
  coachMode = true;
  modeSwitch.querySelector("span").textContent = "Modo entrenador";
  modeSwitch.setAttribute("aria-pressed", "true");
  coachDialog.close();
  renderers[activeView]();
});

navigate("clasificacion");