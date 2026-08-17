<script>
    import { onMount } from 'svelte';
    import { getAllYears, getToursForYear } from '../../endpoints/tours';
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import Button from '@smui/button';
    import Card, { Content } from '@smui/card';
    import { formatDateTimeString } from '../../utils';
    import { goto } from '$app/navigation';

    let { data } = $props();
    let year = $state((new Date()).getFullYear());
    let years = $state([]);
    let tours = $state([]);
    let loaded = $state(false);
    let page = $state(1);
    let totalPages = $state(1);

    let loadMoreElement;
    const pageSize = 25;

    const loadTours = async (selectedYear, selectedPage) => {
        const toursResponse = await getToursForYear(selectedYear, selectedPage, pageSize);
        const toursData = toursResponse.data.data;

        let finalTours = [];
        if (page === 1) {
            const totalCount = toursData.totalCount;
            totalPages = Math.ceil(totalCount / pageSize);
            finalTours = toursData.items;
        } else {
            finalTours = tours.concat(toursData.items);
        }
        page = selectedPage;

        tours = finalTours;
    }

    const handleScroll = () => {
        if (tours.length > 0 && page < totalPages) {
            page++;
        }
    }

    onMount(async () => {
        const yearsResponse = await getAllYears();
        years = yearsResponse.data.data;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    handleScroll();
                }
            },
            {
                root: null,
                rootMargin: '50px',
                threshold: 0
            }
        );

        if (loadMoreElement) {
            observer.observe(loadMoreElement);
        }

        return () => {
            observer.disconnect();
        };
    });

    $effect(() => {
        const selectedYear = data?.year ?? new Date().getFullYear();

        if (selectedYear !== year) {
            year = selectedYear;
            page = 1;
            tours = [];
        }
    });

    $effect(async () => {
        const selectedYear = year;
        const currentPage = page;

        loaded = false;

        await loadTours(selectedYear, currentPage);

        loaded = true;
    });



    const handleYearClick = async (year) => {
        goto(`/browse?year=${year}`);
    }

    const handleTourClick = async (tourId) => {
        goto(`/tours/detail?id=${tourId}`);
    }
</script>

<LayoutGrid style="padding: 0">
    <Cell span={9}>
        <h2 style="text-align: center; margin-top: 0">
            Tours for {year}:
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

        <div
            bind:this={loadMoreElement}
            style="height: 1px"
        ></div>
    </Cell>

    <Cell span={3}>
        <h2 style="text-align: center; margin-bottom: 1%">Years:</h2>

        {#each years as currentYear}
            <Button style="margin-left: 1%; margin-right: 1%" variant={(currentYear === year) ? 'raised' : 'outlined'} color="secondary" onclick={() => handleYearClick(currentYear)}>
                {currentYear}
            </Button>
        {/each}
    </Cell>
</LayoutGrid>