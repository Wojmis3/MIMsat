<script lang='ts'>
	import SatCover from "./satCover.svelte";
	import StatCover from "./statCover.svelte";

 
    export let satellites: {id: number, T: string, n: number, h: number, start: number}[] = [];
    export let stations: {id: number, theta: number, phi: number}[] = [];
    export let newSat: {T: string, n: number, start: number};
    export let previewSat: boolean;
    export let newStation: {id: number, theta: number, phi: number};
    export let previewStation: boolean;

    let minuteDelay: number = 0;
    let stationN: number = 16;

</script>

<div class='inputs'>
    Delay: <input type='number' bind:value={minuteDelay} min='0' max='1000' step='1' />
    N: <input type='number' bind:value={stationN} min='7' max='16' step='1' />
</div>
<svg width="360" height="180">
    <g transform="translate(180, 90)">
        <line x1="0" y1="0" x2="90" y2="0" stroke="black" />
        <line x1="0" y1="0" x2="0" y2="90" stroke="black" />
        <line x1="0" y1="0" x2="-90" y2="0" stroke="black" />
        <line x1="0" y1="0" x2="0" y2="-90" stroke="black" />
        {#each satellites as sat}
            <SatCover {sat} />
        {/each}
        {#if previewSat}
            <SatCover sat={{T: newSat.T, n: newSat.n, start: newSat.start}} />
        {/if}
        {#each stations as station}
        <StatCover {station} {minuteDelay} {stationN} />
        {/each}
        {#if previewStation}
        <StatCover station={newStation} {minuteDelay} {stationN} />
        {/if}
</svg>