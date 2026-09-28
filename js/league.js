/* Ember League: draft, season, and the silent matches between rivals. */
const LEAGUE_KEY = 'ember_grid_league';

const LEAGUE_CROWNS_KEY = 'ember_grid_league_crowns';

const LEAGUE_RIVALS = [
    {id: 'ash', name: 'Ash', icon: '🕯️', style: 'Kindling. Blast, Buff, Cinder.'},
    {id: 'vesper', name: 'Vesper', icon: '🌙', style: 'Quiet edges. Chill, Silence, Poison.'},
    {id: 'rook', name: 'Rook', icon: '♟️', style: 'Takes the strongest card.'}
];

const LEAGUE_HAND_SIZE = 5;

let league = loadLeague();

let leagueCrowns = loadLeagueCrowns();

let leagueMatch = null;

let leagueDrafting = false;

let leagueHandsLive = {you: [], ash: [], vesper: [], rook: []};

let leagueDraftSeq = [];

let silentSim = false;

let cloneRulesetOverride = null;

let leagueHubConfirm = null;

let leagueRosterSeat = null;

function snakeSeq4(order) {
    const seq = [];
    for (let round = 0; round < LEAGUE_HAND_SIZE; round++) {
        const row = round % 2 === 0 ? order : order.slice().reverse();
        seq.push(...row);
    }
    return seq;
}

function youSeat() {
    return {id: 'you', name: 'You', icon: '⚔️', style: 'The human at the table.'};
}

function loadLeagueCrowns() {
    try {
        const raw = JSON.parse(localStorage.getItem(LEAGUE_CROWNS_KEY) || 'null');
        if (raw && typeof raw === 'object') {
            return {
                played: Number(raw.played) || 0,
                won: Number(raw.won) || 0,
                lastPlace: raw.lastPlace || null,
                lastChampion: raw.lastChampion || null
            };
        }
    } catch (e) {}
    return {played: 0, won: 0, lastPlace: null, lastChampion: null};
}

function saveLeagueCrowns() {
    localStorage.setItem(LEAGUE_CROWNS_KEY, JSON.stringify(leagueCrowns));
}

function isLeagueSeat(id) {
    return id === 'you' || LEAGUE_RIVALS.some(r => r.id === id);
}

function leagueAiDifficulty() {
    return aiDifficulty === 'easy' || aiDifficulty === 'hard' ? aiDifficulty : 'normal';
}

function makeLeaguePairings() {
    const first = [];
    const arr = ['you', 'ash', 'vesper', 'rook'];
    for (let week = 1; week <= 3; week++) {
        first.push({week, home: arr[0], away: arr[3]});
        first.push({week, home: arr[1], away: arr[2]});
        const last = arr[3];
        for (let i = 3; i > 1; i--) arr[i] = arr[i - 1];
        arr[1] = last;
    }
    return first;
}

function emptyLeagueFixture(week, home, away, seriesFirst) {
    return {week, home, away, seriesFirst, games: [], result: null};
}

function makeLeagueFixtures() {
    const first = makeLeaguePairings();
    const fixtures = first.map(p => emptyLeagueFixture(p.week, p.home, p.away, p.home));
    first.forEach(p => fixtures.push(emptyLeagueFixture(p.week + 3, p.home, p.away, p.away)));
    return fixtures;
}

function sanitizeLeagueGame(g, fallbackFirst) {
    if (!g || typeof g !== 'object') return null;
    return {
        homeScore: Number(g.homeScore) || 0,
        awayScore: Number(g.awayScore) || 0,
        winner: g.winner === 'draw' || isLeagueSeat(g.winner) ? g.winner : 'draw',
        first: isLeagueSeat(g.first) ? g.first : fallbackFirst
    };
}

function seriesGameWins(fx) {
    const games = (fx && fx.games) || [];
    let home = 0, away = 0, draws = 0, homePf = 0, awayPf = 0;
    games.forEach(g => {
        homePf += Number(g.homeScore) || 0;
        awayPf += Number(g.awayScore) || 0;
        if (g.winner === fx.home) home++;
        else if (g.winner === fx.away) away++;
        else draws++;
    });
    return {home, away, draws, played: games.length, homePf, awayPf};
}

function seriesComplete(fx) {
    if (!fx) return false;
    if (fx.result) return true;
    const s = seriesGameWins(fx);
    return s.home >= 2 || s.away >= 2 || s.played >= 3;
}

function seriesNextFirst(fx) {
    const n = ((fx && fx.games) || []).length;
    const seriesFirst = (fx && isLeagueSeat(fx.seriesFirst)) ? fx.seriesFirst : (fx ? fx.home : 'you');
    const other = fx && seriesFirst === fx.home ? fx.away : (fx ? fx.home : 'you');
    return n === 1 ? other : seriesFirst;
}

function finalizeSeries(fx) {
    const s = seriesGameWins(fx);
    let winner = 'draw';
    if (s.home > s.away) winner = fx.home;
    else if (s.away > s.home) winner = fx.away;
    else if (s.homePf > s.awayPf) winner = fx.home;
    else if (s.awayPf > s.homePf) winner = fx.away;
    fx.result = {
        homeScore: s.homePf,
        awayScore: s.awayPf,
        homeGames: s.home,
        awayGames: s.away,
        winner
    };
    return fx;
}

function normalizeLeagueFixture(rawFx, fallback) {
    const home = rawFx && isLeagueSeat(rawFx.home) ? rawFx.home : fallback.home;
    const away = rawFx && isLeagueSeat(rawFx.away) ? rawFx.away : fallback.away;
    const seriesFirst = rawFx && isLeagueSeat(rawFx.seriesFirst)
        ? rawFx.seriesFirst
        : (rawFx && isLeagueSeat(rawFx.first) ? rawFx.first : fallback.seriesFirst);
    const games = [];
    const legacySingle = !!(rawFx && rawFx.result && typeof rawFx.result === 'object' && (!Array.isArray(rawFx.games) || !rawFx.games.length));
    if (rawFx && Array.isArray(rawFx.games) && rawFx.games.length) {
        rawFx.games.forEach(g => {
            const sg = sanitizeLeagueGame(g, seriesFirst);
            if (sg) games.push(sg);
        });
    } else if (legacySingle) {
        games.push({
            homeScore: Number(rawFx.result.homeScore) || 0,
            awayScore: Number(rawFx.result.awayScore) || 0,
            winner: rawFx.result.winner === 'draw' || isLeagueSeat(rawFx.result.winner) ? rawFx.result.winner : 'draw',
            first: seriesFirst
        });
    }
    const fx = {week: fallback.week, home, away, seriesFirst, games, result: null};
    if (legacySingle || seriesComplete(fx)) finalizeSeries(fx);
    return fx;
}

function migrateLeagueFixtures(rawFx) {
    const template = makeLeagueFixtures();
    if (!Array.isArray(rawFx) || !rawFx.length) return template;
    if (rawFx.length === 12) {
        return template.map((t, i) => normalizeLeagueFixture(rawFx[i], t));
    }
    return template.map(t => {
        if (t.week > 3) return t;
        const old = rawFx.find(fx => fx && fx.week === t.week && fx.home === t.home && fx.away === t.away)
            || rawFx.find(fx => fx && fx.week === t.week && ((fx.home === t.home && fx.away === t.away) || (fx.home === t.away && fx.away === t.home)));
        return normalizeLeagueFixture(old, t);
    });
}

function sanitizeLeague(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (!['draft', 'season', 'complete'].includes(raw.phase)) return null;
    if (!Array.isArray(raw.players) || raw.players.length !== 4) return null;
    const ids = raw.players.map(p => p && p.id);
    if (ids[0] !== 'you' || !ids.every(isLeagueSeat) || new Set(ids).size !== 4) return null;
    if (!raw.hands || typeof raw.hands !== 'object') return null;
    const hands = {};
    for (const id of ids) {
        const list = Array.isArray(raw.hands[id]) ? raw.hands[id].filter(x => typeof x === 'string') : [];
        hands[id] = list;
    }
    if (raw.phase !== 'draft') {
        if (ids.some(id => hands[id].length !== LEAGUE_HAND_SIZE)) return null;
    }
    if (!Array.isArray(raw.draftOrder) || raw.draftOrder.length !== 4) return null;
    if (!raw.draftOrder.every(isLeagueSeat)) return null;
    const pool = Array.isArray(raw.pool) ? raw.pool.filter(c => c && c.id && (c.draftedBy === null || isLeagueSeat(c.draftedBy))) : [];
    if (raw.phase === 'draft' && pool.length !== LEAGUE_HAND_SIZE * 4) return null;
    let fixtures = raw.phase === 'draft' ? [] : migrateLeagueFixtures(Array.isArray(raw.fixtures) ? raw.fixtures : []);
    if (raw.phase !== 'draft' && fixtures.length !== 12) return null;
    if (raw.phase === 'season') {
        const userWeeks = new Set(
            fixtures.filter(fx => seriesComplete(fx) && (fx.home === 'you' || fx.away === 'you')).map(fx => fx.week)
        );
        fixtures.forEach(fx => {
            if (fx.home === 'you' || fx.away === 'you') return;
            if ((fx.result || (fx.games && fx.games.length)) && !userWeeks.has(fx.week)) {
                fx.games = [];
                fx.result = null;
            }
        });
    }
    return {
        version: 2,
        phase: raw.phase,
        createdAt: raw.createdAt || Date.now(),
        ruleset: raw.ruleset === 'classic' ? 'classic' : 'ember',
        leftover: !!raw.leftover,
        classicTies: raw.ruleset === 'classic' && !!raw.classicTies,
        players: [youSeat(), ...LEAGUE_RIVALS],
        draftOrder: raw.draftOrder.slice(),
        draftPickIndex: Math.max(0, Number(raw.draftPickIndex) || 0),
        pool,
        hands,
        fixtures,
        recap: typeof raw.recap === 'string' ? raw.recap : '',
        champion: isLeagueSeat(raw.champion) ? raw.champion : null
    };
}

function loadLeague() {
    try {
        return sanitizeLeague(JSON.parse(localStorage.getItem(LEAGUE_KEY) || 'null'));
    } catch (e) {}
    return null;
}

function saveLeague() {
    if (!league) {
        localStorage.removeItem(LEAGUE_KEY);
        return;
    }
    localStorage.setItem(LEAGUE_KEY, JSON.stringify(league));
}

function clearLeague() {
    league = null;
    leagueMatch = null;
    leagueDrafting = false;
    leagueHubConfirm = null;
    cloneRulesetOverride = null;
    closeLeagueRoster();
    saveLeague();
}

function leaguePlayer(id) {
    if (!league) return id === 'you' ? youSeat() : LEAGUE_RIVALS.find(r => r.id === id) || youSeat();
    return league.players.find(p => p.id === id) || youSeat();
}

function leagueLabel(id) {
    const p = leaguePlayer(id);
    return `${p.icon} ${p.name}`;
}

function leagueTakeLine(id, object) {
    if (id === 'you') return `You take the ${object}`;
    return `${leaguePlayer(id).name} takes the ${object}`;
}

function leagueSeatCards(seatId) {
    if (leagueDrafting) return (leagueHandsLive[seatId] || []).slice();
    if (!league || !league.hands) return [];
    const ids = league.hands[seatId] || [];
    return ids.map(id => {
        const master = masterCards.find(c => c.id === id);
        return master ? cloneCard(master, {}, league.ruleset) : null;
    }).filter(Boolean);
}

function fillLeagueRoster(seatId) {
    const grid = document.getElementById('league-roster-grid');
    const empty = document.getElementById('league-roster-empty');
    const title = document.getElementById('league-roster-title');
    if (!grid || !empty || !title) return;
    const p = leaguePlayer(seatId);
    const cards = leagueSeatCards(seatId);
    title.textContent = `${p.icon} ${p.name}`;
    grid.innerHTML = '';
    cards.forEach(card => {
        const el = document.createElement('div');
        el.className = 'draft-card';
        el.innerHTML = draftCardFaceHTML(card);
        addTooltipListeners(el, abilityTip(card));
        paintCardFaces(el);
        grid.appendChild(el);
    });
    empty.hidden = cards.length > 0;
    grid.hidden = cards.length === 0;
}

function openLeagueRoster(seatId) {
    if (!isLeagueSeat(seatId)) return;
    sfx.click(); hideTooltip();
    if (leagueRosterSeat === seatId && !document.getElementById('league-roster').classList.contains('hidden')) {
        closeLeagueRoster();
        return;
    }
    leagueRosterSeat = seatId;
    fillLeagueRoster(seatId);
    document.getElementById('league-roster').classList.remove('hidden');
    if (leagueDrafting) renderLeagueDraftSeats();
    else if (league) {
        document.querySelectorAll('.league-rival-chip').forEach(el => {
            el.classList.toggle('is-open', el.getAttribute('data-seat') === seatId);
        });
    }
}

function closeLeagueRoster() {
    const el = document.getElementById('league-roster');
    if (el) el.classList.add('hidden');
    leagueRosterSeat = null;
    hideTooltip();
    if (leagueDrafting) renderLeagueDraftSeats();
    document.querySelectorAll('.league-rival-chip.is-open').forEach(chip => chip.classList.remove('is-open'));
}

function isLeagueActive() {
    return !!(league && league.phase !== 'complete');
}

function isLeagueMatch() {
    return activeMode === 'league' && !!leagueMatch;
}

function createLeague() {
    const order = shuffleCopy(['you', 'ash', 'vesper', 'rook']);
    return {
        version: 2,
        phase: 'draft',
        createdAt: Date.now(),
        ruleset: currentRuleset === 'classic' ? 'classic' : 'ember',
        leftover: !!leftoverScores,
        classicTies: currentRuleset === 'classic' && !!classicTies,
        players: [youSeat(), ...LEAGUE_RIVALS],
        draftOrder: order,
        draftPickIndex: 0,
        pool: shuffleCopy(masterCards).slice(0, LEAGUE_HAND_SIZE * 4).map(c => ({id: c.id, draftedBy: null})),
        hands: {you: [], ash: [], vesper: [], rook: []},
        fixtures: [],
        recap: '',
        champion: null
    };
}

function refreshLeagueMenuButton() {
    const btn = document.getElementById('league-menu-btn');
    if (!btn) return;
    if (!league) btn.textContent = 'League';
    else if (league.phase === 'complete') btn.textContent = 'League Crown';
    else if (league.phase === 'draft') btn.textContent = 'Continue Draft';
    else btn.textContent = 'Continue League';
}

function openLeague() {
    sfx.click(); hideTooltip();
    hideModal('main-menu-modal');
    document.body.classList.add('menu-open');
    if (!league) {
        startNewLeague(true);
        return;
    }
    if (league.phase === 'draft') {
        resumeLeagueDraft();
        return;
    }
    resolvePendingAutoMatches();
    showLeagueHub();
}

function startNewLeague(fromMenu) {
    applyGridSize(3);
    hideModal('league-modal');
    leagueHubConfirm = null;
    league = createLeague();
    saveLeague();
    startLeagueDraft();
}

function requestNewLeague() {
    sfx.click();
    if (league && league.phase !== 'complete') {
        leagueHubConfirm = 'new';
        renderLeagueHub();
        return;
    }
    startNewLeague(true);
}

function confirmLeagueAction(action) {
    sfx.click();
    if (action === 'end') {
        clearLeague();
        showModeMenu();
        return;
    }
    if (action === 'new') {
        leagueHubConfirm = null;
        startNewLeague(true);
    }
}

function cancelLeagueConfirm() {
    sfx.click();
    leagueHubConfirm = null;
    renderLeagueHub();
}

function requestEndLeague() {
    sfx.click();
    leagueHubConfirm = 'end';
    renderLeagueHub();
}

function leaveLeagueToMenu() {
    sfx.click(); hideTooltip();
    closeLeagueRoster();
    if (league && league.phase === 'draft') persistLeagueDraft();
    saveLeague();
    hideModal('league-modal');
    showModeMenu();
}

function persistLeagueDraft() {
    if (!league || league.phase !== 'draft') return;
    league.draftPickIndex = draftPickIndex;
    league.pool = draftPool.map(c => ({id: c.id, draftedBy: c.draftedBy || null}));
    league.hands = {
        you: leagueHandsLive.you.map(c => c.id),
        ash: leagueHandsLive.ash.map(c => c.id),
        vesper: leagueHandsLive.vesper.map(c => c.id),
        rook: leagueHandsLive.rook.map(c => c.id)
    };
    saveLeague();
}

function hydrateLeagueDraft() {
    leagueHandsLive = {you: [], ash: [], vesper: [], rook: []};
    draftPool = (league.pool || []).map(entry => {
        const master = masterCards.find(c => c.id === entry.id);
        if (!master) return null;
        const card = cloneCard(master, {draftedBy: entry.draftedBy || null}, league.ruleset);
        if (entry.draftedBy && leagueHandsLive[entry.draftedBy]) leagueHandsLive[entry.draftedBy].push(card);
        return card;
    }).filter(Boolean);
    draftPickIndex = Math.min(league.draftPickIndex || 0, LEAGUE_HAND_SIZE * 4 - 1);
    leagueDraftSeq = snakeSeq4(league.draftOrder);
    draftTurn = leagueDraftSeq[draftPickIndex];
    leagueDrafting = true;
}

function startLeagueDraft() {
    hideTooltip();
    applyGridSize(3);
    hideModals(['main-menu-modal', 'league-modal', 'deck-modal', 'gameover-modal', 'battle-log-modal', 'changelog-modal']);
    document.body.classList.add('menu-open');
    hydrateLeagueDraft();
    const draftedOut = ['you', 'ash', 'vesper', 'rook'].every(id => (leagueHandsLive[id] || []).length >= LEAGUE_HAND_SIZE);
    if (draftedOut) {
        finishLeagueDraft();
        return;
    }
    setupDraftChrome(true);
    renderDraftPool();
    document.getElementById('draft-modal').classList.remove('hidden');
    if (draftTurn && draftTurn !== 'you') scheduleAiDraftPick(520);
}

function resumeLeagueDraft() {
    startLeagueDraft();
}

function setupDraftChrome(isLeague) {
    const modal = document.getElementById('draft-modal');
    const title = document.getElementById('draft-title');
    const order = document.getElementById('draft-order');
    const cancel = document.getElementById('draft-cancel-btn');
    const seats = document.getElementById('draft-seats');
    const rosters = document.getElementById('draft-rosters');
    modal.classList.toggle('league-draft', !!isLeague);
    modal.classList.toggle('draft-dense', !isLeague && (preferredGridSize === 5 || preferredGridSize === 'hex'));
    modal.classList.toggle('draft-hex', !isLeague && preferredGridSize === 'hex');
    if (isLeague) {
        title.textContent = 'League Draft';
        order.hidden = true;
        cancel.textContent = 'Save & Leave';
        seats.classList.remove('hidden');
        rosters.classList.add('hidden');
    } else {
        const hand = matchHandSize();
        const pool = matchDraftPoolSize();
        title.textContent = 'Draft Hands';
        order.hidden = false;
        order.textContent = pool === 16 && hand === 5
            ? 'Sixteen cards from the deck. Snake order: 1 pick, then pairs of 2, until each hand is five.'
            : hand === 10
                ? 'Twenty cards. Snake until each side is dealt ten. Hands stay five; extras stay in your draw pile.'
                : `${pool === 16 ? 'Sixteen' : 'Twenty-six'} cards. Snake until each side is dealt ${hand === 8 ? 'eight' : 'thirteen'}. Hands stay five; extras stay in your draw pile.`;
        cancel.textContent = 'Cancel Draft';
        seats.classList.add('hidden');
        rosters.classList.remove('hidden');
    }
}

function renderLeagueDraftSeats() {
    const seats = document.getElementById('draft-seats');
    if (!seats || !leagueDrafting) return;
    seats.innerHTML = '';
    ['you', 'ash', 'vesper', 'rook'].forEach(id => {
        const p = leaguePlayer(id);
        const hand = leagueHandsLive[id] || [];
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'draft-seat' + (draftTurn === id ? ' active' : '') + (leagueRosterSeat === id ? ' is-open' : '');
        const last = hand.length ? hand[hand.length - 1].name : '—';
        el.innerHTML = `<div class="seat-name">${p.icon} ${p.name} · ${hand.length}/${LEAGUE_HAND_SIZE}</div><div class="seat-picks">${hand.length ? last : 'waiting'}</div>`;
        el.title = `View ${p.name === 'You' ? 'your' : p.name + "'s"} cards`;
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            openLeagueRoster(id);
        });
        seats.appendChild(el);
    });
    if (leagueRosterSeat) fillLeagueRoster(leagueRosterSeat);
}

function finishLeagueDraft() {
    league.hands = {
        you: leagueHandsLive.you.map(c => c.id),
        ash: leagueHandsLive.ash.map(c => c.id),
        vesper: leagueHandsLive.vesper.map(c => c.id),
        rook: leagueHandsLive.rook.map(c => c.id)
    };
    league.pool = draftPool.map(c => ({id: c.id, draftedBy: c.draftedBy || null}));
    league.fixtures = makeLeagueFixtures();
    league.phase = 'season';
    league.draftPickIndex = LEAGUE_HAND_SIZE * 4;
    leagueDrafting = false;
    closeLeagueRoster();
    saveLeague();
    hideModal('draft-modal');
    setupDraftChrome(false);
    resolvePendingAutoMatches();
    showLeagueHub();
}

function nextUserFixture() {
    if (!league) return null;
    return league.fixtures.find(fx => !seriesComplete(fx) && (fx.home === 'you' || fx.away === 'you')) || null;
}

function nextUserFixtureIndex() {
    if (!league) return -1;
    return league.fixtures.findIndex(fx => !seriesComplete(fx) && (fx.home === 'you' || fx.away === 'you'));
}

function currentLeagueWeek() {
    const next = nextUserFixture();
    if (!next) return 7;
    return next.week;
}

function leagueStandings() {
    const rows = league.players.map(p => ({
        id: p.id, name: p.name, icon: p.icon, w: 0, l: 0, d: 0, gw: 0, gl: 0, pf: 0, pa: 0, played: 0
    }));
    const byId = Object.fromEntries(rows.map(r => [r.id, r]));
    league.fixtures.forEach(fx => {
        if (!fx.result) return;
        const s = seriesGameWins(fx);
        const h = byId[fx.home], a = byId[fx.away];
        if (!h || !a) return;
        h.pf += s.homePf; h.pa += s.awayPf; h.played++;
        a.pf += s.awayPf; a.pa += s.homePf; a.played++;
        h.gw += s.home; h.gl += s.away;
        a.gw += s.away; a.gl += s.home;
        if (fx.result.winner === 'draw') { h.d++; a.d++; }
        else if (fx.result.winner === fx.home) { h.w++; a.l++; }
        else { a.w++; h.l++; }
    });
    const h2h = (a, b) => {
        const meetings = league.fixtures.filter(f => f.result && ((f.home === a && f.away === b) || (f.home === b && f.away === a)));
        let aW = 0, bW = 0, aGw = 0, bGw = 0;
        meetings.forEach(f => {
            const s = seriesGameWins(f);
            if (f.result.winner === a) aW++;
            else if (f.result.winner === b) bW++;
            if (f.home === a) { aGw += s.home; bGw += s.away; }
            else { aGw += s.away; bGw += s.home; }
        });
        return (bW - aW) || (bGw - aGw);
    };
    rows.sort((x, y) => y.w - x.w || y.gw - x.gw || y.pf - x.pf || (y.pf - y.pa) - (x.pf - x.pa) || h2h(x.id, y.id) || x.name.localeCompare(y.name));
    return rows;
}

function recordLeagueCrown() {
    const table = leagueStandings();
    const youRow = table.find(r => r.id === 'you');
    const champ = table[0];
    league.champion = champ ? champ.id : null;
    const place = youRow ? table.indexOf(youRow) + 1 : 4;
    leagueCrowns.played++;
    if (place === 1) leagueCrowns.won++;
    leagueCrowns.lastPlace = place;
    leagueCrowns.lastChampion = champ ? champ.name : null;
    saveLeagueCrowns();
}

function maybeCompleteLeague() {
    if (!league || league.phase === 'draft') return;
    if (league.fixtures.every(fx => fx.result)) {
        if (league.phase !== 'complete') {
            league.phase = 'complete';
            recordLeagueCrown();
            saveLeague();
        }
    }
}

function playAutoSeries(fx) {
    if (seriesComplete(fx) && fx.result) return fx;
    const diff = leagueAiDifficulty();
    fx.games = fx.games || [];
    while (!seriesComplete(fx)) {
        const firstSeat = seriesNextFirst(fx);
        const firstColor = firstSeat === fx.home ? 'blue' : 'red';
        const result = simulateMatch(
            league.hands[fx.home],
            league.hands[fx.away],
            firstColor,
            league.leftover,
            league.ruleset,
            diff,
            diff,
            fx.home,
            fx.away
        );
        fx.games.push({
            homeScore: result.blue,
            awayScore: result.red,
            winner: result.winner === 'blue' ? fx.home : result.winner === 'red' ? fx.away : 'draw',
            first: firstSeat
        });
    }
    return finalizeSeries(fx);
}

function userWeeksPlayed() {
    if (!league) return new Set();
    return new Set(
        league.fixtures.filter(fx => seriesComplete(fx) && (fx.home === 'you' || fx.away === 'you')).map(fx => fx.week)
    );
}

function resolvePendingAutoMatches() {
    if (!league || league.phase === 'draft') return;
    const playedWeeks = userWeeksPlayed();
    const seasonOver = !nextUserFixture();
    league.fixtures.forEach(fx => {
        const involvesYou = fx.home === 'you' || fx.away === 'you';
        if (involvesYou) return;
        if ((fx.result || (fx.games && fx.games.length)) && !playedWeeks.has(fx.week) && !seasonOver) {
            fx.games = [];
            fx.result = null;
            return;
        }
        if (seriesComplete(fx) && fx.result) return;
        if (playedWeeks.has(fx.week) || seasonOver) playAutoSeries(fx);
    });
    maybeCompleteLeague();
    saveLeague();
}

function fixtureMark(fx) {
    const s = seriesGameWins(fx);
    if (!s.played && !fx.result) {
        if (fx.home === 'you' || fx.away === 'you') return {text: 'Yours', pending: true};
        return {text: 'Soon', pending: true};
    }
    if (!seriesComplete(fx)) return {text: `${s.home}–${s.away}`, pending: true};
    const winnerName = fx.result.winner === 'draw' ? 'Draw' : leaguePlayer(fx.result.winner).name;
    return {text: `${s.home}–${s.away} ${winnerName}`, pending: false};
}

function standingsMap() {
    const table = leagueStandings();
    const map = {};
    table.forEach((row, i) => { map[row.id] = {rank: i + 1, row}; });
    return map;
}

function recordLine(row) {
    return `${row.w}-${row.l}-${row.d}`;
}

function showLeagueHub() {
    hideTooltip();
    hideModals(['main-menu-modal', 'draft-modal', 'deck-modal', 'gameover-modal', 'battle-log-modal', 'changelog-modal']);
    document.body.classList.add('menu-open');
    renderLeagueHub();
    document.getElementById('league-modal').classList.remove('hidden');
}

function renderLeagueHub() {
    const hub = document.getElementById('league-hub');
    if (!hub || !league) return;
    const table = leagueStandings();
    const ranks = standingsMap();
    const next = nextUserFixture();
    const weekNow = Math.min(currentLeagueWeek(), 6);

    let html = '';
    if (league.phase === 'complete' && league.champion) {
        const champ = leaguePlayer(league.champion);
        const youPlace = ranks.you ? ranks.you.rank : 4;
        const youLine = youPlace === 1
            ? `Seasons won: ${leagueCrowns.won}/${leagueCrowns.played}`
            : `You finished ${youPlace}${youPlace === 2 ? 'nd' : youPlace === 3 ? 'rd' : 'th'}. Seasons won: ${leagueCrowns.won}/${leagueCrowns.played}`;
        html += `<div class="league-crown"><p class="league-crown-title">${champ.icon} ${leagueTakeLine(league.champion, 'crown')}</p><p class="league-crown-sub">${youLine}</p></div>`;
    }

    const seats = [youSeat(), ...LEAGUE_RIVALS];
    html += `<div class="league-rivals">${seats.map(r => {
        const rec = ranks[r.id] ? recordLine(ranks[r.id].row) : '0-0-0';
        const open = leagueRosterSeat === r.id ? ' is-open' : '';
        return `<button type="button" class="league-rival-chip${open}" data-seat="${r.id}" title="View ${r.name === 'You' ? 'your' : r.name + "'s"} deck" onclick="openLeagueRoster('${r.id}')"><span class="who">${r.icon} ${r.name}</span><span class="diff">${rec}</span></button>`;
    }).join('')}</div>`;

    if (league.recap) html += `<div class="league-recap">${league.recap}</div>`;

    html += `<div class="menu-section-title" style="margin-top:0;">Standings</div><div class="league-table-wrap"><table class="league-table"><thead><tr><th>#</th><th>Name</th><th class="num">W-L-D</th><th class="num">GW</th><th class="num">PF</th><th class="num">+/-</th></tr></thead><tbody>`;
    table.forEach((row, i) => {
        const cls = [row.id === 'you' ? 'is-you' : '', i === 0 && row.played ? 'is-crown' : ''].filter(Boolean).join(' ');
        const diff = row.pf - row.pa;
        const diffStr = `${diff > 0 ? '+' : ''}${diff}`;
        html += `<tr class="${cls}"><td>${i + 1}</td><td class="league-name" onclick="openLeagueRoster('${row.id}')">${row.icon} ${row.name}</td><td class="num">${recordLine(row)}</td><td class="num">${row.gw}</td><td class="num">${row.pf}</td><td class="num">${diffStr}</td></tr>`;
    });
    html += `</tbody></table></div>`;

    html += `<div class="menu-section-title">Schedule</div>`;
    for (let week = 1; week <= 6; week++) {
        const weekFx = league.fixtures.filter(fx => fx.week === week);
        html += `<div class="league-week${week === weekNow && league.phase !== 'complete' ? ' is-current' : ''}"><p class="league-week-title">Week ${week}</p>`;
        weekFx.forEach(fx => {
            const isNext = next && fx === next;
            const homeRank = ranks[fx.home] ? `#${ranks[fx.home].rank}` : '';
            const awayRank = ranks[fx.away] ? `#${ranks[fx.away].rank}` : '';
            const nextFirst = seriesComplete(fx) ? null : seriesNextFirst(fx);
            const firstName = leaguePlayer(nextFirst || fx.seriesFirst).name;
            const firstBit = seriesComplete(fx)
                ? `${leaguePlayer(fx.seriesFirst).name} opened`
                : `${firstName} first`;
            const mark = fixtureMark(fx);
            html += `<div class="league-fixture${isNext ? ' is-next' : ''}"><div class="versus">${leagueLabel(fx.home)} <span style="opacity:.45">${homeRank}</span> vs ${leagueLabel(fx.away)} <span style="opacity:.45">${awayRank}</span></div><div class="mark${mark.pending ? ' pending' : ''}" title="${firstBit}">${mark.text}</div></div>`;
        });
        html += `</div>`;
    }

    html += `<div class="league-actions">`;
    if (league.phase === 'complete') {
        html += `<button class="btn" onclick="requestNewLeague()">New Season</button>`;
    } else if (next) {
        const opp = next.home === 'you' ? next.away : next.home;
        const oppP = leaguePlayer(opp);
        const oppRow = ranks[opp] ? ranks[opp].row : null;
        const rec = oppRow ? recordLine(oppRow) : '0-0-0';
        const gameN = (next.games || []).length + 1;
        html += `<button class="btn" onclick="playNextLeagueMatch()">Play Week ${next.week} · Game ${gameN} · ${oppP.name} (${rec})</button>`;
    }
    html += `<button class="btn btn-alt" onclick="leaveLeagueToMenu()">Back to Menu</button>`;
    html += `<div class="league-danger"><button class="btn btn-muted" onclick="requestEndLeague()">End League</button>${league.phase !== 'complete' ? '<button class="btn btn-muted" onclick="requestNewLeague()">New Season</button>' : ''}</div></div>`;
    if (leagueHubConfirm === 'end') {
        html = `<div class="league-confirm">This season is gone — standings, draft, and remaining matches. Casual games stay.<div class="row"><button class="btn" onclick="confirmLeagueAction('end')">End It</button><button class="btn btn-alt" onclick="cancelLeagueConfirm()">Keep It</button></div></div>` + html;
    } else if (leagueHubConfirm === 'new') {
        html = `<div class="league-confirm">Start a new season? The current draft and table will be wiped.<div class="row"><button class="btn" onclick="confirmLeagueAction('new')">Start New</button><button class="btn btn-alt" onclick="cancelLeagueConfirm()">Keep This One</button></div></div>` + html;
    }
    hub.innerHTML = html;
    if (leagueHubConfirm) {
        const box = hub.querySelector('.league-confirm');
        if (box) box.scrollIntoView({block: 'nearest'});
    }
}

function playNextLeagueMatch() {
    sfx.click(); hideTooltip();
    closeLeagueRoster();
    hideModal('gameover-modal');
    const idx = nextUserFixtureIndex();
    if (idx < 0) {
        showLeagueHub();
        return;
    }
    const fx = league.fixtures[idx];
    const oppId = fx.home === 'you' ? fx.away : fx.home;
    const first = seriesNextFirst(fx);
    leagueMatch = {fixtureIndex: idx, oppId, first};
    cloneRulesetOverride = league.ruleset;
    leftoverThisMatch = league.leftover;
    skipCoachOnce = true;
    activeMode = 'league';
    hideModals(['league-modal', 'main-menu-modal', 'draft-modal', 'deck-modal', 'gameover-modal', 'battle-log-modal', 'changelog-modal']);
    applyGridSize(3);
    resetTable();
    gameState = 'playing';
    const youIds = league.hands.you;
    const oppIds = league.hands[oppId];
    playerHand = youIds.map(id => cloneForOwner(masterCards.find(c => c.id === id), 'blue', league.ruleset));
    aiHand = oppIds.map(id => cloneForOwner(masterCards.find(c => c.id === id), 'red', league.ruleset));
    const firstSeat = first === 'you' ? 'player' : 'ai';
    beginMatch(firstSeat, 'league');
}

function openLeagueHubFromGameover() {
    if (gameoverClickLock) return;
    unlockGameoverClicks();
    sfx.click(); hideTooltip();
    hideModal('gameover-modal');
    resolvePendingAutoMatches();
    showLeagueHub();
}

function recordUserLeagueResult(blueCount, redCount) {
    if (!league || !leagueMatch) return;
    const fx = league.fixtures[leagueMatch.fixtureIndex];
    if (!fx) return;
    const youIsHome = fx.home === 'you';
    const winner = blueCount > redCount ? 'you' : redCount > blueCount ? leagueMatch.oppId : 'draw';
    fx.games = fx.games || [];
    fx.games.push({
        homeScore: youIsHome ? blueCount : redCount,
        awayScore: youIsHome ? redCount : blueCount,
        winner,
        first: leagueMatch.first || seriesNextFirst({...fx, games: fx.games.slice()})
    });
    const opp = leaguePlayer(leagueMatch.oppId);
    const gameN = fx.games.length;
    const verdict = winner === 'you' ? `You took ${opp.name}` : winner === 'draw' ? `Draw with ${opp.name}` : `${opp.name} took you`;
    let recap = `Week ${fx.week} game ${gameN}: ${verdict} ${blueCount}–${redCount}.`;
    if (seriesComplete(fx)) {
        finalizeSeries(fx);
        const s = seriesGameWins(fx);
        const youGames = youIsHome ? s.home : s.away;
        const oppGames = youIsHome ? s.away : s.home;
        const seriesVerdict = fx.result.winner === 'you'
            ? `You take the series`
            : fx.result.winner === 'draw'
                ? `Series draw`
                : `${opp.name} takes the series`;
        recap = `Week ${fx.week}: ${seriesVerdict} ${youGames}–${oppGames}. ${verdict} ${blueCount}–${redCount}.`;
        resolvePendingAutoMatches();
        const autoNow = league.fixtures.find(other => other.week === fx.week && other !== fx && other.result);
        if (autoNow) {
            const aw = autoNow.result.winner === 'draw' ? 'Draw' : leaguePlayer(autoNow.result.winner).name;
            const as = seriesGameWins(autoNow);
            recap += ` ${leaguePlayer(autoNow.home).name} vs ${leaguePlayer(autoNow.away).name} ${as.home}–${as.away} (${aw}).`;
        }
    }
    league.recap = recap;
    maybeCompleteLeague();
    saveLeague();
}

function snapshotSimTable() {
    return {
        board: board.map(c => c),
        cellEffects: cellEffects.slice(),
        playerHand: playerHand.slice(),
        aiHand: aiHand.slice(),
        leftoverThisMatch,
        matchCaptures: {blue: matchCaptures.blue, red: matchCaptures.red},
        classicTiesThisMatch,
        playerDeck: playerDeck.slice(),
        aiDeck: aiDeck.slice(),
        turn,
        gameState,
        selectedCard,
        shown: Array.from(shownStatValues.entries())
    };
}

function restoreSimTable(snap) {
    board = snap.board;
    cellEffects = snap.cellEffects;
    playerHand = snap.playerHand;
    aiHand = snap.aiHand;
    leftoverThisMatch = snap.leftoverThisMatch;
    matchCaptures = snap.matchCaptures ? {blue: snap.matchCaptures.blue, red: snap.matchCaptures.red} : {blue: 0, red: 0};
    classicTiesThisMatch = snap.classicTiesThisMatch;
    playerDeck = snap.playerDeck ? snap.playerDeck.slice() : [];
    aiDeck = snap.aiDeck ? snap.aiDeck.slice() : [];
    turn = snap.turn;
    gameState = snap.gameState;
    selectedCard = snap.selectedCard;
    shownStatValues.clear();
    (snap.shown || []).forEach(([k, v]) => shownStatValues.set(k, v));
}

function simulateMatch(blueIds, redIds, firstColor, leftover, ruleset, blueDiff, redDiff, blueSeat, redSeat) {
    const snap = snapshotSimTable();
    const prevSilent = silentSim;
    const prevOverride = cloneRulesetOverride;
    silentSim = true;
    cloneRulesetOverride = ruleset;
    leftoverThisMatch = leftover;
    classicTiesThisMatch = ruleset === 'classic' && !!(league && league.classicTies);
    const prevGrid = gridSize;
    applyGridSize(3);
    resetTable();
    playerDeck = [];
    aiDeck = [];
    playerHand = (blueIds || []).map(id => cloneForOwner(masterCards.find(c => c.id === id), 'blue', ruleset));
    aiHand = (redIds || []).map(id => cloneForOwner(masterCards.find(c => c.id === id), 'red', ruleset));
    let whose = firstColor === 'red' ? 'red' : 'blue';
    let safety = 0;
    while (board.some(c => c === null) && safety++ < cellCount() + 4) {
        const hand = whose === 'blue' ? playerHand : aiHand;
        if (!hand.length) break;
        const diff = whose === 'blue' ? blueDiff : redDiff;
        const seat = whose === 'blue' ? blueSeat : redSeat;
        const move = pickAiMoveFor(whose, diff, seat);
        if (!move) break;
        const card = hand.splice(move.cardIndex, 1)[0];
        card.stats = [...card.baseStats];
        board[move.cellIdx] = card;
        applyPlacementCore(move.cellIdx, card);
        whose = whose === 'blue' ? 'red' : 'blue';
    }
    const blue = ownedCount('blue');
    const red = ownedCount('red');
    const winner = blue > red ? 'blue' : red > blue ? 'red' : 'draw';
    applyGridSize(prevGrid);
    restoreSimTable(snap);
    silentSim = prevSilent;
    cloneRulesetOverride = prevOverride;
    return {blue, red, winner};
}

function clearDraftTimer() {
    if (draftTimer) {clearTimeout(draftTimer); draftTimer = null;}
}

function cancelDraft() {
    clearDraftTimer();
    closeLeagueRoster();
    if (leagueDrafting) persistLeagueDraft();
    leagueDrafting = false;
    setupDraftChrome(false);
    showModeMenu();
}

function scheduleAiDraftPick(delay) {
    clearDraftTimer();
    draftTimer = setTimeout(() => {
        draftTimer = null;
        aiDraftPick();
    }, delay);
}

function startDraftMode() {
    applyGridSize(preferredGridSize);
    leagueDrafting = false;
    draftedPlayerCards = []; draftedAICards = [];
    draftPickIndex = 0;
    draftStarter = Math.random() < 0.5 ? 'player' : 'ai';
    draftTurn = snakeSeq2(draftStarter, matchHandSize())[0];

    draftPool = [...masterCards].sort(() => Math.random() - 0.5).slice(0, matchDraftPoolSize()).map(c => cloneCard(c, {draftedBy: null}));

    setupDraftChrome(false);
    renderDraftPool();
    document.getElementById('draft-modal').classList.remove('hidden');
    if (draftTurn === 'ai') scheduleAiDraftPick(600);
}

function draftCardClass(card) {
    const hex = isHexGrid() ? ' has-hex-faces' : '';
    if (!card.draftedBy) return 'draft-card' + hex;
    return (leagueDrafting ? `draft-card taken taken-${card.draftedBy}` : 'draft-card drafted') + hex;
}

function bindDraftGridClicks() {
    const grid = document.getElementById('draft-pool-grid');
    if (!grid || grid.dataset.bound) return;
    grid.dataset.bound = '1';
    grid.addEventListener('click', (e) => {
        const el = e.target.closest('.draft-card');
        if (!el || !grid.contains(el)) return;
        if (el.classList.contains('taken') || el.classList.contains('drafted')) return;
        const idx = [...grid.children].indexOf(el);
        const card = draftPool[idx];
        if (!card || card.draftedBy) return;
        const humanTurn = leagueDrafting ? draftTurn === 'you' : draftTurn === 'player';
        if (!humanTurn) return;
        sfx.click(); hideTooltip();
        playerDraftPick(card);
    });
}

function renderDraftPool() {
    const grid = document.getElementById('draft-pool-grid');
    bindDraftGridClicks();
    grid.innerHTML = '';
    draftPool.forEach((card) => {
        const el = document.createElement('div');
        el.className = draftCardClass(card);
        el.innerHTML = draftCardFaceHTML(card);
        addTooltipListeners(el, abilityTip(card));
        paintCardFaces(el);
        grid.appendChild(el);
    });
    if (leagueDrafting) {
        const picker = leaguePlayer(draftTurn);
        const twice = isSnakeDoublePick();
        document.getElementById('draft-status').textContent = draftTurn === 'you'
            ? (twice ? "Your pick — you choose twice." : "Your pick.")
            : (twice ? `${picker.name} is choosing twice...` : `${picker.name} is choosing...`);
        renderLeagueDraftSeats();
    } else {
        document.getElementById('draft-status').textContent = draftTurn === 'player'
            ? (isSnakeDoublePick() ? "Your pick - you choose twice." : "Your pick.")
            : (isSnakeDoublePick() ? "AI is choosing twice..." : "AI is choosing...");
        const hand = matchHandSize();
        document.getElementById('draft-rosters').textContent =
            `Pick ${draftPickIndex + 1}/${hand * 2} · Your Hand: ${draftedPlayerCards.length}/${hand} | AI Hand: ${draftedAICards.length}/${hand}`;
    }
}

function isSnakeDoublePick() {
    const seq = currentSnakeSeq();
    return seq[draftPickIndex] && seq[draftPickIndex] === seq[draftPickIndex + 1];
}

function playerDraftPick(card) {
    if (card.draftedBy) return;
    if (leagueDrafting) {
        if (draftTurn !== 'you') return;
        card.draftedBy = 'you';
        leagueHandsLive.you.push(card);
        persistLeagueDraft();
        checkDraftProgress();
        return;
    }
    if (draftTurn !== 'player') return;
    card.draftedBy = 'player'; draftedPlayerCards.push(card); checkDraftProgress();
}

function aiDraftPick() {
    if (document.getElementById('draft-modal').classList.contains('hidden')) return;
    const available = draftPool.filter(c => !c.draftedBy);
    if (!available.length) return;
    if (leagueDrafting) {
        if (draftTurn === 'you' || !leagueHandsLive[draftTurn] || leagueHandsLive[draftTurn].length >= LEAGUE_HAND_SIZE) return;
        available.sort((a, b) => leagueDraftScore(b, draftTurn) - leagueDraftScore(a, draftTurn));
        available[0].draftedBy = draftTurn;
        leagueHandsLive[draftTurn].push(available[0]);
        persistLeagueDraft();
        checkDraftProgress();
        return;
    }
    if (draftTurn !== 'ai' || draftedAICards.length >= matchHandSize()) return;
    available.sort((a, b) => getCardDraftScore(b) - getCardDraftScore(a));
    available[0].draftedBy = 'ai';
    draftedAICards.push(available[0]);
    checkDraftProgress();
}

function checkDraftProgress() {
    if (leagueDrafting) {
        const done = ['you', 'ash', 'vesper', 'rook'].every(id => (leagueHandsLive[id] || []).length >= LEAGUE_HAND_SIZE);
        if (done) {
            finishLeagueDraft();
            return;
        }
        draftPickIndex++;
        draftTurn = leagueDraftSeq[draftPickIndex];
        persistLeagueDraft();
        renderDraftPool();
        if (draftTurn && draftTurn !== 'you') scheduleAiDraftPick(480);
        return;
    }
    if (draftedPlayerCards.length === matchHandSize() && draftedAICards.length === matchHandSize()) {
        hideModal('draft-modal');
        resetTable(); gameState = 'playing';
        playerHand = draftedPlayerCards.map(c => cloneCard(c, {owner: 'blue'}));
        aiHand = draftedAICards.map(c => cloneCard(c, {owner: 'red'}));
        beginMatch();
    } else {
        draftPickIndex++;
        draftTurn = snakeSeq2(draftStarter, matchHandSize())[draftPickIndex];
        renderDraftPool();
        if (draftTurn === 'ai') scheduleAiDraftPick(550);
    }
}
