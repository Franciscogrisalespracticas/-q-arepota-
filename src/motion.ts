// Independent motion engine that works in Vite and the offline Live Server preview.
// It draws particles and smoke that MOVE even when the mouse is still.
export function setupMotion(): () => void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const pointers = {x: 0, y: 0};
  let raf = 0;
  let t = 0;
  let active = true;
  let currentEffect = 'burger';
  const canvas = document.getElementById('food-particles') as HTMLCanvasElement | null;
  const ctx = canvas?.getContext('2d');
  const parts: Array<{x:number,y:number,vx:number,vy:number,life:number,size:number,seed:number}> = [];
  const n = reduced ? 0 : 53;
  for(let i=0;i<n;i++) parts.push({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.0009,vy:.0008+Math.random()*.0017,life:Math.random()*100,size:1+Math.random()*3,seed:Math.random()*9});
  let width = 0, height = 0;
  const resize = () => {
    width = window.innerWidth; height = window.innerHeight;
    if(canvas){const dpr=Math.min(devicePixelRatio||1,1.6);canvas.width=Math.ceil(width*dpr);canvas.height=Math.ceil(height*dpr);canvas.style.width=width+'px';canvas.style.height=height+'px';ctx?.setTransform(dpr,0,0,dpr,0,0);}
  };
  const mouse = (e: PointerEvent) => {
    pointers.x = e.clientX/Math.max(width,1)-.5;
    pointers.y = e.clientY/Math.max(height,1)-.5;
    body.style.setProperty('--mouse-x', String(pointers.x));
    body.style.setProperty('--mouse-y', String(pointers.y));
  };
  const visibility = () => { active = !document.hidden; if(active && !raf) loop(); };
  const drawPart = (x:number,y:number,r:number,seed:number) => {
    if(!ctx)return;
    const color = seed>4?'#e5d5ad':'#f8db9b';
    ctx.beginPath(); ctx.ellipse(x,y,r,r*1.5,Math.sin(t*.01+seed),0,Math.PI*2);
    ctx.fillStyle=color;ctx.globalAlpha=embersAlpha(seed);ctx.fill();ctx.globalAlpha=1;
  };
  const embersAlpha = (seed:number) => .25 + .35*(.5+.5*Math.sin(t*.02+seed));
  const loop = () => {
    raf = 0;
    if(!active || !canvas || !ctx || reduced)return;
    const stage = document.querySelector('.stage') as HTMLElement | null;
    currentEffect = stage?.dataset.effect || 'burger';
    ctx.clearRect(0,0,width,height);
    t++;
    for(const p of parts){
      p.x += p.vx; p.y -= p.vy*.27;
      if(p.y<-.03){p.y=1.03;p.x=Math.random();}
      if(p.x<-.03)p.x=1.03;if(p.x>1.03)p.x=-.03;
      const x=p.x*width+Math.sin(t*.017+p.seed)*12;
      const y=p.y*height;
      drawPart(x,y,p.size,p.seed);
    }
    // Soft moving steam: multiple drifting translucent ribbons.
    if(['steam','cheese','burger','herbs'].includes(currentEffect)){
      for(let i=0;i<6;i++){
        const center=width*.70+(i-2.5)*17;
        ctx.beginPath();
        for(let j=0;j<14;j++){
          const y=height*.60-j*14;
          const x=center+Math.sin(t*.02+i*1.8+j*.4)*(9+j*.9);
          if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        }
        ctx.strokeStyle='rgba(255,237,196,.08)';
        ctx.lineWidth=9+i;ctx.lineCap='round';ctx.stroke();
      }
    }
    raf=requestAnimationFrame(loop);
  };
  // Scroll reveal using IntersectionObserver, with accessible reduced-motion fallback.
  const observers:IntersectionObserver[]=[];
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}});
  },{threshold:.11,rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));observers.push(observer);
  resize(); window.addEventListener('resize',resize);window.addEventListener('pointermove',mouse,{passive:true});document.addEventListener('visibilitychange',visibility);
  if(!reduced)loop();
  return ()=>{active=false;if(raf)cancelAnimationFrame(raf);window.removeEventListener('resize',resize);window.removeEventListener('pointermove',mouse);document.removeEventListener('visibilitychange',visibility);observers.forEach(x=>x.disconnect());};
}
