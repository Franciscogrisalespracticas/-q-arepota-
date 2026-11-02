import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// This is a true interactive Three.js model, but is identified as a concept
// rather than a photorealistic scan. The live food photography stays primary.
export function openProduct3D(id:string):void {
  if(!['hamburguesa','arepa-pollo'].includes(id))return;
  const modal=document.createElement('div');modal.className='model-modal';modal.innerHTML='<div class="model-panel" role="dialog" aria-modal="true" aria-label="Laboratorio 3D"><div class="model-caption"><span>LABORATORIO 3D / MODELO ESTILIZADO</span><button class="model-close" aria-label="Cerrar visor 3D">Cerrar X</button></div><div class="model-viewport" id="model-viewport"></div><p>Arrastra para girar. Visualizacion geometrica experimental. La fotografia del producto principal no se sustituye.</p></div>';
  document.body.appendChild(modal);
  const target=modal.querySelector('.model-viewport') as HTMLElement;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch(e){target.textContent='WebGL no disponible en este navegador.';return;}
  const W=()=>Math.max(280,target.clientWidth),H=()=>Math.max(280,target.clientHeight);
  renderer.setSize(W(),H());renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.toneMapping=THREE.ACESFilmicToneMapping;
  target.appendChild(renderer.domElement);
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x1b110b);
  const camera=new THREE.PerspectiveCamera(35,W()/H(),0.1,100);camera.position.set(6,4,8);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=5;controls.maxDistance=15;controls.maxPolarAngle=2;
  scene.add(new THREE.AmbientLight(0xffdcb1,2.0));
  const key=new THREE.DirectionalLight(0xfff3cd,3.4);key.position.set(-3,7,6);scene.add(key);
  const rim=new THREE.DirectionalLight(0xffa048,3);rim.position.set(4,5,-4);scene.add(rim);
  const group=new THREE.Group();scene.add(group);
  const mat=(color:number,roughness=.76)=>new THREE.MeshStandardMaterial({color,roughness,metalness:0});
  const add=(geometry:THREE.BufferGeometry,material:THREE.Material,scale:[number,number,number],pos:[number,number,number])=>{
    const mesh=new THREE.Mesh(geometry,material);mesh.scale.set(...scale);mesh.position.set(...pos);group.add(mesh);return mesh;
  };
  const bun=mat(0xe1a64d,.69),patty=mat(0x613018,.93),bread=mat(0xd5a258,.86),cheese=mat(0xf8bc35,.44),salad=mat(0x659343,.9),tomato=mat(0xd95431,.66);
  const sphere=new THREE.SphereGeometry(1,64,32);
  if(id==='hamburguesa'){
    add(sphere,bread,[2.1,.34,2.1],[0,-1.26,0]);
    add(new THREE.CylinderGeometry(2.02,2.02,.19,64),salad,[1,1,1],[0,-.92,0]);
    add(new THREE.CylinderGeometry(1.89,1.94,.26,64),tomato,[1,1,1],[0,-.69,0]);
    add(new THREE.CylinderGeometry(2,2,.42,64),patty,[1,1,1],[0,-.38,0]);
    add(new THREE.CylinderGeometry(2.06,1.9,.08,64),cheese,[1,1,1],[0,-.09,0]);
    add(new THREE.CylinderGeometry(1.98,2.0,.34,64),patty,[1,1,1],[0,.16,0]);
    add(new THREE.CylinderGeometry(2.05,2.05,.10,64),cheese,[1,1,1],[0,.42,0]);
    add(sphere,bun,[2.14,.68,2.14],[0,.74,0]);
    const sesame=mat(0xf6e3aa,.62);
    for(let i=0;i<55;i++){const a=Math.random()*Math.PI*2,r=Math.sqrt(Math.random())*1.8;
      const x=r*Math.cos(a),z=r*Math.sin(a),y=.74+.68*Math.sqrt(1-(r/2.14)**2);
      const s=add(new THREE.CapsuleGeometry(.036,.065,2,5),sesame,[1,1,1],[x,y+.015,z]);s.rotation.y=a;s.rotation.z=Math.atan2(x,z)*.09;}
  }else{
    add(sphere,bread,[2.28,.45,1.93],[0,-.64,0]);
    add(sphere,bun,[2.25,.45,1.98],[0,.49,-.27]);
    const filling=mat(0xc67734,.77);
    for(let i=0;i<60;i++){const a=Math.random()*Math.PI*2;
      const x=(Math.random()-.5)*3.1,z=(Math.random()-.5)*2.2;
      const c=add(new THREE.CapsuleGeometry(.045+Math.random()*.035,.13+Math.random()*.22,3,6),filling,[1,1,1],[x,(Math.random()-.5)*.3,z]);c.rotation.set(Math.random()*2,Math.random()*6,Math.random()*5);}
    add(sphere,cheese,[1.8,.08,1.47],[0,.17,0]);
  }
  const floor=new THREE.Mesh(new THREE.CircleGeometry(3.5,80),new THREE.MeshStandardMaterial({color:0x332015,roughness:.98}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.65;scene.add(floor);
  let active=true;const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tick=()=>{if(!active)return;if(!reduce)group.rotation.y+=.002;controls.update();renderer.render(scene,camera);requestAnimationFrame(tick);};tick();
  const resize=()=>{camera.aspect=W()/H();camera.updateProjectionMatrix();renderer.setSize(W(),H());};window.addEventListener('resize',resize);
  const cleanup=()=>{active=false;window.removeEventListener('resize',resize);controls.dispose();renderer.dispose();scene.traverse((o:any)=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach((m:any)=>m.dispose());else o.material.dispose();}});modal.remove();};
  modal.querySelector('.model-close')?.addEventListener('click',cleanup);
  modal.addEventListener('click',e=>{if(e.target===modal)cleanup();});
  window.addEventListener('keydown',function esc(e){if(e.key==='Escape'){cleanup();window.removeEventListener('keydown',esc);}});
}
