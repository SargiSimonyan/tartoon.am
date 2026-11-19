// "use client";

// import {
//   useMemo,
//   useRef,
//   useState,
//   useSyncExternalStore,
//   type ReactNode,
// } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import {
//   ContactShadows,
//   Html,
//   Line,
//   OrbitControls,
//   RoundedBox,
// } from "@react-three/drei";
// import * as THREE from "three";
// import {
//   getMaterial,
//   getProduct,
//   type HardwareId,
//   type MaterialId,
//   type Spec,
// } from "@/lib/pricing";

// /* -------------------------------------------------------------------------- */
// /*  Constants (all 3D units are metres; Spec values are millimetres)          */
// /* -------------------------------------------------------------------------- */

// type Vec3 = [number, number, number];

// const MM = 0.001;
// const T = 0.018; // board thickness
// const GAP = 0.003; // gap between doors
// const BACK = 0.008; // back panel thickness
// const OPEN_ANGLE = 1.9; // ~109°

// const FINISH: Record<MaterialId, number> = {
//   ldsp: 0.85,
//   mdf: 0.6,
//   veneer: 0.5,
//   oak: 0.45,
// };

// const HANDLE: Record<HardwareId, string> = {
//   standard: "#2b2b2b",
//   softclose: "#b9bdc2",
//   premium: "#b08d3c", // brass
// };

// type Look = {
//   color: string;
//   inner: string;
//   roughness: number;
//   handle: string;
//   instant: boolean;
// };

// /* -------------------------------------------------------------------------- */
// /*  Small helpers                                                             */
// /* -------------------------------------------------------------------------- */

// function shade(hex: string, lightness: number) {
//   return `#${new THREE.Color(hex).offsetHSL(0, 0, lightness).getHexString()}`;
// }

// const clamp = (n: number, lo: number, hi: number) =>
//   Math.min(hi, Math.max(lo, n));

// /** Keep door count sensible for the width (≈0.4–1.0 m per leaf). */
// function fitLeaves(wanted: number, w: number) {
//   const lo = Math.max(1, Math.ceil(w / 1.0));
//   const hi = Math.max(lo, Math.floor(w / 0.4));
//   return clamp(Math.round(wanted) || lo, lo, hi);
// }

// /* -------------------------------------------------------------------------- */
// /*  Building blocks                                                           */
// /* -------------------------------------------------------------------------- */

// function Panel({
//   size,
//   position,
//   look,
//   color,
// }: {
//   size: Vec3;
//   position: Vec3;
//   look: Look;
//   color?: string;
// }) {
//   return (
//     <mesh position={position} castShadow receiveShadow>
//       <boxGeometry args={size} />
//       <meshStandardMaterial
//         color={color ?? look.color}
//         roughness={look.roughness}
//       />
//     </mesh>
//   );
// }

// function Door({
//   x,
//   y,
//   z,
//   width,
//   height,
//   hinge,
//   handleY,
//   open,
//   look,
// }: {
//   x: number; // hinge x
//   y: number; // vertical centre
//   z: number; // front plane of the carcass
//   width: number;
//   height: number;
//   hinge: "left" | "right";
//   handleY: number;
//   open: boolean;
//   look: Look;
// }) {
//   const pivot = useRef<THREE.Group>(null);
//   const dir = hinge === "left" ? 1 : -1; // door extends from the hinge toward +x / -x

//   useFrame((state, delta) => {
//     const g = pivot.current;
//     if (!g) return;
//     const target = open ? -dir * OPEN_ANGLE : 0;
//     const next = look.instant
//       ? target
//       : THREE.MathUtils.damp(g.rotation.y, target, 7, delta);
//     g.rotation.y = next;
//     if (Math.abs(next - target) > 0.002) state.invalidate();
//   });

//   return (
//     <group ref={pivot} position={[x, y, z]}>
//       <Panel
//         size={[width, height, T]}
//         position={[(dir * width) / 2, 0, T / 2]}
//         look={look}
//       />
//       <Panel
//         size={[0.012, 0.16, 0.016]}
//         position={[dir * (width - 0.04), handleY, T + 0.008]}
//         look={look}
//         color={look.handle}
//       />
//     </group>
//   );
// }

// type CabinetProps = {
//   w: number;
//   h: number;
//   d: number;
//   plinth?: number;
//   columns: number;
//   doors?: number; // 0 = open shelving
//   interior?: "shelves" | "wardrobe";
//   shelves?: number; // fixed number of shelves per column (default: by height)
//   handle?: "auto" | "top" | "bottom";
//   open: boolean;
//   look: Look;
// };

// /** Generic carcass with columns, shelves, optional hanging rods and doors. */
// function Cabinet({
//   w,
//   h,
//   d,
//   plinth = 0,
//   columns,
//   doors = 0,
//   interior = "shelves",
//   shelves,
//   handle = "auto",
//   open,
//   look,
// }: CabinetProps) {
//   const bodyH = h - plinth;
//   const cy = plinth + bodyH / 2;
//   const innerW = w - 2 * T;
//   const innerH = bodyH - 2 * T;
//   const colW = (innerW - (columns - 1) * T) / columns;
//   const colX = (i: number) => -innerW / 2 + colW / 2 + i * (colW + T);
//   const shelfCount = shelves ?? Math.max(0, Math.floor(innerH / 0.35) - 1);
//   const leafW = doors > 0 ? (w - GAP * (doors + 1)) / doors : 0;
//   const doorH = bodyH - 2 * GAP;
//   const handleY =
//     handle === "top"
//       ? doorH / 2 - 0.08
//       : handle === "bottom"
//         ? -doorH / 2 + 0.08
//         : bodyH > 1.2
//           ? 1.05 - cy
//           : 0;

//   return (
//     <group>
//       {/* carcass */}
//       <Panel
//         size={[T, bodyH, d]}
//         position={[-(w / 2 - T / 2), cy, 0]}
//         look={look}
//       />
//       <Panel
//         size={[T, bodyH, d]}
//         position={[w / 2 - T / 2, cy, 0]}
//         look={look}
//       />
//       <Panel
//         size={[innerW, T, d]}
//         position={[0, plinth + bodyH - T / 2, 0]}
//         look={look}
//       />
//       <Panel
//         size={[innerW, T, d]}
//         position={[0, plinth + T / 2, 0]}
//         look={look}
//       />
//       <Panel
//         size={[innerW, innerH, BACK]}
//         position={[0, cy, -d / 2 + BACK / 2]}
//         look={look}
//         color={look.inner}
//       />
//       {plinth > 0 && (
//         <Panel
//           size={[w - 0.04, plinth, d - 0.06]}
//           position={[0, plinth / 2, -0.015]}
//           look={look}
//           color={look.inner}
//         />
//       )}

//       {/* vertical dividers */}
//       {Array.from({ length: columns - 1 }, (_, i) => (
//         <Panel
//           key={`div-${i}`}
//           size={[T, innerH, d - 0.01]}
//           position={[-innerW / 2 + (i + 1) * colW + (i + 0.5) * T, cy, -0.005]}
//           look={look}
//           color={look.inner}
//         />
//       ))}

//       {/* interior */}
//       {Array.from({ length: columns }, (_, i) => {
//         const x = colX(i);
//         const rod = interior === "wardrobe" && i % 2 === 0;
//         if (rod) {
//           return (
//             <group key={`col-${i}`}>
//               <mesh
//                 position={[x, plinth + bodyH - T - 0.1, 0]}
//                 rotation={[0, 0, Math.PI / 2]}
//                 castShadow
//               >
//                 <cylinderGeometry args={[0.012, 0.012, colW, 16]} />
//                 <meshStandardMaterial
//                   color="#d0d3d6"
//                   metalness={0.3}
//                   roughness={0.4}
//                 />
//               </mesh>
//               <Panel
//                 size={[colW, T, d - 0.03]}
//                 position={[x, plinth + bodyH - T - 0.32, -0.005]}
//                 look={look}
//                 color={look.inner}
//               />
//             </group>
//           );
//         }
//         return (
//           <group key={`col-${i}`}>
//             {Array.from({ length: shelfCount }, (_, k) => (
//               <Panel
//                 key={k}
//                 size={[colW, T, d - 0.03]}
//                 position={[
//                   x,
//                   plinth + T + ((k + 1) * innerH) / (shelfCount + 1),
//                   -0.005,
//                 ]}
//                 look={look}
//                 color={look.inner}
//               />
//             ))}
//           </group>
//         );
//       })}

//       {/* doors */}
//       {Array.from({ length: doors }, (_, i) => {
//         const hinge = i < doors / 2 ? "left" : "right";
//         const left = -w / 2 + GAP + i * (leafW + GAP);
//         return (
//           <Door
//             key={`door-${i}`}
//             x={hinge === "left" ? left : left + leafW}
//             y={cy}
//             z={d / 2}
//             width={leafW}
//             height={doorH}
//             hinge={hinge}
//             handleY={handleY}
//             open={open}
//             look={look}
//           />
//         );
//       })}
//     </group>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*  Product builders                                                          */
// /* -------------------------------------------------------------------------- */

// type BuildProps = {
//   w: number;
//   h: number;
//   d: number;
//   doors: number;
//   open: boolean;
//   look: Look;
// };

// function Wardrobe({ w, h, d, doors, open, look }: BuildProps) {
//   const n = fitLeaves(doors, w);
//   return (
//     <Cabinet
//       w={w}
//       h={h}
//       d={d}
//       plinth={0.08}
//       columns={n}
//       doors={n}
//       interior="wardrobe"
//       open={open}
//       look={look}
//     />
//   );
// }

// function Kitchen({ w, h, d, doors, open, look }: BuildProps) {
//   const n = fitLeaves(doors, w);
//   const baseH = 0.86;
//   const worktop = 0.04;
//   const upperD = Math.min(0.35, d);
//   const upperH = Math.min(0.9, Math.max(0, h - 1.45));
//   return (
//     <>
//       <Cabinet
//         w={w}
//         h={baseH}
//         d={d}
//         plinth={0.1}
//         columns={n}
//         doors={n}
//         handle="top"
//         open={open}
//         look={look}
//       />
//       <Panel
//         size={[w + 0.02, worktop, d + 0.03]}
//         position={[0, baseH + worktop / 2, 0.015]}
//         look={look}
//         color="#4b4742"
//       />
//       {upperH >= 0.35 && (
//         <group position={[0, h - upperH, -(d - upperD) / 2]}>
//           <Cabinet
//             w={w}
//             h={upperH}
//             d={upperD}
//             columns={n}
//             doors={n}
//             handle="bottom"
//             open={open}
//             look={look}
//           />
//         </group>
//       )}
//     </>
//   );
// }

// function Bookshelf({ w, h, d, doors, open, look }: BuildProps) {
//   // "sections" = horizontal compartments (rows), as in the front-elevation drawing
//   const rows = clamp(Math.round(doors) || 2, 2, Math.max(2, Math.floor(h / 0.2)));
//   const cols = Math.max(1, Math.round(w / 0.8));
//   return (
//     <Cabinet
//       w={w}
//       h={h}
//       d={d}
//       plinth={0.05}
//       shelves={rows - 1}
//       columns={cols}
//       doors={0}
//       open={open}
//       look={look}
//     />
//   );
// }

// function TvUnit({ w, h, d, doors, open, look }: BuildProps) {
//   const legs = h >= 0.4 ? 0.1 : 0;
//   const n = fitLeaves(doors || 2, w);
//   const lx = w / 2 - 0.1;
//   const lz = d / 2 - 0.08;
//   return (
//     <>
//       <group position={[0, legs, 0]}>
//         <Cabinet
//           w={w}
//           h={h - legs}
//           d={d}
//           columns={n}
//           doors={n}
//           open={open}
//           look={look}
//         />
//       </group>
//       {legs > 0 &&
//         (
//           [
//             [-lx, -lz],
//             [lx, -lz],
//             [-lx, lz],
//             [lx, lz],
//           ] as const
//         ).map(([x, z]) => (
//           <Panel
//             key={`${x}-${z}`}
//             size={[0.04, legs, 0.04]}
//             position={[x, legs / 2, z]}
//             look={look}
//             color={look.handle}
//           />
//         ))}
//     </>
//   );
// }

// function Bed({ w, h, d, look }: BuildProps) {
//   const legH = 0.12;
//   const frameH = clamp(h * 0.5, 0.12, 0.28);
//   const railTop = legH + frameH;
//   const headTop = Math.max(h, railTop + 0.1);
//   const matH = 0.24;
//   const matY = railTop - 0.03 + matH / 2;
//   const matTop = railTop - 0.03 + matH;
//   const pillows = w > 1.2 ? [-w / 4, w / 4] : [0];
//   const duvetL = d * 0.6;

//   return (
//     <>
//       {/* legs */}
//       {(
//         [
//           [-1, -1],
//           [1, -1],
//           [-1, 1],
//           [1, 1],
//         ] as const
//       ).map(([sx, sz]) => (
//         <Panel
//           key={`${sx}${sz}`}
//           size={[0.06, legH, 0.06]}
//           position={[sx * (w / 2 - 0.04), legH / 2, sz * (d / 2 - 0.04)]}
//           look={look}
//         />
//       ))}
//       {/* side rails + foot rail */}
//       <Panel
//         size={[0.03, frameH, d]}
//         position={[-(w / 2 - 0.015), legH + frameH / 2, 0]}
//         look={look}
//       />
//       <Panel
//         size={[0.03, frameH, d]}
//         position={[w / 2 - 0.015, legH + frameH / 2, 0]}
//         look={look}
//       />
//       <Panel
//         size={[w, frameH, 0.03]}
//         position={[0, legH + frameH / 2, d / 2 - 0.015]}
//         look={look}
//       />
//       {/* headboard */}
//       <Panel
//         size={[w, headTop - legH, 0.05]}
//         position={[0, legH + (headTop - legH) / 2, -d / 2 + 0.025]}
//         look={look}
//       />
//       {/* slat deck */}
//       <Panel
//         size={[w - 0.06, 0.02, d - 0.08]}
//         position={[0, railTop - 0.04, 0.01]}
//         look={look}
//         color={look.inner}
//       />
//       {/* mattress, pillows, duvet */}
//       <RoundedBox
//         args={[w - 0.06, matH, d - 0.08]}
//         radius={0.03}
//         smoothness={3}
//         position={[0, matY, 0.01]}
//         castShadow
//         receiveShadow
//       >
//         <meshStandardMaterial color="#ece6da" roughness={0.95} />
//       </RoundedBox>
//       {pillows.map((x) => (
//         <RoundedBox
//           key={x}
//           args={[Math.min(0.55, w / 2.6), 0.14, 0.38]}
//           radius={0.05}
//           smoothness={4}
//           position={[x, matTop + 0.07, -d / 2 + 0.3]}
//           castShadow
//         >
//           <meshStandardMaterial color="#f4efe6" roughness={0.95} />
//         </RoundedBox>
//       ))}
//       <RoundedBox
//         args={[w - 0.1, 0.06, duvetL]}
//         radius={0.025}
//         smoothness={3}
//         position={[0, matTop + 0.03, d / 2 - 0.06 - duvetL / 2]}
//         castShadow
//       >
//         <meshStandardMaterial color="#cfc6b4" roughness={0.95} />
//       </RoundedBox>
//     </>
//   );
// }

// function Table({ w, h, d, look }: BuildProps) {
//   const top = 0.03;
//   const leg = 0.07;
//   const inset = 0.06;
//   const apron = 0.09;
//   const lx = w / 2 - inset - leg / 2;
//   const lz = d / 2 - inset - leg / 2;
//   const legH = h - top;
//   return (
//     <>
//       <Panel size={[w, top, d]} position={[0, h - top / 2, 0]} look={look} />
//       {(
//         [
//           [-lx, -lz],
//           [lx, -lz],
//           [-lx, lz],
//           [lx, lz],
//         ] as const
//       ).map(([x, z]) => (
//         <Panel
//           key={`${x}-${z}`}
//           size={[leg, legH, leg]}
//           position={[x, legH / 2, z]}
//           look={look}
//         />
//       ))}
//       {[-lz, lz].map((z) => (
//         <Panel
//           key={`ax-${z}`}
//           size={[w - 2 * (inset + leg), apron, 0.025]}
//           position={[0, h - top - apron / 2, z]}
//           look={look}
//           color={look.inner}
//         />
//       ))}
//       {[-lx, lx].map((x) => (
//         <Panel
//           key={`az-${x}`}
//           size={[0.025, apron, d - 2 * (inset + leg)]}
//           position={[x, h - top - apron / 2, 0]}
//           look={look}
//           color={look.inner}
//         />
//       ))}
//     </>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*  Blueprint-style dimension lines                                           */
// /* -------------------------------------------------------------------------- */

// function Dimensions({ w, h, d }: { w: number; h: number; d: number }) {
//   const off = 0.18;
//   const z = d / 2 + off;
//   const x = w / 2 + off;
//   const color = "#9a7b3f";
//   const tag =
//     "pointer-events-none whitespace-nowrap bg-paper/85 px-1.5 py-0.5 font-mono text-[10px] text-ink";
//   return (
//     <group>
//       <Line points={[[-w / 2, 0.004, z], [w / 2, 0.004, z]]} color={color} lineWidth={1} />
//       <Html position={[0, 0.004, z]} center>
//         <span className={tag}>{Math.round(w * 1000)}</span>
//       </Html>

//       <Line points={[[x, 0, d / 2], [x, h, d / 2]]} color={color} lineWidth={1} />
//       <Html position={[x, h / 2, d / 2]} center>
//         <span className={tag}>{Math.round(h * 1000)}</span>
//       </Html>

//       <Line points={[[x, 0.004, -d / 2], [x, 0.004, d / 2]]} color={color} lineWidth={1} />
//       <Html position={[x, 0.004, 0]} center>
//         <span className={tag}>{Math.round(d * 1000)}</span>
//       </Html>
//     </group>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*  Scene                                                                     */
// /* -------------------------------------------------------------------------- */

// function Scene({
//   spec,
//   doors,
//   open,
//   instant,
//   dimensions,
// }: {
//   spec: Spec;
//   doors: number;
//   open: boolean;
//   instant: boolean;
//   dimensions: boolean;
// }) {
//   const w = spec.w * MM;
//   const h = spec.h * MM;
//   const d = spec.d * MM;
//   const size = Math.max(w, h, d);
//   const swatch = getMaterial(spec.material).swatch;

//   const look = useMemo<Look>(
//     () => ({
//       color: swatch,
//       inner: shade(swatch, -0.07),
//       roughness: FINISH[spec.material],
//       handle: HANDLE[spec.hardware],
//       instant,
//     }),
//     [swatch, spec.material, spec.hardware, instant],
//   );

//   const props: BuildProps = { w, h, d, doors, open, look };

//   let piece: ReactNode;
//   switch (spec.product) {
//     case "wardrobe":
//       piece = <Wardrobe {...props} />;
//       break;
//     case "kitchen":
//       piece = <Kitchen {...props} />;
//       break;
//     case "bookshelf":
//       piece = <Bookshelf {...props} />;
//       break;
//     case "tvunit":
//       piece = <TvUnit {...props} />;
//       break;
//     case "bed":
//       piece = <Bed {...props} />;
//       break;
//     case "table":
//       piece = <Table {...props} />;
//       break;
//   }

//   return (
//     <>
//       <hemisphereLight args={["#ffffff", "#d8ccb4", 0.9]} />
//       <directionalLight
//         position={[size * 1.1, size * 1.8, size * 1.4]}
//         intensity={2.4}
//         castShadow
//         shadow-mapSize={[1024, 1024]}
//         shadow-bias={-0.0004}
//         shadow-normalBias={0.02}
//       >
//         <orthographicCamera
//           attach="shadow-camera"
//           args={[-size * 1.2, size * 1.2, size * 1.2, -size * 1.2, 0.1, size * 6]}
//         />
//       </directionalLight>
//       <directionalLight position={[-size, size * 0.8, -size * 0.6]} intensity={0.6} />

//       {piece}
//       {dimensions && <Dimensions w={w} h={h} d={d} />}
//       <ContactShadows
//         position={[0, 0.001, 0]}
//         opacity={0.35}
//         scale={size * 3}
//         blur={2.5}
//         far={size}
//       />
//       <OrbitControls
//         makeDefault
//         enablePan={false}
//         enableDamping
//         target={[0, h / 2, 0]}
//         minDistance={0.6}
//         maxDistance={size * 5}
//         minPolarAngle={0.2}
//         maxPolarAngle={Math.PI / 2 - 0.03}
//       />
//     </>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*  Public component                                                          */
// /* -------------------------------------------------------------------------- */

// export type Furniture3DLabels = {
//   open: string;
//   close: string;
//   hint: string;
//   alt: string;
// };

// const DEFAULT_LABELS: Furniture3DLabels = {
//   open: "Open doors",
//   close: "Close doors",
//   hint: "Drag to rotate, scroll to zoom",
//   alt: "3D preview of the configured furniture",
// };

// export type Furniture3DProps = {
//   spec: Spec;
//   /** value of the "sections" slider: wardrobe/TV unit doors, kitchen modules, bookshelf rows */
//   doors?: number;
//   /** shown when WebGL is unavailable — pass your existing SVG preview */
//   fallback?: ReactNode;
//   labels?: Partial<Furniture3DLabels>;
//   /** draw width / height / depth lines with numbers around the model (off by default) */
//   dimensions?: boolean;
//   className?: string;
// };

// let webglSupport: boolean | undefined;
// function detectWebGL(): boolean {
//   if (webglSupport === undefined) {
//     try {
//       const c = document.createElement("canvas");
//       webglSupport = !!(c.getContext("webgl2") || c.getContext("webgl"));
//     } catch {
//       webglSupport = false;
//     }
//   }
//   return webglSupport;
// }
// const subscribeNone = () => () => {};

// const MQ = "(prefers-reduced-motion: reduce)";
// const subscribeMotion = (cb: () => void) => {
//   const m = window.matchMedia(MQ);
//   m.addEventListener("change", cb);
//   return () => m.removeEventListener("change", cb);
// };
// const motionReduced = () => window.matchMedia(MQ).matches;

// export function Furniture3D({
//   spec,
//   doors,
//   fallback = null,
//   labels,
//   dimensions = false,
//   className = "relative aspect-[4/3] w-full",
// }: Furniture3DProps) {
//   const l = { ...DEFAULT_LABELS, ...labels };
//   const webgl = useSyncExternalStore<boolean | null>(
//     subscribeNone,
//     detectWebGL,
//     () => null,
//   );
//   const instant = useSyncExternalStore(subscribeMotion, motionReduced, () => false);
//   const [open, setOpen] = useState(false);
//   const product = getProduct(spec.product);

//   // Initial camera per product (stable, so sliders never reset the user's view).
//   const camera = useMemo(() => {
//     const { w, h, d } = product.default;
//     const size = Math.max(w, h, d) * MM;
//     const dist = size * 2 + 1.2;
//     return {
//       position: [dist * 0.7, h * MM * 0.5 + dist * 0.35, dist * 0.85] as Vec3,
//       fov: 35,
//       near: 0.1,
//       far: 120,
//     };
//   }, [product]);

//   const box = `overflow-hidden ${className}`;

//   if (webgl === null) return <div className={box} aria-hidden />;
//   if (!webgl) return <>{fallback}</>;

//   const canOpen = ["wardrobe", "kitchen", "tvunit"].includes(spec.product);

//   return (
//     <div className={box} role="img" aria-label={l.alt}>
//       <Canvas
//         key={spec.product}
//         shadows
//         dpr={[1, 2]}
//         frameloop="demand"
//         camera={camera}
//         gl={{ antialias: true, alpha: true }}
//       >
//         <Scene
//           spec={spec}
//           doors={doors ?? product.defaultDoors}
//           open={open}
//           instant={instant}
//           dimensions={dimensions}
//         />
//       </Canvas>

//       {canOpen && (
//         <button
//           type="button"
//           aria-pressed={open}
//           onClick={() => setOpen((v) => !v)}
//           className="absolute right-3 top-3 border border-ink/25 bg-paper/90 px-3 py-1.5 font-mono text-xs text-ink transition-colors hover:border-ink/60 focus-visible:outline-2 focus-visible:outline-offset-2"
//         >
//           {open ? l.close : l.open}
//         </button>
//       )}
//       <p className="pointer-events-none absolute bottom-3 left-3 font-mono text-[0.65rem] text-ink/50">
//         {l.hint}
//       </p>
//     </div>
//   );
// }
"use client";

import {
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Html,
  Line,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";
import {
  getMaterial,
  getProduct,
  type HardwareId,
  type MaterialId,
  type Spec,
} from "@/lib/pricing";

/* -------------------------------------------------------------------------- */
/*  Constants (all 3D units are metres; Spec values are millimetres)          */
/* -------------------------------------------------------------------------- */

type Vec3 = [number, number, number];

const MM = 0.001;
const T = 0.018; // board thickness
const GAP = 0.003; // gap between doors
const BACK = 0.008; // back panel thickness
const OPEN_ANGLE = 1.9; // ~109°

const FINISH: Record<MaterialId, number> = {
  ldsp: 0.85,
  mdf: 0.6,
  veneer: 0.5,
  oak: 0.45,
};

const HANDLE: Record<HardwareId, string> = {
  standard: "#2b2b2b",
  softclose: "#b9bdc2",
  premium: "#b08d3c", // brass
};

type Look = {
  color: string;
  inner: string;
  roughness: number;
  handle: string;
  instant: boolean;
};

/* -------------------------------------------------------------------------- */
/*  Small helpers                                                             */
/* -------------------------------------------------------------------------- */

function shade(hex: string, lightness: number) {
  return `#${new THREE.Color(hex).offsetHSL(0, 0, lightness).getHexString()}`;
}

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));

/** Keep door count sensible for the width (≈0.4–1.0 m per leaf). */
function fitLeaves(wanted: number, w: number) {
  const lo = Math.max(1, Math.ceil(w / 1.0));
  const hi = Math.max(lo, Math.floor(w / 0.4));
  return clamp(Math.round(wanted) || lo, lo, hi);
}

/* -------------------------------------------------------------------------- */
/*  Building blocks                                                           */
/* -------------------------------------------------------------------------- */

function Panel({
  size,
  position,
  look,
  color,
}: {
  size: Vec3;
  position: Vec3;
  look: Look;
  color?: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color ?? look.color}
        roughness={look.roughness}
      />
    </mesh>
  );
}

function Door({
  x,
  y,
  z,
  width,
  height,
  hinge,
  handleY,
  open,
  look,
}: {
  x: number; // hinge x
  y: number; // vertical centre
  z: number; // front plane of the carcass
  width: number;
  height: number;
  hinge: "left" | "right";
  handleY: number;
  open: boolean;
  look: Look;
}) {
  const pivot = useRef<THREE.Group>(null);
  const dir = hinge === "left" ? 1 : -1; // door extends from the hinge toward +x / -x

  useFrame((state, delta) => {
    const g = pivot.current;
    if (!g) return;
    const target = open ? -dir * OPEN_ANGLE : 0;
    const next = look.instant
      ? target
      : THREE.MathUtils.damp(g.rotation.y, target, 7, delta);
    g.rotation.y = next;
    if (Math.abs(next - target) > 0.002) state.invalidate();
  });

  return (
    <group ref={pivot} position={[x, y, z]}>
      <Panel
        size={[width, height, T]}
        position={[(dir * width) / 2, 0, T / 2]}
        look={look}
      />
      <Panel
        size={[0.012, 0.16, 0.016]}
        position={[dir * (width - 0.04), handleY, T + 0.008]}
        look={look}
        color={look.handle}
      />
    </group>
  );
}

type CabinetProps = {
  w: number;
  h: number;
  d: number;
  plinth?: number;
  columns: number;
  doors?: number; // 0 = open shelving
  interior?: "shelves" | "wardrobe";
  shelves?: number; // fixed number of shelves per column (default: by height)
  handle?: "auto" | "top" | "bottom";
  open: boolean;
  look: Look;
};

/** Generic carcass with columns, shelves, optional hanging rods and doors. */
function Cabinet({
  w,
  h,
  d,
  plinth = 0,
  columns,
  doors = 0,
  interior = "shelves",
  shelves,
  handle = "auto",
  open,
  look,
}: CabinetProps) {
  const bodyH = h - plinth;
  const cy = plinth + bodyH / 2;
  const innerW = w - 2 * T;
  const innerH = bodyH - 2 * T;
  const colW = (innerW - (columns - 1) * T) / columns;
  const colX = (i: number) => -innerW / 2 + colW / 2 + i * (colW + T);
  const shelfCount = shelves ?? Math.max(0, Math.floor(innerH / 0.35) - 1);
  const leafW = doors > 0 ? (w - GAP * (doors + 1)) / doors : 0;
  const doorH = bodyH - 2 * GAP;
  const handleY =
    handle === "top"
      ? doorH / 2 - 0.08
      : handle === "bottom"
        ? -doorH / 2 + 0.08
        : bodyH > 1.2
          ? 1.05 - cy
          : 0;

  return (
    <group>
      {/* carcass */}
      <Panel
        size={[T, bodyH, d]}
        position={[-(w / 2 - T / 2), cy, 0]}
        look={look}
      />
      <Panel
        size={[T, bodyH, d]}
        position={[w / 2 - T / 2, cy, 0]}
        look={look}
      />
      <Panel
        size={[innerW, T, d]}
        position={[0, plinth + bodyH - T / 2, 0]}
        look={look}
      />
      <Panel
        size={[innerW, T, d]}
        position={[0, plinth + T / 2, 0]}
        look={look}
      />
      <Panel
        size={[innerW, innerH, BACK]}
        position={[0, cy, -d / 2 + BACK / 2]}
        look={look}
        color={look.inner}
      />
      {plinth > 0 && (
        <Panel
          size={[w - 0.04, plinth, d - 0.06]}
          position={[0, plinth / 2, -0.015]}
          look={look}
          color={look.inner}
        />
      )}

      {/* vertical dividers */}
      {Array.from({ length: columns - 1 }, (_, i) => (
        <Panel
          key={`div-${i}`}
          size={[T, innerH, d - 0.01]}
          position={[-innerW / 2 + (i + 1) * colW + (i + 0.5) * T, cy, -0.005]}
          look={look}
          color={look.inner}
        />
      ))}

      {/* interior */}
      {Array.from({ length: columns }, (_, i) => {
        const x = colX(i);
        const rod = interior === "wardrobe" && i % 2 === 0;
        if (rod) {
          return (
            <group key={`col-${i}`}>
              <mesh
                position={[x, plinth + bodyH - T - 0.1, 0]}
                rotation={[0, 0, Math.PI / 2]}
                castShadow
              >
                <cylinderGeometry args={[0.012, 0.012, colW, 16]} />
                <meshStandardMaterial
                  color="#d0d3d6"
                  metalness={0.3}
                  roughness={0.4}
                />
              </mesh>
              <Panel
                size={[colW, T, d - 0.03]}
                position={[x, plinth + bodyH - T - 0.32, -0.005]}
                look={look}
                color={look.inner}
              />
            </group>
          );
        }
        return (
          <group key={`col-${i}`}>
            {Array.from({ length: shelfCount }, (_, k) => (
              <Panel
                key={k}
                size={[colW, T, d - 0.03]}
                position={[
                  x,
                  plinth + T + ((k + 1) * innerH) / (shelfCount + 1),
                  -0.005,
                ]}
                look={look}
                color={look.inner}
              />
            ))}
          </group>
        );
      })}

      {/* doors */}
      {Array.from({ length: doors }, (_, i) => {
        const hinge = i < doors / 2 ? "left" : "right";
        const left = -w / 2 + GAP + i * (leafW + GAP);
        return (
          <Door
            key={`door-${i}`}
            x={hinge === "left" ? left : left + leafW}
            y={cy}
            z={d / 2}
            width={leafW}
            height={doorH}
            hinge={hinge}
            handleY={handleY}
            open={open}
            look={look}
          />
        );
      })}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Product builders                                                          */
/* -------------------------------------------------------------------------- */

type BuildProps = {
  w: number;
  h: number;
  d: number;
  doors: number;
  open: boolean;
  look: Look;
};

function Wardrobe({ w, h, d, doors, open, look }: BuildProps) {
  const n = fitLeaves(doors, w);
  return (
    <Cabinet
      w={w}
      h={h}
      d={d}
      plinth={0.08}
      columns={n}
      doors={n}
      interior="wardrobe"
      open={open}
      look={look}
    />
  );
}

function Kitchen({ w, h, d, doors, open, look }: BuildProps) {
  const n = fitLeaves(doors, w);
  const baseH = 0.86;
  const worktop = 0.04;
  const upperD = Math.min(0.35, d);
  const upperH = Math.min(0.9, Math.max(0, h - 1.45));
  return (
    <>
      <Cabinet
        w={w}
        h={baseH}
        d={d}
        plinth={0.1}
        columns={n}
        doors={n}
        handle="top"
        open={open}
        look={look}
      />
      <Panel
        size={[w + 0.02, worktop, d + 0.03]}
        position={[0, baseH + worktop / 2, 0.015]}
        look={look}
        color="#4b4742"
      />
      {upperH >= 0.35 && (
        <group position={[0, h - upperH, -(d - upperD) / 2]}>
          <Cabinet
            w={w}
            h={upperH}
            d={upperD}
            columns={n}
            doors={n}
            handle="bottom"
            open={open}
            look={look}
          />
        </group>
      )}
    </>
  );
}

function Bookshelf({ w, h, d, doors, open, look }: BuildProps) {
  // "sections" = horizontal compartments (rows), as in the front-elevation drawing
  const rows = clamp(Math.round(doors) || 2, 2, Math.max(2, Math.floor(h / 0.2)));
  const cols = Math.max(1, Math.round(w / 0.8));
  return (
    <Cabinet
      w={w}
      h={h}
      d={d}
      plinth={0.05}
      shelves={rows - 1}
      columns={cols}
      doors={0}
      open={open}
      look={look}
    />
  );
}

function TvUnit({ w, h, d, doors, open, look }: BuildProps) {
  const legs = h >= 0.4 ? 0.1 : 0;
  const n = fitLeaves(doors || 2, w);
  const lx = w / 2 - 0.1;
  const lz = d / 2 - 0.08;
  return (
    <>
      <group position={[0, legs, 0]}>
        <Cabinet
          w={w}
          h={h - legs}
          d={d}
          columns={n}
          doors={n}
          open={open}
          look={look}
        />
      </group>
      {legs > 0 &&
        (
          [
            [-lx, -lz],
            [lx, -lz],
            [-lx, lz],
            [lx, lz],
          ] as const
        ).map(([x, z]) => (
          <Panel
            key={`${x}-${z}`}
            size={[0.04, legs, 0.04]}
            position={[x, legs / 2, z]}
            look={look}
            color={look.handle}
          />
        ))}
    </>
  );
}

function Bed({ w, h, d, look }: BuildProps) {
  const legH = 0.12;
  const frameH = clamp(h * 0.5, 0.12, 0.28);
  const railTop = legH + frameH;
  const headTop = Math.max(h, railTop + 0.1);
  const matH = 0.24;
  const matY = railTop - 0.03 + matH / 2;
  const matTop = railTop - 0.03 + matH;
  const pillows = w > 1.2 ? [-w / 4, w / 4] : [0];
  const duvetL = d * 0.6;

  return (
    <>
      {/* legs */}
      {(
        [
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ] as const
      ).map(([sx, sz]) => (
        <Panel
          key={`${sx}${sz}`}
          size={[0.06, legH, 0.06]}
          position={[sx * (w / 2 - 0.04), legH / 2, sz * (d / 2 - 0.04)]}
          look={look}
        />
      ))}
      {/* side rails + foot rail */}
      <Panel
        size={[0.03, frameH, d]}
        position={[-(w / 2 - 0.015), legH + frameH / 2, 0]}
        look={look}
      />
      <Panel
        size={[0.03, frameH, d]}
        position={[w / 2 - 0.015, legH + frameH / 2, 0]}
        look={look}
      />
      <Panel
        size={[w, frameH, 0.03]}
        position={[0, legH + frameH / 2, d / 2 - 0.015]}
        look={look}
      />
      {/* headboard */}
      <Panel
        size={[w, headTop - legH, 0.05]}
        position={[0, legH + (headTop - legH) / 2, -d / 2 + 0.025]}
        look={look}
      />
      {/* slat deck */}
      <Panel
        size={[w - 0.06, 0.02, d - 0.08]}
        position={[0, railTop - 0.04, 0.01]}
        look={look}
        color={look.inner}
      />
      {/* mattress, pillows, duvet */}
      <RoundedBox
        args={[w - 0.06, matH, d - 0.08]}
        radius={0.03}
        smoothness={3}
        position={[0, matY, 0.01]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#ece6da" roughness={0.95} />
      </RoundedBox>
      {pillows.map((x) => (
        <RoundedBox
          key={x}
          args={[Math.min(0.55, w / 2.6), 0.14, 0.38]}
          radius={0.05}
          smoothness={4}
          position={[x, matTop + 0.07, -d / 2 + 0.3]}
          castShadow
        >
          <meshStandardMaterial color="#f4efe6" roughness={0.95} />
        </RoundedBox>
      ))}
      <RoundedBox
        args={[w - 0.1, 0.06, duvetL]}
        radius={0.025}
        smoothness={3}
        position={[0, matTop + 0.03, d / 2 - 0.06 - duvetL / 2]}
        castShadow
      >
        <meshStandardMaterial color="#cfc6b4" roughness={0.95} />
      </RoundedBox>
    </>
  );
}

function Table({ w, h, d, look }: BuildProps) {
  const top = 0.03;
  const leg = 0.07;
  const inset = 0.06;
  const apron = 0.09;
  const lx = w / 2 - inset - leg / 2;
  const lz = d / 2 - inset - leg / 2;
  const legH = h - top;
  return (
    <>
      <Panel size={[w, top, d]} position={[0, h - top / 2, 0]} look={look} />
      {(
        [
          [-lx, -lz],
          [lx, -lz],
          [-lx, lz],
          [lx, lz],
        ] as const
      ).map(([x, z]) => (
        <Panel
          key={`${x}-${z}`}
          size={[leg, legH, leg]}
          position={[x, legH / 2, z]}
          look={look}
        />
      ))}
      {[-lz, lz].map((z) => (
        <Panel
          key={`ax-${z}`}
          size={[w - 2 * (inset + leg), apron, 0.025]}
          position={[0, h - top - apron / 2, z]}
          look={look}
          color={look.inner}
        />
      ))}
      {[-lx, lx].map((x) => (
        <Panel
          key={`az-${x}`}
          size={[0.025, apron, d - 2 * (inset + leg)]}
          position={[x, h - top - apron / 2, 0]}
          look={look}
          color={look.inner}
        />
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Blueprint-style dimension lines                                           */
/* -------------------------------------------------------------------------- */

function Dimensions({ w, h, d }: { w: number; h: number; d: number }) {
  const off = 0.18;
  const z = d / 2 + off;
  const x = w / 2 + off;
  const color = "#9a7b3f";
  const tag =
    "pointer-events-none whitespace-nowrap bg-paper/85 px-1.5 py-0.5 font-mono text-[10px] text-ink";
  return (
    <group>
      <Line points={[[-w / 2, 0.004, z], [w / 2, 0.004, z]]} color={color} lineWidth={1} />
      <Html position={[0, 0.004, z]} center>
        <span className={tag}>{Math.round(w * 1000)}</span>
      </Html>

      <Line points={[[x, 0, d / 2], [x, h, d / 2]]} color={color} lineWidth={1} />
      <Html position={[x, h / 2, d / 2]} center>
        <span className={tag}>{Math.round(h * 1000)}</span>
      </Html>

      <Line points={[[x, 0.004, -d / 2], [x, 0.004, d / 2]]} color={color} lineWidth={1} />
      <Html position={[x, 0.004, 0]} center>
        <span className={tag}>{Math.round(d * 1000)}</span>
      </Html>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene                                                                     */
/* -------------------------------------------------------------------------- */

function Scene({
  spec,
  doors,
  open,
  instant,
  dimensions,
}: {
  spec: Spec;
  doors: number;
  open: boolean;
  instant: boolean;
  dimensions: boolean;
}) {
  const w = spec.w * MM;
  const h = spec.h * MM;
  const d = spec.d * MM;
  const size = Math.max(w, h, d);
  const swatch = getMaterial(spec.material).swatch;

  const look = useMemo<Look>(
    () => ({
      color: swatch,
      inner: shade(swatch, -0.07),
      roughness: FINISH[spec.material],
      handle: HANDLE[spec.hardware],
      instant,
    }),
    [swatch, spec.material, spec.hardware, instant],
  );

  const props: BuildProps = { w, h, d, doors, open, look };

  let piece: ReactNode;
  switch (spec.product) {
    case "wardrobe":
      piece = <Wardrobe {...props} />;
      break;
    case "kitchen":
      piece = <Kitchen {...props} />;
      break;
    case "bookshelf":
      piece = <Bookshelf {...props} />;
      break;
    case "tvunit":
      piece = <TvUnit {...props} />;
      break;
    case "bed":
      piece = <Bed {...props} />;
      break;
    case "table":
      piece = <Table {...props} />;
      break;
  }

  return (
    <>
      <hemisphereLight args={["#ffffff", "#d8ccb4", 0.9]} />
      <directionalLight
        position={[size * 1.1, size * 1.8, size * 1.4]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-size * 1.2, size * 1.2, size * 1.2, -size * 1.2, 0.1, size * 6]}
        />
      </directionalLight>
      <directionalLight position={[-size, size * 0.8, -size * 0.6]} intensity={0.6} />

      {piece}
      {dimensions && <Dimensions w={w} h={h} d={d} />}
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.35}
        scale={size * 3}
        blur={2.5}
        far={size}
      />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        target={[0, h / 2, 0]}
        minDistance={0.6}
        maxDistance={size * 5}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.03}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Public component                                                          */
/* -------------------------------------------------------------------------- */

export type Furniture3DLabels = {
  open: string;
  close: string;
  alt: string;
};

const DEFAULT_LABELS: Furniture3DLabels = {
  open: "Open doors",
  close: "Close doors",
  alt: "3D preview of the configured furniture",
};

export type Furniture3DProps = {
  spec: Spec;
  /** value of the "sections" slider: wardrobe/TV unit doors, kitchen modules, bookshelf rows */
  doors?: number;
  /** shown when WebGL is unavailable — pass your existing SVG preview */
  fallback?: ReactNode;
  labels?: Partial<Furniture3DLabels>;
  /** draw width / height / depth lines with numbers around the model (off by default) */
  dimensions?: boolean;
  className?: string;
};

let webglSupport: boolean | undefined;
function detectWebGL(): boolean {
  if (webglSupport === undefined) {
    try {
      const c = document.createElement("canvas");
      webglSupport = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const subscribeNone = () => () => {};

const MQ = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (cb: () => void) => {
  const m = window.matchMedia(MQ);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const motionReduced = () => window.matchMedia(MQ).matches;

export function Furniture3D({
  spec,
  doors,
  fallback = null,
  labels,
  dimensions = false,
  className = "relative aspect-[4/3] w-full",
}: Furniture3DProps) {
  const l = { ...DEFAULT_LABELS, ...labels };
  const webgl = useSyncExternalStore<boolean | null>(
    subscribeNone,
    detectWebGL,
    () => null,
  );
  const instant = useSyncExternalStore(subscribeMotion, motionReduced, () => false);
  const [open, setOpen] = useState(false);
  const product = getProduct(spec.product);

  // Initial camera per product (stable, so sliders never reset the user's view).
  const camera = useMemo(() => {
    const { w, h, d } = product.default;
    const size = Math.max(w, h, d) * MM;
    const dist = size * 2 + 1.2;
    return {
      position: [dist * 0.7, h * MM * 0.5 + dist * 0.35, dist * 0.85] as Vec3,
      fov: 35,
      near: 0.1,
      far: 120,
    };
  }, [product]);

  const box = `overflow-hidden ${className}`;

  if (webgl === null) return <div className={box} aria-hidden />;
  if (!webgl) return <>{fallback}</>;

  const canOpen = ["wardrobe", "kitchen", "tvunit"].includes(spec.product);

  return (
    <div className={box} role="img" aria-label={l.alt}>
      <Canvas
        key={spec.product}
        shadows
        dpr={[1, 2]}
        frameloop="demand"
        camera={camera}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene
          spec={spec}
          doors={doors ?? product.defaultDoors}
          open={open}
          instant={instant}
          dimensions={dimensions}
        />
      </Canvas>

      {canOpen && (
        <button
          type="button"
          aria-pressed={open}
          onClick={() => setOpen((v) => !v)}
          className={`absolute right-3 top-3 flex h-9 items-center gap-2 border px-3 font-mono text-[0.7rem] leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
            open
              ? "border-ink bg-ink text-paper"
              : "border-ink/25 bg-paper/90 text-ink hover:border-ink/60"
          }`}
        >
          <svg
            viewBox="0 0 16 16"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            aria-hidden="true"
          >
            <path d="M3 14V2h8v12M1.5 14h13" />
            {open ? (
              <path d="M11 2l3 1.5v9.5l-3 1" />
            ) : (
              <path d="M9 8.2v1.6" strokeLinecap="round" />
            )}
          </svg>
          {open ? l.close : l.open}
        </button>
      )}
    </div>
  );
}