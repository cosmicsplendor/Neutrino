const fragShaderSrc = 
`   #version 300 es
    precision highp float;

    in vec2 v_tex_coords;
    uniform sampler2D u_tex_unit;
    out vec4 out_color;
    void main() {
        vec4 color = texture(u_tex_unit, v_tex_coords);
        out_color = vec4(color.r + 0.05, color.g, color.b - 0.05, color.a);
    }
`

export default fragShaderSrc