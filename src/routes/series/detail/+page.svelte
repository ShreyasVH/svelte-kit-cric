<script>
    import { onMount } from 'svelte';
    import { getSeries } from '../../../endpoints/series';
    import { removeMatch } from '../../../endpoints/matches';
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import Card, { Content } from '@smui/card';
    import Button from '@smui/button';
    import { formatDateTimeString, copyObject } from '../../../utils';

    export let data;
    let series = {};
    let loaded = false;

    onMount(async () => {
        const seriesResponse = await getSeries(data.id);
        series = seriesResponse.data.data;
        loaded = true;
    });

    const handleMatchClick = async (matchId) => {
        window.location.href = '/matches/detail?id=' + matchId;
    }

    const handleDeleteMatchClick = async (matchId, event) => {
        event.preventDefault();
        event.stopPropagation();
        const deleteResponse = await removeMatch(matchId);
        if (deleteResponse.status === 200) {
            const updatedSeries = copyObject(series);
            updatedSeries.matches = series.matches.filter(m => m.id !== matchId);
            series = updatedSeries;
            // TODO: add success alert snackbar
        } else {
            // TODO: add failure alert snackbar
        }
    }

    const getWinMargin = (winMargin, winMarginType) => {
        let margin = winMarginType.toLowerCase();

        if (winMargin > 1) {
            margin += 's';
        }

        return margin;
    };

    const renderWinner = match => {
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

    const renderStadiumDetails = stadium => {
        return stadium.name + ', ' + stadium.country.name;
    }
</script>

{#if loaded}
    <h2 style="margin-top: 0; margin-bottom: 1%">
        {series.name + ' - ' + series.gameType.name}
    </h2>

    {#each series.matches as match, index}
        <Card style="margin-bottom: 1%; cursor: pointer" on:click={() => handleMatchClick(match.id)}>
            <Content>
                <LayoutGrid style="padding: 0">
                    <Cell span={4}>
                        <span>
                            {(index + 1) + '. ' + match.team1.name + ' v/s ' + match.team2.name}
                        </span>

                        <span style="display: block">
                            {renderWinner(match)}
                        </span>

                        <Button style="background-color: #ef5350; color: white;" variant="raised" on:click={(event) => handleDeleteMatchClick(match.id, event)}>
                            DELETE
                        </Button>
                    </Cell>

                    <Cell span={4} style="text-align: center">
                        <span>
                            {renderStadiumDetails(match.stadium)}
                        </span>
                    </Cell>

                    <Cell span={4}>
                        <span style="float: right">
                            {formatDateTimeString(match.startTime)}
                        </span>
                    </Cell>
                </LayoutGrid>
            </Content>
        </Card>
    {/each}
{/if}
