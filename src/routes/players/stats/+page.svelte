<script>
import Fab, { Icon } from '@smui/fab';
import Dialog, { Header } from '@smui/dialog';
import TopAppBar from '@smui/top-app-bar';
import IconButton from '@smui/icon-button';
import Button from '@smui/button';
import Filters from '../../../components/filters.svelte';
import { FILTER_TYPE } from '../../../constants';
import { onMount } from 'svelte';
import { getStats } from '../../../endpoints/players';
import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';

const getDefaultFilterOptions = () => ({
        type: {
            displayName: 'Type',
            type: FILTER_TYPE.RADIO,
            values: [
                {
                    id: 'batting',
                    name: 'Batting'
                },
                {
                    id: 'bowling',
                    name: 'Bowling'
                },
                {
                    id: 'fielding',
                    name: 'Fielding'
                }
            ]
        },
        gameType: {
            displayName: 'Game Type',
            type: FILTER_TYPE.CHECKBOX,
            values: [
                {
                    id: '1',
                    name: 'ODI'
                },
                {
                    id: '2',
                    name: 'TEST'
                },
                {
                    id: '3',
                    name: 'T20'
                }
            ]
        },
        teamType: {
            displayName: 'Team Type',
            type: FILTER_TYPE.CHECKBOX,
            values: [
                {
                    id: '1',
                    name: 'INTERNATIONAL'
                },
                {
                    id: '2',
                    name: 'DOMESTIC'
                },
                {
                    id: '3',
                    name: 'FRANCHISE'
                }
            ]
        },
        year: {
            displayName: 'Year',
            type: FILTER_TYPE.RANGE
        },
        number: {
            displayName: 'Position',
            type: FILTER_TYPE.CHECKBOX,
            values: [...Array(11).keys()].map(i => ({ id: String(i + 1), name: i + 1 }))
        },
    });

let isFilterOpen = false;
let stats = [];
let totalCount = 0;
let selectedFilters = {
    type: 'fielding'
};
let selectedFiltersTemp = {
    type: 'fielding'
};
let page = 1;
let sortMap = {
    'runs': 'desc'
};
let filterOptions = getDefaultFilterOptions();
let loaded = false;
const limit = 10;

const handleFilterOpen = () => {
    console.log('opening filters');
    isFilterOpen = true;
};

const handleFilterClose = () => {
    console.log('closing filters');
    isFilterOpen = false;
};

const updateData = (selectedPage, selectedSortMap) => {
    const payload = {
        type: 'batting',
        filters: {},
        rangeFilters: {},
        count: limit,
        offset: (selectedPage - 1) * limit,
        sortMap: selectedSortMap
    };

    const rangeFilterKeys = [
        'year'
    ];

    const allowedSortKeys = {
        'batting': [
            'runs',
            'innings',
            'balls',
            'notOuts',
            'highest',
            'fours',
            'sixes',
            'fifties',
            'hundreds'
        ],
        'bowling': [
            'wickets',
            'innings',
            'runs',
            'balls',
            'maidens',
            'fifers',
            'tenWickets'
        ],
        'fielding': [
            'fielderCatches',
            'keeperCatches',
            'stumpings',
            'runOuts'
        ]
    };

    for (const [key, values] of Object.entries(selectedFiltersTemp)) {
        if (key === 'type') {
            payload.type = values;
            if (!allowedSortKeys[payload.type].includes(Object.keys(sortMap)[0])) {
                selectedSortMap = {
                    [allowedSortKeys[payload.type][0]]: 'desc'
                };
                payload.sortMap = selectedSortMap;
            }
        } else if (rangeFilterKeys.indexOf(key) !== -1) {
            payload.rangeFilters[key] = values;
        } else {
            payload.filters[key] = values;
        }
    }

    getStats(payload).then(statsResponse => {
        stats = statsResponse.data.data.stats;
        totalCount = statsResponse.data.data.count;
        loaded = true;
        selectedFilters = selectedFiltersTemp;
        handleFilterClose();
        page = selectedPage;
        sortMap = selectedSortMap;
    });
};

onMount(() => {
    Promise.all([
        updateData(1, sortMap),
        //getAllTeams(),
        //getAllStadiums()
    ]).then(([_]) => {
    }).catch(error => console.log(error))
});

</script>

<div>
    {#if loaded}
        {#if selectedFilters.type === 'batting'}
            <DataTable style="width: 100%">
                <Head>
                    <Row>
                        <Cell head>
                            Player ID
                        </Cell>
                        <Cell head>
                            Name
                        </Cell>
                        <Cell head>
                            Innings
                        </Cell>
                        <Cell head>
                            Runs
                        </Cell>
                        <Cell head>
                            Balls
                        </Cell>
                        <Cell head>
                            Not Outs
                        </Cell>
                        <Cell head>
                            Highest
                        </Cell>
                        <Cell head>
                            4s
                        </Cell>
                        <Cell head>
                            6s
                        </Cell>
                        <Cell head>
                            50s
                        </Cell>
                        <Cell head>
                            100s
                        </Cell>
                    </Row>
                </Head>

                <Body>
                    {#each stats as stat}
                        <Row>
                            <Cell>
                                {stat.id}
                            </Cell>
                            <Cell>
                                {stat.name}
                            </Cell>
                            <Cell>
                                {stat.innings}
                            </Cell>
                            <Cell>
                                {stat.runs}
                            </Cell>
                            <Cell>
                                {stat.balls}
                            </Cell>
                            <Cell>
                                {stat.notOuts}
                            </Cell>
                            <Cell>
                                {stat.highest}
                            </Cell>
                            <Cell>
                                {stat.fours}
                            </Cell>
                            <Cell>
                                {stat.sixes}
                            </Cell>
                            <Cell>
                                {stat.fifties}
                            </Cell>
                            <Cell>
                                {stat.hundreds}
                            </Cell>
                        </Row>
                    {/each}
                </Body>
            </DataTable>
        {/if}

        {#if selectedFilters.type === 'bowling'}
            <DataTable style="width: 100%">
                <Head>
                    <Row>
                        <Cell head>
                            Player ID
                        </Cell>
                        <Cell head>
                            Name
                        </Cell>
                        <Cell head>
                            Innings
                        </Cell>
                        <Cell head>
                            Wickets
                        </Cell>
                        <Cell head>
                            Runs
                        </Cell>
                        <Cell head>
                            Balls
                        </Cell>
                        <Cell head>
                            Maidens
                        </Cell>
                        <Cell head>
                            Fifers
                        </Cell>
                        <Cell head>
                            Ten Wickets
                        </Cell>
                    </Row>
                </Head>

                <Body>
                    {#each stats as stat}
                        <Row>
                            <Cell>
                                {stat.id}
                            </Cell>
                            <Cell>
                                {stat.name}
                            </Cell>
                            <Cell>
                                {stat.innings}
                            </Cell>
                            <Cell>
                                {stat.wickets}
                            </Cell>
                            <Cell>
                                {stat.runs}
                            </Cell>
                            <Cell>
                                {stat.balls}
                            </Cell>
                            <Cell>
                                {stat.maidens}
                            </Cell>
                            <Cell>
                                {stat.fifers}
                            </Cell>
                            <Cell>
                                {stat.tenWickets}
                            </Cell>
                        </Row>
                    {/each}
                </Body>
            </DataTable>
        {/if}

        {#if selectedFilters.type === 'fielding'}
            <DataTable style="width: 100%">
                <Head>
                    <Row>
                        <Cell head>
                            Player ID
                        </Cell>
                        <Cell head>
                            Name
                        </Cell>
                        <Cell head>
                            Fielder Catches
                        </Cell>
                        <Cell head>
                            Keeper Catches
                        </Cell>
                        <Cell head>
                            Stumpings
                        </Cell>
                        <Cell head>
                            Run Outs
                        </Cell>
                    </Row>
                </Head>

                <Body>
                    {#each stats as stat}
                        <Row>
                            <Cell>
                                {stat.id}
                            </Cell>
                            <Cell>
                                {stat.name}
                            </Cell>
                            <Cell>
                                {stat.fielderCatches}
                            </Cell>
                            <Cell>
                                {stat.keeperCatches}
                            </Cell>
                            <Cell>
                                {stat.stumpings}
                            </Cell>
                            <Cell>
                                {stat.runOuts}
                            </Cell>
                        </Row>
                    {/each}
                </Body>
            </DataTable>
        {/if}

        <Filters
            open={isFilterOpen}
            onFilterOpen={handleFilterOpen}
            onFilterClose={handleFilterClose}
        />
    {/if}
</div>

<style>

</style>