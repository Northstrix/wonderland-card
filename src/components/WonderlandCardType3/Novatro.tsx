"use client";
import React, { useRef, useEffect } from "react";

export interface NovatroProps {
  color?: [number, number, number];
  style?: React.CSSProperties;
  className?: string;
}

export const Novatro: React.FC<NovatroProps> = ({
  color = [0.44, 0.77, 0.85],
  style,
  className,
}) => {
  const ctnDom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;
    const canvas = document.createElement("canvas");
    ctn.appendChild(canvas);

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vertSrc = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0., 1.);
      }
    `;

    const fragSrc = `
      precision highp float;
      uniform float uTime;
      uniform vec3 uColor;
      uniform vec3 uResolution;
      varying vec2 vUv;

      void main() {
        float mr = min(uResolution.x, uResolution.y);
        vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;
        float d = -uTime * 0.5;
        float a = 0.0;
        for (float i = 0.0; i < 8.0; ++i) {
            a += cos(i - d - a * uv.x);
            d += sin(uv.y * i + a);
        }
        d += uTime * 0.5;
        vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
        col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5);
        col = mix(col, uColor, 0.33); // Blend user color
        gl_FragColor = vec4(col,1.0);
      }
    `;

    function createShader(type: number, source: string): WebGLShader | null {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }
    function resize() {
      canvas.width = ctn.offsetWidth;
      canvas.height = ctn.offsetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);

    const vs = createShader(gl.VERTEX_SHADER, vertSrc);
    const fs = createShader(gl.FRAGMENT_SHADER, fragSrc);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    const position = gl.getAttribLocation(program, "position");
    const buffer = gl.createBuffer();
    if (!buffer) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "uTime");
    const uColorLoc = gl.getUniformLocation(program, "uColor");
    const uResolution = gl.getUniformLocation(program, "uResolution");
    if (!uTime || !uColorLoc || !uResolution) return;

    let frameId: number;
    function render(t: number) {
      gl.useProgram(program);
      gl.uniform1f(uTime, t * 0.001);
      gl.uniform3fv(uColorLoc, color);
      gl.uniform3f(
        uResolution,
        canvas.width,
        canvas.height,
        canvas.width / Math.max(1, canvas.height)
      );
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frameId = requestAnimationFrame(render);
    }
    render(performance.now());

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      ctn.removeChild(canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext?.();
    };
  }, [color]);

  return (
    <div
      ref={ctnDom}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        inset: 0,
        ...style,
      }}
    />
  );
};
