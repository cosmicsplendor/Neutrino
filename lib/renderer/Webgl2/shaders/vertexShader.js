export default vertexShaderSrc = 
`   #version 300 es

    in vec2 a_vert_pos;
    
    uniform vec2 u_resolution;
    uniform mat3 u_matrix;
    uniform mat3 u_tex_matrix;

    out vec2 v_tex_coords;

    void main() {
        
        v_tex_coords = (u_tex_matrix * vec3(a_vert_pos, 1)).xy;
        
        vec2 pos_vec = (u_matrix * vec3(a_vert_pos, 1)).xy;

        // converting to clipspace
        vec2 normalized = pos_vec / u_resolution;
        vec2 clipspace = (normalized * 2.0) - 1.0;
        gl_Position = vec4(clipspace * vec2(1, -1), 0, 1);
    }
`