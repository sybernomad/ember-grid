# Ember Grid balance sim

Both seats use the live **Normal** AI heuristic. Ember abilities are on. This run is the current 70-card Base Set (14 tribes).

## Method

- **Random deals:** 100000 games. Shuffle the 70, deal 5 and 5. Who goes first is a coin flip.
- **Tribe decks:** every tribe vs every tribe, 40 games each (7840 games). Even games blue goes first, odd games red goes first.
- First player places 5 cards, second places 4. **Live default: leftover-off.** Only board ownership scores. Options can turn leftover scores on.
- Leftover-off on a filled 3x3 almost never draws (9 cards). First's 5 of 9 wins. Leftover-on (the option) still turns those 5-4 boards into 5-5 draws.
- **Leftover-on is the Options table rule**, recorded on the same games. AI play does not change.
- Card win rate is: when this card was in a seat's opening hand, how often that seat won (draws dropped).
- Capture stats only count flips during a match, including recaptures.
- The AI is the same greedy scorer as the browser game. It is not perfect play.

## Random deals - headline (live leftover-off)

- Results: blue 50070, red 49930, draw 0 (0.0% draws)
- First player win rate (excluding draws): 46.9%
- Second player win rate (excluding draws): 53.1%
- Of all games: first 46.9%, second 53.1%, draw 0.0%
- Mean card win rate: 50.0%

## Options: leftover scores (same games)

When leftover scores is on, unplayed cards count. First leftover 0, second leftover 1, so leftover-on draws are exactly first-owns-5 boards.

- Leftover-on results: blue 41134, red 40929, draw 17937 (17.9% draws)
- First player win rate (excluding leftover-on draws): 35.3%
- Second player win rate (excluding leftover-on draws): 64.7%
- Of all games: first 29.0%, second 53.1%, draw 17.9%

- Leftover hand sizes this run: first leftover 0 / second leftover 1: 100000.

On this 5-and-4 placement, leftover-on first score is board-first, leftover-on second score is board-second + 1. So leftover-on draws are exactly the 5-4 boards (first owns 5). Leftover-off gives those games to first. Leftover-on second wins (first owns 0-4) stay second wins.

| Leftover-on seat | Leftover-off seat | Games | Share |
| --- | --- | --- | --- |
| first | first | 28990 | 29.0% |
| second | second | 53073 | 53.1% |
| draw | first | 17937 | 17.9% |

| First-player board cards | Games | Leftover-on result | Leftover-off result |
| --- | --- | --- | --- |
| 0 of 9 | 1623 (1.6%) | second wins | second wins |
| 1 of 9 | 5934 (5.9%) | second wins | second wins |
| 2 of 9 | 11146 (11.1%) | second wins | second wins |
| 3 of 9 | 15455 (15.5%) | second wins | second wins |
| 4 of 9 | 18915 (18.9%) | second wins | second wins |
| 5 of 9 | 17937 (17.9%) | draw | first wins |
| 6 of 9 | 13247 (13.2%) | first wins | first wins |
| 7 of 9 | 9118 (9.1%) | first wins | first wins |
| 8 of 9 | 4832 (4.8%) | first wins | first wins |
| 9 of 9 | 1793 (1.8%) | first wins | first wins |

Ability seat win leftover-off vs leftover-on (draws dropped):

| Rank | Ability | Tribe | Leftover-off (live) | Leftover-on (option) | Delta |
| --- | --- | --- | --- | --- | --- |
| 1 | Blast | Beasts | 53.6% | 54.0% | -0.5 |
| 2 | Pendulum | Tide | 52.4% | 52.7% | -0.3 |
| 3 | Equalizer | Balance | 52.0% | 52.3% | -0.3 |
| 4 | Chill | Frost | 51.4% | 51.8% | -0.3 |
| 5 | Siphon | Well | 50.7% | 50.8% | -0.1 |
| 6 | Symbiosis | Grove | 50.7% | 51.0% | -0.3 |
| 7 | Buff | Radiance | 50.3% | 50.2% | +0.0 |
| 8 | Bolt | Arcane | 49.8% | 50.0% | -0.2 |
| 9 | Spite | Wrath | 49.5% | 49.4% | +0.1 |
| 10 | Silence | Hush | 49.4% | 49.3% | +0.1 |
| 11 | Poison | Vermin | 48.7% | 48.2% | +0.5 |
| 12 | Parasite | Host | 48.4% | 47.9% | +0.5 |
| 13 | Curse | Grave | 47.5% | 47.2% | +0.3 |
| 14 | Cinder | Ember | 45.8% | 45.4% | +0.4 |

Card win-rate movers leftover-on (option) → leftover-off (live):

| Card | Ability | Leftover-on | Leftover-off | Delta | On tier | Off tier |
| --- | --- | --- | --- | --- | --- | --- |
| Cuckoo | Parasite | 45.0% | 46.0% | +1.0 | C | C |
| Eagle | Blast | 56.3% | 55.3% | -1.0 | S | S |
| Owl | Equalizer | 56.8% | 56.0% | -0.9 | S | S |
| Zombie | Curse | 41.0% | 41.8% | +0.8 | D | D |
| Shark | Blast | 54.5% | 53.6% | -0.8 | A | A |
| Beetle | Poison | 47.5% | 48.3% | +0.8 | C | B |
| Spider | Poison | 49.3% | 50.0% | +0.8 | B | B |
| Moon | Pendulum | 56.4% | 55.7% | -0.8 | S | S |
| Frog | Poison | 44.2% | 44.9% | +0.7 | D | D |
| Pendulum | Pendulum | 54.2% | 53.5% | -0.7 | A | A |
| Frost | Chill | 54.5% | 53.8% | -0.7 | A | A |
| Mimic | Parasite | 46.2% | 46.8% | +0.7 | C | C |

## Ability / mechanic win rates (random deals)

Seat win rate = a player was dealt at least one card of that ability, then won.

| Rank | Ability | Tribe | Seat win | Card-avg win | Captures / play | Captured / play | Mean power |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Blast | Beasts | 53.6% | 54.0% | 0.83 | 1.02 | 20.0 |
| 2 | Pendulum | Tide | 52.4% | 52.6% | 0.78 | 0.99 | 19.2 |
| 3 | Equalizer | Balance | 52.0% | 52.2% | 0.86 | 0.92 | 17.8 |
| 4 | Chill | Frost | 51.4% | 51.8% | 0.88 | 0.81 | 18.4 |
| 5 | Siphon | Well | 50.7% | 50.7% | 0.82 | 1.19 | 19.2 |
| 6 | Symbiosis | Grove | 50.7% | 51.1% | 1.26 | 1.20 | 16.2 |
| 7 | Buff | Radiance | 50.3% | 50.3% | 0.68 | 0.97 | 19.0 |
| 8 | Bolt | Arcane | 49.8% | 49.8% | 0.72 | 1.13 | 19.4 |
| 9 | Spite | Wrath | 49.5% | 49.4% | 0.69 | 0.72 | 19.2 |
| 10 | Silence | Hush | 49.4% | 49.1% | 0.79 | 0.64 | 18.2 |
| 11 | Poison | Vermin | 48.7% | 48.3% | 2.19 | 0.82 | 17.2 |
| 12 | Parasite | Host | 48.4% | 48.4% | 1.23 | 1.34 | 19.0 |
| 13 | Curse | Grave | 47.5% | 47.1% | 0.69 | 0.66 | 17.4 |
| 14 | Cinder | Ember | 45.8% | 45.4% | 0.60 | 0.51 | 17.8 |

## Random deals - card tier list

Tiers are z-scores of card win rate vs the random-deal field. S >= 1.6sd, A >= 0.7, B middle, C <= -0.7, D <= -1.6.

| Tier | Card | Ability | Win | Dealt | Played | Captures / play | Captured / play | Kept | Power |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S | Owl | Equalizer | 56.0% | 14324 | 11441 | 1.02 | 1.05 | 68% | 16 |
| S | Moon | Pendulum | 55.7% | 14228 | 12660 | 0.86 | 1.07 | 75% | 19 |
| S | Eagle | Blast | 55.3% | 14269 | 12527 | 1.06 | 0.72 | 66% | 18 |
| A | Lion | Blast | 54.5% | 14268 | 13231 | 0.97 | 0.77 | 62% | 19 |
| A | T-Rex | Blast | 54.1% | 14232 | 13930 | 0.68 | 1.14 | 61% | 21 |
| A | Genie | Bolt | 53.9% | 14336 | 14222 | 0.64 | 1.48 | 62% | 21 |
| A | Frost | Chill | 53.8% | 14092 | 13786 | 0.92 | 1.03 | 59% | 19 |
| A | Gorilla | Spite | 53.7% | 14404 | 13849 | 0.62 | 0.94 | 58% | 21 |
| A | Shark | Blast | 53.6% | 14314 | 13993 | 0.81 | 1.37 | 63% | 20 |
| A | Monk | Equalizer | 53.5% | 14399 | 13910 | 0.76 | 1.25 | 62% | 20 |
| A | Pendulum | Pendulum | 53.5% | 14286 | 13489 | 0.70 | 1.24 | 76% | 20 |
| A | Unicorn | Buff | 53.0% | 14257 | 13526 | 0.75 | 1.38 | 63% | 20 |
| A | Drain | Siphon | 52.9% | 14052 | 13964 | 0.90 | 1.45 | 55% | 19 |
| A | Vampire | Curse | 52.4% | 14361 | 13288 | 0.92 | 1.25 | 58% | 19 |
| A | Polar | Chill | 52.3% | 14239 | 13981 | 0.87 | 0.92 | 55% | 19 |
| A | Wolf | Chill | 52.3% | 14337 | 13812 | 0.93 | 0.76 | 62% | 18 |
| A | Dragon | Blast | 52.3% | 14409 | 14188 | 0.63 | 1.11 | 48% | 22 |
| A | Gyro | Pendulum | 52.2% | 14377 | 12724 | 0.80 | 0.91 | 72% | 19 |
| B | Siphon | Siphon | 51.9% | 14143 | 13901 | 0.86 | 1.17 | 54% | 19 |
| B | Lichen | Symbiosis | 51.8% | 14342 | 14301 | 1.27 | 1.11 | 56% | 16 |
| B | Tide | Pendulum | 51.6% | 14351 | 12673 | 0.79 | 0.87 | 74% | 19 |
| B | Celestial | Buff | 51.5% | 14228 | 12611 | 0.82 | 1.20 | 59% | 19 |
| B | Ivy | Symbiosis | 51.5% | 14351 | 14327 | 1.30 | 1.23 | 54% | 16 |
| B | Alien | Equalizer | 51.4% | 14102 | 10690 | 0.87 | 0.68 | 73% | 17 |
| B | Wizard | Bolt | 51.4% | 14297 | 13898 | 0.70 | 1.20 | 50% | 20 |
| B | Cyclops | Spite | 51.3% | 14349 | 13632 | 0.70 | 0.86 | 53% | 20 |
| B | Titan | Equalizer | 51.3% | 14231 | 12861 | 0.85 | 1.12 | 60% | 19 |
| B | Remora | Parasite | 51.2% | 14374 | 14281 | 1.21 | 1.19 | 48% | 19 |
| B | Coral | Symbiosis | 50.8% | 14216 | 14201 | 1.41 | 1.40 | 56% | 16 |
| B | Worldtree | Symbiosis | 50.8% | 14176 | 14023 | 1.00 | 0.93 | 49% | 17 |
| B | Hush | Silence | 50.8% | 14167 | 13868 | 0.88 | 0.86 | 55% | 18 |
| B | Mosquito | Siphon | 50.8% | 14388 | 14118 | 0.90 | 1.26 | 42% | 19 |
| B | Mycelium | Symbiosis | 50.4% | 14291 | 14268 | 1.34 | 1.33 | 58% | 16 |
| B | Doppel | Parasite | 50.4% | 14128 | 14048 | 1.14 | 1.10 | 53% | 19 |
| B | Penguin | Chill | 50.3% | 14259 | 12982 | 0.84 | 0.70 | 67% | 18 |
| B | Angel | Buff | 50.1% | 14290 | 12463 | 0.74 | 0.99 | 64% | 19 |
| B | Hourglass | Pendulum | 50.1% | 14433 | 12413 | 0.74 | 0.85 | 74% | 19 |
| B | Paladin | Buff | 50.1% | 14314 | 12612 | 0.48 | 0.55 | 63% | 21 |
| B | Seal | Chill | 50.1% | 14223 | 12866 | 0.84 | 0.65 | 67% | 18 |
| B | Spider | Poison | 50.0% | 14293 | 13560 | 2.17 | 0.64 | 59% | 18 |
| B | Wrath | Spite | 50.0% | 14465 | 11737 | 0.82 | 0.70 | 70% | 18 |
| B | Skull | Curse | 49.9% | 14260 | 10440 | 0.81 | 0.72 | 73% | 17 |
| B | Snake | Poison | 49.7% | 14391 | 14129 | 2.76 | 1.18 | 53% | 18 |
| B | Mage | Bolt | 49.3% | 14081 | 13714 | 0.83 | 1.27 | 55% | 19 |
| B | Raven | Silence | 49.3% | 14320 | 14074 | 0.84 | 0.74 | 49% | 19 |
| B | Lamprey | Siphon | 49.3% | 14248 | 13809 | 0.79 | 0.95 | 60% | 19 |
| B | Dread | Silence | 48.9% | 14332 | 13353 | 0.69 | 0.47 | 67% | 18 |
| B | Kraken | Siphon | 48.8% | 14313 | 13883 | 0.64 | 1.14 | 47% | 20 |
| B | Robot | Equalizer | 48.6% | 14284 | 10277 | 0.81 | 0.47 | 79% | 17 |
| B | Scorpion | Poison | 48.6% | 14314 | 14153 | 2.67 | 0.93 | 52% | 19 |
| B | Oni | Spite | 48.4% | 14392 | 12656 | 0.75 | 0.73 | 66% | 19 |
| B | Beetle | Poison | 48.3% | 14319 | 13242 | 2.04 | 0.73 | 60% | 17 |
| B | Cat | Silence | 48.2% | 14186 | 12641 | 0.63 | 0.34 | 75% | 17 |
| B | Witch | Bolt | 48.1% | 14019 | 12997 | 0.69 | 0.81 | 62% | 19 |
| B | Ninja | Silence | 48.0% | 14294 | 14154 | 0.89 | 0.80 | 42% | 19 |
| C | Leech | Parasite | 47.3% | 14112 | 14051 | 1.25 | 1.29 | 45% | 19 |
| C | Scorch | Cinder | 47.1% | 14393 | 11177 | 0.70 | 0.62 | 73% | 18 |
| C | Fairy | Buff | 46.9% | 14282 | 9493 | 0.61 | 0.73 | 77% | 16 |
| C | Mimic | Parasite | 46.8% | 14256 | 14228 | 1.39 | 1.89 | 52% | 19 |
| C | Phoenix | Cinder | 46.4% | 14385 | 12138 | 0.64 | 0.69 | 69% | 19 |
| C | Imp | Bolt | 46.3% | 14346 | 12701 | 0.72 | 0.88 | 61% | 18 |
| C | Ghost | Curse | 46.0% | 14231 | 9253 | 0.59 | 0.49 | 81% | 17 |
| C | Cuckoo | Parasite | 46.0% | 14256 | 14113 | 1.17 | 1.21 | 43% | 19 |
| C | Fox | Cinder | 45.9% | 14214 | 9004 | 0.62 | 0.41 | 83% | 16 |
| C | Bat | Curse | 45.6% | 14330 | 10652 | 0.69 | 0.51 | 74% | 18 |
| D | Frog | Poison | 44.9% | 14566 | 11963 | 1.32 | 0.62 | 67% | 14 |
| D | Lizard | Cinder | 44.3% | 14253 | 10510 | 0.57 | 0.50 | 77% | 18 |
| D | Vendetta | Spite | 43.7% | 14261 | 9968 | 0.55 | 0.38 | 80% | 18 |
| D | Brand | Cinder | 43.1% | 14474 | 10163 | 0.50 | 0.36 | 80% | 18 |
| D | Zombie | Curse | 41.8% | 14293 | 8209 | 0.45 | 0.31 | 86% | 16 |

- **S:** Owl, Moon, Eagle
- **A:** Lion, T-Rex, Genie, Frost, Gorilla, Shark, Monk, Pendulum, Unicorn, Drain, Vampire, Polar, Wolf, Dragon, Gyro
- **B:** Siphon, Lichen, Tide, Celestial, Ivy, Alien, Wizard, Cyclops, Titan, Remora, Coral, Worldtree, Hush, Mosquito, Mycelium, Doppel, Penguin, Angel, Hourglass, Paladin, Seal, Spider, Wrath, Skull, Snake, Mage, Raven, Lamprey, Dread, Kraken, Robot, Scorpion, Oni, Beetle, Cat, Witch, Ninja
- **C:** Leech, Scorch, Fairy, Mimic, Phoenix, Imp, Ghost, Cuckoo, Fox, Bat
- **D:** Frog, Lizard, Vendetta, Brand, Zombie

## Tribe decks - mechanic vs mechanic

Each cell is the row tribe's record against the column tribe as W-L-D (row is blue's tribe). Diagonal is the mirror.

| vs | Buff | Curs | Blas | Pois | Equa | Spit | Sile | Cind | Bolt | Chil | Para | Siph | Pend | Symb | vs field |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Buff | 20-20-0 | 23-17-0 | 20-20-0 | 20-20-0 | 31-9-0 | 20-20-0 | 40-0-0 | 29-11-0 | 19-21-0 | 31-9-0 | 35-5-0 | 36-4-0 | 9-31-0 | 39-1-0 | 66.4% (372-188-0) |
| Curse | 16-24-0 | 25-15-0 | 33-7-0 | 11-29-0 | 8-32-0 | 12-28-0 | 40-0-0 | 23-17-0 | 6-34-0 | 18-22-0 | 16-24-0 | 18-22-0 | 14-26-0 | 13-27-0 | 45.2% (253-307-0) |
| Blast | 20-20-0 | 8-32-0 | 20-20-0 | 40-0-0 | 0-40-0 | 40-0-0 | 20-20-0 | 29-11-0 | 30-10-0 | 9-31-0 | 14-26-0 | 10-30-0 | 13-27-0 | 20-20-0 | 48.8% (273-287-0) |
| Poison | 20-20-0 | 28-12-0 | 0-40-0 | 16-24-0 | 4-36-0 | 0-40-0 | 15-25-0 | 22-18-0 | 10-30-0 | 0-40-0 | 20-20-0 | 6-34-0 | 33-7-0 | 20-20-0 | 34.6% (194-366-0) |
| Equalizer | 12-28-0 | 27-13-0 | 40-0-0 | 35-5-0 | 20-20-0 | 0-40-0 | 40-0-0 | 24-16-0 | 19-21-0 | 11-29-0 | 26-14-0 | 16-24-0 | 11-29-0 | 38-2-0 | 57.0% (319-241-0) |
| Spite | 20-20-0 | 21-19-0 | 0-40-0 | 40-0-0 | 40-0-0 | 20-20-0 | 40-0-0 | 29-11-0 | 21-19-0 | 3-37-0 | 13-27-0 | 24-16-0 | 14-26-0 | 40-0-0 | 58.0% (325-235-0) |
| Silence | 0-40-0 | 0-40-0 | 20-20-0 | 29-11-0 | 0-40-0 | 0-40-0 | 18-22-0 | 20-20-0 | 0-40-0 | 12-28-0 | 8-32-0 | 13-27-0 | 20-20-0 | 38-2-0 | 31.8% (178-382-0) |
| Cinder | 5-35-0 | 27-13-0 | 9-31-0 | 19-21-0 | 10-30-0 | 14-26-0 | 25-15-0 | 19-21-0 | 11-29-0 | 0-40-0 | 12-28-0 | 13-27-0 | 17-23-0 | 29-11-0 | 37.5% (210-350-0) |
| Bolt | 15-25-0 | 35-5-0 | 9-31-0 | 26-14-0 | 16-24-0 | 19-21-0 | 40-0-0 | 26-14-0 | 23-17-0 | 11-29-0 | 22-18-0 | 23-17-0 | 12-28-0 | 23-17-0 | 53.6% (300-260-0) |
| Chill | 9-31-0 | 14-26-0 | 34-6-0 | 40-0-0 | 26-14-0 | 38-2-0 | 31-9-0 | 40-0-0 | 30-10-0 | 23-17-0 | 5-35-0 | 16-24-0 | 22-18-0 | 40-0-0 | 65.7% (368-192-0) |
| Parasite | 8-32-0 | 22-18-0 | 28-12-0 | 23-17-0 | 7-33-0 | 23-17-0 | 36-4-0 | 24-16-0 | 15-25-0 | 31-9-0 | 22-18-0 | 29-11-0 | 14-26-0 | 30-10-0 | 55.7% (312-248-0) |
| Siphon | 4-36-0 | 19-21-0 | 28-12-0 | 33-7-0 | 23-17-0 | 17-23-0 | 29-11-0 | 25-15-0 | 15-25-0 | 29-11-0 | 14-26-0 | 21-19-0 | 5-35-0 | 24-16-0 | 51.1% (286-274-0) |
| Pendulum | 30-10-0 | 26-14-0 | 27-13-0 | 10-30-0 | 33-7-0 | 29-11-0 | 20-20-0 | 27-13-0 | 30-10-0 | 25-15-0 | 24-16-0 | 27-13-0 | 19-21-0 | 3-37-0 | 58.9% (330-230-0) |
| Symbiosis | 6-34-0 | 24-16-0 | 20-20-0 | 20-20-0 | 5-35-0 | 0-40-0 | 5-35-0 | 14-26-0 | 14-26-0 | 3-37-0 | 10-30-0 | 14-26-0 | 39-1-0 | 18-22-0 | 34.3% (192-368-0) |

Tribe standing when playing a full five-card tribe deck:

1. **Buff** (Radiance) 66.4% (372-188-0)
2. **Chill** (Frost) 65.7% (368-192-0)
3. **Pendulum** (Tide) 58.9% (330-230-0)
4. **Spite** (Wrath) 58.0% (325-235-0)
5. **Equalizer** (Balance) 57.0% (319-241-0)
6. **Parasite** (Host) 55.7% (312-248-0)
7. **Bolt** (Arcane) 53.6% (300-260-0)
8. **Siphon** (Well) 51.1% (286-274-0)
9. **Blast** (Beasts) 48.8% (273-287-0)
10. **Curse** (Grave) 45.2% (253-307-0)
11. **Cinder** (Ember) 37.5% (210-350-0)
12. **Poison** (Vermin) 34.6% (194-366-0)
13. **Symbiosis** (Grove) 34.3% (192-368-0)
14. **Silence** (Hush) 31.8% (178-382-0)

## Tribe decks - card tiers (mono-tribe seats only)

These numbers are not mixed-hand numbers. A weak card can look better when it always sits next to four friends of the same ability.

| Tier | Card | Ability | Win | Captures / play | Captured / play | Kept |
| --- | --- | --- | --- | --- | --- | --- |
| A | Unicorn | Buff | 66.7% | 1.00 | 1.52 | 58% |
| A | Celestial | Buff | 66.7% | 0.94 | 1.17 | 58% |
| A | Angel | Buff | 66.7% | 0.78 | 0.48 | 73% |
| A | Paladin | Buff | 66.7% | 0.50 | 0.44 | 64% |
| A | Fairy | Buff | 66.7% | 0.34 | 0.14 | 100% |
| A | Wolf | Chill | 64.5% | 0.91 | 0.41 | 70% |
| A | Penguin | Chill | 64.5% | 0.76 | 0.29 | 84% |
| A | Seal | Chill | 64.5% | 0.72 | 0.36 | 81% |
| A | Frost | Chill | 64.5% | 0.71 | 0.99 | 54% |
| A | Polar | Chill | 64.5% | 0.70 | 0.76 | 52% |
| A | Owl | Equalizer | 58.6% | 1.05 | 1.12 | 60% |
| A | Robot | Equalizer | 58.6% | 1.00 | 0.42 | 69% |
| A | Titan | Equalizer | 58.6% | 1.00 | 1.70 | 48% |
| A | Alien | Equalizer | 58.6% | 0.92 | 0.54 | 68% |
| A | Monk | Equalizer | 58.6% | 0.48 | 1.61 | 72% |
| A | Cyclops | Spite | 58.3% | 0.98 | 0.60 | 50% |
| A | Oni | Spite | 58.3% | 0.87 | 0.79 | 60% |
| A | Wrath | Spite | 58.3% | 0.72 | 0.39 | 73% |
| A | Vendetta | Spite | 58.3% | 0.70 | 0.34 | 80% |
| A | Gorilla | Spite | 58.3% | 0.51 | 0.84 | 45% |
| B | Gyro | Pendulum | 57.9% | 0.99 | 1.08 | 60% |
| B | Moon | Pendulum | 57.9% | 0.95 | 0.78 | 73% |
| B | Tide | Pendulum | 57.9% | 0.90 | 0.94 | 66% |
| B | Hourglass | Pendulum | 57.9% | 0.84 | 0.93 | 68% |
| B | Pendulum | Pendulum | 57.9% | 0.48 | 2.25 | 74% |
| B | Leech | Parasite | 56.3% | 1.05 | 0.89 | 66% |
| B | Mimic | Parasite | 56.3% | 0.94 | 1.41 | 61% |
| B | Doppel | Parasite | 56.3% | 0.92 | 0.72 | 69% |
| B | Cuckoo | Parasite | 56.3% | 0.92 | 0.82 | 73% |
| B | Remora | Parasite | 56.3% | 0.83 | 0.81 | 71% |
| B | Wizard | Bolt | 55.1% | 1.00 | 1.37 | 43% |
| B | Mage | Bolt | 55.1% | 0.95 | 0.61 | 60% |
| B | Witch | Bolt | 55.1% | 0.87 | 0.51 | 63% |
| B | Imp | Bolt | 55.1% | 0.66 | 0.26 | 96% |
| B | Genie | Bolt | 55.1% | 0.43 | 1.68 | 63% |
| B | Mosquito | Siphon | 51.8% | 0.89 | 1.36 | 61% |
| B | Drain | Siphon | 51.8% | 0.85 | 0.78 | 62% |
| B | Lamprey | Siphon | 51.8% | 0.76 | 0.51 | 73% |
| B | Siphon | Siphon | 51.8% | 0.76 | 0.43 | 70% |
| B | Kraken | Siphon | 51.8% | 0.43 | 1.17 | 24% |
| B | Shark | Blast | 48.7% | 0.94 | 1.01 | 71% |
| B | T-Rex | Blast | 48.7% | 0.84 | 0.61 | 63% |
| B | Eagle | Blast | 48.7% | 0.84 | 0.05 | 98% |
| B | Lion | Blast | 48.7% | 0.69 | 0.49 | 59% |
| B | Dragon | Blast | 48.7% | 0.49 | 1.28 | 16% |
| B | Bat | Curse | 45.9% | 0.98 | 0.99 | 30% |
| B | Skull | Curse | 45.9% | 0.96 | 0.84 | 28% |
| B | Ghost | Curse | 45.9% | 0.94 | 0.90 | 52% |
| B | Zombie | Curse | 45.9% | 0.68 | 0.14 | 92% |
| B | Vampire | Curse | 45.9% | 0.50 | 2.18 | 86% |
| C | Scorch | Cinder | 37.4% | 0.77 | 1.17 | 53% |
| C | Fox | Cinder | 37.4% | 0.64 | 0.57 | 77% |
| C | Lizard | Cinder | 37.4% | 0.63 | 0.86 | 58% |
| C | Brand | Cinder | 37.4% | 0.58 | 0.47 | 67% |
| C | Phoenix | Cinder | 37.4% | 0.35 | 1.21 | 40% |
| C | Scorpion | Poison | 35.0% | 2.92 | 1.21 | 22% |
| C | Snake | Poison | 35.0% | 2.71 | 1.23 | 31% |
| C | Spider | Poison | 35.0% | 2.45 | 1.25 | 39% |
| C | Beetle | Poison | 35.0% | 1.47 | 0.64 | 55% |
| C | Frog | Poison | 35.0% | 0.54 | 0.44 | 81% |
| C | Coral | Symbiosis | 33.7% | 1.30 | 0.70 | 40% |
| C | Mycelium | Symbiosis | 33.7% | 0.90 | 0.49 | 61% |
| C | Ivy | Symbiosis | 33.7% | 0.89 | 0.54 | 59% |
| C | Lichen | Symbiosis | 33.7% | 0.85 | 0.48 | 60% |
| C | Worldtree | Symbiosis | 33.7% | 0.35 | 1.16 | 20% |
| D | Hush | Silence | 30.3% | 0.72 | 0.53 | 61% |
| D | Cat | Silence | 30.3% | 0.61 | 0.12 | 94% |
| D | Ninja | Silence | 30.3% | 0.60 | 0.99 | 32% |
| D | Dread | Silence | 30.3% | 0.53 | 0.43 | 59% |
| D | Raven | Silence | 30.3% | 0.46 | 1.06 | 34% |

## Read of the data

**Live leftover-off is close to even.** First player won 46.9% of decided leftover-off games, second won 53.1%, and 0.0% of all games were draws. Of every random deal, that is first 46.9% / second 53.1% / draw 0.0%. Second is only slightly ahead because they still take the last capture.

**Leftover-on (the Options rule) is the old 70%.** Same games: first 29.0% / second 53.1% / draw 17.9% of all games (35.3% / 64.7% of leftover-on decided). Leftover-on draws are first-owns-5 boards; leftover-off gives those to first. It does not invert the 70%.

Ability spread in mixed hands is **7.8 points** from Blast (53.6%) to Cinder (45.8%).

**Buff is the strongest tribe deck** at 66.4%. Mixed-hand Buff is 50.3%.

**Pendulum covers both axes.** Mixed 52.4%, mono-tribe 58.9%. A five-of Tide board always has a swung 8 or 7 on the live axis, which is why the tribe matrix runs away.

**Parasite and Siphon land near even** in mixed hands (48.4% / 50.7%). Tribe decks 55.7% / 51.1%. Copy and steal need an adjacent enemy, so they do not snowball as a five-of the way Pendulum does.

**Symbiosis is +1 per capture this game.** Mixed 50.7% (mean power 16.2), mono-Grove 34.3%. A late Grove card still sits at the player's capture count, including in hand. One capture pass after it grows.

**Poison ticks adjacent enemies, then those cards can capture.** Mixed-hand seat win 48.7%. Mono-tribe 34.6%. Friendlies are safe. One capture pass after the tick, no second wave.

**Blast is mid as a tribe** at 48.8%. Mixed-hand Blast is 53.6%. The +2 on play still stacks as a game plan, just not the matrix leader anymore.

**Chill holds up in both views** (mixed 51.4%, tribe 65.7%). **Silence does not.** Mixed 49.4% is fine; five Silences together (31.8%) just turn the board into mediocre stat-sticks.

**Over-performing mixed-hand faces (S):** Owl (56.0%, power 16, keep 68%), Moon (55.7%, power 19, keep 75%), Eagle (55.3%, power 18, keep 66%).
Nerf the body, not the ability, unless the whole tribe is also top of the matrix.

**Under-performing mixed-hand faces (D):** Frog (44.9%, power 14, keep 67%), Lizard (44.3%, power 18, keep 77%), Vendetta (43.7%, power 18, keep 80%), Brand (43.1%, power 18, keep 80%), Zombie (41.8%, power 16, keep 86%).

## Suggestions (do not apply yet)

1. **Do not nerf Pendulum as a rule.** Mixed Tide is a lead, not a broken on-play. The tribe-deck runaway is five cards that all swing axes. If Tribe Decks stay a first-class mode, shave the extreme axis faces (Moon's Left 8, Pendulum's 8/2/8/2) rather than the swap.
2. **Moon** mixed 55.7%, keep 75%, power 19. Printed 2/7/2/8 becomes 8/2/7/2 after one swing. Shave Left 8→7 so the live top after the first swing is 7. That is the one Tide face to touch.
3. **Grove is capture-count, not sit-and-wait.** Lichen 51.8% / Ivy 51.5%. Re-read mixed-hand and the tribe matrix. If Grove overshoots Chill, take back the capture pass before adding body power.
4. **Mimic** mixed 46.8%, A-left (3/2/4/A), keep 52%. Left was the empty axis, so the 19-power copy card jumped. If it stays S, move the A to Right (3/A/4/2) so it shares Paladin 8 / Kraken 9 instead of sitting alone.
5. **Worldtree** mixed 50.8%, A-right (2/A/3/2). The 2-top is the farm window. Do not add power. If Grove stays the floor, swap so Worldtree is the A-left instead of Mimic.
6. **Kraken** mixed 48.8%, keep 47%, power 20. The 9-right plays like Dragon's 9/7: farmed after the sit. Leave Siphon's steal. If it stays C, move 1 off Right onto Left (4/8/3/5) rather than adding power.
7. **Leave Parasite and Siphon rules alone.** Mixed Parasite is a mild lead because Mimic is S, not because copy is broken. Drain is the Well face that is actually good; that is fine.
8. **Poison now ticks enemies, then captures once.** Re-read mixed-hand and the tribe matrix. If Vermin overshoots Chill, the capture pass is the first thing to take back, not Frog's body. If it is still the floor, bump Frog/Beetle after Grove bodies.
9. **Do not nerf Blast as a rule.** Mixed Blast is a mild lead. Mono Blast is no longer the matrix leader.
10. **Dragon** mixed 52.3%, keep 48%, power 22. Rear 3→4 this pass did not lift keep - still farmed after the 9/7 play. Leave Left at 2 unless we want another bump.
11. **Paladin** mixed 50.1%, power 21. Shaving one 8 to 7 (4/8/7/2) took it off S. Stop here. Do not nerf Buff itself.
12. **Genie is a 6/5/5/5 Bolt.** The -2 zap is swingy. If Genie is S, shave one 5 to a 4. Do not tone down Bolt's -2.
13. **Celestial** mixed 51.5%. A moved Top this pass (A/2/3/4). Leave the 2 on Right unless it falls back to C.
14. **Frog (44.9%, power 14) is still a floor face.** Poison only hits enemies now. If Frog is still D after a Grove bump, try 3/4/5/4.
15. **Owl punches above power 16** (56.0%, Equalizer). That is fine as the 'small Equalizer'. Do not buff other Balance faces to match it.
16. **Silence is fine in mixed hands and bad as a five-of.** Same class as Grove/Vermin as a tribe deck. No change unless we care about mono-Hush doing something besides the cancel.
17. **Do not chase first-player win rate with card stats.** Last-capture is the leftover-off remainder.
18. **Leftover-off is the live default.** Seat math is first 46.9% / second 53.1% / draw 0.0%. Leftover-on (Options) is first 29.0% / second 53.1% / draw 17.9%. Keep leftover scores off unless you want 5-5 draws back.
19. Re-run `python3 sim/balance.py --random 4000 --tribe-games 40 --seed 1` after any facing change. A 1-point bump moves a card a full tier in this AI.

## How to re-run

```
python3 sim/balance.py --random 4000 --tribe-games 40 --seed 1
```

