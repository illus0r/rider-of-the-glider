precision mediump float;
uniform float time;
uniform vec2 resolution;

void main() {
    vec2 uv = (gl_FragCoord.xy*2.-resolution.xy) / resolution.y;
    gl_FragColor = vec4(uv,0.5+0.5*sin(time),1.0);
}
