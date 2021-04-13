export const rand = (to, from = 0) => from + Math.floor((to + 1)* Math.random())
export const skewedRand = (to, from = 0) => from + Math.floor((to + 1) * Math.random() * Math.random())
export const clamp = (from, to, num) => Math.min(to, Math.max(from, num))