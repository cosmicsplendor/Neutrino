function groupByYCoordinate(rects) {
    const groups = [];

    rects.forEach(rect => {
        let added = false;

        for (const group of groups) {
            if (group[0].y === rect.y && group[0].h === rect.h) {
                group.push(rect);
                added = true;
                break;
            }
        }

        if (!added) {
            groups.push([rect]);
        }
    });

    return groups;
}
function mergeHorizontallyAlignedGroups(groups) {
    const mergedRects = [];

    groups.forEach(group => {
        // Sort group by x-coordinate
        group.sort((a, b) => a.x - b.x);

        let merged = [];
        group.forEach(rect => {
            if (merged.length === 0) {
                merged.push({...rect});
            } else {
                const last = merged[merged.length - 1];
                if (rect.y === last.y && rect.h === last.h && last.x + last.w >= rect.x) {
                    last.w = Math.max(last.x + last.w, rect.x + rect.w) - last.x;
                } else {
                    merged.push({...rect});
                }
            }
        });

        mergedRects.push(...merged);
    });

    return mergedRects;
}
const rectangles1 = [
    { x: 1, y: 1, w: 4, h: 4 },
    { x: 5, y: 1, w: 2, h: 4 }
];

// const rectangles2 = [
//     { x: 1, y: 1, w: 3, h: 4 },
//     { x: 1, y: 5, w: 2, h: 3 },
//     { x: 3, y: 5, w: 1, h: 3 }
// ];
const rectangles2 = [ { x: 1, y: 1, w: 3, h: 4 }, { x: 1, y: 5, w: 3, h: 3 } ]

// Group rectangles by Y-coordinate
const groups1 = groupByYCoordinate(rectangles1);
const groups2 = groupByYCoordinate(rectangles2);

// Merge horizontally aligned rectangles
const merged1 = mergeHorizontallyAlignedGroups(groups1);
const merged2 = mergeHorizontallyAlignedGroups(groups2);

console.log('Covering Rectangles for set 1:', merged1);
console.log('Covering Rectangles for set 2:', merged2);
