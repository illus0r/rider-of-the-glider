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

void main(){
  gl_FragColor = texture2D(mathTexture, vec2(.5));
}
