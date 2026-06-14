export interface Item {
  id: string;
  name: string;
  englishName: string;
  iconPath: string;
  category: "active" | "bombs" | "gear" | "quest";
}

export const itemsData: Item[] = [
  // Active Quest Items
  {
    id: "lantern",
    name: "Lanterne",
    englishName: "Lantern",
    iconPath: "/img/items/Lantern_-_TPHD_icon.png",
    category: "active"
  },
  {
    id: "slingshot",
    name: "Lance-pierre",
    englishName: "Slingshot",
    iconPath: "/img/items/Slingshot_-_TPHD_icon.png",
    category: "active"
  },
  {
    id: "boomerang",
    name: "Boomerang Tornade",
    englishName: "Gale Boomerang",
    iconPath: "/img/items/Gale_Boomerang_-_TPHD_icon.png",
    category: "active"
  },
  {
    id: "iron_boots",
    name: "Bottes de fer",
    englishName: "Iron Boots",
    iconPath: "/img/items/Iron_Boots_-_TPHD_icon.png",
    category: "active"
  },
  {
    id: "bow",
    name: "Arc du Héros",
    englishName: "Hero's Bow",
    iconPath: "/img/items/Hero_Bow_-_TPHD_icon.png",
    category: "active"
  },
  {
    id: "hawkeye",
    name: "Masque du Faucon",
    englishName: "Hawkeye",
    iconPath: "/img/items/Hawkeye_-_TPHD_icon.png",
    category: "active"
  },
  {
    id: "clawshot",
    name: "Grappin",
    englishName: "Clawshot",
    iconPath: "/img/items/Clawshot_-_TPHD_icon.png",
    category: "active"
  },
  {
    id: "double_clawshots",
    name: "Double Grappin",
    englishName: "Double Clawshots",
    iconPath: "/img/items/Double_Clawshots_-_TPHD_icon.png",
    category: "active"
  },
  {
    id: "spinner",
    name: "Aérouage",
    englishName: "Spinner",
    iconPath: "/img/items/Spinner_-_TPHD_icon.png",
    category: "active"
  },
  {
    id: "dominion_rod",
    name: "Bâton Anima",
    englishName: "Dominion Rod",
    iconPath: "/img/items/Dominion_Rod_-_TPHD_icon.png",
    category: "active"
  },
  {
    id: "ball_and_chain",
    name: "Boulet de canon",
    englishName: "Ball and Chain",
    iconPath: "/img/items/Ball_and_Chain_-_TPHD_icon.png",
    category: "active"
  },
  {
    id: "fishing_rod",
    name: "Canne à pêche",
    englishName: "Fishing Rod",
    iconPath: "/img/items/Fishing_Rod_-_TPHD_icon.png",
    category: "active"
  },

  // Bomb types
  {
    id: "bombs",
    name: "Bombes",
    englishName: "Bombs",
    iconPath: "/img/items/Bombs_-_TPHD_icon.png",
    category: "bombs"
  },
  {
    id: "bomblings",
    name: "Bombes Insectes",
    englishName: "Bomblings",
    iconPath: "/img/items/Bomblings_-_TPHD_icon.png",
    category: "bombs"
  },
  {
    id: "water_bombs",
    name: "Bombes Sous-marines",
    englishName: "Water Bombs",
    iconPath: "/img/items/Water_Bombs_-_TPHD_icon.png",
    category: "bombs"
  },

  // Gear & Equipment
  {
    id: "master_sword",
    name: "Épée de Légende",
    englishName: "Master Sword",
    iconPath: "/img/items/Master_Sword_-_TPHD_icon.png",
    category: "gear"
  },
  {
    id: "wolf_form",
    name: "Forme Loup",
    englishName: "Wolf Form",
    iconPath: "/img/items/Wolf_Link_-_TPHD_icon.png",
    category: "gear"
  },
  {
    id: "zora_armor",
    name: "Armure Zora",
    englishName: "Zora Armor",
    iconPath: "/img/items/Zora_Armor_-_TPHD_icon.png",
    category: "gear"
  },
  {
    id: "magic_armor",
    name: "Armure Magique",
    englishName: "Magic Armor",
    iconPath: "/img/items/Magic_Armor_-_TPHD_icon.png",
    category: "gear"
  },
  {
    id: "hylian_shield",
    name: "Bouclier Hylien",
    englishName: "Hylian Shield",
    iconPath: "/img/items/Hylian_Shield_-_TPHD_icon.png",
    category: "gear"
  },

  // Quest & Progression Items
  {
    id: "horse_call",
    name: "Appeau à cheval",
    englishName: "Horse Call",
    iconPath: "/img/items/Horse_Call_-_TPHD_icon.png",
    category: "quest"
  },
  {
    id: "ghost_lantern",
    name: "Lanterne Spectre",
    englishName: "Ghost Lantern",
    iconPath: "/img/items/Ghost_Lantern_-_TPHD_icon.png",
    category: "quest"
  },
  {
    id: "sol",
    name: "Astre de Lumière",
    englishName: "Sol",
    iconPath: "/img/items/Silver_Rupee_-_TPHD_icon.png", // Using silver rupee as light asset placeholder
    category: "quest"
  },
  {
    id: "ilias_memory",
    name: "Mémoire d'Ilia",
    englishName: "Ilia's Memory",
    iconPath: "/img/items/Scent_of_Ilia_-_TPHD_icon.png",
    category: "quest"
  }
];
