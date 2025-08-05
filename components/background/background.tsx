import { useRef, useEffect, useState } from "react";

const DEFAULT_COLOR = "#ffffff";

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? [
        parseInt(m[1], 16) / 255,
        parseInt(m[2], 16) / 255,
        parseInt(m[3], 16) / 255,
      ]
    : [1, 1, 1];
};

type Origin =
  | "top-left"
  | "top-right"
  | "left"
  | "right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "top-center";

const getAnchorAndDir = (
  origin: Origin,
  w: number,
  h: number
): { anchor: [number, number]; dir: [number, number] } => {
  const outside = 0.2;
  switch (origin) {
    case "top-left":
      return { anchor: [0, -outside * h], dir: [0, 1] };
    case "top-right":
      return { anchor: [w, -outside * h], dir: [0, 1] };
    case "left":
      return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
    case "right":
      return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
    case "bottom-left":
      return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
    case "bottom-center":
      return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
    case "bottom-right":
      return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
    default:
      return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
  }
};

interface LightRaysProps {
  raysOrigin?: Origin;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  className?: string;
}

const LightRays: React.FC<LightRaysProps> = ({
  raysOrigin = "top-center",
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1.0,
  saturation = 1.0,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0.0,
  distortion = 0.0,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationIdRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Create shader
  const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  };

  // Create program
  const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null => {
    const program = gl.createProgram();
    if (!program) return null;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    
    return program;
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(canvasRef.current);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl:any = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    glRef.current = gl as WebGLRenderingContext;

    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 vUv;
      void main() {
        vUv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_rayPos;
      uniform vec2 u_rayDir;
      uniform vec3 u_raysColor;
      uniform float u_raysSpeed;
      uniform float u_lightSpread;
      uniform float u_rayLength;
      uniform float u_pulsating;
      uniform float u_fadeDistance;
      uniform float u_saturation;
      uniform vec2 u_mousePos;
      uniform float u_mouseInfluence;
      uniform float u_noiseAmount;
      uniform float u_distortion;
      
      varying vec2 vUv;
      
      float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      float smoothNoise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        
        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));
        
        vec2 u = f * f * (3.0 - 2.0 * f);
        
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      
      void main() {
        vec2 coord = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
        vec2 rayStart = (u_rayPos - 0.5 * u_resolution.xy) / u_resolution.y;
        
        // Add mouse influence
        vec2 mouseOffset = (u_mousePos - 0.5) * u_mouseInfluence;
        rayStart += mouseOffset;
        
        // Add noise and distortion
        float noiseValue = smoothNoise(coord * 10.0 + u_time * 0.5) * u_noiseAmount;
        coord += vec2(sin(coord.y * 10.0 + u_time) * u_distortion, cos(coord.x * 10.0 + u_time) * u_distortion);
        
        vec2 rayDirection = normalize(u_rayDir);
        
        // Calculate distance from point to ray
        vec2 toPoint = coord - rayStart;
        float projLength = dot(toPoint, rayDirection);
        vec2 projection = rayStart + rayDirection * projLength;
        float distanceToRay = length(coord - projection);
        
        // Create multiple rays with spread
        float rayIntensity = 0.0;
        int numRays = 12;
        
        for (int i = 0; i < 12; i++) {
          float angle = float(i) / 12.0 * 3.14159 * 2.0 * u_lightSpread;
          vec2 currentRayDir = vec2(
            rayDirection.x * cos(angle) - rayDirection.y * sin(angle),
            rayDirection.x * sin(angle) + rayDirection.y * cos(angle)
          );
          
          vec2 currentToPoint = coord - rayStart;
          float currentProjLength = dot(currentToPoint, currentRayDir);
          vec2 currentProjection = rayStart + currentRayDir * currentProjLength;
          float currentDistanceToRay = length(coord - currentProjection);
          
          // Ray intensity calculation
          float rayFalloff = 1.0 / (1.0 + currentDistanceToRay * 50.0);
          float lengthFalloff = smoothstep(u_rayLength, 0.0, currentProjLength);
          
          // Add time-based animation
          float timeOffset = sin(u_time * u_raysSpeed + float(i) * 0.5) * 0.5 + 0.5;
          
          // Pulsating effect
          float pulse = u_pulsating > 0.5 ? (sin(u_time * 3.0) * 0.3 + 0.7) : 1.0;
          
          rayIntensity += rayFalloff * lengthFalloff * timeOffset * pulse;
        }
        
        // Apply fade distance
        float fadeFactor = 1.0 - smoothstep(0.0, u_fadeDistance, length(coord - rayStart));
        rayIntensity *= fadeFactor;
        
        // Add noise to intensity
        rayIntensity += noiseValue * 0.1;
        
        // Apply saturation
        rayIntensity = pow(rayIntensity, 1.0 / u_saturation);
        
        // Final color
        vec3 finalColor = u_raysColor * rayIntensity;
        float alpha = rayIntensity;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    programRef.current = program;

    // Get uniform locations
    const uniforms = {
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_rayPos: gl.getUniformLocation(program, 'u_rayPos'),
      u_rayDir: gl.getUniformLocation(program, 'u_rayDir'),
      u_raysColor: gl.getUniformLocation(program, 'u_raysColor'),
      u_raysSpeed: gl.getUniformLocation(program, 'u_raysSpeed'),
      u_lightSpread: gl.getUniformLocation(program, 'u_lightSpread'),
      u_rayLength: gl.getUniformLocation(program, 'u_rayLength'),
      u_pulsating: gl.getUniformLocation(program, 'u_pulsating'),
      u_fadeDistance: gl.getUniformLocation(program, 'u_fadeDistance'),
      u_saturation: gl.getUniformLocation(program, 'u_saturation'),
      u_mousePos: gl.getUniformLocation(program, 'u_mousePos'),
      u_mouseInfluence: gl.getUniformLocation(program, 'u_mouseInfluence'),
      u_noiseAmount: gl.getUniformLocation(program, 'u_noiseAmount'),
      u_distortion: gl.getUniformLocation(program, 'u_distortion'),
    };

    uniformsRef.current = uniforms;

    // Create buffer for triangle vertices
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    // Full screen triangle
    const positions = [
      -1, -1,
       3, -1,
      -1,  3
    ];
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Get attribute location
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

    // Setup WebGL state
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const updateSize = () => {
      if (!canvas || !gl) return;
      
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      gl.viewport(0, 0, canvas.width, canvas.height);
      
      if (uniforms.u_resolution) {
        gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
      }

      // Update ray position and direction
      const { anchor, dir } = getAnchorAndDir(raysOrigin, canvas.width, canvas.height);
      if (uniforms.u_rayPos) {
        gl.uniform2f(uniforms.u_rayPos, anchor[0], anchor[1]);
      }
      if (uniforms.u_rayDir) {
        gl.uniform2f(uniforms.u_rayDir, dir[0], dir[1]);
      }
    };

    const render = (time: number) => {
      if (!gl || !program) return;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      // Set uniforms
      const [r, g, b] = hexToRgb(raysColor);
      
      if (uniforms.u_time) gl.uniform1f(uniforms.u_time, time * 0.001);
      if (uniforms.u_raysColor) gl.uniform3f(uniforms.u_raysColor, r, g, b);
      if (uniforms.u_raysSpeed) gl.uniform1f(uniforms.u_raysSpeed, raysSpeed);
      if (uniforms.u_lightSpread) gl.uniform1f(uniforms.u_lightSpread, lightSpread);
      if (uniforms.u_rayLength) gl.uniform1f(uniforms.u_rayLength, rayLength);
      if (uniforms.u_pulsating) gl.uniform1f(uniforms.u_pulsating, pulsating ? 1.0 : 0.0);
      if (uniforms.u_fadeDistance) gl.uniform1f(uniforms.u_fadeDistance, fadeDistance);
      if (uniforms.u_saturation) gl.uniform1f(uniforms.u_saturation, saturation);
      if (uniforms.u_mouseInfluence) gl.uniform1f(uniforms.u_mouseInfluence, mouseInfluence);
      if (uniforms.u_noiseAmount) gl.uniform1f(uniforms.u_noiseAmount, noiseAmount);
      if (uniforms.u_distortion) gl.uniform1f(uniforms.u_distortion, distortion);

      // Update mouse position
      if (followMouse && mouseInfluence > 0.0) {
        const smoothing = 0.92;
        smoothMouseRef.current.x =
          smoothMouseRef.current.x * smoothing +
          mouseRef.current.x * (1 - smoothing);
        smoothMouseRef.current.y =
          smoothMouseRef.current.y * smoothing +
          mouseRef.current.y * (1 - smoothing);

        if (uniforms.u_mousePos) {
          gl.uniform2f(uniforms.u_mousePos, smoothMouseRef.current.x, smoothMouseRef.current.y);
        }
      }

      // Bind position buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      animationIdRef.current = requestAnimationFrame(render);
    };

    window.addEventListener('resize', updateSize);
    updateSize();
    animationIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }

      window.removeEventListener('resize', updateSize);

      if (gl) {
        const loseContextExt = gl.getExtension('WEBGL_lose_context');
        loseContextExt?.loseContext();
      }

      glRef.current = null;
      programRef.current = null;
      uniformsRef.current = {};
    };
  }, [
    isVisible,
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
  ]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseRef.current = { x, y };
    };

    if (followMouse) {
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [followMouse]);

  return (
    <canvas
      ref={canvasRef}
      className={`light-rays-container ${className}`.trim()}
      style={{ 
        width: '100%', 
        height: '100vh', 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        pointerEvents: 'none' 
      }}
    />
  );
};

// Demo component to test the LightRays
const LightRaysDemo = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative' }}>
      <LightRays
        raysOrigin="top-center"
        raysColor="#00ffff"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={3}
        pulsating={true}
        followMouse={true}
        mouseInfluence={0.2}
        className="light-rays-background"
      />
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        color: 'white', 
        fontSize: '2rem',
        zIndex: 10,
        textAlign: 'center'
      }}>
        <h1>Light Rays Background</h1>
        <p>Move your mouse to see the effect!</p>
      </div>
    </div>
  );
};

export default LightRaysDemo;