import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import App from './App';
import './styles.css';
import { openProduct3D } from './three-experience';

gsap.registerPlugin(ScrollTrigger);
(window as any).QAREPOTA_3D = openProduct3D;
const root = document.getElementById('root');
if (root) createRoot(root).render(<App />);

window.addEventListener('load', () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  gsap.to('.hero-background', {yPercent: 17, ease:'none', scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.2}});
  gsap.to('.cinema-image', {yPercent:12, ease:'none',scrollTrigger:{trigger:'.cinema-banner',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.to('.location-art', {yPercent:10,ease:'none',scrollTrigger:{trigger:'.location',start:'top bottom',end:'bottom top',scrub:1}});
  ScrollTrigger.refresh();
});
