const fragShaderSrc = 
`#version 300 es
precision highp float;

in vec2 v_texCoord;
in float v_alpha;
in vec4 v_debug;
in vec3 v_overlay;

uniform vec3 u_tint;
uniform sampler2D tex_unit;

out vec4 fragColor;

void main() {
    vec4 texColor = texture(tex_unit, v_texCoord);
    
    // Apply tint
    vec3 tintedColor = texColor.xyz + u_tint;
    
    // Check if overlay should be applied (including black)
    float useOverlay = float(v_overlay != vec3(0.0));
    
    // Apply overlay
    vec3 finalColor = mix(tintedColor, v_overlay, useOverlay);
    
    // Set final color with alpha
    fragColor = vec4(finalColor, texColor.a * v_alpha);
}
`


export default fragShaderSrc