const fragShaderSrc = 
`   #version 300 es
    precision highp float;

    in vec2 v_tex_coords;
    uniform sampler2D u_tex_unit;
    out vec4 out_color;
    void main() {
        out_color = texture(u_tex_unit, v_tex_coords);
    }
`

export default fragShaderSrc