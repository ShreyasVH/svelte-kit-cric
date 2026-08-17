<script>
    import TopAppBar, { Section, Row } from '@smui/top-app-bar';
    import IconButton from '@smui/icon-button';
    import SearchSelect from './searchSelect.svelte';
    import ThemeSelector from './themeSelector.svelte';
    import Drawer, {
        AppContent,
        Content,
        Header,
        Title,
        Scrim
    } from '@smui/drawer';
    import List, { Item, Text } from '@smui/list';
    import {
        goto
    } from '$app/navigation';

    const handlePlayerSelect = (event, item) => {
        const url = `/players/detail?id=${item.id}`;
        goto(url);
    };

    const handleLink = (link) => {
        goto(link);
        open = false;
    };

    let open = false;
</script>

<div class="flexy">
    <div class="drawer-container">
        <Drawer variant="modal" fixed={false} bind:open>
            <Header>
                <Title>Menu</Title>
            </Header>
            <Content>
                <List>
                    <Item
                        onclick={() => { handleLink('/') }}
                    >
                        <IconButton class="material-icons">home</IconButton>
                        <Text>Home</Text>
                    </Item>
                    <Item
                        onclick={() => { handleLink('/players/stats') }}
                    >
                        <IconButton class="material-icons">bar_chart</IconButton>
                        <Text>Players stats</Text>
                    </Item>
                </List>
            </Content>
        </Drawer>

        <Scrim fixed={false} />

        <AppContent class="app-content">
            <main class="main-content flexy">
                <div class="top-app-bar-container flexor">
                    <TopAppBar
                            variant="static"
                            color="primary"
                    >
                        <Row>
                            <Section>
                                <IconButton class="material-icons" onclick={() => (open = !open)}>menu</IconButton>
                            </Section>


                            <Section align="end" toolbar>
                                <SearchSelect onSelect={handlePlayerSelect} />

                                &nbsp;&nbsp;

                                <ThemeSelector />
                            </Section>
                        </Row>
                    </TopAppBar>
                </div>
            </main>
        </AppContent>
    </div>
</div>
