/*{
  "server": 1234,
  "PASSES": [
    {
      "fs": "./life.frag",
      "TARGET": "lifeTexture",
      "FLOAT": true,
    },
    {
      "fs": "./player.frag",
      "TARGET": "playerTexture",
      "FLOAT": true,
    },
    {}
  ]
}*/

precision highp float;
uniform float time;
uniform sampler2D lifeTexture;
uniform sampler2D playerTexture;
uniform vec2 resolution;

void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  gl_FragColor = texture2D(lifeTexture, uv);
  gl_FragColor.r = texture2D(playerTexture, uv).r;
}
