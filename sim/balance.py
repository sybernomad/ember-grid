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

# --- Base Set (same order as index.html, ids BS-01 .. BS-70) ---

CARDS = [
    {"name": "Celestial", "base": [10, 2, 3, 4], "ability": "aura_buff"},
    {"name": "Fairy", "base": [3, 4, 3, 6], "ability": "aura_buff"},
    {"name": "Unicorn", "base": [4, 4, 5, 7], "ability": "aura_buff"},
    {"name": "Paladin", "base": [4, 8, 7, 2], "ability": "aura_buff"},
    {"name": "Angel", "base": [4, 5, 4, 6], "ability": "aura_buff"},
    {"name": "Ghost", "base": [3, 7, 2, 5], "ability": "curse_adj"},
    {"name": "Vampire", "base": [7, 3, 3, 6], "ability": "curse_adj"},
    {"name": "Skull", "base": [8, 2, 4, 3], "ability": "curse_adj"},
    {"name": "Zombie", "base": [4, 2, 6, 4], "ability": "curse_adj"},
    {"name": "Bat", "base": [5, 6, 3, 4], "ability": "curse_adj"},
    {"name": "Dragon", "base": [9, 7, 4, 2], "ability": "blast"},
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
    {"name": "Mimic", "base": [3, 2, 4, 10], "ability": "parasite"},
    {"name": "Leech", "base": [5, 6, 3, 5], "ability": "parasite"},
    {"name": "Cuckoo", "base": [4, 7, 3, 5], "ability": "parasite"},
    {"name": "Doppel", "base": [5, 5, 5, 4], "ability": "parasite"},
    {"name": "Remora", "base": [3, 6, 4, 6], "ability": "parasite"},
    {"name": "Kraken", "base": [4, 9, 3, 4], "ability": "siphon"},
    {"name": "Drain", "base": [6, 4, 5, 4], "ability": "siphon"},
    {"name": "Lamprey", "base": [4, 5, 6, 4], "ability": "siphon"},
    {"name": "Mosquito", "base": [3, 7, 3, 6], "ability": "siphon"},
    {"name": "Siphon", "base": [5, 6, 4, 4], "ability": "siphon"},
    {"name": "Pendulum", "base": [8, 2, 8, 2], "ability": "pendulum"},
    {"name": "Tide", "base": [7, 3, 6, 3], "ability": "pendulum"},
    {"name": "Moon", "base": [2, 7, 2, 8], "ability": "pendulum"},
    {"name": "Hourglass", "base": [6, 3, 7, 3], "ability": "pendulum"},
    {"name": "Gyro", "base": [7, 2, 6, 4], "ability": "pendulum"},
    {"name": "Worldtree", "base": [2, 10, 3, 2], "ability": "symbiosis"},
    {"name": "Mycelium", "base": [4, 4, 4, 4], "ability": "symbiosis"},
    {"name": "Coral", "base": [5, 3, 5, 3], "ability": "symbiosis"},
    {"name": "Lichen", "base": [3, 5, 4, 4], "ability": "symbiosis"},
    {"name": "Ivy", "base": [4, 5, 3, 4], "ability": "symbiosis"},
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
    ("parasite", "Host", "Parasite"),
    ("siphon", "Well", "Siphon"),
    ("pendulum", "Tide", "Pendulum"),
    ("symbiosis", "Grove", "Symbiosis"),
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
        "copied": None,
        "base": list(proto["base"]),
        "owner": owner,
        "original": owner,
        "stats": list(proto["base"]),
        "captures_made": 0,
        "times_captured": 0,
        "played": False,
        "played_index": None,
    }


def live_ability(card: dict | None) -> str | None:
    if not card:
        return None
    return card.get("copied") or card.get("ability")


def snapshot_ability(card: dict | None) -> str | None:
    kind = live_ability(card)
    if not kind or kind == "parasite":
        return None
    return kind


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
        self.captures = {"blue": 0, "red": 0}

    def is_silence(self, card: dict | None) -> bool:
        return live_ability(card) == "silence"

    def silence_cancelled(self, index: int) -> bool:
        card = self.board[index]
        if not self.is_silence(card):
            return False
        for i in neighbors(index):
            n = self.board[i]
            if n and n["owner"] != card["owner"] and self.is_silence(n):
                return True
        return False

    def active_silencer_at(self, index: int) -> bool:
        return self.is_silence(self.board[index]) and not self.silence_cancelled(index)

    def would_be_silenced(self, owner: str, index: int) -> bool:
        for i in neighbors(index):
            n = self.board[i]
            if n and n["owner"] != owner and self.active_silencer_at(i):
                return True
        return False

    def is_silenced(self, index: int) -> bool:
        card = self.board[index]
        if not card:
            return False
        if self.silence_cancelled(index):
            return True
        return self.would_be_silenced(card["owner"], index)

    def reset_live_stats(self, card: dict | None) -> None:
        if card:
            card["stats"] = list(card["base"])

    def apply_capture_count_bonus(self, card: dict | None, silenced: bool) -> None:
        if not card or live_ability(card) != "symbiosis" or silenced:
            return
        bonus = self.captures.get(card["owner"], 0)
        if bonus:
            card["stats"] = [max(1, min(10, s + bonus)) for s in card["stats"]]

    def recalc(self) -> None:
        for card in self.board:
            self.reset_live_stats(card)
        for owner in self.hands:
            for card in self.hands[owner]:
                self.reset_live_stats(card)
        for index, card in enumerate(self.board):
            if not card or live_ability(card) != "aura_buff" or self.is_silenced(index):
                continue
            for idx in neighbors(index):
                n = self.board[idx]
                if n and n["owner"] == card["owner"]:
                    n["stats"] = [max(1, min(10, s + 1)) for s in n["stats"]]
        for index, card in enumerate(self.board):
            if not card or live_ability(card) != "chill" or self.is_silenced(index):
                continue
            for idx in neighbors(index):
                n = self.board[idx]
                if n and n["owner"] != card["owner"]:
                    n["stats"] = [max(1, min(10, s - 1)) for s in n["stats"]]
        for index, card in enumerate(self.board):
            if not card or self.cell_effects[index] != "cinder":
                continue
            card["stats"] = [max(1, min(10, s - 1)) for s in card["stats"]]
        for index, card in enumerate(self.board):
            self.apply_capture_count_bonus(card, self.is_silenced(index))
        for owner in self.hands:
            for card in self.hands[owner]:
                self.apply_capture_count_bonus(card, False)

    def effective_stat(self, card: dict, stat_index: int, placement_turn: bool, silenced: bool) -> int:
        val = (card.get("stats") or card["base"])[stat_index]
        if silenced and live_ability(card) == "symbiosis" and card not in self.board:
            val = card["base"][stat_index]
        if placement_turn and not silenced and live_ability(card) == "blast":
            val += 2
        return val

    def apply_on_play(self, placed: dict, index: int) -> None:
        if not placed["ability"] or self.is_silenced(index):
            return
        if placed["ability"] == "parasite":
            enemies = [
                (i, c) for i, c in enumerate(self.board)
                if c and c["owner"] != placed["owner"] and i in neighbors(index) and snapshot_ability(c)
            ]
            if enemies:
                enemies.sort(key=lambda pair: sum(pair[1]["base"]), reverse=True)
                placed["copied"] = snapshot_ability(enemies[0][1])
        kind = live_ability(placed)
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
        elif kind == "siphon":
            for nidx, mine, theirs in facing_pairs(index):
                neighbor = self.board[nidx]
                if not neighbor or neighbor["owner"] == placed["owner"]:
                    continue
                if neighbor["base"][theirs] <= 1:
                    continue
                neighbor["base"][theirs] = max(1, neighbor["base"][theirs] - 1)
                opp = (mine + 2) % 4
                placed["base"][opp] = min(10, placed["base"][opp] + 1)

    def poison(self) -> None:
        # Snapshot who is poisoning so newly reduced cards don't extra-proc.
        sources = [
            i for i, c in enumerate(self.board)
            if c and live_ability(c) == "poison" and not self.is_silenced(i)
        ]
        for index in sources:
            src = self.board[index]
            for idx in neighbors(index):
                n = self.board[idx]
                if n and n["owner"] != src["owner"]:
                    n["base"] = [max(1, s - 1) for s in n["base"]]

    def check_captures(self, placed_index: int, placed: dict, grown: list[int] | None = None) -> int:
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
                and live_ability(placed) == "equalizer"
                and my_val == their_val
            ):
                captures = True
            if not captures:
                continue
            neighbor["owner"] = placed["owner"]
            neighbor["times_captured"] += 1
            placed["captures_made"] += 1
            flipped += 1
            if live_ability(neighbor) == "spite" and not silenced_when_hit:
                placed["base"] = [max(1, s - 1) for s in placed["base"]]
                placed["stats"] = [max(1, s - 1) for s in (placed["stats"] or placed["base"])]
        if flipped:
            self.captures[placed["owner"]] = self.captures.get(placed["owner"], 0) + flipped
            for i, card in enumerate(self.board):
                if not card or card["owner"] != placed["owner"]:
                    continue
                if live_ability(card) != "symbiosis" or self.is_silenced(i):
                    continue
                if grown is not None:
                    grown.append(i)
        return flipped

    def poison_source_indexes(self) -> list[int]:
        return [
            i for i, c in enumerate(self.board)
            if c and live_ability(c) == "poison" and not self.is_silenced(i)
        ]

    def resolve_tick_captures(self, indexes: list[int], grown: list[int] | None = None) -> int:
        sources = []
        for index in indexes:
            card = self.board[index]
            if card:
                sources.append((index, card["owner"], card))
        flipped = 0
        for index, owner, card in sources:
            now = self.board[index]
            if not now or now is not card or now["owner"] != owner or self.is_silenced(index):
                continue
            flipped += self.check_captures(index, now, grown)
        return flipped

    def place(self, owner: str, hand_index: int, cell: int) -> None:
        card = self.hands[owner].pop(hand_index)
        card["stats"] = list(card["base"])
        card["played"] = True
        card["played_index"] = cell
        self.board[cell] = card
        self.apply_on_play(card, cell)
        self.recalc()
        grown: list[int] = []
        self.check_captures(cell, card, grown)
        self.recalc()
        self.poison()
        self.recalc()
        self.resolve_tick_captures(self.poison_source_indexes(), grown)
        self.recalc()
        grove_wave = list(dict.fromkeys(grown))
        self.resolve_tick_captures(grove_wave)
        self.recalc()
        self.plays += 1
        if self.plays < 9:
            self.tick_pendulum()
            self.recalc()
        self.turn = "red" if owner == "blue" else "blue"

    def tick_pendulum(self) -> None:
        for index, card in enumerate(self.board):
            if not card or live_ability(card) != "pendulum" or self.is_silenced(index):
                continue
            t, r, b, l = card["base"]
            card["base"] = [l, b, r, t]

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
                hush_cancels = live_ability(card) == "silence" and any(
                    self.board[i] and self.board[i]["owner"] == opp and live_ability(self.board[i]) == "silence"
                    for i in neighbors(cell)
                )
                for nidx, mine, theirs in facing_pairs(cell):
                    neighbor = self.board[nidx]
                    if neighbor:
                        my_val = self.effective_stat(card, mine, True, silenced_here)
                        their_val = self.effective_stat(
                            neighbor, theirs, False, self.is_silenced(nidx)
                        )
                        if live_ability(neighbor) == "poison" and not self.is_silenced(nidx):
                            exposure += 2
                        if live_ability(card) == "poison" and not silenced_here:
                            if neighbor["owner"] == opp:
                                score += 3
                        if (
                            live_ability(card) == "silence"
                            and neighbor["owner"] == opp
                            and neighbor["ability"]
                            and (not hush_cancels or live_ability(neighbor) == "silence")
                        ):
                            score += 4
                        if live_ability(card) == "chill" and neighbor["owner"] == opp:
                            score += 3
                        if live_ability(neighbor) == "spite" and neighbor["owner"] == opp:
                            exposure += 2
                        if live_ability(card) == "parasite" and neighbor["owner"] == opp and snapshot_ability(neighbor) and not silenced_here:
                            score += 5
                        if live_ability(card) == "siphon" and neighbor["owner"] == opp and not silenced_here:
                            score += 4
                        if neighbor["owner"] == opp:
                            captures = my_val > their_val
                            if (
                                not captures
                                and not silenced_here
                                and live_ability(card) == "equalizer"
                                and my_val == their_val
                            ):
                                captures = True
                            if (
                                not captures
                                and live_ability(card) == "poison"
                                and not silenced_here
                                and my_val > max(1, their_val - 1)
                            ):
                                captures = True
                            if captures:
                                flips += 1
                    elif neighbor is None:
                        pass
                score += flips * 14 + sum(card["base"]) * 0.1 + 3 - exposure * 2.5
                if self.cell_effects[cell] == "cinder":
                    score -= 5
                if silenced_here and live_ability(card) != "silence":
                    score -= 3
                if live_ability(card) == "bolt" and not silenced_here:
                    if any(c and c["owner"] == opp for c in self.board):
                        score += 3
                if live_ability(card) == "symbiosis" and not silenced_here:
                    score += 2 + self.captures.get(owner, 0) * 3
                if flips and (
                    live_ability(card) == "symbiosis"
                    or any(c and c["owner"] == owner and live_ability(c) == "symbiosis" for c in self.board)
                ):
                    score += flips * 2
                if score > max_score:
                    max_score = score
                    best = (card_index, cell)
        if best is None:
            return 0, empty[0]
        return best

    def board_counts(self) -> tuple[int, int]:
        blue = sum(1 for c in self.board if c and c["owner"] == "blue")
        red = sum(1 for c in self.board if c and c["owner"] == "red")
        return blue, red

    def leftover_counts(self) -> tuple[int, int]:
        return len(self.hands["blue"]), len(self.hands["red"])

    def score_pair(self, leftover: bool) -> tuple[int, int]:
        blue, red = self.board_counts()
        if leftover:
            hb, hr = self.leftover_counts()
            blue += hb
            red += hr
        return blue, red

    def winner_of(self, leftover: bool) -> str:
        blue, red = self.score_pair(leftover)
        if blue > red:
            return "blue"
        if red > blue:
            return "red"
        return "draw"

    def play_out(self) -> str:
        while self.plays < 9:
            owner = self.turn
            if not self.hands[owner]:
                break
            hand_i, cell = self.pick_move(owner)
            self.place(owner, hand_i, cell)
        return self.winner_of(leftover=False)

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
        "board_wins": 0,
        "board_losses": 0,
        "board_draws": 0,
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

    leftover_on = match.winner_of(leftover=True)
    bucket["board_wins"][leftover_on] += 1
    if first == leftover_on:
        bucket["board_first_wins"] += 1
    elif leftover_on != "draw":
        bucket["board_second_wins"] += 1
    if leftover_on == "draw":
        bucket["board_draws"] += 1
    first_owned = sum(1 for c in match.board if c and c["owner"] == first)
    bucket["board_owned_by_first"][first_owned] += 1
    bucket["crosstab"][(leftover_on, winner)] += 1
    second = "red" if first == "blue" else "blue"
    bucket["leftover_hands"][(len(match.hands[first]), len(match.hands[second]))] += 1

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
        if leftover_on == "draw":
            st["board_draws"] += 1
        elif leftover_on == card["original"]:
            st["board_wins"] += 1
        else:
            st["board_losses"] += 1


def new_bucket() -> dict:
    return {
        "games": 0,
        "wins": defaultdict(int),
        "draws": 0,
        "first_wins": 0,
        "second_wins": 0,
        "cards": defaultdict(empty_card_stats),
        "ability_seat": defaultdict(lambda: {"wins": 0, "losses": 0, "draws": 0, "games": 0}),
        "ability_seat_board": defaultdict(lambda: {"wins": 0, "losses": 0, "draws": 0, "games": 0}),
        "tribe_vs": defaultdict(lambda: defaultdict(lambda: {"wins": 0, "losses": 0, "draws": 0})),
        "board_wins": defaultdict(int),
        "board_first_wins": 0,
        "board_second_wins": 0,
        "board_draws": 0,
        "board_owned_by_first": defaultdict(int),
        "crosstab": defaultdict(int),
        "leftover_hands": defaultdict(int),
    }


def deal_random(rng: random.Random) -> tuple[list[dict], list[dict]]:
    dealt = rng.sample(CARDS, 10)
    blue = [clone_card(c, "blue") for c in dealt[:5]]
    red = [clone_card(c, "red") for c in dealt[5:]]
    return blue, red


def deal_tribe(ability: str, owner: str) -> list[dict]:
    return [clone_card(c, owner) for c in proto_by_ability(ability)]


def record_ability_seats(bucket: dict, match: Match, leftover_winner: str, board_winner: str) -> None:
    for owner in ("blue", "red"):
        abilities = {c["ability"] for c in match.all_cards() if c["original"] == owner}
        for ab in abilities:
            seat = bucket["ability_seat"][ab]
            seat["games"] += 1
            if leftover_winner == "draw":
                seat["draws"] += 1
            elif leftover_winner == owner:
                seat["wins"] += 1
            else:
                seat["losses"] += 1
            board_seat = bucket["ability_seat_board"][ab]
            board_seat["games"] += 1
            if board_winner == "draw":
                board_seat["draws"] += 1
            elif board_winner == owner:
                board_seat["wins"] += 1
            else:
                board_seat["losses"] += 1


def run_random(n: int, rng: random.Random) -> dict:
    bucket = new_bucket()
    for _ in range(n):
        blue, red = deal_random(rng)
        first = "blue" if rng.random() < 0.5 else "red"
        match = Match(blue, red, first, rng)
        winner = match.play_out()
        record_game(bucket, match, winner, first)
        record_ability_seats(bucket, match, winner, match.winner_of(leftover=True))
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


def analyze_cards(bucket: dict, scoring: str = "leftover") -> list[dict]:
    win_k, loss_k, draw_k = {
        "leftover": ("wins", "losses", "draws"),
        "board": ("board_wins", "board_losses", "board_draws"),
    }[scoring]
    rows = []
    for name, st in bucket["cards"].items():
        wp = win_pct(st[win_k], st[loss_k])
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
            "wins": st[win_k],
            "losses": st[loss_k],
            "draws": st[draw_k],
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


def analyze_abilities(rows: list[dict], bucket: dict, seat_key: str = "ability_seat") -> list[dict]:
    by = defaultdict(list)
    for r in rows:
        by[r["ability"]].append(r)
    out = []
    for ab, group in by.items():
        rates = [r["win_pct"] for r in group if r["win_pct"] is not None]
        seat = bucket[seat_key][ab]
        seat_wp = win_pct(seat["wins"], seat["losses"])
        out.append({
            "ability": ab,
            "ability_name": ABILITY_NAME[ab],
            "tribe": TRIBE_BY_ID[ab][1],
            "card_win_avg": statistics.mean(rates) if rates else None,
            "seat_games": seat["games"],
            "seat_win_pct": seat_wp,
            "seat_draw_pct": 100.0 * seat["draws"] / seat["games"] if seat["games"] else 0.0,
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
    leftover_rows = analyze_cards(random_b, "board")
    leftover_abs = analyze_abilities(leftover_rows, random_b, "ability_seat_board")
    mean = statistics.mean(r["win_pct"] for r in rand_rows)
    first_games = random_b["first_wins"] + random_b["second_wins"]
    first_pct = 100.0 * random_b["first_wins"] / first_games if first_games else 0
    second_pct = 100.0 * random_b["second_wins"] / first_games if first_games else 0
    draw_pct = 100.0 * random_b["wins"]["draw"] / random_b["games"] if random_b["games"] else 0
    n_games = random_b["games"] or 1
    first_all = 100.0 * random_b["first_wins"] / n_games
    second_all = 100.0 * random_b["second_wins"] / n_games
    board_decided = random_b["board_first_wins"] + random_b["board_second_wins"]
    board_first_pct = 100.0 * random_b["board_first_wins"] / board_decided if board_decided else 0
    board_second_pct = 100.0 * random_b["board_second_wins"] / board_decided if board_decided else 0
    board_draw_pct = 100.0 * random_b["board_draws"] / n_games
    board_first_all = 100.0 * random_b["board_first_wins"] / n_games
    board_second_all = 100.0 * random_b["board_second_wins"] / n_games
    lines = []
    a = lines.append

    a("# Ember Grid balance sim")
    a("")
    a(f"Both seats use the live **Normal** AI heuristic. Ember abilities are on. This run is the current {len(CARDS)}-card Base Set ({len(TRIBES)} tribes).")
    a("")
    a("## Method")
    a("")
    a(f"- **Random deals:** {n_random} games. Shuffle the {len(CARDS)}, deal 5 and 5. Who goes first is a coin flip.")
    a(f"- **Tribe decks:** every tribe vs every tribe, {n_pair} games each ({len(TRIBES)*len(TRIBES)*n_pair} games). Even games blue goes first, odd games red goes first.")
    a("- First player places 5 cards, second places 4. **Live default: leftover-off.** Only board ownership scores. Options can turn leftover scores on.")
    a("- Leftover-off on a filled 3x3 almost never draws (9 cards). First's 5 of 9 wins. Leftover-on (the option) still turns those 5-4 boards into 5-5 draws.")
    a("- **Leftover-on is the Options table rule**, recorded on the same games. AI play does not change.")
    a("- Card win rate is: when this card was in a seat's opening hand, how often that seat won (draws dropped).")
    a("- Capture stats only count flips during a match, including recaptures.")
    a("- The AI is the same greedy scorer as the browser game. It is not perfect play.")
    a("")
    a("## Random deals - headline (live leftover-off)")
    a("")
    a(f"- Results: blue {random_b['wins']['blue']}, red {random_b['wins']['red']}, draw {random_b['wins']['draw']} ({draw_pct:.1f}% draws)")
    a(f"- First player win rate (excluding draws): {first_pct:.1f}%")
    a(f"- Second player win rate (excluding draws): {second_pct:.1f}%")
    a(f"- Of all games: first {first_all:.1f}%, second {second_all:.1f}%, draw {draw_pct:.1f}%")
    a(f"- Mean card win rate: {mean:.1f}%")
    a("")
    a("## Options: leftover scores (same games)")
    a("")
    a("When leftover scores is on, unplayed cards count. First leftover 0, second leftover 1, so leftover-on draws are exactly first-owns-5 boards.")
    a("")
    a(f"- Leftover-on results: blue {random_b['board_wins']['blue']}, red {random_b['board_wins']['red']}, draw {random_b['board_wins']['draw']} ({board_draw_pct:.1f}% draws)")
    a(f"- First player win rate (excluding leftover-on draws): {board_first_pct:.1f}%")
    a(f"- Second player win rate (excluding leftover-on draws): {board_second_pct:.1f}%")
    a(f"- Of all games: first {board_first_all:.1f}%, second {board_second_all:.1f}%, draw {board_draw_pct:.1f}%")
    a("")
    hands = ", ".join(
        f"first leftover {k[0]} / second leftover {k[1]}: {v}"
        for k, v in sorted(random_b["leftover_hands"].items())
    )
    a(f"- Leftover hand sizes this run: {hands or 'n/a'}.")
    a("")
    a("On this 5-and-4 placement, leftover-on first score is board-first, leftover-on second score is board-second + 1. So leftover-on draws are exactly the 5-4 boards (first owns 5). Leftover-off gives those games to first. Leftover-on second wins (first owns 0-4) stay second wins.")
    a("")
    a("| Leftover-on seat | Leftover-off seat | Games | Share |")
    a("| --- | --- | --- | --- |")
    a(f"| first | first | {random_b['board_first_wins']} | {100.0 * random_b['board_first_wins'] / n_games:.1f}% |")
    a(f"| second | second | {random_b['board_second_wins']} | {100.0 * random_b['board_second_wins'] / n_games:.1f}% |")
    a(f"| draw | first | {random_b['board_draws']} | {board_draw_pct:.1f}% |")
    a("")
    a("| First-player board cards | Games | Leftover-on result | Leftover-off result |")
    a("| --- | --- | --- | --- |")
    for owned in range(10):
        n = random_b["board_owned_by_first"].get(owned, 0)
        if not n:
            continue
        if owned >= 6:
            on_res, off_res = "first wins", "first wins"
        elif owned == 5:
            on_res, off_res = "draw", "first wins"
        else:
            on_res, off_res = "second wins", "second wins"
        a(f"| {owned} of 9 | {n} ({100.0 * n / n_games:.1f}%) | {on_res} | {off_res} |")
    a("")
    a("Ability seat win leftover-off vs leftover-on (draws dropped):")
    a("")
    a("| Rank | Ability | Tribe | Leftover-off (live) | Leftover-on (option) | Delta |")
    a("| --- | --- | --- | --- | --- | --- |")
    on_by = {r["ability"]: r for r in leftover_abs}
    for i, r in enumerate(rand_abs, 1):
        on = on_by.get(r["ability"])
        on_wp = on["seat_win_pct"] if on else None
        off_wp = r["seat_win_pct"]
        delta = ""
        if on_wp is not None and off_wp is not None:
            delta = f"{off_wp - on_wp:+.1f}"
        a(
            f"| {i} | {r['ability_name']} | {r['tribe']} | {fmt_pct(off_wp)} | "
            f"{fmt_pct(on_wp)} | {delta} |"
        )
    a("")
    on_by_name = {r["name"]: r for r in leftover_rows}
    movers = []
    for r in rand_rows:
        on = on_by_name.get(r["name"])
        if on and on["win_pct"] is not None and r["win_pct"] is not None:
            movers.append((r["win_pct"] - on["win_pct"], on, r))
    movers.sort(key=lambda x: -abs(x[0]))
    a("Card win-rate movers leftover-on (option) → leftover-off (live):")
    a("")
    a("| Card | Ability | Leftover-on | Leftover-off | Delta | On tier | Off tier |")
    a("| --- | --- | --- | --- | --- | --- | --- |")
    for delta, on, off in movers[:12]:
        a(
            f"| {on['name']} | {on['ability_name']} | {fmt_pct(on['win_pct'])} | "
            f"{fmt_pct(off['win_pct'])} | {delta:+.1f} | {on['tier']} | {off['tier']} |"
        )
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
    a(f"**Live leftover-off is close to even.** First player won {first_pct:.1f}% of decided leftover-off games, second won {second_pct:.1f}%, and {draw_pct:.1f}% of all games were draws. Of every random deal, that is first {first_all:.1f}% / second {second_all:.1f}% / draw {draw_pct:.1f}%. Second is only slightly ahead because they still take the last capture.")
    a("")
    a(f"**Leftover-on (the Options rule) is the old 70%.** Same games: first {board_first_all:.1f}% / second {board_second_all:.1f}% / draw {board_draw_pct:.1f}% of all games ({board_first_pct:.1f}% / {board_second_pct:.1f}% of leftover-on decided). Leftover-on draws are first-owns-5 boards; leftover-off gives those to first. It does not invert the 70%.")
    a("")
    a(f"Ability spread in mixed hands is **{spread:.1f} points** from {top_ab['ability_name']} ({fmt_pct(top_ab['seat_win_pct'])}) to {bot_ab['ability_name']} ({fmt_pct(bot_ab['seat_win_pct'])}).")
    a("")
    poison_field = next((x for x in tribe_field if x[0] == "poison"), None)
    blast_field = next((x for x in tribe_field if x[0] == "blast"), None)
    silence_field = next((x for x in tribe_field if x[0] == "silence"), None)
    chill_field = next((x for x in tribe_field if x[0] == "chill"), None)
    pendulum_field = next((x for x in tribe_field if x[0] == "pendulum"), None)
    symbiosis_field = next((x for x in tribe_field if x[0] == "symbiosis"), None)
    parasite_field = next((x for x in tribe_field if x[0] == "parasite"), None)
    siphon_field = next((x for x in tribe_field if x[0] == "siphon"), None)
    top_tribe = tribe_field[0] if tribe_field else None
    if top_tribe:
        mixed_of_top = next((r for r in rand_abs if r["ability"] == top_tribe[0]), None)
        mixed_bit = f" Mixed-hand {ABILITY_NAME.get(top_tribe[0], top_tribe[0])} is {fmt_pct(mixed_of_top['seat_win_pct'])}." if mixed_of_top else ""
        a(f"**{ABILITY_NAME[top_tribe[0]]} is the strongest tribe deck** at {fmt_pct(top_tribe[1])}.{mixed_bit}")
        a("")
    if pendulum_field:
        pend_mixed = next(r for r in rand_abs if r["ability"] == "pendulum")
        a(f"**Pendulum covers both axes.** Mixed {fmt_pct(pend_mixed['seat_win_pct'])}, mono-tribe {fmt_pct(pendulum_field[1])}. A five-of Tide board always has a swung 8 or 7 on the live axis, which is why the tribe matrix runs away.")
        a("")
    if parasite_field and siphon_field:
        para_mixed = next(r for r in rand_abs if r["ability"] == "parasite")
        siph_mixed = next(r for r in rand_abs if r["ability"] == "siphon")
        a(f"**Parasite and Siphon land near even** in mixed hands ({fmt_pct(para_mixed['seat_win_pct'])} / {fmt_pct(siph_mixed['seat_win_pct'])}). Tribe decks {fmt_pct(parasite_field[1])} / {fmt_pct(siphon_field[1])}. Copy and steal need an adjacent enemy, so they do not snowball as a five-of the way Pendulum does.")
        a("")
    if symbiosis_field:
        sym_mixed = next(r for r in rand_abs if r["ability"] == "symbiosis")
        a(f"**Symbiosis is +1 per capture this game.** Mixed {fmt_pct(sym_mixed['seat_win_pct'])} (mean power {sym_mixed['power']:.1f}), mono-Grove {fmt_pct(symbiosis_field[1])}. A late Grove card still sits at the player's capture count, including in hand. One capture pass after it grows.")
        a("")
    if poison_field:
        psn_mixed = next(r for r in rand_abs if r["ability"] == "poison")
        a(f"**Poison ticks adjacent enemies, then those cards can capture.** Mixed-hand seat win {fmt_pct(psn_mixed['seat_win_pct'])}. Mono-tribe {fmt_pct(poison_field[1])}. Friendlies are safe. One capture pass after the tick, no second wave.")
        a("")
    if blast_field:
        blast_mixed = next(r for r in rand_abs if r["ability"] == "blast")
        a(f"**Blast is mid as a tribe** at {fmt_pct(blast_field[1])}. Mixed-hand Blast is {fmt_pct(blast_mixed['seat_win_pct'])}. The +2 on play still stacks as a game plan, just not the matrix leader anymore.")
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
    moon = next((c for c in rand_rows if c["name"] == "Moon"), None)
    lichen = next((c for c in rand_rows if c["name"] == "Lichen"), None)
    ivy = next((c for c in rand_rows if c["name"] == "Ivy"), None)
    kraken = next((c for c in rand_rows if c["name"] == "Kraken"), None)
    worldtree = next((c for c in rand_rows if c["name"] == "Worldtree"), None)
    mimic = next((c for c in rand_rows if c["name"] == "Mimic"), None)

    a("## Suggestions (do not apply yet)")
    a("")
    a("1. **Do not nerf Pendulum as a rule.** Mixed Tide is a lead, not a broken on-play. The tribe-deck runaway is five cards that all swing axes. If Tribe Decks stay a first-class mode, shave the extreme axis faces (Moon's Left 8, Pendulum's 8/2/8/2) rather than the swap.")
    if moon:
        a(f"2. **Moon** mixed {fmt_pct(moon['win_pct'])}, keep {moon['keep_pct']:.0f}%, power {moon['power']}. Printed 2/7/2/8 becomes 8/2/7/2 after one swing. Shave Left 8→7 so the live top after the first swing is 7. That is the one Tide face to touch.")
    if lichen and ivy:
        a(f"3. **Grove is capture-count, not sit-and-wait.** Lichen {fmt_pct(lichen['win_pct'])} / Ivy {fmt_pct(ivy['win_pct'])}. Re-read mixed-hand and the tribe matrix. If Grove overshoots Chill, take back the capture pass before adding body power.")
    if mimic:
        a(f"4. **Mimic** mixed {fmt_pct(mimic['win_pct'])}, A-left (3/2/4/A), keep {mimic['keep_pct']:.0f}%. Left was the empty axis, so the 19-power copy card jumped. If it stays S, move the A to Right (3/A/4/2) so it shares Paladin 8 / Kraken 9 instead of sitting alone.")
    if worldtree:
        a(f"5. **Worldtree** mixed {fmt_pct(worldtree['win_pct'])}, A-right (2/A/3/2). The 2-top is the farm window. Do not add power. If Grove stays the floor, swap so Worldtree is the A-left instead of Mimic.")
    if kraken:
        a(f"6. **Kraken** mixed {fmt_pct(kraken['win_pct'])}, keep {kraken['keep_pct']:.0f}%, power {kraken['power']}. The 9-right plays like Dragon's 9/7: farmed after the sit. Leave Siphon's steal. If it stays C, move 1 off Right onto Left (4/8/3/5) rather than adding power.")
    a("7. **Leave Parasite and Siphon rules alone.** Mixed Parasite is a mild lead because Mimic is S, not because copy is broken. Drain is the Well face that is actually good; that is fine.")
    a("8. **Poison now ticks enemies, then captures once.** Re-read mixed-hand and the tribe matrix. If Vermin overshoots Chill, the capture pass is the first thing to take back, not Frog's body. If it is still the floor, bump Frog/Beetle after Grove bodies.")
    a("9. **Do not nerf Blast as a rule.** Mixed Blast is a mild lead. Mono Blast is no longer the matrix leader.")
    if dragon:
        a(f"10. **Dragon** mixed {fmt_pct(dragon['win_pct'])}, keep {dragon['keep_pct']:.0f}%, power {dragon['power']}. Rear 3→4 this pass did not lift keep - still farmed after the 9/7 play. Leave Left at 2 unless we want another bump.")
    if paladin:
        a(f"11. **Paladin** mixed {fmt_pct(paladin['win_pct'])}, power {paladin['power']}. Shaving one 8 to 7 (4/8/7/2) took it off S. Stop here. Do not nerf Buff itself.")
    a("12. **Genie is a 6/5/5/5 Bolt.** The -2 zap is swingy. If Genie is S, shave one 5 to a 4. Do not tone down Bolt's -2.")
    if celestial:
        a(f"13. **Celestial** mixed {fmt_pct(celestial['win_pct'])}. A moved Top this pass (A/2/3/4). Leave the 2 on Right unless it falls back to C.")
    if frog:
        a(f"14. **Frog ({fmt_pct(frog['win_pct'])}, power {frog['power']}) is still a floor face.** Poison only hits enemies now. If Frog is still D after a Grove bump, try 3/4/5/4.")
    if owl:
        a(f"15. **Owl punches above power {owl['power']}** ({fmt_pct(owl['win_pct'])}, Equalizer). That is fine as the 'small Equalizer'. Do not buff other Balance faces to match it.")
    a("16. **Silence is fine in mixed hands and bad as a five-of.** Same class as Grove/Vermin as a tribe deck. No change unless we care about mono-Hush doing something besides the cancel.")
    a("17. **Do not chase first-player win rate with card stats.** Last-capture is the leftover-off remainder.")
    a(f"18. **Leftover-off is the live default.** Seat math is first {first_all:.1f}% / second {second_all:.1f}% / draw {draw_pct:.1f}%. Leftover-on (Options) is first {board_first_all:.1f}% / second {board_second_all:.1f}% / draw {board_draw_pct:.1f}%. Keep leftover scores off unless you want 5-5 draws back.")
    a("19. Re-run `python3 sim/balance.py --random 4000 --tribe-games 40 --seed 1` after any facing change. A 1-point bump moves a card a full tier in this AI.")
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
    assert winner == match.winner_of(leftover=False)
    board_blue, board_red = match.board_counts()
    assert board_blue + board_red == 9
    hand_blue, hand_red = match.leftover_counts()
    assert hand_blue + hand_red == 1
    board_winner = match.winner_of(leftover=False)
    if winner == "draw":
        assert sorted([board_blue, board_red]) == [4, 5]
        assert board_winner != "draw"
    # Constructed leftover-off: first (blue) owns 5, leftover red in hand. Leftover-on draw, leftover-off blue.
    fake = Match([], [], "blue", random.Random(9))
    for i in range(5):
        fake.board[i] = clone_card(CARDS[i], "blue")
        fake.board[i]["played"] = True
    for i in range(5, 9):
        fake.board[i] = clone_card(CARDS[i], "red")
        fake.board[i]["played"] = True
    fake.hands["red"] = [clone_card(CARDS[9], "red")]
    fake.hands["blue"] = []
    fake.plays = 9
    assert fake.winner_of(leftover=True) == "draw"
    assert fake.winner_of(leftover=False) == "blue"
    fake.board[4]["owner"] = "red"
    assert fake.winner_of(leftover=True) == "red"
    assert fake.winner_of(leftover=False) == "red"
    for ability, _name, _label in TRIBES:
        faces = proto_by_ability(ability)
        assert len(faces) == 5, f"{ability} should have 5 cards, has {len(faces)}"
    assert len(CARDS) == 70
    # Bolt: Wizard zaps the only enemy for -2 all stats.
    rng = random.Random(2)
    wizard = clone_card(next(c for c in CARDS if c["name"] == "Wizard"), "blue")
    owl = clone_card(next(c for c in CARDS if c["name"] == "Owl"), "red")
    bolt_match = Match([wizard], [owl], "red", rng)
    bolt_match.place("red", 0, 4)
    bolt_match.place("blue", 0, 1)
    assert bolt_match.board[4]["base"] == [3, 1, 1, 4], "Wizard should bolt Owl for -2"
    # Poison hits enemies only, then can capture with the lowered stats.
    rng = random.Random(3)
    spider = clone_card(next(c for c in CARDS if c["name"] == "Spider"), "blue")
    frog = clone_card(next(c for c in CARDS if c["name"] == "Frog"), "blue")
    titan = clone_card(next(c for c in CARDS if c["name"] == "Titan"), "red")
    psn = Match([spider, frog], [titan], "red", rng)
    psn.place("red", 0, 4)
    psn.place("blue", 0, 1)
    assert psn.board[4]["owner"] == "red", "Spider should not capture Titan after one poison (5 vs 9)"
    assert psn.board[4]["base"] == [9, 2, 3, 1], "Spider should poison adjacent Titan"
    psn.place("blue", 0, 0)
    assert psn.board[1]["base"] == [4, 6, 5, 3], "Spider should not poison friendly Frog"
    assert psn.board[0]["base"] == [2, 4, 5, 3], "Frog should not be poisoned by allied Spider"
    assert psn.board[4]["base"] == [8, 1, 2, 1], "Titan should tick again from Spider"
    # Spider vs Owl: tie on play, poison then capture.
    rng = random.Random(3)
    spider = clone_card(next(c for c in CARDS if c["name"] == "Spider"), "blue")
    owl = clone_card(next(c for c in CARDS if c["name"] == "Owl"), "red")
    psn_cap = Match([spider], [owl], "red", rng)
    psn_cap.place("red", 0, 4)
    psn_cap.place("blue", 0, 1)
    assert psn_cap.board[4]["owner"] == "blue", "Spider should capture Owl after poisoning the tie"
    assert psn_cap.board[4]["base"] == [4, 2, 1, 5], "Owl should be poisoned before the capture"
    # Hush vs Hush cancel. A cancelled Hush must not silence other adjacent cards.
    hush_m = Match([], [], "blue", random.Random(4))
    hush_m.board[4] = clone_card(next(c for c in CARDS if c["name"] == "Hush"), "blue")
    hush_m.board[5] = clone_card(next(c for c in CARDS if c["name"] == "Hush"), "red")
    hush_m.board[1] = clone_card(next(c for c in CARDS if c["name"] == "Wolf"), "red")
    hush_m.recalc()
    assert hush_m.is_silenced(4), "Blue Hush next to Red Hush should be cancelled"
    assert hush_m.is_silenced(5), "Red Hush next to Blue Hush should be cancelled"
    assert not hush_m.is_silenced(1), "Wolf next to a cancelled Hush should keep Chill"
    assert hush_m.board[4]["stats"] == [4, 3, 4, 3], "Wolf should still chill the cancelled Blue Hush"
    # A lone Hush still silences a non-Hush.
    solo = Match([], [], "blue", random.Random(5))
    solo.board[4] = clone_card(next(c for c in CARDS if c["name"] == "Hush"), "blue")
    solo.board[1] = clone_card(next(c for c in CARDS if c["name"] == "Wolf"), "red")
    solo.recalc()
    assert solo.is_silenced(1), "Hush should still silence adjacent Chill"
    assert solo.board[4]["stats"] == [5, 4, 5, 4], "Silenced Wolf should not chill Hush"
    # Siphon: Drain at top steals Owl's top into Drain's opposite (top).
    rng = random.Random(6)
    drain = clone_card(next(c for c in CARDS if c["name"] == "Drain"), "blue")
    owl = clone_card(next(c for c in CARDS if c["name"] == "Owl"), "red")
    sip = Match([drain], [owl], "red", rng)
    sip.place("red", 0, 4)
    sip.place("blue", 0, 1)
    assert sip.board[4]["base"][0] == 4, "Siphon should steal Owl's touching top"
    assert sip.board[1]["base"][0] == 7, "Siphon should add the stolen point to the opposite facing"
    # Pendulum swaps axes at the start of the next turn.
    rng = random.Random(7)
    pend = clone_card(next(c for c in CARDS if c["name"] == "Pendulum"), "blue")
    filler = clone_card(next(c for c in CARDS if c["name"] == "Frog"), "red")
    pm = Match([pend], [filler], "blue", rng)
    pm.place("blue", 0, 4)
    assert pm.board[4]["base"] == [2, 8, 2, 8], "Pendulum should swing before the next turn"
    gyro = clone_card(next(c for c in CARDS if c["name"] == "Gyro"), "blue")
    gy = Match([gyro], [clone_card(next(c for c in CARDS if c["name"] == "Frog"), "red")], "blue", random.Random(7))
    gy.place("blue", 0, 4)
    assert gy.board[4]["base"] == [4, 6, 2, 7], "Gyro should swing 7/2/6/4 onto 4/6/2/7"
    # Parasite copies Bolt and the zap fires before capture.
    rng = random.Random(8)
    wizard = clone_card(next(c for c in CARDS if c["name"] == "Wizard"), "red")
    mimic = clone_card(next(c for c in CARDS if c["name"] == "Mimic"), "blue")
    par = Match([mimic], [wizard], "red", rng)
    par.place("red", 0, 4)
    par.place("blue", 0, 1)
    assert par.board[1]["copied"] == "bolt", "Mimic should copy adjacent Bolt"
    assert par.board[4]["base"] == [3, 5, 1, 3], "Copied Bolt should zap Wizard before capture"
    # Symbiosis is +1 all stats per capture this player has made this game.
    rng = random.Random(9)
    tree = clone_card(next(c for c in CARDS if c["name"] == "Worldtree"), "blue")
    monk = clone_card(next(c for c in CARDS if c["name"] == "Monk"), "blue")
    robot = clone_card(next(c for c in CARDS if c["name"] == "Robot"), "red")
    gro = Match([tree, monk], [robot], "red", rng)
    gro.place("red", 0, 4)
    gro.place("blue", 0, 0)
    gro.place("blue", 0, 1)
    assert gro.board[4]["owner"] == "blue", "Monk should equalize-capture Robot"
    assert gro.board[0]["base"] == [2, 10, 3, 2], "Worldtree printed face should not change"
    assert gro.board[0]["stats"] == [3, 10, 4, 3], "Worldtree should sit at +1 from the friendly capture"
    # A Grove card played after captures already have the bonus.
    tree2 = clone_card(next(c for c in CARDS if c["name"] == "Worldtree"), "blue")
    monk2 = clone_card(next(c for c in CARDS if c["name"] == "Monk"), "blue")
    robot2 = clone_card(next(c for c in CARDS if c["name"] == "Robot"), "red")
    late = Match([monk2, tree2], [robot2], "red", random.Random(9))
    late.place("red", 0, 4)
    late.place("blue", 0, 1)
    assert late.board[4]["owner"] == "blue", "Monk should capture first"
    assert late.captures["blue"] == 1
    held = late.hands["blue"][0]
    assert held["name"] == "Worldtree", "Worldtree should still be in hand"
    assert held["base"] == [2, 10, 3, 2], "Worldtree in hand keeps its printed face"
    assert held["stats"] == [3, 10, 4, 3], "Worldtree in hand should already show +1"
    late.place("blue", 0, 0)
    assert late.board[0]["base"] == [2, 10, 3, 2], "Late Worldtree printed face stays 2/A/3/2"
    assert late.board[0]["stats"] == [3, 10, 4, 3], "Late Worldtree should already be +1"
    # Grown Grove can capture a neighbor it was tying with. One extra pass only.
    coral = clone_card(next(c for c in CARDS if c["name"] == "Coral"), "blue")
    monk = clone_card(next(c for c in CARDS if c["name"] == "Monk"), "blue")
    owl = clone_card(next(c for c in CARDS if c["name"] == "Owl"), "red")
    robot = clone_card(next(c for c in CARDS if c["name"] == "Robot"), "red")
    gro_cap = Match([coral, monk], [owl, robot], "red", random.Random(9))
    gro_cap.place("red", 0, 4)
    gro_cap.place("blue", 0, 1)
    assert gro_cap.board[4]["owner"] == "red", "Coral should not capture the Owl tie on play"
    gro_cap.place("red", 0, 5)
    gro_cap.place("blue", 0, 2)
    assert gro_cap.board[5]["owner"] == "blue", "Monk should equalize-capture Robot"
    assert gro_cap.board[4]["owner"] == "blue", "Grown Coral should capture Owl after +1"
    assert gro_cap.board[1]["base"] == [5, 3, 5, 3], "Coral printed face should not change"
    assert gro_cap.board[1]["stats"] == [7, 5, 7, 5], "Coral should sit at +2 after Monk and its own capture"
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
