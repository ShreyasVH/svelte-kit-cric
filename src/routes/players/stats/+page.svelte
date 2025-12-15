<script>
import Filters from '../../../components/filters.svelte';
import { FILTER_TYPE } from '../../../constants';
import { onMount } from 'svelte';
import { getStats } from '../../../endpoints/players';
import { getAllTeams } from '../../../endpoints/teams';
import { getAllStadiums } from '../../../endpoints/stadiums';
import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
import { copyObject, showLoader, hideLoader } from '../../../utils';

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
    type: 'batting'
}
let selectedFiltersTemp = {
    type: 'batting'
};
let page = 1;
let sortMap = {
    'runs': 'desc'
};
let filterOptions = getDefaultFilterOptions();
let loaded = false;
const limit = 10;

let totalPages = 0;
let pageRange = [];

let sortKey = 'runs';
let sortOrder = 'desc';
let sortSymbol = '\u0020\u2193';

const columns = {
    batting: [
         {
              displayKey: 'Name',
              key: 'name',
              sortable: false
         },
         {
              displayKey: 'Innings',
              key: 'innings',
              sortable: true
         },
         {
             displayKey: 'Runs',
             key: 'runs',
             sortable: true
         },
         {
              displayKey: 'Balls',
              key: 'balls',
              sortable: true
         },
         {
              displayKey: 'Not Outs',
              key: 'notOuts',
              sortable: true
         },
         {
              displayKey: 'Highest',
              key: 'highest',
              sortable: true
         },
         {
              displayKey: '4s',
              key: 'fours',
              sortable: true
         },
         {
              displayKey: '6s',
              key: 'sixes',
              sortable: true
         },
         {
              displayKey: '50s',
              key: 'fifties',
              sortable: true
         },
         {
              displayKey: '100s',
              key: 'hundreds',
              sortable: true
         }
    ],
    bowling: [
         {
              displayKey: 'Name',
              key: 'name',
              sortable: false
         },
         {
              displayKey: 'Innings',
              key: 'innings',
              sortable: true
         },
         {
              displayKey: 'Wickets',
              key: 'wickets',
              sortable: true
         },
         {
             displayKey: 'Runs',
             key: 'runs',
             sortable: true
         },
         {
              displayKey: 'Balls',
              key: 'balls',
              sortable: true
         },
         {
              displayKey: 'Maidens',
              key: 'maidens',
              sortable: true
         },
         {
              displayKey: 'fifers',
              key: 'fifers',
              sortable: true
         },
         {
              displayKey: 'Ten Wickets',
              key: 'tenWickets',
              sortable: true
         }
    ],
    fielding: [
         {
              displayKey: 'Name',
              key: 'name',
              sortable: false
         },
         {
            displayKey: 'Fielder Catches',
            key: 'fielderCatches',
            sortable: true
         },
         {
              displayKey: 'Keeper Catches',
              key: 'keeperCatches',
              sortable: true
         },
         {
              displayKey: 'Stumpings',
              key: 'stumpings',
              sortable: true
         },
         {
              displayKey: 'Run Outs',
              key: 'runOuts',
              sortable: true
         }
    ]
};

const handleFilterOpen = () => {
    isFilterOpen = true;
    selectedFiltersTemp = selectedFilters
};

const handleFilterClose = () => {
    isFilterOpen = false;
};

const updateData = (selectedPage, selectedSortMap) => {
    showLoader();
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
        selectedFilters = selectedFiltersTemp;
        handleFilterClose();
        page = selectedPage;
        sortMap = selectedSortMap;
        loaded = true;
        hideLoader();
    });
};

onMount(() => {
    Promise.all([
        updateData(1, sortMap),
        getAllTeams(),
        getAllStadiums()
    ]).then(([_, allTeams, allStadiums]) => {
        const updatedFilterOptions = copyObject(filterOptions);
        updatedFilterOptions['team'] = {
            displayName: 'Team',
            type: FILTER_TYPE.CHECKBOX,
            values: allTeams.map(team => ({
                id: team.id,
                name: team.name
            }))
        };
        updatedFilterOptions['opposingTeam'] = {
            displayName: 'Opposing Team',
            type: FILTER_TYPE.CHECKBOX,
            values: allTeams.map(team => ({
                id: team.id,
                name: team.name
            }))
        };
        updatedFilterOptions['stadium'] = {
            displayName: 'Stadium',
            type: FILTER_TYPE.CHECKBOX,
            values: allStadiums.map(stadium => ({
                id: stadium.id,
                name: stadium.name
            }))
        };

        filterOptions = updatedFilterOptions;
    }).catch(error => console.log(error))
});

const goToPage = selectedPage => {
    updateData(selectedPage, sortMap);
};

const handleSort = (key, type) => {
    const columnConfig = columns[type].filter(column => key === column.key);
    if (columnConfig.length === 1 && columnConfig[0].sortable) {
        const order = ((sortMap.hasOwnProperty(key) && sortMap[key] === 'desc') ? 'asc' : 'desc');
        updateData(1, {
            [key]: order
        });
    }
};

const handleApplyFilters = () => {
    updateData(1, sortMap);
};

const handleFilterEvent = (event) => {
    let tempFilters = copyObject(selectedFiltersTemp);

    switch (event.filterType) {
        case FILTER_TYPE.CHECKBOX: {
            const key = event.filterKey;
            const id = event.optionId;
            const target = event.target;
            const checked = target.checked;

            if (checked) {
                if (tempFilters.hasOwnProperty(key)) {
                    tempFilters[key].push(id);
                } else {
                    tempFilters[key] = [
                        id
                    ];
                }
            } else {
                let index = tempFilters[key].indexOf(id);
                tempFilters[key].splice(index, 1);
            }
            if (tempFilters[key].length === 0) {
                delete tempFilters[key];
            }
            break;
        }
        case FILTER_TYPE.RADIO: {
            const key = event.filterKey;
            const id = event.optionId;

            tempFilters[key] = id;
            break;
        }
        case FILTER_TYPE.RANGE: {
            const key = event.filterKey;
            const type = event.rangeType;
            const newValue = event.key;

            if (Array.from({ length: 10 }, (_, i) => i.toString()).includes(newValue)) {
                let value = '';
                if (!tempFilters[key]) {
                    tempFilters[key] = {};
                } else {
                    if (tempFilters[key].hasOwnProperty(type)) {
                        value = tempFilters[key][type];
                    }
                }

                value += newValue;
                tempFilters[key][type] = value;
            }

            break;
        }
    }

    selectedFiltersTemp = tempFilters;
}

const handleClearFilter = key => {
    let tempFilters = copyObject(selectedFiltersTemp);

    delete tempFilters[key];

    selectedFiltersTemp = tempFilters;
};

const handleClearAllFilters = () => {
    let tempFilters = copyObject(selectedFiltersTemp);

    for (const key of Object.keys(tempFilters)) {
        if (key !== 'type') {
            delete tempFilters[key];
        }
    }

    selectedFiltersTemp = tempFilters;
}

$: totalPages = totalCount > 0 ? Math.ceil(totalCount / limit) : 0;

$: {
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  const range = [];
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  pageRange = range;
}

$: {
    sortKey = Object.keys(sortMap)[0];
    sortOrder = sortMap[sortKey];
    sortSymbol = ((sortOrder === 'asc') ? '\u0020\u2191' : '\u0020\u2193');
}

let statsType;
$: {
    statsType = selectedFilters.type;
}

</script>

<div>
    {#if loaded}
        <DataTable style="width: 100%">
            <Head>
                <Row>
                    {#each columns[statsType] as column}
                        <Cell head class={`${column.sortable ? "sortable" : ""}`} on:click={() => handleSort(column.key, statsType)}>
                            {column.displayKey}
                            {#if sortKey === column.key}
                                    <span>
                                        {sortSymbol}
                                    </span>
                            {/if}
                        </Cell>
                    {/each}
                </Row>
            </Head>

            <Body>
            {#each stats as stat}
                <Row>
                    {#each columns[statsType] as column}
                        <Cell>
                            {stat[column.key]}
                        </Cell>
                    {/each}
                </Row>
            {/each}
            </Body>
        </DataTable>

        <div class="pagination-box">
            {#if page > 2}
                <div role="button" class="pagination-button" on:click={() => goToPage(1)}>
                    {'<<'}
                </div>
            {/if}

            {#if page > 1}
                <div role="button" class="pagination-button" on:click={() => goToPage(page - 1)}>
                    {'<'}
                </div>
            {/if}

            {#each pageRange as i }
                <div role="button" class={`${"pagination-button"} ${page === i ? "active" : ""}`} on:click={() => goToPage(i)}>
                    {i}
                </div>
            {/each}

            {#if page < totalPages - 1}
                <div role="button" class="pagination-button" on:click={() => goToPage(page + 1)}>
                    {'>'}
                </div>
            {/if}

            {#if page < totalPages - 2}
                <div role="button" class="pagination-button" on:click={() => goToPage(totalPages)}>
                    {'>>'}
                </div>
            {/if}
        </div>

        <Filters
            open={isFilterOpen}
            onFilterOpen={handleFilterOpen}
            onFilterClose={handleFilterClose}
            options={filterOptions}
            selected={selectedFiltersTemp}
            applyFilters={handleApplyFilters}
            handleEvent={handleFilterEvent}
            clearFilter={handleClearFilter}
            clearAllFilters={handleClearAllFilters}
        />
    {/if}
</div>

<style>
:global(.sortable) {
    cursor: pointer;
}

.pagination-box {
    text-align: center;
    margin-top: 2%;
}

.pagination-box .active {
    background-color: #303F9F;
    color: #FFFFFF;
    border: 1px solid #303F9F;
    border-radius: 10%;
}

.pagination-button {
    display: inline-block;
    padding: 1% 1.5%;
    cursor: pointer;
    font-weight: large;
    margin-left: 0.25%;
    margin-right: 0.25%;
    border-radius: 0;
}

.pagination-button:hover {
    background-color: #303F9F;
    color: #FFFFFF;
    border: 1px solid #303F9F;
    border-radius: 10%;
}
</style>