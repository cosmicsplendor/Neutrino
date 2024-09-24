const vertexShaderSrc = 
`#version 300 es
precision mediump float;

in vec2 vert_pos;

in mat3 instance_mat;      // Transformation matrix
in mat3 instance_tex_mat;  // Texture matrix
in vec4 instance_tint;     // Tint color
in float instance_alpha;   // Alpha value
in int instance_overlay;   // Overlay flag
in vec3 instance_overlay_col; // Overlay color

uniform mat3 mat;

out vec2 v_texCoord;
out float v_alpha;

void main() {
    // Apply global transformation and instance transformation
    mat3 final_mat = mat * instance_mat;
    vec3 pos = final_mat * vec3(vert_pos, 1.0);
    gl_Position = vec4(pos.xy, 0.0, 1.0);

    // Apply texture transformation
    mat3 final_tex_mat = instance_tex_mat;
    vec3 texCoord = final_tex_mat * vec3(vert_pos, 1.0);
    v_texCoord = texCoord.xy;

    v_alpha = instance_alpha;
}
`




export default vertexShaderSrc