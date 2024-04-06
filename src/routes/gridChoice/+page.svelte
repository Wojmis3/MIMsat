<script lang="ts">
    import Countries from "$lib/components/countries.svelte";
    function angsToAngDist(p1: [number, number], p2: [number, number]): number {
        return Math.acos(Math.cos(p1[0]) * Math.cos(p2[0]) + Math.sin(p1[0]) * Math.sin(p2[0]) * Math.cos(p1[1] - p2[1]));
    }
    function getMiddles(r: number, R: number): any {
        let points: [number, number][] = [];
        let pointWidths: [number, number][] = [];
        const pi = Math.PI;
        let levelsToMake = Math.floor(pi / (2 * r))+1;
        let perLevel = pi / levelsToMake;
        for (let j = 0; j < levelsToMake; j++) {
            let theta = j * perLevel;
            let pointsToMake = Math.floor(2 * pi * Math.sin(theta) / (2 * r))+1;
            let perPoint = 2 * pi / pointsToMake;
            for (let i = 0; i < pointsToMake; i++) {
                points.push([theta, (i*perPoint+pi) % (2*pi)]);
                pointWidths.push([perLevel/2, perPoint/2]);
            }
        }
         const coverMaps: number[][] = [];
        for (const p of points) {
            const temp: number[] = [];
            for (let i = 0; i < points.length; i++) {
                const q = points[i];
                if (angsToAngDist(p, q) < R - 2*r) {
                    temp.push(i);
                }
            }
            coverMaps.push(temp);
        }
        return {points, coverMaps, pointWidths};
    }
    let r: number = 0.03;
    let R: number = 0.23;
    $: stationSpots = getMiddles(r, R);
    let active: number[] = [];
    $: inRange = active.map((i) => stationSpots.coverMaps[i])
    .reduce((a, e) => {
        let ar = a.concat(e.filter((x) => !a.includes(x)))
        return ar
    }
    , []);
    $: console.log(inRange)
</script>
    r:<input type="number" name="r" bind:value={r} step = '0.01'/>
    R:<input type="number" name="R" bind:value={R}/>
Acive:<textarea on:keydown={(e)=>{
    if(e.key === 'Enter' && e?.target?.value){
        active = e.target.value.split(',').map((x)=>parseInt(x));
    }

}} name="chosen" id="chosen">{active}</textarea>
<svg width="3600" height="1800" viewBox="0 0 360 180">
    <g transform="translate(180, 90)">
        <Countries />
        <line x1="-180" y1="-90" x2="180" y2="-90" stroke="black" />
        <line x1="-180" y1="90" x2="180" y2="90" stroke="black" />
        <line x1="-180" y1="-90" x2="-180" y2="90" stroke="black" />
        <line x1="180" y1="-90" x2="180" y2="90" stroke="black" />
        {#each stationSpots.points as [theta, phi], i}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <g on:click={()=>{
                if(active.includes(i)){
                    console.log(active)
                    active = active.filter((x)=>x!==i);
                }else{
                    active = [...active, i];
                }}}>
                <circle 
                 class="point" r='1.5' cx={phi*180/(Math.PI)-180} cy={theta*180/(Math.PI)-90} fill={active.includes(i) ? 'green' : (inRange.includes(i) ? 'blue' : 'red')}/>
                 <text x={phi*180/(Math.PI)-180} y={theta*180/(Math.PI)-90} font-size='1.6' fill='black'>{i}</text>
                </g>
                <rect 
                x={phi*180/(Math.PI)-180-stationSpots.pointWidths[i][1]*180/(Math.PI)} 
                y={theta*180/(Math.PI)-90-stationSpots.pointWidths[i][0]*180/(Math.PI)} 
                width={2*stationSpots.pointWidths[i][1]*180/(Math.PI)} 
                height={2*stationSpots.pointWidths[i][0]*180/(Math.PI)} 
                fill='none' stroke='black' opacity = '0.3'/>
        {/each}
        <line x1="0" y1="0" x2="90" y2="0" stroke="black" stroke-width='0.2'/>
        <line x1="0" y1="0" x2="0" y2="45" stroke="black" stroke-width='0.2'/>
        <line x1="0" y1="0" x2="-90" y2="0" stroke="black" stroke-width='0.2'/>
        <line x1="0" y1="0" x2="0" y2="-45" stroke="black" stroke-width='0.2'/>
    </g>
</svg>