const fragShaderSrc = 
`#version 300 es
precision highp float;

in vec2 v_texCoord;
in float v_alpha;

uniform sampler2D tex_unit;

out vec4 fragColor;

void main() {
    vec4 texColor = texture(tex_unit, v_texCoord);
    texColor.a *= v_alpha; // Apply alpha

    fragColor = texColor;
}
`


export default fragShaderSrc