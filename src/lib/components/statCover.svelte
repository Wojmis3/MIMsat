<script lang="ts">
    export let station: {id: number, theta: number, phi: number};
    export let minuteDelay: number = 0
    export let stationH: number = 380
    export let stationN: number = 16
    $: stationDelay = stationN*2*Math.PI*minuteDelay/60/24
    $: inclination = 2*Math.PI/stationN
    const R = 6371
    $: alpha = Math.acos(R/(R+stationH))
    //THESE ARE PROPER POLARS, NOT EARTH
    function cartesianToPolar(p: {x: number, y: number, z: number}){
        let theta = Math.acos(p.z)
        let phi = Math.atan2(p.y,p.x)
        return {theta, phi}
    }
    function polarToCartesian(theta:any, phi:any){
        let x = Math.sin(theta)*Math.cos(phi)
        let y = Math.sin(theta)*Math.sin(phi)
        let z = Math.cos(theta)
        return {x, y, z}
    }
    function rotateX({x,y,z}:any,theta:any){
        let x1 = x
        let y1 = y*Math.cos(theta) - z*Math.sin(theta)
        let z1 = y*Math.sin(theta) + z*Math.cos(theta)
        return {x: x1, y: y1, z: z1}
    }
    function rotateY({x,y,z}:any,phi:any){
        let x1 = x*Math.cos(phi) + z*Math.sin(phi)
        let y1 = y
        let z1 = -x*Math.sin(phi) + z*Math.cos(phi)
        return {x: x1, y: y1, z: z1}
    }
    function rotateZ({x,y,z}:any,psi:any){
        let x1 = x*Math.cos(psi) - y*Math.sin(psi)
        let y1 = x*Math.sin(psi) + y*Math.cos(psi)
        let z1 = z
        return {x: x1, y: y1, z: z1}
    }
    let points = 25
    let zeroCircle = Object.keys(new Array(points)).map((i:string)=>{
        let j = parseInt(i)
        let theta = Math.PI/2 - alpha
        let phi = 2*Math.PI*j/points
        return rotateY(polarToCartesian(theta, phi), station.theta-Math.PI/2)
    })
    let baseCircle = zeroCircle.map((p:any)=>{
        return cartesianToPolar(rotateZ(p, station.phi))
    })
    let delayCircle = zeroCircle.map((p:any)=>{
        //Nie mam pojęcia czy to poprawna transformacja.. na oko jest okej.
        let delayedButUp = rotateY(p, -station.theta+stationDelay)
        let delayed = rotateX(delayedButUp, inclination)
        let delayedMovedBack = rotateZ(rotateY(delayed, station.theta), station.phi)
        return cartesianToPolar(delayedMovedBack)
    })

</script>

<g class="base circle">
    {#each baseCircle as {theta, phi}}
        <circle class="point" r='15' cx={phi} cy={theta} fill='green'/>
    {/each}
</g>
{#if minuteDelay > 0}
    <g class="delay circle">
        {#each delayCircle as {theta, phi}}
            <circle class="point" r='15' cx={phi} cy={theta} fill='red'/>
        {/each}
    </g>
{/if}