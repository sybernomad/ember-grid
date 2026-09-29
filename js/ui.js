/* Table UI: menus, rendering, battle log, coach, and tutorial. */
// --- Audio Engine ---
let audioCtx = null;

let isAudioMuted = localStorage.getItem('ember_grid_muted') === 'true';

updateAudioButtonIcon();

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function toggleAudio() {
    isAudioMuted = !isAudioMuted;
    localStorage.setItem('ember_grid_muted', isAudioMuted);
    updateAudioButtonIcon();
    sfx.click();
}

function updateAudioButtonIcon() {
    const btn = document.getElementById('audio-toggle-btn');
    if (!btn) return;
    btn.classList.toggle('audio-muted', isAudioMuted);
    const label = isAudioMuted ? 'Unmute audio' : 'Mute audio';
    btn.title = label;
    btn.setAttribute('aria-label', label);
}

function playTone(freq, type, duration, gainVal = 0.1) {
    if (isAudioMuted) return;
    try {
        initAudio();
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) { }
}

const sfx = {
    click: () => playTone(440, 'sine', 0.05, 0.04),
    place: () => playTone(150, 'triangle', 0.08, 0.12),
    flipBlue: () => {playTone(523, 'sine', 0.08, 0.06); setTimeout(() => playTone(659, 'sine', 0.1, 0.06), 50);},
    flipRed: () => {playTone(280, 'sawtooth', 0.08, 0.05); setTimeout(() => playTone(200, 'sawtooth', 0.1, 0.05), 50);},
    win: () => {playTone(523, 'sine', 0.1, 0.08); setTimeout(() => playTone(659, 'sine', 0.1, 0.08), 80); setTimeout(() => playTone(783, 'sine', 0.2, 0.08), 160);},
    lose: () => {playTone(300, 'sawtooth', 0.12, 0.08); setTimeout(() => playTone(180, 'sawtooth', 0.2, 0.08), 100);}
};

// --- Clamped Mobile-Friendly Tooltip Engine ---
const tooltipEl = document.getElementById('card-tooltip');

let longPressTimer = null;

let tooltipPinned = false;

let tooltipAnchor = null;

function coarsePointer() {
    return window.matchMedia('(pointer: coarse)').matches;
}

function showTooltip(text, e) {
    if (!text) return;
    tooltipPinned = false;
    tooltipAnchor = null;
    tooltipEl.classList.remove('pinned');
    tooltipEl.textContent = text;
    tooltipEl.style.display = 'block';
    updateTooltipPosition(e);
}

function pinTooltip(text, el) {
    if (!text || !el) return;
    tooltipPinned = true;
    tooltipAnchor = el;
    tooltipEl.classList.add('pinned');
    tooltipEl.textContent = text;
    tooltipEl.style.display = 'block';
    positionTooltipOnAnchor(el);
}

function positionTooltipOnAnchor(el) {
    const r = el.getBoundingClientRect();
    const pad = 10;
    const gap = 8;
    const tipW = tooltipEl.offsetWidth;
    const tipH = tooltipEl.offsetHeight;
    let left = r.left + (r.width - tipW) / 2;
    left = Math.max(pad, Math.min(left, window.innerWidth - tipW - pad));
    const above = r.top - tipH - gap;
    const below = r.bottom + gap;
    let top;
    if (above >= pad) top = above;
    else if (below + tipH <= window.innerHeight - pad) top = below;
    else top = Math.max(pad, Math.min(above, window.innerHeight - tipH - pad));
    tooltipEl.style.left = `${Math.round(left)}px`;
    tooltipEl.style.top = `${Math.round(top)}px`;
}

function updateTooltipPosition(e) {
    if (tooltipPinned && tooltipAnchor) {
        positionTooltipOnAnchor(tooltipAnchor);
        return;
    }
    const x = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY);
    if (x == null || y == null) return;

    const tipWidth = tooltipEl.offsetWidth || 180;
    const tipHeight = tooltipEl.offsetHeight || 60;
    let left = x + 14;
    let top = y - 35;

    if (left + tipWidth > window.innerWidth - 10) {
        left = window.innerWidth - tipWidth - 10;
    }
    if (top < 10) {
        top = y + 20;
    }
    if (top + tipHeight > window.innerHeight - 10) {
        top = Math.max(10, window.innerHeight - tipHeight - 10);
    }

    tooltipEl.style.left = left + 'px';
    tooltipEl.style.top = top + 'px';
}

function hideTooltip() {
    tooltipEl.style.display = 'none';
    tooltipEl.classList.remove('pinned');
    tooltipPinned = false;
    tooltipAnchor = null;
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }
}

const statusMsg = document.getElementById('status-msg');

let battleLog = [];

function logAction(msg) {
    if (silentSim) return;
    if (!msg) return;
    battleLog.push(msg);
    renderBattleLog();
}

function resetActionLog(msg) {
    battleLog = [];
    if (msg) logAction(msg);
    else renderBattleLog();
}

function renderBattleLog() {
    const list = document.getElementById('battle-log-list');
    if (!list) return;
    list.innerHTML = '';
    if (!battleLog.length) {
        const empty = document.createElement('li');
        empty.className = 'battle-log-empty';
        empty.textContent = 'No plays yet.';
        list.appendChild(empty);
        return;
    }
    battleLog.forEach(msg => {
        const li = document.createElement('li');
        li.className = 'battle-log-entry';
        String(msg).split(' · ').forEach(part => {
            const row = document.createElement('div');
            row.className = 'log-part';
            row.innerHTML = part;
            li.appendChild(row);
        });
        list.appendChild(li);
    });
    list.scrollTop = list.scrollHeight;
}

function showBattleLogModal() {
    sfx.click(); hideTooltip();
    renderBattleLog();
    document.getElementById('battle-log-modal').classList.remove('hidden');
    if (tutorial && tutorial.phase === 'log') {
        tutorial.logOpened = true;
        const step = tutorialStep();
        const text = document.getElementById('coach-text');
        const next = document.getElementById('coach-next');
        const openLog = document.getElementById('coach-open-log');
        if (text && step) text.textContent = step.after || step.before;
        if (openLog) openLog.hidden = true;
        if (next) next.hidden = false;
        requestAnimationFrame(updateCoach);
    }
    const list = document.getElementById('battle-log-list');
    if (list) list.scrollTop = list.scrollHeight;
}

function closeBattleLogModal() {
    sfx.click(); hideTooltip();
    hideModal('battle-log-modal');
}

function revealHands() {
    return showBothHands || !!(tutorial && gameState !== 'menu');
}

function liveStatsOf(card, index, source) {
    const printed = printedStatsOf(card);
    let stats = [...(card.stats || card.baseStats || printed)];
    if (source === 'board' && card.blastPreview && liveAbilityType(card) === 'blast' && !isSilenced(index)) {
        stats = stats.map(s => clampStat(s + 2));
    }
    return stats.map(clampStat);
}

function facingMarkup(dir, live, printed, prev) {
    const labels = {top: 'Top', right: 'Right', bottom: 'Bottom', left: 'Left', ne: 'Upper right', nw: 'Upper left'};
    const cls = [];
    if (live > printed) cls.push('stat-up');
    else if (live < printed) cls.push('stat-down');
    if (prev != null && live !== prev) cls.push('stat-flash');
    const className = `stat-${dir}${cls.length ? ` ${cls.join(' ')}` : ''}`;
    const printedLabel = live !== printed ? `Printed ${formatStat(printed)}` : '';
    const aria = live !== printed
        ? `${labels[dir]} ${formatStat(live)}, printed ${formatStat(printed)}`
        : `${labels[dir]} ${formatStat(live)}`;
    const titleAttr = printedLabel ? ` title="${printedLabel}"` : '';
    return `<div class="${className}"${titleAttr} aria-label="${aria}">${formatStat(live)}</div>`;
}

function listNames(names) {
    const unique = [...new Set(names.filter(Boolean))];
    if (unique.length === 0) return '';
    if (unique.length === 1) return unique[0];
    if (unique.length === 2) return `${unique[0]} and ${unique[1]}`;
    return `${unique.slice(0, -1).join(', ')}, and ${unique[unique.length - 1]}`;
}

function logName(name, owner) {
    if (!name) return '';
    const side = owner === 'red' ? 'red' : 'blue';
    return `<span class="log-card log-${side}">${name}</span>`;
}

function logCard(card, owner) {
    return card ? logName(card.name, owner || card.owner) : '';
}

function listLogNames(items) {
    const parts = [];
    const seen = new Set();
    (items || []).forEach(item => {
        if (!item) return;
        const name = item.name || item;
        const owner = item.owner;
        if (!name || typeof name !== 'string') return;
        const key = owner ? `${owner}:${name}` : name;
        if (seen.has(key)) return;
        seen.add(key);
        parts.push(owner ? logName(name, owner) : name);
    });
    return listNames(parts);
}

function updateDifficulty(val) {
    sfx.click();
    aiDifficulty = val;
    localStorage.setItem('ember_grid_ai', val);
}

function updateOpenHands(checked) {
    sfx.click();
    showBothHands = !!checked;
    localStorage.setItem('ember_grid_open_hands', showBothHands);
    if (gameState === 'playing' || gameState === 'gameover') render();
}

function leftoverVictoryCopy() {
    return leftoverScores
        ? "<strong>On:</strong> Cards left in hand count too."
        : "<strong>Off (default):</strong> Only cards on the grid count. Cards left in hand are choices, not points.";
}

function refreshVictoryCopy() {
    const desc = document.getElementById('leftover-desc');
    if (desc) desc.innerHTML = leftoverVictoryCopy();
}

function gridChoiceCopy(n) {
    if (n === 'hex') return {long: "<strong>Honeycomb:</strong> Nineteen cells. Ten dealt. Open five, draw after you play. Each card shows an upper-left and upper-right number. Decks are ten cards. League stays 3×3.", short: "Nineteen cells. Ten dealt, five in hand."};
    if (n === 4) return {long: "<strong>4×4:</strong> Eight dealt. Open five, draw after you play. Decks are eight cards. League stays 3×3.", short: "Eight dealt. Open five, draw after you play."};
    if (n === 5) return {long: "<strong>5×5:</strong> Thirteen dealt. Open five, draw after you play. Decks are thirteen cards. League stays 3×3.", short: "Thirteen dealt. Open five, draw after you play."};
    return {long: "<strong>3×3 (default):</strong> Five each. Decks are five cards. League always uses this size.", short: "Five each. The usual table."};
}

function paintGridChoices() {
    const current = String(preferredGridSize);
    document.querySelectorAll('[data-grid-choice]').forEach(btn => {
        const on = btn.dataset.gridChoice === current;
        btn.classList.toggle('selected', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
}

function refreshGridSizeDesc() {
    const copy = gridChoiceCopy(preferredGridSize);
    const el = document.getElementById('grid-size-desc');
    if (el) el.innerHTML = copy.long;
    const menu = document.getElementById('menu-grid-note');
    if (menu) menu.textContent = copy.short;
    paintGridChoices();
}

function updatePreferredGrid(val) {
    sfx.click();
    preferredGridSize = normalizeGridChoice(val);
    localStorage.setItem('ember_grid_size', String(preferredGridSize));
    refreshGridSizeDesc();
    refreshVictoryCopy();
    if (gameState === 'menu') applyGridSize(preferredGridSize);
    refreshMenuDeck();
}

function updateLeftoverScores(checked) {
    sfx.click();
    leftoverScores = !!checked;
    localStorage.setItem('ember_grid_leftover', leftoverScores ? 'true' : 'false');
    refreshVictoryCopy();
}

function canHaptic() {
    return !!(hapticsOn && !silentSim && navigator.vibrate);
}

function haptic(pattern) {
    if (!canHaptic()) return;
    try { navigator.vibrate(pattern); } catch (err) {}
}

function hapticForPlay(fx) {
    const ability = fx.abilityFx || fx.buffFx || fx.silenceFx || fx.chillFx || fx.psnFx || fx.pendulumFx;
    const captured = !!(fx.capLog || fx.psnCapLog);
    if (ability && ability.kind === 'bolt') haptic(captured ? [10, 28, 36, 40, 18] : [10, 30, 36]);
    else if (captured) haptic([12, 28, 22]);
    else if (ability) haptic([16, 24, 20]);
    else haptic(14);
}

function updateHaptics(checked) {
    sfx.click();
    hapticsOn = !!checked;
    localStorage.setItem('ember_grid_haptics', hapticsOn ? 'true' : 'false');
    if (hapticsOn) haptic(18);
}

function refreshClassicTiesUi() {
    const block = document.getElementById('classic-ties-block');
    const check = document.getElementById('classic-ties-check');
    const desc = document.getElementById('classic-ties-desc');
    const classic = currentRuleset === 'classic';
    if (block) block.hidden = !classic;
    if (check) {
        check.checked = classicTies;
        check.disabled = isLeagueActive();
    }
    if (desc) {
        desc.innerHTML = classicTies
            ? '<strong>On:</strong> Equal numbers capture. Classic Mode only. Ember Mode leaves this off so Equalizer stays special.'
            : '<strong>Off (default):</strong> Equal numbers do nothing.';
    }
}

function updateClassicTies(checked) {
    sfx.click();
    classicTies = !!checked;
    localStorage.setItem('ember_grid_classic_ties', classicTies ? 'true' : 'false');
    refreshClassicTiesUi();
}

function refreshRulesetDesc() {
    const descBox = document.getElementById('ruleset-desc');
    if (!descBox) return;
    descBox.innerHTML = currentRuleset === 'classic'
        ? "<strong>Classic Mode:</strong> Abilities off. Capture is stats only."
        : "<strong>Ember Mode:</strong> Every card has an ability. Fourteen tribes.";
    refreshClassicTiesUi();
}

function updateRuleset(val) {
    sfx.click();
    currentRuleset = val;
    refreshRulesetDesc();
}

function clearAiPlayTimer() {
    if (aiPlayTimer) {clearTimeout(aiPlayTimer); aiPlayTimer = null;}
}

function hideTurnBanner() {
    const banner = document.getElementById('turn-banner');
    if (banner) banner.classList.remove('show');
}

function onModalBackdrop(e, action) {
    if (e.target !== e.currentTarget) return;
    action();
}

function releaseUiFocus(root) {
    const active = document.activeElement;
    if (!active || typeof active.blur !== 'function') return;
    if (active === document.body || active === document.documentElement) return;
    if (root && !root.contains(active)) return;
    active.blur();
}

function hideModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    releaseUiFocus(el);
    el.classList.add('hidden');
}

function hideModals(ids) {
    ids.forEach(hideModal);
}

function closeRulesModal() {
    sfx.click(); hideTooltip();
    hideModal('expanded-rules-modal');
}

function showChangelogModal() {
    sfx.click(); hideTooltip();
    document.getElementById('changelog-modal').classList.remove('hidden');
}

function closeChangelogModal() {
    sfx.click(); hideTooltip();
    hideModal('changelog-modal');
}

function closeCompendiumModal() {
    sfx.click(); hideTooltip();
    hideModal('compendium-modal');
}

function closeOptionsModal() {
    sfx.click(); hideTooltip();
    hideModal('options-modal');
}

function closeStatsModal() {
    sfx.click(); hideTooltip();
    hideModal('stats-modal');
}

function showModeMenu() {
    sfx.click(); hideTooltip(); tutorial = null; hideCoach();
    document.body.classList.remove('tutorial-live');
    clearDraftTimer();
    clearAiPlayTimer();
    resetFingerDrag();
    hideTurnBanner();
    document.body.classList.add('menu-open');
    hideModals(['draft-modal', 'deck-modal', 'stats-modal', 'expanded-rules-modal', 'compendium-modal', 'options-modal', 'gameover-modal', 'battle-log-modal', 'league-modal', 'league-roster', 'tutorial-modal', 'changelog-modal']);
    closeLeagueRoster();
    document.getElementById('main-menu-modal').classList.remove('hidden');
    applyGridSize(preferredGridSize);
    gameState = 'menu'; resetTable(); playerHand = []; aiHand = []; playerDeck = []; aiDeck = [];
    lastBlueScore = null; lastRedScore = null; lastMatch = null;
    leagueMatch = null;
    cloneRulesetOverride = null;
    leagueHubConfirm = null;
    refreshLeagueMenuButton();
    refreshMenuDeck();
    clearShareHash();
    setMatchCodeError('');
    const codeBox = document.getElementById('match-code-box');
    if (codeBox && !pendingShareCode()) codeBox.open = false;
    resetActionLog(); render();
}

function showStatsModal() {
    sfx.click(); hideTooltip();
    document.getElementById('stat-record').textContent = `${stats.wins}-${stats.losses}-${stats.draws}`;
    document.getElementById('stat-winrate').textContent = `${stats.played > 0 ? ((stats.wins / stats.played) * 100).toFixed(1) : '0.0'}%`;
    document.getElementById('stat-streaks').textContent = `${stats.streak} / ${stats.bestStreak}`;
    document.getElementById('stat-flips').textContent = stats.flips;

    const sortedCards = Object.entries(stats.cardPlays).sort((a, b) => b[1] - a[1]);
    document.getElementById('stat-top-cards').innerHTML = sortedCards.length === 0 ? "No deployment data available." : sortedCards.slice(0, 3).map(([name, count]) => `• ${name}: ${count} plays`).join('<br>');
    document.getElementById('stats-modal').classList.remove('hidden');
}

function showRulesModal() {
    sfx.click(); hideTooltip();
    document.getElementById('expanded-rules-modal').classList.remove('hidden');
}

function showCompendiumModal() {
    sfx.click(); hideTooltip();
    renderCompendium();
    document.getElementById('compendium-modal').classList.remove('hidden');
}

function showOptionsModal() {
    sfx.click(); hideTooltip();
    document.getElementById('ruleset-select').value = currentRuleset;
    document.getElementById('ai-difficulty-select').value = aiDifficulty;
    document.getElementById('open-hands-check').checked = showBothHands;
    document.getElementById('leftover-check').checked = leftoverScores;
    const hapticsCheck = document.getElementById('haptics-check');
    if (hapticsCheck) hapticsCheck.checked = hapticsOn;
    paintGridChoices();
    refreshRulesetDesc();
    refreshGridSizeDesc();
    refreshVictoryCopy();
    refreshClassicTiesUi();
    const leagueNote = document.getElementById('league-options-note');
    if (leagueNote) leagueNote.hidden = !isLeagueActive();
    document.getElementById('options-modal').classList.remove('hidden');
}

function renderCompendium() {
    hideTooltip();
    const grid = document.getElementById('compendium-grid');
    grid.innerHTML = '';
    const filter = (document.getElementById('compendium-filter') || {}).value || 'all';
    masterCards.forEach(card => {
        if (filter !== 'all' && (!card.ability || card.ability.type !== filter)) return;
        const el = document.createElement('div');
        el.className = 'compendium-card has-hex-faces';
        el.innerHTML = `
            ${card.ability ? `<div class="ability-badge">${card.ability.icon}</div>` : ''}
            <div class="card-set-num">${card.id}</div>
            <div class="stat-top">${formatStat(card.baseStats[0])}</div>
            <div class="stat-right">${formatStat(card.baseStats[1])}</div>
            <div class="stat-bottom">${formatStat(card.baseStats[2])}</div>
            <div class="stat-left">${formatStat(card.baseStats[3])}</div>
            ${staticShoulderHTML(card)}
            <div class="card-emoji">${card.emoji}</div>
            ${nameplateHTML(card)}
        `;
        const tip = `${abilityTip(card, {withId: true})} Costs ${emberCostOf(card)} embers.`;
        addTooltipListeners(el, tip);
        paintCardFaces(el);
        grid.appendChild(el);
    });
    if (!grid.childElementCount) {
        const empty = document.createElement('p');
        empty.className = 'set-blurb';
        empty.style.gridColumn = '1 / -1';
        empty.textContent = 'No cards match that filter.';
        grid.appendChild(empty);
    }
}

function addTooltipListeners(el, descText, opts) {
    const pinOnTap = !!(opts && opts.pinOnTap);
    let pressStart = null;
    let handledByPointer = false;

    el.addEventListener('mouseenter', (e) => {
        if (coarsePointer() || tooltipPinned) return;
        showTooltip(descText, e);
    });
    el.addEventListener('mousemove', (e) => {
        if (coarsePointer() || tooltipPinned) return;
        updateTooltipPosition(e);
    });
    el.addEventListener('mouseleave', () => {
        if (!tooltipPinned) hideTooltip();
    });

    el.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse') return;
        pressStart = {x: e.clientX, y: e.clientY};
        handledByPointer = false;
        if (longPressTimer) clearTimeout(longPressTimer);
        longPressTimer = setTimeout(() => {
            longPressTimer = null;
            handledByPointer = true;
            pinTooltip(descText, el);
        }, 400);
    });
    el.addEventListener('pointermove', (e) => {
        if (!pressStart || e.pointerType === 'mouse') return;
        if (Math.hypot(e.clientX - pressStart.x, e.clientY - pressStart.y) <= 14) return;
        pressStart = null;
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    });
    el.addEventListener('pointerup', (e) => {
        if (e.pointerType === 'mouse') return;
        const start = pressStart;
        pressStart = null;
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
        if (!pinOnTap || !start) return;
        if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 14) return;
        if (handledByPointer) return;
        handledByPointer = true;
        if (tooltipPinned && tooltipAnchor === el) hideTooltip();
        else pinTooltip(descText, el);
    });
    el.addEventListener('pointercancel', () => {
        pressStart = null;
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    });
    if (pinOnTap) {
        el.addEventListener('click', (e) => {
            if (handledByPointer) {
                e.preventDefault();
                e.stopPropagation();
                handledByPointer = false;
                return;
            }
            e.stopPropagation();
            if (tooltipPinned && tooltipAnchor === el) hideTooltip();
            else pinTooltip(descText, el);
        });
    }
}

function playMenuDeck() {
    const slot = currentBuiltSlot();
    const key = deckGridKey();
    if (slot && deckIsPlayable(slot.ids, key)) startGame('decks');
    else openDeckPicker();
}

function refreshMenuDeck() {
    const title = document.getElementById('menu-play-title');
    const caption = document.getElementById('menu-play-caption');
    const kicker = document.getElementById('menu-play-kicker');
    const tile = document.getElementById('menu-play-deck');
    if (!title || !caption || !kicker || !tile) return;
    const key = deckGridKey();
    const slot = currentBuiltSlot();
    const size = deckSizeFor(key);
    const ready = !!(slot && deckIsPlayable(slot.ids, key));
    kicker.textContent = deckGridWord(key);
    tile.classList.toggle('is-ready', ready);
    if (ready) {
        title.textContent = slot.name || 'Your deck';
        caption.textContent = 'Play this deck';
        return;
    }
    title.textContent = 'Build a deck';
    const count = slot && slot.ids ? slot.ids.length : 0;
    caption.textContent = count
        ? `${count} of ${size} cards. Finish it to play.`
        : `${size} cards. ${emberBudgetFor(key)} embers.`;
}

function startGame(mode) {
    sfx.click(); hideTooltip(); activeMode = mode;
    clearAiPlayTimer();
    hideTurnBanner();
    clearShareHash();
    hideModals(['main-menu-modal', 'draft-modal', 'deck-modal', 'expanded-rules-modal', 'compendium-modal', 'options-modal', 'gameover-modal', 'battle-log-modal', 'league-modal', 'tutorial-modal', 'changelog-modal']);

    deckMatchLabel = '';
    if (mode === 'random') {
        applyGridSize(preferredGridSize);
        resetTable(); gameState = 'playing';
        const shuffled = [...masterCards].sort(() => Math.random() - 0.5);
        const n = matchHandSize();

        playerHand = shuffled.slice(0, n).map(c => cloneCard(c, {owner: 'blue'}));

        aiHand = shuffled.slice(n, n * 2).map(c => cloneCard(c, {owner: 'red'}));

        beginMatch();
    } else if (mode === 'draft') {
        startDraftMode();
    } else if (mode === 'decks') {
        startDeckMatch();
    }
}

function withMatchup(msg) {
    if (isLeagueMatch()) {
        const opp = leaguePlayer(leagueMatch.oppId);
        return `You vs ${opp.name}. ${msg}`;
    }
    if (activeMode !== 'decks' || !deckMatchLabel) return msg;
    return `${deckMatchLabel}. ${msg}`;
}

let deckTribeFilters = [];
let deckCostFilter = 'all';
let deckSortKey = 'name';
let deckSortDesc = false;

function deckGridKey() {
    return String(preferredGridSize);
}

function builtSlotAt(key, index) {
    const book = builtDecks.grids[key];
    return book ? book[index] : null;
}

function currentBuiltSlot() {
    const key = deckGridKey();
    return builtSlotAt(key, builtDecks.active[key] || 0);
}

function ensureBuiltSlot() {
    const key = deckGridKey();
    const index = builtDecks.active[key] || 0;
    if (!builtDecks.grids[key][index]) {
        builtDecks.grids[key][index] = {name: `Deck ${index + 1}`, ids: []};
    }
    const slot = builtDecks.grids[key][index];
    if (!slot.name) slot.name = `Deck ${index + 1}`;
    return slot;
}

function commitDeckName() {
    const input = document.getElementById('deck-name');
    const slot = currentBuiltSlot();
    if (!input || !slot) return;
    const index = builtDecks.active[deckGridKey()] || 0;
    const name = input.value.trim().slice(0, 24);
    slot.name = name || `Deck ${index + 1}`;
}

function deckFaceHTML(card) {
    const shoulders = deckGridKey() === 'hex' ? staticShoulderHTML(card) : '';
    const cost = emberCostOf(card);
    return `
        <span class="ember-cost">${cost}</span>
        ${card.ability ? `<span class="ability-badge">${card.ability.icon}</span>` : ''}
        <span class="stat-top">${formatStat(card.baseStats[0])}</span>
        <span class="stat-right">${formatStat(card.baseStats[1])}</span>
        <span class="stat-bottom">${formatStat(card.baseStats[2])}</span>
        <span class="stat-left">${formatStat(card.baseStats[3])}</span>
        ${shoulders}
        <span class="card-emoji">${card.emoji}</span>
        <span class="card-name">${card.name}</span>
    `;
}

function deckCardTip(card) {
    const cost = emberCostOf(card);
    const price = cost === 0 ? 'Free.' : `Costs ${cost} ember${cost === 1 ? '' : 's'}.`;
    return `${abilityTip(card, {withId: true})} ${price}`;
}

function paintDeckControls() {
    const tribes = document.getElementById('deck-tribe-filters');
    const costs = document.getElementById('deck-cost-filters');
    if (tribes && !tribes.dataset.ready) {
        TRIBES.forEach(tribe => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'deck-mech';
            btn.dataset.tribe = tribe.id;
            btn.setAttribute('aria-label', tribe.name);
            const glyph = document.createElement('span');
            glyph.className = 'deck-mech-glyph';
            glyph.textContent = tribe.icon;
            glyph.setAttribute('aria-hidden', 'true');
            btn.appendChild(glyph);
            addTooltipListeners(btn, tribe.name);
            btn.addEventListener('click', () => toggleDeckMechanic(tribe.id));
            tribes.appendChild(btn);
        });
        paintCardFaces(tribes);
        tribes.dataset.ready = '1';
    }
    if (costs && !costs.dataset.ready) {
        [{id: 'all', label: 'Any'}, {id: '0', label: '0'}, {id: '1', label: '1'}, {id: '2', label: '2'}, {id: '3', label: '3'}, {id: '4', label: '4'}].forEach(choice => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'deck-cost-chip' + (choice.id === 'all' ? ' any' : '');
            btn.dataset.cost = choice.id;
            btn.textContent = choice.label;
            btn.setAttribute('aria-label', choice.id === 'all' ? 'Any ember cost' : `${choice.label} embers`);
            btn.addEventListener('click', () => setDeckCost(choice.id));
            costs.appendChild(btn);
        });
        costs.dataset.ready = '1';
    }
    if (tribes) {
        tribes.querySelectorAll('[data-tribe]').forEach(btn => {
            const on = deckTribeFilters.includes(btn.dataset.tribe);
            btn.classList.toggle('selected', on);
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }
    if (costs) {
        costs.querySelectorAll('[data-cost]').forEach(btn => {
            const on = btn.dataset.cost === deckCostFilter;
            btn.classList.toggle('selected', on);
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }
    const sortLabel = document.getElementById('deck-sort-label');
    if (sortLabel) sortLabel.textContent = {name: 'Name', cost: 'Ember', tribe: 'Mechanic'}[deckSortKey] || 'Name';
    document.querySelectorAll('#deck-sort-list [data-sort]').forEach(btn => {
        const on = btn.dataset.sort === deckSortKey;
        btn.classList.toggle('selected', on);
        btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    const dir = document.getElementById('deck-sort-dir');
    if (dir) {
        dir.classList.toggle('desc', deckSortDesc);
        dir.setAttribute('aria-pressed', deckSortDesc ? 'true' : 'false');
        dir.setAttribute('aria-label', deckSortDesc ? 'Descending. Switch to ascending.' : 'Ascending. Switch to descending.');
        dir.title = deckSortDesc ? 'Descending' : 'Ascending';
    }
}

function deckCollectionList() {
    const tribeOrder = {};
    TRIBES.forEach((tribe, index) => { tribeOrder[tribe.id] = index; });
    const cards = masterCards.filter(card => {
        if (deckTribeFilters.length && (!card.ability || !deckTribeFilters.includes(card.ability.type))) return false;
        if (deckCostFilter !== 'all' && String(emberCostOf(card)) !== deckCostFilter) return false;
        return true;
    });
    const dir = deckSortDesc ? -1 : 1;
    cards.sort((a, b) => {
        let cmp = 0;
        if (deckSortKey === 'cost') cmp = emberCostOf(a) - emberCostOf(b);
        else if (deckSortKey === 'tribe') cmp = tribeOrder[a.ability.type] - tribeOrder[b.ability.type];
        if (!cmp) cmp = a.name.localeCompare(b.name);
        return cmp * dir;
    });
    return cards;
}

function paintDeckSlotChips() {
    const el = document.getElementById('deck-slots');
    if (!el) return;
    const key = deckGridKey();
    const active = builtDecks.active[key] || 0;
    el.innerHTML = '';
    for (let i = 0; i < EMBER_DECK_SLOTS; i++) {
        const slot = builtSlotAt(key, i);
        const btn = document.createElement('button');
        btn.type = 'button';
        const ready = !!(slot && deckIsPlayable(slot.ids, key));
        btn.className = 'deck-slot-chip' + (i === active ? ' selected' : '') + (ready ? ' ready' : '');
        btn.setAttribute('aria-pressed', i === active ? 'true' : 'false');
        const num = document.createElement('span');
        num.className = 'deck-slot-num';
        num.textContent = String(i + 1);
        const name = document.createElement('span');
        name.className = 'deck-slot-name';
        name.textContent = slot && slot.name ? slot.name : `Deck ${i + 1}`;
        btn.appendChild(num);
        btn.appendChild(name);
        btn.addEventListener('click', () => selectDeckSlot(i));
        el.appendChild(btn);
    }
}

function paintDeckTray() {
    const tray = document.getElementById('deck-tray');
    if (!tray) return;
    const key = deckGridKey();
    const size = deckSizeFor(key);
    const slot = currentBuiltSlot();
    const ids = slot ? slot.ids : [];
    tray.innerHTML = '';
    for (let i = 0; i < size; i++) {
        const id = ids[i];
        if (!id) {
            const empty = document.createElement('div');
            empty.className = 'deck-card deck-card-empty' + (deckGridKey() === 'hex' ? ' has-hex' : '');
            empty.setAttribute('aria-hidden', 'true');
            tray.appendChild(empty);
            continue;
        }
        const card = masterCards.find(c => c.id === id);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'deck-card' + (deckGridKey() === 'hex' ? ' has-hex' : '');
        btn.innerHTML = deckFaceHTML(card);
        btn.title = `Take ${card.name} out`;
        btn.setAttribute('aria-label', `Take ${card.name} out`);
        btn.addEventListener('click', () => removeDeckCard(id));
        tray.appendChild(btn);
    }
    paintCardFaces(tray);
}

function paintDeckCollection() {
    const grid = document.getElementById('deck-collection');
    if (!grid) return;
    const keepScroll = grid.scrollTop;
    const slot = currentBuiltSlot();
    const ids = slot ? slot.ids : [];
    const cards = deckCollectionList();
    grid.innerHTML = '';
    cards.forEach(card => {
        const inDeck = ids.includes(card.id);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'deck-card' + (deckGridKey() === 'hex' ? ' has-hex' : '') + (inDeck ? ' in-deck' : '');
        btn.innerHTML = deckFaceHTML(card);
        const tip = deckCardTip(card);
        btn.title = tip;
        btn.setAttribute('aria-label', inDeck ? `${card.name}, in this deck, ${emberCostOf(card)} embers` : `${card.name}, ${emberCostOf(card)} embers`);
        addTooltipListeners(btn, tip);
        btn.addEventListener('click', () => toggleDeckCard(card.id));
        grid.appendChild(btn);
    });
    if (!cards.length) {
        const empty = document.createElement('p');
        empty.className = 'deck-empty';
        empty.textContent = 'No cards match those filters.';
        grid.appendChild(empty);
    }
    paintCardFaces(grid);
    grid.scrollTop = keepScroll;
    const count = document.getElementById('deck-filter-count');
    if (count) {
        const noun = cards.length === 1 ? '1 card' : `${cards.length} cards`;
        const names = TRIBES.filter(tribe => deckTribeFilters.includes(tribe.id)).map(tribe => tribe.name);
        count.textContent = names.length ? `${noun} · ${names.join(', ')}` : noun;
    }
}

function paintDeckMeter() {
    const key = deckGridKey();
    const size = deckSizeFor(key);
    const budget = emberBudgetFor(key);
    const slot = currentBuiltSlot();
    const ids = slot ? slot.ids : [];
    const spent = deckEmberSpent(ids);
    const over = spent > budget;
    const label = document.getElementById('deck-meter-label');
    const fill = document.getElementById('deck-meter-fill');
    if (label) label.textContent = `${spent} / ${budget}`;
    if (fill) {
        const pct = budget ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
        fill.style.width = `${pct}%`;
        fill.classList.toggle('over', over);
    }
    const ready = deckIsPlayable(ids, key);
    const hint = document.getElementById('deck-hint');
    if (!hint) return;
    if (ready) hint.textContent = 'Ready. Save, then play it from the menu.';
    else if (over) hint.textContent = `Over the cap by ${spent - budget}. Take a card out before this deck can play.`;
    else hint.textContent = `${ids.length} of ${size} cards. ${budget - spent} embers left.`;
}

function paintDeckBuilder() {
    paintDeckControls();
    paintDeckCode();
    paintGridChoices();
    const input = document.getElementById('deck-name');
    const slot = currentBuiltSlot();
    const index = builtDecks.active[deckGridKey()] || 0;
    if (input && document.activeElement !== input) input.value = slot && slot.name ? slot.name : `Deck ${index + 1}`;
    paintDeckSlotChips();
    paintDeckTray();
    paintDeckCollection();
    paintDeckMeter();
}

function selectDeckSlot(index) {
    sfx.click();
    commitDeckName();
    saveBuiltDecks();
    builtDecks.active[deckGridKey()] = index;
    saveBuiltDecks();
    paintDeckBuilder();
}

function setDeckGrid(val) {
    commitDeckName();
    saveBuiltDecks();
    updatePreferredGrid(val);
    paintDeckBuilder();
}

function toggleDeckMechanic(id) {
    sfx.click();
    const index = deckTribeFilters.indexOf(id);
    if (index >= 0) deckTribeFilters.splice(index, 1);
    else deckTribeFilters.push(id);
    const grid = document.getElementById('deck-collection');
    if (grid) grid.scrollTop = 0;
    paintDeckControls();
    paintDeckCollection();
}

function setDeckCost(id) {
    sfx.click();
    deckCostFilter = id || 'all';
    const grid = document.getElementById('deck-collection');
    if (grid) grid.scrollTop = 0;
    paintDeckControls();
    paintDeckCollection();
}

function setDeckSort(val) {
    deckSortKey = val || 'name';
    const grid = document.getElementById('deck-collection');
    if (grid) grid.scrollTop = 0;
    paintDeckCollection();
}

function toggleDeckSortMenu() {
    const list = document.getElementById('deck-sort-list');
    const btn = document.getElementById('deck-sort');
    if (!list || !btn) return;
    const willOpen = list.hidden;
    list.hidden = !willOpen;
    btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
}

function closeDeckSortMenu() {
    const list = document.getElementById('deck-sort-list');
    const btn = document.getElementById('deck-sort');
    if (list) list.hidden = true;
    if (btn) btn.setAttribute('aria-expanded', 'false');
}

function chooseDeckSort(val) {
    sfx.click();
    closeDeckSortMenu();
    setDeckSort(val);
    paintDeckControls();
}

function encodeDeckCode(gridKey, ids) {
    const list = ids || [];
    if (!list.length || list.length > deckSizeFor(gridKey)) return '';
    const nums = idsToNums(list);
    if (nums.some(n => !n || n < 1 || n > masterCards.length)) return '';
    if (new Set(nums).size !== nums.length) return '';
    const sizeCh = gridKey === 'hex' ? 'H' : String(gridKey);
    return `ED1${sizeCh}${nums.map(n => String(n).padStart(2, '0')).join('')}`;
}

function decodeDeckCode(raw) {
    const code = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const match = code.match(/^ED1([345H])((?:\d{2})+)$/);
    if (!match) return null;
    const gridKey = match[1] === 'H' ? 'hex' : match[1];
    const digits = match[2];
    const nums = [];
    for (let i = 0; i < digits.length; i += 2) nums.push(parseInt(digits.slice(i, i + 2), 10));
    if (!nums.length || nums.length > deckSizeFor(gridKey)) return null;
    if (nums.some(n => n < 1 || n > masterCards.length)) return null;
    if (new Set(nums).size !== nums.length) return null;
    const ids = numsToIds(nums);
    if (ids.some(id => !masterCards.some(card => card.id === id))) return null;
    return {gridKey, ids};
}

function deckGridWord(key) {
    if (key === 'hex') return 'Honeycomb';
    return `${key}×${key}`;
}

function setDeckCodeNote(msg) {
    const note = document.getElementById('deck-code-note');
    if (note) note.textContent = msg || '';
}

function paintDeckCode() {
    const input = document.getElementById('deck-code');
    if (!input || document.activeElement === input) return;
    const slot = currentBuiltSlot();
    const ids = slot && slot.ids ? slot.ids : [];
    input.value = ids.length ? encodeDeckCode(deckGridKey(), ids) : '';
    setDeckCodeNote('');
}

async function copyDeckCode() {
    sfx.click();
    const slot = currentBuiltSlot();
    const ids = slot && slot.ids ? slot.ids : [];
    const code = encodeDeckCode(deckGridKey(), ids);
    const btn = document.getElementById('deck-code-copy');
    if (!code) {
        setDeckCodeNote('Add a card before copying a code.');
        return;
    }
    const input = document.getElementById('deck-code');
    if (input) input.value = code;
    const ok = await copyText(code);
    if (btn) {
        btn.textContent = ok ? 'Copied' : 'Copy failed';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1400);
    }
    setDeckCodeNote(ok ? 'Code copied.' : 'Select the code and copy it.');
}

function loadDeckCode() {
    sfx.click();
    const input = document.getElementById('deck-code');
    const decoded = decodeDeckCode(input ? input.value : '');
    if (!decoded) {
        setDeckCodeNote('That deck code is not valid.');
        return;
    }
    commitDeckName();
    saveBuiltDecks();
    if (deckGridKey() !== decoded.gridKey) {
        preferredGridSize = normalizeGridChoice(decoded.gridKey);
        localStorage.setItem('ember_grid_size', String(preferredGridSize));
        refreshGridSizeDesc();
        if (gameState === 'menu') applyGridSize(preferredGridSize);
    }
    const key = deckGridKey();
    const index = builtDecks.active[key] || 0;
    const prev = builtSlotAt(key, index);
    builtDecks.grids[key][index] = {
        name: (prev && prev.name) || `Deck ${index + 1}`,
        ids: decoded.ids.slice()
    };
    saveBuiltDecks();
    paintDeckBuilder();
    setDeckCodeNote(`Loaded ${decoded.ids.length} for ${deckGridWord(key)}.`);
}

function toggleDeckSortDir() {
    sfx.click();
    deckSortDesc = !deckSortDesc;
    const grid = document.getElementById('deck-collection');
    if (grid) grid.scrollTop = 0;
    paintDeckControls();
    paintDeckCollection();
}

function onDeckNameInput(el) {
    const slot = ensureBuiltSlot();
    slot.name = el.value.slice(0, 24);
    saveBuiltDecks();
    paintDeckSlotChips();
}

function toggleDeckCard(id) {
    sfx.click();
    const key = deckGridKey();
    const slot = ensureBuiltSlot();
    const index = slot.ids.indexOf(id);
    if (index >= 0) slot.ids.splice(index, 1);
    else if (slot.ids.length >= deckSizeFor(key)) {
        const hint = document.getElementById('deck-hint');
        if (hint) hint.textContent = 'That deck is full. Tap a card in the tray to take it out.';
        return;
    } else slot.ids.push(id);
    saveBuiltDecks();
    paintDeckSlotChips();
    paintDeckTray();
    paintDeckCollection();
    paintDeckMeter();
}

function removeDeckCard(id) {
    const slot = currentBuiltSlot();
    if (!slot) return;
    sfx.click();
    const index = slot.ids.indexOf(id);
    if (index >= 0) slot.ids.splice(index, 1);
    saveBuiltDecks();
    paintDeckSlotChips();
    paintDeckTray();
    paintDeckCollection();
    paintDeckMeter();
}

function fillRandomDeck() {
    sfx.click();
    const key = deckGridKey();
    const index = builtDecks.active[key] || 0;
    const prev = builtSlotAt(key, index);
    builtDecks.grids[key][index] = {
        name: (prev && prev.name) || `Deck ${index + 1}`,
        ids: randomEmberDeck(key)
    };
    saveBuiltDecks();
    paintDeckBuilder();
}

function clearBuiltDeck() {
    sfx.click();
    const key = deckGridKey();
    const index = builtDecks.active[key] || 0;
    const prev = builtSlotAt(key, index);
    builtDecks.grids[key][index] = {
        name: (prev && prev.name) || `Deck ${index + 1}`,
        ids: []
    };
    saveBuiltDecks();
    paintDeckBuilder();
}

function openDeckPicker() {
    sfx.click();
    hideTooltip();
    hideModal('main-menu-modal');
    paintDeckBuilder();
    document.getElementById('deck-modal').classList.remove('hidden');
}

function cancelDeckPicker() {
    saveDeckPicker();
}

function saveDeckPicker() {
    commitDeckName();
    saveBuiltDecks();
    hideModal('deck-modal');
    showModeMenu();
}

function startDeckMatch() {
    const key = deckGridKey();
    const slot = currentBuiltSlot();
    const ids = slot && slot.ids ? slot.ids.slice() : [];
    applyGridSize(key === 'hex' ? 'hex' : Number(key));
    if (!deckIsPlayable(ids, key)) {
        logAction('That deck is not ready.');
        showModeMenu();
        return;
    }
    const aiIds = randomEmberDeck(key);
    if (aiIds.length !== ids.length) {
        logAction('Could not build a computer deck.');
        showModeMenu();
        return;
    }
    resetTable();
    gameState = 'playing';
    deckMatchLabel = `${(slot && slot.name) || 'Your deck'} vs Random deck`;
    playerHand = ids.map(id => cloneForOwner(masterCards.find(c => c.id === id), 'blue'));
    aiHand = aiIds.map(id => cloneForOwner(masterCards.find(c => c.id === id), 'red'));
    beginMatch();
}

function startCurrentModeAgain() {
    if (gameoverClickLock) return;
    if (isLeagueMatch()) { openLeagueHubFromGameover(); return; }
    unlockGameoverClicks();
    sfx.click(); hideTooltip(); startGame(activeMode);
}

function snapshotMatch(first) {
    lastMatch = {
        mode: activeMode,
        ruleset: (isLeagueMatch() && league) ? league.ruleset : currentRuleset,
        leftover: leftoverThisMatch,
        classicTies: classicTiesThisMatch,
        gridSize,
        playerIds: playerHand.concat(playerDeck).map(c => c.id),
        aiIds: aiHand.concat(aiDeck).map(c => c.id),
        first
    };
}

function idsToNums(ids) {
    return ids.map(id => {
        const n = parseInt(String(id).replace(/^BS-/i, ''), 10);
        return n;
    });
}

function numsToIds(nums) {
    return nums.map(n => `BS-${String(n).padStart(2, '0')}`);
}

function encodeMatchCode(match) {
    if (!match || match.mode === 'league' || match.mode === 'tutorial' || !match.playerIds || !match.aiIds) return '';
    const size = GRID_PRESETS[match.gridSize] ? match.gridSize : 3;
    const hand = GRID_PRESETS[size].hand;
    if (match.playerIds.length !== hand || match.aiIds.length !== hand) return '';
    const nums = idsToNums(match.playerIds.concat(match.aiIds));
    if (nums.some(n => !n || n < 1 || n > masterCards.length)) return '';
    const modeCh = match.mode === 'draft' ? 'D' : match.mode === 'decks' ? 'T' : 'R';
    const ruleCh = match.ruleset === 'classic' ? 'C' : 'E';
    const firstCh = match.first === 'ai' ? 'A' : 'P';
    if (size === 3) return `EG1${modeCh}${ruleCh}${firstCh}${nums.map(n => String(n).padStart(2, '0')).join('')}`;
    const sizeCh = size === 'hex' ? 'H' : String(size);
    return `EG2${modeCh}${ruleCh}${firstCh}${sizeCh}${nums.map(n => String(n).padStart(2, '0')).join('')}`;
}

function extractMatchCode(raw) {
    const text = String(raw || '').trim();
    if (!text) return '';
    try {
        const u = new URL(text);
        const q = u.searchParams.get('m');
        if (q) return q.trim();
        const hm = (u.hash || '').match(/m=([^&]+)/i);
        if (hm) return decodeURIComponent(hm[1]).trim();
    } catch (e) {}
    const found2 = text.match(/EG2[RDTrdt][ECec][PApa][45H]\d{32,}/i);
    if (found2) return found2[0];
    const found = text.match(/EG1[RDTrdt][ECec][PApa]\d{20}/);
    if (found) return found[0];
    return text;
}

function decodeMatchCode(raw) {
    const code = extractMatchCode(raw).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const m2 = code.match(/^EG2([RDT])([EC])([PA])([45H])((?:\d{2})+)$/);
    if (m2) {
        const size = m2[4] === 'H' ? 'hex' : parseInt(m2[4], 10);
        if (!GRID_PRESETS[size]) return null;
        const hand = GRID_PRESETS[size].hand;
        const digits = m2[5];
        if (digits.length !== hand * 4) return null;
        const nums = [];
        for (let i = 0; i < digits.length; i += 2) nums.push(parseInt(digits.slice(i, i + 2), 10));
        if (nums.some(n => n < 1 || n > masterCards.length)) return null;
        const ids = numsToIds(nums);
        if (ids.some(id => !masterCards.some(c => c.id === id))) return null;
        return {
            mode: m2[1] === 'D' ? 'draft' : m2[1] === 'T' ? 'decks' : 'random',
            ruleset: m2[2] === 'C' ? 'classic' : 'ember',
            first: m2[3] === 'A' ? 'ai' : 'player',
            gridSize: size,
            playerIds: ids.slice(0, hand),
            aiIds: ids.slice(hand)
        };
    }
    const m = code.match(/^EG1([RDT])([EC])([PA])((?:\d{2}){10})$/);
    if (!m) return null;
    const mode = m[1] === 'D' ? 'draft' : m[1] === 'T' ? 'decks' : 'random';
    const ruleset = m[2] === 'C' ? 'classic' : 'ember';
    const first = m[3] === 'A' ? 'ai' : 'player';
    const nums = [];
    for (let i = 0; i < 20; i += 2) nums.push(parseInt(m[4].slice(i, i + 2), 10));
    if (nums.some(n => n < 1 || n > masterCards.length)) return null;
    const ids = numsToIds(nums);
    if (ids.some(id => !masterCards.some(c => c.id === id))) return null;
    return {
        mode,
        ruleset,
        first,
        gridSize: 3,
        playerIds: ids.slice(0, 5),
        aiIds: ids.slice(5, 10)
    };
}

function matchShareUrl(code) {
    const url = new URL(location.href);
    url.searchParams.delete('m');
    url.hash = code ? `m=${code}` : '';
    return url.toString();
}

function writeShareHash(code) {
    if (!code) return;
    const next = matchShareUrl(code);
    if (next !== location.href) history.replaceState(null, '', next);
}

function clearShareHash() {
    const url = new URL(location.href);
    const hadQuery = url.searchParams.has('m');
    url.searchParams.delete('m');
    url.hash = '';
    const next = url.pathname + url.search;
    if (hadQuery || location.hash) history.replaceState(null, '', next);
}

function pendingShareCode() {
    try {
        const q = new URLSearchParams(location.search).get('m');
        if (q) return q;
    } catch (e) {}
    const hm = (location.hash || '').match(/[#&]m=([^&]+)/i);
    return hm ? decodeURIComponent(hm[1]) : '';
}

function setMatchCodeError(msg) {
    const el = document.getElementById('match-code-error');
    if (!el) return;
    if (!msg) {
        el.hidden = true;
        el.textContent = '';
        return;
    }
    el.hidden = false;
    el.textContent = msg;
}

function openMatchCodeEntry(msg) {
    const box = document.getElementById('match-code-box');
    if (box) box.open = true;
    setMatchCodeError(msg || '');
    const input = document.getElementById('match-code-input');
    if (input) input.focus();
}

function playSharedMatch(decoded) {
    skipCoachOnce = true;
    hideTooltip();
    clearAiPlayTimer();
    hideTurnBanner();
    hideModals(['main-menu-modal', 'draft-modal', 'deck-modal', 'stats-modal', 'expanded-rules-modal', 'compendium-modal', 'options-modal', 'gameover-modal', 'battle-log-modal', 'league-modal', 'tutorial-modal', 'changelog-modal']);
    currentRuleset = decoded.ruleset;
    const sel = document.getElementById('ruleset-select');
    if (sel) sel.value = currentRuleset;
    refreshRulesetDesc();
    activeMode = decoded.mode;
    applyGridSize(decoded.gridSize || 3);
    deckMatchLabel = decoded.mode === 'decks' ? 'Shared decks' : '';
    resetTable();
    gameState = 'playing';
    handsFromIds(decoded.playerIds, decoded.aiIds);
    if (playerHand.some(c => !c) || aiHand.some(c => !c)) {
        skipCoachOnce = false;
        setMatchCodeError('That match code is missing cards.');
        showModeMenu();
        return false;
    }
    const code = encodeMatchCode({...decoded});
    writeShareHash(code);
    beginMatch(decoded.first, 'share');
    return true;
}

function submitMatchCode(e) {
    if (e) e.preventDefault();
    sfx.click();
    const input = document.getElementById('match-code-input');
    const decoded = decodeMatchCode(input ? input.value : '');
    if (!decoded) {
        openMatchCodeEntry('That match code is not valid.');
        return;
    }
    setMatchCodeError('');
    playSharedMatch(decoded);
}

function bootSharedMatch() {
    const raw = pendingShareCode();
    if (!raw) return false;
    const decoded = decodeMatchCode(raw);
    if (!decoded) {
        showModeMenu();
        openMatchCodeEntry('That match code is not valid.');
        return true;
    }
    playSharedMatch(decoded);
    return true;
}

function shareButtons() {
    return ['match-share-btn', 'board-share-btn']
        .map(id => document.getElementById(id))
        .filter(Boolean);
}

function syncShareButton() {
    const code = encodeMatchCode(lastMatch);
    shareButtons().forEach(btn => {
        btn.hidden = !code;
        btn.textContent = 'Share';
    });
}

async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (e) {}
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
}

async function shareCurrentMatch() {
    if (gameoverClickLock) return;
    const code = encodeMatchCode(lastMatch);
    if (!code) return;
    sfx.click();
    // Copy only. navigator.share() can kill Chromium embeds
    // (RESULT_CODE_KILLED_BAD_MESSAGE) and try/catch cannot catch that.
    const ok = await copyText(code);
    shareButtons().forEach(btn => {
        btn.textContent = ok ? 'Copied' : 'Copy failed';
        setTimeout(() => { btn.textContent = 'Share'; }, 1400);
    });
}

function handsFromIds(playerIds, aiIds) {
    playerHand = playerIds.map(id => cloneForOwner(masterCards.find(c => c.id === id), 'blue'));
    aiHand = aiIds.map(id => cloneForOwner(masterCards.find(c => c.id === id), 'red'));
}

function rematchSwapFirst() {
    if (gameoverClickLock) return;
    if (isLeagueMatch()) { openLeagueHubFromGameover(); return; }
    if (!lastMatch) {startGame(activeMode); return;}
    unlockGameoverClicks();
    sfx.click(); hideTooltip();
    hideModal('gameover-modal');
    hideModal('main-menu-modal');
    applyGridSize(lastMatch.gridSize || 3);
    resetTable(); gameState = 'playing';
    handsFromIds(lastMatch.playerIds, lastMatch.aiIds);
    beginMatch(lastMatch.first === 'player' ? 'ai' : 'player', 'rematch');
}

function viewFinalBoard() {
    if (gameoverClickLock) return;
    unlockGameoverClicks();
    sfx.click();
    hideModal('gameover-modal');
    statusMsg.textContent = "Final grid. Replay the same hands, or deal new ones.";
    if (isLeagueMatch()) statusMsg.textContent = "Final grid. Open the league table for standings.";
    if (activeMode === 'tutorial') statusMsg.textContent = "Final grid. Replay this lesson, or pick another.";
    render();
}

function onGameoverBackdrop(e) {
    if (e.target.id === 'gameover-modal') viewFinalBoard();
}

function closeGameoverToMenu() {
    if (gameoverClickLock) return;
    unlockGameoverClicks();
    showModeMenu();
}

function lockGameoverClicks() {
    gameoverClickLock = true;
    swallowClick = false;
    swallowForIndex = null;
    window.removeEventListener('pointerdown', unlockGameoverClicks, true);
    window.addEventListener('pointerdown', unlockGameoverClicks, true);
    clearTimeout(gameoverUnlockTimer);
    gameoverUnlockTimer = setTimeout(unlockGameoverClicks, 400);
}

function unlockGameoverClicks() {
    gameoverClickLock = false;
    window.removeEventListener('pointerdown', unlockGameoverClicks, true);
    clearTimeout(gameoverUnlockTimer);
    gameoverUnlockTimer = null;
}

function beginMatch(first, origin) {
    document.body.classList.remove('menu-open');
    clearAiPlayTimer();
    hideTurnBanner();
    if (origin === 'tutorial') {
        document.body.classList.add('tutorial-live');
        leftoverThisMatch = false;
        classicTiesThisMatch = false;
        turn = 'player';
        snapshotMatch(turn);
        lastBlueScore = null; lastRedScore = null;
        resetActionLog();
        const lesson = tutorialLesson();
        statusMsg.textContent = lesson ? lesson.title : 'Tutorial';
        logAction(lesson ? lesson.log : 'Tutorial.');
        recalculateDynamicStats();
        render();
        tutorialEnter();
        return;
    }
    leftoverThisMatch = (origin === 'rematch' && lastMatch && typeof lastMatch.leftover === 'boolean')
        ? lastMatch.leftover
        : (origin === 'league' && league ? league.leftover : leftoverScores);
    const matchRuleset = (origin === 'league' && league)
        ? league.ruleset
        : (origin === 'rematch' && lastMatch && lastMatch.ruleset)
            ? lastMatch.ruleset
            : currentRuleset;
    const tiesOpt = (origin === 'rematch' && lastMatch && typeof lastMatch.classicTies === 'boolean')
        ? lastMatch.classicTies
        : (origin === 'league' && league ? !!league.classicTies : classicTies);
    classicTiesThisMatch = matchRuleset === 'classic' && !!tiesOpt;
    turn = first || (Math.random() < 0.5 ? 'player' : 'ai');
    openHandsFromDeal();
    snapshotMatch(turn);
    lastBlueScore = null; lastRedScore = null;
    resetActionLog();
    if (origin === 'rematch') {
        statusMsg.textContent = withMatchup(turn === 'player' ? "Same hands. You go first." : "Same hands. AI plays first.");
        logAction(turn === 'player' ? "Rematch - you go first." : "Rematch - AI goes first.");
    } else if (origin === 'league' && leagueMatch) {
        const opp = leaguePlayer(leagueMatch.oppId);
        const fx = league.fixtures[leagueMatch.fixtureIndex];
        const week = fx.week;
        const gameN = (fx.games || []).length + 1;
        statusMsg.textContent = turn === 'player'
            ? `Week ${week} game ${gameN} vs ${opp.name}. Your turn - play a card.`
            : `Week ${week} game ${gameN} vs ${opp.name}. ${opp.name} plays first.`;
        logAction(`League week ${week} game ${gameN} — You vs ${opp.name}.`);
    } else {
        const vs = activeMode === 'decks' ? deckMatchLabel : '';
        const shared = origin === 'share' ? 'Shared match. ' : '';
        statusMsg.textContent = vs
            ? (turn === 'player' ? `${vs}. Your turn - play a card.` : `${vs}. AI plays first.`)
            : (turn === 'player' ? `${shared}Hands dealt. Your turn - play a card.` : `${shared}Hands dealt. AI plays first.`);
        const n = matchHandSize();
        const words = n === 5 ? 'five' : n === 8 ? 'eight' : n === 10 ? 'ten' : 'thirteen';
        logAction(vs || (origin === 'share'
            ? (n === 5 ? `Shared hands of ${words}.` : `Shared deal of ${words}. Five in hand.`)
            : (n === 5 ? `Hands of ${words}.` : `Dealt ${words} each. Five in hand.`)));
    }
    recalculateDynamicStats(); render();
    maybeStartCoach();
    if (!coach.active || coach.step === 'wait') showTurnBanner(turn);
    if (turn === 'ai') scheduleAiTurn(700);
}

function positionBoardToast(el) {
    const grid = document.getElementById('board-grid');
    if (!grid || !el) return;
    const rect = grid.getBoundingClientRect();
    el.style.top = `${Math.round(rect.top + rect.height * 0.38)}px`;
}

function pulseTurnIndicator() {
    const turnInd = document.getElementById('turn-indicator');
    if (!turnInd) return;
    turnInd.classList.remove('pulse');
    void turnInd.offsetWidth;
    turnInd.classList.add('pulse');
}

function showTurnBanner(whose) {
    const el = document.getElementById('turn-banner');
    if (!el) return;
    positionBoardToast(el);
    el.textContent = whose === 'player'
        ? 'YOUR TURN'
        : (isLeagueMatch() ? `${leaguePlayer(leagueMatch.oppId).name.toUpperCase()} TURN` : 'AI TURN');
    el.className = `turn-banner ${whose}`;
    void el.offsetWidth;
    el.classList.add('show');
    pulseTurnIndicator();
}

function scheduleAiTurn(delay) {
    clearAiPlayTimer();
    statusMsg.textContent = isLeagueMatch()
        ? withMatchup(`${leaguePlayer(leagueMatch.oppId).name} is thinking...`)
        : withMatchup("AI is thinking...");
    aiPlayTimer = setTimeout(() => {
        aiPlayTimer = null;
        aiTurn();
    }, delay);
}

const TUTORIALS = [
    {
        title: 'Capture',
        log: 'This match is captures. Abilities stay off.',
        ruleset: 'classic',
        blurb: 'How your four numbers fight, why a match does nothing, and how you win a full board.',
        player: ['Dragon', 'Vampire', 'Celestial', 'Paladin', 'T-Rex'],
        ai: ['Frog', 'Zombie', 'Lizard', 'Imp', 'Owl'],
        steps: [
            {who: 'note', text: 'Abilities stay off. Only the four numbers matter: top, right, bottom, left. Play the highlighted card on the highlighted cell. Their deck is weak, and this match is not saved to your record.'},
            {who: 'player', card: 'Dragon', cell: 4, before: 'Pick Dragon and play it in the center. Nothing sits next to it yet, so nobody fights.', after: 'Your Dragon holds the middle. Each side fights the one card that shares that edge. A diagonal does not fight.'},
            {who: 'ai', card: 'Frog', cell: 1, after: 'They put Frog above your Dragon. Frog\'s bottom is 5. Your top is 9. 5 does not beat 9, so you keep Dragon.'},
            {who: 'player', card: 'Vampire', cell: 2, before: 'Pick Vampire and play it to the right of Frog. Your left is 6. Their right is 4.', after: 'Your 6 beats their 4. Frog turns blue. That is a capture: their card is yours, and it scores for you.'},
            {who: 'log', before: 'Open the Battle log under the board. Every play from this match is written there.', after: 'Names wear the color they had on that play. A capture stays in the list, so you can reread a fight. Continue when you have seen it.'},
            {who: 'ai', card: 'Zombie', cell: 3, after: 'They put Zombie left of your Dragon. Both touching numbers are 2. A match does nothing. You need a higher number.'},
            {who: 'player', card: 'Celestial', cell: 0, before: 'Pick Celestial. The A on top means 10. Play it above Zombie, and watch which side actually touches.', after: 'Your bottom is 3. Their top is 4. The 10 is on top, and that side is not touching Zombie, so you do not take it. Compare only the sides that touch.'},
            {who: 'ai', card: 'Lizard', cell: 8, after: 'They put Lizard in the corner, touching nobody. Only neighbors fight.'},
            {who: 'player', card: 'Paladin', cell: 7, before: 'Pick Paladin and play it to the left of Lizard. Your right is 8. Their left is 4.', after: 'Your 8 beats their 4, so Lizard is yours. Paladin\'s top matches Dragon, and your own cards do not capture each other.'},
            {who: 'ai', card: 'Imp', cell: 5, after: 'They put Imp beside you. Their top matches Vampire\'s bottom at 3. Their left is 5, which loses to Dragon\'s right 7. They take nothing.'},
            {who: 'player', card: 'T-Rex', cell: 6, before: 'Last card. Play T-Rex under Zombie. Your top is 8. Their bottom is 6.', after: 'Your 8 beats their 6. The board is full: you have 8 cards, they have 1. Owl is still in their hand, and a card you never play does not score.', spotlight: 'ai'}
        ]
    },
    {
        title: 'On play',
        log: 'This match is abilities that fire when you play a card.',
        ruleset: 'ember',
        blurb: 'Cinder, Blast, Curse, Bolt, Buff, Siphon, and Parasite. After each play, you see what just happened.',
        player: ['Scorch', 'Dragon', 'Ghost', 'Wizard', 'Mimic'],
        ai: ['Robot', 'Fairy', 'Monk', 'Kraken', 'Owl'],
        steps: [
            {who: 'note', text: 'Abilities are on. After each play, you will see what just happened. Play the highlighted card on the highlighted cell. Bolt and Cinder hit the same spots every time you replay this.'},
            {who: 'player', card: 'Scorch', cell: 0, roll: 1, before: 'Play Scorch in the top-left. Cinder burns one empty cell. Whoever sits there later is -1 to every number.', after: 'The top-right cell is orange. It is empty for now. The -1 starts when someone sits there.'},
            {who: 'ai', card: 'Robot', cell: 6, after: 'They put Robot in the bottom-left, touching nobody. Equalizer only takes a card when the numbers match, and there is no neighbor to match.'},
            {who: 'player', card: 'Dragon', cell: 3, before: 'Play Dragon above Robot. Your bottom is 4. Their top is 5. Blast is what makes this fight.', after: 'Blast adds 2 on the turn you play the card. Your bottom 4 becomes 6, and 6 beats 5, so you take Robot. The +2 is gone after the turn. Without it, 4 would not beat 5.'},
            {who: 'ai', card: 'Fairy', cell: 4, after: 'They put Fairy in the middle. Her left is 6 and your Dragon\'s right is 7, so she does not take you. Buff does nothing yet: she has no friendly neighbor.'},
            {who: 'player', card: 'Ghost', cell: 7, before: 'Play Ghost under Fairy. Curse hits the strongest enemy for -1 on every side, then you capture.', after: 'Fairy was the only enemy, so she is cursed. Her bottom goes from 3 to 2, and your top 3 takes her. It would have been a match without Curse. She is yours now, so Buff turns on: Dragon and Ghost beside her are +1.'},
            {who: 'ai', card: 'Monk', cell: 8, after: 'They put Monk in the corner. Their left is 5 and your Ghost\'s right is 8. Equalizer only takes on a match. 5 is not a match, so Monk stays red.'},
            {who: 'player', card: 'Wizard', cell: 5, roll: 0, before: 'Play Wizard above Monk. Bolt zaps one enemy for -2 before you capture. Monk is the only enemy.', after: 'Bolt drops Monk from 5s to 3s. Your bottom is 3, plus 1 from Fairy beside you, so 4 beats 3. Without the zap, 4 would lose to 5.'},
            {who: 'ai', card: 'Kraken', cell: 2, after: 'They put Kraken on the burned cell, so he is -1. Siphon stole 1 from your Wizard\'s top and added it to Kraken\'s top, the opposite side. His bottom is still too low to take you.'},
            {who: 'player', card: 'Mimic', cell: 1, before: 'Play Mimic left of Kraken. Parasite copies an adjacent enemy. If that ability fires when you play, it fires before you capture.', after: 'Mimic copies Kraken\'s Siphon. The copy steals 1 from Kraken\'s left. Your right is 2 plus Fairy\'s buff, so 3 beats his 2. The whole board is yours. Owl is still in their hand and does not score.', spotlight: 'ai'}
        ]
    },
    {
        title: 'On the board',
        log: 'This match is abilities that keep working after you play.',
        ruleset: 'ember',
        blurb: 'Pendulum, Chill, Spite, Poison, Equalizer, and Symbiosis. Silence sits in their hand and never comes down.',
        player: ['Clock', 'Frost', 'Spider', 'Monk', 'Mycelium'],
        ai: ['Vendetta', 'Owl', 'Robot', 'Wrath', 'Dread'],
        steps: [
            {who: 'note', text: 'These abilities keep working after you play the card. Pendulum swings every turn. Chill and Buff stay on while the card sits there. Poison hits at the end of a turn. Symbiosis grows in your hand as you capture. The bonus counts on the turn you play the card, then the card goes back to its printed numbers.'},
            {who: 'player', card: 'Clock', cell: 0, before: 'Play Clock in the top-left. Pendulum swaps top and bottom with left and right at the end of every turn, until the board is full.', after: 'You played it as 8 on top and bottom, 2 on the sides. It has already swung: the 8s are on the left and right. It will swing back next turn.'},
            {who: 'ai', card: 'Vendetta', cell: 6, after: 'They put Vendetta where it touches nobody, so Spite is waiting. Your Clock swung again. The 8s are back on top and bottom. It keeps trading like that every turn.'},
            {who: 'player', card: 'Frost', cell: 3, before: 'Play Frost above Vendetta. Chill lowers adjacent enemies by 1, and that counts when you capture. Her top is 4. Your bottom is 4.', after: 'Chill made her top 3 for the fight, so your 4 takes her. Chill lets go once she is yours, so her top reads 4 again. Spite then took 1 from every side of Frost. Those numbers are red.'},
            {who: 'ai', card: 'Owl', cell: 1, after: 'They put Owl next to Clock. Owl\'s left is 6 and your Clock\'s right is 8, so Owl does not take you. Equalizer would have needed a match.'},
            {who: 'player', card: 'Spider', cell: 2, before: 'Play Spider to the right of Owl. Your left is 3 and their right is 3. Poison takes the card after it hits, not when you sit down.', after: 'The numbers match, so nothing changes yet. Then Poison takes 1 from Owl and you capture. Poison sticks, unlike Chill. It repeats at the end of every turn while an enemy sits beside Spider.'},
            {who: 'ai', card: 'Robot', cell: 7, after: 'They put Robot next to Vendetta. Robot\'s left is 2 and Vendetta\'s right is 6. No match, so Equalizer does nothing. Owl is yours now, so Spider has no enemy neighbor and Poison has nothing to hit.'},
            {who: 'player', card: 'Monk', cell: 4, before: 'Play Monk above Robot. Your bottom is 5 and their top is 5. Equalizer takes that match.', after: 'A normal card would stop on a match. Equalizer takes Robot. Mycelium is still in your hand and already reads 7: +1 for each of your 3 captures.'},
            {who: 'ai', card: 'Wrath', cell: 8, after: 'They put Wrath in the corner. Wrath\'s left matches Robot\'s right at 5. Spite does nothing until you take Wrath.'},
            {who: 'player', card: 'Mycelium', cell: 5, before: 'Play Mycelium above Wrath. It should already show 7 on every side. Without your captures, 4 would lose to Wrath\'s top 6.', after: 'Your bottom 7 beats their top 6, so the bonus is why you take Wrath. Spite then takes 1 from the printed 4s, and Mycelium sits at 3. The bonus was only for that fight. Dread never came down. Silence turns off enemy abilities next to it. Two Silence cards next to each other cancel, and you can still capture.', spotlight: 'ai'}
        ]
    }
];

function tutorialLesson() {
    return tutorial ? TUTORIALS[tutorial.lessonIndex] : null;
}

function tutorialStep() {
    const lesson = tutorialLesson();
    return lesson && lesson.steps[tutorial.stepIndex];
}

function tutorialBlocksCard(card) {
    if (!tutorial || gameState !== 'playing') return false;
    if (tutorial.phase !== 'play') return true;
    const step = tutorialStep();
    return !step || step.who !== 'player' || !card || card.name !== step.card;
}

function tutorialBlockMessage(cell) {
    const step = tutorialStep();
    if (!tutorial || !step) return 'Continue when you are ready.';
    if (tutorial.phase === 'log' && !tutorial.logOpened) return 'Open the Battle log.';
    if (tutorial.phase !== 'play') return 'Read the note, then continue.';
    if (step.who === 'player' && cell != null && cell !== step.cell && tutorial.armed) return 'Not that cell. Play on the highlighted one.';
    return `Play ${step.card}.`;
}

function tutorialSetText(text) {
    const el = document.getElementById('coach-text');
    if (el) el.textContent = text || '';
}

function tutorialShowNext(show) {
    const next = document.getElementById('coach-next');
    if (next) next.hidden = !show;
}

function tutorialShowOpenLog(show) {
    const openLog = document.getElementById('coach-open-log');
    if (openLog) openLog.hidden = !show;
}

function tutorialChrome() {
    const lesson = tutorialLesson();
    const cardEl = document.getElementById('coach-card');
    const kicker = document.getElementById('coach-kicker');
    const skip = document.getElementById('coach-skip');
    if (cardEl) cardEl.classList.add('tutorial-coach');
    if (kicker) {
        kicker.hidden = false;
        kicker.textContent = lesson ? lesson.title : 'Tutorial';
    }
    if (skip) skip.textContent = 'Exit tutorial';
    coach.active = true;
    coach.step = 'tutorial';
}

function tutorialArm() {
    if (!tutorial || tutorial.phase !== 'play') return;
    const step = tutorialStep();
    if (!step || step.who !== 'player') return;
    if (selectedCard === null) {
        tutorial.armed = false;
        return;
    }
    const card = playerHand[selectedCard];
    if (!card || card.name !== step.card) {
        selectedCard = null;
        tutorial.armed = false;
        statusMsg.textContent = `Play ${step.card}.`;
        return;
    }
    tutorial.armed = true;
    statusMsg.textContent = `Play ${step.card} on the highlighted cell.`;
    requestAnimationFrame(updateCoach);
}

function tutorialEnter() {
    const step = tutorialStep();
    if (!tutorial || !step) {
        if (tutorial) tutorial.pendingEnd = true;
        endGame();
        return;
    }
    tutorial.pendingEnd = false;
    tutorial.armed = false;
    tutorial.logOpened = false;
    tutorial.roll = step.roll != null ? step.roll : null;
    tutorialChrome();
    tutorialShowOpenLog(false);
    if (step.who === 'note') {
        tutorial.phase = 'after';
        tutorialSetText(step.text);
        tutorialShowNext(true);
        statusMsg.textContent = tutorialLesson().title;
    } else if (step.who === 'log') {
        tutorial.phase = 'log';
        tutorialSetText(step.before);
        tutorialShowNext(false);
        tutorialShowOpenLog(true);
        statusMsg.textContent = 'Open the Battle log.';
    } else if (step.who === 'ai') {
        tutorial.phase = 'resolving';
        tutorialSetText('They are about to play.');
        tutorialShowNext(false);
        statusMsg.textContent = 'Their play.';
        clearAiPlayTimer();
        aiPlayTimer = setTimeout(() => {
            aiPlayTimer = null;
            tutorialPlayAi(step);
        }, 700);
    } else {
        tutorial.phase = 'play';
        tutorialSetText(step.before);
        tutorialShowNext(false);
        statusMsg.textContent = `Play ${step.card} on the highlighted cell.`;
    }
    render();
    requestAnimationFrame(updateCoach);
}

function tutorialPlayAi(step) {
    if (!tutorial || gameState !== 'playing' || !step) return;
    const idx = aiHand.findIndex(c => c.name === step.card);
    if (idx < 0 || board[step.cell] != null) return;
    tutorial.roll = step.roll != null ? step.roll : null;
    executeAIMove(idx, step.cell);
}

function tutorialOnPlaced() {
    const step = tutorialStep();
    if (!tutorial || !step) return;
    tutorial.roll = null;
    tutorial.phase = 'after';
    tutorial.armed = false;
    coach.active = true;
    coach.step = 'tutorial';
    tutorialChrome();
    tutorialSetText(step.after || 'Done.');
    tutorialShowNext(true);
    if (board.every(cell => cell !== null)) tutorial.pendingEnd = true;
    if (step.spotlight === 'ai') tutorial.phase = 'after';
    statusMsg.textContent = tutorial.pendingEnd ? 'The board is full.' : 'Continue when you are ready.';
    requestAnimationFrame(updateCoach);
}

function tutorialContinue() {
    if (!tutorial) return;
    sfx.click();
    if (tutorial.phase === 'log' && !tutorial.logOpened) {
        statusMsg.textContent = 'Open the Battle log.';
        return;
    }
    if (!document.getElementById('battle-log-modal').classList.contains('hidden')) hideModal('battle-log-modal');
    if (tutorial.pendingEnd) {
        tutorial.pendingEnd = false;
        hideTurnBanner();
        endGame();
        return;
    }
    tutorial.stepIndex += 1;
    tutorialEnter();
}

function renderTutorialMenu() {
    const root = document.getElementById('tutorial-lessons');
    if (!root) return;
    root.innerHTML = '';
    TUTORIALS.forEach((lesson, index) => {
        const block = document.createElement('div');
        block.className = 'tutorial-lesson';
        const title = document.createElement('h3');
        title.textContent = lesson.title;
        const copy = document.createElement('p');
        copy.textContent = lesson.blurb;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn';
        btn.textContent = 'Play';
        btn.addEventListener('click', () => startTutorialLesson(index));
        block.appendChild(title);
        block.appendChild(copy);
        block.appendChild(btn);
        root.appendChild(block);
    });
}

function openTutorial() {
    if (gameoverClickLock) return;
    sfx.click();
    hideTooltip();
    clearAiPlayTimer();
    hideTurnBanner();
    resetFingerDrag();
    tutorial = null;
    hideCoach();
    document.body.classList.remove('tutorial-live');
    unlockGameoverClicks();
    document.body.classList.add('menu-open');
    hideModals(['main-menu-modal', 'draft-modal', 'deck-modal', 'stats-modal', 'expanded-rules-modal', 'compendium-modal', 'options-modal', 'gameover-modal', 'battle-log-modal', 'league-modal', 'league-roster', 'changelog-modal']);
    gameState = 'menu';
    resetTable();
    playerHand = [];
    aiHand = [];
    renderTutorialMenu();
    document.getElementById('tutorial-modal').classList.remove('hidden');
    render();
}

function closeTutorialMenu() {
    hideModal('tutorial-modal');
    showModeMenu();
}

function exitTutorial() {
    clearAiPlayTimer();
    hideTurnBanner();
    resetFingerDrag();
    tutorial = null;
    hideCoach();
    document.body.classList.remove('tutorial-live');
    gameState = 'menu';
    resetTable();
    playerHand = [];
    aiHand = [];
    hideModals(['gameover-modal', 'battle-log-modal', 'main-menu-modal']);
    document.body.classList.add('menu-open');
    renderTutorialMenu();
    document.getElementById('tutorial-modal').classList.remove('hidden');
    render();
}

function startTutorialLesson(index) {
    const lesson = TUTORIALS[index];
    if (!lesson) return;
    sfx.click();
    hideTooltip();
    clearAiPlayTimer();
    hideTurnBanner();
    resetFingerDrag();
    unlockGameoverClicks();
    hideModals(['tutorial-modal', 'main-menu-modal', 'draft-modal', 'deck-modal', 'stats-modal', 'expanded-rules-modal', 'compendium-modal', 'options-modal', 'gameover-modal', 'battle-log-modal', 'league-modal', 'league-roster', 'changelog-modal']);
    localStorage.setItem('ember_grid_coached', 'true');
    activeMode = 'tutorial';
    skipCoachOnce = true;
    applyGridSize(3);
    tutorial = {
        lessonIndex: index,
        stepIndex: 0,
        phase: 'play',
        armed: false,
        roll: null,
        reveal: true,
        pendingEnd: false,
        logOpened: false
    };
    resetTable();
    gameState = 'playing';
    playerHand = lesson.player.map(name => cloneForOwner(cardByName(name), 'blue', lesson.ruleset));
    aiHand = lesson.ai.map(name => cloneForOwner(cardByName(name), 'red', lesson.ruleset));
    if (playerHand.some(c => !c) || aiHand.some(c => !c)) {
        tutorial = null;
        statusMsg.textContent = 'Tutorial deck is missing a card.';
        showModeMenu();
        return;
    }
    beginMatch('player', 'tutorial');
}

function tutorialReplay() {
    if (gameoverClickLock || !tutorial) return;
    startTutorialLesson(tutorial.lessonIndex);
}

function tutorialNextLesson() {
    if (gameoverClickLock || !tutorial) return;
    if (tutorial.lessonIndex >= TUTORIALS.length - 1) {
        openTutorial();
        return;
    }
    startTutorialLesson(tutorial.lessonIndex + 1);
}

function maybeStartCoach() {
    if (tutorial || activeMode === 'tutorial') return;
    if (skipCoachOnce) { skipCoachOnce = false; return; }
    if (isLeagueMatch()) return;
    if (localStorage.getItem('ember_grid_coached') === 'true') return;
    if (gameState !== 'playing') return;
    coach.active = true;
    coach.pendingCapture = false;
    coach.taughtHand = false;
    if (turn === 'player') {
        const hasEnemy = board.some(c => c && c.owner === 'red');
        coach.step = 'hand';
        coach.pendingCapture = hasEnemy;
        setCoachCopy();
        requestAnimationFrame(updateCoach);
    } else {
        coach.step = 'wait';
    }
}

function skipCoach() {
    sfx.click();
    if (tutorial) { exitTutorial(); return; }
    finishCoach();
}

function finishCoach() {
    localStorage.setItem('ember_grid_coached', 'true');
    hideCoach();
}

function hideCoach() {
    coach.active = false;
    coach.step = null;
    coach.pendingCapture = false;
    document.getElementById('coach-spotlight').classList.add('hidden');
    const cardEl = document.getElementById('coach-card');
    cardEl.classList.add('hidden');
    cardEl.classList.remove('tutorial-coach');
    const next = document.getElementById('coach-next');
    const kicker = document.getElementById('coach-kicker');
    const skip = document.getElementById('coach-skip');
    if (next) next.hidden = true;
    const openLog = document.getElementById('coach-open-log');
    if (openLog) openLog.hidden = true;
    if (kicker) kicker.hidden = true;
    if (skip) skip.textContent = 'Skip lesson';
}

function setCoachCopy() {
    if (tutorial) return;
    const text = document.getElementById('coach-text');
    if (coach.step === 'hand') text.textContent = "Pick a card from your hand.";
    else if (coach.step === 'cell') text.textContent = coach.pendingCapture
        ? "Play it next to an enemy. The touching number must be higher to capture."
        : "Now play it onto an empty cell.";
    else if (coach.step === 'capture') text.textContent = "Play next to an enemy. If your touching stat is higher, you steal their card.";
    else if (coach.step === 'captured') text.textContent = "That's a capture - the card is yours now.";
    else if (coach.step === 'missed') text.textContent = "No capture that time. You need a strictly higher touching stat.";
}

function firstEmptyCell() {
    const i = board.findIndex(c => c === null);
    return i < 0 ? Math.floor(cellCount() / 2) : i;
}

function captureLessonCell() {
    const emptyAdj = [];
    board.forEach((c, i) => {
        if (!c || c.owner !== 'red') return;
        neighborDirs(i).forEach(n => { if (n.ok && board[n.idx] === null) emptyAdj.push(n.idx); });
    });
    return emptyAdj[0] ?? firstEmptyCell();
}

function updateCoach() {
    const spot = document.getElementById('coach-spotlight');
    const cardEl = document.getElementById('coach-card');
    if (!coach.active || coach.step === 'wait' || gameState !== 'playing') {
        spot.classList.add('hidden');
        if (!coach.active) cardEl.classList.add('hidden');
        return;
    }

    if (tutorial && tutorial.phase === 'log' && tutorial.logOpened) {
        spot.classList.add('hidden');
        setCoachCopy();
        cardEl.classList.remove('hidden');
        const h = cardEl.offsetHeight || 140;
        cardEl.style.top = Math.max(8, window.innerHeight - h - 10) + 'px';
        cardEl.style.left = Math.max(8, (window.innerWidth - cardEl.offsetWidth) / 2) + 'px';
        return;
    }

    const placeCardNear = (rect) => {
        setCoachCopy();
        cardEl.classList.remove('hidden');
        const grid = document.getElementById('board-grid').getBoundingClientRect();
        const hand = document.getElementById('bottom-area').getBoundingClientRect();
        const cardH = tutorial ? Math.min(240, cardEl.offsetHeight || 168) : 92;
        let top;
        const aiHandOpen = document.querySelector('#top-area .card');
        if (tutorial) {
            const above = grid.top - cardH - 8;
            top = above > 8 ? above : Math.max(8, window.innerHeight - cardH - 12);
        } else if (aiHandOpen) {
            top = grid.top + Math.max(8, (grid.height - cardH) / 2);
        } else if (coach.step === 'hand') {
            top = grid.top - cardH - 8;
            if (top < 8) top = Math.min(grid.bottom + 8, window.innerHeight - cardH - 8);
        } else if (hand.top - grid.bottom > cardH + 6) {
            top = grid.bottom + 8;
        } else if (grid.top > cardH + 12) {
            top = grid.top - cardH - 8;
        } else {
            top = Math.max(8, window.innerHeight - cardH - 12);
        }
        const w = cardEl.offsetWidth || (tutorial ? 320 : 280);
        let left = grid.left + grid.width / 2 - w / 2;
        left = Math.max(12, Math.min(left, window.innerWidth - w - 12));
        cardEl.style.top = top + 'px';
        cardEl.style.left = left + 'px';
    };

    if (coach.step === 'captured' || coach.step === 'missed') {
        spot.classList.add('hidden');
        const grid = document.getElementById('board-grid').getBoundingClientRect();
        placeCardNear(grid);
        return;
    }

    let target = null;
    if (tutorial) {
        const step = tutorialStep();
        if (tutorial.phase === 'play' && step && step.who === 'player' && !tutorial.armed) {
            target = document.querySelector('#bottom-area .card.coach-target');
        } else if (tutorial.phase === 'play' && step && step.who === 'player' && tutorial.armed) {
            target = document.querySelectorAll('#board-grid .cell')[step.cell];
        } else if (tutorial.phase === 'log' && !tutorial.logOpened) {
            target = document.getElementById('battle-log-link');
        } else if (tutorial.phase === 'after' && step && step.spotlight === 'ai') {
            target = document.querySelector('#top-area .card');
        }
    } else if (coach.step === 'hand') {
        target = document.querySelector('#bottom-area .card');
    } else if (coach.step === 'cell' || coach.step === 'capture') {
        const idx = coach.step === 'capture' ? captureLessonCell() : (coach.pendingCapture ? captureLessonCell() : firstEmptyCell());
        coach.cellIndex = idx;
        target = document.querySelectorAll('#board-grid .cell')[idx];
    }

    if (!target) {
        spot.classList.add('hidden');
        if (tutorial && coach.active) {
            const grid = document.getElementById('board-grid').getBoundingClientRect();
            placeCardNear(grid);
        }
        return;
    }

    const r = target.getBoundingClientRect();
    const pad = 6;
    spot.style.top = (r.top - pad) + 'px';
    spot.style.left = (r.left - pad) + 'px';
    spot.style.width = (r.width + pad * 2) + 'px';
    spot.style.height = (r.height + pad * 2) + 'px';
    spot.classList.remove('hidden');
    placeCardNear(r);
}

function onCoachSelected() {
    if (tutorial) { tutorialArm(); return; }
    if (!coach.active || coach.step !== 'hand') return;
    coach.step = 'cell';
    coach.taughtHand = true;
    coach.cellIndex = coach.pendingCapture ? captureLessonCell() : firstEmptyCell();
    requestAnimationFrame(updateCoach);
}

function onCoachPlaced(hadCapture, hadEnemyNeighbor) {
    if (!coach.active) return;
    if (coach.step === 'hand' || coach.step === 'cell') {
        if (hadCapture) {
            coach.step = 'captured';
            setCoachCopy();
            setTimeout(() => finishCoach(), 1800);
        } else if (hadEnemyNeighbor) {
            coach.step = 'missed';
            setCoachCopy();
            setTimeout(() => finishCoach(), 2200);
        } else {
            coach.pendingCapture = true;
            coach.step = 'wait';
            document.getElementById('coach-spotlight').classList.add('hidden');
            document.getElementById('coach-card').classList.add('hidden');
        }
        requestAnimationFrame(updateCoach);
    } else if (coach.step === 'capture') {
        coach.step = hadCapture ? 'captured' : 'missed';
        setCoachCopy();
        requestAnimationFrame(updateCoach);
        setTimeout(() => finishCoach(), hadCapture ? 1800 : 2200);
    }
}

function resumeCoachAfterAi() {
    if (!coach.active || coach.step !== 'wait') return;
    if (turn !== 'player') return;
    if (coach.taughtHand) {
        coach.step = 'capture';
        coach.pendingCapture = true;
        coach.cellIndex = captureLessonCell();
    } else {
        coach.step = 'hand';
        coach.pendingCapture = board.some(c => c && c.owner === 'red');
    }
    requestAnimationFrame(updateCoach);
}

function cellFxPoint(index) {
    const cell = boardCellEl(index);
    if (!cell) return null;
    const a = cell.getBoundingClientRect();
    if (a.width < 4 || a.height < 4) return null;
    return {
        x: a.left + a.width / 2,
        y: a.top + a.height / 2,
        w: a.width,
        h: a.height
    };
}

function fxLayer() {
    return document.getElementById('board-fx');
}

function spawnFxEl(html, life, cls) {
    const layer = fxLayer();
    if (!layer) return null;
    const el = document.createElement('div');
    if (cls) el.className = cls;
    if (typeof html === 'string') el.innerHTML = html;
    layer.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, life);
    return el;
}

function placeBurst(pt, kind, inner, life) {
    if (!pt) return null;
    const el = spawnFxEl(inner, life || 720, `mech-burst mech-${kind}`);
    if (!el) return null;
    el.style.left = `${pt.x}px`;
    el.style.top = `${pt.y}px`;
    el.style.width = `${pt.w}px`;
    el.style.height = `${pt.h}px`;
    return el;
}

function tapCardFx(index, cls, ms) {
    const cell = boardCellEl(index);
    const card = cell && cell.querySelector('.card');
    if (!card) return;
    card.classList.add(cls);
    setTimeout(() => card.classList.remove(cls), ms || 400);
}

function travelFx(from, to, kind, ms) {
    if (!from || !to) return;
    const el = spawnFxEl('', (ms || 400) + 40, `mech-travel ${kind}`);
    if (!el) return;
    el.style.left = `${from.x}px`;
    el.style.top = `${from.y}px`;
    requestAnimationFrame(() => {
        el.style.transform = `translate(${to.x - from.x}px, ${to.y - from.y}px)`;
    });
}

function lightningPoints(x1, y1, x2, y2, scale) {
    const pts = [[x1, y1]];
    const segs = 4;
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    let sign = 1;
    for (let i = 1; i < segs; i++) {
        const t = i / segs;
        const amp = (22 + Math.random() * 16) * scale * sign;
        sign *= -1;
        pts.push([x1 + dx * t + nx * amp, y1 + dy * t + ny * amp]);
    }
    pts.push([x2, y2]);
    return pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
}

function lightningFork(x1, y1, x2, y2) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const mx = x1 + dx * 0.55, my = y1 + dy * 0.55;
    const fx = mx + nx * 28 + dx * 0.18;
    const fy = my + ny * 28 + dy * 0.18;
    return lightningPoints(mx, my, fx, fy, 0.55);
}

function sparkBurst(count, dist) {
    let html = '';
    for (let i = 0; i < count; i++) {
        const ang = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
        const d = dist * (0.7 + Math.random() * 0.4);
        html += `<span class="mech-spark" style="--dx:${Math.cos(ang) * d}px;--dy:${Math.sin(ang) * d}px;animation-delay:${(i * 0.02).toFixed(2)}s"></span>`;
    }
    return html;
}

function playBoltFx(fromIdx, toIdx) {
    const from = cellFxPoint(fromIdx);
    const to = cellFxPoint(toIdx);
    const layer = fxLayer();
    if (!from || !to || !layer) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'mech-bolt-svg');
    svg.setAttribute('aria-hidden', 'true');
    const a = lightningPoints(from.x, from.y, to.x, to.y, 1);
    const b = lightningPoints(from.x, from.y, to.x, to.y, 0.7);
    const fork = lightningFork(from.x, from.y, to.x, to.y);
    svg.innerHTML = `<polyline class="bolt-glow" points="${a}"></polyline><polyline class="bolt-glow" points="${fork}"></polyline><polyline class="bolt-core" points="${a}"></polyline><polyline class="bolt-core bolt-core-2" points="${b}"></polyline><polyline class="bolt-core" points="${fork}"></polyline>`;
    layer.appendChild(svg);
    setTimeout(() => { if (svg.parentNode) svg.parentNode.removeChild(svg); }, 1100);
    const glyph = spawnFxEl('⚡', 500, 'mech-bolt-glyph');
    if (glyph) {
        glyph.style.left = `${from.x}px`;
        glyph.style.top = `${from.y}px`;
        requestAnimationFrame(() => {
            glyph.style.transform = `translate(${to.x - from.x}px, ${to.y - from.y}px) scale(1.25)`;
        });
    }
    placeBurst(from, 'bolt', `<div class="mech-flash bolt"></div>`, 900);
    placeBurst(to, 'bolt', `<div class="mech-flash bolt"></div>${sparkBurst(8, 28)}`, 1000);
    tapCardFx(toIdx, 'mech-hit-bolt', 500);
}

function playBuffFx(fromIdx, toIdxs) {
    const from = cellFxPoint(fromIdx);
    const layer = fxLayer();
    placeBurst(from, 'buff', `<div class="mech-flash buff"></div><span class="mech-mote" style="--dx:-8px"></span><span class="mech-mote" style="--dx:8px;animation-delay:0.06s"></span>`, 720);
    if (from && layer && toIdxs.length) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'mech-ray-svg');
        svg.setAttribute('aria-hidden', 'true');
        svg.innerHTML = toIdxs.map(idx => {
            const to = cellFxPoint(idx);
            if (!to) return '';
            return `<line x1="${from.x.toFixed(1)}" y1="${from.y.toFixed(1)}" x2="${to.x.toFixed(1)}" y2="${to.y.toFixed(1)}"></line>`;
        }).join('');
        layer.appendChild(svg);
        setTimeout(() => { if (svg.parentNode) svg.parentNode.removeChild(svg); }, 620);
    }
    toIdxs.forEach(idx => {
        placeBurst(cellFxPoint(idx), 'buff', `<div class="mech-flash buff"></div><span class="mech-mote" style="--dx:-6px"></span><span class="mech-mote" style="--dx:7px;animation-delay:0.05s"></span><span class="mech-mote" style="--dx:0px;animation-delay:0.1s"></span>`, 740);
    });
}

function playCurseFx(fromIdx, toIdx) {
    const from = cellFxPoint(fromIdx);
    const to = cellFxPoint(toIdx);
    travelFx(from, to, 'curse', 380);
    placeBurst(from, 'curse', `<div class="mech-flash curse"></div>`, 620);
    placeBurst(to, 'curse', `<div class="mech-flash curse"></div>`, 620);
    setTimeout(() => {
        placeBurst(to, 'curse', `<span class="mech-wisp" style="left:50%;top:42%"></span>`, 680);
    }, 280);
}

function playBlastFx(fromIdx) {
    const from = cellFxPoint(fromIdx);
    placeBurst(from, 'blast', `<div class="mech-flash blast"></div><div class="mech-wave"></div>${sparkBurst(8, 26)}`, 760);
}

function playPoisonFx(fromIdx, toIdxs) {
    placeBurst(cellFxPoint(fromIdx), 'poison', `<div class="mech-flash poison"></div>`, 600);
    toIdxs.forEach(idx => {
        placeBurst(cellFxPoint(idx), 'poison', `<div class="mech-flash poison"></div><span class="mech-drip" style="--dx:-10px"></span><span class="mech-drip" style="--dx:2px;animation-delay:0.06s"></span><span class="mech-drip" style="--dx:11px;animation-delay:0.12s"></span>`, 760);
    });
}

function playSilenceFx(fromIdx, toIdxs) {
    placeBurst(cellFxPoint(fromIdx), 'silence', `<div class="mech-flash silence"></div>`, 560);
    toIdxs.forEach(idx => {
        placeBurst(cellFxPoint(idx), 'silence', `<div class="mech-flash silence"></div><div class="mech-mute"></div>`, 680);
    });
}

function playChillFx(fromIdx, toIdxs) {
    placeBurst(cellFxPoint(fromIdx), 'chill', `<div class="mech-flash chill"></div>`, 560);
    toIdxs.forEach(idx => {
        placeBurst(cellFxPoint(idx), 'chill', `<div class="mech-flash chill"></div><span class="mech-crystal c1"></span><span class="mech-crystal c2"></span><span class="mech-crystal c3"></span><span class="mech-crystal c4"></span>`, 740);
        tapCardFx(idx, 'mech-hit-chill', 450);
    });
}

function playCinderFx(fromIdx, toIdx) {
    const from = cellFxPoint(fromIdx);
    const to = cellFxPoint(toIdx);
    travelFx(from, to, 'cinder', 380);
    placeBurst(from, 'cinder', `<div class="mech-flash cinder"></div>`, 620);
    placeBurst(to, 'cinder', `<div class="mech-flash cinder"></div><span class="mech-flame" style="--dx:-8px"></span><span class="mech-flame" style="--dx:0px;animation-delay:0.05s"></span><span class="mech-flame" style="--dx:8px;animation-delay:0.1s"></span>`, 820);
}

function playSpiteFx(fromIdx, toIdx) {
    placeBurst(cellFxPoint(fromIdx), 'spite', `<div class="mech-flash spite"></div>`, 520);
    placeBurst(cellFxPoint(toIdx), 'spite', `<div class="mech-flash spite"></div><div class="mech-crack"></div>`, 560);
    tapCardFx(toIdx, 'mech-hit-spite', 400);
}

function playEqualizerFx(fromIdx, toIdx) {
    placeBurst(cellFxPoint(fromIdx), 'equalizer', `<div class="mech-flash equalizer"></div><div class="mech-balance"></div>`, 620);
    placeBurst(cellFxPoint(toIdx), 'equalizer', `<div class="mech-flash equalizer"></div><div class="mech-balance"></div>`, 620);
}

function playParasiteFx(fromIdx, toIdx) {
    travelFx(cellFxPoint(toIdx), cellFxPoint(fromIdx), 'curse', 420);
    placeBurst(cellFxPoint(fromIdx), 'parasite', `<div class="mech-flash parasite"></div>`, 640);
    placeBurst(cellFxPoint(toIdx), 'parasite', `<div class="mech-flash parasite"></div>`, 560);
}

function playSiphonFx(fromIdx, toIdxs) {
    placeBurst(cellFxPoint(fromIdx), 'siphon', `<div class="mech-flash siphon"></div>`, 620);
    toIdxs.forEach(idx => {
        travelFx(cellFxPoint(idx), cellFxPoint(fromIdx), 'cinder', 360);
        placeBurst(cellFxPoint(idx), 'siphon', `<div class="mech-flash siphon"></div>`, 520);
    });
}

function playPendulumFx(fromIdx) {
    placeBurst(cellFxPoint(fromIdx), 'pendulum', `<div class="mech-flash pendulum"></div><div class="mech-balance"></div>`, 640);
    tapCardFx(fromIdx, 'mech-hit-chill', 400);
}

function playSymbiosisFx(fromIdx) {
    placeBurst(cellFxPoint(fromIdx), 'symbiosis', `<div class="mech-flash symbiosis"></div>`, 680);
}

function playMechFx(events) {
    if (!events || !events.length) return;
    events.forEach(ev => {
        const to = ev.to || [];
        if (ev.kind === 'bolt' && to[0] != null) playBoltFx(ev.from, to[0]);
        else if (ev.kind === 'buff') playBuffFx(ev.from, to);
        else if (ev.kind === 'curse' && to[0] != null) playCurseFx(ev.from, to[0]);
        else if (ev.kind === 'blast') playBlastFx(ev.from);
        else if (ev.kind === 'poison') playPoisonFx(ev.from, to);
        else if (ev.kind === 'silence') playSilenceFx(ev.from, to);
        else if (ev.kind === 'chill') playChillFx(ev.from, to);
        else if (ev.kind === 'cinder' && to[0] != null) playCinderFx(ev.from, to[0]);
        else if (ev.kind === 'spite' && to[0] != null) playSpiteFx(ev.from, to[0]);
        else if (ev.kind === 'equalizer' && to[0] != null) playEqualizerFx(ev.from, to[0]);
        else if (ev.kind === 'parasite' && to[0] != null) playParasiteFx(ev.from, to[0]);
        else if (ev.kind === 'siphon') playSiphonFx(ev.from, to);
        else if (ev.kind === 'pendulum') playPendulumFx(ev.from);
        else if (ev.kind === 'symbiosis') playSymbiosisFx(ev.from);
    });
}

function flushMechFx() {
    const events = pendingMechFx.splice(0);
    if (!events.length) return;
    let tries = 0;
    const run = () => {
        const ready = events.some(ev => cellFxPoint(ev.from) || (ev.to && ev.to.some(i => cellFxPoint(i))));
        if (!ready && tries++ < 8) {
            requestAnimationFrame(run);
            return;
        }
        playMechFx(events);
    };
    requestAnimationFrame(() => requestAnimationFrame(run));
}

function mountOpponentHand(topArea) {
    if (!revealHands() || !topArea) return;
    const opp = document.createElement('div');
    const live = gameState === 'playing' && turn === 'ai' && aiHand.length;
    opp.className = live ? 'hand active-turn' : 'hand';
    aiHand.forEach((card, index) => opp.appendChild(createCardElement(card, index, 'ai')));
    topArea.appendChild(opp);
}

function render() {
    hideTooltip();
    const topArea = document.getElementById('top-area');
    const bottomArea = document.getElementById('bottom-area'), turnInd = document.getElementById('turn-indicator');
    if (topArea) topArea.innerHTML = '';
    bottomArea.innerHTML = '';

    if (gameState === 'playing') {
        turnInd.textContent = turn === 'player'
            ? 'YOUR TURN'
            : (isLeagueMatch() ? `${leaguePlayer(leagueMatch.oppId).name.toUpperCase()} TURN` : 'AI TURN');
        turnInd.style.color = turn === 'player' ? 'var(--blue-card)' : 'var(--red-card)';
    } else if (gameState === 'gameover') {
        turnInd.textContent = 'FINAL';
        turnInd.style.color = 'var(--accent)';
    } else {
        turnInd.textContent = 'EMBER GRID'; turnInd.style.color = 'var(--accent)';
    }

    if (gameState === 'playing') {
        mountOpponentHand(topArea);
        const handDiv = document.createElement('div');
        handDiv.className = `hand ${turn === 'player' ? 'active-turn' : ''}`;
        playerHand.forEach((card, index) => handDiv.appendChild(createCardElement(card, index, 'player')));
        bottomArea.appendChild(handDiv);
    } else if (gameState === 'gameover') {
        mountOpponentHand(topArea);
        const gameoverOpen = !document.getElementById('gameover-modal').classList.contains('hidden');
        if (!gameoverOpen) {
            const bar = document.createElement('div');
            bar.className = 'rematch-bar';
            if (isLeagueMatch()) {
                const fx = league && leagueMatch ? league.fixtures[leagueMatch.fixtureIndex] : null;
                const more = !!(fx && !seriesComplete(fx));
                bar.innerHTML = more
                    ? `
                    <button class="btn" onclick="playNextLeagueMatch()">Next Game</button>
                    <div class="gameover-links">
                        <button type="button" class="gameover-link" onclick="showModeMenu()">Menu</button>
                    </div>
                `
                    : `
                    <button class="btn" onclick="openLeagueHubFromGameover()">League Table</button>
                    <div class="gameover-links">
                        <button type="button" class="gameover-link" onclick="showModeMenu()">Menu</button>
                    </div>
                `;
            } else if (activeMode === 'tutorial' && tutorial) {
                const last = tutorial.lessonIndex >= TUTORIALS.length - 1;
                bar.innerHTML = `
                    ${last ? '' : '<button class="btn" onclick="tutorialNextLesson()">Next lesson</button>'}
                    <div class="rematch-secondary">
                        <button class="btn btn-alt" onclick="tutorialReplay()">Replay lesson</button>
                        <button class="btn btn-alt" onclick="openTutorial()">All lessons</button>
                    </div>
                    <div class="gameover-links">
                        <button type="button" class="gameover-link" onclick="showModeMenu()">Menu</button>
                    </div>
                `;
            } else {
                bar.innerHTML = `
                    <button class="btn" onclick="rematchSwapFirst()" title="Same hands, swap who goes first">Replay</button>
                    <div class="rematch-secondary">
                        <button class="btn btn-alt" onclick="startCurrentModeAgain()">New Hands</button>
                        <button type="button" class="btn btn-alt" id="board-share-btn" onclick="shareCurrentMatch()">Share</button>
                    </div>
                    <div class="gameover-links">
                        <button type="button" class="gameover-link" onclick="showModeMenu()">Menu</button>
                    </div>
                `;
            }
            bottomArea.appendChild(bar);
            if (!isLeagueMatch()) syncShareButton();
        }
    }

    const gridEl = document.getElementById('board-grid'); gridEl.innerHTML = '';
    gridEl.classList.toggle('hex-board', isHexGrid());
    board.forEach((cell, index) => {
        const cellEl = document.createElement('div'); cellEl.className = 'cell';
        if (isHexGrid() && HEX.boxes[index]) {
            const box = HEX.boxes[index];
            cellEl.style.left = box.left;
            cellEl.style.top = box.top;
            cellEl.style.width = box.width;
            cellEl.style.height = box.height;
        }
        if (cellEffects[index] === 'cinder') {
            cellEl.classList.add('cell-cinder');
            const cinderTip = 'Cindered: whoever sits here is -1 to all stats.';
            cellEl.setAttribute('aria-label', cinderTip);
            if (!cell) addTooltipListeners(cellEl, cinderTip);
        }

        cellEl.addEventListener('dragover', (e) => {e.preventDefault(); cellEl.classList.add('drag-over');});
        cellEl.addEventListener('dragleave', () => cellEl.classList.remove('drag-over'));
        cellEl.addEventListener('drop', (e) => {
            e.preventDefault(); cellEl.classList.remove('drag-over');
            const handIndex = parseInt(e.dataTransfer.getData('text/plain'));
            if (!isNaN(handIndex)) executeCardPlay(handIndex, index);
        });

        cellEl.addEventListener('click', () => handleCellClick(index));
        const stepNow = tutorialStep();
        const tutorCell = tutorial && tutorial.phase === 'play' && tutorial.armed && stepNow && stepNow.who === 'player' && index === stepNow.cell;
        if (tutorCell || (coach.active && (coach.step === 'cell' || coach.step === 'capture') && index === coach.cellIndex)) {
            cellEl.classList.add('coach-target');
        }
        if (cell) cellEl.appendChild(createCardElement(cell, index, 'board'));
        gridEl.appendChild(cellEl);
    });
    updateScores();
    requestAnimationFrame(updateCoach);
}

function paintHandSelection() {
    const on = turn === 'player' && gameState === 'playing';
    document.querySelectorAll('#bottom-area .hand .card').forEach(el => {
        const idx = Number(el.dataset.handIndex);
        el.classList.toggle('selected', on && selectedCard === idx);
    });
}

function selectHandCard(index, card) {
    selectedCard = (selectedCard === index) ? null : index;
    statusMsg.textContent = selectedCard !== null
        ? withMatchup(`Selected: ${card.name}${abilityNameOf(card) ? ` (${abilityNameOf(card)})` : ''}. Play it on an empty cell.`)
        : withMatchup("Your turn - play a card from your hand.");
    paintHandSelection();
    if (selectedCard !== null) onCoachSelected();
}

function createCardElement(card, index, source) {
    const div = document.createElement('div');
    const didFlip = !!card.justFlipped;
    div.className = `card ${card.owner} ${didFlip ? 'flipped' : ''}${isHexGrid() ? ' has-hex-faces' : ''}`;
    if (card.justFlipped) card.justFlipped = false;
    if (source === 'player') div.dataset.handIndex = String(index);
    if (source === 'player' && selectedCard === index && turn === 'player' && gameState === 'playing') div.classList.add('selected');
    if (card.drawAnimAt && source !== 'board') {
        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const elapsed = performance.now() - card.drawAnimAt;
        const dur = 580;
        if (reduce || elapsed >= dur) {
            card.drawAnimAt = 0;
        } else {
            div.classList.add('draw-in');
            if (elapsed > 16) div.style.animationDelay = `-${Math.round(elapsed)}ms`;
            div.addEventListener('animationend', (e) => {
                if (e.target !== div) return;
                if (e.animationName !== 'cardDrawIn' && e.animationName !== 'cardDrawInTop') return;
                div.classList.remove('draw-in');
                div.style.animationDelay = '';
                card.drawAnimAt = 0;
            }, {once: true});
        }
    }
    if (coach.active && coach.step === 'hand' && source === 'player' && index === 0) div.classList.add('coach-target');
    if (tutorial && source === 'player' && tutorial.phase === 'play') {
        const step = tutorialStep();
        if (step && step.who === 'player') {
            if (card.name === step.card) div.classList.add('coach-target');
            else div.classList.add('tutorial-locked');
        }
    } else if (tutorial && source === 'player') {
        div.classList.add('tutorial-locked');
    }

    const printed = printedStatsOf(card);
    const activeStats = liveStatsOf(card, index, source);
    const prevStats = shownStatValues.get(card.id || card.name);
    shownStatValues.set(card.id || card.name, activeStats);
    const silenced = source === 'board' && isSilenced(index);
    div.innerHTML = `
        ${card.ability ? `<div class="ability-badge${silenced ? ' silenced' : ''}">${card.ability.icon}</div>` : ''}
        ${facingMarkup('top', activeStats[0], printed[0], prevStats && prevStats[0])}
        ${facingMarkup('right', activeStats[1], printed[1], prevStats && prevStats[1])}
        ${facingMarkup('bottom', activeStats[2], printed[2], prevStats && prevStats[2])}
        ${facingMarkup('left', activeStats[3], printed[3], prevStats && prevStats[3])}
        ${isHexGrid() ? facingMarkup('ne', activeStats[4], printed[4], prevStats && prevStats[4]) : ''}
        ${isHexGrid() ? facingMarkup('nw', activeStats[5], printed[5], prevStats && prevStats[5]) : ''}
        <div class="card-emoji">${card.emoji}</div>
        ${nameplateHTML(card, silenced)}
        ${didFlip ? '<div class="capture-pop">CAPTURED</div>' : ''}
        ${card.fxType ? `<div class="fx-ring ${card.fxType}"></div>` : ''}
    `;
    if (card.fxType) card.fxType = null;
    paintCardFaces(div);

    if (card.ability && card.ability.desc) {
        addTooltipListeners(div, abilityTip(card, {silenced}), {pinOnTap: source === 'board'});
    }

    if (source === 'player' && turn === 'player' && gameState === 'playing') {
        div.setAttribute('draggable', 'true');
        div.addEventListener('dragstart', (e) => {
            if (tutorialBlocksCard(card)) {
                e.preventDefault();
                statusMsg.textContent = tutorialBlockMessage();
                return;
            }
            selectedCard = index;
            paintHandSelection();
            e.dataTransfer.setData('text/plain', index);
            div.classList.add('dragging');
            onCoachSelected();
        });
        div.addEventListener('dragend', () => {
            div.classList.remove('dragging');
            paintHandSelection();
        });
        div.addEventListener('pointerdown', (e) => onHandPointerDown(e, index, div));

        div.addEventListener('click', (e) => {
            e.stopPropagation();
            if (swallowClick && swallowForIndex === index) {
                swallowClick = false;
                swallowForIndex = null;
                return;
            }
            swallowClick = false;
            swallowForIndex = null;
            if (tutorialBlocksCard(card)) {
                sfx.click(); hideTooltip();
                statusMsg.textContent = tutorialBlockMessage();
                return;
            }
            sfx.click(); hideTooltip();
            selectHandCard(index, card);
        });
    }
    return div;
}

function handleCellClick(index) {
    if (swallowClick) return;
    if (gameState !== 'playing' || turn !== 'player' || selectedCard === null || board[index] !== null) return;
    executeCardPlay(selectedCard, index);
}

function isFingerPointer(e) {
    return e.pointerType === 'touch' || e.pointerType === 'pen';
}

function cellIndexFromPoint(x, y) {
    const hit = document.elementFromPoint(x, y);
    if (!hit) return null;
    const cell = hit.closest('#board-grid .cell');
    if (!cell) return null;
    const cells = boardCellEls();
    for (let i = 0; i < cells.length; i++) if (cells[i] === cell) return i;
    return null;
}

function clearCellDragOver() {
    document.querySelectorAll('#board-grid .cell.drag-over').forEach(el => el.classList.remove('drag-over'));
}

function highlightCellAt(x, y) {
    const idx = cellIndexFromPoint(x, y);
    if (idx === pointerDrag.overIdx) return;
    pointerDrag.overIdx = idx;
    clearCellDragOver();
    if (idx === null || board[idx] !== null) return;
    const cell = boardCellEl(idx);
    if (cell) cell.classList.add('drag-over');
}

function moveDragGhost(x, y) {
    const g = pointerDrag.ghost;
    if (!g) return;
    const w = g.offsetWidth || 78;
    const h = g.offsetHeight || 96;
    g.style.transform = `translate(${Math.round(x - w / 2)}px, ${Math.round(y - h - 10)}px) scale(1.06)`;
}

function startFingerDrag(e) {
    hideTooltip();
    pointerDrag.active = true;
    selectedCard = pointerDrag.index;
    paintHandSelection();
    hideTooltip();
    onCoachSelected();
    if (pointerDrag.sourceEl) pointerDrag.sourceEl.classList.add('dragging');
    const ghost = pointerDrag.sourceEl.cloneNode(true);
    ghost.classList.add('card-ghost');
    ghost.classList.remove('dragging', 'selected', 'coach-target');
    ghost.removeAttribute('draggable');
    const r = pointerDrag.sourceEl.getBoundingClientRect();
    ghost.style.width = `${r.width}px`;
    ghost.style.height = `${r.height}px`;
    document.body.appendChild(ghost);
    pointerDrag.ghost = ghost;
    moveDragGhost(e.clientX, e.clientY);
    try {pointerDrag.sourceEl.setPointerCapture(e.pointerId);} catch (err) {}
    statusMsg.textContent = "Drop on an empty cell.";
}

function endFingerDrag() {
    clearCellDragOver();
    if (pointerDrag.ghost && pointerDrag.ghost.parentNode) pointerDrag.ghost.parentNode.removeChild(pointerDrag.ghost);
    document.querySelectorAll('.card-ghost').forEach(el => el.remove());
    if (pointerDrag.sourceEl) pointerDrag.sourceEl.classList.remove('dragging');
    pointerDrag.active = false;
    pointerDrag.ghost = null;
    pointerDrag.overIdx = null;
}

function resetFingerDrag() {
    endFingerDrag();
    pointerDrag.pointerId = null;
    pointerDrag.index = null;
    pointerDrag.sourceEl = null;
}

function onHandPointerDown(e, index, el) {
    if (!isFingerPointer(e) || e.isPrimary === false) return;
    if (gameState !== 'playing' || turn !== 'player') return;
    if (tutorialBlocksCard(playerHand[index])) return;
    if (swallowClick && swallowForIndex !== index) {
        swallowClick = false;
        swallowForIndex = null;
    }
    pointerDrag.pointerId = e.pointerId;
    pointerDrag.index = index;
    pointerDrag.startX = e.clientX;
    pointerDrag.startY = e.clientY;
    pointerDrag.active = false;
    pointerDrag.sourceEl = el;
}

function onFingerDragMove(e) {
    if (pointerDrag.pointerId === null || e.pointerId !== pointerDrag.pointerId) return;
    const dx = e.clientX - pointerDrag.startX;
    const dy = e.clientY - pointerDrag.startY;
    const dist = Math.hypot(dx, dy);
    if (!pointerDrag.active) {
        if (dist < 12) return;
        if (e.cancelable) e.preventDefault();
        startFingerDrag(e);
    }
    if (pointerDrag.active) {
        if (e.cancelable) e.preventDefault();
        moveDragGhost(e.clientX, e.clientY);
        highlightCellAt(e.clientX, e.clientY);
    }
}

function finishFingerDrag(clientX, clientY) {
    if (pointerDrag.active) {
        const cellIdx = cellIndexFromPoint(clientX, clientY);
        const handIndex = pointerDrag.index;
        swallowClick = true;
        swallowForIndex = handIndex;
        resetFingerDrag();
        if (cellIdx !== null && board[cellIdx] === null && gameState === 'playing' && turn === 'player') {
            executeCardPlay(handIndex, cellIdx);
        } else {
            paintHandSelection();
        }
        return;
    }
    if (pointerDrag.pointerId === null) return;
    pointerDrag.pointerId = null;
    pointerDrag.index = null;
    pointerDrag.sourceEl = null;
}

function onFingerDragEnd(e) {
    if (pointerDrag.pointerId === null || e.pointerId !== pointerDrag.pointerId) return;
    if (e.cancelable) e.preventDefault();
    finishFingerDrag(e.clientX, e.clientY);
}

function onFingerTouchEnd(e) {
    if (!pointerDrag.active && pointerDrag.pointerId === null) return;
    const t = e.changedTouches && e.changedTouches[0];
    if (!t) {resetFingerDrag(); return;}
    if (e.cancelable) e.preventDefault();
    finishFingerDrag(t.clientX, t.clientY);
}

function executeCardPlay(handIndex, boardIndex) {
    if (board[boardIndex] !== null || handIndex >= playerHand.length) return;
    if (tutorial) {
        const step = tutorialStep();
        const card = playerHand[handIndex];
        const ok = tutorial.phase === 'play' && step && step.who === 'player' && card && card.name === step.card && boardIndex === step.cell;
        if (!ok) {
            statusMsg.textContent = tutorialBlockMessage(boardIndex);
            return;
        }
    }
    resetFingerDrag();
    sfx.place(); hideTooltip();
    const cardToPlay = playerHand.splice(handIndex, 1)[0];
    cardToPlay.stats = [...cardToPlay.baseStats];
    board[boardIndex] = cardToPlay; selectedCard = null;
    if (activeMode !== 'tutorial') stats.cardPlays[cardToPlay.name] = (stats.cardPlays[cardToPlay.name] || 0) + 1;
    processCardPlacement(boardIndex, cardToPlay);
}

function updateScores() {
    const blueEl = document.getElementById('score-blue');
    const redEl = document.getElementById('score-red');
    if (gameState === 'menu') {
        blueEl.textContent = `Blue: -`; redEl.textContent = `Red: -`;
        lastBlueScore = null; lastRedScore = null;
        return;
    }
    const blue = ownedCount('blue');
    const red = ownedCount('red');
    const blueName = isLeagueMatch() ? 'You' : 'Blue';
    const redName = isLeagueMatch() ? leaguePlayer(leagueMatch.oppId).name : 'Red';
    blueEl.textContent = `${blueName}: ${blue}`;
    redEl.textContent = `${redName}: ${red}`;
    if (lastBlueScore !== null && blue !== lastBlueScore) {
        blueEl.classList.remove('score-tick'); void blueEl.offsetWidth; blueEl.classList.add('score-tick');
    }
    if (lastRedScore !== null && red !== lastRedScore) {
        redEl.classList.remove('score-tick'); void redEl.offsetWidth; redEl.classList.add('score-tick');
    }
    lastBlueScore = blue; lastRedScore = red;
}

function endGame() {
    gameState = 'gameover'; hideTooltip(); hideCoach();
    clearAiPlayTimer();
    resetFingerDrag();
    hideTurnBanner();
    if (blastPreviewTimer) {clearTimeout(blastPreviewTimer); blastPreviewTimer = null;}
    board.forEach(c => { if (c) c.blastPreview = false; });
    let blueCount = ownedCount('blue'), redCount = ownedCount('red');
    const counted = activeMode !== 'tutorial';
    if (counted) stats.played++;
    if (blueCount > redCount) {
        if (counted) {stats.wins++; stats.streak++; if (stats.streak > stats.bestStreak) stats.bestStreak = stats.streak;}
        if (!silentSim) sfx.win();
        logAction("Victory achieved!");
    } else if (redCount > blueCount) {
        if (counted) {stats.losses++; stats.streak = 0;}
        if (!silentSim) sfx.lose();
        logAction("Defeat suffered.");
    } else {
        if (counted) {stats.draws++; stats.streak = 0;}
        if (!silentSim) sfx.click();
        logAction("Match ended in a draw.");
    }
    if (counted) saveStats();
    if (isLeagueMatch()) recordUserLeagueResult(blueCount, redCount);

    let title = blueCount > redCount ? "Victory" : (redCount > blueCount ? "Defeat" : "Draw");
    if (isLeagueMatch() && leagueMatch) {
        const fx = league.fixtures[leagueMatch.fixtureIndex];
        const gameN = (fx.games || []).length;
        title = `Game ${gameN} · ${title}`;
    }
    const card = document.querySelector('#gameover-modal .modal-content');
    if (card) {
        card.classList.toggle('is-win', blueCount > redCount);
        card.classList.toggle('is-loss', redCount > blueCount);
    }
    document.getElementById('gameover-title').textContent = title;
    document.getElementById('gameover-blue').textContent = String(blueCount);
    document.getElementById('gameover-red').textContent = String(redCount);
    const blueLabel = document.getElementById('gameover-blue-label');
    const redLabel = document.getElementById('gameover-red-label');
    if (blueLabel) blueLabel.textContent = isLeagueMatch() ? 'You' : 'Blue';
    if (redLabel) redLabel.textContent = isLeagueMatch() ? leaguePlayer(leagueMatch.oppId).name : 'Red';
    const casual = document.getElementById('gameover-casual-actions');
    const leagueActs = document.getElementById('gameover-league-actions');
    const tutorialOver = activeMode === 'tutorial' && !!tutorial;
    const tutorialActs = document.getElementById('gameover-tutorial-actions');
    const tutorialNote = document.getElementById('gameover-tutorial');
    if (casual) {
        casual.hidden = isLeagueMatch() || tutorialOver;
        casual.classList.toggle('hidden', isLeagueMatch() || tutorialOver);
    }
    if (tutorialActs) {
        tutorialActs.hidden = !tutorialOver;
        tutorialActs.classList.toggle('hidden', !tutorialOver);
    }
    if (tutorialNote) {
        tutorialNote.hidden = !tutorialOver;
        if (tutorialOver) {
            const lesson = tutorialLesson();
            const last = tutorial.lessonIndex >= TUTORIALS.length - 1;
            tutorialNote.textContent = last
                ? `You finished ${lesson.title}. Replay any lesson from the list.`
                : `You finished ${lesson.title}. The next lesson is ready.`;
            const next = document.getElementById('gameover-tutorial-next');
            if (next) {
                next.hidden = false;
                next.textContent = last ? 'All lessons' : 'Next lesson';
            }
        }
    }
    if (leagueActs) {
        leagueActs.hidden = !isLeagueMatch();
        leagueActs.classList.toggle('hidden', !isLeagueMatch());
    }
    const seriesEl = document.getElementById('gameover-series');
    const nextBtn = document.getElementById('gameover-league-next');
    if (seriesEl) {
        if (isLeagueMatch() && leagueMatch) {
            const fx = league.fixtures[leagueMatch.fixtureIndex];
            const s = seriesGameWins(fx);
            const youIsHome = fx.home === 'you';
            const youG = youIsHome ? s.home : s.away;
            const oppG = youIsHome ? s.away : s.home;
            const done = seriesComplete(fx);
            const nextFirst = !done ? seriesNextFirst(fx) : null;
            const nextName = nextFirst === 'you' ? 'You' : leaguePlayer(leagueMatch.oppId).name;
            seriesEl.hidden = false;
            const weekBit = `Week ${fx.week}`;
            seriesEl.textContent = done
                ? (fx.result.winner === 'you'
                    ? `${weekBit} series ${youG}–${oppG}. You take it.`
                    : fx.result.winner === 'draw'
                        ? `${weekBit} series ${youG}–${oppG}. Draw.`
                        : `${weekBit} series ${youG}–${oppG}. ${leaguePlayer(leagueMatch.oppId).name} takes it.`)
                : `${weekBit} series ${youG}–${oppG}. Next: ${nextName} first.`;
        } else {
            seriesEl.hidden = true;
            seriesEl.textContent = '';
        }
    }
    if (nextBtn) {
        const fx = isLeagueMatch() && leagueMatch ? league.fixtures[leagueMatch.fixtureIndex] : null;
        const more = !!(fx && !seriesComplete(fx));
        nextBtn.hidden = !more;
        nextBtn.classList.toggle('hidden', !more);
    }
    if (isLeagueMatch()) {
        const opp = leaguePlayer(leagueMatch.oppId);
        const fx = league.fixtures[leagueMatch.fixtureIndex];
        const done = seriesComplete(fx);
        const gameBit = blueCount > redCount
            ? `You took ${opp.name} ${blueCount}–${redCount}`
            : redCount > blueCount
                ? `${opp.name} took you ${redCount}–${blueCount}`
                : `Draw ${blueCount}–${redCount} with ${opp.name}`;
        statusMsg.textContent = done ? `Week done. ${gameBit}.` : `Game done. ${gameBit}.`;
    }
    if (!isLeagueMatch()) syncShareButton();
    lockGameoverClicks();
    document.getElementById('gameover-modal').classList.remove('hidden');
    render();
}

refreshRulesetDesc();
refreshGridSizeDesc();
refreshVictoryCopy();
applyGridSize(preferredGridSize);
if (!bootSharedMatch()) showModeMenu();

window.addEventListener('pointermove', onFingerDragMove, {passive: false});

window.addEventListener('pointerup', onFingerDragEnd);

window.addEventListener('pointercancel', onFingerDragEnd);

window.addEventListener('touchend', onFingerTouchEnd, {passive: false});

window.addEventListener('touchcancel', onFingerTouchEnd, {passive: false});

document.addEventListener('click', (e) => {
    if (!swallowClick) return;
    const card = e.target && e.target.closest && e.target.closest('#bottom-area .hand .card');
    const idx = card ? Number(card.dataset.handIndex) : NaN;
    if (card && Number.isFinite(idx) && idx !== swallowForIndex) {
        swallowClick = false;
        swallowForIndex = null;
        return;
    }
    e.stopPropagation();
    e.preventDefault();
    swallowClick = false;
    swallowForIndex = null;
}, true);

document.addEventListener('pointerdown', (e) => {
    if (!tooltipPinned || !tooltipAnchor) return;
    if (tooltipAnchor === e.target || tooltipAnchor.contains(e.target)) return;
    hideTooltip();
}, true);

window.addEventListener('resize', () => {
    requestAnimationFrame(updateCoach);
    if (tooltipPinned && tooltipAnchor) positionTooltipOnAnchor(tooltipAnchor);
});

window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    clearDraftTimer();
    hideModals(['draft-modal', 'deck-modal', 'stats-modal', 'expanded-rules-modal', 'compendium-modal', 'options-modal', 'battle-log-modal', 'league-modal', 'league-roster', 'tutorial-modal', 'changelog-modal']);
    if (gameState !== 'playing' && gameState !== 'gameover') showModeMenu();
});

document.addEventListener('click', (e) => {
    const menu = document.getElementById('deck-sort-menu');
    if (!menu || menu.contains(e.target)) return;
    closeDeckSortMenu();
});

window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (tooltipPinned) {hideTooltip(); return;}
    if (!document.getElementById('league-roster').classList.contains('hidden')) {closeLeagueRoster(); return;}
    if (!document.getElementById('battle-log-modal').classList.contains('hidden')) {closeBattleLogModal(); return;}
    if (!document.getElementById('expanded-rules-modal').classList.contains('hidden')) {closeRulesModal(); return;}
    if (!document.getElementById('changelog-modal').classList.contains('hidden')) {closeChangelogModal(); return;}
    if (!document.getElementById('tutorial-modal').classList.contains('hidden')) {closeTutorialMenu(); return;}
    if (!document.getElementById('compendium-modal').classList.contains('hidden')) {closeCompendiumModal(); return;}
    if (!document.getElementById('options-modal').classList.contains('hidden')) {closeOptionsModal(); return;}
    if (!document.getElementById('stats-modal').classList.contains('hidden')) {closeStatsModal(); return;}
    if (!document.getElementById('draft-modal').classList.contains('hidden')) {cancelDraft(); return;}
    if (!document.getElementById('deck-modal').classList.contains('hidden')) {cancelDeckPicker(); return;}
    if (!document.getElementById('league-modal').classList.contains('hidden')) {leaveLeagueToMenu(); return;}
});
