<script lang="ts">
    import { InteractiveField } from './lib';

    type Inputs = 'offer' | 'answer' | 'candidate';

    const connection: Partial<Record<Inputs, object>> = $state({});
</script>

<main>
    <div>
        <InteractiveField bind:data={connection.offer} name="offer" />
    </div>
    <div style:white-space="pre-wrap">{JSON.stringify(connection, null, 2)}</div>
</main>

<style>
    div {
        width: 300px;
        height: 150px;
    }
</style>
