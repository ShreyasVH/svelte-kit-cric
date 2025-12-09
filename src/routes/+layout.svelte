<script>
    import AppBar from '../components/appBar.svelte'
    import Loader from '../components/loader.svelte'
</script>

<div>
    <AppBar />
    <Loader />
    <div style="padding: 2%">
        <slot />
    </div>
</div>