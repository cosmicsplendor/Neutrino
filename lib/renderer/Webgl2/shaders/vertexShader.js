const vertexShaderSrc = 
`   #version 300 es

    in vec2 a_vert_pos;
    
    uniform vec2 u_resolution;
    uniform mat3 u_matrix;
    uniform mat3 u_tex_matrix;

    out vec2 v_tex_coords;

    void main() {
        
        v_tex_coords = (u_tex_matrix * vec3(a_vert_pos, 1)).xy;
        
        gl_Position = vec4((u_matrix * vec3(a_vert_pos, 1)).xy, 0, 1);
    }
`

export default vertexShaderSrc