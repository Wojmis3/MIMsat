<script lang="ts">
    import StatInput from '$lib/components/statInput.svelte';
    import SatInput from '$lib/components/satInput.svelte';
    import Map from '$lib/components/map.svelte';
    let satellites: Satellite[] = [];
    let stations: Station[] = [];
    let newSat: any = {
        T: "06:00",
        n: 16,
        start: 0,
    };
    let previewSat = false;
    let newStation: Station = {
        id: 0,
        theta: 0,
        phi: 0,
    };
    let previewStation = false;
    let nToH = (n: number) => {
        //This returns the height of the satellite for a heliosynchronous orbit with n revolutions per day
        let minN = 7;
        if (n < minN) {
            return 0;
        }
        let heights = [5165, 4182, 3385, 2722, 2162, 1681, 1262, 894, 567, 274];
        return heights[n - minN];
    };
</script>

<div class="sat">
    <div class="add">
        <SatInput bind:sat={newSat} adding/>
        Preview:
        <input type="checkbox" bind:checked={previewSat} /> Show
        <button
            on:click={() =>
                (satellites = [
                    ...satellites,
                    { id: Date.now(), h: nToH(newSat.n), ...newSat },
                ])}>Add</button
        >
    </div>
    <ul>
        {#each satellites as s (s.id)}
            <li>

                <SatInput bind:sat={s} />
                <button
                on:click={() =>
                        (satellites = satellites.filter((x) => x.id !== s.id))}
                    >Remove</button
                    >
            </li>
        {/each}
    </ul>
</div>

<div class="stat">
    <div class="add">
        <StatInput bind:station={newStation} adding/>
        Preview:
        <input type="checkbox" bind:checked={previewStation} /> Show
        <button
            on:click={() =>
                (stations = [
                    ...stations,
                    { ...newStation, id: Date.now() },
                ])}>Add</button
        >
    </div>
    <ul>
        {#each stations as s (s.id)}
        <li>

            <StatInput bind:station={s} />
            <button
                on:click={() =>
                    (stations = stations.filter((x) => x.id !== s.id))}
                >Remove</button
            >
        </li>
        {/each}
                </ul>
</div>

<Map {satellites} {stations} {previewSat} {previewStation} {newSat} {newStation}/>

<style>
    ul {
        display:flex;
        flex-direction:column;
    }
</style>