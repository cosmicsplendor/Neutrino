const fragShaderSrc = 
`#version 300 es
precision highp float;

in vec2 v_texCoord;
in float v_alpha;
in vec4 v_debug;

uniform vec3 u_tint;
uniform sampler2D tex_unit;
uniform vec3 overlay;
uniform int use_overlay;

out vec4 fragColor;

void main() {
    vec4 texColor = texture(tex_unit, v_texCoord);
    
    // Apply tint
    vec3 tintedColor = texColor.xyz + u_tint;
    
    // Apply overlay
    vec3 finalColor = use_overlay ? mix(tintedColor, overlay): tinted_color;
    
    // Set final color with alpha
    fragColor = vec4(finalColor, texColor.a * v_alpha);
}
`


export default fragShaderSrc