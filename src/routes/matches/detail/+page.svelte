<script>
    import { onMount } from 'svelte';
    import { getMatch } from '../../../endpoints/matches';
    import Chip, { Set, Text } from '@smui/chips';
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';

    export let data;
    let match = {};
    let loaded = false;

    let teams = [];

    const getWinMargin =  (winMargin, winMarginType) => {
        let margin = winMarginType.toLowerCase();

        if (winMargin > 1) {
            margin += 's';
        }

        return margin;
    };

    const getTossMarkup = () => {
        let tossMarkup = 'NA';

        if (match.tossWinner) {
            tossMarkup = match.tossWinner.name + ' won the toss and chose to ' + ((match.tossWinner.id === match.batFirst.id) ? 'bat' : 'bowl');
        }

        return tossMarkup;
    }
    
    const getResultMarkup = () => {
        let result = '';
        if (match.winner) {
            result += match.winner.name + " won";

            if (match.winMarginType) {
                result += " by " + match.winMargin + " " + getWinMargin(match.winMargin, match.winMarginType.name);
            }

            if ('Super Over' === match.resultType.name) {
                result += ' (Super Over)';
            }
        } else {
            if (match.resultType.name === 'Tie') {
                result = 'Match Tied';
            } else if(match.resultType.name === 'Draw') {
                result = 'Match Drawn';
            } else if(match.resultType.name === 'Washed Out') {
                result = 'Match Washed Out';
            }
        }

        return result;
    };

    const matchStartTime = () => {
        let date = new Date(match.startTime);
        let options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        return date.toLocaleDateString('en-GB', options);
    };

    const getPlayerLabel = (currentPlayer) => {
        let text = currentPlayer.name;

        let roles = [];

        let isCaptain = false;
        for (const player of match.captains) {
            if (currentPlayer.id === player.id) {
                isCaptain = true;
                break;
            }
        }

        if (isCaptain) {
            roles.push('c');
        }

        let isWicketKeeper = false;
        for (const player of match.wicketKeepers) {
            if (currentPlayer.id === player.id) {
                isWicketKeeper = true;
                break;
            }
        }

        if (isWicketKeeper) {
            roles.push('wk');
        }

        if (roles.length > 0) {
            text += ' ( ' + roles.join(' & ') + ' ) ';
        }

        return text;
    };

    const getClassNameForPlayer = (teamId) => {
        return (match.team1.id === teamId ? 'team-1' : 'team-2');
    };

    const totalInningsCount = () => {
        let totalInnings = 0;

        for (const score of match.battingScores) {
            if (score.innings > totalInnings) {
                totalInnings = score.innings;
            }
        }

        return totalInnings;
    };

    const getInningsTitle = (innings, gameType) => {
        const teamName = getPlayerTeam(match.battingScores.filter(score => score.innings === innings)[0].player.id).name;
        return teamName + ' Innings' + ((gameType === 'Test') ? ' ' + (Math.round(innings / 2)) : '');
    };

    const getPlayerTeam = (playerId) => {
        const teamMap = {
            [match.team1.id]: match.team1,
            [match.team2.id]: match.team2
        };

        let team = {};

        for (const [teamId, players] of Object.entries(match.players)) {
            const playerIds = players.map(player => player.id);
            if (playerIds.includes(playerId)) {
                team = teamMap[teamId];
                break;
            }
        }

        return team;
    };

    const getOverDetails = (balls) => {
        return (Math.floor(balls / 6) + '.' + (balls % 6));
    };

    const getTotalText = (innings) => {
        let runs = 0;
        let wickets = 0;
        let balls = 0;

        for (const battingScore of match.battingScores) {
            if (innings === battingScore.innings) {
                runs += battingScore.runs;

                if (battingScore.dismissalMode) {
                    wickets++;
                }
            }
        }

        for (const extra of match.extras) {
            if (innings === extra.innings) {
                runs += extra.runs;
            }
        }

        for (const bowlingFigure of match.bowlingFigures) {
            if (innings === bowlingFigure.innings) {
                balls += bowlingFigure.balls;
            }
        }

        return (runs + ' - ' + wickets + ' ( ' +  getOverDetails(balls) + ' ) ');
    };

    const getExtrasText = (innings) => {
        let total = 0;
        let extras = {
            b: 0,
            lb: 0,
            w: 0,
            nb: 0,
            p: 0
        };

        for (const extra of match.extras) {
            if (innings === extra.innings) {
                let typeString = '';
                let type = extra.type.name;
                let typeParts = type.split(' ');
                for (const part of typeParts) {
                    typeString += part.toLowerCase()[0];
                }

                extras[typeString] = extra.runs;
                total += extra.runs;
            }
        }

        let typeArray = [];
        for (let type in extras) {
            let runs = extras[type];
            typeArray.push(type + " " + runs);
        }

        return total + '(' + typeArray.join(', ') + ')';
    };

    onMount(async () => {
        const matchResponse = await getMatch(data.id);
        match = matchResponse.data.data;

        teams = [
            match.team1,
            match.team2
        ];

        loaded = true;
    });

    const handleSeriesClick = (seriesId) => {
        window.location.href = '/series/detail?id=' + seriesId;
    };

    const handlePlayerClick = (playerId) => {
        console.log(playerId);
    };
</script>

{#if loaded}
    <div>
        <div>
            <strong>
                Series:
                &nbsp;
            </strong>

            <span style="color: blue; cursor: pointer" on:click={handleSeriesClick(match.series.id)}>
                {match.series.name + ' - ' + match.series.gameType.name}
            </span>
        </div>

        <div>
            <strong>
                Teams:
                &nbsp;
            </strong>

            <Set chips={teams} key={(chip) => chip.id} style="display: inline;">
                {#snippet chip(chip)}
                <Chip {chip} color="secondary" style="color: #ba68c8; border-style: solid; border-width: 1px; border-color: #ba68c8; background-color: #f3f6f9;">
                    {chip.name}
                </Chip>
                {/snippet}
            </Set>
        </div>

        <div>
            <strong>
                Toss:
                &nbsp;
            </strong>

            {getTossMarkup()}
        </div>

        <div>
            <strong>
                Result:
                &nbsp;
            </strong>

            {getResultMarkup()}
        </div>

        <div>
            <strong>
                Stadium:
                &nbsp;
            </strong>

            {match.stadium.name + ', ' + match.stadium.country.name}
        </div>

        <div>
            <strong>
                Start Time:
                &nbsp;
            </strong>

            {matchStartTime()}
        </div>

        <div class="row">
            <div class="bordered-container">
                <div class="container">
                    <h2 style="font-weight: normal">
                        Playing Squads
                    </h2>

                    {#each teams as team}
                        <span>
                          {team.name}
                        </span>

                        <div>
                            <Set chips={match.players[team.id]} key={(chip) => chip.id}>
                                {#snippet chip(chip)}
                                    <Chip {chip} class={getClassNameForPlayer(team.id)}>
                                        <span on:click={handlePlayerClick(chip.id)}>
                                            {getPlayerLabel(chip)}
                                        </span>
                                    </Chip>
                                {/snippet}
                            </Set>
                            
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <div>
            <strong>
                Man of the Match:
                &nbsp;
            </strong>

            <Set chips={match.manOfTheMatchList} key={(chip) => chip.id} style="display: inline">
                {#snippet chip(chip)}
                    <Chip {chip} class="man-of-the-match">
                        <span on:click={handlePlayerClick(chip.id)}>
                            {chip.name}
                        </span>
                    </Chip>
                {/snippet}
            </Set>
        </div>

        <div class="row">
            <strong>
                Scorecards:
                &nbsp;
            </strong>
            <div class="bordered-container">
                <div class="container">
                    {#each [1, 2, 3, 4] as innings}
                        {#if (innings <= totalInningsCount())}
                            <div class="innings bordered-container">
                                <div class="container">
                                    <div>
                                        <h3 style="text-align: center">
                                            {getInningsTitle(innings, match.series.gameType.name)}
                                        </h3>

                                        <DataTable style="width: 100%">
                                            <Head>
                                                <Row>
                                                    {#each ['Batsman', 'Dismissal', 'Runs', 'Balls', '4s', '6s'] as columnName}
                                                        <Cell>
                                                            {columnName}
                                                        </Cell>
                                                    {/each}
                                                </Row>
                                            </Head>

                                            <Body>
                                                {#each match.battingScores.filter(s => s.innings === innings) as score}
                                                    <Row>
                                                        <Cell>
                                                            <span class="link" on:click={handlePlayerClick(score.player.id)}>
                                                                {score.player.name}
                                                            </span>
                                                        </Cell>
                                                        <Cell>
                                                            {#if score.dismissalMode}
                                                                {#if score.dismissalMode.name === 'Bowled'}
                                                                    b&nbsp;
                                                                    <span class="link" on:click={handlePlayerClick(score.bowler.id)}>
                                                                        {score.bowler.name}
                                                                    </span>
                                                                {:else if score.dismissalMode.name === 'Run Out'}
                                                                    run out
                                                                    {#each score.fielders as fielder, index}
                                                                        {#if index > 0}
                                                                            /
                                                                        {/if}
                                                                        <span class="link" on:click={handlePlayerClick(fielder.id)}>
                                                                            {fielder.name}
                                                                        </span>
                                                                    {/each}
                                                                {:else if score.dismissalMode.name === 'Caught'}
                                                                    {#if score.fielders[0].id === score.bowler.id}
                                                                        c & b&nbsp;
                                                                        <span class="link" on:click={handlePlayerClick(score.bowler.id)}>
                                                                            {score.bowler.name}
                                                                        </span>
                                                                    {:else}
                                                                        c&nbsp;
                                                                        <span class="link" on:click={handlePlayerClick(score.fielders[0].id)}>
                                                                            {score.fielders[0].name}
                                                                        </span>
                                                                        &nbsp;b&nbsp;
                                                                        <span class="link" on:click={handlePlayerClick(score.bowler.id)}>
                                                                            {score.bowler.name}
                                                                        </span>
                                                                    {/if}
                                                                {:else if score.dismissalMode.name === 'Stumped'}
                                                                    st&nbsp;
                                                                    <span class="link" on:click={handlePlayerClick(score.fielders[0].id)}>
                                                                        {score.fielders[0].name}
                                                                    </span>
                                                                    &nbsp;b&nbsp;
                                                                    <span class="link" on:click={handlePlayerClick(score.bowler.id)}>
                                                                        {score.bowler.name}
                                                                    </span>
                                                                {:else if score.dismissalMode.name === 'LBW'}
                                                                    lbw&nbsp;
                                                                    <span class="link" on:click={handlePlayerClick(score.bowler.id)}>
                                                                        {score.bowler.name}
                                                                    </span>
                                                                {:else if score.dismissalMode.name === 'Hit Wicket'}
                                                                    Hit Wicket&nbsp;
                                                                    <span class="link" on:click={handlePlayerClick(score.bowler.id)}>
                                                                        {score.bowler.name}
                                                                    </span>
                                                                {:else if ['Retired Hurt', 'Hit Twice', 'Obstructing the Field', 'Timed Out', 'Handled the Ball'].includes(score.dismissalMode.name)}
                                                                    <span>
                                                                        {score.dismissalMode.name}
                                                                    </span>
                                                                {/if}
                                                            {:else}
                                                                <span>
                                                                    Not Out
                                                                </span>
                                                            {/if}
                                                        </Cell>
                                                        <Cell>
                                                            {score.runs}
                                                        </Cell>
                                                        <Cell>
                                                            {score.balls}
                                                        </Cell>
                                                        <Cell>
                                                            {score.fours}
                                                        </Cell>
                                                        <Cell>
                                                            {score.sixes}
                                                        </Cell>
                                                    </Row>
                                                {/each}
                                                <Row>
                                                    {#each [1, 2, 3, 4, 5] as i}
                                                        <Cell />
                                                    {/each}
                                                    <Cell>
                                                        {getTotalText(innings)}
                                                    </Cell>
                                                </Row>

                                                <Row>
                                                    {#each [1, 2, 3, 4, 5] as i}
                                                        <Cell />
                                                    {/each}
                                                    <Cell>
                                                        {getExtrasText(innings)}
                                                    </Cell>
                                                </Row>
                                            </Body>
                                        </DataTable>

                                        <DataTable style="display: block; width: 80%; margin-top: 2%; margin-left: auto; margin-right: auto">
                                            <Head>
                                                <Row>
                                                    {#each ['Bowler', 'Overs', 'Maidens', 'Runs', 'Wickets'] as columnName}
                                                        <Cell>
                                                            {columnName}
                                                        </Cell>
                                                    {/each}
                                                </Row>
                                            </Head>
                                            <Body>
                                            {#each match.bowlingFigures.filter(f => f.innings === innings) as figure}
                                                <Row>
                                                    <Cell>
                                                            <span class="link" on:click={handlePlayerClick(figure.player.id)}>
                                                                {figure.player.name}
                                                            </span>
                                                    </Cell>

                                                    <Cell>
                                                            <span>
                                                                {getOverDetails(figure.balls)}
                                                            </span>
                                                    </Cell>

                                                    <Cell>
                                                            <span>
                                                                {figure.maidens}
                                                            </span>
                                                    </Cell>

                                                    <Cell>
                                                            <span>
                                                                {figure.runs}
                                                            </span>
                                                    </Cell>

                                                    <Cell>
                                                            <span>
                                                                {figure.wickets}
                                                            </span>
                                                    </Cell>
                                                </Row>
                                            {/each}
                                            </Body>
                                        </DataTable>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
    </div>
{/if}
