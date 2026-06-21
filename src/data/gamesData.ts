export interface GameEntry {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnailUrl: string;
  href: string;
  status: "available" | "planned";
}

export const gamesData: GameEntry[] = [
  {
    slug: "zelda-tp",
    title: "The Legend of Zelda: Twilight Princess",
    subtitle: "Fragments de coeur, spectres, insectes dorés",
    description: "Tracker complet pour suivre la progression de Twilight Princess.",
    thumbnailUrl: "https://i.redd.it/43w0d8a7ftbf1.jpeg",
    href: "/zelda-tp",
    status: "available",
  },
];
