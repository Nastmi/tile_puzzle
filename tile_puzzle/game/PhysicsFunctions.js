import { vec3 } from '../lib/gl-matrix-module.js';

export function aabbIntersection(aabmin, aabmax) {
    return intervalIntersection(aabmin.min[0], aabmin.max[0], aabmax.min[0], aabmax.max[0])
        && intervalIntersection(aabmin.min[1], aabmin.max[1], aabmax.min[1], aabmax.max[1])
        && intervalIntersection(aabmin.min[2], aabmin.max[2], aabmax.min[2], aabmax.max[2]);
}

function intervalIntersection(min1, max1, min2, max2) {
    return !(min1 > max2 || min2 > max1);
}

export function lineBoxIntersection(p1, p2, min, max){
    let d = vec3.subtract(vec3.create(), p2, p1);
    vec3.scale(d, d, 0.5);
    let e = vec3.subtract(vec3.create(), max, min);
    vec3.scale(e, e, 0.5);
    let c = vec3.add(vec3.create(), max, min);
    vec3.scale(c, c, 0.5);
    let temp = vec3.add(vec3.create(), p1, d);
    vec3.subtract(c, temp, c);
    let ad = d.map(el => Math.abs(el));
    if (Math.abs(c[0]) > e[0] + ad[0])        
        return false;    
    if (Math.abs(c[1]) > e[1] + ad[1])        
        return false;    
    if (Math.abs(c[2]) > e[2] + ad[2])        
        return false;      
    if (Math.abs(d[1] * c[2] - d[2] * c[1]) > e[1] * ad[2] + e[2] * ad[1])        
        return false;    
    if (Math.abs(d[2] * c[0] - d[0] * c[2]) > e[2] * ad[0] + e[0] * ad[2])        
        return false;    
    return Math.abs(d[0] * c[1] - d[1] * c[0]) <= e[0] * ad[1] + e[1] * ad[0];

}