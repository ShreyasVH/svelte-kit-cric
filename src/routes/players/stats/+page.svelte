<script>
import Fab, { Icon } from '@smui/fab';
import Dialog, { Header } from '@smui/dialog';
import TopAppBar from '@smui/top-app-bar';
import IconButton from '@smui/icon-button';
import Button from '@smui/button';



let open = false;

const showFilters = () => {
    console.log('showing');
    open = true;
};

const hideFilters = () => {
    console.log('hiding');
    open = false;
};

</script>

<div>
    Stats

    <Fab color="primary" style="position:absolute; bottom: 16px; right: 16px" on:click={showFilters}>
        <Icon class="material-icons">filter_list</Icon>
    </Fab>

    <Dialog bind:open class="full-dialog">
        <div>
            <TopAppBar
                    variant="static"
                    color="primary"
                     class="toolbar"
            >
                <IconButton on:click={hideFilters} class="material-icons">close</IconButton>

                <Button style="display: inline; color: black; height: 48px;">
                    Apply
                </Button>
            </TopAppBar>

            <div tabindex="0">
                Filters
            </div>
        </div>
    </Dialog>
</div>

<style>
:global(.full-dialog .mdc-dialog__container) {
    width: 100vw !important;
    height: 100vh !important;
    margin: 0;
    padding: 0;
  }

:global(.full-dialog .mdc-dialog__surface) {
    width: 100vw !important;
    height: 100vh !important;
    max-width: none !important;
    max-height: none !important;
    border-radius: 0 !important;
  }

  :global(.toolbar) {
    display: flex;
      flex-direction: row;      /* put them in a row */
      justify-content: flex-start;
  }

  :global(.toolbar > button) {
    flex: 0 0 auto;
  }
</style>