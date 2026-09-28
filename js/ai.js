/* Placement and draft scoring. Same heuristic the league sim uses. */
function leagueDraftScore(card, playerId) {
    let score = getCardDraftScore(card);
    const t = card.ability && card.ability.type;
    if (playerId === 'ash' && (t === 'blast' || t === 'aura_buff' || t === 'cinder' || t === 'siphon')) score += 3;
    if (playerId === 'vesper' && (t === 'chill' || t === 'silence' || t === 'poison' || t === 'curse_adj' || t === 'parasite')) score += 3;
    if (playerId === 'rook') {
        score += 1;
        if (t === 'equalizer' || t === 'blast' || t === 'pendulum' || t === 'symbiosis') score += 1.5;
    }
    const noise = playerId === 'rook' ? Math.random() * 0.4 : Math.random() * 1.8;
    return score + noise;
}

function personalityPlayBias(card, personality) {
    if (!personality || !card.ability) return 0;
    const t = card.ability.type;
    if (personality === 'ash' && (t === 'blast' || t === 'aura_buff' || t === 'cinder' || t === 'siphon')) return 2.5;
    if (personality === 'vesper' && (t === 'chill' || t === 'silence' || t === 'poison' || t === 'curse_adj' || t === 'parasite')) return 2.5;
    if (personality === 'rook' && (t === 'equalizer' || t === 'blast' || t === 'pendulum' || t === 'symbiosis')) return 1.5;
    return 0;
}

function getCardDraftScore(card) {
    let baseScore = card.baseStats.reduce((sum, val) => sum + val, 0);
    if (card.ability) {
        switch (card.ability.type) {
            case 'poison': baseScore += 5; break;
            case 'silence': baseScore += 5; break;
            case 'chill': baseScore += 5; break;
            case 'blast': baseScore += 4; break;
            case 'aura_buff': baseScore += 4; break;
            case 'equalizer': baseScore += 4; break;
            case 'spite':
            case 'cinder':
            case 'bolt':
            case 'parasite':
            case 'siphon':
            case 'symbiosis': baseScore += 4; break;
            case 'pendulum': baseScore += 3; break;
            case 'curse_adj': baseScore += 3; break;
            default: baseScore += 2;
        }
    }
    return baseScore;
}

function currentMatchAiDifficulty() {
    if (isLeagueMatch()) return leagueAiDifficulty();
    return aiDifficulty;
}

function pickAiMoveFor(owner, difficulty, personality) {
    const hand = owner === 'blue' ? playerHand : aiHand;
    const enemy = owner === 'blue' ? 'red' : 'blue';
    const emptyCells = board.map((c, i) => c === null ? i : null).filter(i => i !== null);
    if (!emptyCells.length || !hand.length) return null;

    if (difficulty === 'easy' && Math.random() < 0.45) {
        return {
            cardIndex: Math.floor(Math.random() * hand.length),
            cellIdx: emptyCells[Math.floor(Math.random() * emptyCells.length)]
        };
    }

    const enemyOnBoard = board.some(c => c && c.owner === enemy);
    const groveOnBoard = board.some(c => c && c.owner === owner && liveAbilityType(c) === 'symbiosis');
    let bestMove = null, maxScore = -999;
    hand.forEach((card, cardIndex) => {
        const powerBias = card.baseStats.reduce((a, b) => a + b, 0) * 0.1 + (card.ability ? 3 : 0);
        emptyCells.forEach(cellIdx => {
            let score = 0, flipsCount = 0, exposureRisk = 0;
            const silencedHere = wouldBeSilenced(owner, cellIdx);
            const hushCancels = liveAbilityType(card) === 'silence' && neighborIndexes(cellIdx).some(i => isSilenceCard(board[i]) && board[i].owner === enemy);
            const neighbors = neighborDirs(cellIdx);

            neighbors.forEach(n => {
                if (n.ok && board[n.idx]) {
                    const neighborCard = board[n.idx];
                    const myVal = getEffectiveStat(card, n.p, true, silencedHere);
                    const theirVal = getEffectiveStat(neighborCard, n.n, false, isSilenced(n.idx));

                    if (liveAbilityType(neighborCard) === 'poison' && !isSilenced(n.idx)) exposureRisk += 2;
                    if (liveAbilityType(card) === 'poison' && !silencedHere) {
                        if (neighborCard.owner === enemy) score += 3;
                    }
                    if (liveAbilityType(card) === 'silence' && neighborCard.owner === enemy && neighborCard.ability) {
                        if (!hushCancels || liveAbilityType(neighborCard) === 'silence') score += 4;
                    }
                    if (liveAbilityType(card) === 'chill' && neighborCard.owner === enemy) score += 3;
                    if (liveAbilityType(neighborCard) === 'spite' && neighborCard.owner === enemy) exposureRisk += 2;
                    if (liveAbilityType(card) === 'parasite' && neighborCard.owner === enemy && snapshotAbility(neighborCard) && !silencedHere) score += 5;
                    if (liveAbilityType(card) === 'siphon' && neighborCard.owner === enemy && !silencedHere) score += 4;

                    if (neighborCard.owner === enemy) {
                        const hit = facingCaptures(myVal, theirVal, card, silencedHere);
                        let captures = hit.captures;
                        if (!captures && liveAbilityType(card) === 'poison' && !silencedHere && myVal > Math.max(1, theirVal - 1)) captures = true;
                        if (captures) flipsCount++;
                    }
                } else if (n.ok && board[n.idx] === null && difficulty === 'hard') {
                    const exposedStatVal = getEffectiveStat(card, n.p, true, silencedHere);
                    if (exposedStatVal <= 4) exposureRisk += (5 - exposedStatVal);
                }
            });

            score += flipsCount * 14 + powerBias - exposureRisk * 2.5;
            if (cellEffects[cellIdx] === 'cinder') score -= 5;
            if (silencedHere && liveAbilityType(card) !== 'silence') score -= 3;
            if (liveAbilityType(card) === 'bolt' && !silencedHere && enemyOnBoard) score += 3;
            if (liveAbilityType(card) === 'symbiosis' && !silencedHere) score += 2 + ownerCaptureCount(owner) * 3;
            if (flipsCount && (liveAbilityType(card) === 'symbiosis' || groveOnBoard)) score += flipsCount * 2;
            score += personalityPlayBias(card, personality);
            if (score > maxScore) {maxScore = score; bestMove = {cardIndex, cellIdx};}
        });
    });

    return bestMove || {cardIndex: 0, cellIdx: emptyCells[0]};
}

function aiTurn() {
    if (tutorial) return;
    if (gameState !== 'playing' || silentSim) return;
    const personality = isLeagueMatch() ? leagueMatch.oppId : null;
    const move = pickAiMoveFor('red', currentMatchAiDifficulty(), personality);
    if (!move) return;
    executeAIMove(move.cardIndex, move.cellIdx);
}

function executeAIMove(cardIdx, cellIdx) {
    if (!silentSim) { sfx.place(); hideTooltip(); }
    const chosenCard = aiHand.splice(cardIdx, 1)[0];
    chosenCard.stats = [...chosenCard.baseStats];
    board[cellIdx] = chosenCard;
    processCardPlacement(cellIdx, chosenCard);
}
