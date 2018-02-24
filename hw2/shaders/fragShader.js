var fragShader = `

	precision mediump float;
    uniform sampler2D tGrass, tSnow, tHill, tWater;

    varying vec2 vUv;
    varying float vDisplace; 

    void main() {

		vec4 grass = texture2D(tGrass, vUv);
		vec4 snow = texture2D(tSnow, vUv);
		vec4 hill = texture2D(tHill, vUv);
		vec4 water = texture2D(tWater, vUv);

		float zOffset = vDisplace;

		vec4 mix1 = mix(grass, hill, min(1.0,zOffset*8.0));
		vec4 mix2 = max(vec4(1.0), mix(hill, snow, zOffset) * 1.5);
		vec4 mix3 = mix(mix1, mix2, zOffset);

		gl_FragColor = vec4( mix3.rgb, 1.0 );        
   }`;