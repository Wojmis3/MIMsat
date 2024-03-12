<script lang="ts">
    import { polarToCartesian, rotateY, rotateZ, rotateX, cartesianToPolar, polarToEarth, baseTraj } from '../util'
    export let station: {id: number, theta: number, phi: number};
    export let minuteDelay: number = 0
    export let stationN: number = 16
    let stheta:any, sphi:any, zeroCircle:any, baseCircle:any, delayCircle:any, inclination:any

    $: stationDelay = stationN*2*Math.PI*minuteDelay/60/24
    $: inclination = 2*Math.PI/stationN
    const R = 6371
    let alpha:any, stationH;
    //THESE ARE PROPER POLARS, NOT EARTH

    let points = 50
    let stationHeights = [5165, 4182, 3385, 2722, 2162, 1681, 1262, 894, 567, 274]
    $:{
        stheta = Math.PI*station.theta/180
        sphi = Math.PI*station.phi/180
        stationH = stationHeights[stationN-7]
        alpha = Math.acos(R/(R+stationH))
    zeroCircle = [...Array(points).keys()].map((i:number)=>{
        let theta = alpha
        let phi = 2*Math.PI*i/points
        return rotateY(polarToCartesian(theta, phi), stheta+Math.PI/2)
    })
    baseCircle = zeroCircle.map((p:any)=>{
        return cartesianToPolar(rotateZ(p, sphi))
    })
    delayCircle = baseCircle.map((p:any)=>{
        let traj = baseTraj(p, -minuteDelay, stationN)
        return traj[minuteDelay]
        //Nie mam pojęcia czy to poprawna transformacja.. na oko jest okej.
        // let delayedButUp = rotateY(p, -stheta+stationDelay)
        // let delayed = rotateX(delayedButUp, inclination)
        // let delayedMovedBack = rotateZ(rotateY(delayed, stheta), sphi)
        // return polarToEarth(cartesianToPolar(delayedButUp))
    })
    }
</script>

<g class="base circle">
    {#each baseCircle.map(polarToEarth) as {theta, phi}}
        <circle class="point" r='0.5' cx={phi} cy={theta} fill='green'/>
    {/each}
</g>
{#if minuteDelay > 0}
    <g class="delay circle">
        {#each delayCircle.map(polarToEarth) as {theta, phi}}
            <circle class="point" r='0.5' cx={phi} cy={theta} fill='blue'/>
        {/each}
    </g>
{/if}