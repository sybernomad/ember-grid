# Ember Grid

A Triple Triad-style card battle you can play in the browser. The **Base Set** is 70 cards in fourteen tribes. Every Ember card has an ability. Shuffle it, deal each player a **hand of five**, and play onto a 3x3 grid. Options can open a 4x4 (eight dealt), a 5x5 (thirteen dealt), or a Honeycomb of nineteen cells (ten dealt): you still hold five and draw from the rest of that deal after each play. Capture adjacent enemies by beating their touching stats. On the honeycomb, each card also has an upper-left and upper-right number so every hex side has a facing. Control the most cards when the grid fills.

## Balance sim

`python3 sim/balance.py` plays thousands of Ember matches with the same Normal AI the game uses. It writes `sim/BALANCE.md` (card tiers, ability win rates, tribe-vs-tribe). It does not change cards.

## How to play

**Play.** Put a card from your hand onto an empty cell. Drag it, or tap the card then the cell.

**Capture.** If your touching number is higher, you take that card. Equalizer also captures on a tie. In Classic Mode, you can turn on Ties capture in Options; Ember Mode never uses that setting.

**Win.** When the grid fills, most cards on the grid wins. Cards still in your hand do not count unless Leftover scores is on in Options.

The menu shows those three steps. **Rules** is the full book (How to Play, How to Win, The Table, Game Modes, Abilities). **Compendium** is the faces. **Options** holds Game Mode (Ember / Classic), Ties capture (Classic only, off by default), AI difficulty, Grid (3x3 / 4x4 / 5x5 / Honeycomb), Show Hands, Leftover scores, and Haptics. League and Tribe Decks stay 3x3.

**Deal Hands** shuffles the Base Set (five on 3x3, eight on 4x4, thirteen on 5x5, ten on Honeycomb). You always start with five in hand; bigger grids draw after you play. **Draft Hands** takes turns picking cards until both sides have a full deal. **Tribe Decks** is one tribe of five each on 3x3. **League** is you plus three named AI: draft twenty, then a season where everyone plays everyone twice, best of three.

The first match shows a short coach: pick a card from your hand, play it on an empty cell, then capture an enemy. You can skip it. **Tutorial** on the menu is three replayable lessons. Each turn shows you which card to play and where, against a weak opponent deck, so those plays win. Capture teaches the fight and the Battle log. On play teaches abilities that fire when you play a card. On the board teaches abilities that keep working. Tutorial matches are not added to your record.

Stats range from 1 to 10 (`A`). Boosts cannot raise a value above 10.

## The deck

The pile is **Base Set**: 70 cards (`BS-01` to `BS-70`) in fourteen tribes. Every Ember card has an ability, so a draft pick is always an ability pick. Classic Mode turns abilities off. **Ties capture** is a Classic Options setting, off by default. Ember never uses it, so Equalizer stays the only tie capture.

A bigger grid deals a bigger pile. Hands stay five; extras are drawn after you play. Tribe Decks stay a full tribe of five on 3x3. A later builder can mix the 70. Expansions should add faces inside these tribes before inventing a fifteenth ability.

## Draft hands

On 3x3: pick until five each. On 4x4: pick until eight each (start with five, draw after play). On 5x5: pick until thirteen each (start with five, draw after play). On Honeycomb: pick until ten each (start with five, draw after play). Cancel returns to the menu.

## Ember League

You plus Ash, Vesper, and Rook. Twenty cards, five each. Then six weeks so everyone plays everyone twice: you play each rival twice; each meeting is best of three and first player swaps. Their series resolve in the background and land on the table. Standings (series wins, then game wins, then combined grid score) and the schedule live on the league hub. The season saves if you leave for a casual game. End or start a new season anytime. Leftover and Ember/Classic lock when the season starts. All three AI use the Options difficulty. No Tribe Decks shortcut.

## Ember tribes

| Badge | Ability | Tribe | Cards | Effect |
| --- | --- | --- | --- | --- |
| ⚡ | Buff | Radiance | Celestial, Fairy, Unicorn, Paladin, Angel | While this card sits there, adjacent friendly cards get +1 to all stats |
| 💀 | Curse | Grave | Ghost, Vampire, Skull, Zombie, Bat | On play, the strongest enemy loses 1 from all stats, then this card captures |
| 💥 | Blast | Beasts | Dragon, T-Rex, Lion, Shark, Eagle | Temporary +2 to all stats on the play turn |
| 🦠 | Poison | Vermin | Spider, Scorpion, Snake, Frog, Beetle | End of every turn, adjacent enemies -1, then this card can capture |
| ⚖️ | Equalizer | Balance | Monk, Titan, Robot, Owl, Alien | Captures when touching stats are equal |
| 💢 | Spite | Wrath | Cyclops, Gorilla, Wrath, Vendetta, Oni | When captured, the captor loses 1 from all stats |
| 🔇 | Silence | Hush | Dread, Hush, Raven, Ninja, Cat | Adjacent enemies lose their abilities. Next to an enemy Silence, both cancel |
| 🔥 | Cinder | Ember | Scorch, Brand, Fox, Phoenix, Lizard | On play, a random empty cell becomes Cindered. Occupant is -1 to all stats |
| 🔮 | Bolt | Arcane | Wizard, Genie, Witch, Mage, Imp | On play, zaps a random enemy -2 before this card captures |
| ❄️ | Chill | Frost | Frost, Wolf, Penguin, Polar, Seal | While this card sits there, adjacent enemies are -1. Counts for captures |
| 🪞 | Parasite | Host | Mimic, Leech, Cuckoo, Doppel, Remora | On play, copies an adjacent enemy's ability for the rest of the match. On-play copies fire before capture |
| 🌀 | Siphon | Well | Kraken, Drain, Lamprey, Mosquito, Siphon | On play, steals 1 from each adjacent enemy's touching stat onto this card's opposite facing |
| ⏳ | Pendulum | Tide | Clock, Tide, Moon, Hourglass, Gyro | At the start of every turn, swaps top/bottom with left/right |
| 🌱 | Symbiosis | Grove | Worldtree, Mycelium, Coral, Lichen, Ivy | +1 to all stats for each capture its player has made this game (updates in hand) |

No ability destroys a card or blocks capture.

## Features

- Deal two hands of five from the Base Set, or draft them. Bigger grids deal more and draw into a hand of five.
- Tribe Decks: pick a tribe for you and the opponent, or leave either one random
- Ember League: you plus three AI, draft twenty, everyone plays everyone twice, best of three, crown. Saves if you leave. End or new season anytime.
- Ember / Classic modes in Options
- Rules and Card Compendium as their own buttons
- Options: Game Mode, Ties capture (Classic only, off by default), AI difficulty, Grid (3x3 / 4x4 / 5x5 / Honeycomb), Show Hands, Leftover scores (off by default), and Haptics (off by default)
- Leftover in hand does not count unless Leftover scores is on
- Replay keeps the same hands and switches who goes first
- Share a match code or link so someone else can play the same ten cards
- Dark ember theme
- Optional sound effects
- Career stats: record, win rate, streak, captures, most-played cards
- Live stats tint gold when buffed and red when debuffed. The printed face stays on the pip tooltip.
- Battle log window for the current match. Card names wear the team color they had on that play. Captures still flash on the cards; the grid itself stays clear of ellipsized text.
- Short table effects when an ability actually hits (Bolt arcs, Cinder sparks to the cell, and so on). Reduced motion keeps the color ring.
- Alpha build number on the main menu. Tap it for the changelog. Bump `0.37` in `index.html` on every PR until 1.0 ships.
- Source is split for editing: `css/table.css`, `js/cards.js`, `js/engine.js`, `js/ai.js`, `js/league.js`, `js/ui.js`. `index.html` is the page.
