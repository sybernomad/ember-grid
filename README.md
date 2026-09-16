# 🔥 Ember Grid

A tactical, web-based collectible card game inspired by classic card battle mechanics (such as Triple Triad), elevated with modern strategic abilities, procedural sound effects, and smooth responsive design.

Play it live right now: **[https://sybernomad.github.io/ember-grid/](https://sybernomad.github.io/ember-grid/)**

---

## 🌟 Features

* **Procedural Sound Engine:** Crisp arcade-style sound effects built entirely using the browser's Web Audio API (with distinct audio cues for player vs. AI captures!).
* **Tactical Card Abilities:** Cards aren't just numbers! Special cards possess unique traits:
* ⚡ **Aura Buffs:** Boost adjacent friendly card stats upon placement.
* 💀 **Shadow Curses:** Weaken adjacent enemy card stats.
* 🔮 **Ranged Hexes:** Automatically curse the strongest enemy card anywhere on the board.


* **Two Game Modes:**
  * **Standard Mode:** Jump right into action with a random 5-card hand.
  * **Snake Draft Mode:** Take turns drafting your 5-card deck from a shared pool of 16 cards.


* **AI Difficulty Tiers:** Choose between Easy, Normal, and Hard AI opponents with strategic placement logic.
* **Interactive Tooltips & Live Log:** Hover over ability cards to read their effects, and track every play, aura, and capture in real-time via the action log feed.
* **Quality-of-Life Perks:**
  * Select/Deselect cards in your hand freely.
  * Dark & Light theme toggles.
  * Audio mute/unmute switch.
  * Career stats tracker stored locally in your browser.
  * 100% Mobile & Desktop friendly layout.

---

## 🎮 How to Play

1. **Card Stats:** Each card has 4 numbers (Top, Right, Bottom, Left) ranging from 1 to 10 (displayed as **Aces / A**).
2. **Placing Cards:** Take turns placing your blue cards onto the 3×3 Ember Grid against the AI.
3. **Capturing:** When your card touches an enemy card, compare the adjacent sides. If your number is higher, you **flip** their card to your color!
4. **Winning:** The player controlling the majority of the board when all 9 squares are filled wins the match.

---

## 🚀 Running Locally

Because Ember Grid is written as a **single, self-contained HTML file** (combining structure, styling, and game logic), running it locally or deploying it takes seconds:

1. Clone or download this repository.
2. Open `index.html` in any modern web browser.
3. *(Optional)* To host it on GitHub Pages, simply push `index.html` to your repository's main branch and enable GitHub Pages under your repository settings pointing to that branch.

---

## 🛠️ Built With

* **HTML5 & CSS3** (Grid layouts, CSS custom properties, responsive media queries, and animations)
* **Vanilla JavaScript** (Game state management, AI heuristics, DOM rendering)
* **Web Audio API** (Procedural synthesizer for zero-dependency sound effects)
