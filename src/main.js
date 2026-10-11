import {
  DREIMETADATEN_API_ENDPOINT,
  LOG_PREFIX,
  RECHECK_INTERVAL as RESYNC_INTERVAL,
} from "./config";

export const onAppInit = async () => {
  console.log(LOG_PREFIX, "App Init");

  window.folgen = await loadFolgen();

  selectRandomAndRender();

  const shuffle = window.document.getElementById("shuffle");
  shuffle.onclick = () => {
    selectRandomAndRender();
  };

  console.log(LOG_PREFIX, "Folgen Array =", folgen);
};

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(new URL("./sw.js", import.meta.url), { type: "module" })
    .then((reg) => console.log("SW aktiv, Scope:", reg.scope))
    .catch((err) => console.error("SW-Registrierung fehlgeschlagen", err));
}

navigator.storage?.persist?.();

export const selectRandomAndRender = () => {
  const random = Math.floor(Math.random() * window.folgen.length);
  const folge = window.folgen[random];

  const cover = window.document.getElementById("cover");
  const titel = window.document.getElementById("titel");
  const listen = window.document.getElementById("listen");

  titel.innerHTML = folge[1];
  nummer.innerHTML = folge[0];
  listen.setAttribute("href", `spotify:album:${folge[3]}`);
  cover.setAttribute("src", folge[2]);
};

const loadFolgen = async () => {
  const syncBarrier = new Date();
  syncBarrier.setDate(syncBarrier.getDate() - RESYNC_INTERVAL);

  const lastSynced = window.localStorage.getItem("ddfiy-last-synced");
  const shouldSync = lastSynced === null || lastSynced < syncBarrier;
  console.log(
    LOG_PREFIX,
    "Re-Sync Interval =",
    RESYNC_INTERVAL,
    "=> Sync Barrier =",
    syncBarrier,
    ", Last synced =",
    lastSynced,
  );
  console.log(LOG_PREFIX, "Should sync =", shouldSync);

  if (shouldSync && navigator.onLine) {
    return await loadData();
  } else {
    return JSON.parse(window.localStorage.getItem("ddfiy-folgen"));
  }
};

const loadData = async () => {
  const response = await fetch(DREIMETADATEN_API_ENDPOINT);
  console.log(LOG_PREFIX, "Sync Fetch URL =", DREIMETADATEN_API_ENDPOINT);
  console.log(LOG_PREFIX, "Sync Fetch Response =", response);

  if (response.status == 200) {
    const data = await response.json();

    if (data.rows.length) {
      window.localStorage.setItem("ddfiy-folgen", JSON.stringify(data.rows));
      window.localStorage.setItem("ddfiy-last-synced", new Date());
      showToast(`${data.rows.length} Folgen synchronisiert und gespeichert`);
      return data.rows;
    }
  }
};

const showToast = (message) => {};
