function normalizedToHex(colorString) {
    // Split the color string by commas and convert to an array of floats
    const rgb = colorString.split(',').map(value => parseFloat(value.trim()));

    // Scale each component to [0, 255] and convert to a 2-digit hex string
    const hex = rgb
        .map(value => Math.round(value * 255))  // Scale to [0, 255]
        .map(value => value.toString(16).padStart(2, '0'))  // Convert to hex and pad with zeros
        .join('');  // Join all hex values into a single string

    return `#${hex}`;
}

// Example usage
console.log(normalizedToHex("0.1,0.32,0.5"));  // Outputs: "#19527f"

[
    {
        "bg": "#121228",
        "pxbg": "0.058, 0.058, 0.133",
        "tint": "0.025, -0.025, -0.025, 0"
    },
    {
        "bg": "#222235",
        "pxbg": "#151525",
        "tint": "0.065, -0.025, 0.000, 0"
    },
    {
        "bg": "#102728",
        "pxbg": "0.09, 0.15, 0.16",
        "tint": "0.1, 0.05, 0.025"
    },
    {
        "bg": "#050525",
        "pxbg": "#000012",
        "tint": "0.075, -0.025, -0.0125, 0"
    },
    {
        "bg": "#050505",
        "pxbg": "#000000",
        "tint": "0.075, 0.04, 0.035, 0"
    },
    {
        "bg": "#0f0f22",
        "pxbg": "0.039, 0.039, 0.090",
        "tint": "0.025, -0.0125, -0.025, 0"
    },
    {
        "bg": "#10103a",
        "pxbg": "0.043, 0.043, 0.145",
        "tint": "0.05,0,-0.05,0"
    },
    {
        "bg": "#132b27",
        "pxbg": "#0a1614",
        "tint": "0.025, -0.025, -0.0125, 0"
    },
    {
        "bg": "#121212",
        "pxbg": "0.090, 0.090, 0.090",
        "tint": "0.025, 0.0125, -0.025, 0"
    },
    {
        "bg": "#2e2e3d",
        "pxbg": "0.129, 0.129, 0.184",
        "tint": "0.025, -0.025, -0.025, 0"
    }
].forEach(d => {
    if (!d.pxbg.startsWith("#")) {
        d.pxbg = normalizedToHex(d.pxbg)
    }
})
console.log(d)