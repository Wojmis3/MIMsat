<script lang='ts'>
    import { onMount } from 'svelte';
    import * as data from '../presets.json';
    export let satellites: Satellite[] = [];
    export let stations: Station[] = [];
    export let delay: number = 0
    export let n: number = 16

    type Preset = {
        delay: number,
        n: number,
        satellites: Satellite[],
        stations: Station[]
    }
    let presets:Record<string, Preset> = {};
    let currentPreset:Preset
    let name:string = '';
    onMount(() => {
        const storedData = localStorage.getItem('storedPresets');
        if (storedData) {
            presets = JSON.parse(storedData);
        }
        //import presets from json in lib
        let storedPresets = data.default;
        for(let k of Object.keys(storedPresets)) {
            if(!presets[k])
            presets[k] = storedPresets[k];
        }
    });
    $: currentJson = JSON.stringify({delay, n, satellites, stations});
    function addPreset() {
        if(!name) return;
        const jsonData = JSONelem.value;
        if (jsonData) {
            presets[name] = JSON.parse(jsonData);
            localStorage.setItem('storedPresets', JSON.stringify(presets));
            currentPreset = presets[name]
        }
    }
    function loadPreset(name:string) {
        let preset = presets[name];
        console.log(preset)
        delay = preset.delay;
        n = preset.n;
        satellites = preset.satellites;
        stations = preset.stations;
    }
    function removePreset(name:string) {
        delete presets[name];
        localStorage.setItem('storedPresets', JSON.stringify(presets));
        selectedName = ''
    }
    let selectedName:string = '';
    let JSONelem:HTMLInputElement;
</script>

<h1>Satellite/Station Data Presets</h1>

<input type="text" bind:value="{name}" placeholder="Preset name">
<input type='text' value={currentJson} bind:this={JSONelem}>
<button on:click="{addPreset}">Add Preset</button>
<select bind:value={selectedName}>
    <option value="">Load Preset</option>
    {#each Object.keys(presets) as presetName}
        <option value={presetName}>{presetName}</option>
    {/each}
</select>
<button on:click={() => loadPreset(selectedName)}>Load</button>
<button on:click={() => removePreset(selectedName)}>Remove</button>
