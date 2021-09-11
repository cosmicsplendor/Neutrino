const fragShaderSrc = 
`   #version 300 es
    precision highp float;
    
    in vec2 tex_coords;
    
    uniform sampler2D tex_unit;
    uniform bool overlay;
    uniform bool tint;
    uniform vec3 overlay_col;
    uniform vec4 tint_col;

    out vec4 out_color;
    void main() {
        vec4 px_col = texture(tex_unit, tex_coords);
        if (overlay) {
            out_color = vec4(overlay_col, px_col.a);
            return;
        } 
        if (tint) {
            out_color = px_col + tint_col;
            return;
        } 
        out_color = px_col;
    }
`

export default fragShaderSrc