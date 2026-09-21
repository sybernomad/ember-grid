# Ember Grid

A Triple Triad-style card battle you can play in the browser. The **Base Set** is 70 cards in fourteen tribes. Every Ember card has an ability. Shuffle it, deal each player a **hand of five**, and play onto a 3x3 grid. Capture adjacent enemies by beating their touching stats. Control the most cards when the board fills.

## Balance sim

`python3 sim/balance.py` plays thousands of Ember matches with the same Normal AI the game uses. It writes `sim/BALANCE.md` (card tiers, ability win rates, tribe-vs-tribe). It does not change cards.

## How to play

1. **Deal Hands** - shuffle the Base Set and deal five to you, five to the AI. Or **Draft Hands** - spread sixteen from the deck and snake-pick until each hand is five. Or **Tribe Decks** - each player gets one tribe of five. You pick both decks, or leave either one random. Or **League** - you plus three named AI snake-draft twenty cards, then play a six-week double round-robin. Each meeting is best of three.
2. On your turn, play a card from your hand onto an empty cell. Drag it onto the grid, or tap the card and then tap the cell.
3. If your touching value is strictly higher than the enemy's, you capture their card. Equalizer cards also capture on a tie. Classic Mode can turn on **Options → Ties capture** so equal facings capture; Ember Mode never uses that knob.
4. After nine cards are placed, most cards on the board wins. Leftover in hand does not count. **Options → Leftover scores** turns the extra point back on (a 5-4 board becomes a 5-5 draw).

**Rules**, **Compendium**, and **Options** sit as small buttons under the core rules. **Options** holds Game Mode (Ember / Classic), Ties capture (Classic only, off by default), AI difficulty, Show Hands, Leftover scores, and Haptics. The Compendium can filter by ability.

The first match shows a short coach: pick a card from your hand, play it on an empty cell, then capture an enemy. You can skip it.

Stats range from 1 to 10 (`A`). Boosts cannot raise a value above 10.

## The deck

The pile is **Base Set**: 70 cards (`BS-01` to `BS-70`) in fourteen tribes. Every Ember card has an ability, so a draft pick is always an ability pick. Classic Mode still strips abilities. **Ties capture** is a Classic Options knob, off by default. Ember never uses it, so Equalizer stays the only tie capture.

A bigger grid will deal a bigger hand. Tribe Decks already play a full hand of one tribe.

## Draft hands

Sixteen cards from the deck. Snake order: the starting player takes 1, then the other takes 2, then pairs of 2 until each hand is 5. Cancel returns to the menu.

## Ember League

You plus Ash, Vesper, and Rook. Twenty cards, snake among four, five each. Then six weeks so everyone plays everyone twice: you play each rival twice; each meeting is best of three and first player swaps. Their series resolve with the same engine and land on the table. Standings (series wins, then game wins, then combined board score) and the schedule live on the league hub. The season saves if you leave for a casual game. End or start a new season anytime. Leftover and Ember/Classic lock when the season starts. All three AI use the Options difficulty. No Tribe Decks shortcut.

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
| ⏳ | Pendulum | Tide | Pendulum, Tide, Moon, Hourglass, Gyro | At the start of every turn, swaps top/bottom with left/right |
| 🌱 | Symbiosis | Grove | Worldtree, Mycelium, Coral, Lichen, Ivy | +1 to all stats for each capture its player has made this game (updates in hand), then it can capture |

No ability destroys a card or blocks capture.

## Features

- Deal two hands of five from the Base Set, or draft them
- Tribe Decks: pick a tribe for you and the opponent, or leave either one random
- Ember League: you plus three AI, snake-draft twenty, double round-robin, best of three, crown. Saves if you leave. End or new season anytime.
- Ember / Classic modes in Options
- Rules and Card Compendium as their own buttons
- Options: Game Mode, Ties capture (Classic only, off by default), AI difficulty, Show Hands, Leftover scores (off by default), and Haptics (off by default)
- Leftover in hand does not count unless Leftover scores is on
- Replay keeps the same hands and switches who goes first
- Share a match code or link so someone else can play the same ten cards
- Dark ember theme
- Optional sound effects
- Career stats: record, win rate, streak, captures, most-played cards
- Live stats tint gold when buffed and red when debuffed. The printed face stays on the pip tooltip.
- Battle log window for the current match. Card names wear the team color they had on that play. Captures still flash on the cards; the grid itself stays clear of ellipsized text.
- Short table effects when an ability actually hits (Bolt arcs, Cinder sparks to the cell, and so on). Reduced motion keeps the color ring.
- Alpha build number on the main menu. Bump `0.33` in `index.html` on every PR until 1.0 ships.
