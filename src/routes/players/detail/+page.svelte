<script>
    import { getDetails as getPlayerDetails } from '../../../endpoints/players.js';
    import Chart from "chart.js/auto";
    import Card, {
        Content,
    } from '@smui/card';
    import LayoutGrid, { Cell } from '@smui/layout-grid';


    let { data } = $props();
    let player = $state({});
    let loaded = $state(false);

    $effect(async () => {
        if (data?.id) {
            loaded = false;
            const playerResponse = await getPlayerDetails(data.id);
            player = playerResponse.data.data;
            loaded = true;
        }
    });

    const getGameTypes = (gameTypes) => {
        const gameTypeIndexes = {
            'Test': 1,
            'ODI': 2,
            'T20': 3
        };

        gameTypes.sort((a, b) => gameTypeIndexes[a] - gameTypeIndexes[b]);

        return gameTypes;
    };

    const column1Fields = [
        {
            key: 'innings',
            displayName: 'Innings'
        },
        {
            key: 'runs',
            displayName: 'Runs'
        },
        {
            key: 'balls',
            displayName: 'Balls'
        },
        {
            key: 'average',
            displayName: 'Average'
        },
        {
            key: 'notOuts',
            displayName: 'Not Outs'
        },
        {
            key: 'highest',
            displayName: 'Highest'
        }
    ];

    const column2Fields = [
        {
            key: 'catches',
            displayName: 'Catches',
            statsType: 'fieldingStats'
        },
        {
            key: 'wickets',
            displayName: 'Wickets',
            statsType: 'bowlingStats'
        },
        {
            key: 'balls',
            displayName: 'Balls',
            statsType: 'bowlingStats'
        },
        {
            key: 'runs',
            displayName: 'Runs',
            statsType: 'bowlingStats'
        },
        {
            key: 'fifers',
            displayName: 'Fifers',
            statsType: 'bowlingStats'
        },
        {
            key: 'economy',
            displayName: 'Economy',
            statsType: 'bowlingStats'
        }
    ];

    const formatValue = (value, field) => {
        let formattedValue;

        switch (field) {
            case 'average':
                formattedValue = value !== null ? value.toFixed(2) : '-';
                break;
            case 'economy':
                formattedValue = value !== null ? value.toFixed(2) : '-';
                break
            default:
                formattedValue = value;
        }

        return formattedValue;
    };

    const getWrappedValue = (details, statType, gameType, key) => {
        let value = '-';

        if(details.hasOwnProperty(statType) && details[statType].hasOwnProperty(gameType) && details[statType][gameType].hasOwnProperty(key)) {
            value = formatValue(details[statType][gameType][key], key);
        }

        return value;
    };

    const getDateOfBirth = dateOfBirthString => {
        const dateOfBirth = new Date(dateOfBirthString);
        return ("0" + dateOfBirth.getDate()).slice(-2) + '/' + ("0" + (dateOfBirth.getMonth() + 1)).slice(-2) + '/' + dateOfBirth.getFullYear();
    };

    const formatDismissalStatsForRender = (stats) => {
        const colorMap = {
            Bowled: {
                backgroundColor: '#a6cee3'
            },
            Caught: {
                backgroundColor: '#1f78b4'
            },
            LBW: {
                backgroundColor: '#b2df8a'
            },
            'Run Out': {
                backgroundColor: '#33a02c'
            },
            Stumped: {
                backgroundColor: '#fb9a99'
            },
            'Hit Twice': {
                backgroundColor: '#e31a1c'
            },
            'Hit Wicket': {
                backgroundColor: '#fdbf6f'
            },
            'Obstructing the Field': {
                backgroundColor: '#ff7f00'
            },
            'Timed Out': {
                backgroundColor: '#cab2d6'
            },
            'Handled the Ball': {
                backgroundColor: '#6a3d9a'
            }
        };

        let labels = [];
        let data = [];
        let backgroundColors = [];
        let hoverBackgroundColors = [];
        for (const [dismissal, count] of Object.entries(stats)) {
            labels.push(dismissal);
            data.push(count);
            backgroundColors.push(colorMap[dismissal].backgroundColor);
            hoverBackgroundColors.push(colorMap[dismissal].hoverBackgroundColor);
        }

        return (
            {
                labels,
                datasets: [
                    {
                        backgroundColor: backgroundColors,
                        hoverBackgroundColor: hoverBackgroundColors,
                        data
                    }
                ]
            }
        );
    }

    const dismissalChart = (canvas, {stats, gameType}) => {
        let chart = new Chart(canvas, {
            type: 'doughnut',
            data: formatDismissalStatsForRender(stats),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: gameType,
                        font: {
                            size: 18,
                            weight: 'bold',
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        return {
            update(updatedStats) {
                chart.data = formatDismissalStatsForRender(updatedStats);
                chart.update();
            },

            destroy() {
                chart.destroy();
            }
        };
    };


</script>

{#if loaded}
    <h1>
        Player Details
    </h1>

    <LayoutGrid style="padding: 0">
        {#each getGameTypes(Object.keys(player.battingStats)) as gameType}
            <Cell span={4} style="display: flex; justify-content: center;">
                <Card class="mdc-elevation--z12" style="max-width: 300px; text-align: center;">
                    <Content class="mdc-typography--body2">
                        <h2 class="mdc-typography--headline6" style="margin: 0;">
                            {player.name}
                        </h2>
                        <h3
                                class="mdc-typography--subtitle2"
                                style="margin: 0 0 10px; color: #888;"
                        >
                            {gameType}
                        </h3>

                        <img src="https://res.cloudinary.com/dyoxubvbg/image/upload/v1577106216/artists/default_m.jpg" alt="{player.name}" height="200" width="200" style="margin-left: auto; margin-right: auto" />

                        <div style="text-align: left">
                            <LayoutGrid style="padding: 0">
                                <Cell span={6}>
                                    {#each column1Fields as field}
                                    <p>
                                        <strong>{field.displayName}:</strong>
                                        {getWrappedValue(player, 'battingStats', gameType, field.key)}
                                    </p>
                                    {/each}

                                    <p>
                                        <strong>50/100:</strong>
                                        {getWrappedValue(player, 'battingStats', gameType, 'fifties')}/{getWrappedValue(player, 'battingStats', gameType, 'hundreds')}
                                    </p>
                                </Cell>

                                <Cell span={6}>
                                    {#each column2Fields as field}
                                        <p>
                                            <strong>{field.displayName}:</strong>
                                            {getWrappedValue(player, field.statsType, gameType, field.key)}
                                        </p>
                                    {/each}

                                    <p>
                                        <strong>DOB:</strong>
                                        {getDateOfBirth(player.dateOfBirth)}
                                    </p>
                                </Cell>
                            </LayoutGrid>
                        </div>
                    </Content>
                </Card>
            </Cell>
        {/each}
    </LayoutGrid>

    <br />
    <hr />
    <br />

    <h2>Dismissal Stats</h2>

    <LayoutGrid style="padding: 0">
        {#each getGameTypes(Object.keys(player.dismissalStats)) as gameType}
            <Cell span={4}>
                <canvas use:dismissalChart={{stats: player.dismissalStats[gameType], gameType}} width="400" height="400"></canvas>
            </Cell>
        {/each}
    </LayoutGrid>
{/if}
