<script lang="ts">
    export let sat: Satellite | {T: string, n: number, start: number, width: number};
    export let adding = false;

</script>
Time:
        <input
            type="time"
            name="newSatT"
            id="newSatT"
            max="12:00"
            bind:value={sat.T}
        />
        Revolutions:
        <input
            type="range"
            name="newSatn"
            id="newSatn"
            min="7"
            max="16"
            step="1"
            bind:value={sat.n}
        />{sat.n}
        Start latitude:
        <input
            type="range"
            min="-180"
            max="180"
            name="newSatstart"
            id="newSatstart"
            bind:value={sat.start}
        />{sat.start}
        <input
        type="range"
        min="0"
        max="1000"
        name="newSatWidth"
        id="newSatWidth"
        bind:value={sat.width}
    />{sat.width}