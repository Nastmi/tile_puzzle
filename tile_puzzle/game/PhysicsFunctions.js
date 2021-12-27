export function aabbIntersection(aabb1, aabb2) {
    return intervalIntersection(aabb1.min[0], aabb1.max[0], aabb2.min[0], aabb2.max[0])
        && intervalIntersection(aabb1.min[1], aabb1.max[1], aabb2.min[1], aabb2.max[1])
        && intervalIntersection(aabb1.min[2], aabb1.max[2], aabb2.min[2], aabb2.max[2]);
}

function intervalIntersection(min1, max1, min2, max2) {
    return !(min1 > max2 || min2 > max1);
}