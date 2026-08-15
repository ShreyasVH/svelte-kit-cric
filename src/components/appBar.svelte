<script>
    import TopAppBar, { Section, Row } from '@smui/top-app-bar';
    import IconButton from '@smui/icon-button';
    import SearchSelect from './searchSelect.svelte';
    import ThemeSelector from './themeSelector.svelte';
    import {
        goto
    } from '$app/navigation';

    const handlePlayerSelect = (event, item) => {
        const url = `/players/detail?id=${item.id}`;
        goto(url);
    };
</script>

<div class="flexy">
    <div class="top-app-bar-container flexor">
        <TopAppBar
                variant="static"
                color="primary"
        >
            <Row>
                <Section>
                    <IconButton class="material-icons">menu</IconButton>
                </Section>


                <Section align="end" toolbar>
                    <SearchSelect onSelect={handlePlayerSelect} />

                    &nbsp;&nbsp;

                    <ThemeSelector />
                </Section>
            </Row>
        </TopAppBar>
    </div>
</div>
