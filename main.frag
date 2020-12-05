/*{
  "pixelRatio": 6,
  "server": 1234,
  "PASSES": [
    {
      "fs": "./math.frag",
      "TARGET": "mathTexture",
      "FLOAT": true,
    },
    {}
  ]
}*/


#include "./common.glsl"
precision highp float;
uniform sampler2D mathTexture;
uniform vec2 resolution;


void main(){
  vec2 uv = (2.*gl_FragCoord.xy-resolution) / resolution.y;
  gl_FragColor = texture2D(mathTexture, uv);
}
