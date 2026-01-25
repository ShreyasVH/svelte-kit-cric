<script>
import Fab, { Icon } from '@smui/fab';
import Dialog from '@smui/dialog';
import TopAppBar from '@smui/top-app-bar';
import IconButton from '@smui/icon-button';
import Button from '@smui/button';
import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
import { FILTER_TYPE } from '../constants';
import Radio from '@smui/radio';
import FormField from '@smui/form-field';
import Checkbox from '@smui/checkbox';
import Textfield from '@smui/textfield';

export let open = false;
export let onFilterOpen;
export let onFilterClose;
export let options;
export let selected;
export let applyFilters;
export let handleEvent;
export let clearFilter;
export let clearAllFilters;

let selectedValues = {};

const openFilters = (event) => onFilterOpen && onFilterOpen(event);

const closeFilters = event => onFilterClose && onFilterClose(event);

const isRadioFilter = (key) => {
    return options.hasOwnProperty(key) && options[key].type === FILTER_TYPE.RADIO;
};

const isCheckboxFilter = (key) => {
    return options.hasOwnProperty(key) && options[key].type === FILTER_TYPE.CHECKBOX;
};

const isRangeFilter = (key) => {
    return options.hasOwnProperty(key) && options[key].type === FILTER_TYPE.RANGE;
};

const isCheckboxChecked = (key, id) => {
    let selectedFilters = selected;
    return selectedFilters.hasOwnProperty(key) && (selectedFilters[key].indexOf(id) !== -1);
};

const handleApplyFilters = (event) => applyFilters && applyFilters();

const handleFilterEvent = event => handleEvent && handleEvent(event);

const handleClearFilter = key => clearFilter && clearFilter(key);

const handleClearAllFilters = () => clearAllFilters && clearAllFilters();

$: {
    for (const [key, filter] of Object.entries(options)) {
        const filterType = filter.type;

        switch (filterType) {
            case FILTER_TYPE.RANGE:
            {
                selectedValues[key] = {
                    from: '',
                    to: ''
                };
                if (selected.hasOwnProperty(key)) {
                    selectedValues[key].from = selected[key].from ?? '';
                    selectedValues[key].to = selected[key].to ?? '';
                }
                break;
            }
        }
    }
}

let activeFilters = [];
let isAnyFilterSelected = false;
$: {
    activeFilters = Object.keys(selected);

    isAnyFilterSelected = Object.keys(selected).filter(k => k !== 'type').length > 0;
}

</script>

<div>
    <Fab color="primary" style="position:absolute; bottom: 16px; right: 16px" onclick={openFilters}>
        <Icon class="material-icons">filter_list</Icon>
    </Fab>

    <Dialog bind:open class="full-dialog">
        <div>
            <TopAppBar
                    variant="static"
                    color="primary"
                     class="toolbar"
            >
                <IconButton onclick={closeFilters} class="material-icons">close</IconButton>

                <Button style="display: inline; color: black; height: 48px;" onclick={handleApplyFilters}>
                    Apply
                </Button>

                {#if isAnyFilterSelected}
                    <Button style="display: inline; color: black; height: 48px;" onclick={handleClearAllFilters}>
                        Clear All
                    </Button>
                {/if}
            </TopAppBar>

            <div tabindex="0">
            </div>
            <div>
                <Accordion>
                    {#each Object.entries(options) as [key, filter]}
                        <Panel>
                            <Header>
                                {filter.displayName}
                                {#if activeFilters.includes(key)}
                                    <span class='appliedFilter' />
                                {/if}
                            </Header>

                            <Content>
                                {#if isRadioFilter(key)}
                                    {#if key !== 'type' && activeFilters.includes(key)}
                                        <Button
                                                onclick={(event) => handleClearFilter(key)}
                                                color="primary"
                                                class="clear-filter"
                                        >
                                            <span>
                                                Clear
                                            </span>
                                        </Button>
                                    {/if}
                                    {#each filter.values as option}
                                        <FormField>
                                            <Radio
                                                bind:group={selected[key]}
                                                value={option.id}
                                                color="primary"
                                                onchange={(event) => handleFilterEvent(Object.assign(event, { filterType: 'radio', optionId: option.id, filterKey: key }))}
                                            />
                                            {option.name}
                                        </FormField>
                                    {/each}
                                {/if}

                                {#if isCheckboxFilter(key)}
                                    {#if activeFilters.includes(key)}
                                        <Button
                                            onclick={(event) => handleClearFilter(key)}
                                            color="primary"
                                            class="clear-filter"
                                        >
                                            <span>
                                                Clear
                                            </span>
                                        </Button>
                                    {/if}
                                    {#each filter.values as option}
                                        {@const checkedNow = (selected?.[key] ?? []).includes(option.id)}
                                        {#key `${key}-${option.id}-${checkedNow}`}
                                            <FormField>
                                                <Checkbox
                                                    value={option.id}
                                                    color="secondary"
                                                    checked={isCheckboxChecked(key, option.id)}
                                                    onchange={(event) => handleFilterEvent(Object.assign(event, { filterType: 'checkbox', optionId: option.id, filterKey: key }))}
                                                />
                                                {option.name}
                                            </FormField>
                                        {/key}
                                    {/each}
                                {/if}

                                {#if isRangeFilter(key)}
                                    {#if activeFilters.includes(key)}
                                        <Button
                                                onclick={(event) => handleClearFilter(key)}
                                                color="primary"
                                                class="clear-filter"
                                        >
                                            <span>
                                                Clear
                                            </span>
                                        </Button>
                                    {/if}
                                    <Textfield
                                        variant="outlined"
                                        value={selectedValues[key].from}
                                        label="From"
                                        onkeyup={(event) => handleFilterEvent(Object.assign(event, { filterType: 'range', filterKey: key, rangeType: 'from' }))}
                                    />

                                    <Textfield
                                        variant="outlined"
                                        bind:value={selectedValues[key].to}
                                        label="To"
                                        onkeyup={(event) => handleFilterEvent(Object.assign(event, { filterType: 'range', filterKey: key, rangeType: 'to' }))}
                                    />
                                {/if}
                            </Content>
                        </Panel>
                    {/each}
                </Accordion>
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

:global(.appliedFilter) {
    display: inline-block;
    border-radius: 50%;
    min-width: 0.625rem;
    min-height: 0.625rem;
    background-color: #27AE60;
    margin-left: 0.625rem;
}

:global(.clear-filter) {
    float: right;
}
</style>