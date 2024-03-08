<script lang="ts">
    export let station: Station;
    export let adding = false;

</script>
{#if adding}
{station.id}
{/if}
Latitude:
<input
    type="range"
    min="-90"
    max="90"
    name="newStationtheta"
    id="newStationtheta"
    bind:value={station.theta}
/>{station.theta}
Longitude:
<input
    type="range"
    min="-180"
    max="180"
    name="newStationphi"
    id="newStationphi"
    bind:value={station.phi}
/>{station.phi}