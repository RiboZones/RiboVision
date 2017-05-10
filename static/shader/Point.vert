
precision highp float;
precision highp int;

// uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat3 normalMatrix;
// uniform vec3 cameraPosition;

attribute vec3 position;
attribute vec3 color;

varying vec3 vColor;

uniform float nearClip;


void main()
{

    vColor = color;

    vec4 cameraPos = modelViewMatrix * vec4( position, 1.0 );

    gl_Position = projectionMatrix * vec4( cameraPos.xyz, 1.0 );

    // move out of viewing frustum for custom clipping
    if( dot( cameraPos, vec4( 0.0, 0.0, 1.0, nearClip ) ) > 0.0 )
       gl_Position.w = -10.0;

}
