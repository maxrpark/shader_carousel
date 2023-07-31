
varying vec2 vUvs;

uniform sampler2D uDiffuse;

void main (){

 vec4 diffuseSample = texture2D(uDiffuse, vUvs);

 gl_FragColor = diffuseSample;
}