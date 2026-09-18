# Ember Grid

A Triple Triad inspired card battle you can play in the browser. The **Base Set** is 50 cards in ten tribes. Every Ember card has an ability. Shuffle it, deal each player a **hand of five**, and play onto a 3x3 grid. Capture adjacent enemies by beating their touching stats. Control the most cards when the board fills.

## Balance sim

`python3 sim/balance.py` plays thousands of Ember matches with the same Normal AI the game uses. It writes `sim/BALANCE.md` (card tiers, ability win rates, tribe-vs-tribe). It does not change cards.

## How to play

1. **Deal Hands** - shuffle the Base Set and deal five to you, five to the AI. Or **Draft Hands** - spread sixteen from the deck and snake-pick until each hand is five. Or **Tribe Decks** - each player gets one tribe of five. You pick both decks, or leave either one random.
2. On your turn, play a card from your hand onto an empty cell. Drag it onto the grid, or tap the card and then tap the cell.
3. If your touching value is strictly higher than the enemy's, you capture their card. Equalizer cards also capture on a tie.
4. After nine cards are placed, the leftover card in each hand still counts. Two hands of five is ten cards, so 6+ wins and 5-5 is a draw.

**Rules**, **Compendium**, and **Options** sit as small buttons under the core rules. **Options** holds Game Mode (Ember / Classic), AI difficulty, and a Show Hands checkbox. The Compendium can filter by ability.

The first match shows a short coach: pick a card from your hand, play it on an empty cell, then capture an enemy. You can skip it.

Stats range from 1 to 10 (`A`). Boosts cannot raise a value above 10.

## The deck

The pile is **Base Set**: 50 cards (`BS-01` to `BS-50`) in ten tribes. Every Ember card has an ability, so a draft pick is always an ability pick. Classic Mode still strips abilities.

A bigger grid will deal a bigger hand. Tribe Decks already play a full hand of one tribe. A later builder can mix the 50. Expansions should add faces inside these tribes before inventing an eleventh ability.

## Draft hands

Sixteen cards from the deck. Snake order: the starting player takes 1, then the other takes 2, then pairs of 2 until each hand is 5. Cancel returns to the menu.

## Ember tribes

| Badge | Ability | Tribe | Cards | Effect |
| --- | --- | --- | --- | --- |
| ⚡ | Buff | Radiance | Celestial, Fairy, Unicorn, Paladin, Angel | While this card sits there, adjacent friendly cards get +1 to all stats |
| 💀 | Curse | Grave | Ghost, Vampire, Skull, Zombie, Bat | On play, the strongest enemy loses 1 from all stats, then this card captures |
| 💥 | Blast | Beasts | Dragon, T-Rex, Lion, Shark, Eagle | Temporary +2 to all stats on the play turn |
| 🦠 | Poison | Vermin | Spider, Scorpion, Snake, Frog, Beetle | End of every turn, adjacent enemies -1. Does not capture on the tick |
| ⚖️ | Equalizer | Balance | Monk, Titan, Robot, Owl, Alien | Captures when touching stats are equal |
| 💢 | Spite | Wrath | Cyclops, Gorilla, Wrath, Vendetta, Oni | When captured, the captor loses 1 from all stats |
| 🔇 | Silence | Hush | Dread, Hush, Raven, Ninja, Cat | Adjacent enemies lose their abilities while this card sits there. Capture still works |
| 🔥 | Cinder | Ember | Scorch, Brand, Fox, Phoenix, Lizard | On play, a random empty cell becomes Cindered. Occupant is -1 to all stats |
| 🔮 | Bolt | Arcane | Wizard, Genie, Witch, Mage, Imp | On play, zaps a random enemy -2 before this card captures |
| ❄️ | Chill | Frost | Frost, Wolf, Penguin, Polar, Seal | While this card sits there, adjacent enemies are -1. Counts for captures |

No ability destroys a card or blocks capture.

## Features

- Deal two hands of five from the Base Set, or draft them
- Tribe Decks: pick a tribe for you and the opponent, or leave either one random
- Ember / Classic modes in Options
- Rules and Card Compendium as their own buttons
- Options: Game Mode, AI difficulty, and a Show Hands checkbox
- Leftover hand card counts at the end of a match
- Replay keeps the same hands and switches who goes first
- Dark / light theme (saved in `localStorage`)
- Optional sound effects
- Career stats: record, win rate, streak, captures, most-played cards
- Alpha build number on the main menu. Bump `0.19` in `index.html` on every PR until 1.0 ships.
