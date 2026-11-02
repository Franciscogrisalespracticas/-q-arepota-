import * as React from 'react';
import { PRODUCTS, Product, currency, assetBase } from './catalog';
import { setupMotion } from './motion';
import { FilmMedia } from './real-video';

type Cart = Record<string, number>;
type State = {
  active: number; cart: Cart; drawer: boolean; detail: string | null;
  qty: number; toast: string; media: string[]; cine: boolean; mobileMenu: boolean;
};

declare global {
 interface Window {QAREPOTA_CONFIG?: {whatsapp?:string,address?:string,mapUrl?:string,hours?:string,pricesDemo?:boolean};gsap?:any;ScrollTrigger?:any;}
}
const CFG = () => window.QAREPOTA_CONFIG || {};
const storage = 'q-arepota-cart-v1';
const readCart = (): Cart => {try { const obj=JSON.parse(localStorage.getItem(storage)||'{}'); if(obj&&typeof obj==='object')return obj;}catch(_){}return {};};
const Icon = (props:{name:string,size?:number}) => {
 const common={width:props.size||20,height:props.size||20,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
 const shapes:Record<string, React.ReactNode>={
  arrow:<g><path d="M4 12h16M13 5l7 7-7 7"/></g>,
  left:<g><path d="m15 18-6-6 6-6"/></g>,right:<g><path d="m9 18 6-6-6-6"/></g>,
  cart:<g><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.6 13.4A2 2 0 0 0 9.6 16H20a2 2 0 0 0 2-1.6L23 6H6"/></g>,
  close:<g><path d="M18 6 6 18M6 6l12 12"/></g>,
  pin:<g><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></g>,
  play:<g><path d="m8 5 11 7-11 7V5Z"/></g>,
  pause:<g><path d="M8 5v14M16 5v14"/></g>,
  plus:<g><path d="M12 5v14M5 12h14"/></g>,
  minus:<g><path d="M5 12h14"/></g>,
  phone:<g><path d="M22 16.8V21a2 2 0 0 1-2.2 2 19 19 0 0 1-18-18A2 2 0 0 1 3.8 3H8l2 5-2.5 2a14 14 0 0 0 6.5 6.5L16 14l6 2.8Z"/></g>,
  check:<g><path d="m4 12 5 5L20 6"/></g>,
  menu:<g><path d="M4 7h16M4 12h16M4 17h16"/></g>,
  sound:<g><path d="M6 10H3v4h3l4 4V6L6 10ZM16 8a6 6 0 0 1 0 8"/></g>,
  flame:<g><path d="M12 22c-4 0-7-3.1-7-7 0-3 1.5-5.3 4-8 .5 3 1.2 4 2 4 0-4 2-7 4-9 0 3 4 6 4 12 0 4.5-3 8-7 8Z"/></g>
 };
 return <svg {...common} aria-hidden="true">{shapes[props.name]||shapes.arrow}</svg>;
};

export default class App extends React.Component<{},State> {
 private teardown: (()=>void)|null=null;
 private toastTimer:number|undefined;
 private keyHandler:(e:KeyboardEvent)=>void;
 constructor(props:{}) {
  super(props);
  this.state={active:0,cart:readCart(),drawer:false,detail:null,qty:1,toast:'',media:[],cine:true,mobileMenu:false};
  this.keyHandler=(e)=>{
   const target=e.target as HTMLElement;
   if(e.key==='Escape') this.setState({drawer:false,detail:null,mobileMenu:false});
   if(target && ['INPUT','TEXTAREA','SELECT'].includes(target.tagName))return;
   if(e.key==='ArrowRight'&&!this.state.drawer&&!this.state.detail)this.go(1);
   if(e.key==='ArrowLeft'&&!this.state.drawer&&!this.state.detail)this.go(-1);
  };
 }
 componentDidMount() {
  this.teardown=setupMotion();window.addEventListener('keydown',this.keyHandler);
  fetch(assetBase + '/video/manifest.json').then(r=>r.ok?r.json():[]).then((items:any)=>this.setState({media:Array.isArray(items)?items:[]})).catch(()=>{});
 }
 componentDidUpdate(_:Readonly<{}>,old:Readonly<State>) {
  if(old.active!==this.state.active){
   const el=document.querySelector('.stage');if(el){el.classList.remove('stage-arrive');void (el as HTMLElement).offsetWidth;el.classList.add('stage-arrive');}
  }
  if(old.cart!==this.state.cart){try{localStorage.setItem(storage,JSON.stringify(this.state.cart));}catch(_){/* unavailable in embedded/file previews */}}
  if(old.drawer!==this.state.drawer || old.detail!==this.state.detail){document.body.classList.toggle('overlay-open',this.state.drawer||!!this.state.detail);}
 }
 componentWillUnmount(){if(this.teardown)this.teardown();window.removeEventListener('keydown',this.keyHandler);if(this.toastTimer)window.clearTimeout(this.toastTimer);}
 private notify=(message:string)=>{this.setState({toast:message});if(this.toastTimer)window.clearTimeout(this.toastTimer);this.toastTimer=window.setTimeout(()=>this.setState({toast:''}),4300);};
 private go=(direction:number)=>{this.setState(s=>({active:(s.active+direction+PRODUCTS.length)%PRODUCTS.length,qty:1}));};
 private choose=(index:number)=>{this.setState({active:index,qty:1});document.getElementById('protagonistas')?.scrollIntoView({behavior:'smooth',block:'start'});};
 private add=(id:string,amount=1,open=false)=>{
  this.setState(s=>({cart:{...s.cart,[id]:(s.cart[id]||0)+amount},drawer:open||s.drawer}));
  this.notify('Agregado a tu pedido');
 };
 private count=(id:string,amount:number)=>{this.setState(s=>{const cart={...s.cart};const n=(cart[id]||0)+amount;if(n<=0)delete cart[id];else cart[id]=n;return {cart};});};
 private cartTotal=()=>PRODUCTS.reduce((sum,p)=>sum+(this.state.cart[p.id]||0)*p.price,0);
 private cartCount=()=>Object.values(this.state.cart).reduce((a,b)=>a+b,0);
 private orderText=()=>{
  const lines=['Hola, quiero realizar este pedido en Q Arepota:'];
  PRODUCTS.filter(p=>this.state.cart[p.id]).forEach(p=>lines.push(`${this.state.cart[p.id]} x ${p.name} - ${currency((this.state.cart[p.id]||0)*p.price)}`));
  lines.push(`Total de referencia: ${currency(this.cartTotal())}`,'Precios de demostracion: confirmar precio final, disponibilidad, domicilio y datos del negocio.');
  return lines.join('\n');
 };
 private whatsapp=(fromOrder:boolean)=>{
  const phone=(CFG().whatsapp||'').replace(/\D/g,'');
  const text=fromOrder?this.orderText():'Hola, quiero conocer el menu de Q Arepota y hacer un pedido.';
  if(!phone){
   if(navigator.clipboard)navigator.clipboard.writeText(text).then(()=>{}).catch(()=>{});
   this.notify('WhatsApp pendiente: configura el numero real en public/config.js. Resumen copiado si tu navegador lo permite.');
   return;
  }
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`,'_blank','noopener,noreferrer');
 };
 private onTilt=(e:React.PointerEvent<HTMLDivElement>)=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const r=e.currentTarget.getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;
  e.currentTarget.style.setProperty('--tilt-x',(x*9).toFixed(2)+'deg');
  e.currentTarget.style.setProperty('--tilt-y',(y*-7).toFixed(2)+'deg');
 };
 private resetTilt=(e:React.PointerEvent<HTMLDivElement>)=>{e.currentTarget.style.setProperty('--tilt-x','0deg');e.currentTarget.style.setProperty('--tilt-y','0deg');};
 private productSelected(){return PRODUCTS[this.state.active];}
 private open3d=()=>{const f=(window as any).QAREPOTA_3D;if(typeof f==='function')f(this.productSelected().id);else this.notify('El laboratorio Three.js funciona en la version Vite con npm run dev. La vista fotografica es la version principal.');};
 private renderStage(){
  const p=this.productSelected();const local=this.state.media.includes(p.id);
  const active=this.state.cine&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return <div className="stage stage-arrive" data-effect={p.effect}>
   <div className="stage-halo"/><div className="stage-inner">
    <div className="stage-orbit stage-orbit-a"/><div className="stage-orbit stage-orbit-b"/>
    <div className="stage-photo-frame stage-film-frame" key={p.id}>
     <img src={p.image} alt={`${p.name}: imagen ilustrativa del producto final`} className="stage-photo"/>
     <FilmMedia key={p.id} product={p} local={local} enabled={active} variant="stage"/>
     <span className="stage-photo-vignette"/>
    </div><div className="stage-plate-tag"><span className="tag-line"/>PLANCHA, MAIZ Y SABOR</div>
   </div>
   <div className="stage-tiny-caption">{active?'IMAGEN DEL PLATO + VIDEO DE PREPARACION REAL':'FOTOGRAFIA DEL PRODUCTO'}</div>
  </div>;
 }
 private renderDrawer(){
  if(!this.state.drawer)return null;
  const count=this.cartCount();
  return <div className="scrim" onMouseDown={e=>{if(e.target===e.currentTarget)this.setState({drawer:false});}}>
   <aside className="drawer" role="dialog" aria-modal="true" aria-label="Tu pedido">
    <div className="drawer-head"><div><span className="eyebrow">PEDIDO / Q AREPOTA</span><h2>Tu antojo.</h2></div><button className="icon-button" aria-label="Cerrar pedido" onClick={()=>this.setState({drawer:false})}><Icon name="close"/></button></div>
    <div className="drawer-list">{count===0?<div className="empty-cart"><span>Q</span><h3>Tu carrito esta esperando.</h3><p>Elige algo brutal del menu.</p><button className="button button-primary" onClick={()=>this.setState({drawer:false})}>Explorar menu <Icon name="arrow"/></button></div>:PRODUCTS.filter(p=>this.state.cart[p.id]).map(p=><div className="drawer-item" key={p.id}>
     <img src={p.image} alt={p.name}/><div><h3>{p.name}</h3><span>{currency(p.price)} c/u</span><div className="quantity"><button aria-label={`Quitar uno de ${p.name}`} onClick={()=>this.count(p.id,-1)}><Icon name="minus" size={14}/></button><span>{this.state.cart[p.id]}</span><button aria-label={`Agregar uno de ${p.name}`} onClick={()=>this.count(p.id,1)}><Icon name="plus" size={14}/></button></div></div><strong>{currency(p.price*(this.state.cart[p.id]||0))}</strong>
    </div>)}</div>
    <div className="drawer-bottom"><div className="total-line"><span>Total estimado</span><strong>{currency(this.cartTotal())}</strong></div><p>Precios ilustrativos. Confirma costos y entrega con el negocio.</p><button className="button button-primary button-wide" disabled={!count} onClick={()=>this.whatsapp(true)}><Icon name="phone"/> Finalizar por WhatsApp <Icon name="arrow"/></button></div>
   </aside>
  </div>;
 }
 private renderDetail(){
  const id=this.state.detail; if(!id)return null;const p=PRODUCTS.find(x=>x.id===id);if(!p)return null;
  return <div className="scrim" onMouseDown={e=>{if(e.target===e.currentTarget)this.setState({detail:null});}}><section className="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title">
   <button className="icon-button detail-close" aria-label="Cerrar detalles" onClick={()=>this.setState({detail:null})}><Icon name="close"/></button>
   <div className="detail-media"><img className="detail-photo" src={p.image} alt={p.name}/><FilmMedia product={p} local={this.state.media.includes(p.id)} enabled={this.state.cine} variant="detail"/></div><div className="detail-content"><span className="eyebrow">FICHA DE PRODUCTO</span><h2 id="detail-title">{p.name}</h2><p>{p.description}</p><div className="ingredients">{p.ingredients.map(i=><span key={i}>{i}</span>)}</div><p className="video-note">{p.videoDescription} <a href={p.videoPage} target="_blank" rel="noopener noreferrer">Ver video original en Pexels</a></p><strong className="detail-price">{currency(p.price)}</strong><button className="button button-primary" onClick={()=>{this.add(p.id,1,true);this.setState({detail:null});}}>Agregar al pedido <Icon name="arrow"/></button></div>
  </section></div>;
 }
 render(){
  const p=this.productSelected();const count=this.cartCount();const cfg=CFG();
  return <div className="site-shell">
   <canvas id="food-particles" aria-hidden="true"/>
   <div className="global-halo global-halo-one"/><div className="global-halo global-halo-two"/>
   <header className="topbar"><a href="#inicio" className="brand" aria-label="Q Arepota, ir a inicio"><span className="brand-mark">Q<span>.</span></span><span className="brand-words">AREPOTA <small>COMIDA CON ACTITUD</small></span></a>
    <nav className={`nav ${this.state.mobileMenu?'nav-open':''}`} aria-label="Menu principal"><a href="#inicio" onClick={()=>this.setState({mobileMenu:false})}>Inicio</a><a href="#pedido" onClick={()=>this.setState({mobileMenu:false})}>Hacer pedido</a><a href="#ubicacion" onClick={()=>this.setState({mobileMenu:false})}>Ubicacion</a><button className="nav-whatsapp" onClick={()=>{this.setState({mobileMenu:false});this.whatsapp(false);}}>WhatsApp <Icon name="arrow" size={15}/></button></nav>
    <div className="nav-actions"><button className="cart-button" aria-label={`Abrir pedido: ${count} productos`} onClick={()=>this.setState({drawer:true})}><Icon name="cart"/><span>{count}</span></button><button className="mobile-toggle" aria-label={this.state.mobileMenu?'Cerrar menu':'Abrir menu'} aria-expanded={this.state.mobileMenu} onClick={()=>this.setState(s=>({mobileMenu:!s.mobileMenu}))}><Icon name={this.state.mobileMenu?'close':'menu'}/></button></div>
   </header>

   <main>
    <section className="hero" id="inicio">
     <div className="hero-background"/><FilmMedia product={PRODUCTS[0]} local={this.state.media.includes('hamburguesa')} enabled={this.state.cine} variant="hero"/><div className="hero-shade"/><div className="hero-grain"/>
     <div className="hero-content"><div className="hero-kicker"><span className="pulse-dot"/> COMIDA COLOMBIANA / ACTITUD CALLEJERA</div><h1><span>QUE</span><span className="hero-title-accent">AREPOTA<span className="hero-bang">!</span></span></h1><p>Maiz. Plancha. Queso. Sabor sin timidez. El antojo de barrio se viste para romperla.</p><div className="hero-cta"><a className="button button-primary" href="#protagonistas">Descubre el menu <Icon name="arrow"/></a><a href="#pedido" className="button button-outline">Hacer mi pedido</a></div><div className="hero-foot"><span className="hero-side-line"/> DESLIZA PARA ANTOJARTE <span className="scroll-symbol">&darr;</span></div></div>
     <div className="hero-deco hero-deco-one">Q</div><div className="hero-round-seal">HECHO PARA<br/>ANTOJARSE <span>&#10038;</span></div>
    </section>

    <div className="marquee" aria-hidden="true"><div className="marquee-track">{Array(4).fill(0).map((_,i)=><span key={i}>PLANCHA <b>&#10038;</b> AREPA <b>&#10038;</b> SABOR <b>&#10038;</b> CALLE <b>&#10038;</b> Q AREPOTA <b>&#10038;</b></span>)}</div></div>

    <section className="featured section-pad" id="protagonistas">
     <div className="section-label-row reveal"><span className="eyebrow">01 / EL PROTAGONISTA</span><span>ELIGE, DESCUBRE, ANTOJATE.</span></div>
     <div className="featured-layout">
      <div className="featured-copy reveal"><div className="editorial-headline">UNO A UNO.<br/><em>A LO GRANDE.</em></div><span className="featured-index">{String(this.state.active+1).padStart(2,'0')} <i>/</i> {String(PRODUCTS.length).padStart(2,'0')}</span><div className="product-tag">{p.tag}</div><h2 key={`title-${p.id}`}>{p.name}</h2><span className="product-short">{p.short}</span><p className="featured-description" key={`desc-${p.id}`}>{p.description}</p><div className="ingredient-inline">{p.ingredients.slice(0,3).map(x=><span key={x}>{x}</span>)}</div><div className="featured-price"><strong>{currency(p.price)}</strong><small>* Precio ilustrativo</small></div><div className="featured-buttons"><button className="button button-primary" onClick={()=>this.add(p.id,1,true)}>Pedir ahora <Icon name="arrow"/></button><button className="button button-glass" onClick={()=>this.setState({detail:p.id})}>Ver ingredientes</button></div></div>
      <div className="featured-stage-holder">{this.renderStage()}<div className="featured-navigation"><button className="arrow-round" aria-label="Ver plato anterior" onClick={()=>this.go(-1)}><Icon name="left"/></button><div className="slide-progress"><span style={{width:`${(this.state.active+1)/PRODUCTS.length*100}%`}}/></div><button className="arrow-round" aria-label="Ver plato siguiente" onClick={()=>this.go(1)}><Icon name="right"/></button></div></div>
     </div>
     <div className="product-rail" aria-label="Seleccionar plato">{PRODUCTS.map((item,i)=><button key={item.id} className={`rail-item ${i===this.state.active?'rail-active':''}`} aria-pressed={i===this.state.active} onClick={()=>this.choose(i)}><img src={item.image} alt="" loading="lazy"/><span><small>{String(i+1).padStart(2,'0')}</small><strong>{item.name}</strong></span></button>)}</div>
    </section>

    <section className="cinema-banner section-pad reveal" id="como-pedimos"><div className="cinema-image"/><FilmMedia product={PRODUCTS[1]} local={this.state.media.includes('chuzo')} enabled={this.state.cine} variant="banner"/><div className="cinema-scrim"/><div className="cinema-copy"><span className="eyebrow">02 / COCINA A LA PLANCHA</span><h2>TODO EMPIEZA<br/><em>EN LA PLANCHA.</em></h2><p>No estamos vendiendo solo una foto bonita. Observa manos, ingredientes, preparaciones y comida real en movimiento. Cada plato tiene un video ilustrativo propio.</p><button className="button button-outline" onClick={()=>this.setState(s=>({cine:!s.cine}))}><Icon name={this.state.cine?'pause':'play'}/>{this.state.cine?'Pausar videos':'Activar videos'}</button></div></section>

    <section className="menu-section section-pad" id="pedido"><div className="section-label-row reveal"><span className="eyebrow">03 / EL MENU COMPLETO</span><span>ELIGE TU PROXIMO FAVORITO</span></div><div className="menu-heading reveal"><h2>EL ANTOJO<br/><em>NO ESPERA.</em></h2><p>Siete especialidades que merecen su propia escena. Elige un plato, revisa sus ingredientes y agrégalo directamente a tu pedido.</p></div>
     <div className="menu-grid">{PRODUCTS.map((item,i)=><article className="menu-card reveal" key={item.id}><button className="card-media" onClick={()=>{this.setState({detail:item.id});}} aria-label={`Ver detalles de ${item.name}`}>
       <img src={item.image} alt={item.name} loading="lazy"/><FilmMedia product={item} local={this.state.media.includes(item.id)} enabled={this.state.cine} variant="card"/><span className="card-img-shine"/><span className="card-numb">{String(i+1).padStart(2,'0')}</span><span className="card-see">VER PLATO <Icon name="arrow" size={15}/></span><span className={`card-effect card-effect-${item.effect}`} aria-hidden="true"/></button><div className="card-meta"><span>{item.tag}</span><h3>{item.name}</h3><p>{item.description}</p><div className="card-bottom"><strong>{currency(item.price)}</strong><button onClick={()=>this.add(item.id,1,true)} aria-label={`Pedir ${item.name}`}><Icon name="plus" size={18}/> Pedir</button></div></div>
      </article>)}</div><p className="price-note">* Precios ilustrativos. Los videos son preparaciones reales de archivo, no grabaciones del negocio. Si falla la conexion, se muestra la foto del plato. <a href="https://www.pexels.com/license/" target="_blank" rel="noopener noreferrer">Licencia de medios.</a></p>
    </section>

    <section className="steps section-pad"><div className="section-label-row reveal"><span className="eyebrow">04 / SIN COMPLICACIONES</span><span>DEL ANTOJO AL PEDIDO</span></div><h2 className="steps-heading reveal">ASI DE <em>FACIL.</em></h2><div className="steps-grid">{[['01','ELIGE TU PLATO','Recorre el menu, cambia de protagonista y descubre sus ingredientes.'],['02','ARMA TU PEDIDO','Agrega lo que quieras y ajusta las cantidades en el carrito.'],['03','CONFIRMA POR WHATSAPP','Revisa el resumen y consulta disponibilidad y domicilio directamente.']].map(x=><div className="step reveal" key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p><Icon name="arrow"/></div>)}</div></section>

    <section className="location section-pad" id="ubicacion"><div className="location-art"/><div className="location-copy reveal"><span className="eyebrow">05 / ENCUENTRANOS</span><h2>EL SABOR<br/><em>TIENE CASA.</em></h2><p>{cfg.address||'Direccion del negocio pendiente de configurar.'}</p><p className="location-hours">{cfg.hours||'Horario pendiente de configurar.'}</p><div className="location-actions"><button className="button button-primary" onClick={()=>cfg.mapUrl?window.open(cfg.mapUrl,'_blank','noopener,noreferrer'):this.notify('Agrega la ubicacion real en public/config.js para abrir el mapa.')}><Icon name="pin"/> Como llegar <Icon name="arrow"/></button><button className="button button-outline" onClick={()=>this.whatsapp(false)}><Icon name="phone"/> Escribir por WhatsApp</button></div></div></section>

    <section className="final-cta section-pad"><span className="eyebrow">LA DECISION ES TUYA</span><h2>QUE NO SE QUEDE<br/><em>EN ANTOJO.</em></h2><p>Arma tu pedido y lleva tu hambre al siguiente nivel.</p><button className="button button-primary" onClick={()=>this.setState({drawer:true})}>Ver mi pedido ({count}) <Icon name="arrow"/></button><div className="cta-deco" aria-hidden="true">Q.</div></section>
   </main>
   <footer className="footer"><a className="footer-brand" href="#inicio">Q AREPOTA<span>.</span></a><p>Comida colombiana con actitud. Proyecto demostrativo.</p><div><a href="#inicio">Inicio</a><a href="#pedido">Menu</a><a href="#ubicacion">Ubicacion</a></div><small>Q AREPOTA / PROTOTIPO 2026</small></footer>
   {this.state.toast&&<div className="toast" role="status"><Icon name="check" size={17}/>{this.state.toast}</div>}
   {this.renderDrawer()}{this.renderDetail()}
  </div>;
 }
}
