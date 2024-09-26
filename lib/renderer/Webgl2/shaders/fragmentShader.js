const fragShaderSrc = 
`#version 300 es
precision highp float;

in vec2 v_texCoord;
in float v_alpha;
in vec4 v_debug;

uniform vec3 u_tint;
uniform sampler2D tex_unit;

out vec4 fragColor;

void main() {
    vec4 texColor = texture(tex_unit, v_texCoord);

    fragColor = vec4(texColor.xyz + u_tint, texColor.a * v_alpha);
}
`


export default fragShaderSrc