#ifdef GL_ES
precision highp float;
#endif
#define PI 3.14159265359
const float PHI = 1.61803398874989484820459;
const float SEED = 43758.0;
uniform vec2 resolution;
uniform sampler2D pg;
uniform sampler2D pg2;
uniform sampler2D img;
uniform float ak;
uniform float dirX;
uniform float dirY;
uniform float satOn;
uniform float proD;
uniform float u_time;
uniform float u_text1;
uniform float u_text2;
uniform float u_scale;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

 float noise (in vec2 st) {
     vec2 i = floor(st);
     vec2 fu = fract(st);
     float a = random(i);
     float b = random(i + vec2(1.0, 0.0));
     float c = random(i + vec2(0.0, 1.0));
     float d = random(i + vec2(1.0, 1.0));
     vec2 u = fu * fu * (3.0 - 2.0 * fu);
     return mix(a, b, u.x) +(c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
 }


vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  uv.y = 1. - uv.y;

  vec2 offset;
  vec2 pgCol;

  if(u_text1 == 0.0){
   offset = vec2(texture2D(pg2, uv).r * 10. * ak ) * vec2(1./resolution.x, 1./resolution.y);  //* ceil(random(uv/1.0));
  }else{
   offset = vec2(texture2D(pg2, uv).r * 10. * ak ) * vec2(1./resolution.x, 1./resolution.y) * noise(uv*u_scale); 
  }
  
  //

  pgCol = vec2(texture2D(pg, uv));

  if(satOn == 1.0){/////sadece düz
    if(pgCol.x < proD) offset.x *= dirX * -1.;
     else offset.x *= dirX;
    if(pgCol.y < proD) offset.y *= dirY * -1.;
     else  offset.y *= dirY;
  }else if(satOn == 2.0){////bu kose
    if(pgCol.x < .5) offset.x *= -1.;
      else if(pgCol.x < 1.) offset.x *= dirX;
    if(pgCol.y < .5) offset.y *= -1.;
      else if(pgCol.y < 1.) offset.y *= dirY;
  }else if(satOn == 3.0){////////bu da hepsi
    if(pgCol.x < .1) offset.x *= -1.;
      else offset.x *= dirX;
    if(pgCol.y < .1) offset.y *= -1.;
      else  offset.y *= dirY;
  }else if(satOn == 4.0){
   float ss = smoothstep(sin(u_time) - 0.006,cos(u_time),uv.y) - smoothstep(cos(u_time),sin(u_time)+ 0.006,uv.y);
   float ss2 = smoothstep(cos(u_time) - 0.006,sin(u_time),uv.x) - smoothstep(sin(u_time),cos(u_time)+ 0.006,uv.x);
   if(pgCol.x < .1) offset.x *=  -1. * ss2;
    else if(pgCol.x < 1.) offset.x *= 1. * ss2;
    if(pgCol.y < .1) offset.y *= -1. * cos(u_time);
    else if(pgCol.y < 1.) offset.y *= 1. * cos(u_time);
    }


  
//   if(pgCol.x < proD) offset.x *= -1. * sin(u_time);
//   else offset.x *= 1.* sin(u_time);
//  if(pgCol.y < proD) offset.y *=  -1.* cos(u_time);
//   else  offset.y *= 1. * cos(u_time);



  vec3 c = texture2D(img, uv + offset).rgb ;
  

if(u_text2 == 0.0){
  c -= texture2D(img, uv + ceil(random(uv/1.0)) - offset).rgb;
  c += texture2D(img, uv + ceil(random(uv/1.0)) + offset).rgb;
}else{
  c -= texture2D(img, uv + (noise(uv*20.0)) - offset).rgb;
  c += texture2D(img, uv + (noise(uv*20.0)) + offset).rgb;
}

  




  // c.rgb += vec3(0.0,0.0,1.0);

  //  c.rgb += vec3(1.0,0.0,0.0);

  //  c.rgb += vec3(0.0,1.0,0.0);

  // c.rgb += vec3(0.0,1.0,1.0);
  
  gl_FragColor = vec4(c, 1.0);
  }
