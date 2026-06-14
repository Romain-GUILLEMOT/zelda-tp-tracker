"use client";

import { useState, useEffect } from "react";
import { heartPieces, poeSouls, goldenBugs, Collectible } from "@/data/collectiblesData";
import { itemsData } from "@/data/itemsData";
import { mirrorDirections } from "@/utils/directions";

type TabType = "hearth" | "souls" | "bugs" | "zones";
type ThemeType = "dark" | "light";

interface InitialState {
  selectedGame: string;
  checkedItems: string[];
  checkedCollectibles: string[];
}

interface TrackerDashboardProps {
  initialState: InitialState;
}

// Helper to map specific locations to broad TP Provinces
const getProvince = (location: string): string => {
  const loc = location.toLowerCase();
  if (loc.includes("ordon")) return "Provinces d'Ordona / Toal";
  if (loc.includes("faron") || loc.includes("forest temple") || loc.includes("sacred grove") || loc.includes("temple of time")) return "Province de Firone";
  if (loc.includes("kakariko") || loc.includes("death mountain") || loc.includes("goron mines") || loc.includes("eldin") || loc.includes("hidden village")) return "Province d'Ordinn";
  if (loc.includes("castle town") || loc.includes("hylia") || loc.includes("hena") || loc.includes("zora") || loc.includes("riches")) return "Province de Lanelle";
  if (loc.includes("desert") || loc.includes("mesa") || loc.includes("bulblin") || loc.includes("arbiter") || loc.includes("ordeals")) return "Désert de Gerudo";
  if (loc.includes("snowpeak")) return "Massif des Pics Blancs";
  if (loc.includes("twilight")) return "Palais du Crépuscule";
  if (loc.includes("sky")) return "Célestia";
  return "Hyrule (Autres)";
};

export default function TrackerDashboard({ initialState }: TrackerDashboardProps) {
  const [selectedGame, setSelectedGame] = useState<string>(initialState.selectedGame);
  const [checkedItems, setCheckedItems] = useState<string[]>(initialState.checkedItems);
  const [checkedCollectibles, setCheckedCollectibles] = useState<string[]>(initialState.checkedCollectibles);
  const [activeTab, setActiveTab] = useState<TabType>("hearth");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showOnlyObtainable, setShowOnlyObtainable] = useState<boolean>(false);
  const [hideCompleted, setHideCompleted] = useState<boolean>(false);
  const [selectedProvince, setSelectedProvince] = useState<string>("All");
  const [theme, setTheme] = useState<ThemeType>("dark");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Sync state if initial state props change
  useEffect(() => {
    setSelectedGame(initialState.selectedGame);
    setCheckedItems(initialState.checkedItems);
    setCheckedCollectibles(initialState.checkedCollectibles);
  }, [initialState]);

  // Save state helper
  const triggerSave = async (
    updatedGame: string,
    updatedItems: string[],
    updatedCollectibles: string[]
  ) => {
    setIsSaving(true);
    try {
      await fetch("/api/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedGame: updatedGame,
          checkedItems: updatedItems,
          checkedCollectibles: updatedCollectibles,
        }),
      });
    } catch (err) {
      console.error("Error saving state:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle dark/light theme
  const toggleTheme = () => {
    const newTheme: ThemeType = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Set default theme attribute on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  // Handle inventory checkbox toggle
  const handleItemToggle = (itemId: string) => {
    const next = checkedItems.includes(itemId)
      ? checkedItems.filter((id) => id !== itemId)
      : [...checkedItems, itemId];
    setCheckedItems(next);
    triggerSave(selectedGame, next, checkedCollectibles);
  };

  // Handle collectible checkbox toggle
  const handleCollectibleToggle = (collectibleId: string) => {
    const next = checkedCollectibles.includes(collectibleId)
      ? checkedCollectibles.filter((id) => id !== collectibleId)
      : [...checkedCollectibles, collectibleId];
    setCheckedCollectibles(next);
    triggerSave(selectedGame, checkedItems, next);
  };

  // Handle game version toggle
  const handleGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGame = e.target.value;
    setSelectedGame(newGame);
    triggerSave(newGame, checkedItems, checkedCollectibles);
  };

  // Quick reset progress helper
  const handleResetProgress = () => {
    if (window.confirm("Voulez-vous vraiment réinitialiser toute votre progression de collecte ?")) {
      setCheckedCollectibles([]);
      triggerSave(selectedGame, checkedItems, []);
    }
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
      // 1. Search Query
      const matchesSearch =
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // 2. Province Filter
      if (selectedProvince !== "All" && getProvince(item.location) !== selectedProvince) {
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

  // Collectibles totals
  const totalHPs = heartPieces.length;
  const collectedHPs = heartPieces.filter((hp) => checkedCollectibles.includes(hp.id)).length;
  const totalPoes = poeSouls.length;
  const collectedPoes = poeSouls.filter((poe) => checkedCollectibles.includes(poe.id)).length;
  const totalBugs = goldenBugs.length;
  const collectedBugs = goldenBugs.filter((bug) => checkedCollectibles.includes(bug.id)).length;

  // Aggregate completion data per Province
  const provinces = [
    "Provinces d'Ordona / Toal",
    "Province de Firone",
    "Province d'Ordinn",
    "Province de Lanelle",
    "Désert de Gerudo",
    "Massif des Pics Blancs",
    "Célestia",
    "Palais du Crépuscule"
  ];

  const getProvinceStats = (province: string) => {
    const hps = heartPieces.filter((item) => getProvince(item.location) === province);
    const poes = poeSouls.filter((item) => getProvince(item.location) === province);
    const bugs = goldenBugs.filter((item) => getProvince(item.location) === province);

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

  return (
    <div className="flex min-h-screen flex-col bg-rgds-bg-1 font-sans text-rgds-text transition-colors duration-300 md:flex-row">
      
      {/* Sidebar: Link's Inventory & Game Settings */}
      <aside className="w-full shrink-0 border-b border-rgds-card-border bg-rgds-bg-2 p-6 md:w-80 md:border-r md:border-b-0">
        
        {/* Game Title & Theme Switch */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-rgds-white">
              Zelda TP Tracker
            </h1>
            <p className="text-xs text-rgds-300 font-medium uppercase tracking-wider">
              Généré par Gemini 3.5
            </p>
          </div>
          <button 
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-rgds-card-border bg-rgds-card text-lg text-rgds-100 transition-all hover:bg-rgds-500 hover:text-rgds-white"
            title="Changer de thème"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Game Version Selector */}
        <div className="mb-6">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-rgds-300">
            Version du Jeu
          </label>
          <select
            value={selectedGame}
            onChange={handleGameChange}
            className="w-full rounded-lg border border-rgds-card-border bg-rgds-card px-3 py-2 text-sm text-rgds-white focus:outline-none focus:ring-1 focus:ring-rgds-100"
          >
            <option value="tp-hd-normal">TP HD (Normal Mode)</option>
            <option value="tp-gcn">TP (GameCube)</option>
            <option value="tp-hd-hero">TP HD (Hero Mode - Mirrored)</option>
            <option value="tp-wii">TP (Wii - Mirrored)</option>
          </select>
        </div>

        {/* Global Progress Indicators */}
        <div className="mb-6 space-y-3 rounded-lg border border-rgds-card-border bg-rgds-card/50 p-4">
          <div className="flex items-center justify-between text-xs font-medium">
            <span>❤️ Fragments</span>
            <span className="font-bold text-rgds-100">{collectedHPs} / {totalHPs}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-rgds-bg-1 overflow-hidden">
            <div 
              className="h-full bg-rgds-100 transition-all duration-500" 
              style={{ width: `${(collectedHPs / totalHPs) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-medium pt-1">
            <span>👻 Âmes de Spectre</span>
            <span className="font-bold text-rgds-warning">{collectedPoes} / {totalPoes}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-rgds-bg-1 overflow-hidden">
            <div 
              className="h-full bg-rgds-warning transition-all duration-500" 
              style={{ width: `${(collectedPoes / totalPoes) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-medium pt-1">
            <span>🦋 Insectes Dorés</span>
            <span className="font-bold text-rgds-success">{collectedBugs} / {totalBugs}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-rgds-bg-1 overflow-hidden">
            <div 
              className="h-full bg-rgds-success transition-all duration-500" 
              style={{ width: `${(collectedBugs / totalBugs) * 100}%` }}
            />
          </div>
        </div>

        {/* Link's Inventory (Equipement) */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-rgds-300">
              Inventaire de Link
            </h2>
            <span className="text-[10px] text-rgds-100 px-1.5 py-0.5 rounded bg-rgds-500/20 font-bold">
              {checkedItems.length} / {itemsData.length}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {itemsData.map((item) => {
              const isChecked = checkedItems.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemToggle(item.id)}
                  className={`flex items-center gap-2 rounded-lg border p-2 text-left transition-all duration-200 ${
                    isChecked
                      ? "border-rgds-100 bg-rgds-500/20 text-rgds-white shadow-md shadow-rgds-100/10"
                      : "border-rgds-card-border bg-rgds-card text-rgds-text/50 hover:border-rgds-500 hover:text-rgds-text"
                  }`}
                  title={`${item.name} (${item.englishName})`}
                >
                  <span className={`text-base transition-transform ${isChecked ? "scale-110" : "opacity-40"}`}>
                    {item.icon}
                  </span>
                  <span className="truncate text-xs font-medium leading-none">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset Actions */}
        <button
          onClick={handleResetProgress}
          className="w-full rounded-lg border border-rgds-error/30 bg-rgds-error/10 py-2 text-center text-xs font-semibold text-rgds-error hover:bg-rgds-error/20 transition-colors"
        >
          Effacer la collecte
        </button>

        {/* Sync Indicator */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-rgds-text/40">
          <span className={`inline-block h-2 w-2 rounded-full ${isSaving ? "bg-rgds-warning animate-pulse" : "bg-rgds-success"}`} />
          {isSaving ? "Sauvegarde en cours..." : "Données synchronisées localement"}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        
        {/* Navigation Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-rgds-card-border pb-4">
          <button
            onClick={() => { setActiveTab("hearth"); setSelectedProvince("All"); }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "hearth"
                ? "bg-rgds-100 text-rgds-bg-1 shadow-lg shadow-rgds-100/20 scale-105"
                : "bg-rgds-card text-rgds-text border border-rgds-card-border hover:bg-rgds-500 hover:text-rgds-white"
            }`}
          >
            ❤️ Fragments de Cœur
          </button>
          <button
            onClick={() => { setActiveTab("souls"); setSelectedProvince("All"); }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "souls"
                ? "bg-rgds-warning text-rgds-bg-1 shadow-lg shadow-rgds-warning/20 scale-105"
                : "bg-rgds-card text-rgds-text border border-rgds-card-border hover:bg-rgds-500 hover:text-rgds-white"
            }`}
          >
            👻 Âmes de Spectre
          </button>
          <button
            onClick={() => { setActiveTab("bugs"); setSelectedProvince("All"); }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "bugs"
                ? "bg-rgds-success text-rgds-bg-1 shadow-lg shadow-rgds-success/20 scale-105"
                : "bg-rgds-card text-rgds-text border border-rgds-card-border hover:bg-rgds-500 hover:text-rgds-white"
            }`}
          >
            🦋 Insectes Dorés
          </button>
          <button
            onClick={() => { setActiveTab("zones"); setSelectedProvince("All"); }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "zones"
                ? "bg-rgds-500 text-rgds-white shadow-lg shadow-rgds-500/20 scale-105"
                : "bg-rgds-card text-rgds-text border border-rgds-card-border hover:bg-rgds-500 hover:text-rgds-white"
            }`}
          >
            🗺️ Provinces Overview
          </button>
        </div>

        {/* Filters Panel */}
        {activeTab !== "zones" && (
          <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-rgds-card-border bg-rgds-card p-4 md:grid-cols-4">
            
            {/* Search Input */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-rgds-300">
                Rechercher
              </label>
              <input
                type="text"
                placeholder="Ex. Faron, cave, light, chest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-rgds-card-border bg-rgds-bg-1 px-3 py-2 text-sm text-rgds-white placeholder-rgds-text/30 focus:outline-none focus:ring-1 focus:ring-rgds-100"
              />
            </div>

            {/* Province selector */}
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-rgds-300">
                Province / Région
              </label>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full rounded-lg border border-rgds-card-border bg-rgds-bg-1 px-3 py-2 text-sm text-rgds-white focus:outline-none focus:ring-1 focus:ring-rgds-100"
              >
                <option value="All">Toutes les contrées</option>
                {provinces.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            {/* Logical Filter Toggles */}
            <div className="flex flex-col justify-center gap-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-rgds-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyObtainable}
                  onChange={(e) => setShowOnlyObtainable(e.target.checked)}
                  className="accent-rgds-100 h-4 w-4 rounded cursor-pointer"
                />
                Disponibles uniquement
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-rgds-text cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={hideCompleted}
                  onChange={(e) => setHideCompleted(e.target.checked)}
                  className="accent-rgds-100 h-4 w-4 rounded cursor-pointer"
                />
                Masquer les complétés
              </label>
            </div>

          </div>
        )}

        {/* Collectibles Tab Content */}
        {activeTab === "hearth" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-rgds-300 font-sans">
                Fragments de Cœur Obtenables ({getFilteredCollectibles(heartPieces).length} filtrés)
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {getFilteredCollectibles(heartPieces).map((hp) => {
                const checked = checkedCollectibles.includes(hp.id);
                const obtainable = isObtainable(hp.conditions);
                const province = getProvince(hp.location);

                return (
                  <div
                    key={hp.id}
                    className={`relative flex flex-col rounded-xl border transition-all duration-300 overflow-hidden ${
                      checked
                        ? "border-rgds-success bg-rgds-card/40 opacity-75 hover:opacity-100"
                        : obtainable
                        ? "border-rgds-card-border bg-rgds-card shadow-md shadow-rgds-100/5 hover:-translate-y-1 hover:border-rgds-100"
                        : "border-rgds-card-border bg-rgds-card/30 opacity-60 hover:opacity-85"
                    }`}
                  >
                    {/* Card Image */}
                    <div className="relative h-44 w-full bg-rgds-bg-2 overflow-hidden flex items-center justify-center border-b border-rgds-card-border/50">
                      {hp.image ? (
                        <img
                          src={hp.image}
                          alt={hp.location}
                          className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const fallback = target.nextSibling as HTMLDivElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div className="hidden absolute inset-0 flex-col items-center justify-center text-center p-4 bg-rgds-bg-2 text-rgds-text/40">
                        <span className="text-3xl mb-1">❤️</span>
                        <span className="text-xs font-semibold">Image manquante</span>
                      </div>
                      
                      {/* Checkbox trigger overlay on image */}
                      <button
                        onClick={() => handleCollectibleToggle(hp.id)}
                        className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border transition-all shadow-md ${
                          checked
                            ? "bg-rgds-success border-rgds-success text-rgds-bg-1"
                            : "bg-rgds-bg-2/80 border-rgds-white/30 text-rgds-white hover:bg-rgds-100 hover:border-rgds-100 hover:text-rgds-bg-1"
                        }`}
                      >
                        ✔
                      </button>

                      {/* Obtainable Tag */}
                      <span className={`absolute bottom-3 left-3 rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        checked
                          ? "bg-rgds-success/20 text-rgds-success"
                          : obtainable
                          ? "bg-rgds-100/20 text-rgds-100"
                          : "bg-rgds-error/20 text-rgds-error"
                      }`}>
                        {checked ? "Complété" : obtainable ? "Disponible" : "Verrouillé"}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-col flex-1 p-5">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rgds-300">
                            {province}
                          </span>
                          <h3 className="text-sm font-bold text-rgds-white mt-0.5">
                            {hp.location}
                          </h3>
                        </div>
                        <span className="shrink-0 text-xs font-bold text-rgds-text/50 bg-rgds-bg-1 px-2 py-0.5 rounded font-sans">
                          HP #{hp.index}
                        </span>
                      </div>

                      <p className="flex-1 text-xs leading-relaxed text-rgds-text/80 mb-4 whitespace-pre-line">
                        {isMirrored ? mirrorDirections(hp.description) : hp.description}
                      </p>

                      {/* Condition Badges */}
                      {hp.conditions && hp.conditions.length > 0 && (
                        <div className="border-t border-rgds-card-border/50 pt-3">
                          <span className="text-[10px] font-semibold uppercase text-rgds-text/40 block mb-1.5">
                            Conditions requises :
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {hp.conditions[0].map((condId) => {
                              const item = itemsData.find((i) => i.id === condId);
                              const LinkHasIt = checkedItems.includes(condId);
                              return (
                                <span
                                  key={condId}
                                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold flex items-center gap-1 ${
                                    LinkHasIt
                                      ? "bg-rgds-100/20 text-rgds-100 border border-rgds-100/20"
                                      : "bg-rgds-bg-1 text-rgds-text/30 border border-rgds-card-border"
                                  }`}
                                  title={item ? item.name : condId}
                                >
                                  {item ? item.icon : "❓"} {item ? item.name : condId}
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
          </div>
        )}

        {activeTab === "souls" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-rgds-300 font-sans">
                Âmes de Spectre Obtenables ({getFilteredCollectibles(poeSouls).length} filtrés)
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {getFilteredCollectibles(poeSouls).map((poe) => {
                const checked = checkedCollectibles.includes(poe.id);
                const obtainable = isObtainable(poe.conditions);
                const province = getProvince(poe.location);

                return (
                  <div
                    key={poe.id}
                    className={`relative flex flex-col rounded-xl border transition-all duration-300 overflow-hidden ${
                      checked
                        ? "border-rgds-success bg-rgds-card/40 opacity-75 hover:opacity-100"
                        : obtainable
                        ? "border-rgds-card-border bg-rgds-card shadow-md shadow-rgds-warning/5 hover:-translate-y-1 hover:border-rgds-warning"
                        : "border-rgds-card-border bg-rgds-card/30 opacity-60 hover:opacity-85"
                    }`}
                  >
                    {/* Card Image */}
                    <div className="relative h-44 w-full bg-rgds-bg-2 overflow-hidden flex items-center justify-center border-b border-rgds-card-border/50">
                      {poe.image ? (
                        <img
                          src={poe.image}
                          alt={poe.location}
                          className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const fallback = target.nextSibling as HTMLDivElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div className="hidden absolute inset-0 flex-col items-center justify-center text-center p-4 bg-rgds-bg-2 text-rgds-text/40">
                        <span className="text-3xl mb-1">👻</span>
                        <span className="text-xs font-semibold">Image manquante</span>
                      </div>

                      {/* Checkbox trigger overlay on image */}
                      <button
                        onClick={() => handleCollectibleToggle(poe.id)}
                        className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border transition-all shadow-md ${
                          checked
                            ? "bg-rgds-success border-rgds-success text-rgds-bg-1"
                            : "bg-rgds-bg-2/80 border-rgds-white/30 text-rgds-white hover:bg-rgds-warning hover:border-rgds-warning hover:text-rgds-bg-1"
                        }`}
                      >
                        ✔
                      </button>

                      {/* Obtainable Tag */}
                      <span className={`absolute bottom-3 left-3 rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        checked
                          ? "bg-rgds-success/20 text-rgds-success"
                          : obtainable
                          ? "bg-rgds-warning/20 text-rgds-warning"
                          : "bg-rgds-error/20 text-rgds-error"
                      }`}>
                        {checked ? "Capturée" : obtainable ? "Disponible" : "Verrouillée"}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-col flex-1 p-5">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rgds-300">
                            {province}
                          </span>
                          <h3 className="text-sm font-bold text-rgds-white mt-0.5">
                            {poe.location}
                          </h3>
                        </div>
                        <span className="shrink-0 text-xs font-bold text-rgds-text/50 bg-rgds-bg-1 px-2 py-0.5 rounded font-sans">
                          Spectre #{poe.index}
                        </span>
                      </div>

                      <p className="flex-1 text-xs leading-relaxed text-rgds-text/80 mb-4 whitespace-pre-line">
                        {isMirrored ? mirrorDirections(poe.description) : poe.description}
                      </p>

                      {/* Condition Badges */}
                      {poe.conditions && poe.conditions.length > 0 && (
                        <div className="border-t border-rgds-card-border/50 pt-3">
                          <span className="text-[10px] font-semibold uppercase text-rgds-text/40 block mb-1.5">
                            Conditions requises :
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {poe.conditions[0].map((condId) => {
                              const item = itemsData.find((i) => i.id === condId);
                              const LinkHasIt = checkedItems.includes(condId);
                              return (
                                <span
                                  key={condId}
                                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold flex items-center gap-1 ${
                                    LinkHasIt
                                      ? "bg-rgds-warning/20 text-rgds-warning border border-rgds-warning/20"
                                      : "bg-rgds-bg-1 text-rgds-text/30 border border-rgds-card-border"
                                  }`}
                                  title={item ? item.name : condId}
                                >
                                  {item ? item.icon : "❓"} {item ? item.name : condId}
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
          </div>
        )}

        {activeTab === "bugs" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-rgds-300 font-sans">
                Insectes Dorés Obtenables ({getFilteredCollectibles(goldenBugs).length} filtrés)
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {getFilteredCollectibles(goldenBugs).map((bug) => {
                const checked = checkedCollectibles.includes(bug.id);
                const obtainable = isObtainable(bug.conditions);
                const province = getProvince(bug.location);
                const isMale = bug.id.includes("male");

                return (
                  <div
                    key={bug.id}
                    onClick={() => handleCollectibleToggle(bug.id)}
                    className={`relative flex flex-col rounded-xl border p-5 transition-all duration-200 cursor-pointer select-none ${
                      checked
                        ? "border-rgds-success bg-rgds-card/40 opacity-70"
                        : obtainable
                        ? "border-rgds-card-border bg-rgds-card shadow-md shadow-rgds-success/5 hover:-translate-y-1 hover:border-rgds-success"
                        : "border-rgds-card-border bg-rgds-card/20 opacity-50 hover:opacity-75"
                    }`}
                  >
                    
                    {/* Top Row: Gender, Completion status and Index */}
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                          isMale ? "bg-rgds-100/20 text-rgds-100" : "bg-rgds-warning/20 text-rgds-warning"
                        }`}>
                          {isMale ? "♂ Mâle" : "♀ Femelle"}
                        </span>
                        <span className={`inline-block h-2.5 w-2.5 rounded-full ${
                          checked
                            ? "bg-rgds-success"
                            : obtainable
                            ? "bg-rgds-100"
                            : "bg-rgds-error"
                        }`} />
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCollectibleToggle(bug.id);
                        }}
                        className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs transition-all shadow-md ${
                          checked
                            ? "bg-rgds-success border-rgds-success text-rgds-bg-1"
                            : "bg-rgds-bg-2 border-rgds-white/20 text-rgds-text/50 hover:bg-rgds-success hover:border-rgds-success hover:text-rgds-bg-1"
                        }`}
                      >
                        ✔
                      </button>
                    </div>

                    {/* Title & Province */}
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-rgds-300">
                        {province}
                      </span>
                      <h3 className="text-sm font-bold text-rgds-white mt-0.5">
                        {bug.name}
                      </h3>
                      <p className="text-[11px] text-rgds-text/50 font-medium leading-none mt-1 font-sans">
                        📍 {bug.location}
                      </p>
                    </div>

                    <p className="text-xs leading-relaxed text-rgds-text/70 my-3 flex-1">
                      {isMirrored ? mirrorDirections(bug.description) : bug.description}
                    </p>

                    {/* Requirements */}
                    {bug.conditions && bug.conditions.length > 0 && (
                      <div className="border-t border-rgds-card-border/50 pt-2 flex flex-wrap gap-1">
                        {bug.conditions[0].map((condId) => {
                          const item = itemsData.find((i) => i.id === condId);
                          const LinkHasIt = checkedItems.includes(condId);
                          return (
                            <span
                              key={condId}
                              className={`rounded px-1.5 py-0.5 text-[9px] font-semibold flex items-center gap-0.5 ${
                                LinkHasIt ? "bg-rgds-success/15 text-rgds-success" : "bg-rgds-bg-1 text-rgds-text/20"
                              }`}
                            >
                              {item ? item.icon : "❓"} {item ? item.name : condId}
                            </span>
                          );
                        })}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "zones" && (
          <div>
            <div className="mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-rgds-300 font-sans">
                Progression Globale par Province / Contrée d'Hyrule
              </h2>
              <p className="text-xs text-rgds-text/50 mt-1">
                Visualisez votre taux de complétion par contrée et sélectionnez une contrée pour y filtrer vos recherches.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {provinces.map((prov) => {
                const stats = getProvinceStats(prov);
                if (stats.total === 0) return null;

                return (
                  <div
                    key={prov}
                    onClick={() => {
                      setSelectedProvince(prov);
                      setActiveTab("hearth"); // Switch to collectibles view
                    }}
                    className="group relative flex flex-col justify-between rounded-xl border border-rgds-card-border bg-rgds-card p-5 transition-all duration-200 hover:border-rgds-100 hover:bg-rgds-card/70 cursor-pointer shadow hover:shadow-lg hover:-translate-y-0.5"
                  >
                    
                    {/* Header: Title and Completion circle percentage */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-rgds-white group-hover:text-rgds-100 transition-colors">
                          {prov}
                        </h3>
                        <p className="text-[11px] text-rgds-text/40 font-medium font-sans">
                          TP Province Region
                        </p>
                      </div>
                      <span className="rounded-full bg-rgds-bg-1 px-3 py-1 text-xs font-bold text-rgds-100 border border-rgds-card-border group-hover:bg-rgds-100 group-hover:text-rgds-bg-1 transition-all font-sans">
                        {stats.percentage}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="my-4">
                      <div className="h-2 w-full rounded-full bg-rgds-bg-1 overflow-hidden">
                        <div
                          className="h-full bg-rgds-100 transition-all duration-500"
                          style={{ width: `${stats.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Breakdown items */}
                    <div className="flex items-center justify-between text-xs text-rgds-text/60 bg-rgds-bg-1/40 p-2 rounded-lg font-sans">
                      <div className="flex items-center gap-1">
                        <span>❤️</span>
                        <span className="font-bold text-rgds-white">{stats.hpsCollected}</span>
                        <span className="text-[10px] text-rgds-text/30">/{stats.hpsCount}</span>
                      </div>
                      <div className="flex items-center gap-1 border-l border-rgds-card-border/50 pl-3">
                        <span>👻</span>
                        <span className="font-bold text-rgds-white">{stats.poesCollected}</span>
                        <span className="text-[10px] text-rgds-text/30">/{stats.poesCount}</span>
                      </div>
                      <div className="flex items-center gap-1 border-l border-rgds-card-border/50 pl-3">
                        <span>🦋</span>
                        <span className="font-bold text-rgds-white">{stats.bugsCollected}</span>
                        <span className="text-[10px] text-rgds-text/30">/{stats.bugsCount}</span>
                      </div>
                      <span className="text-[10px] text-rgds-100 font-bold uppercase group-hover:translate-x-1 transition-transform pl-2">
                        Détails →
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
