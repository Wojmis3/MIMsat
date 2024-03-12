<script lang='ts'>
	import Countries from "./countries.svelte";
import SatCover from "./satCover.svelte";
	import StatCover from "./statCover.svelte";

 
    export let satellites: {id: number, T: string, n: number, h: number, start: number}[] = [];
    export let stations: {id: number, theta: number, phi: number}[] = [];
    export let newSat: {T: string, n: number, start: number};
    export let previewSat: boolean;
    export let newStation: {id: number, theta: number, phi: number};
    export let previewStation: boolean;
    let width = 300
    let minuteDelay: number = 0;
    let stationN: number = 16;
    let singleOrbit: boolean = true;

</script>

<div class='inputs'>
    Delay: <input type='number' bind:value={minuteDelay} min='0' max='1000' step='1' />
    N: <input type='number' bind:value={stationN} min='7' max='16' step='1' />
    Width: <input type='number' bind:value={width} min='1' max='10000' step='1' />
    Single orbit: <input type='checkbox' bind:checked={singleOrbit} />
</div>
<svg width="3600" height="1800" viewBox="0 0 360 180">
    <g transform="translate(180, 90)">
        <Countries />
        <line x1="-180" y1="-90" x2="180" y2="-90" stroke="black" />
        <line x1="-180" y1="90" x2="180" y2="90" stroke="black" />
        <line x1="-180" y1="-90" x2="-180" y2="90" stroke="black" />
        <line x1="180" y1="-90" x2="180" y2="90" stroke="black" />
        {#each satellites as sat}
        <SatCover {sat} {width} {singleOrbit}/>
        {/each}
        {#if previewSat}
        <SatCover sat={newSat} {width} {singleOrbit}/>
        {/if}
        {#each stations as station}
        <StatCover {station} {minuteDelay} {stationN} />
        {/each}
        {#if previewStation}
        <StatCover station={newStation} {minuteDelay} {stationN} />
        {/if}
        <line x1="0" y1="0" x2="90" y2="0" stroke="black" stroke-width='0.2'/>
        <line x1="0" y1="0" x2="0" y2="45" stroke="black" stroke-width='0.2'/>
        <line x1="0" y1="0" x2="-90" y2="0" stroke="black" stroke-width='0.2'/>
        <line x1="0" y1="0" x2="0" y2="-45" stroke="black" stroke-width='0.2'/>
    </g>
</svg>