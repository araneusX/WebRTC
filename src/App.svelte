<script lang="ts">
    import svelteLogo from './assets/svelte.svg';
    import Counter from './lib/Counter.svelte';
    import viteLogo from '/vite.svg';
</script>

<main>
    <div>
        <a
            href="https://vite.dev"
            rel="noreferrer"
            target="_blank"
        >
            <img
                class="logo"
                alt="Vite Logo"
                src={viteLogo}
            />
        </a>
        <a
            href="https://svelte.dev"
            rel="noreferrer"
            target="_blank"
        >
            <img
                class="logo svelte"
                alt="Svelte Logo"
                src={svelteLogo}
            />
        </a>
    </div>
    <h1>Vite + Svelte</h1>

    <div class="card">
        <Counter />
    </div>

    <p>
        Check out <a
            href="https://github.com/sveltejs/kit#readme"
            rel="noreferrer"
            target="_blank"
        >SvelteKit</a>, the
        official Svelte app framework powered by Vite!
    </p>

    <p class="read-the-docs">Click on the Vite and Svelte logos to learn more</p>
</main>

<style>
    .logo {
        height: 6em;
        padding: 1.5em;
        will-change: filter;
        transition: filter 300ms;
    }
    .logo:hover {
        filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.svelte:hover {
        filter: drop-shadow(0 0 2em #ff3e00aa);
    }
    .read-the-docs {
        color: #888;
    }
</style>
