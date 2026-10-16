# Ember Grid balance sim

Both seats use the live **Normal** AI heuristic. Ember abilities are on. This run is the current 85-card pile: Base Set plus Harvest (17 tribes).

## Method

- **Random deals:** 4000 games. Shuffle the 85, deal 5 and 5. Who goes first is a coin flip.
- **Tribe decks:** every tribe vs every tribe, 40 games each (11560 games). Even games blue goes first, odd games red goes first.
- First player places 5 cards, second places 4. **Live default: leftover-off.** Only board ownership scores. Options can turn leftover scores on.
- Leftover-off on a filled 3x3 almost never draws (9 cards). First's 5 of 9 wins. Leftover-on (the option) still turns those 5-4 boards into 5-5 draws.
- **Leftover-on is the Options table rule**, recorded on the same games. AI play does not change.
- Card win rate is: when this card was in a seat's opening hand, how often that seat won (draws dropped).
- Capture stats only count flips during a match, including recaptures.
- The AI is the same greedy scorer as the browser game. It is not perfect play.

## Random deals - headline (live leftover-off)

- Results: blue 2024, red 1976, draw 0 (0.0% draws)
- First player win rate (excluding draws): 52.2%
- Second player win rate (excluding draws): 47.8%
- Of all games: first 52.2%, second 47.8%, draw 0.0%
- Mean card win rate: 50.0%

## Options: leftover scores (same games)

When leftover scores is on, unplayed cards count. First leftover 0, second leftover 1, so leftover-on draws are exactly first-owns-5 boards.

- Leftover-on results: blue 1517, red 1523, draw 960 (24.0% draws)
- First player win rate (excluding leftover-on draws): 37.1%
- Second player win rate (excluding leftover-on draws): 62.9%
- Of all games: first 28.2%, second 47.8%, draw 24.0%

- Leftover hand sizes this run: first leftover 0 / second leftover 1: 4000.

On this 5-and-4 placement, leftover-on first score is board-first, leftover-on second score is board-second + 1. So leftover-on draws are exactly the 5-4 boards (first owns 5). Leftover-off gives those games to first. Leftover-on second wins (first owns 0-4) stay second wins.

| Leftover-on seat | Leftover-off seat | Games | Share |
| --- | --- | --- | --- |
| first | first | 1127 | 28.2% |
| second | second | 1913 | 47.8% |
| draw | first | 960 | 24.0% |

| First-player board cards | Games | Leftover-on result | Leftover-off result |
| --- | --- | --- | --- |
| 0 of 9 | 26 (0.7%) | second wins | second wins |
| 1 of 9 | 119 (3.0%) | second wins | second wins |
| 2 of 9 | 265 (6.6%) | second wins | second wins |
| 3 of 9 | 554 (13.8%) | second wins | second wins |
| 4 of 9 | 949 (23.7%) | second wins | second wins |
| 5 of 9 | 960 (24.0%) | draw | first wins |
| 6 of 9 | 647 (16.2%) | first wins | first wins |
| 7 of 9 | 336 (8.4%) | first wins | first wins |
| 8 of 9 | 124 (3.1%) | first wins | first wins |
| 9 of 9 | 20 (0.5%) | first wins | first wins |

Ability seat win leftover-off vs leftover-on (draws dropped):

| Rank | Ability | Leftover-off (live) | Leftover-on (option) | Delta |
| --- | --- | --- | --- | --- |
| 1 | Blast | 54.9% | 56.2% | -1.3 |
| 2 | Chill | 52.8% | 54.0% | -1.3 |
| 3 | Pendulum | 52.1% | 53.1% | -1.0 |
| 4 | Wither | 52.0% | 52.1% | -0.1 |
| 5 | Equalizer | 51.9% | 52.5% | -0.6 |
| 6 | Poison | 51.9% | 51.7% | +0.2 |
| 7 | Buff | 51.0% | 50.6% | +0.4 |
| 8 | Spite | 50.5% | 50.7% | -0.2 |
| 9 | Parasite | 49.6% | 48.9% | +0.7 |
| 10 | Bolt | 49.4% | 49.3% | +0.0 |
| 11 | Siphon | 49.4% | 49.8% | -0.5 |
| 12 | Notch | 49.3% | 49.4% | -0.1 |
| 13 | Silence | 47.8% | 46.9% | +0.9 |
| 14 | Symbiosis | 47.7% | 47.1% | +0.6 |
| 15 | Curse | 47.0% | 46.6% | +0.4 |
| 16 | March | 46.8% | 46.0% | +0.9 |
| 17 | Cinder | 45.9% | 45.3% | +0.6 |

Card win-rate movers leftover-on (option) → leftover-off (live):

| Card | Ability | Leftover-on | Leftover-off | Delta | On tier | Off tier |
| --- | --- | --- | --- | --- | --- | --- |
| Vampire | Curse | 58.0% | 54.1% | -3.8 | S | A |
| Fairy | Buff | 45.5% | 49.1% | +3.6 | C | B |
| Penguin | Chill | 56.7% | 53.1% | -3.6 | A | A |
| Cuckoo | Parasite | 43.1% | 46.5% | +3.4 | C | C |
| Bat | Curse | 43.4% | 46.7% | +3.3 | C | C |
| Brand | Cinder | 46.6% | 49.8% | +3.2 | B | B |
| Shark | Blast | 61.8% | 59.0% | -2.8 | S | S |
| Lamprey | Siphon | 53.6% | 51.1% | -2.5 | A | B |
| Titan | Equalizer | 53.7% | 51.5% | -2.2 | A | B |
| Coral | Symbiosis | 47.6% | 49.8% | +2.2 | B | B |
| Spider | Poison | 53.6% | 51.4% | -2.2 | A | B |
| Worldtree | Symbiosis | 44.1% | 46.2% | +2.1 | C | C |

## Ability / mechanic win rates (random deals)

Seat win rate = a player was dealt at least one card of that ability, then won.

| Rank | Ability | Seat win | Card-avg win | Captures / play | Captured / play | Mean power |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Blast | 54.9% | 55.5% | 0.88 | 0.90 | 20.0 |
| 2 | Chill | 52.8% | 53.4% | 0.94 | 0.71 | 18.4 |
| 3 | Pendulum | 52.1% | 51.8% | 0.81 | 0.96 | 19.2 |
| 4 | Wither | 52.0% | 51.8% | 0.35 | 1.28 | 16.8 |
| 5 | Equalizer | 51.9% | 52.1% | 0.90 | 0.87 | 17.8 |
| 6 | Poison | 51.9% | 52.3% | 2.40 | 0.66 | 17.2 |
| 7 | Buff | 51.0% | 51.5% | 0.74 | 0.96 | 19.0 |
| 8 | Spite | 50.5% | 50.9% | 0.75 | 0.60 | 19.2 |
| 9 | Parasite | 49.6% | 49.7% | 0.94 | 1.32 | 19.0 |
| 10 | Bolt | 49.4% | 48.7% | 0.77 | 0.97 | 19.4 |
| 11 | Siphon | 49.4% | 49.5% | 0.86 | 1.03 | 19.2 |
| 12 | Notch | 49.3% | 49.2% | 0.86 | 0.54 | 17.0 |
| 13 | Silence | 47.8% | 47.7% | 0.79 | 0.62 | 18.2 |
| 14 | Symbiosis | 47.7% | 48.0% | 0.54 | 1.47 | 16.2 |
| 15 | Curse | 47.0% | 46.5% | 0.76 | 0.68 | 17.4 |
| 16 | March | 46.8% | 45.7% | 0.70 | 0.36 | 17.0 |
| 17 | Cinder | 45.9% | 45.6% | 0.68 | 0.51 | 17.8 |

## Random deals - card tier list

Tiers are z-scores of card win rate vs the random-deal field. S >= 1.6sd, A >= 0.7, B middle, C <= -0.7, D <= -1.6.

| Tier | Card | Ability | Win | Dealt | Played | Captures / play | Captured / play | Kept | Power |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S | Shark | Blast | 59.0% | 476 | 466 | 0.89 | 1.19 | 58% | 20 |
| S | Lion | Blast | 57.3% | 503 | 465 | 1.01 | 0.65 | 63% | 19 |
| S | Frost | Chill | 56.8% | 440 | 435 | 0.99 | 0.85 | 59% | 19 |
| A | Cobweb | Wither | 55.8% | 482 | 420 | 0.36 | 1.25 | 74% | 17 |
| A | Carver | Notch | 55.4% | 446 | 389 | 0.98 | 0.56 | 69% | 18 |
| A | Owl | Equalizer | 55.2% | 460 | 387 | 1.03 | 0.94 | 64% | 16 |
| A | Dragon | Blast | 55.0% | 471 | 460 | 0.69 | 0.95 | 47% | 22 |
| A | Scorpion | Poison | 54.7% | 492 | 490 | 2.79 | 0.73 | 58% | 19 |
| A | Eagle | Blast | 54.2% | 463 | 415 | 1.08 | 0.66 | 66% | 18 |
| A | Vampire | Curse | 54.1% | 499 | 474 | 0.96 | 1.27 | 56% | 19 |
| A | Gorilla | Spite | 54.0% | 470 | 454 | 0.67 | 0.78 | 59% | 21 |
| A | Genie | Bolt | 54.0% | 472 | 469 | 0.72 | 1.25 | 56% | 21 |
| A | Seal | Chill | 53.9% | 460 | 421 | 0.90 | 0.62 | 67% | 18 |
| A | Doppel | Parasite | 53.8% | 448 | 447 | 0.93 | 1.11 | 54% | 19 |
| A | Unicorn | Buff | 53.7% | 451 | 420 | 0.79 | 1.22 | 62% | 20 |
| A | Grave | Wither | 53.7% | 451 | 435 | 0.43 | 1.48 | 69% | 19 |
| A | Feast | Notch | 53.6% | 478 | 445 | 0.98 | 0.81 | 66% | 19 |
| A | Beetle | Poison | 53.3% | 473 | 451 | 2.26 | 0.59 | 63% | 17 |
| A | Penguin | Chill | 53.1% | 490 | 471 | 0.90 | 0.59 | 68% | 18 |
| A | Cyclops | Spite | 52.9% | 446 | 415 | 0.77 | 0.65 | 62% | 20 |
| A | Clock | Pendulum | 52.8% | 466 | 423 | 0.74 | 1.28 | 77% | 20 |
| B | Moon | Pendulum | 52.6% | 460 | 418 | 0.85 | 0.98 | 78% | 19 |
| B | Hourglass | Pendulum | 52.4% | 466 | 408 | 0.78 | 0.75 | 76% | 19 |
| B | Wrath | Spite | 52.3% | 493 | 417 | 0.88 | 0.66 | 71% | 18 |
| B | Wolf | Chill | 52.3% | 444 | 433 | 0.97 | 0.66 | 61% | 18 |
| B | T-Rex | Blast | 52.2% | 471 | 460 | 0.73 | 1.05 | 57% | 21 |
| B | Raven | Silence | 52.2% | 525 | 517 | 0.86 | 0.71 | 49% | 19 |
| B | Paladin | Buff | 52.1% | 480 | 408 | 0.54 | 0.46 | 71% | 21 |
| B | Gyro | Pendulum | 51.8% | 473 | 420 | 0.84 | 1.00 | 71% | 19 |
| B | Monk | Equalizer | 51.8% | 485 | 471 | 0.85 | 1.13 | 58% | 20 |
| B | Celestial | Buff | 51.6% | 492 | 440 | 0.85 | 1.30 | 57% | 19 |
| B | Alien | Equalizer | 51.5% | 493 | 388 | 0.89 | 0.63 | 73% | 17 |
| B | Snake | Poison | 51.5% | 474 | 470 | 3.04 | 1.02 | 55% | 18 |
| B | Titan | Equalizer | 51.5% | 447 | 400 | 0.84 | 1.13 | 58% | 19 |
| B | Husk | Wither | 51.4% | 484 | 395 | 0.34 | 1.21 | 73% | 16 |
| B | Spider | Poison | 51.4% | 432 | 417 | 2.37 | 0.48 | 65% | 18 |
| B | Hex | Wither | 51.3% | 466 | 433 | 0.38 | 1.42 | 59% | 18 |
| B | Lamprey | Siphon | 51.1% | 436 | 423 | 0.83 | 0.77 | 59% | 19 |
| B | Oni | Spite | 51.1% | 470 | 418 | 0.80 | 0.57 | 66% | 19 |
| B | Remora | Parasite | 51.0% | 504 | 502 | 0.94 | 1.14 | 47% | 19 |
| B | Angel | Buff | 51.0% | 471 | 420 | 0.84 | 1.03 | 59% | 19 |
| B | Polar | Chill | 50.8% | 482 | 475 | 0.93 | 0.82 | 51% | 19 |
| B | Robot | Equalizer | 50.6% | 482 | 387 | 0.89 | 0.50 | 73% | 17 |
| B | Frog | Poison | 50.5% | 485 | 413 | 1.56 | 0.48 | 71% | 14 |
| B | Wizard | Bolt | 50.3% | 459 | 454 | 0.72 | 1.03 | 51% | 20 |
| B | Mosquito | Siphon | 50.2% | 502 | 496 | 0.93 | 1.14 | 40% | 19 |
| B | Hayride | March | 50.1% | 455 | 426 | 0.86 | 0.59 | 72% | 19 |
| B | Siphon | Siphon | 50.1% | 479 | 471 | 0.90 | 1.05 | 49% | 19 |
| B | Drain | Siphon | 50.1% | 483 | 479 | 0.91 | 1.18 | 54% | 19 |
| B | Ninja | Silence | 49.9% | 469 | 463 | 0.89 | 0.75 | 47% | 19 |
| B | Ivy | Symbiosis | 49.8% | 492 | 491 | 0.61 | 1.51 | 50% | 16 |
| B | Coral | Symbiosis | 49.8% | 460 | 457 | 0.56 | 1.72 | 54% | 16 |
| B | Brand | Cinder | 49.8% | 452 | 330 | 0.54 | 0.31 | 84% | 18 |
| B | Tide | Pendulum | 49.4% | 488 | 433 | 0.83 | 0.78 | 76% | 19 |
| B | Fairy | Buff | 49.1% | 477 | 360 | 0.70 | 0.79 | 71% | 16 |
| B | Mimic | Parasite | 48.8% | 512 | 512 | 0.98 | 1.94 | 62% | 19 |
| B | Scorch | Cinder | 48.8% | 467 | 390 | 0.80 | 0.60 | 70% | 18 |
| B | Skull | Curse | 48.6% | 444 | 347 | 0.81 | 0.76 | 67% | 17 |
| B | Gobbler | March | 48.5% | 447 | 400 | 0.81 | 0.39 | 79% | 18 |
| B | Leech | Parasite | 48.2% | 473 | 470 | 0.96 | 1.24 | 39% | 19 |
| B | Lichen | Symbiosis | 48.0% | 479 | 476 | 0.55 | 1.44 | 54% | 16 |
| B | Imp | Bolt | 47.3% | 442 | 406 | 0.81 | 0.73 | 59% | 18 |
| C | Jack | Notch | 47.1% | 459 | 310 | 0.71 | 0.39 | 79% | 16 |
| C | Slice | Notch | 47.0% | 474 | 360 | 0.90 | 0.50 | 75% | 17 |
| C | Hush | Silence | 46.9% | 478 | 464 | 0.89 | 0.77 | 57% | 18 |
| C | Mage | Bolt | 46.7% | 460 | 455 | 0.87 | 1.16 | 50% | 19 |
| C | Bat | Curse | 46.7% | 486 | 375 | 0.74 | 0.50 | 73% | 18 |
| C | Wilt | Wither | 46.6% | 461 | 353 | 0.24 | 1.03 | 75% | 14 |
| C | Cuckoo | Parasite | 46.5% | 467 | 461 | 0.91 | 1.19 | 42% | 19 |
| C | Mycelium | Symbiosis | 46.3% | 462 | 461 | 0.56 | 1.70 | 61% | 16 |
| C | Sheaf | March | 46.3% | 488 | 384 | 0.63 | 0.29 | 82% | 16 |
| C | Phoenix | Cinder | 46.2% | 439 | 376 | 0.68 | 0.69 | 71% | 19 |
| C | Worldtree | Symbiosis | 46.2% | 513 | 511 | 0.41 | 0.99 | 38% | 17 |
| C | Kraken | Siphon | 46.0% | 506 | 486 | 0.74 | 1.02 | 50% | 20 |
| C | Dread | Silence | 45.5% | 464 | 437 | 0.69 | 0.51 | 67% | 18 |
| C | Witch | Bolt | 44.9% | 443 | 405 | 0.71 | 0.70 | 61% | 19 |
| C | Ghost | Curse | 44.4% | 473 | 335 | 0.72 | 0.53 | 77% | 17 |
| C | Cat | Silence | 44.0% | 466 | 411 | 0.62 | 0.34 | 75% | 17 |
| C | Vendetta | Spite | 43.9% | 469 | 342 | 0.65 | 0.35 | 79% | 18 |
| D | Candy | Notch | 43.0% | 474 | 322 | 0.71 | 0.46 | 80% | 15 |
| D | Acorn | March | 42.3% | 470 | 358 | 0.51 | 0.23 | 86% | 15 |
| D | Fox | Cinder | 42.3% | 428 | 309 | 0.70 | 0.43 | 78% | 16 |
| D | Cart | March | 41.0% | 456 | 389 | 0.69 | 0.31 | 80% | 17 |
| D | Lizard | Cinder | 40.9% | 447 | 342 | 0.66 | 0.53 | 77% | 18 |
| D | Zombie | Curse | 38.8% | 485 | 308 | 0.58 | 0.33 | 83% | 16 |

- **S:** Shark, Lion, Frost
- **A:** Cobweb, Carver, Owl, Dragon, Scorpion, Eagle, Vampire, Gorilla, Genie, Seal, Doppel, Unicorn, Grave, Feast, Beetle, Penguin, Cyclops, Clock
- **B:** Moon, Hourglass, Wrath, Wolf, T-Rex, Raven, Paladin, Gyro, Monk, Celestial, Alien, Snake, Titan, Husk, Spider, Hex, Lamprey, Oni, Remora, Angel, Polar, Robot, Frog, Wizard, Mosquito, Hayride, Siphon, Drain, Ninja, Ivy, Coral, Brand, Tide, Fairy, Mimic, Scorch, Skull, Gobbler, Leech, Lichen, Imp
- **C:** Jack, Slice, Hush, Mage, Bat, Wilt, Cuckoo, Mycelium, Sheaf, Phoenix, Worldtree, Kraken, Dread, Witch, Ghost, Cat, Vendetta
- **D:** Candy, Acorn, Fox, Cart, Lizard, Zombie

## Tribe decks - mechanic vs mechanic

Each cell is the row tribe's record against the column tribe as W-L-D (row is blue's tribe). Diagonal is the mirror.

| vs | Buff | Curs | Blas | Pois | Equa | Spit | Sile | Cind | Bolt | Chil | Para | Siph | Pend | Symb | With | Marc | Notc | vs field |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Buff | 16-24-0 | 26-14-0 | 20-20-0 | 20-20-0 | 29-11-0 | 20-20-0 | 40-0-0 | 31-9-0 | 20-20-0 | 30-10-0 | 31-9-0 | 34-6-0 | 12-28-0 | 40-0-0 | 32-8-0 | 40-0-0 | 11-29-0 | 66.5% (452-228-0) |
| Curse | 15-25-0 | 20-20-0 | 32-8-0 | 9-31-0 | 10-30-0 | 15-25-0 | 40-0-0 | 20-20-0 | 6-34-0 | 20-20-0 | 17-23-0 | 23-17-0 | 18-22-0 | 18-22-0 | 9-31-0 | 0-40-0 | 0-40-0 | 40.0% (272-408-0) |
| Blast | 20-20-0 | 9-31-0 | 20-20-0 | 40-0-0 | 0-40-0 | 40-0-0 | 20-20-0 | 33-7-0 | 27-13-0 | 9-31-0 | 10-30-0 | 11-29-0 | 14-26-0 | 20-20-0 | 40-0-0 | 40-0-0 | 20-20-0 | 54.9% (373-307-0) |
| Poison | 20-20-0 | 30-10-0 | 0-40-0 | 25-15-0 | 2-38-0 | 0-40-0 | 10-30-0 | 17-23-0 | 11-29-0 | 0-40-0 | 16-24-0 | 11-29-0 | 34-6-0 | 4-36-0 | 21-19-0 | 40-0-0 | 20-20-0 | 38.4% (261-419-0) |
| Equalizer | 12-28-0 | 32-8-0 | 40-0-0 | 37-3-0 | 20-20-0 | 0-40-0 | 40-0-0 | 28-12-0 | 19-21-0 | 15-25-0 | 28-12-0 | 20-20-0 | 5-35-0 | 33-7-0 | 30-10-0 | 40-0-0 | 12-28-0 | 60.4% (411-269-0) |
| Spite | 20-20-0 | 28-12-0 | 0-40-0 | 40-0-0 | 40-0-0 | 20-20-0 | 40-0-0 | 29-11-0 | 17-23-0 | 3-37-0 | 16-24-0 | 29-11-0 | 10-30-0 | 38-2-0 | 37-3-0 | 40-0-0 | 24-16-0 | 63.4% (431-249-0) |
| Silence | 0-40-0 | 0-40-0 | 20-20-0 | 33-7-0 | 0-40-0 | 0-40-0 | 22-18-0 | 24-16-0 | 0-40-0 | 13-27-0 | 5-35-0 | 16-24-0 | 20-20-0 | 22-18-0 | 40-0-0 | 12-28-0 | 25-15-0 | 37.1% (252-428-0) |
| Cinder | 9-31-0 | 20-20-0 | 8-32-0 | 26-14-0 | 11-29-0 | 14-26-0 | 28-12-0 | 16-24-0 | 11-29-0 | 0-40-0 | 19-21-0 | 10-30-0 | 13-27-0 | 37-3-0 | 29-11-0 | 35-5-0 | 17-23-0 | 44.6% (303-377-0) |
| Bolt | 18-22-0 | 35-5-0 | 7-33-0 | 30-10-0 | 21-19-0 | 16-24-0 | 40-0-0 | 23-17-0 | 15-25-0 | 10-30-0 | 21-19-0 | 29-11-0 | 11-29-0 | 31-9-0 | 30-10-0 | 24-16-0 | 16-24-0 | 55.4% (377-303-0) |
| Chill | 12-28-0 | 13-27-0 | 31-9-0 | 40-0-0 | 22-18-0 | 39-1-0 | 32-8-0 | 39-1-0 | 28-12-0 | 14-26-0 | 12-28-0 | 16-24-0 | 23-17-0 | 40-0-0 | 38-2-0 | 40-0-0 | 20-20-0 | 67.5% (459-221-0) |
| Parasite | 3-37-0 | 26-14-0 | 26-14-0 | 29-11-0 | 11-29-0 | 29-11-0 | 34-6-0 | 18-22-0 | 16-24-0 | 32-8-0 | 23-17-0 | 26-14-0 | 19-21-0 | 25-15-0 | 33-7-0 | 21-19-0 | 34-6-0 | 59.6% (405-275-0) |
| Siphon | 1-39-0 | 16-24-0 | 33-7-0 | 30-10-0 | 24-16-0 | 16-24-0 | 24-16-0 | 32-8-0 | 15-25-0 | 29-11-0 | 10-30-0 | 20-20-0 | 8-32-0 | 20-20-0 | 38-2-0 | 21-19-0 | 23-17-0 | 52.9% (360-320-0) |
| Pendulum | 30-10-0 | 25-15-0 | 24-16-0 | 12-28-0 | 34-6-0 | 31-9-0 | 20-20-0 | 24-16-0 | 28-12-0 | 12-28-0 | 26-14-0 | 35-5-0 | 21-19-0 | 28-12-0 | 33-7-0 | 35-5-0 | 28-12-0 | 65.6% (446-234-0) |
| Symbiosis | 0-40-0 | 22-18-0 | 20-20-0 | 31-9-0 | 8-32-0 | 3-37-0 | 15-25-0 | 5-35-0 | 13-27-0 | 0-40-0 | 15-25-0 | 19-21-0 | 7-33-0 | 22-18-0 | 1-39-0 | 8-32-0 | 0-40-0 | 27.8% (189-491-0) |
| Wither | 4-36-0 | 34-6-0 | 0-40-0 | 13-27-0 | 10-30-0 | 5-35-0 | 1-39-0 | 16-24-0 | 9-31-0 | 3-37-0 | 10-30-0 | 2-38-0 | 7-33-0 | 40-0-0 | 20-20-0 | 37-3-0 | 3-37-0 | 31.5% (214-466-0) |
| March | 0-40-0 | 40-0-0 | 0-40-0 | 0-40-0 | 0-40-0 | 0-40-0 | 30-10-0 | 4-36-0 | 17-23-0 | 0-40-0 | 15-25-0 | 18-22-0 | 2-38-0 | 37-3-0 | 3-37-0 | 20-20-0 | 0-40-0 | 27.4% (186-494-0) |
| Notch | 30-10-0 | 40-0-0 | 20-20-0 | 20-20-0 | 30-10-0 | 16-24-0 | 17-23-0 | 23-17-0 | 22-18-0 | 20-20-0 | 10-30-0 | 17-23-0 | 9-31-0 | 40-0-0 | 38-2-0 | 40-0-0 | 20-20-0 | 60.6% (412-268-0) |

Tribe standing when playing a full five-card tribe deck:

1. **Chill** 67.5% (459-221-0)
2. **Buff** 66.5% (452-228-0)
3. **Pendulum** 65.6% (446-234-0)
4. **Spite** 63.4% (431-249-0)
5. **Notch** 60.6% (412-268-0)
6. **Equalizer** 60.4% (411-269-0)
7. **Parasite** 59.6% (405-275-0)
8. **Bolt** 55.4% (377-303-0)
9. **Blast** 54.9% (373-307-0)
10. **Siphon** 52.9% (360-320-0)
11. **Cinder** 44.6% (303-377-0)
12. **Curse** 40.0% (272-408-0)
13. **Poison** 38.4% (261-419-0)
14. **Silence** 37.1% (252-428-0)
15. **Wither** 31.5% (214-466-0)
16. **Symbiosis** 27.8% (189-491-0)
17. **March** 27.4% (186-494-0)

## Tribe decks - card tiers (mono-tribe seats only)

These numbers are not mixed-hand numbers. A weak card can look better when it always sits next to four friends of the same ability.

| Tier | Card | Ability | Win | Captures / play | Captured / play | Kept |
| --- | --- | --- | --- | --- | --- | --- |
| A | Wolf | Chill | 68.3% | 0.92 | 0.37 | 72% |
| A | Seal | Chill | 68.3% | 0.76 | 0.28 | 84% |
| A | Penguin | Chill | 68.3% | 0.74 | 0.25 | 87% |
| A | Frost | Chill | 68.3% | 0.74 | 0.86 | 55% |
| A | Polar | Chill | 68.3% | 0.70 | 0.66 | 55% |
| A | Unicorn | Buff | 67.8% | 0.99 | 1.36 | 66% |
| A | Celestial | Buff | 67.8% | 0.95 | 1.24 | 56% |
| A | Angel | Buff | 67.8% | 0.78 | 0.47 | 76% |
| A | Paladin | Buff | 67.8% | 0.49 | 0.41 | 66% |
| A | Fairy | Buff | 67.8% | 0.35 | 0.13 | 99% |
| A | Gyro | Pendulum | 65.7% | 1.04 | 0.94 | 64% |
| A | Moon | Pendulum | 65.7% | 0.97 | 0.79 | 77% |
| A | Tide | Pendulum | 65.7% | 0.92 | 0.88 | 71% |
| A | Hourglass | Pendulum | 65.7% | 0.88 | 0.79 | 69% |
| A | Clock | Pendulum | 65.7% | 0.48 | 2.18 | 77% |
| A | Cyclops | Spite | 62.3% | 0.97 | 0.62 | 56% |
| A | Oni | Spite | 62.3% | 0.87 | 0.66 | 63% |
| A | Wrath | Spite | 62.3% | 0.82 | 0.32 | 77% |
| A | Vendetta | Spite | 62.3% | 0.67 | 0.31 | 84% |
| A | Gorilla | Spite | 62.3% | 0.51 | 0.74 | 49% |
| A | Owl | Equalizer | 60.2% | 1.12 | 1.00 | 61% |
| A | Slice | Notch | 60.2% | 1.10 | 0.73 | 60% |
| A | Carver | Notch | 60.2% | 1.02 | 1.11 | 49% |
| A | Titan | Equalizer | 60.2% | 1.00 | 1.54 | 44% |
| A | Robot | Equalizer | 60.2% | 0.99 | 0.41 | 71% |
| A | Alien | Equalizer | 60.2% | 0.93 | 0.55 | 62% |
| A | Jack | Notch | 60.2% | 0.85 | 0.65 | 58% |
| A | Candy | Notch | 60.2% | 0.67 | 0.17 | 96% |
| A | Monk | Equalizer | 60.2% | 0.48 | 1.45 | 75% |
| A | Feast | Notch | 60.2% | 0.44 | 1.47 | 63% |
| B | Leech | Parasite | 58.9% | 0.95 | 0.90 | 67% |
| B | Mimic | Parasite | 58.9% | 0.93 | 1.39 | 59% |
| B | Doppel | Parasite | 58.9% | 0.92 | 0.68 | 68% |
| B | Remora | Parasite | 58.9% | 0.85 | 0.73 | 69% |
| B | Cuckoo | Parasite | 58.9% | 0.80 | 0.77 | 72% |
| B | Mage | Bolt | 57.6% | 0.98 | 0.55 | 65% |
| B | Wizard | Bolt | 57.6% | 0.97 | 1.23 | 40% |
| B | Witch | Bolt | 57.6% | 0.83 | 0.41 | 68% |
| B | Imp | Bolt | 57.6% | 0.66 | 0.26 | 94% |
| B | Genie | Bolt | 57.6% | 0.44 | 1.45 | 64% |
| B | Shark | Blast | 55.3% | 0.92 | 0.72 | 77% |
| B | Eagle | Blast | 55.3% | 0.90 | 0.13 | 93% |
| B | T-Rex | Blast | 55.3% | 0.84 | 0.51 | 69% |
| B | Lion | Blast | 55.3% | 0.71 | 0.43 | 65% |
| B | Dragon | Blast | 55.3% | 0.49 | 1.23 | 14% |
| B | Mosquito | Siphon | 51.8% | 0.90 | 1.28 | 59% |
| B | Drain | Siphon | 51.8% | 0.87 | 0.62 | 67% |
| B | Siphon | Siphon | 51.8% | 0.78 | 0.40 | 74% |
| B | Lamprey | Siphon | 51.8% | 0.74 | 0.40 | 76% |
| B | Kraken | Siphon | 51.8% | 0.43 | 1.07 | 18% |
| B | Scorch | Cinder | 44.2% | 0.79 | 1.04 | 51% |
| B | Fox | Cinder | 44.2% | 0.65 | 0.69 | 74% |
| B | Lizard | Cinder | 44.2% | 0.62 | 0.72 | 65% |
| B | Brand | Cinder | 44.2% | 0.60 | 0.40 | 70% |
| B | Phoenix | Cinder | 44.2% | 0.35 | 1.01 | 47% |
| C | Ghost | Curse | 39.4% | 0.99 | 0.82 | 51% |
| C | Bat | Curse | 39.4% | 0.97 | 1.05 | 32% |
| C | Skull | Curse | 39.4% | 0.97 | 0.80 | 28% |
| C | Zombie | Curse | 39.4% | 0.64 | 0.18 | 91% |
| C | Vampire | Curse | 39.4% | 0.50 | 2.14 | 84% |
| C | Scorpion | Poison | 37.2% | 2.91 | 1.03 | 31% |
| C | Snake | Poison | 37.2% | 2.72 | 1.05 | 32% |
| C | Spider | Poison | 37.2% | 2.54 | 1.14 | 35% |
| C | Beetle | Poison | 37.2% | 1.44 | 0.61 | 58% |
| C | Frog | Poison | 37.2% | 0.48 | 0.55 | 76% |
| C | Hush | Silence | 35.2% | 0.75 | 0.50 | 63% |
| C | Cat | Silence | 35.2% | 0.60 | 0.15 | 92% |
| C | Ninja | Silence | 35.2% | 0.57 | 0.99 | 30% |
| C | Dread | Silence | 35.2% | 0.55 | 0.38 | 65% |
| C | Raven | Silence | 35.2% | 0.51 | 0.97 | 36% |
| C | Hex | Wither | 31.0% | 0.59 | 1.07 | 40% |
| C | Cobweb | Wither | 31.0% | 0.53 | 0.58 | 63% |
| C | Husk | Wither | 31.0% | 0.40 | 0.21 | 80% |
| C | Grave | Wither | 31.0% | 0.36 | 1.10 | 26% |
| C | Wilt | Wither | 31.0% | 0.21 | 0.06 | 96% |
| D | Coral | Symbiosis | 27.5% | 0.86 | 0.99 | 47% |
| D | Ivy | Symbiosis | 27.5% | 0.75 | 0.88 | 61% |
| D | Lichen | Symbiosis | 27.5% | 0.71 | 0.77 | 63% |
| D | Mycelium | Symbiosis | 27.5% | 0.71 | 0.93 | 65% |
| D | Worldtree | Symbiosis | 27.5% | 0.16 | 1.05 | 28% |
| D | Cart | March | 27.4% | 0.55 | 0.51 | 57% |
| D | Gobbler | March | 27.4% | 0.51 | 0.81 | 38% |
| D | Sheaf | March | 27.4% | 0.34 | 0.48 | 72% |
| D | Acorn | March | 27.4% | 0.32 | 0.11 | 94% |
| D | Hayride | March | 27.4% | 0.21 | 0.99 | 21% |

## Read of the data

**Live leftover-off is close to even.** First player won 52.2% of decided leftover-off games, second won 47.8%, and 0.0% of all games were draws. Of every random deal, that is first 52.2% / second 47.8% / draw 0.0%. Second is only slightly ahead because they still take the last capture.

**Leftover-on (the Options rule) is the old 70%.** Same games: first 28.2% / second 47.8% / draw 24.0% of all games (37.1% / 62.9% of leftover-on decided). Leftover-on draws are first-owns-5 boards; leftover-off gives those to first. It does not invert the 70%.

Ability spread in mixed hands is **9.0 points** from Blast (54.9%) to Cinder (45.9%).

**Chill is the strongest tribe deck** at 67.5%. Mixed-hand Chill is 52.8%.

**Pendulum covers both axes.** Mixed 52.1%, mono-tribe 65.6%. A five-of Tide board always has a swung 8 or 7 on the live axis, which is why the tribe matrix runs away.

**Parasite and Siphon land near even** in mixed hands (49.6% / 49.4%). Tribe decks 59.6% / 52.9%. Copy and steal need an adjacent enemy, so they do not snowball as a five-of the way Pendulum does.

**Symbiosis counts on the play, then the card returns to its printed stats.** Mixed 47.7% (mean power 16.2), mono-Grove 27.8%. The bonus shows in hand and is used for that fight. It does not stay on the board.

**Poison ticks adjacent enemies, then those cards can capture.** Mixed-hand seat win 51.9%. Mono-tribe 38.4%. Friendlies are safe. One capture pass after the tick, no second wave.

**Blast is mid as a tribe** at 54.9%. Mixed-hand Blast is 54.9%. The +2 on play still stacks as a game plan, just not the matrix leader anymore.

**Chill holds up in both views** (mixed 52.8%, tribe 67.5%). **Silence does not.** Mixed 47.8% is fine; five Silences together (37.1%) just turn the board into mediocre stat-sticks.

**Over-performing mixed-hand faces (S):** Shark (59.0%, power 20, keep 58%), Lion (57.3%, power 19, keep 63%), Frost (56.8%, power 19, keep 59%).
Nerf the body, not the ability, unless the whole tribe is also top of the matrix.

**Under-performing mixed-hand faces (D):** Candy (43.0%, power 15, keep 80%), Acorn (42.3%, power 15, keep 86%), Fox (42.3%, power 16, keep 78%), Cart (41.0%, power 17, keep 80%), Lizard (40.9%, power 18, keep 77%), Zombie (38.8%, power 16, keep 83%).

## Suggestions (do not apply yet)

1. **Do not nerf Pendulum as a rule.** Mixed Tide is a lead, not a broken on-play. The tribe-deck runaway is five cards that all swing axes. If Tribe Decks stay a first-class mode, shave the extreme axis faces (Moon's Left 8, Clock's 8/2/8/2) rather than the swap.
2. **Moon** mixed 52.6%, keep 78%, power 19. Printed 2/7/2/8 becomes 8/2/7/2 after one swing. Shave Left 8→7 so the live top after the first swing is 7. That is the one Tide face to touch.
3. **Grove is capture-count, not sit-and-wait.** Lichen 48.0% / Ivy 49.8%. Re-read mixed-hand and the tribe matrix. Grove no longer captures when it grows.
4. **Mimic** mixed 48.8%, A-left (3/2/4/A), keep 62%. Left was the empty axis, so the 19-power copy card jumped. If it stays S, move the A to Right (3/A/4/2) so it shares Paladin 8 / Kraken 9 instead of sitting alone.
5. **Worldtree** mixed 46.2%, A-right (2/A/3/2). The 2-top is the farm window. Do not add power. If Grove stays the floor, swap so Worldtree is the A-left instead of Mimic.
6. **Kraken** mixed 46.0%, keep 50%, power 20. The 9-right plays like Dragon's 9/7: farmed after the sit. Leave Siphon's steal. If it stays C, move 1 off Right onto Left (4/8/3/5) rather than adding power.
7. **Leave Parasite and Siphon rules alone.** Mixed Parasite is a mild lead because Mimic is S, not because copy is broken. Drain is the Well face that is actually good; that is fine.
8. **Poison now ticks enemies, then captures once.** Re-read mixed-hand and the tribe matrix. If Vermin overshoots Chill, the capture pass is the first thing to take back, not Frog's body. If it is still the floor, bump Frog/Beetle after Grove bodies.
9. **Do not nerf Blast as a rule.** Mixed Blast is a mild lead. Mono Blast is no longer the matrix leader.
10. **Dragon** mixed 55.0%, keep 47%, power 22. Rear 3→4 this pass did not lift keep - still farmed after the 9/7 play. Leave Left at 2 unless we want another bump.
11. **Paladin** mixed 52.1%, power 21. Shaving one 8 to 7 (4/8/7/2) took it off S. Stop here. Do not nerf Buff itself.
12. **Genie is a 6/5/5/5 Bolt.** The -2 zap is swingy. If Genie is S, shave one 5 to a 4. Do not tone down Bolt's -2.
13. **Celestial** mixed 51.6%. A moved Top this pass (A/2/3/4). Leave the 2 on Right unless it falls back to C.
14. **Frog (50.5%, power 14) is still a floor face.** Poison only hits enemies now. If Frog is still D after a Grove bump, try 3/4/5/4.
15. **Owl punches above power 16** (55.2%, Equalizer). That is fine as the 'small Equalizer'. Do not buff other Balance faces to match it.
16. **Silence is fine in mixed hands and bad as a five-of.** Same class as Grove/Vermin as a tribe deck. No change unless we care about mono-Hush doing something besides the cancel.
17. **Do not chase first-player win rate with card stats.** Last-capture is the leftover-off remainder.
18. **Leftover-off is the live default.** Seat math is first 52.2% / second 47.8% / draw 0.0%. Leftover-on (Options) is first 28.2% / second 47.8% / draw 24.0%. Keep leftover scores off unless you want 5-5 draws back.
19. Re-run `python3 sim/balance.py --random 4000 --tribe-games 40 --seed 1` after any facing change. A 1-point bump moves a card a full tier in this AI.

## How to re-run

```
python3 sim/balance.py --random 4000 --tribe-games 40 --seed 1
```

