# Ember Grid balance sim

Both seats use the live **Normal** AI heuristic. Ember abilities are on. This run is the current 50-card Base Set (ten tribes, including Bolt).

## Method

- **Random deals:** 4000 games. Shuffle the 50, deal 5 and 5. Who goes first is a coin flip.
- **Tribe decks:** every tribe vs every tribe, 40 games each (4000 games). Even games blue goes first, odd games red goes first.
- First player places 5 cards, second places 4. The leftover card still counts. 6+ wins, 5-5 is a draw.
- That leftover rule means first player needs **6 of 9** on the board to win. Second player wins with **5 of 9** (plus the leftover). Expect a second-player edge.
- Card win rate is: when this card was in a seat's opening hand, how often that seat won (draws dropped).
- Capture stats only count flips during a match, including recaptures.
- The AI is the same greedy scorer as the browser game. It is not perfect play.

## Random deals - headline

- Results: blue 1454, red 1449, draw 1097 (27.4% draws)
- First player win rate (excluding draws): 29.5%
- Second player win rate (excluding draws): 70.5%
- Mean card win rate: 50.0%

## Ability / mechanic win rates (random deals)

Seat win rate = a player was dealt at least one card of that ability, then won.

| Rank | Ability | Tribe | Seat win | Card-avg win | Captures / play | Captured / play | Mean power |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Chill | Frost | 55.8% | 57.2% | 0.90 | 0.70 | 18.4 |
| 2 | Blast | Beasts | 55.3% | 56.1% | 0.77 | 0.90 | 19.8 |
| 3 | Buff | Radiance | 53.0% | 53.2% | 0.62 | 0.81 | 19.2 |
| 4 | Equalizer | Balance | 52.5% | 53.4% | 0.84 | 0.80 | 17.8 |
| 5 | Spite | Wrath | 49.8% | 50.2% | 0.68 | 0.61 | 19.2 |
| 6 | Bolt | Arcane | 49.1% | 48.4% | 0.70 | 0.95 | 19.4 |
| 7 | Silence | Hush | 48.4% | 47.5% | 0.77 | 0.69 | 18.2 |
| 8 | Curse | Grave | 46.7% | 46.0% | 0.71 | 0.60 | 17.4 |
| 9 | Cinder | Ember | 46.0% | 45.5% | 0.66 | 0.44 | 17.8 |
| 10 | Poison | Vermin | 43.8% | 42.1% | 0.64 | 0.61 | 17.2 |

## Random deals - card tier list

Tiers are z-scores of card win rate vs the random-deal field. S >= 1.6sd, A >= 0.7, B middle, C <= -0.7, D <= -1.6.

| Tier | Card | Ability | Win | Dealt | Played | Captures / play | Captured / play | Kept | Power |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S | Paladin | Buff | 61.9% | 805 | 734 | 0.37 | 0.44 | 63% | 22 |
| S | Unicorn | Buff | 60.8% | 809 | 787 | 0.72 | 1.34 | 69% | 20 |
| S | T-Rex | Blast | 60.6% | 779 | 774 | 0.61 | 0.96 | 62% | 21 |
| A | Penguin | Chill | 58.8% | 793 | 744 | 0.92 | 0.62 | 66% | 18 |
| A | Frost | Chill | 58.2% | 793 | 792 | 0.86 | 0.83 | 55% | 19 |
| A | Wolf | Chill | 58.2% | 824 | 817 | 0.93 | 0.65 | 63% | 18 |
| A | Monk | Equalizer | 58.1% | 805 | 792 | 0.67 | 0.99 | 63% | 20 |
| A | Shark | Blast | 57.5% | 809 | 801 | 0.73 | 1.19 | 66% | 20 |
| A | Owl | Equalizer | 56.9% | 809 | 678 | 0.97 | 0.85 | 66% | 16 |
| A | Vampire | Curse | 56.8% | 816 | 784 | 0.87 | 1.20 | 61% | 19 |
| A | Lion | Blast | 56.3% | 795 | 771 | 0.91 | 0.71 | 55% | 19 |
| A | Seal | Chill | 55.6% | 786 | 749 | 0.93 | 0.56 | 68% | 18 |
| A | Wrath | Spite | 55.2% | 854 | 751 | 0.86 | 0.64 | 67% | 18 |
| A | Polar | Chill | 55.2% | 797 | 793 | 0.87 | 0.86 | 55% | 19 |
| A | Eagle | Blast | 54.7% | 809 | 733 | 1.00 | 0.68 | 59% | 18 |
| B | Angel | Buff | 54.2% | 788 | 730 | 0.78 | 0.99 | 60% | 19 |
| B | Genie | Bolt | 53.2% | 801 | 801 | 0.55 | 1.27 | 61% | 21 |
| B | Robot | Equalizer | 52.0% | 806 | 609 | 0.83 | 0.39 | 78% | 17 |
| B | Hush | Silence | 51.8% | 792 | 788 | 0.85 | 0.93 | 50% | 18 |
| B | Dragon | Blast | 51.3% | 822 | 810 | 0.59 | 0.96 | 33% | 21 |
| B | Scorch | Cinder | 51.1% | 829 | 686 | 0.75 | 0.53 | 71% | 18 |
| B | Cyclops | Spite | 51.0% | 793 | 761 | 0.66 | 0.81 | 51% | 20 |
| B | Gorilla | Spite | 51.0% | 773 | 764 | 0.54 | 0.73 | 53% | 21 |
| B | Alien | Equalizer | 50.8% | 812 | 633 | 0.90 | 0.65 | 71% | 17 |
| B | Oni | Spite | 50.1% | 847 | 766 | 0.75 | 0.56 | 64% | 19 |
| B | Mage | Bolt | 49.6% | 784 | 774 | 0.81 | 1.03 | 51% | 19 |
| B | Titan | Equalizer | 49.3% | 798 | 741 | 0.83 | 1.12 | 62% | 19 |
| B | Ninja | Silence | 49.1% | 766 | 765 | 0.82 | 0.81 | 35% | 19 |
| B | Phoenix | Cinder | 48.6% | 802 | 728 | 0.65 | 0.63 | 69% | 19 |
| B | Fairy | Buff | 48.6% | 797 | 579 | 0.69 | 0.70 | 73% | 16 |
| B | Imp | Bolt | 48.4% | 801 | 741 | 0.78 | 0.79 | 60% | 18 |
| B | Scorpion | Poison | 47.9% | 822 | 813 | 0.78 | 0.82 | 50% | 19 |
| B | Dread | Silence | 46.7% | 833 | 810 | 0.71 | 0.55 | 59% | 18 |
| B | Skull | Curse | 46.2% | 761 | 595 | 0.80 | 0.68 | 70% | 17 |
| B | Witch | Bolt | 45.9% | 760 | 727 | 0.68 | 0.72 | 57% | 19 |
| B | Raven | Silence | 45.8% | 813 | 810 | 0.78 | 0.83 | 36% | 19 |
| C | Wizard | Bolt | 45.1% | 789 | 782 | 0.66 | 0.93 | 36% | 20 |
| C | Snake | Poison | 44.7% | 800 | 774 | 0.73 | 0.93 | 52% | 18 |
| C | Cat | Silence | 44.1% | 823 | 772 | 0.66 | 0.34 | 73% | 17 |
| C | Vendetta | Spite | 43.5% | 751 | 563 | 0.60 | 0.30 | 81% | 18 |
| C | Brand | Cinder | 43.3% | 801 | 604 | 0.60 | 0.27 | 84% | 18 |
| C | Ghost | Curse | 43.2% | 785 | 569 | 0.65 | 0.47 | 78% | 17 |
| C | Beetle | Poison | 42.8% | 770 | 674 | 0.63 | 0.43 | 72% | 17 |
| C | Fox | Cinder | 42.7% | 792 | 534 | 0.67 | 0.31 | 86% | 16 |
| C | Spider | Poison | 42.1% | 809 | 759 | 0.67 | 0.49 | 64% | 18 |
| C | Zombie | Curse | 42.0% | 820 | 494 | 0.52 | 0.19 | 91% | 16 |
| C | Lizard | Cinder | 42.0% | 777 | 604 | 0.64 | 0.46 | 76% | 18 |
| C | Bat | Curse | 41.6% | 815 | 675 | 0.70 | 0.45 | 74% | 18 |
| C | Celestial | Buff | 40.4% | 837 | 670 | 0.52 | 0.60 | 65% | 19 |
| D | Frog | Poison | 32.9% | 748 | 595 | 0.39 | 0.39 | 75% | 14 |

- **S:** Paladin, Unicorn, T-Rex
- **A:** Penguin, Frost, Wolf, Monk, Shark, Owl, Vampire, Lion, Seal, Wrath, Polar, Eagle
- **B:** Angel, Genie, Robot, Hush, Dragon, Scorch, Cyclops, Gorilla, Alien, Oni, Mage, Titan, Ninja, Phoenix, Fairy, Imp, Scorpion, Dread, Skull, Witch, Raven
- **C:** Wizard, Snake, Cat, Vendetta, Brand, Ghost, Beetle, Fox, Spider, Zombie, Lizard, Bat, Celestial
- **D:** Frog

## Tribe decks - mechanic vs mechanic

Each cell is the row tribe's record against the column tribe as W-L-D (row is blue's tribe). Diagonal is the mirror.

| vs | Buff | Curs | Blas | Pois | Equa | Spit | Sile | Cind | Bolt | Chil | vs field |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Buff | 12-12-16 | 0-20-20 | 2-32-6 | 10-12-18 | 20-20-0 | 14-0-26 | 26-7-7 | 21-11-8 | 1-32-7 | 7-33-0 | 38.7% (113-179-108) |
| Curse | 20-0-20 | 18-22-0 | 2-21-17 | 30-4-6 | 0-15-25 | 5-9-26 | 40-0-0 | 14-13-13 | 2-22-16 | 11-14-15 | 54.2% (142-120-138) |
| Blast | 31-3-6 | 16-5-19 | 5-9-26 | 39-0-1 | 13-11-16 | 22-0-18 | 24-0-16 | 25-3-12 | 28-0-12 | 13-10-17 | 84.0% (216-41-143) |
| Poison | 9-10-21 | 4-31-5 | 0-34-6 | 20-20-0 | 0-40-0 | 0-20-20 | 0-12-28 | 6-24-10 | 0-34-6 | 6-34-0 | 14.8% (45-259-96) |
| Equalizer | 20-20-0 | 12-0-28 | 24-7-9 | 40-0-0 | 0-0-40 | 0-20-20 | 32-0-8 | 21-4-15 | 8-12-20 | 17-20-3 | 67.7% (174-83-143) |
| Spite | 0-16-24 | 13-4-23 | 0-18-22 | 20-0-20 | 20-0-20 | 0-0-40 | 31-0-9 | 19-4-17 | 15-6-19 | 5-29-6 | 61.5% (123-77-200) |
| Silence | 9-27-4 | 0-40-0 | 0-32-8 | 6-0-34 | 0-34-6 | 0-31-9 | 19-18-3 | 5-21-14 | 0-27-13 | 15-8-17 | 18.5% (54-238-108) |
| Cinder | 9-26-5 | 15-6-19 | 7-23-10 | 29-5-6 | 10-16-14 | 5-15-20 | 16-8-16 | 11-13-16 | 8-26-6 | 0-40-0 | 38.2% (110-178-112) |
| Bolt | 36-2-2 | 27-3-10 | 0-24-16 | 29-0-11 | 9-7-24 | 10-14-16 | 31-0-9 | 18-8-14 | 16-15-9 | 5-14-21 | 67.5% (181-87-132) |
| Chill | 34-6-0 | 10-10-20 | 12-12-16 | 37-3-0 | 16-22-2 | 31-1-8 | 13-14-13 | 40-0-0 | 13-5-22 | 8-11-21 | 71.8% (214-84-102) |

Tribe standing when playing a full five-card tribe deck:

1. **Blast** (Beasts) 84.0% (216-41-143)
2. **Chill** (Frost) 71.8% (214-84-102)
3. **Equalizer** (Balance) 67.7% (174-83-143)
4. **Bolt** (Arcane) 67.5% (181-87-132)
5. **Spite** (Wrath) 61.5% (123-77-200)
6. **Curse** (Grave) 54.2% (142-120-138)
7. **Buff** (Radiance) 38.7% (113-179-108)
8. **Cinder** (Ember) 38.2% (110-178-112)
9. **Silence** (Hush) 18.5% (54-238-108)
10. **Poison** (Vermin) 14.8% (45-259-96)

## Tribe decks - card tiers (mono-tribe seats only)

These numbers are not mixed-hand numbers. A weak card can look better when it always sits next to four friends of the same ability.

| Tier | Card | Ability | Win | Captures / play | Captured / play | Kept |
| --- | --- | --- | --- | --- | --- | --- |
| A | Shark | Blast | 82.1% | 1.03 | 0.83 | 74% |
| A | Lion | Blast | 82.1% | 0.96 | 0.28 | 74% |
| A | Eagle | Blast | 82.1% | 0.82 | 0.19 | 89% |
| A | Dragon | Blast | 82.1% | 0.71 | 0.91 | 34% |
| A | T-Rex | Blast | 82.1% | 0.66 | 0.82 | 82% |
| A | Wolf | Chill | 71.4% | 0.94 | 0.31 | 74% |
| A | Penguin | Chill | 71.4% | 0.76 | 0.27 | 84% |
| A | Frost | Chill | 71.4% | 0.73 | 0.94 | 50% |
| A | Seal | Chill | 71.4% | 0.72 | 0.35 | 82% |
| A | Polar | Chill | 71.4% | 0.66 | 0.88 | 52% |
| A | Wizard | Bolt | 66.9% | 1.01 | 0.93 | 48% |
| A | Mage | Bolt | 66.9% | 0.95 | 0.58 | 66% |
| A | Witch | Bolt | 66.9% | 0.88 | 0.47 | 62% |
| A | Imp | Bolt | 66.9% | 0.67 | 0.32 | 94% |
| A | Genie | Bolt | 66.9% | 0.40 | 1.30 | 64% |
| A | Owl | Equalizer | 66.5% | 1.18 | 1.03 | 57% |
| A | Titan | Equalizer | 66.5% | 1.00 | 1.33 | 50% |
| A | Alien | Equalizer | 66.5% | 0.93 | 0.51 | 65% |
| A | Robot | Equalizer | 66.5% | 0.91 | 0.46 | 68% |
| A | Monk | Equalizer | 66.5% | 0.48 | 1.37 | 74% |
| B | Cyclops | Spite | 58.7% | 0.97 | 0.63 | 38% |
| B | Oni | Spite | 58.7% | 0.81 | 0.53 | 58% |
| B | Wrath | Spite | 58.7% | 0.62 | 0.32 | 78% |
| B | Vendetta | Spite | 58.7% | 0.58 | 0.16 | 90% |
| B | Gorilla | Spite | 58.7% | 0.47 | 0.64 | 38% |
| B | Ghost | Curse | 54.6% | 1.06 | 0.67 | 60% |
| B | Bat | Curse | 54.6% | 1.04 | 0.86 | 31% |
| B | Skull | Curse | 54.6% | 0.97 | 0.87 | 31% |
| B | Zombie | Curse | 54.6% | 0.76 | 0.07 | 96% |
| B | Vampire | Curse | 54.6% | 0.45 | 1.84 | 88% |
| B | Unicorn | Buff | 39.6% | 0.88 | 1.13 | 37% |
| B | Angel | Buff | 39.6% | 0.63 | 0.47 | 56% |
| B | Paladin | Buff | 39.6% | 0.29 | 0.27 | 73% |
| B | Celestial | Buff | 39.6% | 0.28 | 0.58 | 47% |
| B | Fairy | Buff | 39.6% | 0.26 | 0.01 | 100% |
| B | Scorch | Cinder | 37.1% | 0.78 | 0.77 | 56% |
| B | Fox | Cinder | 37.1% | 0.70 | 0.60 | 73% |
| B | Brand | Cinder | 37.1% | 0.65 | 0.42 | 72% |
| B | Lizard | Cinder | 37.1% | 0.63 | 0.70 | 64% |
| B | Phoenix | Cinder | 37.1% | 0.28 | 1.19 | 40% |
| C | Hush | Silence | 19.4% | 0.72 | 0.57 | 56% |
| C | Cat | Silence | 19.4% | 0.51 | 0.05 | 97% |
| C | Dread | Silence | 19.4% | 0.51 | 0.42 | 60% |
| C | Ninja | Silence | 19.4% | 0.50 | 1.05 | 26% |
| C | Raven | Silence | 19.4% | 0.43 | 0.98 | 30% |
| D | Snake | Poison | 14.6% | 0.78 | 0.95 | 37% |
| D | Spider | Poison | 14.6% | 0.66 | 0.62 | 57% |
| D | Beetle | Poison | 14.6% | 0.58 | 0.48 | 59% |
| D | Frog | Poison | 14.6% | 0.47 | 0.00 | 100% |
| D | Scorpion | Poison | 14.6% | 0.38 | 1.10 | 24% |

## Read of the data

**Second player is favored.** First player won 29.5% of decided random games, second won 70.5%, and 27.4% of all games were 5-5. That is mostly leftover scoring (first must own 6 board cards to win) plus the second player getting the last captures. It is not a card-stat bug. Do not 'fix' it by buffing first-player cards.

Ability spread in mixed hands is **12.0 points** from Chill (55.8%) to Poison (43.8%).

**Poison ticks adjacent enemies only.** Mixed-hand seat win 43.8%. Mono-tribe 14.8%. Friendlies are safe, so a Vermin board is no longer a self-own.

**Blast is the strongest tribe deck** at 84.0%. Mixed-hand Blast is only mildly ahead (55.3%). The +2 on play stacks as a game plan when every card has it. That matters once people pick tribe decks, not as much in random deals.

**Chill holds up in both views** (mixed 55.8%, tribe 71.8%). **Silence does not.** Mixed 48.4% is fine; five Silences together (18.5%) just turn the board into mediocre stat-sticks.

**Over-performing mixed-hand faces (S):** Paladin (61.9%, power 22, keep 63%), Unicorn (60.8%, power 20, keep 69%), T-Rex (60.6%, power 21, keep 62%).
Nerf the body, not the ability, unless the whole tribe is also top of the matrix.

**Under-performing mixed-hand faces (D):** Frog (32.9%, power 14, keep 75%).

## Suggestions (do not apply yet)

1. **Poison now only hits enemies.** Re-read the tribe matrix. If Vermin is still the floor, bump Frog/Beetle after this run, not before. If it overshoots, the tick is the knob, not friendly-fire.
2. **Do not nerf Blast as a rule.** Mixed Blast is a mild lead. Mono Blast is the runaway because every play has +2. If tribe decks stay, shave Beasts attack facings (T-Rex 8/5/6/2, Lion 7/6/4/2) by 1 on one strong edge. Leave Eagle as the cheap face.
3. **Dragon is a trap, not an S card.** Mixed win 51.3% with only 33% kept. The 9/7 front wins the play, then the 3/2 rear gets farmed. If you want it to be the ace, raise Bottom or Left by 1. If you want a glass cannon, leave it and stop putting it in 'must pick' talk.
4. **Paladin is the mixed-hand buff problem.** 61.9%, power 22, facings 4/8/8/2. Buff on a 22-power body is a lot. Shave one 8 to 7. Do not nerf Buff itself (Radiance is mid as a tribe).
5. **Genie is a 6/5/5/5 Bolt.** The -2 zap is swingy. If Genie is S, shave one 5 to a 4. Do not tone down Bolt's -2; the random target is the point. Cinder still paints a cell - leave that variance alone.
6. **Celestial is a D Buff.** 40.4% with an A on Bottom and a 2 on Right. The 10 rarely faces what the AI attacks. Move 2 points from Bottom onto Right, or swap Top/Bottom. Same power, less awkward.
7. **Frog (32.9%, power 14) is the floor.** Poison only hits enemies now. If Frog is still D, bump to something like 3/4/5/4.
8. **Owl punches above power 16** (56.9%, Equalizer). That is fine as the 'small Equalizer'. Do not buff other Balance faces to match it. Titan's 10-top is the one to watch, not Monk.
9. **Silence is fine in mixed hands and bad as a five-of.** No change unless we care about mono-Hush. If we do, Silence should do a little something besides stripping (it currently does nothing in a mirror).
10. **Spite is not the problem.** Wrath is playable as a tribe. Cyclops's Left 1 is ugly but the card is still A in mixed. Raise that 1 to 2 only if you want it to sit more.
11. **Do not chase first-player win rate with card stats.** Leftover scoring plus last-capture is doing that. If a future match feels lopsided on who goes first, that is a table rule, not Paladin.
12. Re-run `python3 sim/balance.py --random 4000 --tribe-games 40 --seed 1` after any facing change. A 1-point bump moves a card a full tier in this AI.

## How to re-run

```
python3 sim/balance.py --random 4000 --tribe-games 40 --seed 1
```

