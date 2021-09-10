const fragShaderSrc = 
`   #version 300 es
    precision highp float;
    
    in vec2 v_tex_coords;
    
    uniform sampler2D u_tex_unit;
    uniform bool u_px_mod;
    uniform bool u_tint;
    uniform vec3 u_px_col;
    uniform vec4 u_tint_col;

    out vec4 out_color;
    void main() {
        vec4 tx_col = texture(u_tex_unit, v_tex_coords);
        if (u_px_mod) {
            out_color = vec4(u_px_col, tx_col.a);
            return;
        } 
        if (u_tint) {
            out_color = tx_col + u_tint_col;
            return;
        } 
        out_color = tx_col;
    }
`

export default fragShaderSrc