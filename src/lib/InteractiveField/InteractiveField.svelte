<script lang="ts">
    import type { MouseEventHandler } from 'svelte/elements';
    import { fade, fly } from 'svelte/transition';
    import CopyIcon from './CopyIcon.svelte';
    import { parseInput } from './utils';

    let { data: propData = $bindable(), name }: { data?: object | null; name: string } = $props();

    enum ActivityState {
        Error = 'error',
        Waiting = 'waiting',
        Processing = 'processing',
        Completed = 'completed',
    }

    let value = $state('');
    let isCopy = $state(false);

    let activityState: ActivityState = $state(ActivityState.Waiting);

    $effect(() => {
        if (propData && activityState !== ActivityState.Completed) {
            value = JSON.stringify(propData, null, 2);
        }
    });

    $effect(() => {
        if (value.length > 0) {
            const { data, isError } = parseInput(value);
            if (isError) {
                activityState = ActivityState.Error;
            } else {
                activityState = ActivityState.Completed;
                propData = data;
            }
        } else {
            activityState = ActivityState.Waiting;
        }
    });

    const handleCopy: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        isCopy = true;
        navigator.clipboard.writeText(String(value));
        setTimeout(() => {
            isCopy = false;
        }, 1000);
    };
</script>

<div
    style:--border={`var(--border-${activityState})`}
    style:--text={`var(--text-${activityState})`}
    style:--background={`var(--background-${activityState})`}
    class="container"
>
    <textarea class="field" bind:value readonly={activityState === ActivityState.Completed} {name}></textarea>
    {#if value && !isCopy}
        <button in:fade={{ duration: 1000 }} out:fly={{ y: -10, x: 10 }} class="copy" onclick={handleCopy}
            ><CopyIcon /></button
        >
    {/if}
</div>

<style>
    .container {
        --border-error: oklch(85% 0.3 30);
        --border-waiting: oklch(85% 0.3 105);
        --border-processing: oklch(85% 0 270);
        --border-completed: oklch(85% 0.3 140);

        --text-error: oklch(15% 0.3 210);
        --text-waiting: oklch(15% 0.3 285);
        --text-processing: oklch(15% 0 90);
        --text-completed: oklch(15% 0.3 320);

        --background-error: oklch(100% 0.05 30);
        --background-waiting: oklch(100% 0.05 105);
        --background-processing: oklch(100% 0 270);
        --background-completed: oklch(100% 0.05 140);

        position: relative;
        width: 100%;
        height: 100%;
    }

    .field {
        background: var(--background);
        color: var(--text);
        border-radius: 0.25rem;
        border: 2px solid var(--border);
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        resize: none;
    }

    .field:focus {
        outline: none;
        box-shadow: 0 0 3px 0px var(--border);
    }

    .copy {
        position: absolute;
        top: 2px;
        right: 2px;
        background: var(--background);
        border-radius: 0.25rem;
        color: var(--border);
        opacity: 0.8;
    }
</style>
