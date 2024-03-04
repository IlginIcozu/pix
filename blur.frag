precision highp float;
#define PI 3.14159265359
varying vec2 vTexCoord;
uniform sampler2D uTexture0;
uniform float u_time;
uniform vec2 uResolution;
uniform float u_octave;
uniform float u_fbmAmp;
uniform float u_roundness;
uniform float u_angleC;
highp float random(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 fu = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = fu * fu * (3.0 - 2.0 * fu);
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 4
float fbm (in vec2 st) {
    float value = 0.0;
    float amplitude = 0.25;
    float frequency = 0.1;
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude* noise(st);
        st *= u_octave + u_time/100.0;
        amplitude *= .45; 
    }
    return value;
}

float fbm6( in vec2 p ){
    vec2 q = vec2( fbm( p + vec2(0.0,u_roundness) ),
                   fbm( p + vec2(0.0,2.0) ) );
    vec2 r = vec2( fbm( p + 4.0*q + vec2(4.0,3.0)),
                   fbm( p + 4.0*q + vec2(u_angleC * 4.0,0.0)));
    return fbm( p + u_fbmAmp* r ); // 2.0, 6.0
}

void main() {
  vec2 st = gl_FragCoord.xy/uResolution.xy;
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  vec2 texelSize = 1.0 / uResolution;
  vec2 offset;
  float scale = 0.1;
  float offset2 = 0.1;
  float angle;

  angle = noise(st + uv * 0.2) * PI * 2.0; //0.01 0.4

  float radius = offset2;

  st *= scale;
  st *= radius * vec2(fract(angle *  st.x), fract(angle / st.y));

  offset = texelSize  * vec2(4.0,4.0) - fbm6(uv) + 0.18;

  vec4 color = vec4(0.0);

  float div;
  
  color += texture2D(uTexture0, uv + vec2(offset.y, st.y)); 
  color += texture2D(uTexture0, uv + vec2(-offset.y, st.y)); 
  color += texture2D(uTexture0, uv + vec2(-offset.x, st.x)); 
  color += texture2D(uTexture0, uv + vec2(offset.x, st.x)); 

  color += texture2D(uTexture0, uv + vec2(offset.y, -st.y)); 
  color += texture2D(uTexture0, uv + vec2(-offset.y, -st.y)); 
  color += texture2D(uTexture0, uv + vec2(-offset.x, -st.x)); 
  color += texture2D(uTexture0, uv + vec2(offset.x, -st.x)); 

  div = 8.0;

  color /= div;
             
  gl_FragColor = color;

}