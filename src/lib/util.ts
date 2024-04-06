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
export function reflectY({x,y,z}:any){
    return {x, y:-y, z}
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
export function polarToEarth({theta, phi}:any){
    return {
        theta: theta*180/Math.PI-90,
        phi: phi*180/Math.PI
    }
}
export function baseTraj({theta, phi}:any, d:number, n:number){
    let orbitSteps = 24*60/n
    let omega = -2*Math.PI/24/60
    let mult = d < 0 ? -1 : 1
    let d2 = d>0 ? d : -d
    return [...Array(d2+1).keys()].map((i:number)=>{
        let theta2 = theta-2*Math.PI*i*mult/orbitSteps
        return cartesianToPolar(rotateZ(polarToCartesian(theta2, 0), phi+i*omega*mult))
    })
}
export const maxLats = [37.9, 54.7, 64, 69.9, 74, 77, 79.3, 81, 82.3, 83.4].map(e=>e*Math.PI/180)
export {cartesianToPolar, polarToCartesian, rotateX, rotateY, rotateZ}