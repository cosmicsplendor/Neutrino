const costAtStep = n => Array.from({ length: n }, (_, i) => i).reduce((s, i) => s + i, 2)

for (let x = 0; x < 100; x++) {
    console.log(`[${x+1}] => ${costAtStep(x+1)}`)
}