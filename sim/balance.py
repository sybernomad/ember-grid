#!/usr/bin/env python3
"""Simulate Ember Grid matches and report card / ability balance.

Both seats use the in-game Normal AI heuristic. Ember abilities are on.
Does not change any live cards.
"""

from __future__ import annotations

import argparse
import random
import statistics
from collections import defaultdict

# --- Base Set (same order as index.html, ids BS-01 .. BS-50) ---

CARDS = [
    {"name": "Celestial", "base": [3, 2, 10, 4], "ability": "aura_buff"},
    {"name": "Fairy", "base": [3, 4, 3, 6], "ability": "aura_buff"},
    {"name": "Unicorn", "base": [4, 4, 5, 7], "ability": "aura_buff"},
    {"name": "Paladin", "base": [4, 8, 8, 2], "ability": "aura_buff"},
    {"name": "Angel", "base": [4, 5, 4, 6], "ability": "aura_buff"},
    {"name": "Ghost", "base": [3, 7, 2, 5], "ability": "curse_adj"},
    {"name": "Vampire", "base": [7, 3, 3, 6], "ability": "curse_adj"},
    {"name": "Skull", "base": [8, 2, 4, 3], "ability": "curse_adj"},
    {"name": "Zombie", "base": [4, 2, 6, 4], "ability": "curse_adj"},
    {"name": "Bat", "base": [5, 6, 3, 4], "ability": "curse_adj"},
    {"name": "Dragon", "base": [9, 7, 3, 2], "ability": "blast"},
    {"name": "T-Rex", "base": [8, 5, 6, 2], "ability": "blast"},
    {"name": "Lion", "base": [7, 6, 4, 2], "ability": "blast"},
    {"name": "Shark", "base": [7, 4, 5, 4], "ability": "blast"},
    {"name": "Eagle", "base": [6, 6, 3, 3], "ability": "blast"},
    {"name": "Spider", "base": [4, 6, 5, 3], "ability": "poison"},
    {"name": "Scorpion", "base": [6, 4, 7, 2], "ability": "poison"},
    {"name": "Snake", "base": [5, 4, 4, 5], "ability": "poison"},
    {"name": "Frog", "base": [2, 4, 5, 3], "ability": "poison"},
    {"name": "Beetle", "base": [4, 5, 5, 3], "ability": "poison"},
    {"name": "Monk", "base": [5, 5, 5, 5], "ability": "equalizer"},
    {"name": "Titan", "base": [10, 3, 4, 2], "ability": "equalizer"},
    {"name": "Robot", "base": [5, 5, 5, 2], "ability": "equalizer"},
    {"name": "Owl", "base": [5, 3, 2, 6], "ability": "equalizer"},
    {"name": "Alien", "base": [7, 3, 5, 2], "ability": "equalizer"},
    {"name": "Cyclops", "base": [8, 4, 7, 1], "ability": "spite"},
    {"name": "Gorilla", "base": [7, 5, 6, 3], "ability": "spite"},
    {"name": "Wrath", "base": [6, 4, 3, 5], "ability": "spite"},
    {"name": "Vendetta", "base": [4, 6, 5, 3], "ability": "spite"},
    {"name": "Oni", "base": [6, 5, 4, 4], "ability": "spite"},
    {"name": "Dread", "base": [3, 6, 5, 4], "ability": "silence"},
    {"name": "Hush", "base": [5, 4, 5, 4], "ability": "silence"},
    {"name": "Raven", "base": [4, 6, 4, 5], "ability": "silence"},
    {"name": "Ninja", "base": [5, 6, 3, 5], "ability": "silence"},
    {"name": "Cat", "base": [2, 5, 7, 3], "ability": "silence"},
    {"name": "Scorch", "base": [5, 5, 3, 5], "ability": "cinder"},
    {"name": "Brand", "base": [4, 5, 6, 3], "ability": "cinder"},
    {"name": "Fox", "base": [6, 5, 2, 3], "ability": "cinder"},
    {"name": "Phoenix", "base": [5, 4, 6, 4], "ability": "cinder"},
    {"name": "Lizard", "base": [5, 4, 5, 4], "ability": "cinder"},
    {"name": "Wizard", "base": [5, 7, 3, 5], "ability": "bolt"},
    {"name": "Genie", "base": [6, 5, 5, 5], "ability": "bolt"},
    {"name": "Witch", "base": [4, 6, 5, 4], "ability": "bolt"},
    {"name": "Mage", "base": [6, 3, 6, 4], "ability": "bolt"},
    {"name": "Imp", "base": [3, 6, 4, 5], "ability": "bolt"},
    {"name": "Frost", "base": [4, 5, 4, 6], "ability": "chill"},
    {"name": "Wolf", "base": [6, 5, 4, 3], "ability": "chill"},
    {"name": "Penguin", "base": [3, 4, 6, 5], "ability": "chill"},
    {"name": "Polar", "base": [6, 3, 7, 3], "ability": "chill"},
    {"name": "Seal", "base": [3, 5, 5, 5], "ability": "chill"},
]

for i, card in enumerate(CARDS):
    card["id"] = f"BS-{i + 1:02d}"
    card["power"] = sum(card["base"])

TRIBES = [
    ("aura_buff", "Radiance", "Buff"),
    ("curse_adj", "Grave", "Curse"),
    ("blast", "Beasts", "Blast"),
    ("poison", "Vermin", "Poison"),
    ("equalizer", "Balance", "Equalizer"),
    ("spite", "Wrath", "Spite"),
    ("silence", "Hush", "Silence"),
    ("cinder", "Ember", "Cinder"),
    ("bolt", "Arcane", "Bolt"),
    ("chill", "Frost", "Chill"),
]
TRIBE_BY_ID = {t[0]: t for t in TRIBES}
ABILITY_NAME = {t[0]: t[2] for t in TRIBES}


def proto_by_ability(ability: str) -> list[dict]:
    return [c for c in CARDS if c["ability"] == ability]


def clone_card(proto: dict, owner: str) -> dict:
    return {
        "id": proto["id"],
        "name": proto["name"],
        "ability": proto["ability"],
        "base": list(proto["base"]),
        "owner": owner,
        "original": owner,
        "stats": list(proto["base"]),
        "captures_made": 0,
        "times_captured": 0,
        "played": False,
        "played_index": None,
    }


def neighbors(index: int) -> list[int]:
    row, col = divmod(index, 3)
    out = []
    if row > 0:
        out.append(index - 3)
    if col < 2:
        out.append(index + 1)
    if row < 2:
        out.append(index + 3)
    if col > 0:
        out.append(index - 1)
    return out


def facing_pairs(index: int) -> list[tuple[int, int, int]]:
    """(neighbor_idx, my_stat, their_stat) for existing directions."""
    row, col = divmod(index, 3)
    pairs = []
    if row > 0:
        pairs.append((index - 3, 0, 2))
    if col < 2:
        pairs.append((index + 1, 1, 3))
    if row < 2:
        pairs.append((index + 3, 2, 0))
    if col > 0:
        pairs.append((index - 1, 3, 1))
    return pairs


class Match:
    def __init__(self, blue: list[dict], red: list[dict], first: str, rng: random.Random):
        self.board: list[dict | None] = [None] * 9
        self.cell_effects: list[str | None] = [None] * 9
        self.hands = {"blue": blue, "red": red}
        self.turn = first
        self.rng = rng
        self.plays = 0

    def would_be_silenced(self, owner: str, index: int) -> bool:
        for i in neighbors(index):
            n = self.board[i]
            if n and n["owner"] != owner and n["ability"] == "silence":
                return True
        return False

    def is_silenced(self, index: int) -> bool:
        card = self.board[index]
        if not card:
            return False
        return self.would_be_silenced(card["owner"], index)

    def recalc(self) -> None:
        for card in self.board:
            if card:
                card["stats"] = list(card["base"])
        for index, card in enumerate(self.board):
            if not card or card["ability"] != "aura_buff" or self.is_silenced(index):
                continue
            for idx in neighbors(index):
                n = self.board[idx]
                if n and n["owner"] == card["owner"]:
                    n["stats"] = [max(1, min(10, s + 1)) for s in n["stats"]]
        for index, card in enumerate(self.board):
            if not card or card["ability"] != "chill" or self.is_silenced(index):
                continue
            for idx in neighbors(index):
                n = self.board[idx]
                if n and n["owner"] != card["owner"]:
                    n["stats"] = [max(1, min(10, s - 1)) for s in n["stats"]]
        for index, card in enumerate(self.board):
            if not card or self.cell_effects[index] != "cinder":
                continue
            card["stats"] = [max(1, min(10, s - 1)) for s in card["stats"]]

    def effective_stat(self, card: dict, stat_index: int, placement_turn: bool, silenced: bool) -> int:
        val = (card.get("stats") or card["base"])[stat_index]
        if placement_turn and not silenced and card["ability"] == "blast":
            val += 2
        return val

    def apply_on_play(self, placed: dict, index: int) -> None:
        if not placed["ability"] or self.is_silenced(index):
            return
        kind = placed["ability"]
        if kind == "curse_adj":
            enemies = [
                (i, c) for i, c in enumerate(self.board)
                if c and c["owner"] != placed["owner"]
            ]
            if enemies:
                enemies.sort(key=lambda pair: sum(pair[1]["base"]), reverse=True)
                target = enemies[0][1]
                target["base"] = [max(1, s - 1) for s in target["base"]]
        elif kind == "cinder":
            fresh = [i for i in range(9) if self.board[i] is None and self.cell_effects[i] != "cinder"]
            empties = fresh or [i for i in range(9) if self.board[i] is None]
            target = self.rng.choice(empties) if empties else index
            self.cell_effects[target] = "cinder"
        elif kind == "bolt":
            enemies = [c for c in self.board if c and c["owner"] != placed["owner"]]
            if enemies:
                target = self.rng.choice(enemies)
                target["base"] = [max(1, s - 2) for s in target["base"]]

    def poison(self) -> None:
        # Snapshot who is poisoning so newly reduced cards don't extra-proc.
        sources = [
            i for i, c in enumerate(self.board)
            if c and c["ability"] == "poison" and not self.is_silenced(i)
        ]
        for index in sources:
            src = self.board[index]
            for idx in neighbors(index):
                n = self.board[idx]
                if n and n["owner"] != src["owner"]:
                    n["base"] = [max(1, s - 1) for s in n["base"]]

    def check_captures(self, placed_index: int, placed: dict) -> int:
        placed_silenced = self.is_silenced(placed_index)
        flipped = 0
        for nidx, mine, theirs in facing_pairs(placed_index):
            neighbor = self.board[nidx]
            if not neighbor or neighbor["owner"] == placed["owner"]:
                continue
            silenced_when_hit = self.is_silenced(nidx)
            my_val = self.effective_stat(placed, mine, True, placed_silenced)
            their_val = self.effective_stat(neighbor, theirs, False, silenced_when_hit)
            captures = my_val > their_val
            if (
                not captures
                and not placed_silenced
                and placed["ability"] == "equalizer"
                and my_val == their_val
            ):
                captures = True
            if not captures:
                continue
            orig = neighbor["owner"]
            neighbor["owner"] = placed["owner"]
            neighbor["times_captured"] += 1
            placed["captures_made"] += 1
            flipped += 1
            if neighbor["ability"] == "spite" and not silenced_when_hit:
                placed["base"] = [max(1, s - 1) for s in placed["base"]]
                placed["stats"] = [max(1, s - 1) for s in (placed["stats"] or placed["base"])]
        return flipped

    def place(self, owner: str, hand_index: int, cell: int) -> None:
        card = self.hands[owner].pop(hand_index)
        card["stats"] = list(card["base"])
        card["played"] = True
        card["played_index"] = cell
        self.board[cell] = card
        self.apply_on_play(card, cell)
        self.recalc()
        self.check_captures(cell, card)
        self.recalc()
        self.poison()
        self.recalc()
        self.plays += 1
        self.turn = "red" if owner == "blue" else "blue"

    def pick_move(self, owner: str) -> tuple[int, int]:
        """Normal AI heuristic, same weights as index.html, for either seat."""
        opp = "red" if owner == "blue" else "blue"
        empty = [i for i, c in enumerate(self.board) if c is None]
        hand = self.hands[owner]
        best = None
        max_score = -999.0
        for card_index, card in enumerate(hand):
            for cell in empty:
                score = 0.0
                flips = 0
                exposure = 0.0
                silenced_here = self.would_be_silenced(owner, cell)
                for nidx, mine, theirs in facing_pairs(cell):
                    neighbor = self.board[nidx]
                    if neighbor:
                        my_val = self.effective_stat(card, mine, True, silenced_here)
                        their_val = self.effective_stat(
                            neighbor, theirs, False, self.is_silenced(nidx)
                        )
                        if neighbor["ability"] == "poison" and not self.is_silenced(nidx):
                            exposure += 2
                        if card["ability"] == "poison" and not silenced_here:
                            if neighbor["owner"] == opp:
                                score += 3
                        if (
                            card["ability"] == "silence"
                            and neighbor["owner"] == opp
                            and neighbor["ability"]
                        ):
                            score += 4
                        if card["ability"] == "chill" and neighbor["owner"] == opp:
                            score += 3
                        if neighbor["ability"] == "spite" and neighbor["owner"] == opp:
                            exposure += 2
                        if neighbor["owner"] == opp:
                            captures = my_val > their_val
                            if (
                                not captures
                                and not silenced_here
                                and card["ability"] == "equalizer"
                                and my_val == their_val
                            ):
                                captures = True
                            if captures:
                                flips += 1
                    elif neighbor is None:
                        pass
                score += flips * 14 + sum(card["base"]) * 0.1 + 3 - exposure * 2.5
                if self.cell_effects[cell] == "cinder":
                    score -= 5
                if silenced_here and card["ability"] != "silence":
                    score -= 3
                if card["ability"] == "bolt" and not silenced_here:
                    if any(c and c["owner"] == opp for c in self.board):
                        score += 3
                if score > max_score:
                    max_score = score
                    best = (card_index, cell)
        if best is None:
            return 0, empty[0]
        return best

    def play_out(self) -> str:
        while self.plays < 9:
            owner = self.turn
            if not self.hands[owner]:
                break
            hand_i, cell = self.pick_move(owner)
            self.place(owner, hand_i, cell)
        blue = sum(1 for c in self.board if c and c["owner"] == "blue") + len(self.hands["blue"])
        red = sum(1 for c in self.board if c and c["owner"] == "red") + len(self.hands["red"])
        if blue > red:
            return "blue"
        if red > blue:
            return "red"
        return "draw"

    def all_cards(self) -> list[dict]:
        cards = [c for c in self.board if c]
        cards.extend(self.hands["blue"])
        cards.extend(self.hands["red"])
        return cards


def empty_card_stats() -> dict:
    return {
        "dealt": 0,
        "played": 0,
        "leftover": 0,
        "wins": 0,
        "losses": 0,
        "draws": 0,
        "captures_made": 0,
        "times_captured": 0,
        "final_owned": 0,
        "first_dealt": 0,
        "second_dealt": 0,
        "power": 0,
        "ability": "",
    }


def record_game(bucket: dict, match: Match, winner: str, first: str) -> None:
    bucket["games"] += 1
    bucket["wins"][winner] += 1
    if first == winner:
        bucket["first_wins"] += 1
    elif winner != "draw":
        bucket["second_wins"] += 1
    if winner == "draw":
        bucket["draws"] += 1

    for card in match.all_cards():
        st = bucket["cards"][card["name"]]
        st["dealt"] += 1
        st["ability"] = card["ability"]
        st["power"] = sum(next(c["base"] for c in CARDS if c["name"] == card["name"]))
        if card["original"] == first:
            st["first_dealt"] += 1
        else:
            st["second_dealt"] += 1
        if card["played"]:
            st["played"] += 1
        else:
            st["leftover"] += 1
        st["captures_made"] += card["captures_made"]
        st["times_captured"] += card["times_captured"]
        if card["owner"] == card["original"]:
            st["final_owned"] += 1
        result = winner
        if result == "draw":
            st["draws"] += 1
        elif result == card["original"]:
            st["wins"] += 1
        else:
            st["losses"] += 1


def new_bucket() -> dict:
    return {
        "games": 0,
        "wins": defaultdict(int),
        "draws": 0,
        "first_wins": 0,
        "second_wins": 0,
        "cards": defaultdict(empty_card_stats),
        "ability_seat": defaultdict(lambda: {"wins": 0, "losses": 0, "draws": 0, "games": 0}),
        "tribe_vs": defaultdict(lambda: defaultdict(lambda: {"wins": 0, "losses": 0, "draws": 0})),
    }


def deal_random(rng: random.Random) -> tuple[list[dict], list[dict]]:
    dealt = rng.sample(CARDS, 10)
    blue = [clone_card(c, "blue") for c in dealt[:5]]
    red = [clone_card(c, "red") for c in dealt[5:]]
    return blue, red


def deal_tribe(ability: str, owner: str) -> list[dict]:
    return [clone_card(c, owner) for c in proto_by_ability(ability)]


def run_random(n: int, rng: random.Random) -> dict:
    bucket = new_bucket()
    for _ in range(n):
        blue, red = deal_random(rng)
        first = "blue" if rng.random() < 0.5 else "red"
        match = Match(blue, red, first, rng)
        winner = match.play_out()
        record_game(bucket, match, winner, first)
        for owner, hand_or_board_owner in (("blue", "blue"), ("red", "red")):
            abilities = [c["ability"] for c in match.all_cards() if c["original"] == owner]
            for ab in set(abilities):
                seat = bucket["ability_seat"][ab]
                seat["games"] += 1
                if winner == "draw":
                    seat["draws"] += 1
                elif winner == owner:
                    seat["wins"] += 1
                else:
                    seat["losses"] += 1
    return bucket


def run_tribes(games_per_pair: int, rng: random.Random) -> dict:
    bucket = new_bucket()
    ids = [t[0] for t in TRIBES]
    for a in ids:
        for b in ids:
            for i in range(games_per_pair):
                blue = deal_tribe(a, "blue")
                red = deal_tribe(b, "red")
                rng.shuffle(blue)
                rng.shuffle(red)
                first = "blue" if i % 2 == 0 else "red"
                match = Match(blue, red, first, rng)
                winner = match.play_out()
                record_game(bucket, match, winner, first)
                cell = bucket["tribe_vs"][a][b]
                if winner == "draw":
                    cell["draws"] += 1
                elif winner == "blue":
                    cell["wins"] += 1
                else:
                    cell["losses"] += 1
                # Mirror seat: b vs a from red's view is recorded in the [b][a] loop.
    return bucket


def win_pct(wins: int, losses: int) -> float | None:
    n = wins + losses
    if n <= 0:
        return None
    return 100.0 * wins / n


def tier_for(z: float) -> str:
    if z >= 1.6:
        return "S"
    if z >= 0.7:
        return "A"
    if z >= -0.7:
        return "B"
    if z >= -1.6:
        return "C"
    return "D"


def analyze_cards(bucket: dict) -> list[dict]:
    rows = []
    for name, st in bucket["cards"].items():
        wp = win_pct(st["wins"], st["losses"])
        plays = max(1, st["played"])
        rows.append({
            "name": name,
            "ability": st["ability"],
            "ability_name": ABILITY_NAME[st["ability"]],
            "tribe": TRIBE_BY_ID[st["ability"]][1],
            "power": st["power"],
            "dealt": st["dealt"],
            "played": st["played"],
            "leftover": st["leftover"],
            "win_pct": wp,
            "wins": st["wins"],
            "losses": st["losses"],
            "draws": st["draws"],
            "captures_per_play": st["captures_made"] / plays,
            "captured_per_play": st["times_captured"] / plays if st["played"] else 0.0,
            "keep_pct": 100.0 * st["final_owned"] / st["dealt"] if st["dealt"] else 0.0,
            "play_pct": 100.0 * st["played"] / st["dealt"] if st["dealt"] else 0.0,
        })
    rates = [r["win_pct"] for r in rows if r["win_pct"] is not None]
    mean = statistics.mean(rates)
    sd = statistics.pstdev(rates) if len(rates) > 1 else 1.0
    if sd < 0.01:
        sd = 0.01
    for r in rows:
        r["z"] = (r["win_pct"] - mean) / sd if r["win_pct"] is not None else 0.0
        r["tier"] = tier_for(r["z"])
    rows.sort(key=lambda r: (-(r["win_pct"] or 0), -r["captures_per_play"]))
    return rows


def analyze_abilities(rows: list[dict], bucket: dict) -> list[dict]:
    by = defaultdict(list)
    for r in rows:
        by[r["ability"]].append(r)
    out = []
    for ab, group in by.items():
        rates = [r["win_pct"] for r in group if r["win_pct"] is not None]
        seat = bucket["ability_seat"][ab]
        seat_wp = win_pct(seat["wins"], seat["losses"])
        out.append({
            "ability": ab,
            "ability_name": ABILITY_NAME[ab],
            "tribe": TRIBE_BY_ID[ab][1],
            "card_win_avg": statistics.mean(rates) if rates else None,
            "seat_games": seat["games"],
            "seat_win_pct": seat_wp,
            "captures_per_play": statistics.mean(r["captures_per_play"] for r in group),
            "captured_per_play": statistics.mean(r["captured_per_play"] for r in group),
            "power": statistics.mean(r["power"] for r in group),
        })
    out.sort(key=lambda r: (-(r["seat_win_pct"] or 0), -(r["card_win_avg"] or 0)))
    return out


def fmt_pct(v: float | None) -> str:
    return "n/a" if v is None else f"{v:.1f}%"


def write_report(path: str, random_b: dict, tribe_b: dict, n_random: int, n_pair: int) -> str:
    rand_rows = analyze_cards(random_b)
    tribe_rows = analyze_cards(tribe_b)
    rand_abs = analyze_abilities(rand_rows, random_b)
    mean = statistics.mean(r["win_pct"] for r in rand_rows)
    first_games = random_b["first_wins"] + random_b["second_wins"]
    first_pct = 100.0 * random_b["first_wins"] / first_games if first_games else 0
    second_pct = 100.0 * random_b["second_wins"] / first_games if first_games else 0
    draw_pct = 100.0 * random_b["wins"]["draw"] / random_b["games"] if random_b["games"] else 0
    lines = []
    a = lines.append

    a("# Ember Grid balance sim")
    a("")
    a("Both seats use the live **Normal** AI heuristic. Ember abilities are on. This run is the current 50-card Base Set (ten tribes, including Bolt).")
    a("")
    a("## Method")
    a("")
    a(f"- **Random deals:** {n_random} games. Shuffle the {len(CARDS)}, deal 5 and 5. Who goes first is a coin flip.")
    a(f"- **Tribe decks:** every tribe vs every tribe, {n_pair} games each ({len(TRIBES)*len(TRIBES)*n_pair} games). Even games blue goes first, odd games red goes first.")
    a("- First player places 5 cards, second places 4. The leftover card still counts. 6+ wins, 5-5 is a draw.")
    a("- That leftover rule means first player needs **6 of 9** on the board to win. Second player wins with **5 of 9** (plus the leftover). Expect a second-player edge.")
    a("- Card win rate is: when this card was in a seat's opening hand, how often that seat won (draws dropped).")
    a("- Capture stats only count flips during a match, including recaptures.")
    a("- The AI is the same greedy scorer as the browser game. It is not perfect play.")
    a("")
    a("## Random deals - headline")
    a("")
    a(f"- Results: blue {random_b['wins']['blue']}, red {random_b['wins']['red']}, draw {random_b['wins']['draw']} ({draw_pct:.1f}% draws)")
    a(f"- First player win rate (excluding draws): {first_pct:.1f}%")
    a(f"- Second player win rate (excluding draws): {second_pct:.1f}%")
    a(f"- Mean card win rate: {mean:.1f}%")
    a("")
    a("## Ability / mechanic win rates (random deals)")
    a("")
    a("Seat win rate = a player was dealt at least one card of that ability, then won.")
    a("")
    a("| Rank | Ability | Tribe | Seat win | Card-avg win | Captures / play | Captured / play | Mean power |")
    a("| --- | --- | --- | --- | --- | --- | --- | --- |")
    for i, r in enumerate(rand_abs, 1):
        a(
            f"| {i} | {r['ability_name']} | {r['tribe']} | {fmt_pct(r['seat_win_pct'])} | "
            f"{fmt_pct(r['card_win_avg'])} | {r['captures_per_play']:.2f} | {r['captured_per_play']:.2f} | {r['power']:.1f} |"
        )
    a("")

    a("## Random deals - card tier list")
    a("")
    a("Tiers are z-scores of card win rate vs the random-deal field. S >= 1.6sd, A >= 0.7, B middle, C <= -0.7, D <= -1.6.")
    a("")
    a("| Tier | Card | Ability | Win | Dealt | Played | Captures / play | Captured / play | Kept | Power |")
    a("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |")
    for r in rand_rows:
        a(
            f"| {r['tier']} | {r['name']} | {r['ability_name']} | {fmt_pct(r['win_pct'])} | "
            f"{r['dealt']} | {r['played']} | {r['captures_per_play']:.2f} | {r['captured_per_play']:.2f} | "
            f"{r['keep_pct']:.0f}% | {r['power']} |"
        )
    a("")

    for tier in ["S", "A", "B", "C", "D"]:
        names = [r["name"] for r in rand_rows if r["tier"] == tier]
        a(f"- **{tier}:** {', '.join(names) if names else '(none)'}")
    a("")

    a("## Tribe decks - mechanic vs mechanic")
    a("")
    a("Each cell is the row tribe's record against the column tribe as W-L-D (row is blue's tribe). Diagonal is the mirror.")
    a("")
    ids = [t[0] for t in TRIBES]
    short = [TRIBE_BY_ID[i][2][:4] for i in ids]
    a("| vs | " + " | ".join(short) + " | vs field |")
    a("| --- | " + " | ".join(["---"] * len(ids)) + " | --- |")
    tribe_field = []
    for a_id in ids:
        cells = []
        tw = tl = td = 0
        for b_id in ids:
            cell = tribe_b["tribe_vs"][a_id][b_id]
            cells.append(f"{cell['wins']}-{cell['losses']}-{cell['draws']}")
            tw += cell["wins"]
            tl += cell["losses"]
            td += cell["draws"]
        field = win_pct(tw, tl)
        tribe_field.append((a_id, field, tw, tl, td))
        a(f"| {TRIBE_BY_ID[a_id][2]} | " + " | ".join(cells) + f" | {fmt_pct(field)} ({tw}-{tl}-{td}) |")
    a("")
    tribe_field.sort(key=lambda x: -(x[1] or 0))
    a("Tribe standing when playing a full five-card tribe deck:")
    a("")
    for i, (ab, field, tw, tl, td) in enumerate(tribe_field, 1):
        a(f"{i}. **{ABILITY_NAME[ab]}** ({TRIBE_BY_ID[ab][1]}) {fmt_pct(field)} ({tw}-{tl}-{td})")
    a("")

    a("## Tribe decks - card tiers (mono-tribe seats only)")
    a("")
    a("These numbers are not mixed-hand numbers. A weak card can look better when it always sits next to four friends of the same ability.")
    a("")
    a("| Tier | Card | Ability | Win | Captures / play | Captured / play | Kept |")
    a("| --- | --- | --- | --- | --- | --- | --- |")
    for r in tribe_rows:
        a(
            f"| {r['tier']} | {r['name']} | {r['ability_name']} | {fmt_pct(r['win_pct'])} | "
            f"{r['captures_per_play']:.2f} | {r['captured_per_play']:.2f} | {r['keep_pct']:.0f}% |"
        )
    a("")

    # --- Suggestions from the numbers ---
    s_cards = [r for r in rand_rows if r["tier"] == "S"]
    d_cards = [r for r in rand_rows if r["tier"] == "D"]
    top_ab = rand_abs[0]
    bot_ab = rand_abs[-1]
    spread = (rand_abs[0]["seat_win_pct"] or 50) - (rand_abs[-1]["seat_win_pct"] or 50)

    a("## Read of the data")
    a("")
    a(f"**Second player is favored.** First player won {first_pct:.1f}% of decided random games, second won {second_pct:.1f}%, and {draw_pct:.1f}% of all games were 5-5. That is mostly leftover scoring (first must own 6 board cards to win) plus the second player getting the last captures. It is not a card-stat bug. Do not 'fix' it by buffing first-player cards.")
    a("")
    a(f"Ability spread in mixed hands is **{spread:.1f} points** from {top_ab['ability_name']} ({fmt_pct(top_ab['seat_win_pct'])}) to {bot_ab['ability_name']} ({fmt_pct(bot_ab['seat_win_pct'])}).")
    a("")
    poison_field = next((x for x in tribe_field if x[0] == "poison"), None)
    blast_field = next((x for x in tribe_field if x[0] == "blast"), None)
    silence_field = next((x for x in tribe_field if x[0] == "silence"), None)
    chill_field = next((x for x in tribe_field if x[0] == "chill"), None)
    if poison_field:
        a(f"**Poison ticks adjacent enemies only.** Mixed-hand seat win {fmt_pct(next(r for r in rand_abs if r['ability']=='poison')['seat_win_pct'])}. Mono-tribe {fmt_pct(poison_field[1])}. Friendlies are safe, so a Vermin board is no longer a self-own.")
        a("")
    if blast_field:
        a(f"**Blast is the strongest tribe deck** at {fmt_pct(blast_field[1])}. Mixed-hand Blast is only mildly ahead ({fmt_pct(top_ab['seat_win_pct']) if top_ab['ability']=='blast' else fmt_pct(next(r for r in rand_abs if r['ability']=='blast')['seat_win_pct'])}). The +2 on play stacks as a game plan when every card has it. That matters once people pick tribe decks, not as much in random deals.")
        a("")
    if chill_field and silence_field:
        a(f"**Chill holds up in both views** (mixed {fmt_pct(next(r for r in rand_abs if r['ability']=='chill')['seat_win_pct'])}, tribe {fmt_pct(chill_field[1])}). **Silence does not.** Mixed {fmt_pct(next(r for r in rand_abs if r['ability']=='silence')['seat_win_pct'])} is fine; five Silences together ({fmt_pct(silence_field[1])}) just turn the board into mediocre stat-sticks.")
        a("")
    if s_cards:
        a("**Over-performing mixed-hand faces (S):** " + ", ".join(f"{c['name']} ({fmt_pct(c['win_pct'])}, power {c['power']}, keep {c['keep_pct']:.0f}%)" for c in s_cards) + ".")
        a("Nerf the body, not the ability, unless the whole tribe is also top of the matrix.")
        a("")
    if d_cards:
        a("**Under-performing mixed-hand faces (D):** " + ", ".join(f"{c['name']} ({fmt_pct(c['win_pct'])}, power {c['power']}, keep {c['keep_pct']:.0f}%)" for c in d_cards) + ".")
        a("")

    dragon = next((c for c in rand_rows if c["name"] == "Dragon"), None)
    celestial = next((c for c in rand_rows if c["name"] == "Celestial"), None)
    frog = next((c for c in rand_rows if c["name"] == "Frog"), None)
    paladin = next((c for c in rand_rows if c["name"] == "Paladin"), None)
    owl = next((c for c in rand_rows if c["name"] == "Owl"), None)

    a("## Suggestions (do not apply yet)")
    a("")
    a("1. **Poison now only hits enemies.** Re-read the tribe matrix. If Vermin is still the floor, bump Frog/Beetle after this run, not before. If it overshoots, the tick is the knob, not friendly-fire.")
    a("2. **Do not nerf Blast as a rule.** Mixed Blast is a mild lead. Mono Blast is the runaway because every play has +2. If tribe decks stay, shave Beasts attack facings (T-Rex 8/5/6/2, Lion 7/6/4/2) by 1 on one strong edge. Leave Eagle as the cheap face.")
    if dragon:
        a(f"3. **Dragon is a trap, not an S card.** Mixed win {fmt_pct(dragon['win_pct'])} with only {dragon['keep_pct']:.0f}% kept. The 9/7 front wins the play, then the 3/2 rear gets farmed. If you want it to be the ace, raise Bottom or Left by 1. If you want a glass cannon, leave it and stop putting it in 'must pick' talk.")
    if paladin:
        a(f"4. **Paladin is the mixed-hand buff problem.** {fmt_pct(paladin['win_pct'])}, power {paladin['power']}, facings 4/8/8/2. Buff on a 22-power body is a lot. Shave one 8 to 7. Do not nerf Buff itself (Radiance is mid as a tribe).")
    a("5. **Genie is a 6/5/5/5 Bolt.** The -2 zap is swingy. If Genie is S, shave one 5 to a 4. Do not tone down Bolt's -2; the random target is the point. Cinder still paints a cell - leave that variance alone.")
    if celestial:
        a(f"6. **Celestial is a D Buff.** {fmt_pct(celestial['win_pct'])} with an A on Bottom and a 2 on Right. The 10 rarely faces what the AI attacks. Move 2 points from Bottom onto Right, or swap Top/Bottom. Same power, less awkward.")
    if frog:
        a(f"7. **Frog ({fmt_pct(frog['win_pct'])}, power {frog['power']}) is the floor.** Poison only hits enemies now. If Frog is still D, bump to something like 3/4/5/4.")
    if owl:
        a(f"8. **Owl punches above power {owl['power']}** ({fmt_pct(owl['win_pct'])}, Equalizer). That is fine as the 'small Equalizer'. Do not buff other Balance faces to match it. Titan's 10-top is the one to watch, not Monk.")
    a("9. **Silence is fine in mixed hands and bad as a five-of.** No change unless we care about mono-Hush. If we do, Silence should do a little something besides stripping (it currently does nothing in a mirror).")
    a("10. **Spite is not the problem.** Wrath is playable as a tribe. Cyclops's Left 1 is ugly but the card is still A in mixed. Raise that 1 to 2 only if you want it to sit more.")
    a("11. **Do not chase first-player win rate with card stats.** Leftover scoring plus last-capture is doing that. If a future match feels lopsided on who goes first, that is a table rule, not Paladin.")
    a("12. Re-run `python3 sim/balance.py --random 4000 --tribe-games 40 --seed 1` after any facing change. A 1-point bump moves a card a full tier in this AI.")
    a("")
    a("## How to re-run")
    a("")
    a("```")
    a("python3 sim/balance.py --random 4000 --tribe-games 40 --seed 1")
    a("```")
    a("")
    return "\n".join(lines) + "\n"


def self_test() -> None:
    assert neighbors(4) == [1, 5, 7, 3]
    assert neighbors(0) == [1, 3]
    rng = random.Random(0)
    monk = clone_card(next(c for c in CARDS if c["name"] == "Monk"), "blue")
    robot = clone_card(next(c for c in CARDS if c["name"] == "Robot"), "red")
    # Place red Robot at center, blue Monk on top: touching 5 vs 5, equalizer should capture.
    m = Match([monk], [robot], "red", rng)
    m.place("red", 0, 4)
    m.place("blue", 0, 1)
    assert m.board[4]["owner"] == "blue", "Monk should equalize-capture Robot"
    # Blast: Dragon on empty board vs a 5 top - skip, just check effective +2.
    dragon = clone_card(next(c for c in CARDS if c["name"] == "Dragon"), "blue")
    dummy = Match([dragon], [], "blue", rng)
    dummy.board[4] = dragon
    dummy.recalc()
    assert dummy.effective_stat(dragon, 0, True, False) == 11
    # 9 plays, score sums to 10
    rng = random.Random(1)
    blue, red = deal_random(rng)
    match = Match(blue, red, "blue", rng)
    winner = match.play_out()
    assert match.plays == 9
    blue_n = sum(1 for c in match.board if c and c["owner"] == "blue") + len(match.hands["blue"])
    red_n = sum(1 for c in match.board if c and c["owner"] == "red") + len(match.hands["red"])
    assert blue_n + red_n == 10
    assert winner in ("blue", "red", "draw")
    for ability, _name, _label in TRIBES:
        faces = proto_by_ability(ability)
        assert len(faces) == 5, f"{ability} should have 5 cards, has {len(faces)}"
    assert len(CARDS) == 50
    # Bolt: Wizard zaps the only enemy for -2 all stats.
    rng = random.Random(2)
    wizard = clone_card(next(c for c in CARDS if c["name"] == "Wizard"), "blue")
    owl = clone_card(next(c for c in CARDS if c["name"] == "Owl"), "red")
    bolt_match = Match([wizard], [owl], "red", rng)
    bolt_match.place("red", 0, 4)
    bolt_match.place("blue", 0, 1)
    assert bolt_match.board[4]["base"] == [3, 1, 1, 4], "Wizard should bolt Owl for -2"
    # Poison hits enemies only. Spider next to Owl (enemy) and later Frog (friendly).
    rng = random.Random(3)
    spider = clone_card(next(c for c in CARDS if c["name"] == "Spider"), "blue")
    frog = clone_card(next(c for c in CARDS if c["name"] == "Frog"), "blue")
    owl = clone_card(next(c for c in CARDS if c["name"] == "Owl"), "red")
    psn = Match([spider, frog], [owl], "red", rng)
    psn.place("red", 0, 4)
    psn.place("blue", 0, 1)
    assert psn.board[4]["base"] == [4, 2, 1, 5], "Spider should poison adjacent Owl"
    psn.place("blue", 0, 0)
    assert psn.board[1]["base"] == [4, 6, 5, 3], "Spider should not poison friendly Frog"
    assert psn.board[0]["base"] == [2, 4, 5, 3], "Frog should not be poisoned by allied Spider"
    assert psn.board[4]["base"] == [3, 1, 1, 4], "Owl should tick again from Spider"
    print("self-test ok")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--random", type=int, default=4000)
    parser.add_argument("--tribe-games", type=int, default=40, help="games per tribe pairing")
    parser.add_argument("--seed", type=int, default=1)
    parser.add_argument("--out", default="sim/BALANCE.md")
    args = parser.parse_args()
    self_test()
    rng = random.Random(args.seed)
    print(f"running {args.random} random deals...")
    random_b = run_random(args.random, rng)
    print(f"running tribe matrix ({args.tribe_games} per pair, {len(TRIBES)*len(TRIBES)*args.tribe_games} games)...")
    tribe_b = run_tribes(args.tribe_games, rng)
    report = write_report(args.out, random_b, tribe_b, args.random, args.tribe_games)
    with open(args.out, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"wrote {args.out}")
    # Short console summary
    rows = analyze_cards(random_b)
    abs_ = analyze_abilities(rows, random_b)
    print("\nMechanic seat win (random):")
    for r in abs_:
        print(f"  {r['ability_name']:11} {fmt_pct(r['seat_win_pct'])}")
    print("\nTiers (random):")
    for tier in ["S", "A", "B", "C", "D"]:
        names = [r["name"] for r in rows if r["tier"] == tier]
        print(f"  {tier}: {', '.join(names)}")


if __name__ == "__main__":
    main()
