const regl = require('regl')(document.body)

var pressedKeys = {
	'ArrowLeft': 0,
	'ArrowRight': 0,
};

window.onkeyup = function(e) {
	pressedKeys[e.code] = 0
	//console.log(pressedKeys[e.code], 'up')
}
window.onkeydown = function(e) {
	pressedKeys[e.code] = 1
	//console.log(pressedKeys[e.code], 'down')
}

/*
  tags: fbo, basic

  <p>This example implements the game of life in regl.</p>

 */

//const keyCodes = {
//}

const RADIUS = 32
const RADIUS2 = 128
const INITIAL_CONDITIONS = (Array(RADIUS * RADIUS * 4)).fill(0).map(
  () => Math.random() > 0.5 ? 255 : 0)
const INITIAL_CONDITIONS2 = (Array(RADIUS2 * RADIUS2 * 4)).fill(0).map(
  () => 0)

//for(let i = 0; i < 4; i++)
	INITIAL_CONDITIONS2[INITIAL_CONDITIONS2.length/2+103-0] = 255*.1 // -v.y
	INITIAL_CONDITIONS2[INITIAL_CONDITIONS2.length/2+103-1] = 255*.5 // -v.x
	INITIAL_CONDITIONS2[INITIAL_CONDITIONS2.length/2+103-2] = 255*.5 // p.y
	INITIAL_CONDITIONS2[INITIAL_CONDITIONS2.length/2+103-3] = 255*.5 // p.x

const state = (Array(2)).fill().map(() =>
  regl.framebuffer({
    color: regl.texture({
      radius: RADIUS,
      data: INITIAL_CONDITIONS,
      wrap: 'repeat'
    }),
    depthStencil: false
  }))

const state2 = (Array(2)).fill().map(() =>
  regl.framebuffer({
    color: regl.texture({
      radius: RADIUS2,
      data: INITIAL_CONDITIONS2,
      wrap: 'repeat'
    }),
    depthStencil: false
  }))

//const updatePlayer = regl({
  //frag: `
  //precision mediump float;
  //uniform float tick;
  //void main() {
		//gl_FragColor = vec4(mod(tick,2.));
  //}`,

  //framebuffer: ({tick}) => state2[(tick + 1) % 2],

	//uniforms: {
    //tick: regl.context('tick'),
  //},
//})

const updateLife = regl({
  frag: `
  precision mediump float;
  uniform sampler2D prevState;
  uniform float tick;
  varying vec2 uv;
  void main() {
		float s = texture2D(prevState, uv).r;
		if(mod(tick,10.)!=0.){
			gl_FragColor = vec4(s);
			return;
		}
    float n = 0.0;
    for(int dx=-1; dx<=1; ++dx)
    for(int dy=-1; dy<=1; ++dy) {
      n += texture2D(prevState, uv+vec2(dx,dy)/float(${RADIUS})).r;
    }
    if(n > 3.0+s || n < 3.0) {
      gl_FragColor = vec4(0,0,0,1);
    } else {
      gl_FragColor = vec4(1,1,1,1);
    }
  }`,

  framebuffer: ({tick}) => state[(tick + 1) % 2],

	uniforms: {
    tick: regl.context('tick'),
  },
})

const updateLife2 = regl({
  frag: `
  precision mediump float;
  uniform sampler2D prevState2;
  uniform float tick;
  uniform float keyPressedLeft;
  uniform float keyPressedRight;
  uniform sampler2D prevState;
  varying vec2 uv;

	#define R 3.
	#define max_speed 2.

	float rnd(float x) {return fract(54321.987 * sin(987.12345 * x))*2.-1.;}

  void main() {
    vec3 px = vec3(vec2(1./float(${RADIUS2})),.0);
    vec2 FC = uv*float(${RADIUS2});
		
    vec2 p,v,f=vec2(0.);
    
    //if(mod(float(tick),1000.)<=100.){
        //gl_FragColor=vec4(0.);
            //if(length(uv-.5)<.05)
            //gl_FragColor=vec4(.5,.5,.5,.5);
    //}
    
    for(float i=-R;i<=R;i++){
			for(float j=-R;j<=R;j++){
					vec2 ij=vec2(i,j);
					vec2 uv_n = uv+ij*px.xy; // uv of neighbour
					if(uv_n!=fract(uv_n))continue; // on edge
					vec4 neighbour=texture2D(prevState2, uv_n);
					
					if(length(neighbour)==0.)continue; // empty

					p = neighbour.rg-ij;
					v = neighbour.ba*2.-1.;
					
					if(length(v)>max_speed)
						v = max_speed*normalize(v);

					// if not in not blocked by GoL pattern, move
					if(texture2D(prevState, uv_n).r == 1.) {
						p+=v;
						v.y=-abs(v.y*1.1);
					}
					else {
						p+=v;
					}
					if(keyPressedLeft > .5) {
						p.x += .3;
					}
					if(keyPressedRight > .5) {
						p.x -= .3;
					}
					
					if(p==fract(p)){ // if the particle is guest
						gl_FragColor.rg = p;
						gl_FragColor.ba = v*.5+.5;
					}
			}
    }
    
    if(length(gl_FragColor)>0.){
        v = gl_FragColor.ba*2.-1.;
        //v += f/20.;
				//v*=.9;
				v.y+=.01;
        if(length(v)>max_speed) v=max_speed*normalize(v);
        if(FC.x<max_speed) v.x=-abs(v.x);
        if(FC.x>float(${RADIUS2})-max_speed) v.x=abs(v.x);
        if(FC.y<max_speed) v.y=-abs(v.y);
        if(FC.y>float(${RADIUS2})-max_speed) v.y=abs(v.y);
        gl_FragColor.ba = v*.5+.5;
    }
}

	`,

  framebuffer: ({tick}) => state2[(tick + 1) % 2],

	uniforms: {
    tick: regl.context('tick'),
		prevState: ({tick}) => state[(tick) % 2],
		keyPressedLeft: () => {
			return pressedKeys['ArrowLeft']
		},
		keyPressedRight: () => {
			return pressedKeys['ArrowRight']
		},
  },
})

const setupQuad = regl({
  frag: `
  precision mediump float;
  uniform sampler2D prevState;
  uniform sampler2D prevState2;
  varying vec2 uv;
  void main() {
    gl_FragColor = vec4(0., 0., 0., 1.);
		vec4 player = texture2D(prevState2, uv);
		if(length(player)>0.) {
			gl_FragColor = vec4(player.rgb, 1.);
		}
    gl_FragColor.b += texture2D(prevState, uv).r*.5;
  }`,

  vert: `
  precision mediump float;
  attribute vec2 position;
  varying vec2 uv;
  void main() {
    uv = 0.5 * (position + 1.0);
    gl_Position = vec4(position, 0, 1);
  }`,

  attributes: {
    position: [ -4, -4, 4, -4, 0, 4 ]
  },

  uniforms: {
		prevState: ({tick}) => state[(tick) % 2],
		prevState2: ({tick}) => state2[(tick) % 2],
  },

  depth: { enable: false },

  count: 3
})

regl.frame(() => {
  setupQuad(() => {
		//updatePlayer()
    updateLife()
    updateLife2()
    regl.draw()
  })
})

