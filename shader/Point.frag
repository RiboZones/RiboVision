
precision highp float;
precision highp int;

// uniform mat4 viewMatrix;
// uniform vec3 cameraPosition;

uniform float opacity;

varying vec3 vColor;

#include fog_params


void main()
{

    gl_FragColor = vec4( vColor, opacity );

    #include fog

}
