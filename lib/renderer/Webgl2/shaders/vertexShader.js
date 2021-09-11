const vertexShaderSrc = 
`   #version 300 es

    in vec2 vert_pos;
    
    uniform mat3 mat;
    uniform mat3 tex_mat;

    out vec2 tex_coords;

    void main() {
        
        tex_coords = (tex_mat * vec3(vert_pos, 1)).xy;
        
        gl_Position = vec4((mat * vec3(vert_pos, 1)).xy, 0, 1);
    }
`

export default vertexShaderSrc