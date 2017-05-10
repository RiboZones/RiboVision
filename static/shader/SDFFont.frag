
#extension GL_OES_standard_derivatives : enable

precision highp float;
precision highp int;

// uniform mat4 viewMatrix;
// uniform vec3 cameraPosition;

uniform sampler2D fontTexture;
uniform float opacity;

varying vec3 vColor;
varying vec2 texCoord;

#include fog_params

const float smoothness = 16.0;
const float gamma = 2.2;

void main() {

    // retrieve signed distance
    float sdf = texture2D( fontTexture, texCoord ).a;

    // perform adaptive anti-aliasing of the edges
    float w = clamp(
        smoothness * ( abs( dFdx( texCoord.x ) ) + abs( dFdy( texCoord.y ) ) ),
        0.0,
        0.5
    );
    float a = smoothstep( 0.5 - w, 0.5 + w, sdf );

    // gamma correction for linear attenuation
    a = pow( a, 1.0 / gamma );

    if( a < 0.2 ) discard;

    a *= opacity;

    gl_FragColor = vec4( vColor, a );

    #include fog

}

