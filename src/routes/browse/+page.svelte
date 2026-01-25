<script>
    import { onMount } from 'svelte';
    import { getAllYears, getToursForYear } from '../../endpoints/tours';
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import Button from '@smui/button';
    import Card, { Content } from '@smui/card';
    import { formatDateTimeString } from '../../utils';

    export let data;
    export let selectedYear = data?.year;
    let years = [];
    let tours = [];

    const pageSize = 25;
    let currentPage = 1;

    const loadTours = async () => {
        let finalTours = [];
        let totalPages = 1;

        do {
            const toursResponse = await getToursForYear(selectedYear, currentPage, pageSize);
            finalTours = finalTours.concat(toursResponse.data.data.items);
            if (currentPage === 1) {
                totalPages = Math.ceil(toursResponse.data.data.totalCount / pageSize);
            }
        } while (currentPage++ < totalPages);
        tours = finalTours;
    }

    onMount(async () => {
        const yearsResponse = await getAllYears();
        years = yearsResponse.data.data;

        await loadTours();
    });

    const handleYearClick = async (year) => {
        window.location.href = '/browse?year=' + year;
    }

    const handleTourClick = async (tourId) => {
        window.location.href = '/tours/detail?id=' + tourId;
    }
</script>

<LayoutGrid style="padding: 0">
    <Cell span={9}>
        <h2 style="text-align: center; margin-top: 0">
            Tours for {selectedYear}:
        </h2>

        {#each tours as tour}
            <Card style="margin-bottom: 1%; cursor: pointer" onclick={() => handleTourClick(tour.id)}>
                <Content>
                    <span>
                        {tour.name}
                    </span>

                    <span style="float: right">
                        {formatDateTimeString(tour.startTime)}
                    </span>
                </Content>
            </Card>
        {/each}
    </Cell>

    <Cell span={3}>
        <h2 style="text-align: center; margin-bottom: 1%">Years:</h2>

        {#each years as currentYear}
            <Button style="margin-left: 1%; margin-right: 1%" variant={(currentYear === selectedYear) ? 'raised' : 'outlined'} color="secondary" onclick={() => handleYearClick(currentYear)}>
                {currentYear}
            </Button>
        {/each}
    </Cell>
</LayoutGrid>