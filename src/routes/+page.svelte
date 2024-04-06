<script lang="ts">
    import StatInput from '$lib/components/statInput.svelte';
    import SatInput from '$lib/components/satInput.svelte';
    import Map from '$lib/components/map.svelte';
	import Presetter from '$lib/components/presetter.svelte';
    let satellites: Satellite[] = [];
    let stations: Station[] = [];
    let newSat: any = {
        T: "06:00",
        n: 16,
        start: 0,
        width: 1000,
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
    let width = 1000
    let minuteDelay: number = 0;
    let stationN: number = 16;
    let singleOrbit: boolean = true;
    let overrideWidths:boolean=false;
    let singleTimeOrbit:boolean=false;
    let showDots:boolean=true;
    let realOrbit:boolean=false;
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
<div class='inputs'>
    <div>
        Delay: <input type='number' bind:value={minuteDelay} min='0' max='1000' step='1' />
    </div>
    <div>
        N: <input type='number' bind:value={stationN} min='7' max='16' step='1' />
    </div>
    <div>
        Width: <input type='number' bind:value={width} min='1' max='10000' step='1' />
    </div>
    <div>
        Override Individual Widths: <input type='checkbox' bind:checked={overrideWidths} />
    </div>
    <div>
        Single orbit: <input type='checkbox' bind:checked={singleOrbit} />
    </div>
    <div>
        Single time orbit: <input type='checkbox' bind:checked={singleTimeOrbit} />
    </div>
    <div>
        Show Dots: <input type='checkbox' bind:checked={showDots} />
    </div>
    <div>
        Real Orbit: <input type='checkbox' bind:checked={realOrbit} />
    </div>
</div>
<Presetter bind:satellites bind:stations bind:delay={minuteDelay} bind:n={stationN} />
<Map {satellites} {stations} {previewSat} {previewStation} {newSat} {newStation} {width}
{minuteDelay}
{stationN}
{singleOrbit}
{overrideWidths} {singleTimeOrbit} {showDots} {realOrbit}/>

<style>
    ul {
        display:flex;
        flex-direction:column;
    }
    .inputs {
        display:flex;
        flex-direction:column;
    }
</style>