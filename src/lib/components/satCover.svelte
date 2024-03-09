<script lang="ts">
    import { polarToCartesian, rotateY, rotateZ, rotateX, cartesianToPolar, polarToEarth } from '../util'
    export let sat: {id: number, T: string, n: number, h: number, start: number} | {T: string, n: number, start: number};
    export let singleOrbit: boolean = true
    //Ie minutes in a day
    let timeSteps = 24*60*3
    //Ie minutes in an orbit
    let orbitSteps = Math.floor(timeSteps/sat.n)

    //In KM
    export let width = 300
    const R = 6371
    //Actually, omega per time step.
    const omega = -2*Math.PI/timeSteps
    $: startAngle = Math.PI*sat.start/180
    $: angleWidth = width/(R*2*Math.PI)
    
    //This is the angle made so that orbit is perpendicular to the pictures
    let adjustAngle = 0
    let stepArray = [...Array(orbitSteps).keys()]

    $: orbitSteps = Math.floor(timeSteps/sat.n)
    $: baseLeft = [...Array(orbitSteps).keys()].map((i:number)=>{
        let theta = Math.PI/2 - angleWidth
        let phi = 2*Math.PI*i/orbitSteps
        return rotateX(polarToCartesian(theta, phi), Math.PI/2)
    })
    $: baseRight = [...Array(orbitSteps).keys()].map((i:number)=>{
        let theta = Math.PI/2 - angleWidth
        let phi = -2*Math.PI*i/orbitSteps
        return rotateX(polarToCartesian(theta, phi), -Math.PI/2)
    })
    $: base = [...Array(orbitSteps).keys()].map((i:number)=>{
        let phi = 0
        let theta = Math.PI/2-2*Math.PI*i/orbitSteps
        return polarToCartesian(theta, phi)
    })
    //TODO CHANGE THIS TO TIMESTEPS LATER, THIS IS FOR DEBUGGING
    let makeFullInDeg = (ps:any[], length:number, toadd:number=0) => {
        const fullIndices = [...Array(length).keys()]
        return fullIndices.map((i:number)=>{
            let jm = i%orbitSteps
            //let basePoint = cartesianToPolar(baseLeft[jm])
            //        return {
                //     theta: basePoint.theta,
                //     phi: basePoint.phi + j*omega
                // }
                let coords = cartesianToPolar(ps[jm])
                let addd = jm < orbitSteps/4 || jm > orbitSteps*3/4 ? 0 : toadd
                return polarToEarth({theta: coords.theta, phi: coords.phi+i*omega+startAngle+addd})

            })
        }

     let full: any, fullRight: any, fullLeft: any
     let renderComponents:any[]= []
    $: {startAngle
        let length = singleOrbit ? orbitSteps : timeSteps
        full = makeFullInDeg(base, length)
        fullLeft = makeFullInDeg(baseLeft, length)
        fullRight = makeFullInDeg(baseRight, length,-2*Math.PI)
        let maxi = singleOrbit ? 4 : 4*sat.n
        let perComponent = orbitSteps/4
        renderComponents = []
        for(let i = 0; i < maxi; i++){
            let temp1 = fullLeft.slice(i*perComponent, (i+1)*perComponent+1)
            let temp2 = fullRight.slice(i*perComponent, (i+1)*perComponent+1).reverse()
            renderComponents.push(temp1.concat(temp2))
        }
    }
</script>

<g class="sat traj">
    {#each full as {theta, phi}}
        <circle class="point" r='0.1' cx={phi} cy={theta} fill='red'/>
        <circle class="point" r='0.1' cx={phi+360} cy={theta} fill='red'/>
    {/each}
</g>
<g class="sat left">
    {#each fullLeft as {theta, phi}}
        <circle class="point" r='0.1' cx={phi} cy={theta} fill='blue'/>
        <circle class="point" r='0.1' cx={phi+360} cy={theta} fill='blue'/>
    {/each}
</g>
<g class="sat right">
    {#each fullRight as {theta, phi}}
        <circle class="point" r='0.1' cx={phi} cy={theta} fill='green'/>
        <circle class="point" r='0.1' cx={phi+360} cy={theta} fill='green'/>
    {/each}
</g>
<g class="areas">
    {#each renderComponents as component}
        <polygon points={component.map(({theta, phi})=>`${phi},${theta}`).join(' ')} fill='red' fill-opacity='0.1' stroke='none'/>
        <polygon points={component.map(({theta, phi})=>`${phi+360},${theta}`).join(' ')} fill='red' fill-opacity='0.1' stroke='none'/>
    {/each}
</g>