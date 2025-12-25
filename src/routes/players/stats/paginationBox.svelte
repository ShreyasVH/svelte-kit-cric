<script>

export let page = 1;
export let limit = 10;
export let totalCount = 0;
export let goToPage;

let totalPages = 0;
let pageRange = [];

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

</script>

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

<style>
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