/* Base Set, tribes, and card helpers. */
// --- Card Database ---

function makeAbility(type) {
    const tribe = TRIBES.find(t => t.id === type);
    const ability = {type};
    if (tribe.val != null) ability.val = tribe.val;
    ability.icon = tribe.icon;
    ability.desc = tribe.desc;
    return ability;
}

const TRIBES = [
    {id: 'aura_buff', name: 'Buff', ability: 'Buff', icon: '⚡', desc: 'While this card sits there, adjacent friendly cards get +1 to all stats.', val: 1},
    {id: 'curse_adj', name: 'Curse', ability: 'Curse', icon: '💀', desc: 'On play, the strongest enemy loses 1 from all stats, then this card captures.'},
    {id: 'blast', name: 'Blast', ability: 'Blast', icon: '💥', desc: 'Temporarily grants +2 to all stats on the turn it is played.'},
    {id: 'poison', name: 'Poison', ability: 'Poison', icon: '🦠', desc: 'At the end of every turn, adjacent enemies lose 1 from all stats, then this card can capture.'},
    {id: 'equalizer', name: 'Equalizer', ability: 'Equalizer', icon: '⚖️', desc: 'Captures adjacent cards if the touching stats match exactly.'},
    {id: 'spite', name: 'Spite', ability: 'Spite', icon: '💢', desc: 'When this card is captured, the captor loses 1 from all stats.'},
    {id: 'silence', name: 'Silence', ability: 'Silence', icon: '🔇', desc: 'Adjacent enemies lose their abilities while this card sits there. Capture still works. Next to an enemy Silence, both cancel.'},
    {id: 'cinder', name: 'Cinder', ability: 'Cinder', icon: '🔥', desc: 'On play, a random empty cell becomes Cindered. Whoever sits there is -1 to all stats. The cell glows orange.'},
    {id: 'bolt', name: 'Bolt', ability: 'Bolt', icon: '🔮', desc: 'On play, zaps a random enemy by -2 to all stats before this card captures. The zap can help this play steal that card.'},
    {id: 'chill', name: 'Chill', ability: 'Chill', icon: '❄️', desc: 'While this card sits there, adjacent enemies are -1 to all stats. Counts for captures.'},
    {id: 'parasite', name: 'Parasite', ability: 'Parasite', icon: '🪞', desc: 'On play, copies the ability of an adjacent enemy for the rest of the match. If that ability fires on play, it fires before this card captures.'},
    {id: 'siphon', name: 'Siphon', ability: 'Siphon', icon: '🌀', desc: 'On play, steals 1 from each adjacent enemy\'s touching stat and adds it permanently to this card\'s opposite facing.'},
    {id: 'pendulum', name: 'Pendulum', ability: 'Pendulum', icon: '⏳', desc: 'At the start of every turn, this card swaps its top/bottom stats with its left/right stats.'},
    {id: 'symbiosis', name: 'Symbiosis', ability: 'Symbiosis', icon: '🌱', desc: 'Plus 1 to all stats for each capture this player has made. The bonus shows in your hand and counts on the turn you play the card, then the card goes back to its printed numbers.'}
];

const masterCards = [
    {name: "Celestial", emoji: "✨", baseStats: [10, 2, 3, 4], hexStats: [8, 7], ability: 'aura_buff'},
    {name: "Fairy", emoji: "🧚", baseStats: [3, 4, 3, 6], hexStats: [3, 4], ability: 'aura_buff'},
    {name: "Unicorn", emoji: "🦄", baseStats: [4, 4, 5, 7], hexStats: [4, 3], ability: 'aura_buff'},
    {name: "Paladin", emoji: "🛡️", baseStats: [4, 8, 7, 2], hexStats: [5, 6], ability: 'aura_buff'},
    {name: "Angel", emoji: "👼", baseStats: [4, 5, 4, 6], hexStats: [6, 6], ability: 'aura_buff'},
    {name: "Ghost", emoji: "👻", baseStats: [3, 7, 2, 5], hexStats: [7, 6], ability: 'curse_adj'},
    {name: "Vampire", emoji: "🧛", baseStats: [7, 3, 3, 6], hexStats: [7, 5], ability: 'curse_adj'},
    {name: "Skull", emoji: "💀", baseStats: [8, 2, 4, 3], hexStats: [4, 4], ability: 'curse_adj'},
    {name: "Zombie", emoji: "🧟", baseStats: [4, 2, 6, 4], hexStats: [1, 2], ability: 'curse_adj'},
    {name: "Bat", emoji: "🦇", baseStats: [5, 6, 3, 4], hexStats: [7, 4], ability: 'curse_adj'},
    {name: "Dragon", emoji: "🐲", baseStats: [9, 7, 4, 2], hexStats: [6, 6], ability: 'blast'},
    {name: "T-Rex", emoji: "🦖", baseStats: [8, 5, 6, 2], hexStats: [8, 4], ability: 'blast'},
    {name: "Lion", emoji: "🦁", baseStats: [7, 6, 4, 2], hexStats: [7, 6], ability: 'blast'},
    {name: "Shark", emoji: "🦈", baseStats: [7, 4, 5, 4], hexStats: [7, 5], ability: 'blast'},
    {name: "Eagle", emoji: "🦅", baseStats: [6, 6, 3, 3], hexStats: [3, 3], ability: 'blast'},
    {name: "Spider", emoji: "🕷️", baseStats: [4, 6, 5, 3], hexStats: [7, 3], ability: 'poison'},
    {name: "Scorpion", emoji: "🦂", baseStats: [6, 4, 7, 2], hexStats: [5, 6], ability: 'poison'},
    {name: "Snake", emoji: "🐍", baseStats: [5, 4, 4, 5], hexStats: [6, 5], ability: 'poison'},
    {name: "Frog", emoji: "🐸", baseStats: [2, 4, 5, 3], hexStats: [2, 5], ability: 'poison'},
    {name: "Beetle", emoji: "🪲", baseStats: [4, 5, 5, 3], hexStats: [4, 3], ability: 'poison'},
    {name: "Monk", emoji: "☯️", baseStats: [5, 5, 5, 5], hexStats: [4, 5], ability: 'equalizer'},
    {name: "Titan", emoji: "🗿", baseStats: [10, 3, 4, 2], hexStats: [5, 6], ability: 'equalizer'},
    {name: "Robot", emoji: "🤖", baseStats: [5, 5, 5, 2], hexStats: [7, 6], ability: 'equalizer'},
    {name: "Owl", emoji: "🦉", baseStats: [5, 3, 2, 6], hexStats: [3, 4], ability: 'equalizer'},
    {name: "Alien", emoji: "👽", baseStats: [7, 3, 5, 2], hexStats: [3, 5], ability: 'equalizer'},
    {name: "Cyclops", emoji: "👹", baseStats: [8, 4, 7, 1], hexStats: [7, 7], ability: 'spite'},
    {name: "Gorilla", emoji: "🦍", baseStats: [7, 5, 6, 3], hexStats: [8, 7], ability: 'spite'},
    {name: "Wrath", emoji: "😡", baseStats: [6, 4, 3, 5], hexStats: [4, 6], ability: 'spite'},
    {name: "Vendetta", emoji: "😤", baseStats: [4, 6, 5, 3], hexStats: [3, 2], ability: 'spite'},
    {name: "Oni", emoji: "👺", baseStats: [6, 5, 4, 4], hexStats: [4, 3], ability: 'spite'},
    {name: "Dread", emoji: "😱", baseStats: [3, 6, 5, 4], hexStats: [7, 4], ability: 'silence'},
    {name: "Hush", emoji: "🤫", baseStats: [5, 4, 5, 4], hexStats: [6, 6], ability: 'silence'},
    {name: "Raven", emoji: "🐦‍⬛", baseStats: [4, 6, 4, 5], hexStats: [6, 3], ability: 'silence'},
    {name: "Ninja", emoji: "🥷", baseStats: [5, 6, 3, 5], hexStats: [6, 5], ability: 'silence'},
    {name: "Cat", emoji: "🐱", baseStats: [2, 5, 7, 3], hexStats: [5, 2], ability: 'silence'},
    {name: "Scorch", emoji: "🥵", baseStats: [5, 5, 3, 5], hexStats: [3, 7], ability: 'cinder'},
    {name: "Brand", emoji: "🫠", baseStats: [4, 5, 6, 3], hexStats: [6, 4], ability: 'cinder'},
    {name: "Fox", emoji: "🦊", baseStats: [6, 5, 2, 3], hexStats: [4, 4], ability: 'cinder'},
    {name: "Phoenix", emoji: "🐦‍🔥", baseStats: [5, 4, 6, 4], hexStats: [4, 7], ability: 'cinder'},
    {name: "Lizard", emoji: "🦎", baseStats: [5, 4, 5, 4], hexStats: [4, 5], ability: 'cinder'},
    {name: "Wizard", emoji: "🧙", baseStats: [5, 7, 3, 5], hexStats: [4, 3], ability: 'bolt'},
    {name: "Genie", emoji: "🧞", baseStats: [6, 5, 5, 5], hexStats: [3, 5], ability: 'bolt'},
    {name: "Witch", emoji: "🧙‍♀️", baseStats: [4, 6, 5, 4], hexStats: [6, 5], ability: 'bolt'},
    {name: "Mage", emoji: "🪄", baseStats: [6, 3, 6, 4], hexStats: [7, 4], ability: 'bolt'},
    {name: "Imp", emoji: "👿", baseStats: [3, 6, 4, 5], hexStats: [4, 2], ability: 'bolt'},
    {name: "Frost", emoji: "🥶", baseStats: [4, 5, 4, 6], hexStats: [7, 4], ability: 'chill'},
    {name: "Wolf", emoji: "🐺", baseStats: [6, 5, 4, 3], hexStats: [4, 5], ability: 'chill'},
    {name: "Penguin", emoji: "🐧", baseStats: [3, 4, 6, 5], hexStats: [3, 3], ability: 'chill'},
    {name: "Polar", emoji: "🐻‍❄️", baseStats: [6, 3, 7, 3], hexStats: [4, 7], ability: 'chill'},
    {name: "Seal", emoji: "🦭", baseStats: [3, 5, 5, 5], hexStats: [6, 6], ability: 'chill'},
    {name: "Mimic", emoji: "🪞", baseStats: [3, 2, 4, 10], hexStats: [3, 6], ability: 'parasite'},
    {name: "Leech", emoji: "🩸", baseStats: [5, 6, 3, 5], hexStats: [6, 5], ability: 'parasite'},
    {name: "Cuckoo", emoji: "🐣", baseStats: [4, 7, 3, 5], hexStats: [6, 6], ability: 'parasite'},
    {name: "Doppel", emoji: "👥", baseStats: [5, 5, 5, 4], hexStats: [6, 3], ability: 'parasite'},
    {name: "Remora", emoji: "🐟", baseStats: [3, 6, 4, 6], hexStats: [6, 4], ability: 'parasite'},
    {name: "Kraken", emoji: "🦑", baseStats: [4, 9, 3, 4], hexStats: [8, 6], ability: 'siphon'},
    {name: "Drain", emoji: "💧", baseStats: [6, 4, 5, 4], hexStats: [7, 4], ability: 'siphon'},
    {name: "Lamprey", emoji: "🪱", baseStats: [4, 5, 6, 4], hexStats: [3, 2], ability: 'siphon'},
    {name: "Mosquito", emoji: "🦟", baseStats: [3, 7, 3, 6], hexStats: [4, 7], ability: 'siphon'},
    {name: "Siphon", emoji: "🌀", baseStats: [5, 6, 4, 4], hexStats: [5, 4], ability: 'siphon'},
    {name: "Clock", emoji: "🕰️", baseStats: [8, 2, 8, 2], hexStats: [4, 3], ability: 'pendulum'},
    {name: "Tide", emoji: "🌊", baseStats: [7, 3, 6, 3], hexStats: [7, 7], ability: 'pendulum'},
    {name: "Moon", emoji: "🌙", baseStats: [2, 7, 2, 8], hexStats: [4, 7], ability: 'pendulum'},
    {name: "Hourglass", emoji: "⌛", baseStats: [6, 3, 7, 3], hexStats: [5, 4], ability: 'pendulum'},
    {name: "Gyro", emoji: "🪀", baseStats: [7, 2, 6, 4], hexStats: [7, 4], ability: 'pendulum'},
    {name: "Worldtree", emoji: "🌳", baseStats: [2, 10, 3, 2], hexStats: [4, 4], ability: 'symbiosis'},
    {name: "Mycelium", emoji: "🍄", baseStats: [4, 4, 4, 4], hexStats: [3, 3], ability: 'symbiosis'},
    {name: "Coral", emoji: "🪸", baseStats: [5, 3, 5, 3], hexStats: [6, 6], ability: 'symbiosis'},
    {name: "Lichen", emoji: "🌿", baseStats: [3, 5, 4, 4], hexStats: [2, 2], ability: 'symbiosis'},
    {name: "Ivy", emoji: "🍃", baseStats: [4, 5, 3, 4], hexStats: [4, 2], ability: 'symbiosis'}
].map((card, i) => ({
    ...card,
    id: `BS-${String(i + 1).padStart(2, '0')}`,
    set: 'base',
    number: i + 1,
    ability: makeAbility(card.ability)
}));

function abilityNameOf(card) {
    if (!card || !card.ability) return '';
    const tribe = TRIBES.find(t => t.id === card.ability.type);
    const base = tribe ? tribe.ability : '';
    if (card.ability.copied) {
        const copied = TRIBES.find(t => t.id === card.ability.copied.type);
        const label = copied ? copied.ability : '';
        if (label) return `${base} (${label})`;
    }
    return base;
}
function liveAbility(card) {
    if (!card || !card.ability) return null;
    return card.ability.copied || card.ability;
}
function liveAbilityType(card) {
    const a = liveAbility(card);
    return a ? a.type : null;
}
function snapshotAbility(card) {
    const live = liveAbility(card);
    if (!live || live.type === 'parasite') return null;
    const snap = {type: live.type, icon: live.icon, desc: live.desc};
    if (live.val != null) snap.val = live.val;
    return snap;
}
function abilityTip(card, opts) {
    const silenced = !!(opts && opts.silenced);
    const withId = !!(opts && opts.withId);
    const idBit = withId && card.id ? `${card.id} ` : '';
    if (!card.ability) return `${idBit}${card.name}`;
    const ab = abilityNameOf(card);
    const head = ab ? `${idBit}${card.name} — ${ab}` : `${idBit}${card.name}`;
    const body = card.ability.desc || '';
    const copied = card.ability.copied && TRIBES.find(t => t.id === card.ability.copied.type);
    const copiedBit = copied ? ` Copied ${copied.ability}.` : '';
    return silenced ? `${head}: ${body}${copiedBit} (silenced)` : `${head}: ${body}${copiedBit}`;
}
function nameplateHTML(card, silenced) {
    const ab = abilityNameOf(card);
    if (!ab) return `<div class="card-name">${card.name}</div>`;
    const label = silenced ? 'Silenced' : ab;
    return `<div class="card-name"><span class="card-title">${card.name}</span><span class="card-ability-name${silenced ? ' silenced' : ''}">${label}</span></div>`;
}
function twemojiFile(emoji) {
    const cps = [];
    for (const ch of emoji) cps.push(ch.codePointAt(0).toString(16));
    const id = cps.includes('200d') ? cps.join('-') : cps.filter(c => c !== 'fe0f').join('-');
    return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/${id}.svg`;
}
function paintCardFaces(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('.card-emoji, .deck-mech-glyph').forEach(el => {
        if (el.querySelector('img')) return;
        const emoji = el.textContent;
        if (!emoji) return;
        const img = document.createElement('img');
        img.className = 'twemoji';
        img.draggable = false;
        img.alt = emoji;
        img.src = twemojiFile(emoji);
        img.onerror = () => { el.textContent = emoji; };
        el.textContent = '';
        el.appendChild(img);
    });
}
function cardPower(card) {
    return (card.baseStats || []).reduce((sum, n) => sum + n, 0);
}
const emberCostById = (() => {
    const costs = {};
    TRIBES.forEach(tribe => {
        const list = masterCards.filter(card => card.ability && card.ability.type === tribe.id)
            .slice()
            .sort((a, b) => cardPower(a) - cardPower(b) || a.number - b.number);
        if (!list.length) return;
        // Weakest to strongest: 0, 1, 2, 3, 4. A full tribe is 10 embers, so it fits a 3×3 deck.
        list.forEach((card, rank) => {
            costs[card.id] = rank;
        });
    });
    return costs;
})();
function emberCostOf(cardOrId) {
    const id = typeof cardOrId === 'string' ? cardOrId : (cardOrId && cardOrId.id);
    const cost = emberCostById[id];
    return cost == null ? 0 : cost;
}
function deckSizeFor(gridKey) {
    const key = gridKey === 'hex' ? 'hex' : Number(gridKey);
    const preset = typeof GRID_PRESETS !== 'undefined' ? GRID_PRESETS[key] : null;
    if (preset) return preset.hand;
    if (key === 4) return 8;
    if (key === 5) return 13;
    if (gridKey === 'hex') return 10;
    return 5;
}
function emberBudgetFor(gridKey) {
    return deckSizeFor(gridKey) * 2;
}
const EMBER_DECK_SLOTS = 8;
const EMBER_DECK_KEY = 'ember_grid_built_decks';
function emptyBuiltBook() {
    const grids = {};
    ['3', '4', '5', 'hex'].forEach(key => {
        grids[key] = Array.from({length: EMBER_DECK_SLOTS}, () => null);
    });
    return {grids, active: {3: 0, 4: 0, 5: 0, hex: 0}};
}
function normalizeBuiltSlot(slot) {
    if (!slot || !Array.isArray(slot.ids)) return null;
    const ids = [];
    slot.ids.forEach(id => {
        if (!ids.includes(id) && masterCards.some(card => card.id === id)) ids.push(id);
    });
    const name = String(slot.name || '').trim().slice(0, 24);
    return {name, ids};
}
function loadBuiltDecks() {
    const book = emptyBuiltBook();
    try {
        const raw = JSON.parse(localStorage.getItem(EMBER_DECK_KEY) || 'null');
        if (!raw || !raw.grids) return book;
        ['3', '4', '5', 'hex'].forEach(key => {
            const list = Array.isArray(raw.grids[key]) ? raw.grids[key] : [];
            book.grids[key] = Array.from({length: EMBER_DECK_SLOTS}, (_, i) => normalizeBuiltSlot(list[i]));
            const active = raw.active && raw.active[key];
            book.active[key] = active >= 0 && active < EMBER_DECK_SLOTS ? active : 0;
        });
    } catch (e) {}
    return book;
}
function saveBuiltDecks() {
    localStorage.setItem(EMBER_DECK_KEY, JSON.stringify(builtDecks));
}
let builtDecks = loadBuiltDecks();
function deckEmberSpent(ids) {
    return (ids || []).reduce((sum, id) => sum + emberCostOf(id), 0);
}
function deckIsPlayable(ids, gridKey) {
    const list = ids || [];
    return list.length === deckSizeFor(gridKey) && deckEmberSpent(list) <= emberBudgetFor(gridKey);
}
function weightedPick(items, weights) {
    let total = 0;
    weights.forEach(weight => { total += weight; });
    let roll = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
        roll -= weights[i];
        if (roll <= 0) return items[i];
    }
    return items[items.length - 1];
}
function randomEmberDeck(gridKey) {
    const size = deckSizeFor(gridKey);
    const budget = emberBudgetFor(gridKey);
    const pool = masterCards.slice();
    const ids = [];
    let spent = 0;
    for (let slot = 0; slot < size; slot++) {
        const slotsLeft = size - slot;
        const room = budget - spent;
        const target = room / slotsLeft;
        const legal = pool.filter(card => emberCostOf(card) <= room);
        if (!legal.length) break;
        const weights = legal.map(card => 1 / (1 + Math.abs(emberCostOf(card) - target)));
        const pick = weightedPick(legal, weights);
        ids.push(pick.id);
        spent += emberCostOf(pick);
        pool.splice(pool.indexOf(pick), 1);
    }
    return ids;
}
function hexShouldersOf(card) {
    const master = (card && masterCards.find(c => (card.id && c.id === card.id) || c.name === card.name)) || card;
    const hex = master && master.hexStats;
    if (hex && hex.length >= 2) return [clampStat(hex[0]), clampStat(hex[1])];
    return [1, 1];
}
function facesFor(card, sourceStats) {
    const stats = (sourceStats || (card && card.baseStats) || [1, 1, 1, 1]).slice();
    const square = stats.slice(0, 4).map(clampStat);
    if (!isHexGrid()) return square;
    if (stats.length >= 6) return stats.slice(0, 6).map(clampStat);
    return square.concat(hexShouldersOf(card));
}
function staticShoulderHTML(card) {
    const [ne, nw] = hexShouldersOf(card);
    return `<div class="stat-ne" title="Upper right">${formatStat(ne)}</div><div class="stat-nw" title="Upper left">${formatStat(nw)}</div>`;
}
function draftCardFaceHTML(card) {
    const shoulders = isHexGrid() ? staticShoulderHTML(card) : '';
    return `
        ${card.ability ? `<div class="ability-badge">${card.ability.icon}</div>` : ''}
        <div class="stat-top">${formatStat(card.baseStats[0])}</div>
        <div class="stat-right">${formatStat(card.baseStats[1])}</div>
        <div class="stat-bottom">${formatStat(card.baseStats[2])}</div>
        <div class="stat-left">${formatStat(card.baseStats[3])}</div>
        ${shoulders}
        <div class="card-emoji">${card.emoji}</div>
        ${nameplateHTML(card)}
    `;
}
function formatStat(val) {let clamped = Math.max(1, Math.min(10, val)); return clamped === 10 ? 'A' : clamped;}
function clampStat(val) {return Math.max(1, Math.min(10, val));}
function printedStatsOf(card) {
    if (card && card.printedStats) return card.printedStats;
    const master = card && masterCards.find(c => (card.id && c.id === card.id) || c.name === card.name);
    return (master && master.baseStats) || (card && card.baseStats) || [1, 1, 1, 1];
}
function cloneCard(card, extra, ruleset) {
    const master = masterCards.find(c => c.id === card.id) || card;
    const copy = {
        ...card,
        baseStats: facesFor(master, card.baseStats || master.baseStats),
        printedStats: facesFor(master, card.printedStats || master.baseStats),
        stats: facesFor(master, card.baseStats || master.baseStats).slice(),
        hexStats: hexShouldersOf(master),
        ...extra
    };
    if (card.ability) {
        copy.ability = {...card.ability};
        if (card.ability.copied) copy.ability.copied = {...card.ability.copied};
    }
    const rs = ruleset || cloneRulesetOverride || currentRuleset;
    if (rs === 'classic') delete copy.ability;
    return copy;
}
function cloneForOwner(card, owner, ruleset) {
    return cloneCard(card, {owner}, ruleset);
}
function shuffleCopy(cards) {
    const pile = cards.slice();
    for (let i = pile.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = pile[i];
        pile[i] = pile[j];
        pile[j] = tmp;
    }
    return pile;
}
function cardByName(name) {
    return masterCards.find(c => c.name === name);
}
