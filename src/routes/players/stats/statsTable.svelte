<script>
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';

    export let columns = {};
    export let selectedFilters = {};
    export let stats = [];
    export let sortMap = {};
    export let handleSort;

    let sortKey = 'runs';
    let sortOrder = 'desc';
    let sortSymbol = '\u0020\u2193';

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

<DataTable style="width: 100%">
    <Head>
        <Row>
            {#each columns[statsType] as column}
                <Cell
                    head
                    class={`${column.sortable ? "sortable" : ""}`}
                    on:click={() => handleSort(column.key, statsType)}
                >
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

<style>
    :global(.sortable) {
        cursor: pointer;
    }
</style>