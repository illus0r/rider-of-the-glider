precision highp float;
uniform vec2 resolution;
uniform float time;
uniform sampler2D backbuffer;
uniform int FRAMEINDEX;

float Cell( in vec2 p ) {
    return (texture2D(backbuffer, p/resolution).x > 0.5 ) ? 1. : 0.;
}

float hash1( float n ) {
  return fract(sin(n)*138.5453123);
    // return 0.;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  // if(mod(float(FRAMEINDEX),100.)==0.){
  //   gl_FragColor = vec4(uv.xyxy);
  //   return;
  // }
  // else{
  //   gl_FragColor = texture2D(backbuffer, uv-vec2(0.01,0.));
  //   return;
  // }
  //
  vec2 px = gl_FragCoord.xy;
  float f=0.;

  if( time<1.1) {
    f = step(0.5, hash1(gl_FragCoord.x*13.0+hash1(gl_FragCoord.y*71.1)+1.));
    gl_FragColor = vec4(f);
    return;
  }

  if(mod(float(FRAMEINDEX),10.)==0.){
    float e = Cell(px);
    float k =   Cell(px+vec2(-1,-1)) + Cell(px+vec2(0,-1)) + Cell(px+vec2(1,-1))
              + Cell(px+vec2(-1, 0))                        + Cell(px+vec2(1, 0))
              + Cell(px+vec2(-1, 1)) + Cell(px+vec2(0, 1)) + Cell(px+vec2(1, 1));
    f = ( ((k==2.)&&(e==1.)) || (k==3.) ) ? 1.0 : 0.0;
    gl_FragColor = vec4(f);
    return;
  }
  gl_FragColor = vec4(Cell(px));


}
