import Veda from 'vedajs';

const veda = new Veda();

veda.setCanvas(canvas);
veda.loadFragmentShader(```

precision highp float;
uniform vec2 resolution;


void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    gl_FragColor = vec4(uv,0.5+0.5*sin(time),1.0);
}

```);

veda.play();

