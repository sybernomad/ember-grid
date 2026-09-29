/* Board, capture, and abilities. */
let stats = JSON.parse(localStorage.getItem('ember_grid_stats')) || {played: 0, wins: 0, losses: 0, draws: 0, streak: 0, bestStreak: 0, flips: 0, cardPlays: {}};

function saveStats() {localStorage.setItem('ember_grid_stats', JSON.stringify(stats));}

let board = Array(9).fill(null);

let cellEffects = Array(9).fill(null);

let playerHand = [], aiHand = [], playerDeck = [], aiDeck = [];

let draftPool = [], draftedPlayerCards = [], draftedAICards = [];

let selectedCard = null, turn = 'player', gameState = 'menu', activeMode = 'random', draftTurn = 'player';

let aiDifficulty = localStorage.getItem('ember_grid_ai') || 'normal';

if (!['easy', 'normal', 'hard'].includes(aiDifficulty)) aiDifficulty = 'normal';

let showBothHands = localStorage.getItem('ember_grid_open_hands') === 'true';

let leftoverScores = localStorage.getItem('ember_grid_leftover') === 'true';

let leftoverThisMatch = leftoverScores;

let matchCaptures = {blue: 0, red: 0};

let hapticsOn = localStorage.getItem('ember_grid_haptics') === 'true';

let classicTies = localStorage.getItem('ember_grid_classic_ties') === 'true';

let classicTiesThisMatch = false;

let pendingMechFx = [];

const GRID_PRESETS = {
    3: {size: 3, cells: 9, hand: 5, draftPool: 16},
    4: {size: 4, cells: 16, hand: 8, draftPool: 16},
    5: {size: 5, cells: 25, hand: 13, draftPool: 26},
    hex: {size: 'hex', cells: 19, hand: 10, draftPool: 20}
};

function normalizeGridChoice(val) {
    if (val === 'hex' || val === 'H') return 'hex';
    const n = parseInt(val, 10);
    return GRID_PRESETS[n] ? n : 3;
}

function loadPreferredGrid() {
    return normalizeGridChoice(localStorage.getItem('ember_grid_size') || '3');
}

let preferredGridSize = loadPreferredGrid();

let gridSize = 3;

const VISIBLE_HAND = 5;

function isHexGrid() { return gridSize === 'hex'; }

function cellCount() {
    const preset = GRID_PRESETS[gridSize];
    return preset ? preset.cells : 9;
}

function matchHandSize() { return GRID_PRESETS[gridSize].hand; }

function matchDraftPoolSize() { return GRID_PRESETS[gridSize].draftPool; }

const HEX_DIRS = [
    {dq: 0, dr: -1, p: 0, n: 2},
    {dq: 1, dr: -1, p: 4, n: 3},
    {dq: 1, dr: 0, p: 1, n: 5},
    {dq: 0, dr: 1, p: 2, n: 0},
    {dq: -1, dr: 1, p: 3, n: 4},
    {dq: -1, dr: 0, p: 5, n: 1}
];

const HEX = {cells: [], at: new Map(), boxes: [], aspect: 0.9238};

(function buildHexLayout() {
    const cells = [];
    for (let q = -2; q <= 2; q++) {
        for (let r = -2; r <= 2; r++) {
            if (Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r)) <= 2) cells.push({q, r});
        }
    }
    cells.sort((a, b) => a.r - b.r || a.q - b.q);
    const key = (q, r) => `${q},${r}`;
    const at = new Map(cells.map((c, i) => [key(c.q, c.r), i]));
    const size = 1;
    const pts = cells.map(c => ({
        x: size * 1.5 * c.q,
        y: size * (Math.sqrt(3) / 2 * c.q + Math.sqrt(3) * c.r)
    }));
    const fullHw = size;
    const fullHh = Math.sqrt(3) / 2 * size;
    const minX = Math.min(...pts.map(p => p.x)) - fullHw;
    const maxX = Math.max(...pts.map(p => p.x)) + fullHw;
    const minY = Math.min(...pts.map(p => p.y)) - fullHh;
    const maxY = Math.max(...pts.map(p => p.y)) + fullHh;
    const bw = maxX - minX;
    const bh = maxY - minY;
    const scale = 0.9;
    const inset = 0.028;
    const span = 1 - 2 * inset;
    HEX.cells = cells;
    HEX.at = at;
    HEX.key = key;
    HEX.aspect = bw / bh;
    HEX.boxes = pts.map(p => {
        const w = (2 * fullHw * scale) / bw * span;
        const h = (2 * fullHh * scale) / bh * span;
        const left = inset + ((p.x - fullHw * scale) - minX) / bw * span;
        const top = inset + ((p.y - fullHh * scale) - minY) / bh * span;
        return {
            left: `${(left * 100).toFixed(3)}%`,
            top: `${(top * 100).toFixed(3)}%`,
            width: `${(w * 100).toFixed(3)}%`,
            height: `${(h * 100).toFixed(3)}%`
        };
    });
    document.documentElement.style.setProperty('--hex-aspect', HEX.aspect.toFixed(4));
})();

function boardCellEls() {
    const grid = document.getElementById('board-grid');
    return grid ? grid.querySelectorAll(':scope > .cell') : [];
}

function boardCellEl(index) {
    return boardCellEls()[index] || null;
}

function applyGridSize(n) {
    gridSize = GRID_PRESETS[n] ? n : 3;
    const hex = gridSize === 'hex';
    document.body.classList.toggle('grid-4', gridSize === 4 || hex);
    document.body.classList.toggle('grid-5', gridSize === 5);
    document.body.classList.toggle('grid-hex', hex);
}

function snakeSeq2(starter, n) {
    const other = starter === 'player' ? 'ai' : 'player';
    const seq = [starter];
    let who = other;
    let left = n * 2 - 1;
    while (left > 0) {
        const take = Math.min(2, left);
        for (let i = 0; i < take; i++) seq.push(who);
        left -= take;
        who = who === starter ? other : starter;
    }
    return seq;
}

function currentSnakeSeq() {
    return leagueDrafting ? leagueDraftSeq : snakeSeq2(draftStarter, matchHandSize());
}

let currentRuleset = 'ember';

let deckMatchLabel = '';

let lastBlueScore = null, lastRedScore = null;

let lastMatch = null;

let skipCoachOnce = false;

let draftStarter = 'player', draftPickIndex = 0;

let draftTimer = null;

let aiPlayTimer = null;

let blastPreviewTimer = null;

const shownStatValues = new Map();

const pointerDrag = {pointerId: null, index: null, startX: 0, startY: 0, active: false, sourceEl: null, ghost: null, overIdx: null};

let swallowClick = false;

let swallowForIndex = null;

let gameoverClickLock = false;

let gameoverUnlockTimer = null;

let coach = { active: false, step: null, cellIndex: 4, pendingCapture: false, taughtHand: false };

let tutorial = null;

function randomIndex(len) {
    if (len <= 1) return 0;
    if (tutorial && tutorial.roll != null) return Math.abs(tutorial.roll) % len;
    return Math.floor(Math.random() * len);
}

function ownedCount(color) {
    const onBoard = board.filter(c => c && c.owner === color).length;
    if (!leftoverThisMatch) return onBoard;
    const hand = color === 'blue' ? playerHand : aiHand;
    const deck = color === 'blue' ? playerDeck : aiDeck;
    return onBoard + hand.length + deck.length;
}

function resetTable() {
    board = Array(cellCount()).fill(null);
    cellEffects = Array(cellCount()).fill(null);
    matchCaptures = {blue: 0, red: 0};
    selectedCard = null;
    shownStatValues.clear();
    pendingMechFx = [];
    const layer = document.getElementById('board-fx');
    if (layer) layer.innerHTML = '';
    if (blastPreviewTimer) {clearTimeout(blastPreviewTimer); blastPreviewTimer = null;}
}

const neighborTables = new Map();

function neighborDirsAt(index) {
    if (isHexGrid()) {
        const cell = HEX.cells[index];
        if (!cell) return [];
        return HEX_DIRS.map(d => {
            const idx = HEX.at.get(HEX.key(cell.q + d.dq, cell.r + d.dr));
            return {idx: idx == null ? -1 : idx, p: d.p, n: d.n, ok: idx != null};
        });
    }
    const n = gridSize;
    const row = Math.floor(index / n), col = index % n;
    return [
        {idx: index - n, p: 0, n: 2, ok: row > 0},
        {idx: index + 1, p: 1, n: 3, ok: col < n - 1},
        {idx: index + n, p: 2, n: 0, ok: row < n - 1},
        {idx: index - 1, p: 3, n: 1, ok: col > 0}
    ];
}

function neighborDirs(index) {
    let table = neighborTables.get(gridSize);
    if (!table) {
        const count = cellCount();
        table = new Array(count);
        for (let i = 0; i < count; i++) table[i] = neighborDirsAt(i);
        neighborTables.set(gridSize, table);
    }
    if (index >= 0 && index < table.length) return table[index];
    return neighborDirsAt(index);
}

function neighborIndexes(index) {
    return neighborDirs(index).filter(d => d.ok).map(d => d.idx);
}

function facingPairs(index) {
    return neighborDirs(index).filter(d => d.ok).map(d => ({idx: d.idx, mine: d.p, theirs: d.n}));
}

function oppositeFacing(statIndex) {
    if (isHexGrid()) return [2, 5, 0, 4, 3, 1][statIndex];
    return (statIndex + 2) % 4;
}

function swingAxes(row) {
    if (!row || row.length < 4) return row;
    const next = [row[3], row[2], row[1], row[0]];
    if (row.length > 4) next.push(...row.slice(4));
    return next;
}

function isSilenceCard(card) {
    return liveAbilityType(card) === 'silence';
}

function silenceCancelled(index) {
    const card = board[index];
    if (!isSilenceCard(card)) return false;
    return neighborIndexes(index).some(i => {
        const n = board[i];
        return n && n.owner !== card.owner && isSilenceCard(n);
    });
}

function activeSilencerAt(index) {
    return isSilenceCard(board[index]) && !silenceCancelled(index);
}

function wouldBeSilenced(owner, index) {
    return neighborIndexes(index).some(i => {
        const n = board[i];
        return n && n.owner !== owner && activeSilencerAt(i);
    });
}

function isSilenced(index) {
    const card = board[index];
    if (!card) return false;
    if (silenceCancelled(index)) return true;
    return wouldBeSilenced(card.owner, index);
}

function openHandsFromDeal() {
    const split = (cards) => {
        const pile = shuffleCopy(cards || []);
        const n = Math.min(VISIBLE_HAND, pile.length);
        return {hand: pile.slice(0, n), deck: pile.slice(n)};
    };
    const you = split(playerHand);
    const them = split(aiHand);
    playerHand = you.hand;
    playerDeck = you.deck;
    aiHand = them.hand;
    aiDeck = them.deck;
}

function drawAfterPlay(owner) {
    if (board.every(cell => cell !== null)) return;
    const deck = owner === 'blue' ? playerDeck : aiDeck;
    const hand = owner === 'blue' ? playerHand : aiHand;
    if (!deck.length) return;
    const i = Math.floor(Math.random() * deck.length);
    const card = deck.splice(i, 1)[0];
    if (!silentSim && (owner === 'blue' || showBothHands)) card.drawAnimAt = performance.now();
    hand.push(card);
    return card;
}

function ownerCaptureCount(owner) {
    return matchCaptures[owner] || 0;
}

function resetLiveStats(card) {
    if (card) card.stats = [...card.baseStats];
}

function applyCaptureCountBonus(card, silenced) {
    if (!card || liveAbilityType(card) !== 'symbiosis' || silenced) return;
    const bonus = ownerCaptureCount(card.owner);
    if (!bonus) return;
    card.stats = card.stats.map(s => Math.max(1, Math.min(10, s + bonus)));
}

function recalculateDynamicStats() {
    board.forEach(resetLiveStats);
    playerHand.forEach(resetLiveStats);
    aiHand.forEach(resetLiveStats);
    board.forEach((card, index) => {
        if (!card || !card.ability || isSilenced(index)) return;
        if (liveAbilityType(card) === 'aura_buff') {
            const val = liveAbility(card).val || 1;
            neighborIndexes(index).forEach(idx => {
                if (board[idx] && board[idx].owner === card.owner) {
                    board[idx].stats = board[idx].stats.map(s => Math.max(1, Math.min(10, s + val)));
                }
            });
        }
    });
    board.forEach((card, index) => {
        if (!card || !card.ability || isSilenced(index)) return;
        if (liveAbilityType(card) === 'chill') {
            neighborIndexes(index).forEach(idx => {
                if (board[idx] && board[idx].owner !== card.owner) {
                    board[idx].stats = board[idx].stats.map(s => Math.max(1, Math.min(10, s - 1)));
                }
            });
        }
    });
    board.forEach((card, index) => {
        if (!card || cellEffects[index] !== 'cinder') return;
        card.stats = card.stats.map(s => Math.max(1, Math.min(10, s - 1)));
    });
    playerHand.forEach(card => applyCaptureCountBonus(card, false));
    aiHand.forEach(card => applyCaptureCountBonus(card, false));
}

function getEffectiveStat(card, statIndex, isPlacementTurn, silenced) {
    const row = card.stats || card.baseStats || [];
    let val = row[statIndex];
    if (val == null) val = 1;
    const onBoard = board.includes(card);
    if (silenced && liveAbilityType(card) === 'symbiosis' && !onBoard) {
        const base = card.baseStats || row;
        val = base[statIndex] == null ? 1 : base[statIndex];
    }
    if (isPlacementTurn && !silenced && onBoard && liveAbilityType(card) === 'symbiosis') {
        const bonus = ownerCaptureCount(card.owner);
        if (bonus) val = Math.max(1, Math.min(10, val + bonus));
    }
    if (isPlacementTurn && !silenced && liveAbilityType(card) === 'blast') {
        val += 2;
    }
    return val;
}

function applyParasiteCopy(placedCard, index) {
    const enemies = facingPairs(index)
        .map(p => board[p.idx] ? {c: board[p.idx], i: p.idx} : null)
        .filter(x => x && x.c.owner !== placedCard.owner && snapshotAbility(x.c));
    if (!enemies.length) return null;
    enemies.sort((a, b) => b.c.baseStats.reduce((x, y) => x + y, 0) - a.c.baseStats.reduce((x, y) => x + y, 0));
    const pick = enemies[0];
    placedCard.ability.copied = snapshotAbility(pick.c);
    placedCard.fxType = 'parasite';
    queueMechFx('parasite', index, [pick.i]);
    const copiedName = TRIBES.find(t => t.id === placedCard.ability.copied.type);
    return {text: `${logCard(placedCard)} copied ${logCard(pick.c)}'s ${copiedName ? copiedName.ability : 'ability'}`, kind: 'parasite'};
}

function applySiphon(placedCard, index) {
    const stolen = [];
    const hits = [];
    facingPairs(index).forEach(p => {
        const n = board[p.idx];
        if (!n || n.owner === placedCard.owner) return;
        if (n.baseStats[p.theirs] <= 1) return;
        n.baseStats[p.theirs] = Math.max(1, n.baseStats[p.theirs] - 1);
        const opp = oppositeFacing(p.mine);
        placedCard.baseStats[opp] = Math.min(10, placedCard.baseStats[opp] + 1);
        n.fxType = 'siphon';
        stolen.push({name: n.name, owner: n.owner});
        hits.push(p.idx);
    });
    if (!hits.length) return null;
    placedCard.fxType = placedCard.fxType || 'siphon';
    queueMechFx('siphon', index, hits);
    return {text: `${logCard(placedCard)} siphoned ${listLogNames(stolen)}`, kind: 'siphon'};
}

function fireOnPlayKind(placedCard, index, abType) {
    if (abType === 'curse_adj') {
        let enemies = board.map((c, i) => (c && c.owner !== placedCard.owner) ? {c, i} : null).filter(Boolean);
        if (enemies.length > 0) {
            enemies.sort((a, b) => b.c.baseStats.reduce((x, y) => x + y, 0) - a.c.baseStats.reduce((x, y) => x + y, 0));
            let targetCard = enemies[0].c;
            targetCard.baseStats = targetCard.baseStats.map(s => Math.max(1, s - 1));
            targetCard.fxType = 'curse';
            queueMechFx('curse', index, [enemies[0].i]);
            return {text: `${logCard(placedCard)} cursed ${logCard(targetCard)} (-1)`, kind: 'curse'};
        }
    } else if (abType === 'blast') {
        placedCard.fxType = 'blast';
        placedCard.blastPreview = true;
        queueMechFx('blast', index, []);
        return {text: `${logCard(placedCard)} blasted (+2 this turn)`, kind: 'blast'};
    } else if (abType === 'cinder') {
        const fresh = board.map((c, i) => (c === null && cellEffects[i] !== 'cinder') ? i : null).filter(i => i !== null);
        const empties = fresh.length ? fresh : board.map((c, i) => c === null ? i : null).filter(i => i !== null);
        const target = empties.length ? empties[randomIndex(empties.length)] : index;
        cellEffects[target] = 'cinder';
        placedCard.fxType = 'cinder';
        queueMechFx('cinder', index, [target]);
        return {text: `${logCard(placedCard)} cindered a cell`, kind: 'cinder'};
    } else if (abType === 'bolt') {
        const enemies = board.map((c, i) => (c && c.owner !== placedCard.owner) ? {c, i} : null).filter(Boolean);
        if (enemies.length > 0) {
            const pick = enemies[randomIndex(enemies.length)];
            const targetCard = pick.c;
            targetCard.baseStats = targetCard.baseStats.map(s => Math.max(1, s - 2));
            targetCard.fxType = 'bolt';
            placedCard.fxType = placedCard.fxType || 'bolt';
            queueMechFx('bolt', index, [pick.i]);
            return {text: `${logCard(placedCard)} bolted ${logCard(targetCard)} (-2)`, kind: 'bolt'};
        }
    } else if (abType === 'siphon') {
        return applySiphon(placedCard, index);
    }
    return null;
}

function applyOnPlayAbilities(placedCard, index) {
    if (!placedCard.ability || isSilenced(index)) return null;
    const parts = [];
    if (placedCard.ability.type === 'parasite') {
        const copied = applyParasiteCopy(placedCard, index);
        if (copied) parts.push(copied);
    }
    const fired = fireOnPlayKind(placedCard, index, liveAbilityType(placedCard));
    if (fired) parts.push(fired);
    if (!parts.length) return null;
    return {text: parts.map(p => p.text).join(' · '), kind: parts[0].kind};
}

function tagAuraBuffs(placedCard, index) {
    if (!placedCard.ability || liveAbilityType(placedCard) !== 'aura_buff' || isSilenced(index)) return null;
    const names = [];
    const hits = [];
    neighborIndexes(index).forEach(idx => {
        if (board[idx] && board[idx].owner === placedCard.owner) {
            board[idx].fxType = 'buff';
            names.push({name: board[idx].name, owner: board[idx].owner});
            hits.push(idx);
        }
    });
    if (hits.length) queueMechFx('buff', index, hits);
    return names.length ? {text: `${logCard(placedCard)} buffed ${listLogNames(names)} (+1)`, kind: 'buff'} : null;
}

function tagSilence(placedCard, index) {
    if (!isSilenceCard(placedCard)) return null;
    const cancelled = silenceCancelled(index);
    const names = [];
    const hits = [];
    neighborIndexes(index).forEach(idx => {
        const n = board[idx];
        if (!n || n.owner === placedCard.owner || !n.ability) return;
        if (cancelled && !isSilenceCard(n)) return;
        n.fxType = 'silence';
        names.push({name: n.name, owner: n.owner});
        hits.push(idx);
    });
    if (hits.length) queueMechFx('silence', index, hits);
    return names.length ? {text: `${logCard(placedCard)} silenced ${listLogNames(names)}`, kind: 'silence'} : null;
}

function tagChill(placedCard, index) {
    if (!placedCard.ability || liveAbilityType(placedCard) !== 'chill' || isSilenced(index)) return null;
    const names = [];
    const hits = [];
    neighborIndexes(index).forEach(idx => {
        const n = board[idx];
        if (n && n.owner !== placedCard.owner) {
            n.fxType = 'chill';
            names.push({name: n.name, owner: n.owner});
            hits.push(idx);
        }
    });
    if (hits.length) queueMechFx('chill', index, hits);
    return names.length ? {text: `${logCard(placedCard)} chilled ${listLogNames(names)} (-1)`, kind: 'chill'} : null;
}

function applyEndOfTurnEffects() {
    const parts = [];
    board.forEach((card, index) => {
        if (card && liveAbilityType(card) === 'poison' && !isSilenced(index)) {
            const hit = [];
            const hits = [];
            neighborIndexes(index).forEach(idx => {
                const n = board[idx];
                if (!n || n.owner === card.owner) return;
                let reduced = false;
                n.baseStats = n.baseStats.map(s => {
                    if (s > 1) reduced = true;
                    return Math.max(1, s - 1);
                });
                if (reduced) {
                    n.fxType = n.fxType || 'poison';
                    hit.push({name: n.name, owner: n.owner});
                    hits.push(idx);
                }
            });
            if (hits.length) queueMechFx('poison', index, hits);
            if (hit.length) parts.push(`${logCard(card)} poisoned ${listLogNames(hit)} (-1)`);
        }
    });
    return parts.length ? {text: parts.join(' · '), kind: 'poison'} : null;
}

function tickPendulum() {
    if (board.every(c => c)) return null;
    const hits = [];
    board.forEach((card, index) => {
        if (!card || liveAbilityType(card) !== 'pendulum' || isSilenced(index)) return;
        card.baseStats = swingAxes(card.baseStats);
        if (card.stats) card.stats = swingAxes(card.stats);
        card.fxType = 'pendulum';
        hits.push(index);
        queueMechFx('pendulum', index, []);
    });
    return hits.length ? {text: `${hits.length === 1 ? logCard(board[hits[0]]) : 'Pendulum cards'} swung`, kind: 'pendulum'} : null;
}

function applySymbiosis(placedCard, capturedCount) {
    if (!capturedCount) return null;
    const owner = placedCard.owner;
    matchCaptures[owner] = (matchCaptures[owner] || 0) + capturedCount;
    const total = matchCaptures[owner];
    const hand = owner === 'blue' ? playerHand : aiHand;
    const names = [];
    hand.forEach(card => {
        if (!card || liveAbilityType(card) !== 'symbiosis') return;
        names.push({name: card.name, owner: card.owner});
    });
    return names.length ? {text: `${listLogNames(names)} grew in hand (${total} capture${total === 1 ? '' : 's'} this game)`, kind: 'symbiosis'} : null;
}

function poisonSourceIndexes() {
    const out = [];
    board.forEach((card, index) => {
        if (card && liveAbilityType(card) === 'poison' && !isSilenced(index)) out.push(index);
    });
    return out;
}

function resolveTickCaptures(indexes) {
    const sources = [];
    (indexes || []).forEach(index => {
        const card = board[index];
        if (card) sources.push({index, owner: card.owner, card});
    });
    const parts = [];
    sources.forEach(({index, owner, card}) => {
        const now = board[index];
        if (!now || now !== card || now.owner !== owner || isSilenced(index)) return;
        const log = checkCaptures(index, now);
        if (log) parts.push(log);
    });
    return parts.join(' · ');
}

function hasEnemyNeighbor(placedIndex, placedCard) {
    return neighborIndexes(placedIndex).some(idx => board[idx] && board[idx].owner !== placedCard.owner);
}

function queueMechFx(kind, fromIndex, toIndexes) {
    if (silentSim) return;
    pendingMechFx.push({
        kind,
        from: fromIndex,
        to: (toIndexes || []).filter(i => i != null && i >= 0)
    });
}

function applyPlacementCore(index, placedCard) {
    board.forEach(c => { if (c && c !== placedCard) c.blastPreview = false; });
    const enemyNeighbor = hasEnemyNeighbor(index, placedCard);
    const abilityFx = applyOnPlayAbilities(placedCard, index);
    recalculateDynamicStats();
    const buffFx = tagAuraBuffs(placedCard, index);
    const silenceFx = tagSilence(placedCard, index);
    const chillFx = tagChill(placedCard, index);
    const capLog = checkCaptures(index, placedCard);
    recalculateDynamicStats();
    const psnFx = applyEndOfTurnEffects();
    recalculateDynamicStats();
    const psnCapLog = resolveTickCaptures(poisonSourceIndexes());
    recalculateDynamicStats();
    const pendulumFx = tickPendulum();
    recalculateDynamicStats();
    return {enemyNeighbor, abilityFx, buffFx, silenceFx, chillFx, capLog, psnFx, psnCapLog, pendulumFx};
}

function processCardPlacement(index, placedCard) {
    const fx = applyPlacementCore(index, placedCard);
    drawAfterPlay(placedCard.owner);
    if (silentSim) return;

    const fxParts = [fx.abilityFx && fx.abilityFx.text, fx.buffFx && fx.buffFx.text, fx.silenceFx && fx.silenceFx.text, fx.chillFx && fx.chillFx.text, fx.capLog, fx.psnFx && fx.psnFx.text, fx.psnCapLog, fx.pendulumFx && fx.pendulumFx.text].filter(Boolean);
    logAction(fxParts.length ? fxParts.join(' · ') : `${logCard(placedCard)} played.`);

    const placedBy = placedCard.owner === 'blue' ? 'player' : 'ai';
    turn = turn === 'player' ? 'ai' : 'player';
    render();
    flushMechFx();
    hapticForPlay(fx);
    requestAnimationFrame(updateCoach);

    if (placedBy === 'player' && !tutorial) onCoachPlaced(!!(fx.capLog || fx.psnCapLog), fx.enemyNeighbor);

    if (placedCard.blastPreview) {
        if (blastPreviewTimer) clearTimeout(blastPreviewTimer);
        blastPreviewTimer = setTimeout(() => {
            blastPreviewTimer = null;
            if (!placedCard.blastPreview) return;
            placedCard.blastPreview = false;
            if (gameState === 'playing' || gameState === 'gameover') render();
        }, 560);
    }

    if (tutorial) {
        tutorialOnPlaced();
        return;
    }

    if (board.every(cell => cell !== null)) {hideTurnBanner(); endGame(); return;}

    if (!coach.active || coach.step === 'wait') showTurnBanner(turn);

    if (turn === 'ai') scheduleAiTurn(700);
    else {
        statusMsg.textContent = withMatchup("Your turn - play a card from your hand.");
        resumeCoachAfterAi();
    }
}

function facingCaptures(myVal, theirVal, card, silenced) {
    if (myVal > theirVal) return {captures: true, equalized: false};
    if (myVal !== theirVal) return {captures: false, equalized: false};
    if (!silenced && liveAbilityType(card) === 'equalizer') {
        return {captures: true, equalized: true};
    }
    if (classicTiesThisMatch) return {captures: true, equalized: false};
    return {captures: false, equalized: false};
}

function checkCaptures(placedIndex, placedCard) {
    const neighbors = neighborDirs(placedIndex).filter(n => n.ok && board[n.idx]);

    let blueFlipped = false, redFlipped = false;
    const captured = [];
    const spiteHits = [];
    const placedSilenced = isSilenced(placedIndex);

    const flipEnemy = (neighborCard, silencedWhenHit, neighborIdx) => {
        if (neighborCard.owner === placedCard.owner) return;
        const origOwner = neighborCard.owner;
        neighborCard.owner = placedCard.owner;
        neighborCard.justFlipped = true;
        captured.push({name: neighborCard.name, owner: origOwner});
        if (placedCard.owner === 'blue') {blueFlipped = true; if (!silentSim && origOwner === 'red' && activeMode !== 'tutorial') stats.flips++;}
        else redFlipped = true;
        if (liveAbilityType(neighborCard) === 'spite' && !silencedWhenHit) {
            placedCard.baseStats = placedCard.baseStats.map(s => Math.max(1, s - 1));
            placedCard.stats = (placedCard.stats || placedCard.baseStats).map(s => Math.max(1, s - 1));
            placedCard.fxType = 'spite';
            spiteHits.push({name: neighborCard.name, owner: origOwner});
            queueMechFx('spite', neighborIdx, [placedIndex]);
        }
    };

    neighbors.forEach(n => {
        const neighborCard = board[n.idx];
        if (neighborCard.owner === placedCard.owner) return;
        const silencedWhenHit = isSilenced(n.idx);
        const myVal = getEffectiveStat(placedCard, n.p, true, placedSilenced);
        const theirVal = getEffectiveStat(neighborCard, n.n, false, silencedWhenHit);
        const hit = facingCaptures(myVal, theirVal, placedCard, placedSilenced);
        if (hit.captures) {
            flipEnemy(neighborCard, silencedWhenHit, n.idx);
            if (hit.equalized) {
                neighborCard.fxType = neighborCard.fxType || 'equalizer';
                queueMechFx('equalizer', placedIndex, [n.idx]);
            }
        }
    });

    if (!silentSim) {
        if (blueFlipped) sfx.flipBlue(); else if (redFlipped) sfx.flipRed();
    }
    const parts = [];
    if (captured.length) parts.push(`${logCard(placedCard)} captured ${listLogNames(captured)}`);
    if (spiteHits.length) parts.push(`Spite from ${listLogNames(spiteHits)} hit ${logCard(placedCard)} (-1)`);
    const sym = applySymbiosis(placedCard, captured.length);
    if (sym) parts.push(sym.text);
    return parts.join(' · ');
}
