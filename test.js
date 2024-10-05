function mergeRects(rects) {
    if (rects.length === 0) return []

    rects.sort((a, b) => a.y - b.y || a.x - b.x)

    const mergedHorizontally = []
    let current = rects[0]

    for (let i = 1; i < rects.length; i++) {
        const next = rects[i]

        if (current.y === next.y && current.h === next.h &&
            current.x + current.w === next.x) {
            current.w = current.w + next.w
        } else {
            mergedHorizontally.push({ ...current })
            current = next
        }
    }

    mergedHorizontally.push({ ...current })

    const mergedVertically = []
    mergedHorizontally.sort((a, b) => a.x - b.x || a.y - b.y)

    current = mergedHorizontally[0]

    for (let i = 1; i < mergedHorizontally.length; i++) {
        const next = mergedHorizontally[i]

        if (current.x === next.x && current.w === next.w &&
            current.y + current.h >= next.y) {
            current.h = Math.max(current.y + current.h, next.y + next.h) - current.y
        } else {
            mergedVertically.push({ ...current })
            current = next
        }
    }

    mergedVertically.push({ ...current })

    return mergedVertically
}

function groupAndMergeRectsByMat(rects) {
    if (rects.length === 0) return []

    // Step 1: Group rectangles by their `mat` property
    const groupedByMat = rects.reduce((groups, rect) => {
        const mat = rect.mat
        if (!groups[mat]) {
            groups[mat] = []
        }
        groups[mat].push(rect)
        return groups
    }, {})

    // Step 2: Merge each group of rectangles and collect the results
    const mergedRects = []

    for (const mat in groupedByMat) {
        const group = groupedByMat[mat]

        // Call the mergeRects function on each group and add the mat property back to the merged rectangles
        const mergedGroup = mergeRects(group).map(rect => ({
            ...rect, // Keep merged rectangle properties (x, y, w, h)
            mat // Add the original mat property
        }))

        // Add the merged group to the final result array
        mergedRects.push(...mergedGroup)
    }

    // Step 3: Return the array of merged rectangles
    return mergedRects
}


const rects = [
    { x: 5, y: 5, w: 10, h: 10, mat: 'wood' },
    { x: 15, y: 5, w: 10, h: 10, mat: 'stone' },
    { x: 5, y: 15, w: 10, h: 10, mat: 'wood' },
    { x: 20, y: 5, w: 5, h: 5, mat: 'stone' }
]


const result = groupAndMergeRectsByMat(rects)
console.log(result)
