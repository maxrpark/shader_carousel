uniform float uTime;
uniform float uSpeed;
uniform float uFrequencyX;

varying vec2 vUvs;


void main(){

 vec4 modelPosition = modelMatrix * vec4(position, 1.0);

 modelPosition.z += sin(modelPosition.x * uFrequencyX + uTime * uSpeed ) * 0.1;

 vec4 viewPosition = viewMatrix * modelPosition;
 vec4 projectedPosition = projectionMatrix * viewPosition;

gl_Position = projectedPosition;


gl_PointSize = 2.0;

vUvs = uv;
}


