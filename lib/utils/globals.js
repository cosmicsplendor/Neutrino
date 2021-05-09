window.execSafely = (fn, ...params) => {
    const isFn = typeof fn === "function"
    if (isFn) {
        fn(...params)
    }
}