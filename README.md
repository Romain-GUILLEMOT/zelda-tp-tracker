# Zelda: Twilight Princess Collectibles Tracker

Un tracker interactif et intelligent pour les fragments de cœur, les âmes de spectres et les insectes dorés dans *The Legend of Zelda: Twilight Princess* (versions GameCube, Wii et HD).

> [!IMPORTANT]
> **Ce projet a été entièrement créé avec Gemini 3.5.**

---

## Fonctionnalités

1. **Suivi Complet des Collectibles** :
   - **45 fragments de cœur** : descriptions détaillées, conditions requises et captures d'écran.
   - **60 âmes de spectres** : localisations et conditions d'apparition (jour/nuit).
   - **24 insectes dorés (12 couples)** : genres, emplacements exacts et descriptions.

2. **Logique d'Obtention en Temps Réel** :
   - Cochez les objets que Link possède dans son inventaire (Arc, Grappin, Boulet, etc.) pour filtrer automatiquement les collectibles et n'afficher que ceux qui sont actuellement **disponibles**.

3. **Prise en charge du Mode Miroir (Wii / Mode Héroïque)** :
   - Choisissez votre version du jeu ! Si vous jouez à la version Wii ou au mode Héroïque de la version HD, activez le mode Miroir pour inverser dynamiquement toutes les directions textuelles (ex. *Est* devient *Ouest*, *Gauche* devient *Droite*) afin de correspondre précisément à votre écran.

4. **Persistance Locale** :
   - Vos données de progression sont stockées côté serveur dans un fichier JSON (`data/tracker-state.json`) à chaque action, sans nécessiter de serveur de base de données externe ou Redis.

5. **Interface Premium et Responsive** :
   - Palette de couleurs sur mesure, design soigné avec effets de flou (glassmorphism), thème sombre par défaut avec sélecteur de mode clair/sombre, animations fluides et barre de recherche intelligente.

---

## Installation et Lancement

Le projet est construit avec **Next.js (App Router)**, **TypeScript** et **Tailwind CSS v4**.

### Prérequis

Assurez-vous d'avoir installé [NVM](https://github.com/nvm-sh/nvm) pour gérer la version de Node.js.

### Lancement en local

1. **Activer Node.js v24** :
   ```bash
   nvm use 24
   ```
   *(Si la version n'est pas installée : `nvm install 24`)*

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Démarrer le serveur de développement** :
   ```bash
   npm run dev
   ```
   L'application est accessible à l'adresse [http://localhost:3000](http://localhost:3000).

4. **Compiler pour la production** :
   ```bash
   npm run build
   ```

---

## Structure des Images

Les images des fragments de cœur et des âmes de spectres sont servies localement. Assurez-vous qu'elles se trouvent dans les dossiers suivants :
- Fragments de cœur : `public/img/hearth/400px-Tp_heart_XX.jpg` (de `01` à `45`)
- Âmes de spectres : `public/img/souls/PoeSoul_XX.jpg` (de `01` à `60`)
- Les insectes dorés ne possèdent pas d'images (affichage de cartes textuelles épurées).
