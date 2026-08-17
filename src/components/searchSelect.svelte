<script>
    import Textfield from '@smui/textfield';
    import { search } from '../endpoints/players.js';

    let { onSelect } = $props();

    let keyword = $state('');
    let open = $state(false);
    let options = $state([]);

    const searchItems = async (value) => {
        let choices = [];

        const response = await search(value);
        const data = response.data.data;
        choices = data.items;

        return choices;
    }

    const handleChange = async (event) => {
        event.preventDefault();
        const value = event.target.value;
        if (value.length >= 2) {
            options = await searchItems(value);
            open = true;
        } else {
            open = false;
            options = [];
        }
        keyword = value;
    };

    const handleSelect = (event, item) => {
        onSelect && onSelect(event, item);
        open = false;
        keyword = '';
    };
</script>

<div class="search-select">
    <Textfield style="width: 100%" variant="outlined" bind:value={keyword} label="Search" oninput={handleChange} />

    {#if open}
        <div class="search-dropdown">
            {#each options as item}
                <button
                        type="button"
                        class="search-item"
                        onclick={(event) => handleSelect(event, item)}
                >
                    {item.name}
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    .search-select {
        position: relative;
        width: 300px;
    }

    .search-dropdown {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;

        border-radius: 4px;

        max-height: 250px;
        overflow-y: auto;

        z-index: 1000;
    }

    .search-item {
        display: block;
        width: 100%;
        padding: 12px 16px;

        border: none;
        background: transparent;
        color: inherit;
        text-align: left;
        cursor: pointer;
    }

    .search-item:hover {
        background: rgba(128, 128, 128, 0.15);
    }
</style>