var sdfVShader = `

    varying vec3 v_pos;

    void main() {
        v_pos = position; //copying pixel we are working on from the vertex shader
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`;

var sdfFShader   = `

    const int MAX_MARCHING_STEPS = 300;
    const float EPISOLON = 0.0001;
    const float START = 0.0;
    const float END = 300.0;


    uniform vec2 resolution;
    uniform float time;
    varying vec3 v_pos;

    //torus
    float torusSDF( vec3 p, vec2 t )
    {
      vec2 q = vec2(length(p.xz)-t.x,p.y);
      return length(q)-t.y;
    }

    //rect
    float rectSDF( vec3 p, vec3 b )
    {
      vec3 d = abs(p) - b;
      return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
    }

    //bend
    float opCheapBend( vec3 p )
    {
        float c = cos(0.08*p.x*   (abs(sin(time*15.0))*2.4)  );
        float s = sin(0.08*p.x*   (abs(sin(time*15.0))*2.4)    );
        mat2  m = mat2(c,s,-s,c);
        vec3  q = vec3(m*p.xy,p.z);
        return rectSDF(q-vec3(0.0,-0.5, 0.0), vec3(2.0, 0.1, 1.0) );
    }

    //twist
    float opTwist( vec3 p )
    {
        float c = cos(15.0*p.y+10.0);
        float s = sin(15.0*p.y+10.0);
        mat2  m = mat2(c,-s,s,c);
        vec3  q = vec3(m*p.xz,p.y);
        return torusSDF(q, vec2(0.5 , 0.25));
    }

    float opUnion( float d1, float d2 )
    {
        return min(d1,d2);
    }

    float opSubtract( float d1, float d2 )
    {
        return max(-d1,d2);
    }

        float sceneSDF(vec3 sPoint) {

        //OffSet
        float twistOffset = 0.85; //(2.0 * abs(sin(20.0 * time)) ) - 1.0;
        
        //Geometries
        float twistObj = opTwist(sPoint-vec3(0.0,twistOffset, 0.0) );
        float planeBend = opCheapBend(sPoint);
        float objects = opUnion(twistObj, planeBend);
        return objects;

    }


    //COPIED FROM SHADERTOY
    // https://www.shadertoy.com/view/lt33z7
    vec3 rayDirection(float fieldOfView, vec2 size, vec2 fragCoord) {
        vec2 xy = fragCoord;
        float z = size.y / tan(radians(fieldOfView) / 2.0);
        return normalize(vec3(xy, -z));
    }

    // COPIED FROM SHADERTOY
    // https://www.shadertoy.com/view/lt33z7
    mat3 rayMarchViewMatrix(vec3 cam, vec3 center, vec3 up) {
        // Based on gluLookAt man page
        vec3 f = normalize(center - cam);
        vec3 s = normalize(cross(f, up));
        vec3 u = cross(s, f);
        return mat3(s, u, -f);
    }

    // COPIED FROM SHADERTOY - gradient of SDF to estimate normal on surface at point p
    vec3 estimateNormal(vec3 p) {
    return normalize(vec3(
        sceneSDF(vec3(p.x + EPISOLON, p.y, p.z)) - sceneSDF(vec3(p.x - EPISOLON, p.y, p.z)),
        sceneSDF(vec3(p.x, p.y + EPISOLON, p.z)) - sceneSDF(vec3(p.x, p.y - EPISOLON, p.z)),
        sceneSDF(vec3(p.x, p.y, p.z  + EPISOLON)) - sceneSDF(vec3(p.x, p.y, p.z - EPISOLON))
    ));
    }

    // COPIED FROM SHADERTOY
    vec3 phongContribForLight(vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye,
                              vec3 lightPos, vec3 lightIntensity) {
        vec3 N = estimateNormal(p);
        vec3 L = normalize(lightPos - p);
        vec3 V = normalize(eye - p);
        vec3 R = normalize(reflect(-L, N));
        
        float dotLN = dot(L, N);
        float dotRV = dot(R, V);
        
        if (dotLN < 0.0) {
            // Light not visible from this point on the surface
            return vec3(0.0, 0.0, 0.0);
        } 
        
        if (dotRV < 0.0) {
            // Light reflection in opposite direction as viewer, apply only diffuse
            // component
            return lightIntensity * (k_d * dotLN);
        }
        return lightIntensity * (k_d * dotLN + k_s * pow(dotRV, alpha));
    }

    // COPIED FROM SHADERTOY
    vec3 phongIllumination(vec3 k_a, vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye) {
        const vec3 ambientLight = 0.5 * vec3(1.0, 1.0, 1.0);
        vec3 color = ambientLight * k_a;        
        vec3 light1Pos = vec3(4.0 * sin(time),
                              2.0,
                              4.0 * cos(time));
        vec3 light1Intensity = vec3(0.7, 0.7, 0.7);
            
        color += phongContribForLight(k_d, k_s, alpha, p, eye,
                                    light1Pos,
                                    light1Intensity);
        return color;
    }

    //RAY MARCHING ALGORITHM
    float rayMarch(vec3 cam, vec3 dir, float start, float end) {      
        float step = start; //first step is at 0
        for(int i = 0; i < MAX_MARCHING_STEPS; i++) {
            //For sphere....
            float dist = sceneSDF(cam + step * dir); 
            //For box....
            //float dist = boxSDF(cam + step * dir, vec3(1.0,1.0,1.0));
            if (dist < EPISOLON) {
                //Inside geometry (EPISOLON is a very small number
                return step; //return where you stopped
            }
            step += dist; 
            if (step >= end) {
                return end; //passed the geoemtry
            }
        }
        return end;
    }

    void main() {

        vec3 cam = vec3(0.0,0.0,10.0); //sphere
        vec3 dir = rayDirection(50.0, resolution, v_pos.xy);

        mat3 viewToWorld = rayMarchViewMatrix(cam, vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
        vec3 worldDir = viewToWorld * dir;

        float dist = rayMarch(cam, dir, START, END); //dir for sphere, worldDir for box

        if (dist > END -  EPISOLON) {
            gl_FragColor = vec4 (0.0,0.0,0.0,1.0);
            return;
        }

        vec3 p = cam + dist * dir;
        
        vec3 K_a = vec3(sin(time), 0.5, 0.5);
        vec3 K_d = vec3(0.5, sin(time), 0.5);
        vec3 K_s = vec3(1.0, 1.0, 1.0 * sin(time));
        float shininess = 10.0;
        
        vec3 color = phongIllumination(K_a, K_d, K_s, shininess, p, cam);
        
        gl_FragColor = vec4(color, 1.0);
    }
    `;