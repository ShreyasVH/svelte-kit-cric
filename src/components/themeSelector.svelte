{#if mounted}
    <FormField>
        <Switch bind:checked={isChecked} onSMUISwitchChange={toggleTheme} icons={false} />
        {mode === 'dark' ? 'Dark mode' : 'Light mode'}
    </FormField>
{/if}


<script>
    import { onMount } from 'svelte';
    import Switch from '@smui/switch';
    import FormField from '@smui/form-field';

    let mounted = false;
    let mode = 'light';
    let isChecked = false;

    function applyTheme(newMode) {
        const lightTheme = document.getElementById('smui-light-theme');
        const darkTheme = document.getElementById('smui-dark-theme');

        mode = newMode;
        isChecked = newMode === 'dark';

        lightTheme.media = newMode === 'light' ? 'all' : 'not all';
        darkTheme.media = newMode === 'dark' ? 'all' : 'not all';
    }

    onMount(() => {
        const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches;

        mode = prefersDark ? 'dark' : 'light';
        isChecked = prefersDark;
        mounted = true;
    });

    function toggleTheme() {
        applyTheme(isChecked ? 'dark' : 'light');
    }
</script>