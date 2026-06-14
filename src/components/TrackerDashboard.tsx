"use client";

import { useState, useEffect, useRef } from "react";
import { Checkbox, Switch, Button, ProgressBar, Badge } from "@rgds/react";
import { heartPieces, poeSouls, goldenBugs, Collectible } from "@/data/collectiblesData";
import { itemsData } from "@/data/itemsData";
import { mirrorDirections } from "@/utils/directions";

type TabType = "inventory" | "hearth" | "souls" | "bugs" | "zones";
type ThemeType = "dark" | "light" | "system";

interface InitialState {
  selectedGame: string;
  checkedItems: string[];
  checkedCollectibles: string[];
  checkedRegions: string[];
}

interface TrackerDashboardProps {
  initialState: InitialState;
  userId: string;
}

// Translations dictionary for French & English
const translations = {
  fr: {
    title: "RG-GT (Game Track)",
    gameVersion: "Version du Jeu",
    unlockedRegions: "Provinces Débloquées",
    inventory: "Inventaire Avancé",
    resetBtn: "Effacer la collecte",
    resetConfirm: "Voulez-vous vraiment réinitialiser toute votre progression de collecte ?",
    saving: "Sauvegarde...",
    synced: "Données synchronisées",
    provinceFilterLabel: "Filtrer par province",
    allProvinces: "Toutes les contrées",
    availableOnly: "Disponibles uniquement",
    hideCompleted: "Masquer les complétés",
    obtainable: "Disponible",
    completed: "Complété",
    locked: "Verrouillé",
    requirements: "Conditions requises :",
    missingImage: "Image manquante",
    statsHearts: "Fragments de Cœur",
    statsPoes: "Âmes de Spectre",
    statsBugs: "Insectes Dorés",
    overview: "Vue d'ensemble",
    details: "Détails",
    emptyList: "Aucun élément disponible",
    confirmTitle: "Réinitialiser la progression",
    cancel: "Annuler",
    confirm: "Confirmer",
    userIdLabel: "ID Utilisateur",
    congratsTitle: "Félicitations !",
    congratsMessage: "Vous avez complété à 100% la catégorie :",
    close: "Fermer",
    systemTheme: "Système",
    provinces: {
      ordon: "Ordona / Toal",
      faron: "Firone",
      eldin: "Ordinn",
      lanayru: "Lanelle",
      desert: "Désert Gerudo",
      snowpeak: "Pics Blancs",
      sky: "Célestia",
      twilight: "Palais du Crépuscule",
      all: "Toutes les contrées"
    },
    versionNames: {
      "tp-hd-normal": "TP HD (Mode Normal)",
      "tp-gcn": "TP (GameCube - GC)",
      "tp-hd-hero": "TP HD (Mode Héroïque - Miroir)",
      "tp-wii": "TP (Wii - Miroir)"
    },
    itemCategories: {
      active: "Objets Actifs",
      bombs: "Bombes",
      gear: "Équipement",
      quest: "Progression"
    }
  },
  en: {
    title: "RG-GT (Game Track)",
    gameVersion: "Game Version",
    unlockedRegions: "Unlocked Provinces",
    inventory: "Advanced Inventory",
    resetBtn: "Reset progress",
    resetConfirm: "Are you sure you want to reset all your collectible progress?",
    saving: "Saving...",
    synced: "Data synced",
    provinceFilterLabel: "Filter by province",
    allProvinces: "All Provinces",
    availableOnly: "Obtainable only",
    hideCompleted: "Hide completed",
    obtainable: "Obtainable",
    completed: "Completed",
    locked: "Locked",
    requirements: "Required conditions:",
    missingImage: "Missing image",
    statsHearts: "Heart Pieces",
    statsPoes: "Poe Souls",
    statsBugs: "Golden Bugs",
    overview: "Overview",
    details: "Details",
    emptyList: "No items available",
    confirmTitle: "Reset Progress",
    cancel: "Cancel",
    confirm: "Confirm",
    userIdLabel: "User ID",
    congratsTitle: "Congratulations!",
    congratsMessage: "You have completed 100% of the category:",
    close: "Close",
    systemTheme: "System",
    provinces: {
      ordon: "Ordon",
      faron: "Faron",
      eldin: "Eldin",
      lanayru: "Lanayru",
      desert: "Gerudo Desert",
      snowpeak: "Snowpeak",
      sky: "City in the Sky",
      twilight: "Palace of Twilight",
      all: "All Provinces"
    },
    versionNames: {
      "tp-hd-normal": "TP HD (Normal Mode)",
      "tp-gcn": "TP (GameCube - GC)",
      "tp-hd-hero": "TP HD (Hero Mode - Mirrored)",
      "tp-wii": "TP (Wii - Mirrored)"
    },
    itemCategories: {
      active: "Active Items",
      bombs: "Bombs",
      gear: "Gear",
      quest: "Quest Progress"
    }
  }
};

const regionsList = [
  { key: "ordon", labelFr: "Ordona / Toal", labelEn: "Ordon" },
  { key: "faron", labelFr: "Firone", labelEn: "Faron" },
  { key: "eldin", labelFr: "Ordinn", labelEn: "Eldin" },
  { key: "lanayru", labelFr: "Lanelle", labelEn: "Lanayru" },
  { key: "desert", labelFr: "Désert Gerudo", labelEn: "Gerudo Desert" },
  { key: "snowpeak", labelFr: "Pics Blancs", labelEn: "Snowpeak" },
  { key: "sky", labelFr: "Célestia", labelEn: "City in the Sky" },
  { key: "twilight", labelFr: "Palais du Crépuscule", labelEn: "Palace of Twilight" }
];

const getProvinceKey = (location: string): string => {
  const loc = location.toLowerCase();
  if (loc.includes("ordon")) return "ordon";
  if (loc.includes("faron") || loc.includes("forest temple") || loc.includes("sacred grove") || loc.includes("temple of time")) return "faron";
  if (loc.includes("kakariko") || loc.includes("death mountain") || loc.includes("goron mines") || loc.includes("eldin") || loc.includes("hidden village")) return "eldin";
  if (loc.includes("castle town") || loc.includes("hylia") || loc.includes("hena") || loc.includes("zora") || loc.includes("riches")) return "lanayru";
  if (loc.includes("desert") || loc.includes("mesa") || loc.includes("bulblin") || loc.includes("arbiter") || loc.includes("ordeals")) return "desert";
  if (loc.includes("snowpeak")) return "snowpeak";
  if (loc.includes("twilight")) return "twilight";
  if (loc.includes("sky")) return "sky";
  return "lanayru"; // fallback
};

// Inline SVG components instead of emojis for professional UI
const InventoryIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: "16px", height: "16px", flexShrink: 0 }}>
    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
  </svg>
);

const HeartIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: "16px", height: "16px", flexShrink: 0 }}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const GhostIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: "16px", height: "16px", flexShrink: 0 }}>
    <path d="M12 2A10 10 0 0 0 2 12v9a1 1 0 0 0 1.7.7l2.8-2.8 3.5 3.5a1 1 0 0 0 1.4 0l2.6-2.6 2.6 2.6a1 1 0 0 0 1.4 0l3.5-3.5 2.8 2.8a1 1 0 0 0 1.7-.7v-9A10 10 0 0 0 12 2zm3 9a2 2 0 1 1 2-2 2 2 0 0 1-2 2zm-6 0a2 2 0 1 1 2-2 2 2 0 0 1-2 2z"/>
  </svg>
);

const BugIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: "16px", height: "16px", flexShrink: 0 }}>
    <path d="M19 8h-3V7a4 4 0 0 0-8 0v1H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h3v1a4 4 0 0 0 8 0v-1h3a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zM9 7a2 2 0 0 1 4 0v1H9zm8 5H7v-2h10z"/>
  </svg>
);

const MapIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: "16px", height: "16px", flexShrink: 0 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

export default function TrackerDashboard({ initialState, userId }: TrackerDashboardProps) {
  const [selectedGame, setSelectedGame] = useState<string>(initialState.selectedGame);
  const [checkedItems, setCheckedItems] = useState<string[]>(initialState.checkedItems);
  const [checkedCollectibles, setCheckedCollectibles] = useState<string[]>(initialState.checkedCollectibles);
  const [checkedRegions, setCheckedRegions] = useState<string[]>(initialState.checkedRegions);
  const [activeTab, setActiveTab] = useState<TabType>("inventory");
  const [showOnlyObtainable, setShowOnlyObtainable] = useState<boolean>(false);
  const [hideCompleted, setHideCompleted] = useState<boolean>(false);
  const [selectedProvince, setSelectedProvince] = useState<string>("All");
  const [theme, setTheme] = useState<ThemeType>("system");
  const [lang, setLang] = useState<"fr" | "en">("fr");

  // Dialog and celebration states
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [celebratedCategory, setCelebratedCategory] = useState<string>("");
  const [confettiParticles, setConfettiParticles] = useState<{ id: number; left: string; color: string; delay: string; size: string }[]>([]);

  // Completion checking helper
  const [completedCategories, setCompletedCategories] = useState<{ hearts: boolean; poes: boolean; bugs: boolean; all: boolean }>({
    hearts: false,
    poes: false,
    bugs: false,
    all: false
  });
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Debounce ref to avoid blocking UI and flooding Neon connections
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Optimistic/Debounced Save helper
  const debouncedSave = (
    updatedGame: string,
    updatedItems: string[],
    updatedCollectibles: string[],
    updatedRegions: string[]
  ) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await fetch("/api/state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selectedGame: updatedGame,
            checkedItems: updatedItems,
            checkedCollectibles: updatedCollectibles,
            checkedRegions: updatedRegions,
          }),
        });
      } catch (err) {
        console.error("Error saving state:", err);
      }
    }, 800);
  };

  // Sync state if initial state props change
  useEffect(() => {
    setSelectedGame(initialState.selectedGame);
    setCheckedItems(initialState.checkedItems);
    setCheckedCollectibles(initialState.checkedCollectibles);
    setCheckedRegions(initialState.checkedRegions);
  }, [initialState]);

  // Apply visual theme to document element
  const applyTheme = (t: ThemeType) => {
    if (t === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    } else {
      document.documentElement.setAttribute("data-theme", t);
    }
  };

  // Load local state, theme & language on mount
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch("/api/state");
        if (res.ok) {
          const data = await res.json();
          if (data && !data.error) {
            setSelectedGame(data.selectedGame || "tp-gcn");
            setCheckedItems(data.checkedItems || []);
            setCheckedCollectibles(data.checkedCollectibles || []);
            setCheckedRegions(data.checkedRegions || ["ordon", "faron", "eldin", "lanayru", "desert", "snowpeak", "sky", "twilight"]);
            
            // Set initial loaded completion state
            const hComplete = heartPieces.length > 0 && heartPieces.every(hp => (data.checkedCollectibles || []).includes(hp.id));
            const pComplete = poeSouls.length > 0 && poeSouls.every(poe => (data.checkedCollectibles || []).includes(poe.id));
            const bComplete = goldenBugs.length > 0 && goldenBugs.every(bug => (data.checkedCollectibles || []).includes(bug.id));
            setCompletedCategories({
              hearts: hComplete,
              poes: pComplete,
              bugs: bComplete,
              all: hComplete && pComplete && bComplete
            });
            setIsFirstLoad(false);
          }
        }
      } catch (err) {
        console.error("Failed to load initial state", err);
      }
    };
    fetchState();

    // Theme initialization
    const savedTheme = (localStorage.getItem("rg_gt_theme") as ThemeType) || "system";
    setTheme(savedTheme);
    applyTheme(savedTheme);

    // Language initialization
    const savedLang = localStorage.getItem("rg_gt_lang");
    if (savedLang === "fr" || savedLang === "en") {
      setLang(savedLang as "fr" | "en");
    } else {
      const browserLang = navigator.language.substring(0, 2);
      setLang(browserLang === "en" ? "en" : "fr");
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // System theme changes listener
  useEffect(() => {
    if (theme !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // 100% Completion Celebration Tracker
  useEffect(() => {
    if (isFirstLoad) return;

    const heartsCompleted = heartPieces.length > 0 && heartPieces.every(hp => checkedCollectibles.includes(hp.id));
    const poesCompleted = poeSouls.length > 0 && poeSouls.every(poe => checkedCollectibles.includes(poe.id));
    const bugsCompleted = goldenBugs.length > 0 && goldenBugs.every(bug => checkedCollectibles.includes(bug.id));
    const allCompleted = heartsCompleted && poesCompleted && bugsCompleted;

    let newlyCompleted = "";
    if (allCompleted && !completedCategories.all) {
      newlyCompleted = lang === "fr" ? "100% - Complété !" : "100% Game Completion!";
    } else if (heartsCompleted && !completedCategories.hearts) {
      newlyCompleted = translations[lang].statsHearts;
    } else if (poesCompleted && !completedCategories.poes) {
      newlyCompleted = translations[lang].statsPoes;
    } else if (bugsCompleted && !completedCategories.bugs) {
      newlyCompleted = translations[lang].statsBugs;
    }

    if (newlyCompleted) {
      setCelebratedCategory(newlyCompleted);
      setShowCelebration(true);

      const colors = ["#0FA3EB", "#22C55E", "#F59E0B", "#EF4444", "#A855F7", "#EC4899"];
      const particles = Array.from({ length: 85 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: `${Math.random() * 2}s`,
        size: `${Math.random() * 8 + 6}px`
      }));
      setConfettiParticles(particles);
    }

    setCompletedCategories({
      hearts: heartsCompleted,
      poes: poesCompleted,
      bugs: bugsCompleted,
      all: allCompleted
    });
  }, [checkedCollectibles, isFirstLoad, lang]);

  // Toggle theme dark -> light -> system
  const handleToggleTheme = () => {
    let nextTheme: ThemeType = "dark";
    if (theme === "dark") nextTheme = "light";
    else if (theme === "light") nextTheme = "system";
    else nextTheme = "dark";

    setTheme(nextTheme);
    applyTheme(nextTheme);
    localStorage.setItem("rg_gt_theme", nextTheme);
  };

  // Handle language switch
  const handleLangChange = (newLang: "fr" | "en") => {
    setLang(newLang);
    localStorage.setItem("rg_gt_lang", newLang);
  };

  // Handle inventory item checkbox toggle
  const handleItemToggle = (itemId: string) => {
    const next = checkedItems.includes(itemId)
      ? checkedItems.filter((id) => id !== itemId)
      : [...checkedItems, itemId];
    setCheckedItems(next);
    debouncedSave(selectedGame, next, checkedCollectibles, checkedRegions);
  };

  // Handle collectible checkbox toggle
  const handleCollectibleToggle = (collectibleId: string) => {
    const next = checkedCollectibles.includes(collectibleId)
      ? checkedCollectibles.filter((id) => id !== collectibleId)
      : [...checkedCollectibles, collectibleId];
    setCheckedCollectibles(next);
    debouncedSave(selectedGame, checkedItems, next, checkedRegions);
  };

  // Handle region checkbox toggle
  const handleRegionToggle = (regionKey: string, checked: boolean) => {
    const next = checked
      ? [...checkedRegions, regionKey]
      : checkedRegions.filter((r) => r !== regionKey);
    setCheckedRegions(next);
    debouncedSave(selectedGame, checkedItems, checkedCollectibles, next);
  };

  // Handle game version toggle
  const handleGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGame = e.target.value;
    setSelectedGame(newGame);
    debouncedSave(newGame, checkedItems, checkedCollectibles, checkedRegions);
  };

  // Custom modal confirmation trigger
  const triggerResetModal = () => {
    setShowResetModal(true);
  };

  const handleConfirmReset = () => {
    setCheckedCollectibles([]);
    debouncedSave(selectedGame, checkedItems, [], checkedRegions);
    setShowResetModal(false);
  };

  // Check if a collectible's item conditions are satisfied
  const isObtainable = (conditions: string[][]) => {
    if (!conditions || conditions.length === 0) return true;
    return conditions.some((clause) =>
      clause.every((item) => checkedItems.includes(item))
    );
  };

  // Determine if directions should be mirrored
  const isMirrored = selectedGame === "tp-wii" || selectedGame === "tp-hd-hero";

  // Filter and process collectibles list
  const getFilteredCollectibles = (list: Collectible[]) => {
    return list.filter((item) => {
      const pKey = getProvinceKey(item.location);

      // 1. Unlocked region filter (from checklist)
      if (!checkedRegions.includes(pKey)) return false;

      // 2. Dropdown Province Filter
      if (selectedProvince !== "All" && pKey !== selectedProvince) {
        return false;
      }

      // 3. Completed Filter
      if (hideCompleted && checkedCollectibles.includes(item.id)) {
        return false;
      }

      // 4. Obtainable Filter
      if (showOnlyObtainable && !isObtainable(item.conditions)) {
        return false;
      }

      return true;
    });
  };

  // Global static totals (absolute count in game, does not wrap based on selected regions)
  const totalHPsGlobal = heartPieces.length;
  const collectedHPsGlobal = heartPieces.filter(hp => checkedCollectibles.includes(hp.id)).length;

  const totalPoesGlobal = poeSouls.length;
  const collectedPoesGlobal = poeSouls.filter(poe => checkedCollectibles.includes(poe.id)).length;

  const totalBugsGlobal = goldenBugs.length;
  const collectedBugsGlobal = goldenBugs.filter(bug => checkedCollectibles.includes(bug.id)).length;

  // Aggregate completion data per Province
  const getProvinceStats = (provinceKey: string) => {
    const hps = heartPieces.filter((item) => getProvinceKey(item.location) === provinceKey);
    const poes = poeSouls.filter((item) => getProvinceKey(item.location) === provinceKey);
    const bugs = goldenBugs.filter((item) => getProvinceKey(item.location) === provinceKey);

    const hpsCollected = hps.filter((item) => checkedCollectibles.includes(item.id)).length;
    const poesCollected = poes.filter((item) => checkedCollectibles.includes(item.id)).length;
    const bugsCollected = bugs.filter((item) => checkedCollectibles.includes(item.id)).length;

    const total = hps.length + poes.length + bugs.length;
    const collected = hpsCollected + poesCollected + bugsCollected;

    return {
      hpsCount: hps.length,
      hpsCollected,
      poesCount: poes.length,
      poesCollected,
      bugsCount: bugs.length,
      bugsCollected,
      total,
      collected,
      percentage: total > 0 ? Math.round((collected / total) * 100) : 0,
    };
  };

  // Categories of inventory items
  const categories = ["active", "bombs", "gear", "quest"] as const;

  // Helper to translate bugs
  const getBugName = (id: string, name: string, lang: "fr" | "en") => {
    if (lang === "fr") return name;
    const type = id.replace("bug-male-", "").replace("bug-female-", "");
    const gender = id.includes("male") ? "Male" : "Female";
    const capitalType = type.charAt(0).toUpperCase() + type.slice(1);
    return `${capitalType} (${gender})`;
  };

  return (
    <div className="layout-container bg-rgds-bg-1 text-rgds transition-default min-h-screen">
      
      {/* Sidebar: Settings, Global Progress, and User Footer */}
      <aside className="sidebar-panel border-rgds-card bg-rgds-bg-2 p-md flex flex-col justify-start border-b md:border-r md:border-b-0 md:h-screen md:overflow-y-auto shrink-0">
        
        {/* Game Title Logo Row and Settings Switchers Row */}
        <div className="mb-lg flex flex-col gap-sm">
          {/* Logo Row */}
          <div className="logo-container">
            <img 
              src="https://s3.romain-guillemot.dev/assets/logos/logo.svg" 
              alt="RG-GT Logo" 
              className="logo-large"
              style={{ height: "36px", width: "auto", objectFit: "contain" }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://s3.romain-guillemot.dev/assets/logos/logo.svg";
              }}
            />
            <img 
              src="https://s3.romain-guillemot.dev/assets/logos/logo_min.svg" 
              alt="RG-GT Logo" 
              className="logo-small"
              style={{ height: "36px", width: "auto", objectFit: "contain" }}
            />
          </div>
          
          {/* Theme & Language Controls Row */}
          <div className="flex-row gap-sm items-center mt-xs" style={{ display: "flex" }}>
            <button 
              onClick={() => handleLangChange(lang === "fr" ? "en" : "fr")}
              className="flex items-center justify-center rounded-md border-rgds-card bg-rgds-card text-xs font-bold text-rgds hover:bg-rgds-500 hover:text-rgds-white transition-default"
              style={{ width: "36px", height: "36px", borderWidth: "1px" }}
              title="Change Language"
            >
              {lang.toUpperCase()}
            </button>
            <button 
              onClick={handleToggleTheme}
              className="flex items-center justify-center rounded-md border-rgds-card bg-rgds-card text-sm text-rgds hover:bg-rgds-500 hover:text-rgds-white transition-default gap-xs"
              style={{ height: "36px", padding: "0 10px", borderWidth: "1px" }}
              title="Toggle Theme"
            >
              {theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "💻"}
              <span className="text-[10px] font-semibold uppercase">{theme === "system" ? translations[lang].systemTheme : ""}</span>
            </button>
          </div>
        </div>

        {/* Game Version Selector */}
        <div className="my-lg" style={{ marginTop: "16px", marginBottom: "24px" }}>
          <label className="mb-xs block text-xs font-semibold uppercase tracking-wider text-rgds-300">
            {translations[lang].gameVersion}
          </label>
          <select
            value={selectedGame}
            onChange={handleGameChange}
            className="w-full rounded-md border-rgds-card bg-rgds-card px-sm py-xs text-sm text-rgds focus:outline-none focus:border-rgds-100"
            style={{ borderWidth: "1px" }}
          >
            <option value="tp-gcn">{translations[lang].versionNames["tp-gcn"]}</option>
            <option value="tp-hd-normal">{translations[lang].versionNames["tp-hd-normal"]}</option>
            <option value="tp-wii">{translations[lang].versionNames["tp-wii"]}</option>
            <option value="tp-hd-hero">{translations[lang].versionNames["tp-hd-hero"]}</option>
          </select>
        </div>

        {/* Global Progress Indicators (With CSS hover breakdown tooltips) */}
        <div className="mb-md p-md rounded-md border-rgds-card bg-rgds-card/50" style={{ borderWidth: "1px" }}>
          
          {/* Hearts Progress Box */}
          <div className="mb-sm progress-tooltip-container">
            <div className="flex justify-between items-center text-xs font-semibold mb-xs">
              <span className="text-rgds">{translations[lang].statsHearts}</span>
              <span className="text-rgds-100 font-bold">{collectedHPsGlobal} / {totalHPsGlobal}</span>
            </div>
            <ProgressBar
              value={collectedHPsGlobal}
              max={totalHPsGlobal}
              size="sm"
              tone="info"
              showLabel={false}
            />
            {/* Tooltip detail breakdown */}
            <div className="progress-tooltip text-xs font-sans text-rgds">
              <div className="font-bold border-b border-rgds-card-border pb-xs mb-xs">
                {translations[lang].statsHearts}
              </div>
              {regionsList.map(r => {
                const provinceHPs = heartPieces.filter(hp => getProvinceKey(hp.location) === r.key);
                const provinceCollected = provinceHPs.filter(hp => checkedCollectibles.includes(hp.id)).length;
                const isUnlocked = checkedRegions.includes(r.key);
                return (
                  <div key={r.key} className="flex justify-between items-center py-xxs">
                    <span className={isUnlocked ? "text-rgds" : "text-rgds-300 line-through"} style={{ opacity: isUnlocked ? 1 : 0.5 }}>
                      {lang === "fr" ? r.labelFr : r.labelEn}
                    </span>
                    <span className="font-bold">
                      {provinceCollected}/{provinceHPs.length}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Poes Progress Box */}
          <div className="mb-sm progress-tooltip-container">
            <div className="flex justify-between items-center text-xs font-semibold mb-xs">
              <span className="text-rgds">{translations[lang].statsPoes}</span>
              <span className="text-rgds-warning font-bold">{collectedPoesGlobal} / {totalPoesGlobal}</span>
            </div>
            <ProgressBar
              value={collectedPoesGlobal}
              max={totalPoesGlobal}
              size="sm"
              tone="warning"
              showLabel={false}
            />
            {/* Tooltip detail breakdown */}
            <div className="progress-tooltip text-xs font-sans text-rgds">
              <div className="font-bold border-b border-rgds-card-border pb-xs mb-xs">
                {translations[lang].statsPoes}
              </div>
              {regionsList.map(r => {
                const provincePoes = poeSouls.filter(poe => getProvinceKey(poe.location) === r.key);
                const provinceCollected = provincePoes.filter(poe => checkedCollectibles.includes(poe.id)).length;
                const isUnlocked = checkedRegions.includes(r.key);
                return (
                  <div key={r.key} className="flex justify-between items-center py-xxs">
                    <span className={isUnlocked ? "text-rgds" : "text-rgds-300 line-through"} style={{ opacity: isUnlocked ? 1 : 0.5 }}>
                      {lang === "fr" ? r.labelFr : r.labelEn}
                    </span>
                    <span className="font-bold">
                      {provinceCollected}/{provincePoes.length}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bugs Progress Box */}
          <div className="progress-tooltip-container">
            <div className="flex justify-between items-center text-xs font-semibold mb-xs">
              <span className="text-rgds">{translations[lang].statsBugs}</span>
              <span className="text-rgds-success font-bold">{collectedBugsGlobal} / {totalBugsGlobal}</span>
            </div>
            <ProgressBar
              value={collectedBugsGlobal}
              max={totalBugsGlobal}
              size="sm"
              tone="success"
              showLabel={false}
            />
            {/* Tooltip detail breakdown */}
            <div className="progress-tooltip text-xs font-sans text-rgds">
              <div className="font-bold border-b border-rgds-card-border pb-xs mb-xs">
                {translations[lang].statsBugs}
              </div>
              {regionsList.map(r => {
                const provinceBugs = goldenBugs.filter(bug => getProvinceKey(bug.location) === r.key);
                const provinceCollected = provinceBugs.filter(bug => checkedCollectibles.includes(bug.id)).length;
                const isUnlocked = checkedRegions.includes(r.key);
                return (
                  <div key={r.key} className="flex justify-between items-center py-xxs">
                    <span className={isUnlocked ? "text-rgds" : "text-rgds-300 line-through"} style={{ opacity: isUnlocked ? 1 : 0.5 }}>
                      {lang === "fr" ? r.labelFr : r.labelEn}
                    </span>
                    <span className="font-bold">
                      {provinceCollected}/{provinceBugs.length}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Reset Actions and Footer (aligned together) */}
        <div className="w-full flex-col gap-xs mt-md" style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px" }}>
          <Button
            content={translations[lang].resetBtn}
            type="danger"
            size="sm"
            onClick={triggerResetModal}
            className="w-full"
          />
          <div className="text-center pt-xs" style={{ marginTop: "6px" }}>
            <p className="text-[10px] text-rgds-300 font-semibold">
              &copy; 2026 Romain GUILLEMOT
            </p>
            <p className="text-[9px] text-rgds-300 font-mono select-all break-all opacity-75" style={{ marginTop: "4px" }}>
              {translations[lang].userIdLabel}: {userId}
            </p>
          </div>
        </div>
      </aside>

      {/* Custom Confirmation Modal Popup */}
      {showResetModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-card">
            <h3 className="text-base font-bold text-rgds mb-md font-sans">
              {translations[lang].confirmTitle}
            </h3>
            <p className="text-xs text-rgds-300 leading-relaxed mb-lg">
              {translations[lang].resetConfirm}
            </p>
            <div className="flex justify-end gap-sm" style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ marginRight: "8px" }}>
                <Button
                  content={translations[lang].cancel}
                  type="secondary"
                  size="sm"
                  onClick={() => setShowResetModal(false)}
                />
              </div>
              <Button
                content={translations[lang].confirm}
                type="danger"
                size="sm"
                onClick={handleConfirmReset}
              />
            </div>
          </div>
        </div>
      )}

      {/* 100% Celebration Congratulations Overlay */}
      {showCelebration && (
        <div className="celebration-overlay" onClick={() => setShowCelebration(false)}>
          {confettiParticles.map((p) => (
            <div
              key={p.id}
              className="confetti-particle"
              style={{
                left: p.left,
                backgroundColor: p.color,
                animationDelay: p.delay,
                width: p.size,
                height: p.size,
                borderRadius: Math.random() > 0.5 ? "50%" : "2px"
              }}
            />
          ))}
          <div className="celebration-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-rgds-100 mb-sm font-sans">
              🎉 {translations[lang].congratsTitle} 🎉
            </h2>
            <p className="text-sm text-rgds leading-relaxed mb-md">
              {translations[lang].congratsMessage}
            </p>
            <div className="inline-block bg-rgds-bg-1/80 border border-rgds-100 px-md py-sm rounded-lg text-lg font-bold text-rgds mb-lg shadow-md" style={{ display: "inline-block", padding: "8px 16px", marginBottom: "24px" }}>
              {celebratedCategory}
            </div>
            <div>
              <Button
                content={translations[lang].close}
                type="primary"
                size="md"
                onClick={() => setShowCelebration(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-md md:p-lg overflow-y-auto flex flex-col">
        
        {/* Navigation Tabs */}
        <div className="mb-md flex-row gap-sm pb-sm border-rgds-card" style={{ display: "flex", flexWrap: "wrap", borderWidth: "0 0 1px 0" }}>
          <button
            onClick={() => { setActiveTab("inventory"); }}
            className={`flex items-center gap-xs px-md py-xs rounded-md font-semibold text-sm transition-default ${
              activeTab === "inventory"
                ? "bg-rgds-100 text-rgds-dark shadow-md"
                : "bg-rgds-card text-rgds border-rgds-card hover:bg-rgds-500 hover:text-rgds-white border-xs"
            }`}
          >
            <InventoryIcon />
            <span>{translations[lang].inventory}</span>
          </button>

          <button
            onClick={() => { setActiveTab("hearth"); setSelectedProvince("All"); }}
            className={`flex items-center gap-xs px-md py-xs rounded-md font-semibold text-sm transition-default ${
              activeTab === "hearth"
                ? "bg-rgds-100 text-rgds-dark shadow-md"
                : "bg-rgds-card text-rgds border-rgds-card hover:bg-rgds-500 hover:text-rgds-white border-xs"
            }`}
          >
            <HeartIcon />
            <span>{translations[lang].statsHearts}</span>
          </button>
          
          <button
            onClick={() => { setActiveTab("souls"); setSelectedProvince("All"); }}
            className={`flex items-center gap-xs px-md py-xs rounded-md font-semibold text-sm transition-default ${
              activeTab === "souls"
                ? "bg-rgds-warning text-rgds-dark shadow-md"
                : "bg-rgds-card text-rgds border-rgds-card hover:bg-rgds-500 hover:text-rgds-white border-xs"
            }`}
          >
            <GhostIcon />
            <span>{translations[lang].statsPoes}</span>
          </button>
          
          <button
            onClick={() => { setActiveTab("bugs"); setSelectedProvince("All"); }}
            className={`flex items-center gap-xs px-md py-xs rounded-md font-semibold text-sm transition-default ${
              activeTab === "bugs"
                ? "bg-rgds-success text-rgds-dark shadow-md"
                : "bg-rgds-card text-rgds border-rgds-card hover:bg-rgds-500 hover:text-rgds-white border-xs"
            }`}
          >
            <BugIcon />
            <span>{translations[lang].statsBugs}</span>
          </button>
          
          <button
            onClick={() => { setActiveTab("zones"); setSelectedProvince("All"); }}
            className={`flex items-center gap-xs px-md py-xs rounded-md font-semibold text-sm transition-default ${
              activeTab === "zones"
                ? "bg-rgds-white text-rgds-dark shadow-md"
                : "bg-rgds-card text-rgds border-rgds-card hover:bg-rgds-500 hover:text-rgds-white border-xs"
            }`}
          >
            <MapIcon />
            <span>{translations[lang].overview}</span>
          </button>
        </div>

        {/* Tab Content: Advanced Inventory (Unlocked Provinces at top, Items below) */}
        {activeTab === "inventory" && (
          <div className="flex-col gap-lg" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Unlocked Provinces Checklist (Full-width card, 3 items per line) */}
            <div className="p-md rounded-lg border-xs border-rgds-card bg-rgds-card">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rgds-100 mb-xs pb-xs border-rgds-card" style={{ borderWidth: "0 0 1px 0" }}>
                {translations[lang].unlockedRegions}
              </h3>
              <p className="text-xs text-rgds-300 mb-md" style={{ marginBottom: "12px" }}>
                {lang === "fr" 
                  ? "Sélectionnez les provinces pour afficher les collectibles correspondants." 
                  : "Select provinces to reveal their associated collectibles."}
              </p>
              <div className="provinces-grid">
                {regionsList.map((r) => (
                  <div key={r.key} className="flex items-center py-xs px-sm rounded-md bg-rgds-bg-1/40 hover:bg-rgds-bg-1/70 transition-default" style={{ padding: "8px 12px", borderRadius: "6px" }}>
                    <Checkbox
                      checked={checkedRegions.includes(r.key)}
                      onChange={(checked) => handleRegionToggle(r.key, checked)}
                      label={lang === "fr" ? r.labelFr : r.labelEn}
                      size="medium"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Link's Items Grid */}
            <div>
              <div className="flex items-center justify-between border-rgds-card pb-sm" style={{ borderWidth: "0 0 1px 0", marginBottom: "16px" }}>
                <h2 className="text-lg font-bold text-rgds font-sans">
                  {lang === "fr" ? "Objets de Link" : "Link's Items"}
                </h2>
                <Badge tone="info" variant="solid" size="md">
                  {checkedItems.length} / {itemsData.length}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "24px" }}>
                {categories.map((cat) => {
                  const catItems = itemsData.filter((i) => i.category === cat);
                  return (
                    <div key={cat} className="p-md rounded-lg border-xs border-rgds-card bg-rgds-card">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-rgds-100 mb-md pb-xs border-rgds-card" style={{ borderWidth: "0 0 1px 0" }}>
                        {translations[lang].itemCategories[cat]}
                      </h3>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-md" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))", gap: "12px" }}>
                        {catItems.map((item) => {
                          const isChecked = checkedItems.includes(item.id);
                          return (
                            <div key={item.id} className="group-inventory-tooltip">
                              <button
                                onClick={() => handleItemToggle(item.id)}
                                className={`inventory-slot ${isChecked ? "active" : "inactive"}`}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  padding: "8px",
                                  backgroundColor: "var(--rgds-bg-1)"
                                }}
                              >
                                <img 
                                  src={item.iconPath} 
                                  alt={item.name}
                                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                />
                              </button>
                              {/* Custom premium tooltip */}
                              <div className="inventory-tooltip text-xs font-semibold">
                                {lang === "fr" ? item.name : item.englishName}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Filters Panel (Search bar removed completely) */}
        {activeTab !== "zones" && activeTab !== "inventory" && (
          <div className="mb-md p-md rounded-md border-rgds-card bg-rgds-card" style={{ borderWidth: "1px" }}>
            <div className="filter-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              
              {/* Province selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-rgds-300" style={{ marginBottom: "6px" }}>
                  {translations[lang].provinceFilterLabel}
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full rounded-md border-rgds-card bg-rgds-bg-1 px-sm py-xs text-sm text-rgds focus:outline-none focus:border-rgds-100"
                  style={{ borderWidth: "1px", height: "36px" }}
                >
                  <option value="All">{translations[lang].allProvinces}</option>
                  {regionsList.map((r) => (
                    <option key={r.key} value={r.key}>
                      {lang === "fr" ? r.labelFr : r.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Switches */}
              <div className="flex-row gap-lg items-center" style={{ display: "flex", gap: "24px" }}>
                <Switch
                  checked={showOnlyObtainable}
                  onChange={setShowOnlyObtainable}
                  label={translations[lang].availableOnly}
                  size="sm"
                />
                <Switch
                  checked={hideCompleted}
                  onChange={setHideCompleted}
                  label={translations[lang].hideCompleted}
                  size="sm"
                />
              </div>

            </div>
          </div>
        )}

        {/* Collectibles Tab Content */}
        {activeTab === "hearth" && (
          <div>
            <div className="card-grid">
              {getFilteredCollectibles(heartPieces).map((hp) => {
                const checked = checkedCollectibles.includes(hp.id);
                const obtainable = isObtainable(hp.conditions);
                const pKey = getProvinceKey(hp.location);
                const pName = lang === "fr" 
                  ? regionsList.find(r => r.key === pKey)?.labelFr 
                  : regionsList.find(r => r.key === pKey)?.labelEn;

                return (
                  <div
                    key={hp.id}
                    className={`collectible-card relative flex flex-col rounded-lg border-xs overflow-hidden ${
                      checked ? "checked" : obtainable ? "obtainable" : "locked"
                    }`}
                  >
                    {/* Card Image */}
                    <div 
                      className="relative bg-rgds-bg-2 overflow-hidden flex items-center justify-center border-rgds-card"
                      style={{ height: "160px", borderWidth: "0 0 1px 0" }}
                    >
                      {hp.image ? (
                        <>
                          <img
                            src={hp.image}
                            alt={hp.location}
                            className="w-full h-full object-cover transition-default"
                            style={{ transitionDuration: "0.5s" }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const fallback = target.nextSibling as HTMLDivElement;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                          <div 
                            className="hidden absolute inset-0 flex-col items-center justify-center text-center p-md bg-rgds-bg-2 text-rgds-300"
                            style={{ opacity: 0.5 }}
                          >
                            <span className="text-sm font-semibold">{translations[lang].missingImage}</span>
                          </div>
                        </>
                      ) : (
                        <div 
                          className="absolute inset-0 flex-col items-center justify-center text-center p-md bg-rgds-bg-2 text-rgds-300"
                          style={{ display: "flex", opacity: 0.5 }}
                        >
                          <span className="text-sm font-semibold">{translations[lang].missingImage}</span>
                        </div>
                      )}
                      
                      {/* Checkbox trigger overlay on image */}
                      <button
                        onClick={() => handleCollectibleToggle(hp.id)}
                        className="absolute transition-default flex items-center justify-center rounded-full"
                        style={{
                          top: "12px",
                          right: "12px",
                          width: "32px",
                          height: "32px",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderColor: checked ? "var(--rgds-success)" : "rgb(255 255 255 / 0.3)",
                          backgroundColor: checked ? "var(--rgds-success)" : "var(--rgds-bg-2)",
                          color: checked ? "var(--rgds-dark)" : "var(--rgds-white)",
                          cursor: "pointer",
                          zIndex: 10
                        }}
                      >
                        ✔
                      </button>

                      {/* Obtainable Tag */}
                      <div className="absolute" style={{ bottom: "12px", left: "12px", zIndex: 10 }}>
                        <Badge
                          tone={checked ? "success" : obtainable ? "info" : "error"}
                          variant="solid"
                          size="sm"
                        >
                          {checked 
                            ? translations[lang].completed 
                            : obtainable 
                            ? translations[lang].obtainable 
                            : translations[lang].locked}
                        </Badge>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-md flex flex-col flex-1">
                      <div className="mb-xs flex items-start justify-between">
                        <div className="flex-col" style={{ display: "flex" }}>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rgds-300">
                            {pName}
                          </span>
                          <h3 className="text-sm font-bold text-rgds mt-xs">
                            {hp.location}
                          </h3>
                        </div>
                        <Badge tone="default" variant="outline" size="sm">
                          HP #{hp.index}
                        </Badge>
                      </div>

                      <p className="flex-1 text-xs leading-relaxed text-rgds-300 mb-md whitespace-pre-line">
                        {isMirrored ? mirrorDirections(hp.description) : hp.description}
                      </p>

                      {/* Required Conditions */}
                      {hp.conditions && hp.conditions.length > 0 && (
                        <div className="border-rgds-card pt-xs" style={{ borderWidth: "1px 0 0 0" }}>
                          <span className="text-[10px] font-semibold uppercase text-rgds-300 block mb-xs">
                            {translations[lang].requirements}
                          </span>
                          <div className="flex-row gap-xs" style={{ display: "flex", flexWrap: "wrap" }}>
                            {hp.conditions[0].map((condId) => {
                              const item = itemsData.find((i) => i.id === condId);
                              const linkHasIt = checkedItems.includes(condId);
                              return (
                                <span
                                  key={condId}
                                  className={`rounded-sm px-xs py-xxs text-[10px] font-semibold flex items-center gap-xs border-xs ${
                                    linkHasIt
                                      ? "bg-rgds-100/10 text-rgds-100 border-rgds-100/20"
                                      : "bg-rgds-bg-1 text-rgds-300 border-rgds-card"
                                  }`}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    padding: "2px 6px"
                                  }}
                                  title={item ? (lang === "fr" ? item.name : item.englishName) : condId}
                                >
                                  {item ? (
                                    <img
                                      src={item.iconPath}
                                      alt={item.name}
                                      style={{ width: "12px", height: "12px", objectFit: "contain" }}
                                    />
                                  ) : null}
                                  <span style={{ marginLeft: "4px" }}>
                                    {item ? (lang === "fr" ? item.name : item.englishName) : condId}
                                  </span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {getFilteredCollectibles(heartPieces).length === 0 && (
              <div className="text-center text-[11px] text-rgds-300 py-md italic">
                {translations[lang].emptyList}
              </div>
            )}
          </div>
        )}

        {activeTab === "souls" && (
          <div>
            <div className="card-grid">
              {getFilteredCollectibles(poeSouls).map((poe) => {
                const checked = checkedCollectibles.includes(poe.id);
                const obtainable = isObtainable(poe.conditions);
                const pKey = getProvinceKey(poe.location);
                const pName = lang === "fr" 
                  ? regionsList.find(r => r.key === pKey)?.labelFr 
                  : regionsList.find(r => r.key === pKey)?.labelEn;

                return (
                  <div
                    key={poe.id}
                    className={`collectible-card relative flex flex-col rounded-lg border-xs overflow-hidden ${
                      checked ? "checked" : obtainable ? "obtainable" : "locked"
                    }`}
                  >
                    {/* Card Image */}
                    <div 
                      className="relative bg-rgds-bg-2 overflow-hidden flex items-center justify-center border-rgds-card"
                      style={{ height: "160px", borderWidth: "0 0 1px 0" }}
                    >
                      {poe.image ? (
                        <>
                          <img
                            src={poe.image}
                            alt={poe.location}
                            className="w-full h-full object-cover transition-default"
                            style={{ transitionDuration: "0.5s" }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const fallback = target.nextSibling as HTMLDivElement;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                          <div 
                            className="hidden absolute inset-0 flex-col items-center justify-center text-center p-md bg-rgds-bg-2 text-rgds-300"
                            style={{ opacity: 0.5 }}
                          >
                            <span className="text-sm font-semibold">{translations[lang].missingImage}</span>
                          </div>
                        </>
                      ) : (
                        <div 
                          className="absolute inset-0 flex-col items-center justify-center text-center p-md bg-rgds-bg-2 text-rgds-300"
                          style={{ display: "flex", opacity: 0.5 }}
                        >
                          <span className="text-sm font-semibold">{translations[lang].missingImage}</span>
                        </div>
                      )}
                      
                      {/* Checkbox trigger overlay on image */}
                      <button
                        onClick={() => handleCollectibleToggle(poe.id)}
                        className="absolute transition-default flex items-center justify-center rounded-full"
                        style={{
                          top: "12px",
                          right: "12px",
                          width: "32px",
                          height: "32px",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderColor: checked ? "var(--rgds-success)" : "rgb(255 255 255 / 0.3)",
                          backgroundColor: checked ? "var(--rgds-success)" : "var(--rgds-bg-2)",
                          color: checked ? "var(--rgds-dark)" : "var(--rgds-white)",
                          cursor: "pointer",
                          zIndex: 10
                        }}
                      >
                        ✔
                      </button>

                      {/* Obtainable Tag */}
                      <div className="absolute" style={{ bottom: "12px", left: "12px", zIndex: 10 }}>
                        <Badge
                          tone={checked ? "success" : obtainable ? "warning" : "error"}
                          variant="solid"
                          size="sm"
                        >
                          {checked 
                            ? translations[lang].completed 
                            : obtainable 
                            ? translations[lang].obtainable 
                            : translations[lang].locked}
                        </Badge>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-md flex flex-col flex-1">
                      <div className="mb-xs flex items-start justify-between">
                        <div className="flex-col" style={{ display: "flex" }}>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rgds-300">
                            {pName}
                          </span>
                          <h3 className="text-sm font-bold text-rgds mt-xs">
                            {poe.location}
                          </h3>
                        </div>
                        <Badge tone="default" variant="outline" size="sm">
                          Poe #{poe.index}
                        </Badge>
                      </div>

                      <p className="flex-1 text-xs leading-relaxed text-rgds-300 mb-md whitespace-pre-line">
                        {isMirrored ? mirrorDirections(poe.description) : poe.description}
                      </p>

                      {/* Required Conditions */}
                      {poe.conditions && poe.conditions.length > 0 && (
                        <div className="border-rgds-card pt-xs" style={{ borderWidth: "1px 0 0 0" }}>
                          <span className="text-[10px] font-semibold uppercase text-rgds-300 block mb-xs">
                            {translations[lang].requirements}
                          </span>
                          <div className="flex-row gap-xs" style={{ display: "flex", flexWrap: "wrap" }}>
                            {poe.conditions[0].map((condId) => {
                              const item = itemsData.find((i) => i.id === condId);
                              const linkHasIt = checkedItems.includes(condId);
                              return (
                                <span
                                  key={condId}
                                  className={`rounded-sm px-xs py-xxs text-[10px] font-semibold flex items-center gap-xs border-xs ${
                                    linkHasIt
                                      ? "bg-rgds-warning/10 text-rgds-warning border-rgds-warning/20"
                                      : "bg-rgds-bg-1 text-rgds-300 border-rgds-card"
                                  }`}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    padding: "2px 6px"
                                  }}
                                  title={item ? (lang === "fr" ? item.name : item.englishName) : condId}
                                >
                                  {item ? (
                                    <img
                                      src={item.iconPath}
                                      alt={item.name}
                                      style={{ width: "12px", height: "12px", objectFit: "contain" }}
                                    />
                                  ) : null}
                                  <span style={{ marginLeft: "4px" }}>
                                    {item ? (lang === "fr" ? item.name : item.englishName) : condId}
                                  </span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {getFilteredCollectibles(poeSouls).length === 0 && (
              <div className="text-center text-[11px] text-rgds-300 py-md italic">
                {translations[lang].emptyList}
              </div>
            )}
          </div>
        )}

        {activeTab === "bugs" && (
          <div>
            <div className="card-grid">
              {getFilteredCollectibles(goldenBugs).map((bug) => {
                const checked = checkedCollectibles.includes(bug.id);
                const obtainable = isObtainable(bug.conditions);
                const pKey = getProvinceKey(bug.location);
                const pName = lang === "fr" 
                  ? regionsList.find(r => r.key === pKey)?.labelFr 
                  : regionsList.find(r => r.key === pKey)?.labelEn;
                const isMale = bug.id.includes("male");

                return (
                  <div
                    key={bug.id}
                    onClick={() => handleCollectibleToggle(bug.id)}
                    className={`collectible-card relative flex flex-col rounded-lg border-xs p-md cursor-pointer select-none ${
                      checked ? "checked" : obtainable ? "obtainable" : "locked"
                    }`}
                  >
                    {/* Top Row: Gender and checkbox */}
                    <div className="mb-xs flex items-center justify-between">
                      <div className="flex-row gap-xs items-center" style={{ display: "flex" }}>
                        <Badge
                          tone={isMale ? "info" : "warning"}
                          variant="soft"
                          size="sm"
                        >
                          {isMale ? "♂ Mâle" : "♀ Femelle"}
                        </Badge>
                        <span 
                          className="inline-block rounded-full" 
                          style={{ 
                            width: "10px", 
                            height: "10px", 
                            backgroundColor: checked 
                              ? "var(--rgds-success)" 
                              : obtainable 
                              ? "var(--rgds-100)" 
                              : "var(--rgds-error)" 
                          }} 
                        />
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCollectibleToggle(bug.id);
                        }}
                        className="flex items-center justify-center rounded-full transition-default"
                        style={{
                          width: "24px",
                          height: "24px",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderColor: checked ? "var(--rgds-success)" : "rgb(255 255 255 / 0.2)",
                          backgroundColor: checked ? "var(--rgds-success)" : "var(--rgds-bg-2)",
                          color: checked ? "var(--rgds-dark)" : "var(--rgds-white)",
                          cursor: "pointer"
                        }}
                      >
                        ✔
                      </button>
                    </div>

                    {/* Title & Province */}
                    <div className="mt-xs">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-rgds-300">
                        {pName}
                      </span>
                      <h3 className="text-sm font-bold text-rgds mt-xxs">
                        {getBugName(bug.id, bug.name || "", lang)}
                      </h3>
                      <p className="text-xs text-rgds-300 font-medium leading-none mt-xs">
                        📍 {bug.location}
                      </p>
                    </div>

                    <p className="text-xs leading-relaxed text-rgds-300 my-sm flex-1">
                      {isMirrored ? mirrorDirections(bug.description) : bug.description}
                    </p>

                    {/* Requirements */}
                    {bug.conditions && bug.conditions.length > 0 && (
                      <div className="border-t border-rgds-card-border/50 pt-xs mt-xs">
                        <div className="flex-row gap-xs" style={{ display: "flex", flexWrap: "wrap" }}>
                          {bug.conditions[0].map((condId) => {
                            const item = itemsData.find((i) => i.id === condId);
                            const linkHasIt = checkedItems.includes(condId);
                            return (
                              <span
                                key={condId}
                                className={`rounded-sm px-xs py-xxs text-[9px] font-semibold flex items-center gap-xs border-xs ${
                                  linkHasIt
                                    ? "bg-rgds-success/10 text-rgds-success border-rgds-success/20"
                                    : "bg-rgds-bg-1 text-rgds-300 border-rgds-card"
                                }`}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  padding: "2px 4px"
                                }}
                              >
                                {item ? (
                                  <img
                                    src={item.iconPath}
                                    alt={item.name}
                                    style={{ width: "10px", height: "10px", objectFit: "contain" }}
                                  />
                                ) : null}
                                <span style={{ marginLeft: "4px" }}>
                                  {item ? (lang === "fr" ? item.name : item.englishName) : condId}
                                </span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {getFilteredCollectibles(goldenBugs).length === 0 && (
              <div className="text-center text-[11px] text-rgds-300 py-md italic">
                {translations[lang].emptyList}
              </div>
            )}
          </div>
        )}

        {activeTab === "zones" && (
          <div>
            <div className="grid-cols-2 gap-md" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {regionsList.map((r) => {
                const stats = getProvinceStats(r.key);
                if (stats.total === 0) return null;

                return (
                  <div
                    key={r.key}
                    onClick={() => {
                      setSelectedProvince(r.key);
                      setActiveTab("hearth"); // Switch to collectibles view
                    }}
                    className="group relative flex flex-col justify-between rounded-lg border-xs border-rgds-card bg-rgds-card p-md transition-default hover:border-rgds-100 hover:bg-rgds-card/85 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-xxs"
                  >
                    {/* Header: Title and Completion circle percentage */}
                    <div className="flex justify-between items-start">
                      <div className="flex-col" style={{ display: "flex" }}>
                        <h3 className="text-sm font-bold text-rgds group-hover:text-rgds-100 transition-default">
                          {lang === "fr" ? r.labelFr : r.labelEn}
                        </h3>
                        <p className="text-[11px] text-rgds-300 font-medium">
                          Hyrule Province
                        </p>
                      </div>
                      <span className="rounded-full bg-rgds-bg-1 px-sm py-xxs text-xs font-bold text-rgds-100 border-xs border-rgds-card group-hover:bg-rgds-100 group-hover:text-rgds-dark transition-default">
                        {stats.percentage}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="my-sm">
                      <ProgressBar
                        value={stats.collected}
                        max={stats.total}
                        size="sm"
                        tone="info"
                        showLabel={false}
                      />
                    </div>

                    {/* Breakdown items using custom clean SVG icons */}
                    <div className="flex justify-between items-center text-xs text-rgds-300 bg-rgds-bg-1/40 p-xs rounded-md" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px" }}>
                      <div className="flex items-center gap-xs" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <HeartIcon />
                        <span className="font-bold text-rgds">{stats.hpsCollected}</span>
                        <span className="text-[10px] text-rgds-300">/{stats.hpsCount}</span>
                      </div>
                      <div className="flex items-center gap-xs border-rgds-card" style={{ display: "flex", alignItems: "center", gap: "4px", borderWidth: "0 0 0 1px", paddingLeft: "12px" }}>
                        <GhostIcon />
                        <span className="font-bold text-rgds">{stats.poesCollected}</span>
                        <span className="text-[10px] text-rgds-300">/{stats.poesCount}</span>
                      </div>
                      <div className="flex items-center gap-xs border-rgds-card" style={{ display: "flex", alignItems: "center", gap: "4px", borderWidth: "0 0 0 1px", paddingLeft: "12px" }}>
                        <BugIcon />
                        <span className="font-bold text-rgds">{stats.bugsCollected}</span>
                        <span className="text-[10px] text-rgds-300">/{stats.bugsCount}</span>
                      </div>
                      <span className="text-[10px] text-rgds-100 font-bold uppercase transition-default pl-xs" style={{ paddingLeft: "8px" }}>
                        {translations[lang].details} →
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
