import * as React from 'react';
import { Product, assetBase } from './catalog';

type FilmProps={product:Product; local:boolean; enabled:boolean; variant:'stage'|'card'|'hero'|'banner'|'detail'};
type FilmState={status:'loading'|'ready'|'error'};
const playing=new Set<HTMLVideoElement>();
function stop(v:HTMLVideoElement){v.pause();playing.delete(v);}
function play(v:HTMLVideoElement,priority:boolean){
 if(document.hidden)return;
 if(!playing.has(v)&&playing.size>=2){
  const choices=Array.from(playing);
  const previous=choices.find(x=>x.dataset.priority!=='true')||choices[0];
  if(previous)stop(previous);
 }
 playing.add(v);
 const result=v.play();
 if(result&&typeof result.catch==='function')result.catch(()=>playing.delete(v));
}
/** Genuine stock video. No photo interpolation and no simulated food-motion. */
export class FilmMedia extends React.Component<FilmProps,FilmState>{
 state:FilmState={status:'loading'};
 private video:HTMLVideoElement|null=null;
 private observer:IntersectionObserver|null=null;
 private visibility=()=>{
  const el=this.video;if(!el)return;
  if(document.hidden)stop(el);
  else if(el.getBoundingClientRect().top<window.innerHeight&&el.getBoundingClientRect().bottom>0)
   play(el,this.priority());
 };
 private priority(){return ['stage','hero','banner'].includes(this.props.variant);}
 private source(){const p=this.props.product;return this.props.local?`${assetBase}/video/${p.id}.mp4`:`https://www.pexels.com/download/video/${p.videoId}/?w=960&h=540`;}
 componentDidMount(){this.observe();}
 componentDidUpdate(prev:FilmProps){
  if(prev.product.id!==this.props.product.id||prev.local!==this.props.local||prev.enabled!==this.props.enabled){
   this.cleanup();this.observe();
   if(this.state.status!=='loading')this.setState({status:'loading'});
  }
 }
 componentWillUnmount(){this.cleanup();}
 private cleanup(){this.observer?.disconnect();this.observer=null;document.removeEventListener('visibilitychange',this.visibility);if(this.video)stop(this.video);}
 private observe(){
  const el=this.video;
  if(!el||!this.props.enabled)return;
  if(typeof IntersectionObserver==='undefined'){play(el,this.priority());return;}
  this.observer=new IntersectionObserver(entries=>{
   if(entries.some(e=>e.isIntersecting))play(el,this.priority());else stop(el);
  },{rootMargin:this.priority()?'0px':'35px',threshold:this.priority()?.16:.45});
  this.observer.observe(el);
  document.addEventListener('visibilitychange',this.visibility);
 }
 render(){
  if(!this.props.enabled)return null;
  const p=this.props.product,priority=this.priority();
  return <div className={`film-shell film-shell-${this.props.variant}`}>
   <video ref={el=>{this.video=el;}} key={this.source()}
    className={`real-food-film film-${this.props.variant} ${this.state.status==='ready'?'film-visible':''}`}
    data-priority={priority?'true':'false'} data-product-id={p.id}
    data-media={this.props.local?'local':'external'}
    src={this.source()} poster={p.image} muted playsInline loop preload={priority?'metadata':'none'}
    onLoadedData={()=>this.setState({status:'ready'})}
    onPlaying={()=>{if(this.video)playing.add(this.video);}}
    onError={()=>{if(this.video)playing.delete(this.video);this.setState({status:'error'});}}
    aria-label={`Video real de preparacion relacionada con ${p.name}`}/>
   {this.props.variant==='stage'&&<div className={`film-state ${this.state.status}`} role="status">
    {this.state.status==='ready'?'VIDEO REAL EN REPRODUCCION':this.state.status==='error'?'VIDEO EXTERNO NO DISPONIBLE':this.props.local?'CARGANDO VIDEO LOCAL...':'CARGANDO VIDEO REAL DE PEXELS...'}
   </div>}
  </div>;
 }
}
