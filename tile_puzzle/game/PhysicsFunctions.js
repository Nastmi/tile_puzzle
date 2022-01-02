import { vec3, mat4 } from '../lib/gl-matrix-module.js';

export function aabbIntersection(aabmin, aabmax) {
    return intervalIntersection(aabmin.min[0], aabmin.max[0], aabmax.min[0], aabmax.max[0])
        && intervalIntersection(aabmin.min[1], aabmin.max[1], aabmax.min[1], aabmax.max[1])
        && intervalIntersection(aabmin.min[2], aabmin.max[2], aabmax.min[2], aabmax.max[2]);
}

function intervalIntersection(min1, max1, min2, max2) {
    return !(min1 > max2 || min2 > max1);
}


/*let temp = vec3.create();

export function lineBoxIntersection( min, max, p1, p2, hit)
{
    if (p2[0] < min[0] && p1[0] < min[0]) return false;
    if (p2[0] > max[0] && p1[0] > max[0]) return false;
    if (p2[1] < min[1] && p1[1] < min[1]) return false;
    if (p2[1] > max[1] && p1[1] > max[1]) return false;
    if (p2[2] < min[2] && p1[2] < min[2]) return false;
    if (p2[2] > max[2] && p1[2] > max[2]) return false;
    if (p1[0] > min[0] && p1[0] < max[0] &&
        p1[1] > min[1] && p1[1] < max[1] &&
        p1[2] > min[2] && p1[2] < max[2])
    {
        vec3.set( p1, hit);
        return true;
    }

    let temp = p2.slice();
    p2 = p1.slice();
    p1 = temp.slice();

    if ((getIntersection(p1[0] - min[0], p2[0] - min[0], p1, p2, hit) && inBox(hit, min, max, 1))
      || (getIntersection(p1[1] - min[1], p2[1] - min[1], p1, p2, hit) && inBox(hit, min, max, 2))
      || (getIntersection(p1[2] - min[2], p2[2] - min[2], p1, p2, hit) && inBox(hit, min, max, 3))
      || (getIntersection(p1[0] - max[0], p2[0] - max[0], p1, p2, hit) && inBox(hit, min, max, 1))
      || (getIntersection(p1[1] - max[1], p2[1] - max[1], p1, p2, hit) && inBox(hit, min, max, 2))
      || (getIntersection(p1[2] - max[2], p2[2] - max[2], p1, p2, hit) && inBox(hit, min, max, 3)))
        return true;

    return false;
}

function getIntersection( fDst1, fDst2, P1, P2, hit)
{
    if ((fDst1 * fDst2) >= 0) return false;
    if (fDst1 == fDst2) return false;

    vec3.subtract(P2, P1, temp);
    vec3.scale( temp, (-fDst1 / (fDst2 - fDst1)));
    vec3.add( temp, P1, hit);

    return true;
}

function inBox(hit, min, max, Axis)
{
    if (Axis == 1 && hit[2] > min[2] && hit[2] < max[2] && hit[1] > min[1] && hit[1] < max[1]) return true;
    if (Axis == 2 && hit[2] > min[2] && hit[2] < max[2] && hit[0] > min[0] && hit[0] < max[0]) return true;
    if (Axis == 3 && hit[0] > min[0] && hit[0] < max[0] && hit[1] > min[1] && hit[1] < max[1]) return true;
    return false;
}
*/
/*
// all args are Vec3, hit will be filled by this algo
function checkLineBox( min, max, p1, p2, hit)
{
    if (p2[0] < min[0] && p1[0] < min[0]) return false;
    if (p2[0] > max[0] && p1[0] > max[0]) return false;
    if (p2[1] < min[1] && p1[1] < min[1]) return false;
    if (p2[1] > max[1] && p1[1] > max[1]) return false;
    if (p2[2] < min[2] && p1[2] < min[2]) return false;
    if (p2[2] > max[2] && p1[2] > max[2]) return false;
    if (p1[0] > min[0] && p1[0] < max[0] &&
        p1[1] > min[1] && p1[1] < max[1] &&
        p1[2] > min[2] && p1[2] < max[2])
    {
        vec3.set( p1, hit);
        return true;
    }

    if ((getIntersection(p1[0] - min[0], p2[0] - min[0], p1, p2, hit) && inBox(hit, min, max, 1))
      || (getIntersection(p1[1] - min[1], p2[1] - min[1], p1, p2, hit) && inBox(hit, min, max, 2))
      || (getIntersection(p1[2] - min[2], p2[2] - min[2], p1, p2, hit) && inBox(hit, min, max, 3))
      || (getIntersection(p1[0] - max[0], p2[0] - max[0], p1, p2, hit) && inBox(hit, min, max, 1))
      || (getIntersection(p1[1] - max[1], p2[1] - max[1], p1, p2, hit) && inBox(hit, min, max, 2))
      || (getIntersection(p1[2] - max[2], p2[2] - max[2], p1, p2, hit) && inBox(hit, min, max, 3)))
        return true;

    return false;
}

let temp = vec3.create();
function getIntersection( fDst1, fDst2, P1, P2, hit)
{
    if ((fDst1 * fDst2) >= 0) return false;
    if (fDst1 == fDst2) return false;

    vec3.subtract(P2, P1, temp);
    vec3.scale( temp, (-fDst1 / (fDst2 - fDst1)));
    vec3.add( temp, P1, hit);

    return true;
}

function inBox(hit, min, max, Axis)
{
    if (Axis == 1 && hit[2] > min[2] && hit[2] < max[2] && hit[1] > min[1] && hit[1] < max[1]) return true;
    if (Axis == 2 && hit[2] > min[2] && hit[2] < max[2] && hit[0] > min[0] && hit[0] < max[0]) return true;
    if (Axis == 3 && hit[0] > min[0] && hit[0] < max[0] && hit[1] > min[1] && hit[1] < max[1]) return true;
    return false;
}
*/