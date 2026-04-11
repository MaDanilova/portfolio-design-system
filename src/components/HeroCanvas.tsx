"use client";

import { useRef, useMemo, useEffect, useCallback, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ---------- Inline shaders (avoids webpack raw-loader config) ----------

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision mediump float;
varying vec2 vUv;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uScrollProgress;
uniform vec3 uColorAcid;
uniform vec3 uColorMist;
uniform vec3 uColorBase;

vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}

float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;
  x12.xy-=i1;
  i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m;m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}

float fbm(vec2 p){
  float v=0.0;float a=0.5;
  for(int i=0;i<3;i++){v+=a*snoise(p);p*=2.0;a*=0.5;}
  return v;
}

void main(){
  vec2 uv=vUv;
  vec2 aspect=vec2(uResolution.x/uResolution.y,1.0);
  vec2 p=uv*aspect;
  float t=uTime*0.15;
  float n=fbm(p*3.0+t);
  vec2 mouse=uMouse*aspect;
  float dist=length(p-mouse);
  n+=smoothstep(0.3,0.0,dist)*0.1;
  float acidMask=smoothstep(0.2,0.6,n)*0.15;
  float mistMask=smoothstep(-0.3,0.1,n)*smoothstep(0.4,0.1,n)*0.1;
  vec3 color=uColorBase;
  color=mix(color,uColorAcid,acidMask);
  color=mix(color,uColorMist,mistMask);
  float alpha=1.0-uScrollProgress;
  gl_FragColor=vec4(color,alpha);
}
`;

// ---------- Noise plane mesh ----------

function NoisePlane({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseTarget = useRef({ x: 0.5, y: 0.5 });
  const mouseLerped = useRef({ x: 0.5, y: 0.5 });
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uScrollProgress: { value: 0 },
      uColorAcid: { value: new THREE.Color("#0E0E0E") },
      uColorMist: { value: new THREE.Color("#6B6B6B") },
      uColorBase: { value: new THREE.Color("#FFFFFF") },
    }),
    []
  );

  // Track mouse
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseTarget.current.x = e.clientX / window.innerWidth;
      mouseTarget.current.y = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Respect prefers-reduced-motion
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;

    if (!prefersReduced) {
      mat.uniforms.uTime.value += delta;
    }

    // Lerp mouse
    mouseLerped.current.x += (mouseTarget.current.x - mouseLerped.current.x) * 0.05;
    mouseLerped.current.y += (mouseTarget.current.y - mouseLerped.current.y) * 0.05;
    mat.uniforms.uMouse.value.set(mouseLerped.current.x, mouseLerped.current.y);

    mat.uniforms.uScrollProgress.value = scrollProgress.current;
    mat.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

// ---------- Exported component ----------

export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);

  const setUpScrollTrigger = useCallback(() => {
    if (!containerRef.current) return;

    // Fade canvas opacity based on scroll
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      },
    });
  }, []);

  useEffect(() => {
    setUpScrollTrigger();
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [setUpScrollTrigger]);

  // Check for WebGL support
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setSupported(false);
    } catch {
      setSupported(false);
    }
  }, []);

  if (!supported) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false }}
        camera={{ position: [0, 0, 1] }}
      >
        <NoisePlane scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
