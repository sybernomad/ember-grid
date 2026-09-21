# Ember Grid balance sim

Both seats use the live **Normal** AI heuristic. Ember abilities are on. This run is the current 70-card Base Set (14 tribes).

## Method

- **Random deals:** 4000 games. Shuffle the 70, deal 5 and 5. Who goes first is a coin flip.
- **Tribe decks:** every tribe vs every tribe, 40 games each (7840 games). Even games blue goes first, odd games red goes first.
- First player places 5 cards, second places 4. **Live default: leftover-off.** Only board ownership scores. Options can turn leftover scores on.
- Leftover-off on a filled 3x3 almost never draws (9 cards). First's 5 of 9 wins. Leftover-on (the option) still turns those 5-4 boards into 5-5 draws.
- **Leftover-on is the Options table rule**, recorded on the same games. AI play does not change.
- Card win rate is: when this card was in a seat's opening hand, how often that seat won (draws dropped).
- Capture stats only count flips during a match, including recaptures.
- The AI is the same greedy scorer as the browser game. It is not perfect play.

## Random deals - headline (live leftover-off)

- Results: blue 2019, red 1981, draw 0 (0.0% draws)
- First player win rate (excluding draws): 46.4%
- Second player win rate (excluding draws): 53.6%
- Of all games: first 46.4%, second 53.6%, draw 0.0%
- Mean card win rate: 50.0%

## Options: leftover scores (same games)

When leftover scores is on, unplayed cards count. First leftover 0, second leftover 1, so leftover-on draws are exactly first-owns-5 boards.

- Leftover-on results: blue 1652, red 1608, draw 740 (18.5% draws)
- First player win rate (excluding leftover-on draws): 34.2%
- Second player win rate (excluding leftover-on draws): 65.8%
- Of all games: first 27.9%, second 53.6%, draw 18.5%

- Leftover hand sizes this run: first leftover 0 / second leftover 1: 4000.

On this 5-and-4 placement, leftover-on first score is board-first, leftover-on second score is board-second + 1. So leftover-on draws are exactly the 5-4 boards (first owns 5). Leftover-off gives those games to first. Leftover-on second wins (first owns 0-4) stay second wins.

| Leftover-on seat | Leftover-off seat | Games | Share |
| --- | --- | --- | --- |
| first | first | 1115 | 27.9% |
| second | second | 2145 | 53.6% |
| draw | first | 740 | 18.5% |

| First-player board cards | Games | Leftover-on result | Leftover-off result |
| --- | --- | --- | --- |
| 0 of 9 | 65 (1.6%) | second wins | second wins |
| 1 of 9 | 238 (6.0%) | second wins | second wins |
| 2 of 9 | 470 (11.8%) | second wins | second wins |
| 3 of 9 | 596 (14.9%) | second wins | second wins |
| 4 of 9 | 776 (19.4%) | second wins | second wins |
| 5 of 9 | 740 (18.5%) | draw | first wins |
| 6 of 9 | 515 (12.9%) | first wins | first wins |
| 7 of 9 | 312 (7.8%) | first wins | first wins |
| 8 of 9 | 206 (5.2%) | first wins | first wins |
| 9 of 9 | 82 (2.0%) | first wins | first wins |

Ability seat win leftover-off vs leftover-on (draws dropped):

| Rank | Ability | Tribe | Leftover-off (live) | Leftover-on (option) | Delta |
| --- | --- | --- | --- | --- | --- |
| 1 | Blast | Beasts | 53.6% | 53.8% | -0.2 |
| 2 | Equalizer | Balance | 53.3% | 54.2% | -0.9 |
| 3 | Pendulum | Tide | 52.8% | 53.0% | -0.1 |
| 4 | Chill | Frost | 51.6% | 51.6% | +0.0 |
| 5 | Symbiosis | Grove | 51.4% | 51.8% | -0.4 |
| 6 | Siphon | Well | 50.8% | 50.9% | -0.0 |
| 7 | Buff | Radiance | 50.5% | 49.7% | +0.8 |
| 8 | Bolt | Arcane | 49.7% | 50.6% | -0.9 |
| 9 | Spite | Wrath | 49.3% | 49.5% | -0.2 |
| 10 | Silence | Hush | 49.0% | 49.1% | -0.1 |
| 11 | Curse | Grave | 48.5% | 48.3% | +0.2 |
| 12 | Parasite | Host | 47.6% | 47.6% | +0.0 |
| 13 | Poison | Vermin | 47.6% | 46.5% | +1.2 |
| 14 | Cinder | Ember | 44.7% | 44.5% | +0.2 |

Card win-rate movers leftover-on (option) → leftover-off (live):

| Card | Ability | Leftover-on | Leftover-off | Delta | On tier | Off tier |
| --- | --- | --- | --- | --- | --- | --- |
| Frog | Poison | 40.6% | 43.0% | +2.3 | D | D |
| Ninja | Silence | 50.1% | 47.9% | -2.2 | B | B |
| Robot | Equalizer | 52.7% | 50.6% | -2.1 | B | B |
| Snake | Poison | 49.7% | 51.6% | +1.9 | B | B |
| Leech | Parasite | 47.2% | 48.8% | +1.6 | B | B |
| Phoenix | Cinder | 45.6% | 44.0% | -1.6 | C | C |
| Alien | Equalizer | 58.4% | 56.8% | -1.6 | S | S |
| Mycelium | Symbiosis | 51.6% | 50.2% | -1.4 | B | B |
| Raven | Silence | 47.0% | 48.4% | +1.4 | B | B |
| Celestial | Buff | 48.9% | 50.2% | +1.3 | B | B |
| Worldtree | Symbiosis | 56.3% | 55.1% | -1.3 | A | A |
| Owl | Equalizer | 58.7% | 57.5% | -1.3 | S | S |

## Ability / mechanic win rates (random deals)

Seat win rate = a player was dealt at least one card of that ability, then won.

| Rank | Ability | Tribe | Seat win | Card-avg win | Captures / play | Captured / play | Mean power |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Blast | Beasts | 53.6% | 53.9% | 0.83 | 1.01 | 20.0 |
| 2 | Equalizer | Balance | 53.3% | 53.7% | 0.89 | 0.93 | 17.8 |
| 3 | Pendulum | Tide | 52.8% | 52.6% | 0.78 | 0.97 | 19.2 |
| 4 | Chill | Frost | 51.6% | 52.2% | 0.88 | 0.81 | 18.4 |
| 5 | Symbiosis | Grove | 51.4% | 51.9% | 1.27 | 1.21 | 16.2 |
| 6 | Siphon | Well | 50.8% | 50.5% | 0.84 | 1.18 | 19.2 |
| 7 | Buff | Radiance | 50.5% | 50.3% | 0.68 | 0.97 | 19.0 |
| 8 | Bolt | Arcane | 49.7% | 49.4% | 0.72 | 1.14 | 19.4 |
| 9 | Spite | Wrath | 49.3% | 49.1% | 0.69 | 0.71 | 19.2 |
| 10 | Silence | Hush | 49.0% | 48.7% | 0.79 | 0.64 | 18.2 |
| 11 | Curse | Grave | 48.5% | 48.5% | 0.71 | 0.66 | 17.4 |
| 12 | Parasite | Host | 47.6% | 47.9% | 1.22 | 1.35 | 19.0 |
| 13 | Poison | Vermin | 47.6% | 47.2% | 2.15 | 0.83 | 17.2 |
| 14 | Cinder | Ember | 44.7% | 43.7% | 0.60 | 0.52 | 17.8 |

## Random deals - card tier list

Tiers are z-scores of card win rate vs the random-deal field. S >= 1.6sd, A >= 0.7, B middle, C <= -0.7, D <= -1.6.

| Tier | Card | Ability | Win | Dealt | Played | Captures / play | Captured / play | Kept | Power |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S | Frost | Chill | 57.8% | 550 | 530 | 0.92 | 1.05 | 62% | 19 |
| S | Owl | Equalizer | 57.5% | 576 | 462 | 1.05 | 1.13 | 70% | 16 |
| S | T-Rex | Blast | 57.4% | 561 | 556 | 0.69 | 1.13 | 62% | 21 |
| S | Vampire | Curse | 57.1% | 583 | 544 | 0.95 | 1.29 | 59% | 19 |
| S | Alien | Equalizer | 56.8% | 565 | 417 | 0.94 | 0.68 | 75% | 17 |
| A | Ivy | Symbiosis | 56.1% | 572 | 571 | 1.37 | 1.21 | 60% | 16 |
| A | Eagle | Blast | 55.9% | 547 | 487 | 1.05 | 0.68 | 66% | 18 |
| A | Pendulum | Pendulum | 55.9% | 562 | 538 | 0.71 | 1.22 | 77% | 20 |
| A | Shark | Blast | 55.3% | 591 | 582 | 0.83 | 1.35 | 62% | 20 |
| A | Worldtree | Symbiosis | 55.1% | 594 | 588 | 0.99 | 0.91 | 51% | 17 |
| A | Lion | Blast | 55.0% | 591 | 553 | 1.00 | 0.80 | 63% | 19 |
| A | Moon | Pendulum | 54.4% | 575 | 522 | 0.87 | 1.07 | 75% | 19 |
| A | Monk | Equalizer | 53.9% | 575 | 564 | 0.75 | 1.20 | 61% | 20 |
| A | Genie | Bolt | 53.7% | 592 | 590 | 0.63 | 1.49 | 62% | 21 |
| A | Unicorn | Buff | 53.7% | 568 | 535 | 0.77 | 1.42 | 63% | 20 |
| A | Hush | Silence | 53.3% | 567 | 555 | 0.90 | 0.86 | 56% | 18 |
| A | Lamprey | Siphon | 53.2% | 573 | 552 | 0.82 | 1.03 | 59% | 19 |
| A | Wizard | Bolt | 53.0% | 566 | 550 | 0.69 | 1.29 | 50% | 20 |
| B | Gorilla | Spite | 52.4% | 569 | 544 | 0.61 | 0.91 | 56% | 21 |
| B | Tide | Pendulum | 52.4% | 552 | 477 | 0.79 | 0.83 | 77% | 19 |
| B | Seal | Chill | 52.2% | 578 | 527 | 0.84 | 0.70 | 67% | 18 |
| B | Angel | Buff | 52.0% | 613 | 534 | 0.75 | 1.00 | 63% | 19 |
| B | Polar | Chill | 51.6% | 581 | 571 | 0.88 | 0.93 | 53% | 19 |
| B | Snake | Poison | 51.6% | 620 | 614 | 2.63 | 1.19 | 54% | 18 |
| B | Skull | Curse | 51.5% | 536 | 390 | 0.78 | 0.76 | 72% | 17 |
| B | Cyclops | Spite | 51.4% | 552 | 528 | 0.68 | 0.82 | 50% | 20 |
| B | Drain | Siphon | 51.0% | 555 | 552 | 0.91 | 1.40 | 54% | 19 |
| B | Wrath | Spite | 50.7% | 594 | 480 | 0.84 | 0.68 | 72% | 18 |
| B | Robot | Equalizer | 50.6% | 571 | 396 | 0.86 | 0.46 | 80% | 17 |
| B | Hourglass | Pendulum | 50.4% | 583 | 515 | 0.75 | 0.84 | 72% | 19 |
| B | Mosquito | Siphon | 50.3% | 578 | 562 | 0.92 | 1.22 | 43% | 19 |
| B | Doppel | Parasite | 50.3% | 549 | 547 | 1.14 | 1.09 | 53% | 19 |
| B | Mycelium | Symbiosis | 50.2% | 572 | 570 | 1.36 | 1.32 | 57% | 16 |
| B | Celestial | Buff | 50.2% | 600 | 544 | 0.81 | 1.20 | 60% | 19 |
| B | Remora | Parasite | 50.0% | 618 | 614 | 1.22 | 1.16 | 51% | 19 |
| B | Gyro | Pendulum | 49.9% | 593 | 505 | 0.78 | 0.90 | 71% | 19 |
| B | Lichen | Symbiosis | 49.9% | 533 | 532 | 1.25 | 1.22 | 54% | 16 |
| B | Penguin | Chill | 49.8% | 578 | 524 | 0.83 | 0.66 | 65% | 18 |
| B | Siphon | Siphon | 49.5% | 537 | 532 | 0.89 | 1.12 | 51% | 19 |
| B | Titan | Equalizer | 49.5% | 556 | 505 | 0.85 | 1.17 | 59% | 19 |
| B | Wolf | Chill | 49.3% | 560 | 540 | 0.91 | 0.73 | 63% | 18 |
| B | Leech | Parasite | 48.8% | 545 | 542 | 1.21 | 1.27 | 46% | 19 |
| B | Fairy | Buff | 48.5% | 583 | 386 | 0.59 | 0.70 | 78% | 16 |
| B | Coral | Symbiosis | 48.4% | 601 | 601 | 1.37 | 1.38 | 53% | 16 |
| B | Raven | Silence | 48.4% | 616 | 599 | 0.85 | 0.76 | 49% | 19 |
| B | Scorch | Cinder | 48.3% | 555 | 426 | 0.71 | 0.62 | 74% | 18 |
| B | Kraken | Siphon | 48.3% | 574 | 569 | 0.64 | 1.13 | 46% | 20 |
| B | Spider | Poison | 48.1% | 570 | 550 | 2.15 | 0.65 | 57% | 18 |
| B | Cat | Silence | 48.0% | 585 | 518 | 0.59 | 0.32 | 79% | 17 |
| B | Ninja | Silence | 47.9% | 576 | 567 | 0.90 | 0.78 | 43% | 19 |
| B | Ghost | Curse | 47.8% | 586 | 376 | 0.62 | 0.47 | 79% | 17 |
| B | Mage | Bolt | 47.5% | 543 | 529 | 0.84 | 1.25 | 57% | 19 |
| B | Paladin | Buff | 47.2% | 600 | 518 | 0.50 | 0.55 | 64% | 21 |
| C | Beetle | Poison | 47.1% | 582 | 531 | 2.09 | 0.79 | 57% | 17 |
| C | Mimic | Parasite | 46.7% | 615 | 611 | 1.34 | 1.94 | 51% | 19 |
| C | Imp | Bolt | 46.4% | 560 | 486 | 0.76 | 0.82 | 66% | 18 |
| C | Witch | Bolt | 46.4% | 537 | 498 | 0.68 | 0.84 | 59% | 19 |
| C | Scorpion | Poison | 46.4% | 576 | 569 | 2.64 | 0.90 | 53% | 19 |
| C | Oni | Spite | 46.2% | 606 | 532 | 0.74 | 0.78 | 66% | 19 |
| C | Dread | Silence | 46.1% | 579 | 539 | 0.71 | 0.49 | 64% | 18 |
| C | Dragon | Blast | 45.6% | 548 | 538 | 0.60 | 1.10 | 45% | 22 |
| C | Bat | Curse | 45.5% | 558 | 401 | 0.73 | 0.48 | 76% | 18 |
| C | Fox | Cinder | 45.4% | 535 | 332 | 0.59 | 0.40 | 83% | 16 |
| C | Vendetta | Spite | 44.8% | 560 | 386 | 0.58 | 0.35 | 80% | 18 |
| C | Phoenix | Cinder | 44.0% | 548 | 465 | 0.64 | 0.66 | 70% | 19 |
| C | Cuckoo | Parasite | 43.9% | 553 | 552 | 1.18 | 1.27 | 44% | 19 |
| D | Frog | Poison | 43.0% | 582 | 475 | 1.24 | 0.62 | 66% | 14 |
| D | Lizard | Cinder | 41.7% | 544 | 401 | 0.56 | 0.59 | 73% | 18 |
| D | Zombie | Curse | 40.8% | 549 | 299 | 0.46 | 0.30 | 86% | 16 |
| D | Brand | Cinder | 39.1% | 548 | 405 | 0.49 | 0.35 | 79% | 18 |

- **S:** Frost, Owl, T-Rex, Vampire, Alien
- **A:** Ivy, Eagle, Pendulum, Shark, Worldtree, Lion, Moon, Monk, Genie, Unicorn, Hush, Lamprey, Wizard
- **B:** Gorilla, Tide, Seal, Angel, Polar, Snake, Skull, Cyclops, Drain, Wrath, Robot, Hourglass, Mosquito, Doppel, Mycelium, Celestial, Remora, Gyro, Lichen, Penguin, Siphon, Titan, Wolf, Leech, Fairy, Coral, Raven, Scorch, Kraken, Spider, Cat, Ninja, Ghost, Mage, Paladin
- **C:** Beetle, Mimic, Imp, Witch, Scorpion, Oni, Dread, Dragon, Bat, Fox, Vendetta, Phoenix, Cuckoo
- **D:** Frog, Lizard, Zombie, Brand

## Tribe decks - mechanic vs mechanic

Each cell is the row tribe's record against the column tribe as W-L-D (row is blue's tribe). Diagonal is the mirror.

| vs | Buff | Curs | Blas | Pois | Equa | Spit | Sile | Cind | Bolt | Chil | Para | Siph | Pend | Symb | vs field |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Buff | 18-22-0 | 24-16-0 | 20-20-0 | 20-20-0 | 30-10-0 | 20-20-0 | 40-0-0 | 32-8-0 | 19-21-0 | 27-13-0 | 34-6-0 | 34-6-0 | 8-32-0 | 36-4-0 | 64.6% (362-198-0) |
| Curse | 18-22-0 | 22-18-0 | 27-13-0 | 13-27-0 | 6-34-0 | 18-22-0 | 40-0-0 | 17-23-0 | 7-33-0 | 25-15-0 | 15-25-0 | 18-22-0 | 17-23-0 | 18-22-0 | 46.6% (261-299-0) |
| Blast | 20-20-0 | 10-30-0 | 20-20-0 | 40-0-0 | 0-40-0 | 40-0-0 | 20-20-0 | 35-5-0 | 32-8-0 | 8-32-0 | 19-21-0 | 13-27-0 | 14-26-0 | 20-20-0 | 52.0% (291-269-0) |
| Poison | 20-20-0 | 30-10-0 | 0-40-0 | 18-22-0 | 4-36-0 | 0-40-0 | 10-30-0 | 15-25-0 | 10-30-0 | 0-40-0 | 11-29-0 | 11-29-0 | 31-9-0 | 20-20-0 | 32.1% (180-380-0) |
| Equalizer | 9-31-0 | 28-12-0 | 40-0-0 | 36-4-0 | 20-20-0 | 0-40-0 | 40-0-0 | 30-10-0 | 16-24-0 | 21-19-0 | 29-11-0 | 17-23-0 | 5-35-0 | 38-2-0 | 58.8% (329-231-0) |
| Spite | 20-20-0 | 24-16-0 | 0-40-0 | 40-0-0 | 40-0-0 | 20-20-0 | 40-0-0 | 27-13-0 | 17-23-0 | 3-37-0 | 18-22-0 | 25-15-0 | 12-28-0 | 40-0-0 | 58.2% (326-234-0) |
| Silence | 0-40-0 | 0-40-0 | 20-20-0 | 32-8-0 | 0-40-0 | 0-40-0 | 19-21-0 | 16-24-0 | 0-40-0 | 11-29-0 | 11-29-0 | 12-28-0 | 20-20-0 | 36-4-0 | 31.6% (177-383-0) |
| Cinder | 8-32-0 | 24-16-0 | 10-30-0 | 18-22-0 | 9-31-0 | 8-32-0 | 19-21-0 | 18-22-0 | 14-26-0 | 0-40-0 | 17-23-0 | 20-20-0 | 9-31-0 | 31-9-0 | 36.6% (205-355-0) |
| Bolt | 12-28-0 | 36-4-0 | 7-33-0 | 27-13-0 | 21-19-0 | 16-24-0 | 40-0-0 | 31-9-0 | 16-24-0 | 10-30-0 | 21-19-0 | 27-13-0 | 16-24-0 | 25-15-0 | 54.5% (305-255-0) |
| Chill | 18-22-0 | 12-28-0 | 29-11-0 | 40-0-0 | 22-18-0 | 35-5-0 | 30-10-0 | 39-1-0 | 25-15-0 | 19-21-0 | 3-37-0 | 16-24-0 | 20-20-0 | 39-1-0 | 62.0% (347-213-0) |
| Parasite | 10-30-0 | 27-13-0 | 23-17-0 | 28-12-0 | 11-29-0 | 22-18-0 | 29-11-0 | 29-11-0 | 11-29-0 | 30-10-0 | 25-15-0 | 31-9-0 | 9-31-0 | 30-10-0 | 56.2% (315-245-0) |
| Siphon | 5-35-0 | 18-22-0 | 31-9-0 | 29-11-0 | 26-14-0 | 18-22-0 | 31-9-0 | 31-9-0 | 12-28-0 | 26-14-0 | 11-29-0 | 22-18-0 | 7-33-0 | 25-15-0 | 52.1% (292-268-0) |
| Pendulum | 29-11-0 | 22-18-0 | 27-13-0 | 8-32-0 | 32-8-0 | 26-14-0 | 20-20-0 | 31-9-0 | 26-14-0 | 18-22-0 | 28-12-0 | 32-8-0 | 21-19-0 | 2-38-0 | 57.5% (322-238-0) |
| Symbiosis | 0-40-0 | 23-17-0 | 20-20-0 | 20-20-0 | 1-39-0 | 0-40-0 | 4-36-0 | 4-36-0 | 19-21-0 | 2-38-0 | 10-30-0 | 11-29-0 | 40-0-0 | 24-16-0 | 31.8% (178-382-0) |

Tribe standing when playing a full five-card tribe deck:

1. **Buff** (Radiance) 64.6% (362-198-0)
2. **Chill** (Frost) 62.0% (347-213-0)
3. **Equalizer** (Balance) 58.8% (329-231-0)
4. **Spite** (Wrath) 58.2% (326-234-0)
5. **Pendulum** (Tide) 57.5% (322-238-0)
6. **Parasite** (Host) 56.2% (315-245-0)
7. **Bolt** (Arcane) 54.5% (305-255-0)
8. **Siphon** (Well) 52.1% (292-268-0)
9. **Blast** (Beasts) 52.0% (291-269-0)
10. **Curse** (Grave) 46.6% (261-299-0)
11. **Cinder** (Ember) 36.6% (205-355-0)
12. **Poison** (Vermin) 32.1% (180-380-0)
13. **Symbiosis** (Grove) 31.8% (178-382-0)
14. **Silence** (Hush) 31.6% (177-383-0)

## Tribe decks - card tiers (mono-tribe seats only)

These numbers are not mixed-hand numbers. A weak card can look better when it always sits next to four friends of the same ability.

| Tier | Card | Ability | Win | Captures / play | Captured / play | Kept |
| --- | --- | --- | --- | --- | --- | --- |
| A | Unicorn | Buff | 65.6% | 1.00 | 1.51 | 58% |
| A | Celestial | Buff | 65.6% | 0.93 | 1.16 | 59% |
| A | Angel | Buff | 65.6% | 0.77 | 0.47 | 73% |
| A | Paladin | Buff | 65.6% | 0.50 | 0.45 | 64% |
| A | Fairy | Buff | 65.6% | 0.33 | 0.14 | 100% |
| A | Wolf | Chill | 63.1% | 0.91 | 0.41 | 70% |
| A | Penguin | Chill | 63.1% | 0.73 | 0.28 | 83% |
| A | Frost | Chill | 63.1% | 0.72 | 0.98 | 54% |
| A | Seal | Chill | 63.1% | 0.72 | 0.33 | 82% |
| A | Polar | Chill | 63.1% | 0.70 | 0.72 | 49% |
| A | Owl | Equalizer | 59.6% | 1.09 | 1.10 | 60% |
| A | Titan | Equalizer | 59.6% | 1.00 | 1.72 | 50% |
| A | Robot | Equalizer | 59.6% | 1.00 | 0.41 | 71% |
| A | Alien | Equalizer | 59.6% | 0.94 | 0.56 | 66% |
| A | Monk | Equalizer | 59.6% | 0.48 | 1.62 | 75% |
| A | Cyclops | Spite | 59.2% | 0.98 | 0.61 | 50% |
| A | Oni | Spite | 59.2% | 0.87 | 0.79 | 61% |
| A | Wrath | Spite | 59.2% | 0.72 | 0.37 | 74% |
| A | Vendetta | Spite | 59.2% | 0.71 | 0.34 | 81% |
| A | Gorilla | Spite | 59.2% | 0.51 | 0.82 | 45% |
| A | Gyro | Pendulum | 58.3% | 0.99 | 1.03 | 61% |
| A | Moon | Pendulum | 58.3% | 0.97 | 0.82 | 71% |
| A | Tide | Pendulum | 58.3% | 0.89 | 0.95 | 65% |
| A | Hourglass | Pendulum | 58.3% | 0.85 | 0.92 | 67% |
| A | Pendulum | Pendulum | 58.3% | 0.48 | 2.25 | 73% |
| B | Wizard | Bolt | 57.2% | 1.00 | 1.35 | 43% |
| B | Mage | Bolt | 57.2% | 0.96 | 0.65 | 61% |
| B | Witch | Bolt | 57.2% | 0.92 | 0.47 | 63% |
| B | Imp | Bolt | 57.2% | 0.67 | 0.29 | 95% |
| B | Genie | Bolt | 57.2% | 0.43 | 1.63 | 63% |
| B | Leech | Parasite | 55.6% | 0.99 | 0.93 | 67% |
| B | Mimic | Parasite | 55.6% | 0.97 | 1.43 | 62% |
| B | Doppel | Parasite | 55.6% | 0.91 | 0.76 | 69% |
| B | Remora | Parasite | 55.6% | 0.87 | 0.79 | 70% |
| B | Cuckoo | Parasite | 55.6% | 0.86 | 0.80 | 72% |
| B | Shark | Blast | 51.5% | 0.96 | 1.03 | 70% |
| B | Eagle | Blast | 51.5% | 0.89 | 0.05 | 98% |
| B | T-Rex | Blast | 51.5% | 0.85 | 0.62 | 64% |
| B | Lion | Blast | 51.5% | 0.69 | 0.47 | 61% |
| B | Dragon | Blast | 51.5% | 0.48 | 1.32 | 17% |
| B | Mosquito | Siphon | 50.3% | 0.90 | 1.34 | 57% |
| B | Drain | Siphon | 50.3% | 0.86 | 0.76 | 62% |
| B | Siphon | Siphon | 50.3% | 0.75 | 0.48 | 69% |
| B | Lamprey | Siphon | 50.3% | 0.75 | 0.49 | 73% |
| B | Kraken | Siphon | 50.3% | 0.43 | 1.17 | 26% |
| B | Bat | Curse | 46.5% | 0.98 | 0.97 | 31% |
| B | Skull | Curse | 46.5% | 0.96 | 0.85 | 26% |
| B | Ghost | Curse | 46.5% | 0.95 | 0.86 | 54% |
| B | Zombie | Curse | 46.5% | 0.67 | 0.16 | 91% |
| B | Vampire | Curse | 46.5% | 0.50 | 2.17 | 88% |
| C | Scorch | Cinder | 36.6% | 0.79 | 1.20 | 51% |
| C | Fox | Cinder | 36.6% | 0.62 | 0.61 | 77% |
| C | Lizard | Cinder | 36.6% | 0.60 | 0.76 | 60% |
| C | Brand | Cinder | 36.6% | 0.59 | 0.47 | 68% |
| C | Phoenix | Cinder | 36.6% | 0.35 | 1.20 | 39% |
| C | Scorpion | Poison | 33.1% | 2.89 | 1.22 | 21% |
| C | Snake | Poison | 33.1% | 2.66 | 1.19 | 31% |
| C | Spider | Poison | 33.1% | 2.42 | 1.25 | 37% |
| C | Beetle | Poison | 33.1% | 1.43 | 0.61 | 54% |
| C | Frog | Poison | 33.1% | 0.52 | 0.49 | 79% |
| C | Hush | Silence | 31.7% | 0.75 | 0.54 | 59% |
| C | Cat | Silence | 31.7% | 0.61 | 0.11 | 94% |
| C | Ninja | Silence | 31.7% | 0.59 | 0.98 | 32% |
| C | Dread | Silence | 31.7% | 0.52 | 0.44 | 58% |
| C | Raven | Silence | 31.7% | 0.45 | 1.04 | 37% |
| C | Coral | Symbiosis | 31.6% | 1.25 | 0.69 | 40% |
| C | Ivy | Symbiosis | 31.6% | 0.92 | 0.53 | 61% |
| C | Mycelium | Symbiosis | 31.6% | 0.86 | 0.50 | 61% |
| C | Lichen | Symbiosis | 31.6% | 0.82 | 0.53 | 56% |
| C | Worldtree | Symbiosis | 31.6% | 0.38 | 1.13 | 19% |

## Read of the data

**Live leftover-off is close to even.** First player won 46.4% of decided leftover-off games, second won 53.6%, and 0.0% of all games were draws. Of every random deal, that is first 46.4% / second 53.6% / draw 0.0%. Second is only slightly ahead because they still take the last capture.

**Leftover-on (the Options rule) is the old 70%.** Same games: first 27.9% / second 53.6% / draw 18.5% of all games (34.2% / 65.8% of leftover-on decided). Leftover-on draws are first-owns-5 boards; leftover-off gives those to first. It does not invert the 70%.

Ability spread in mixed hands is **8.9 points** from Blast (53.6%) to Cinder (44.7%).

**Buff is the strongest tribe deck** at 64.6%. Mixed-hand Buff is 50.5%.

**Pendulum covers both axes.** Mixed 52.8%, mono-tribe 57.5%. A five-of Tide board always has a swung 8 or 7 on the live axis, which is why the tribe matrix runs away.

**Parasite and Siphon land near even** in mixed hands (47.6% / 50.8%). Tribe decks 56.2% / 52.1%. Copy and steal need an adjacent enemy, so they do not snowball as a five-of the way Pendulum does.

**Symbiosis is +1 per capture this game.** Mixed 51.4% (mean power 16.2), mono-Grove 31.8%. A late Grove card still sits at the player's capture count, including in hand. One capture pass after it grows.

**Poison ticks adjacent enemies, then those cards can capture.** Mixed-hand seat win 47.6%. Mono-tribe 32.1%. Friendlies are safe. One capture pass after the tick, no second wave.

**Blast is mid as a tribe** at 52.0%. Mixed-hand Blast is 53.6%. The +2 on play still stacks as a game plan, just not the matrix leader anymore.

**Chill holds up in both views** (mixed 51.6%, tribe 62.0%). **Silence does not.** Mixed 49.0% is fine; five Silences together (31.6%) just turn the board into mediocre stat-sticks.

**Over-performing mixed-hand faces (S):** Frost (57.8%, power 19, keep 62%), Owl (57.5%, power 16, keep 70%), T-Rex (57.4%, power 21, keep 62%), Vampire (57.1%, power 19, keep 59%), Alien (56.8%, power 17, keep 75%).
Nerf the body, not the ability, unless the whole tribe is also top of the matrix.

**Under-performing mixed-hand faces (D):** Frog (43.0%, power 14, keep 66%), Lizard (41.7%, power 18, keep 73%), Zombie (40.8%, power 16, keep 86%), Brand (39.1%, power 18, keep 79%).

## Suggestions (do not apply yet)

1. **Do not nerf Pendulum as a rule.** Mixed Tide is a lead, not a broken on-play. The tribe-deck runaway is five cards that all swing axes. If Tribe Decks stay a first-class mode, shave the extreme axis faces (Moon's Left 8, Pendulum's 8/2/8/2) rather than the swap.
2. **Moon** mixed 54.4%, keep 75%, power 19. Printed 2/7/2/8 becomes 8/2/7/2 after one swing. Shave Left 8→7 so the live top after the first swing is 7. That is the one Tide face to touch.
3. **Grove is capture-count, not sit-and-wait.** Lichen 49.9% / Ivy 56.1%. Re-read mixed-hand and the tribe matrix. If Grove overshoots Chill, take back the capture pass before adding body power.
4. **Mimic** mixed 46.7%, A-left (3/2/4/A), keep 51%. Left was the empty axis, so the 19-power copy card jumped. If it stays S, move the A to Right (3/A/4/2) so it shares Paladin 8 / Kraken 9 instead of sitting alone.
5. **Worldtree** mixed 55.1%, A-right (2/A/3/2). The 2-top is the farm window. Do not add power. If Grove stays the floor, swap so Worldtree is the A-left instead of Mimic.
6. **Kraken** mixed 48.3%, keep 46%, power 20. The 9-right plays like Dragon's 9/7: farmed after the sit. Leave Siphon's steal. If it stays C, move 1 off Right onto Left (4/8/3/5) rather than adding power.
7. **Leave Parasite and Siphon rules alone.** Mixed Parasite is a mild lead because Mimic is S, not because copy is broken. Drain is the Well face that is actually good; that is fine.
8. **Poison now ticks enemies, then captures once.** Re-read mixed-hand and the tribe matrix. If Vermin overshoots Chill, the capture pass is the first thing to take back, not Frog's body. If it is still the floor, bump Frog/Beetle after Grove bodies.
9. **Do not nerf Blast as a rule.** Mixed Blast is a mild lead. Mono Blast is no longer the matrix leader.
10. **Dragon** mixed 45.6%, keep 45%, power 22. Rear 3→4 this pass did not lift keep - still farmed after the 9/7 play. Leave Left at 2 unless we want another bump.
11. **Paladin** mixed 47.2%, power 21. Shaving one 8 to 7 (4/8/7/2) took it off S. Stop here. Do not nerf Buff itself.
12. **Genie is a 6/5/5/5 Bolt.** The -2 zap is swingy. If Genie is S, shave one 5 to a 4. Do not tone down Bolt's -2.
13. **Celestial** mixed 50.2%. A moved Top this pass (A/2/3/4). Leave the 2 on Right unless it falls back to C.
14. **Frog (43.0%, power 14) is still a floor face.** Poison only hits enemies now. If Frog is still D after a Grove bump, try 3/4/5/4.
15. **Owl punches above power 16** (57.5%, Equalizer). That is fine as the 'small Equalizer'. Do not buff other Balance faces to match it.
16. **Silence is fine in mixed hands and bad as a five-of.** Same class as Grove/Vermin as a tribe deck. No change unless we care about mono-Hush doing something besides the cancel.
17. **Do not chase first-player win rate with card stats.** Last-capture is the leftover-off remainder.
18. **Leftover-off is the live default.** Seat math is first 46.4% / second 53.6% / draw 0.0%. Leftover-on (Options) is first 27.9% / second 53.6% / draw 18.5%. Keep leftover scores off unless you want 5-5 draws back.
19. Re-run `python3 sim/balance.py --random 4000 --tribe-games 40 --seed 1` after any facing change. A 1-point bump moves a card a full tier in this AI.

## How to re-run

```
python3 sim/balance.py --random 4000 --tribe-games 40 --seed 1
```

