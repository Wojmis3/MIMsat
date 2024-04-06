<script lang='ts'>
	import Countries from "./countries.svelte";
import SatCover from "./satCover.svelte";
	import StatCover from "./statCover.svelte";

 
    export let satellites: Satellite[] = [];
    export let stations: {id: number, theta: number, phi: number}[] = [];
    export let newSat: {T: string, n: number, start: number, width: number};
    export let previewSat: boolean;
    export let newStation: {id: number, theta: number, phi: number};
    export let previewStation: boolean;
    export let width = 1000
    export let minuteDelay: number = 0;
    export let stationN: number = 16;
    export let singleOrbit: boolean = true;
    export let overrideWidths:boolean=false;
    export let singleTimeOrbit:boolean=false;
    export let showDots:boolean=true;
    export let realOrbit:boolean=false;
</script>


<svg width="3600" height="1800" viewBox="0 0 360 180">
    <g transform="translate(180, 90)">
        <Countries />
        <line x1="-180" y1="-90" x2="180" y2="-90" stroke="black" />
        <line x1="-180" y1="90" x2="180" y2="90" stroke="black" />
        <line x1="-180" y1="-90" x2="-180" y2="90" stroke="black" />
        <line x1="180" y1="-90" x2="180" y2="90" stroke="black" />
        {#each satellites as sat}
        <SatCover {sat} width={overrideWidths ? width : sat.width} {singleOrbit} {singleTimeOrbit} {showDots} {realOrbit}/>
        {/each}
        {#if previewSat}
        <SatCover sat={newSat} width={overrideWidths ? width : newSat.width} {singleOrbit} {singleTimeOrbit} {showDots} {realOrbit}/>
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