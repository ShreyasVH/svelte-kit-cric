<script>
    import Button from '@smui/button';
    import Dialog from '@smui/dialog';
    import CircularProgress from '@smui/circular-progress';
    import { onMount } from 'svelte';

    let open = false;

    onMount(() => {
        window.addEventListener('show-loader', function(event) {
            open = true;
        });

        window.addEventListener('hide-loader', function(event) {
            open = false;
        });
    });
</script>

<div>
    <Dialog bind:open surface$style="background: transparent; box-shadow: none;" scrimClickAction="">
        <div tabindex="0">
        </div>
        <div style="text-align: center;">
            <CircularProgress style="height: 50px; width: 50px;" indeterminate />
        </div>
    </Dialog>
</div>
