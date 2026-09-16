# 🔥 Ember Grid

A tactical, web-based card battle game inspired by classic grid mechanics, enhanced with strategic abilities, rare elite cards, and multiple game modes.

Play it live: **[https://sybernomad.github.io/ember-grid/](https://sybernomad.github.io/ember-grid/)**

---

## 🌟 Features

* **Two Game Modes:**
  * **Random Deck:** Quick-play action with a randomized 5-card hand.
  * **Snake Draft:** Strategic 5-card drafting from a shared pool of 16 cards.
* **Unique Card Abilities:**
  * ⚡ **Buff:** Boosts adjacent friendly card stats upon placement.
  * 💀 **Curse:** Permanently reduces the strongest enemy card's stats by 1.
  * 🔮 **Bolt:** Zaps a random enemy card on the board, reducing its stats by 2.
  * ⚖️ **Equalizer:** Captures adjacent enemy cards if touching stats match exactly.
  * 💥 **Blast:** Temporarily grants +2 to all stats on the turn it is played.
  * 🦠 **Poison:** Reduces all adjacent cards' stats by 1 at the end of every turn.
* **Rare 10/A Stat Cards:** Elite cards like *Titan* and *Celestial* feature elite **10 (`A`)** stats to break through tough defenses.
* **Ruleset Options:** Choose between **Ember Mode** (abilities enabled) and **Classic Mode** (pure stat-based gameplay).
* **AI Difficulty Tiers:** Easy, Normal, and Hard AI with smart tactical placement logic.
* **Quality of Life:** Built-in Card Compendium & Rules Guide, career stats tracker, dark/light themes, and mobile-friendly design.

---

## 🎮 How to Play

1. **Card Stats:** Each card has 4 directional stats (Top, Right, Bottom, Left) ranging from 1 to 10 (displayed as **`A`**). Stats are capped at 10.
2. **Placing & Capturing:** Take turns placing cards on the 3x3 grid. When your card touches an enemy card, if your touching stat is strictly higher than theirs, you capture it!
3. **Winning:** The player controlling the majority of the cards when the 3x3 grid fills up wins the match.

---

## 🚀 Running Locally

Ember Grid is entirely self-contained within a single file:

1. Clone or download this repository.
2. Open `index.html` in any modern web browser.

---

## 🛠️ Built With

* **HTML5 & CSS3** (Responsive design, custom properties, modern grid layouts)
* **Vanilla JavaScript** (Game engine, AI heuristics, state management)
* **Web Audio API** (Lightweight procedural sound synthesizer)
