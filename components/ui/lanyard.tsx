// import { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';

// const Lanyard = ({ position = [0, 0, 30], gravity = [0, -40, 0], fov = 20, transparent = true }) => {
//   const mountRef:any = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const cardRef = useRef(null);
//   const lanyardRef = useRef(null);
//   const animationIdRef :any = useRef(null);
//   const mouseRef = useRef({ x: 0, y: 0 });
//   const isDraggingRef = useRef(false);
  
//   const [isHovered, setIsHovered] = useState(false);

//   useEffect(() => {
//     if (!mountRef.current) return;

//     // Scene setup
//     const scene:any = new THREE.Scene();
//     scene.background = transparent ? null : new THREE.Color(0x000000);
//     sceneRef.current = scene;

//     // Camera setup
//     const camera :any= new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
//     camera.position.set(...position);
//     cameraRef.current = camera;

//     // Renderer setup
//     const renderer:any = new THREE.WebGLRenderer({ 
//       alpha: transparent,
//       antialias: true 
//     });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0x000000, transparent ? 0 : 1);
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     rendererRef.current = renderer;
    
//     mountRef.current.appendChild(renderer.domElement);

//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     directionalLight.position.set(5, 5, 5);
//     directionalLight.castShadow = true;
//     scene.add(directionalLight);

//     // Create Card
//     const cardGeometry = new THREE.BoxGeometry(1.6, 2.4, 0.02);
//     const cardMaterial = new THREE.MeshPhysicalMaterial({
//       color: 0xffffff,
//       metalness: 0.1,
//       roughness: 0.1,
//       clearcoat: 1,
//       clearcoatRoughness: 0.1,
//     });
    
//     const card:any = new THREE.Mesh(cardGeometry, cardMaterial);
//     card.position.set(0, -2, 0);
//     card.castShadow = true;
//     card.receiveShadow = true;
//     cardRef.current = card;
//     scene.add(card);

//     // Create Lanyard (using a curve)
//     const curve = new THREE.CatmullRomCurve3([
//       new THREE.Vector3(0, 4, 0),
//       new THREE.Vector3(0.2, 2, 0),
//       new THREE.Vector3(-0.1, 0, 0),
//       new THREE.Vector3(0, -1.8, 0)
//     ]);

//     const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.05, 8, false);
//     const tubeMaterial = new THREE.MeshPhysicalMaterial({
//       color: 0xffffff,
//       roughness: 0.8,
//       metalness: 0.1,
//     });
    
//     const lanyard :any = new THREE.Mesh(tubeGeometry, tubeMaterial);
//     lanyardRef.current = lanyard;
//     scene.add(lanyard);

//     // Create card content (text)
//     const canvas = document.createElement('canvas');
//     const context:any = canvas.getContext('2d');
//     canvas.width = 512;
//     canvas.height = 768;
    
//     context.fillStyle = '#000000';
//     context.fillRect(0, 0, canvas.width, canvas.height);
    
//     context.fillStyle = '#ffffff';
//     context.font = 'bold 48px Arial';
//     context.textAlign = 'center';
//     context.fillText('AYYOOB', canvas.width / 2, 100);
    
//     context.font = '24px Arial';
//     context.fillText('DEVELOPER', canvas.width / 2, 150);
//     context.fillText('& DESIGNER', canvas.width / 2, 180);
    
//     // Add some decorative elements
//     context.strokeStyle = '#ffffff';
//     context.lineWidth = 2;
//     context.beginPath();
//     context.rect(50, 250, canvas.width - 100, 300);
//     context.stroke();
    
//     context.font = '16px Arial';
//     context.fillText('Next.js • Flutter', canvas.width / 2, 300);
//     context.fillText('Go Lang • Figma', canvas.width / 2, 330);
    
//     const texture = new THREE.CanvasTexture(canvas);
//     const cardFrontMaterial = new THREE.MeshPhysicalMaterial({
//       map: texture,
//       metalness: 0.1,
//       roughness: 0.1,
//       clearcoat: 1,
//       clearcoatRoughness: 0.1,
//     });
    
//     // Apply texture to front face only
//     card.material = [
//       cardMaterial, // right
//       cardMaterial, // left
//       cardMaterial, // top
//       cardMaterial, // bottom
//       cardFrontMaterial, // front
//       cardMaterial  // back
//     ];

//     // Mouse interaction
//     const raycaster = new THREE.Raycaster();
//     const mouse = new THREE.Vector2();

//     const onMouseMove = (event: { clientX: number; clientY: number; }) => {
//       mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//       mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
//       mouseRef.current = { x: mouse.x, y: mouse.y };
      
//       raycaster.setFromCamera(mouse, camera);
//       const intersects = raycaster.intersectObject(card);
      
//       if (intersects.length > 0) {
//         setIsHovered(true);
//         if (isDraggingRef.current) {
//           const intersect = intersects[0];
//           card.position.x = intersect.point.x;
//           card.position.y = intersect.point.y;
//         }
//       } else {
//         setIsHovered(false);
//       }
//     };

//     const onMouseDown = (event: any) => {
//       raycaster.setFromCamera(mouse, camera);
//       const intersects = raycaster.intersectObject(card);
      
//       if (intersects.length > 0) {
//         isDraggingRef.current = true;
//         document.body.style.cursor = 'grabbing';
//       }
//     };

//     const onMouseUp = () => {
//       isDraggingRef.current = false;
//       document.body.style.cursor = isHovered ? 'grab' : 'auto';
//     };

//     window.addEventListener('mousemove', onMouseMove);
//     window.addEventListener('mousedown', onMouseDown);
//     window.addEventListener('mouseup', onMouseUp);

//     // Animation loop
//     const animate = () => {
//       animationIdRef.current = requestAnimationFrame(animate);
      
//       // Gentle swaying animation
//       const time = Date.now() * 0.001;
//       if (!isDraggingRef.current) {
//         card.rotation.z = Math.sin(time) * 0.1;
//         card.position.x = Math.sin(time * 0.5) * 0.2;
//       }
      
//       // Update lanyard curve based on card position
//       const newCurve = new THREE.CatmullRomCurve3([
//         new THREE.Vector3(0, 4, 0),
//         new THREE.Vector3(card.position.x * 0.3, 2, 0),
//         new THREE.Vector3(card.position.x * 0.6, 0, 0),
//         new THREE.Vector3(card.position.x, card.position.y + 1.2, 0)
//       ]);
      
//       const newTubeGeometry = new THREE.TubeGeometry(newCurve, 64, 0.05, 8, false);
//       lanyard.geometry.dispose();
//       lanyard.geometry = newTubeGeometry;
      
//       renderer.render(scene, camera);
//     };

//     animate();

//     // Handle resize
//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('mousemove', onMouseMove);
//       window.removeEventListener('mousedown', onMouseDown);
//       window.removeEventListener('mouseup', onMouseUp);
//       window.removeEventListener('resize', handleResize);
      
//       if (animationIdRef.current) {
//         cancelAnimationFrame(animationIdRef.current);
//       }
      
//       if (mountRef.current && renderer.domElement) {
//         mountRef.current.removeChild(renderer.domElement);
//       }
      
//       // Clean up Three.js objects
//       scene.traverse((object: { geometry: { dispose: () => void; }; material: { forEach: (arg0: (material: any) => any) => void; dispose: () => void; }; }) => {
//         if (object.geometry) object.geometry.dispose();
//         if (object.material) {
//           if (Array.isArray(object.material)) {
//             object.material.forEach(material => material.dispose());
//           } else {
//             object.material.dispose();
//           }
//         }
//       });
      
//       renderer.dispose();
//       document.body.style.cursor = 'auto';
//     };
//   }, [position, gravity, fov, transparent]);

//   useEffect(() => {
//     document.body.style.cursor = isHovered ? (isDraggingRef.current ? 'grabbing' : 'grab') : 'auto';
//   }, [isHovered]);

//   return (
//     <div 
//       ref={mountRef} 
//       style={{ 
//         width: '100%', 
//         height: '100vh',
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         zIndex: 1,
//         pointerEvents: 'auto'
//       }} 
//     />
//   );
// };

// export default Lanyard;