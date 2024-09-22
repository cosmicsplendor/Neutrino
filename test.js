function detectProjectedEmptySpaces(rect, map) {
    // Remove duplicate collision rectangles
    // Helper function to check if two rectangles overlap
    const overlaps = (r1, r2) =>
        r1.x < r2.x + r2.w && r1.x + r1.w > r2.x &&
        r1.y < r2.y + r2.h && r1.y + r1.h > r2.y;

    // Remove duplicate collision rectangles
    const uniqueCollisionRects = map.collisionRects.filter(r =>
        !overlaps(r, rect)
    );

    // Function to find the nearest collision in a given direction
    const findNearestCollision = (edge, isHorizontal) => {
        let nearest = isHorizontal ? (edge === 'left' ? 0 : map.width) : (edge === 'top' ? 0 : map.height);
        
        uniqueCollisionRects.forEach(collisionRect => {
            if (isHorizontal) {
                if (edge === 'left' && collisionRect.x + collisionRect.w <= rect.x &&
                    collisionRect.y < rect.y + rect.h && collisionRect.y + collisionRect.h > rect.y) {
                    nearest = Math.max(nearest, collisionRect.x + collisionRect.w);
                } else if (edge === 'right' && collisionRect.x >= rect.x + rect.w &&
                    collisionRect.y < rect.y + rect.h && collisionRect.y + collisionRect.h > rect.y) {
                    nearest = Math.min(nearest, collisionRect.x);
                }
            } else {
                if (edge === 'top' && collisionRect.y + collisionRect.h <= rect.y &&
                    collisionRect.x < rect.x + rect.w && collisionRect.x + collisionRect.w > rect.x) {
                    nearest = Math.max(nearest, collisionRect.y + collisionRect.h);
                } else if (edge === 'bottom' && collisionRect.y >= rect.y + rect.h &&
                    collisionRect.x < rect.x + rect.w && collisionRect.x + collisionRect.w > rect.x) {
                    nearest = Math.min(nearest, collisionRect.y);
                }
            }
        });
        
        return nearest;
    };

    // Calculate projected rectangles
    const left = {
        x: findNearestCollision('left', true),
        y: rect.y,
        w: Math.max(0, rect.x - findNearestCollision('left', true)),
        h: rect.h
    };

    const right = {
        x: rect.x + rect.w,
        y: rect.y,
        w: Math.max(0, findNearestCollision('right', true) - (rect.x + rect.w)),
        h: rect.h
    };

    const top = {
        x: rect.x,
        y: findNearestCollision('top', false),
        w: rect.w,
        h: Math.max(0, rect.y - findNearestCollision('top', false))
    };

    const bottom = {
        x: rect.x,
        y: rect.y + rect.h,
        w: rect.w,
        h: Math.max(0, findNearestCollision('bottom', false) - (rect.y + rect.h))
    };

    // Ensure projections stay within map boundaries
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    [left, right, top, bottom].forEach(r => {
        r.x = clamp(r.x, 0, map.width);
        r.y = clamp(r.y, 0, map.height);
        r.w = clamp(r.w, 0, map.width - r.x);
        r.h = clamp(r.h, 0, map.height - r.y);
    });

    return [left, right, top, bottom];
}

// Test function
function testDetectProjectedEmptySpaces() {
    const testCases = [
        {
            name: "No collision rectangles",
            rect: { x: 10, y: 10, w: 5, h: 5 },
            map: { width: 100, height: 100, collisionRects: [] }
        },
        {
            name: "One collision rectangle",
            rect: { x: 0, y: 10, w: 3, h: 8 },
            map: { width: 100, height: 100, collisionRects: [ { x: 0, y: 18, w: 60, h: 2 } ] }
        },
        {
            name: "Multiple collision rectangles",
            rect: { x: 10, y: 10, w: 5, h: 5 },
            map: {
                width: 100,
                height: 100,
                collisionRects: [
                    { x: 0, y: 0, w: 8, h: 100 },
                    { x: 20, y: 0, w: 5, h: 100 },
                    { x: 0, y: 0, w: 100, h: 8 },
                    { x: 0, y: 20, w: 100, h: 5 }
                ]
            }
        },
        {
            name: "Rectangle at map edge",
            rect: { x: 0, y: 0, w: 5, h: 5 },
            map: { width: 100, height: 100, collisionRects: [] }
        }
    ];

    testCases.forEach(testCase => {
        console.log(`Test case: ${testCase.name}`);
        const result = detectProjectedEmptySpaces(testCase.rect, testCase.map);
        console.log(JSON.stringify(result, null, 2));
        console.log("-----");
    });
}

// Run the test
testDetectProjectedEmptySpaces();