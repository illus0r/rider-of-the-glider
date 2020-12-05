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

precision mediump float;
uniform float time;
uniform sampler2D mathTexture;
uniform vec2 resolution;
uniform vec2 mouse;

void main(){
  vec2 uv = (2.*gl_FragCoord.xy-resolution) / resolution.y;
  gl_FragColor = texture2D(mathTexture, uv);
}
