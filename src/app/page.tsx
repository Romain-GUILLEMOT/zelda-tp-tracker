import Link from "next/link";
import { gamesData } from "@/data/gamesData";

export default function Page() {
  return (
    <main className="games-page bg-rgds-bg-1 text-rgds">
      <section className="games-shell">
        <header className="games-header">
          <img
            src="https://s3.romain-guillemot.dev/assets/logos/logo.svg"
            alt="RG-GT Logo"
            className="games-logo"
          />
          <div>
            <h1>Game Track</h1>
            <p>Choisis un jeu pour reprendre ou importer ta progression.</p>
          </div>
        </header>

        <div className="games-grid">
          {gamesData.map((game) => (
            <Link key={game.slug} href={game.href} className="game-card">
              <img src={game.thumbnailUrl} alt="" className="game-card-image" />
              <div className="game-card-body">
                <div className="game-card-topline">
                  <span>{game.status === "available" ? "Disponible" : "Bientôt"}</span>
                </div>
                <h2>{game.title}</h2>
                <p className="game-card-subtitle">{game.subtitle}</p>
                <p>{game.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
