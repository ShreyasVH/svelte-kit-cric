<script>
    import { onMount } from 'svelte';
    import { getTour } from '../../../endpoints/tours';
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import Button from '@smui/button';
    import Card, { Content } from '@smui/card';
    import { formatDateTimeString } from '../../../utils';

    export let data;
    let tour = {};
    let loaded = false;

    onMount(async () => {
        const tourResponse = await getTour(data.id);
        tour = tourResponse.data.data;
        loaded = true;
    });

    const handleSeriesClick = async (seriesId) => {
        console.log(seriesId);
    }
</script>

{#if loaded}
    <h2 style="margin-bottom: 1%">
        {tour.name}
    </h2>

    {#each tour.seriesList as series}
        <Card style="margin-bottom: 1%" on:click={() => handleSeriesClick(series.id)}>
            <Content>
            <span>
                {series.gameType.name}
            </span>

                <span style="float: right">
                {formatDateTimeString(series.startTime)}
            </span>
            </Content>
        </Card>
    {/each}
{/if}
