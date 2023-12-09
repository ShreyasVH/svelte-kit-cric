<script>
    import AppBar from '../components/appBar.svelte'
</script>

<div>
    <AppBar />
    <div style="padding: 2%">
        <slot />
    </div>
</div>