"use strict";
const React = window.React;

const assetBase = (window.location.protocol === 'file:' || window.location.pathname.includes('/preview/')) ? '../assets' : '/assets';
const PRODUCTS = [
    { id: 'hamburguesa', name: 'Burger La Monumental', short: 'DOBLE CARNE / QUESO / PLANCHA', description: 'Doble carne preparada en plancha, queso fundido, cebolla caramelizada y salsa especial en pan dorado.', ingredients: ['Doble carne de res', 'Queso cheddar', 'Cebolla caramelizada', 'Salsa de la casa'], price: 29900, image: assetBase + '/images/hamburguesa.webp', effect: 'burger', tag: 'LA MAS PEDIDA', videoDescription: 'Cocina real: manos preparando una hamburguesa gourmet. Video ilustrativo.', videoId: '12282853', videoPage: 'https://www.pexels.com/video/hands-preparing-hamburger-12282853/' },
    { id: 'chuzo', name: 'Chuzo de Carne con Arepa', short: 'CHUZO / PLANCHA / AREPA', description: 'Pinchos de carne de res preparados en plancha y servidos con arepa colombiana dorada y salsa de la casa.', ingredients: ['Carne de res', 'Arepa colombiana', 'Especias', 'Salsa de la casa'], price: 24900, image: assetBase + '/images/chuzo.webp', effect: 'steam', tag: 'HECHO EN PLANCHA', videoDescription: 'Cocina real: pinchos volteados sobre plancha plana. No muestra el acompanamiento final.', videoId: '7008584', videoPage: 'https://www.pexels.com/video/a-person-flipping-meat-in-skewers-on-a-flat-top-griddle-7008584/' },
    { id: 'arepa-pollo', name: 'Arepota de Pollo', short: 'AREPA / POLLO DESMECHADO / QUESO', description: 'Arepa dorada rellena con pollo desmechado, hogao suave y queso fundido.', ingredients: ['Arepa de maiz', 'Pollo desmechado', 'Hogao', 'Queso'], price: 22900, image: assetBase + '/images/arepa-pollo.webp', effect: 'cheese', tag: 'NUESTRA ESPECIALIDAD', videoDescription: 'Cocina real: arepas colombianas en plancha; la foto final muestra el relleno.', videoId: '37232230', videoPage: 'https://www.pexels.com/video/freshly-grilled-arepas-on-hot-griddle-37232230/' },
    { id: 'pollo-desmechado', name: 'Pollo Desmechado de la Casa', short: 'POLLO / HOGAO / SABOR', description: 'Pollo desmechado con hogao casero, cebolla y especias, acompanado de arepa de maiz.', ingredients: ['Pollo desmechado', 'Hogao', 'Cebolla', 'Arepa'], price: 21900, image: assetBase + '/images/pollo-desmechado.webp', effect: 'steam', tag: 'HECHO CON CUIDADO', videoDescription: 'Cocina real: manipulacion de pollo desmechado caliente con pinzas.', videoId: '5528176', videoPage: 'https://www.pexels.com/video/person-taking-shredded-meat-from-a-pan-5528176/' },
    { id: 'perro', name: 'Perro Callejero XL', short: 'SALSA / CRUJIENTE / XL', description: 'Pan dorado, salchicha preparada en plancha, papa ripio, queso y salsas.', ingredients: ['Salchicha', 'Papa ripio', 'Queso', 'Salsas'], price: 18900, image: assetBase + '/images/perro.webp', effect: 'sauce', tag: 'ANTOJO TOTAL', videoDescription: 'Cocina real: preparacion de perro caliente con salsas gourmet.', videoId: '40426481', videoPage: 'https://www.pexels.com/video/artisan-hot-dog-with-gourmet-sauces-40426481/' },
    { id: 'salchipapa', name: 'Salchipapa Especial', short: 'PAPAS / SALCHICHA / QUESO', description: 'Papas crocantes con salchicha de plancha, queso fundido y salsas de la casa.', ingredients: ['Papas fritas', 'Salchicha', 'Queso', 'Salsa rosada'], price: 25900, image: assetBase + '/images/salchipapa.webp', effect: 'fries', tag: 'PARA COMPARTIR', videoDescription: 'Cocina real: papas servidas en plato. Es un video relacionado, no la receta exacta.', videoId: '13253647', videoPage: 'https://www.pexels.com/video/fries-on-plates-13253647/' },
    { id: 'butifarras', name: 'Butifarras de la Casa', short: 'BUTIFARRAS / LIMON / AREPA', description: 'Porcion de butifarras colombianas servidas con limon, arepa dorada y salsa de la casa.', ingredients: ['Butifarras colombianas', 'Limon', 'Arepa de maiz', 'Salsa de la casa'], price: 19900, image: assetBase + '/images/butifarras.webp', effect: 'herbs', tag: 'SABOR COLOMBIANO', videoDescription: 'Cocina real: salchichas pequenas en sarten. Video contextual; no son butifarras colombianas identificadas.', videoId: '36003039', videoPage: 'https://www.pexels.com/video/sizzling-sausages-cooking-in-a-pan-36003039/' }
];
const currency = (amount) => '$' + amount.toLocaleString('es-CO');


// Independent motion engine that works in Vite and the offline Live Server preview.
// It draws particles and smoke that MOVE even when the mouse is still.
function setupMotion() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const body = document.body;
    const pointers = { x: 0, y: 0 };
    let raf = 0;
    let t = 0;
    let active = true;
    let currentEffect = 'burger';
    const canvas = document.getElementById('food-particles');
    const ctx = canvas?.getContext('2d');
    const parts = [];
    const n = reduced ? 0 : 53;
    for (let i = 0; i < n; i++)
        parts.push({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .0009, vy: .0008 + Math.random() * .0017, life: Math.random() * 100, size: 1 + Math.random() * 3, seed: Math.random() * 9 });
    let width = 0, height = 0;
    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        if (canvas) {
            const dpr = Math.min(devicePixelRatio || 1, 1.6);
            canvas.width = Math.ceil(width * dpr);
            canvas.height = Math.ceil(height * dpr);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
    };
    const mouse = (e) => {
        pointers.x = e.clientX / Math.max(width, 1) - .5;
        pointers.y = e.clientY / Math.max(height, 1) - .5;
        body.style.setProperty('--mouse-x', String(pointers.x));
        body.style.setProperty('--mouse-y', String(pointers.y));
    };
    const visibility = () => { active = !document.hidden; if (active && !raf)
        loop(); };
    const drawPart = (x, y, r, seed) => {
        if (!ctx)
            return;
        const color = seed > 4 ? '#e5d5ad' : '#f8db9b';
        ctx.beginPath();
        ctx.ellipse(x, y, r, r * 1.5, Math.sin(t * .01 + seed), 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = embersAlpha(seed);
        ctx.fill();
        ctx.globalAlpha = 1;
    };
    const embersAlpha = (seed) => .25 + .35 * (.5 + .5 * Math.sin(t * .02 + seed));
    const loop = () => {
        raf = 0;
        if (!active || !canvas || !ctx || reduced)
            return;
        const stage = document.querySelector('.stage');
        currentEffect = stage?.dataset.effect || 'burger';
        ctx.clearRect(0, 0, width, height);
        t++;
        for (const p of parts) {
            p.x += p.vx;
            p.y -= p.vy * .27;
            if (p.y < -.03) {
                p.y = 1.03;
                p.x = Math.random();
            }
            if (p.x < -.03)
                p.x = 1.03;
            if (p.x > 1.03)
                p.x = -.03;
            const x = p.x * width + Math.sin(t * .017 + p.seed) * 12;
            const y = p.y * height;
            drawPart(x, y, p.size, p.seed);
        }
        // Soft moving steam: multiple drifting translucent ribbons.
        if (['steam', 'cheese', 'burger', 'herbs'].includes(currentEffect)) {
            for (let i = 0; i < 6; i++) {
                const center = width * .70 + (i - 2.5) * 17;
                ctx.beginPath();
                for (let j = 0; j < 14; j++) {
                    const y = height * .60 - j * 14;
                    const x = center + Math.sin(t * .02 + i * 1.8 + j * .4) * (9 + j * .9);
                    if (j === 0)
                        ctx.moveTo(x, y);
                    else
                        ctx.lineTo(x, y);
                }
                ctx.strokeStyle = 'rgba(255,237,196,.08)';
                ctx.lineWidth = 9 + i;
                ctx.lineCap = 'round';
                ctx.stroke();
            }
        }
        raf = requestAnimationFrame(loop);
    };
    // Scroll reveal using IntersectionObserver, with accessible reduced-motion fallback.
    const observers = [];
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            observer.unobserve(e.target);
        } });
    }, { threshold: .11, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.reveal').forEach(e => observer.observe(e));
    observers.push(observer);
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', mouse, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    if (!reduced)
        loop();
    return () => { active = false; if (raf)
        cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', mouse); document.removeEventListener('visibilitychange', visibility); observers.forEach(x => x.disconnect()); };
}


const playing = new Set();
function stop(v) { v.pause(); playing.delete(v); }
function play(v, priority) {
    if (document.hidden)
        return;
    if (!playing.has(v) && playing.size >= 2) {
        const choices = Array.from(playing);
        const previous = choices.find(x => x.dataset.priority !== 'true') || choices[0];
        if (previous)
            stop(previous);
    }
    playing.add(v);
    const result = v.play();
    if (result && typeof result.catch === 'function')
        result.catch(() => playing.delete(v));
}
/** Genuine stock video. No photo interpolation and no simulated food-motion. */
class FilmMedia extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { status: 'loading' };
        this.video = null;
        this.observer = null;
        this.visibility = () => {
            const el = this.video;
            if (!el)
                return;
            if (document.hidden)
                stop(el);
            else if (el.getBoundingClientRect().top < window.innerHeight && el.getBoundingClientRect().bottom > 0)
                play(el, this.priority());
        };
    }
    priority() { return ['stage', 'hero', 'banner'].includes(this.props.variant); }
    source() { const p = this.props.product; return this.props.local ? `${assetBase}/video/${p.id}.mp4` : `https://www.pexels.com/download/video/${p.videoId}/?w=960&h=540`; }
    componentDidMount() { this.observe(); }
    componentDidUpdate(prev) {
        if (prev.product.id !== this.props.product.id || prev.local !== this.props.local || prev.enabled !== this.props.enabled) {
            this.cleanup();
            this.observe();
            if (this.state.status !== 'loading')
                this.setState({ status: 'loading' });
        }
    }
    componentWillUnmount() { this.cleanup(); }
    cleanup() { this.observer?.disconnect(); this.observer = null; document.removeEventListener('visibilitychange', this.visibility); if (this.video)
        stop(this.video); }
    observe() {
        const el = this.video;
        if (!el || !this.props.enabled)
            return;
        if (typeof IntersectionObserver === 'undefined') {
            play(el, this.priority());
            return;
        }
        this.observer = new IntersectionObserver(entries => {
            if (entries.some(e => e.isIntersecting))
                play(el, this.priority());
            else
                stop(el);
        }, { rootMargin: this.priority() ? '0px' : '35px', threshold: this.priority() ? .16 : .45 });
        this.observer.observe(el);
        document.addEventListener('visibilitychange', this.visibility);
    }
    render() {
        if (!this.props.enabled)
            return null;
        const p = this.props.product, priority = this.priority();
        return React.createElement("div", { className: `film-shell film-shell-${this.props.variant}` },
            React.createElement("video", { ref: el => { this.video = el; }, key: this.source(), className: `real-food-film film-${this.props.variant} ${this.state.status === 'ready' ? 'film-visible' : ''}`, "data-priority": priority ? 'true' : 'false', "data-product-id": p.id, "data-media": this.props.local ? 'local' : 'external', src: this.source(), poster: p.image, muted: true, playsInline: true, loop: true, preload: priority ? 'metadata' : 'none', onLoadedData: () => this.setState({ status: 'ready' }), onPlaying: () => { if (this.video)
                    playing.add(this.video); }, onError: () => { if (this.video)
                    playing.delete(this.video); this.setState({ status: 'error' }); }, "aria-label": `Video real de preparacion relacionada con ${p.name}` }),
            this.props.variant === 'stage' && React.createElement("div", { className: `film-state ${this.state.status}`, role: "status" }, this.state.status === 'ready' ? 'VIDEO REAL EN REPRODUCCION' : this.state.status === 'error' ? 'VIDEO EXTERNO NO DISPONIBLE' : this.props.local ? 'CARGANDO VIDEO LOCAL...' : 'CARGANDO VIDEO REAL DE PEXELS...'));
    }
}


const CFG = () => window.QAREPOTA_CONFIG || {};
const storage = 'q-arepota-cart-v1';
const readCart = () => { try {
    const obj = JSON.parse(localStorage.getItem(storage) || '{}');
    if (obj && typeof obj === 'object')
        return obj;
}
catch (_) { } return {}; };
const Icon = (props) => {
    const common = { width: props.size || 20, height: props.size || 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
    const shapes = {
        arrow: React.createElement("g", null,
            React.createElement("path", { d: "M4 12h16M13 5l7 7-7 7" })),
        left: React.createElement("g", null,
            React.createElement("path", { d: "m15 18-6-6 6-6" })), right: React.createElement("g", null,
            React.createElement("path", { d: "m9 18 6-6-6-6" })),
        cart: React.createElement("g", null,
            React.createElement("circle", { cx: "9", cy: "21", r: "1" }),
            React.createElement("circle", { cx: "20", cy: "21", r: "1" }),
            React.createElement("path", { d: "M1 1h4l2.6 13.4A2 2 0 0 0 9.6 16H20a2 2 0 0 0 2-1.6L23 6H6" })),
        close: React.createElement("g", null,
            React.createElement("path", { d: "M18 6 6 18M6 6l12 12" })),
        pin: React.createElement("g", null,
            React.createElement("path", { d: "M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" }),
            React.createElement("circle", { cx: "12", cy: "10", r: "2.5" })),
        play: React.createElement("g", null,
            React.createElement("path", { d: "m8 5 11 7-11 7V5Z" })),
        pause: React.createElement("g", null,
            React.createElement("path", { d: "M8 5v14M16 5v14" })),
        plus: React.createElement("g", null,
            React.createElement("path", { d: "M12 5v14M5 12h14" })),
        minus: React.createElement("g", null,
            React.createElement("path", { d: "M5 12h14" })),
        phone: React.createElement("g", null,
            React.createElement("path", { d: "M22 16.8V21a2 2 0 0 1-2.2 2 19 19 0 0 1-18-18A2 2 0 0 1 3.8 3H8l2 5-2.5 2a14 14 0 0 0 6.5 6.5L16 14l6 2.8Z" })),
        check: React.createElement("g", null,
            React.createElement("path", { d: "m4 12 5 5L20 6" })),
        menu: React.createElement("g", null,
            React.createElement("path", { d: "M4 7h16M4 12h16M4 17h16" })),
        sound: React.createElement("g", null,
            React.createElement("path", { d: "M6 10H3v4h3l4 4V6L6 10ZM16 8a6 6 0 0 1 0 8" })),
        flame: React.createElement("g", null,
            React.createElement("path", { d: "M12 22c-4 0-7-3.1-7-7 0-3 1.5-5.3 4-8 .5 3 1.2 4 2 4 0-4 2-7 4-9 0 3 4 6 4 12 0 4.5-3 8-7 8Z" }))
    };
    return React.createElement("svg", { ...common, "aria-hidden": "true" }, shapes[props.name] || shapes.arrow);
};
class App extends React.Component {
    constructor(props) {
        super(props);
        this.teardown = null;
        this.notify = (message) => { this.setState({ toast: message }); if (this.toastTimer)
            window.clearTimeout(this.toastTimer); this.toastTimer = window.setTimeout(() => this.setState({ toast: '' }), 4300); };
        this.go = (direction) => { this.setState(s => ({ active: (s.active + direction + PRODUCTS.length) % PRODUCTS.length, qty: 1 })); };
        this.choose = (index) => { this.setState({ active: index, qty: 1 }); document.getElementById('protagonistas')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
        this.add = (id, amount = 1, open = false) => {
            this.setState(s => ({ cart: { ...s.cart, [id]: (s.cart[id] || 0) + amount }, drawer: open || s.drawer }));
            this.notify('Agregado a tu pedido');
        };
        this.count = (id, amount) => { this.setState(s => { const cart = { ...s.cart }; const n = (cart[id] || 0) + amount; if (n <= 0)
            delete cart[id];
        else
            cart[id] = n; return { cart }; }); };
        this.cartTotal = () => PRODUCTS.reduce((sum, p) => sum + (this.state.cart[p.id] || 0) * p.price, 0);
        this.cartCount = () => Object.values(this.state.cart).reduce((a, b) => a + b, 0);
        this.orderText = () => {
            const lines = ['Hola, quiero realizar este pedido en Q Arepota:'];
            PRODUCTS.filter(p => this.state.cart[p.id]).forEach(p => lines.push(`${this.state.cart[p.id]} x ${p.name} - ${currency((this.state.cart[p.id] || 0) * p.price)}`));
            lines.push(`Total de referencia: ${currency(this.cartTotal())}`, 'Precios de demostracion: confirmar precio final, disponibilidad, domicilio y datos del negocio.');
            return lines.join('\n');
        };
        this.whatsapp = (fromOrder) => {
            const phone = (CFG().whatsapp || '').replace(/\D/g, '');
            const text = fromOrder ? this.orderText() : 'Hola, quiero conocer el menu de Q Arepota y hacer un pedido.';
            if (!phone) {
                if (navigator.clipboard)
                    navigator.clipboard.writeText(text).then(() => { }).catch(() => { });
                this.notify('WhatsApp pendiente: configura el numero real en public/config.js. Resumen copiado si tu navegador lo permite.');
                return;
            }
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
        };
        this.onTilt = (e) => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
                return;
            const r = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - .5;
            const y = (e.clientY - r.top) / r.height - .5;
            e.currentTarget.style.setProperty('--tilt-x', (x * 9).toFixed(2) + 'deg');
            e.currentTarget.style.setProperty('--tilt-y', (y * -7).toFixed(2) + 'deg');
        };
        this.resetTilt = (e) => { e.currentTarget.style.setProperty('--tilt-x', '0deg'); e.currentTarget.style.setProperty('--tilt-y', '0deg'); };
        this.open3d = () => { const f = window.QAREPOTA_3D; if (typeof f === 'function')
            f(this.productSelected().id);
        else
            this.notify('El laboratorio Three.js funciona en la version Vite con npm run dev. La vista fotografica es la version principal.'); };
        this.state = { active: 0, cart: readCart(), drawer: false, detail: null, qty: 1, toast: '', media: [], cine: true, mobileMenu: false };
        this.keyHandler = (e) => {
            const target = e.target;
            if (e.key === 'Escape')
                this.setState({ drawer: false, detail: null, mobileMenu: false });
            if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
                return;
            if (e.key === 'ArrowRight' && !this.state.drawer && !this.state.detail)
                this.go(1);
            if (e.key === 'ArrowLeft' && !this.state.drawer && !this.state.detail)
                this.go(-1);
        };
    }
    componentDidMount() {
        this.teardown = setupMotion();
        window.addEventListener('keydown', this.keyHandler);
        fetch(assetBase + '/video/manifest.json').then(r => r.ok ? r.json() : []).then((items) => this.setState({ media: Array.isArray(items) ? items : [] })).catch(() => { });
    }
    componentDidUpdate(_, old) {
        if (old.active !== this.state.active) {
            const el = document.querySelector('.stage');
            if (el) {
                el.classList.remove('stage-arrive');
                void el.offsetWidth;
                el.classList.add('stage-arrive');
            }
        }
        if (old.cart !== this.state.cart) {
            try {
                localStorage.setItem(storage, JSON.stringify(this.state.cart));
            }
            catch (_) { /* unavailable in embedded/file previews */ }
        }
        if (old.drawer !== this.state.drawer || old.detail !== this.state.detail) {
            document.body.classList.toggle('overlay-open', this.state.drawer || !!this.state.detail);
        }
    }
    componentWillUnmount() { if (this.teardown)
        this.teardown(); window.removeEventListener('keydown', this.keyHandler); if (this.toastTimer)
        window.clearTimeout(this.toastTimer); }
    productSelected() { return PRODUCTS[this.state.active]; }
    renderStage() {
        const p = this.productSelected();
        const local = this.state.media.includes(p.id);
        const active = this.state.cine && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return React.createElement("div", { className: "stage stage-arrive", "data-effect": p.effect },
            React.createElement("div", { className: "stage-halo" }),
            React.createElement("div", { className: "stage-inner" },
                React.createElement("div", { className: "stage-orbit stage-orbit-a" }),
                React.createElement("div", { className: "stage-orbit stage-orbit-b" }),
                React.createElement("div", { className: "stage-photo-frame stage-film-frame", key: p.id },
                    React.createElement("img", { src: p.image, alt: `${p.name}: imagen ilustrativa del producto final`, className: "stage-photo" }),
                    React.createElement(FilmMedia, { key: p.id, product: p, local: local, enabled: active, variant: "stage" }),
                    React.createElement("span", { className: "stage-photo-vignette" })),
                React.createElement("div", { className: "stage-plate-tag" },
                    React.createElement("span", { className: "tag-line" }),
                    "PLANCHA, MAIZ Y SABOR")),
            React.createElement("div", { className: "stage-tiny-caption" }, active ? 'IMAGEN DEL PLATO + VIDEO DE PREPARACION REAL' : 'FOTOGRAFIA DEL PRODUCTO'));
    }
    renderDrawer() {
        if (!this.state.drawer)
            return null;
        const count = this.cartCount();
        return React.createElement("div", { className: "scrim", onMouseDown: e => { if (e.target === e.currentTarget)
                this.setState({ drawer: false }); } },
            React.createElement("aside", { className: "drawer", role: "dialog", "aria-modal": "true", "aria-label": "Tu pedido" },
                React.createElement("div", { className: "drawer-head" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "eyebrow" }, "PEDIDO / Q AREPOTA"),
                        React.createElement("h2", null, "Tu antojo.")),
                    React.createElement("button", { className: "icon-button", "aria-label": "Cerrar pedido", onClick: () => this.setState({ drawer: false }) },
                        React.createElement(Icon, { name: "close" }))),
                React.createElement("div", { className: "drawer-list" }, count === 0 ? React.createElement("div", { className: "empty-cart" },
                    React.createElement("span", null, "Q"),
                    React.createElement("h3", null, "Tu carrito esta esperando."),
                    React.createElement("p", null, "Elige algo brutal del menu."),
                    React.createElement("button", { className: "button button-primary", onClick: () => this.setState({ drawer: false }) },
                        "Explorar menu ",
                        React.createElement(Icon, { name: "arrow" }))) : PRODUCTS.filter(p => this.state.cart[p.id]).map(p => React.createElement("div", { className: "drawer-item", key: p.id },
                    React.createElement("img", { src: p.image, alt: p.name }),
                    React.createElement("div", null,
                        React.createElement("h3", null, p.name),
                        React.createElement("span", null,
                            currency(p.price),
                            " c/u"),
                        React.createElement("div", { className: "quantity" },
                            React.createElement("button", { "aria-label": `Quitar uno de ${p.name}`, onClick: () => this.count(p.id, -1) },
                                React.createElement(Icon, { name: "minus", size: 14 })),
                            React.createElement("span", null, this.state.cart[p.id]),
                            React.createElement("button", { "aria-label": `Agregar uno de ${p.name}`, onClick: () => this.count(p.id, 1) },
                                React.createElement(Icon, { name: "plus", size: 14 })))),
                    React.createElement("strong", null, currency(p.price * (this.state.cart[p.id] || 0)))))),
                React.createElement("div", { className: "drawer-bottom" },
                    React.createElement("div", { className: "total-line" },
                        React.createElement("span", null, "Total estimado"),
                        React.createElement("strong", null, currency(this.cartTotal()))),
                    React.createElement("p", null, "Precios ilustrativos. Confirma costos y entrega con el negocio."),
                    React.createElement("button", { className: "button button-primary button-wide", disabled: !count, onClick: () => this.whatsapp(true) },
                        React.createElement(Icon, { name: "phone" }),
                        " Finalizar por WhatsApp ",
                        React.createElement(Icon, { name: "arrow" })))));
    }
    renderDetail() {
        const id = this.state.detail;
        if (!id)
            return null;
        const p = PRODUCTS.find(x => x.id === id);
        if (!p)
            return null;
        return React.createElement("div", { className: "scrim", onMouseDown: e => { if (e.target === e.currentTarget)
                this.setState({ detail: null }); } },
            React.createElement("section", { className: "detail-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "detail-title" },
                React.createElement("button", { className: "icon-button detail-close", "aria-label": "Cerrar detalles", onClick: () => this.setState({ detail: null }) },
                    React.createElement(Icon, { name: "close" })),
                React.createElement("div", { className: "detail-media" },
                    React.createElement("img", { className: "detail-photo", src: p.image, alt: p.name }),
                    React.createElement(FilmMedia, { product: p, local: this.state.media.includes(p.id), enabled: this.state.cine, variant: "detail" })),
                React.createElement("div", { className: "detail-content" },
                    React.createElement("span", { className: "eyebrow" }, "FICHA DE PRODUCTO"),
                    React.createElement("h2", { id: "detail-title" }, p.name),
                    React.createElement("p", null, p.description),
                    React.createElement("div", { className: "ingredients" }, p.ingredients.map(i => React.createElement("span", { key: i }, i))),
                    React.createElement("p", { className: "video-note" },
                        p.videoDescription,
                        " ",
                        React.createElement("a", { href: p.videoPage, target: "_blank", rel: "noopener noreferrer" }, "Ver video original en Pexels")),
                    React.createElement("strong", { className: "detail-price" }, currency(p.price)),
                    React.createElement("button", { className: "button button-primary", onClick: () => { this.add(p.id, 1, true); this.setState({ detail: null }); } },
                        "Agregar al pedido ",
                        React.createElement(Icon, { name: "arrow" })))));
    }
    render() {
        const p = this.productSelected();
        const count = this.cartCount();
        const cfg = CFG();
        return React.createElement("div", { className: "site-shell" },
            React.createElement("canvas", { id: "food-particles", "aria-hidden": "true" }),
            React.createElement("div", { className: "global-halo global-halo-one" }),
            React.createElement("div", { className: "global-halo global-halo-two" }),
            React.createElement("header", { className: "topbar" },
                React.createElement("a", { href: "#inicio", className: "brand", "aria-label": "Q Arepota, ir a inicio" },
                    React.createElement("span", { className: "brand-mark" },
                        "Q",
                        React.createElement("span", null, ".")),
                    React.createElement("span", { className: "brand-words" },
                        "AREPOTA ",
                        React.createElement("small", null, "COMIDA CON ACTITUD"))),
                React.createElement("nav", { className: `nav ${this.state.mobileMenu ? 'nav-open' : ''}`, "aria-label": "Menu principal" },
                    React.createElement("a", { href: "#inicio", onClick: () => this.setState({ mobileMenu: false }) }, "Inicio"),
                    React.createElement("a", { href: "#pedido", onClick: () => this.setState({ mobileMenu: false }) }, "Hacer pedido"),
                    React.createElement("a", { href: "#ubicacion", onClick: () => this.setState({ mobileMenu: false }) }, "Ubicacion"),
                    React.createElement("button", { className: "nav-whatsapp", onClick: () => { this.setState({ mobileMenu: false }); this.whatsapp(false); } },
                        "WhatsApp ",
                        React.createElement(Icon, { name: "arrow", size: 15 }))),
                React.createElement("div", { className: "nav-actions" },
                    React.createElement("button", { className: "cart-button", "aria-label": `Abrir pedido: ${count} productos`, onClick: () => this.setState({ drawer: true }) },
                        React.createElement(Icon, { name: "cart" }),
                        React.createElement("span", null, count)),
                    React.createElement("button", { className: "mobile-toggle", "aria-label": this.state.mobileMenu ? 'Cerrar menu' : 'Abrir menu', "aria-expanded": this.state.mobileMenu, onClick: () => this.setState(s => ({ mobileMenu: !s.mobileMenu })) },
                        React.createElement(Icon, { name: this.state.mobileMenu ? 'close' : 'menu' })))),
            React.createElement("main", null,
                React.createElement("section", { className: "hero", id: "inicio" },
                    React.createElement("div", { className: "hero-background" }),
                    React.createElement(FilmMedia, { product: PRODUCTS[0], local: this.state.media.includes('hamburguesa'), enabled: this.state.cine, variant: "hero" }),
                    React.createElement("div", { className: "hero-shade" }),
                    React.createElement("div", { className: "hero-grain" }),
                    React.createElement("div", { className: "hero-content" },
                        React.createElement("div", { className: "hero-kicker" },
                            React.createElement("span", { className: "pulse-dot" }),
                            " COMIDA COLOMBIANA / ACTITUD CALLEJERA"),
                        React.createElement("h1", null,
                            React.createElement("span", null, "QUE"),
                            React.createElement("span", { className: "hero-title-accent" },
                                "AREPOTA",
                                React.createElement("span", { className: "hero-bang" }, "!"))),
                        React.createElement("p", null, "Maiz. Plancha. Queso. Sabor sin timidez. El antojo de barrio se viste para romperla."),
                        React.createElement("div", { className: "hero-cta" },
                            React.createElement("a", { className: "button button-primary", href: "#protagonistas" },
                                "Descubre el menu ",
                                React.createElement(Icon, { name: "arrow" })),
                            React.createElement("a", { href: "#pedido", className: "button button-outline" }, "Hacer mi pedido")),
                        React.createElement("div", { className: "hero-foot" },
                            React.createElement("span", { className: "hero-side-line" }),
                            " DESLIZA PARA ANTOJARTE ",
                            React.createElement("span", { className: "scroll-symbol" }, "\u2193"))),
                    React.createElement("div", { className: "hero-deco hero-deco-one" }, "Q"),
                    React.createElement("div", { className: "hero-round-seal" },
                        "HECHO PARA",
                        React.createElement("br", null),
                        "ANTOJARSE ",
                        React.createElement("span", null, "\u2736"))),
                React.createElement("div", { className: "marquee", "aria-hidden": "true" },
                    React.createElement("div", { className: "marquee-track" }, Array(4).fill(0).map((_, i) => React.createElement("span", { key: i },
                        "PLANCHA ",
                        React.createElement("b", null, "\u2736"),
                        " AREPA ",
                        React.createElement("b", null, "\u2736"),
                        " SABOR ",
                        React.createElement("b", null, "\u2736"),
                        " CALLE ",
                        React.createElement("b", null, "\u2736"),
                        " Q AREPOTA ",
                        React.createElement("b", null, "\u2736"))))),
                React.createElement("section", { className: "featured section-pad", id: "protagonistas" },
                    React.createElement("div", { className: "section-label-row reveal" },
                        React.createElement("span", { className: "eyebrow" }, "01 / EL PROTAGONISTA"),
                        React.createElement("span", null, "ELIGE, DESCUBRE, ANTOJATE.")),
                    React.createElement("div", { className: "featured-layout" },
                        React.createElement("div", { className: "featured-copy reveal" },
                            React.createElement("div", { className: "editorial-headline" },
                                "UNO A UNO.",
                                React.createElement("br", null),
                                React.createElement("em", null, "A LO GRANDE.")),
                            React.createElement("span", { className: "featured-index" },
                                String(this.state.active + 1).padStart(2, '0'),
                                " ",
                                React.createElement("i", null, "/"),
                                " ",
                                String(PRODUCTS.length).padStart(2, '0')),
                            React.createElement("div", { className: "product-tag" }, p.tag),
                            React.createElement("h2", { key: `title-${p.id}` }, p.name),
                            React.createElement("span", { className: "product-short" }, p.short),
                            React.createElement("p", { className: "featured-description", key: `desc-${p.id}` }, p.description),
                            React.createElement("div", { className: "ingredient-inline" }, p.ingredients.slice(0, 3).map(x => React.createElement("span", { key: x }, x))),
                            React.createElement("div", { className: "featured-price" },
                                React.createElement("strong", null, currency(p.price)),
                                React.createElement("small", null, "* Precio ilustrativo")),
                            React.createElement("div", { className: "featured-buttons" },
                                React.createElement("button", { className: "button button-primary", onClick: () => this.add(p.id, 1, true) },
                                    "Pedir ahora ",
                                    React.createElement(Icon, { name: "arrow" })),
                                React.createElement("button", { className: "button button-glass", onClick: () => this.setState({ detail: p.id }) }, "Ver ingredientes"))),
                        React.createElement("div", { className: "featured-stage-holder" },
                            this.renderStage(),
                            React.createElement("div", { className: "featured-navigation" },
                                React.createElement("button", { className: "arrow-round", "aria-label": "Ver plato anterior", onClick: () => this.go(-1) },
                                    React.createElement(Icon, { name: "left" })),
                                React.createElement("div", { className: "slide-progress" },
                                    React.createElement("span", { style: { width: `${(this.state.active + 1) / PRODUCTS.length * 100}%` } })),
                                React.createElement("button", { className: "arrow-round", "aria-label": "Ver plato siguiente", onClick: () => this.go(1) },
                                    React.createElement(Icon, { name: "right" }))))),
                    React.createElement("div", { className: "product-rail", "aria-label": "Seleccionar plato" }, PRODUCTS.map((item, i) => React.createElement("button", { key: item.id, className: `rail-item ${i === this.state.active ? 'rail-active' : ''}`, "aria-pressed": i === this.state.active, onClick: () => this.choose(i) },
                        React.createElement("img", { src: item.image, alt: "", loading: "lazy" }),
                        React.createElement("span", null,
                            React.createElement("small", null, String(i + 1).padStart(2, '0')),
                            React.createElement("strong", null, item.name)))))),
                React.createElement("section", { className: "cinema-banner section-pad reveal", id: "como-pedimos" },
                    React.createElement("div", { className: "cinema-image" }),
                    React.createElement(FilmMedia, { product: PRODUCTS[1], local: this.state.media.includes('chuzo'), enabled: this.state.cine, variant: "banner" }),
                    React.createElement("div", { className: "cinema-scrim" }),
                    React.createElement("div", { className: "cinema-copy" },
                        React.createElement("span", { className: "eyebrow" }, "02 / COCINA A LA PLANCHA"),
                        React.createElement("h2", null,
                            "TODO EMPIEZA",
                            React.createElement("br", null),
                            React.createElement("em", null, "EN LA PLANCHA.")),
                        React.createElement("p", null, "No estamos vendiendo solo una foto bonita. Observa manos, ingredientes, preparaciones y comida real en movimiento. Cada plato tiene un video ilustrativo propio."),
                        React.createElement("button", { className: "button button-outline", onClick: () => this.setState(s => ({ cine: !s.cine })) },
                            React.createElement(Icon, { name: this.state.cine ? 'pause' : 'play' }),
                            this.state.cine ? 'Pausar videos' : 'Activar videos'))),
                React.createElement("section", { className: "menu-section section-pad", id: "pedido" },
                    React.createElement("div", { className: "section-label-row reveal" },
                        React.createElement("span", { className: "eyebrow" }, "03 / EL MENU COMPLETO"),
                        React.createElement("span", null, "ELIGE TU PROXIMO FAVORITO")),
                    React.createElement("div", { className: "menu-heading reveal" },
                        React.createElement("h2", null,
                            "EL ANTOJO",
                            React.createElement("br", null),
                            React.createElement("em", null, "NO ESPERA.")),
                        React.createElement("p", null, "Siete especialidades que merecen su propia escena. Elige un plato, revisa sus ingredientes y agr\u00E9galo directamente a tu pedido.")),
                    React.createElement("div", { className: "menu-grid" }, PRODUCTS.map((item, i) => React.createElement("article", { className: "menu-card reveal", key: item.id },
                        React.createElement("button", { className: "card-media", onClick: () => { this.setState({ detail: item.id }); }, "aria-label": `Ver detalles de ${item.name}` },
                            React.createElement("img", { src: item.image, alt: item.name, loading: "lazy" }),
                            React.createElement(FilmMedia, { product: item, local: this.state.media.includes(item.id), enabled: this.state.cine, variant: "card" }),
                            React.createElement("span", { className: "card-img-shine" }),
                            React.createElement("span", { className: "card-numb" }, String(i + 1).padStart(2, '0')),
                            React.createElement("span", { className: "card-see" },
                                "VER PLATO ",
                                React.createElement(Icon, { name: "arrow", size: 15 })),
                            React.createElement("span", { className: `card-effect card-effect-${item.effect}`, "aria-hidden": "true" })),
                        React.createElement("div", { className: "card-meta" },
                            React.createElement("span", null, item.tag),
                            React.createElement("h3", null, item.name),
                            React.createElement("p", null, item.description),
                            React.createElement("div", { className: "card-bottom" },
                                React.createElement("strong", null, currency(item.price)),
                                React.createElement("button", { onClick: () => this.add(item.id, 1, true), "aria-label": `Pedir ${item.name}` },
                                    React.createElement(Icon, { name: "plus", size: 18 }),
                                    " Pedir")))))),
                    React.createElement("p", { className: "price-note" },
                        "* Precios ilustrativos. Los videos son preparaciones reales de archivo, no grabaciones del negocio. Si falla la conexion, se muestra la foto del plato. ",
                        React.createElement("a", { href: "https://www.pexels.com/license/", target: "_blank", rel: "noopener noreferrer" }, "Licencia de medios."))),
                React.createElement("section", { className: "steps section-pad" },
                    React.createElement("div", { className: "section-label-row reveal" },
                        React.createElement("span", { className: "eyebrow" }, "04 / SIN COMPLICACIONES"),
                        React.createElement("span", null, "DEL ANTOJO AL PEDIDO")),
                    React.createElement("h2", { className: "steps-heading reveal" },
                        "ASI DE ",
                        React.createElement("em", null, "FACIL.")),
                    React.createElement("div", { className: "steps-grid" }, [['01', 'ELIGE TU PLATO', 'Recorre el menu, cambia de protagonista y descubre sus ingredientes.'], ['02', 'ARMA TU PEDIDO', 'Agrega lo que quieras y ajusta las cantidades en el carrito.'], ['03', 'CONFIRMA POR WHATSAPP', 'Revisa el resumen y consulta disponibilidad y domicilio directamente.']].map(x => React.createElement("div", { className: "step reveal", key: x[0] },
                        React.createElement("span", null, x[0]),
                        React.createElement("h3", null, x[1]),
                        React.createElement("p", null, x[2]),
                        React.createElement(Icon, { name: "arrow" }))))),
                React.createElement("section", { className: "location section-pad", id: "ubicacion" },
                    React.createElement("div", { className: "location-art" }),
                    React.createElement("div", { className: "location-copy reveal" },
                        React.createElement("span", { className: "eyebrow" }, "05 / ENCUENTRANOS"),
                        React.createElement("h2", null,
                            "EL SABOR",
                            React.createElement("br", null),
                            React.createElement("em", null, "TIENE CASA.")),
                        React.createElement("p", null, cfg.address || 'Direccion del negocio pendiente de configurar.'),
                        React.createElement("p", { className: "location-hours" }, cfg.hours || 'Horario pendiente de configurar.'),
                        React.createElement("div", { className: "location-actions" },
                            React.createElement("button", { className: "button button-primary", onClick: () => cfg.mapUrl ? window.open(cfg.mapUrl, '_blank', 'noopener,noreferrer') : this.notify('Agrega la ubicacion real en public/config.js para abrir el mapa.') },
                                React.createElement(Icon, { name: "pin" }),
                                " Como llegar ",
                                React.createElement(Icon, { name: "arrow" })),
                            React.createElement("button", { className: "button button-outline", onClick: () => this.whatsapp(false) },
                                React.createElement(Icon, { name: "phone" }),
                                " Escribir por WhatsApp")))),
                React.createElement("section", { className: "final-cta section-pad" },
                    React.createElement("span", { className: "eyebrow" }, "LA DECISION ES TUYA"),
                    React.createElement("h2", null,
                        "QUE NO SE QUEDE",
                        React.createElement("br", null),
                        React.createElement("em", null, "EN ANTOJO.")),
                    React.createElement("p", null, "Arma tu pedido y lleva tu hambre al siguiente nivel."),
                    React.createElement("button", { className: "button button-primary", onClick: () => this.setState({ drawer: true }) },
                        "Ver mi pedido (",
                        count,
                        ") ",
                        React.createElement(Icon, { name: "arrow" })),
                    React.createElement("div", { className: "cta-deco", "aria-hidden": "true" }, "Q."))),
            React.createElement("footer", { className: "footer" },
                React.createElement("a", { className: "footer-brand", href: "#inicio" },
                    "Q AREPOTA",
                    React.createElement("span", null, ".")),
                React.createElement("p", null, "Comida colombiana con actitud. Proyecto demostrativo."),
                React.createElement("div", null,
                    React.createElement("a", { href: "#inicio" }, "Inicio"),
                    React.createElement("a", { href: "#pedido" }, "Menu"),
                    React.createElement("a", { href: "#ubicacion" }, "Ubicacion")),
                React.createElement("small", null, "Q AREPOTA / PROTOTIPO 2026")),
            this.state.toast && React.createElement("div", { className: "toast", role: "status" },
                React.createElement(Icon, { name: "check", size: 17 }),
                this.state.toast),
            this.renderDrawer(),
            this.renderDetail());
    }
}


ReactDOM.render(React.createElement(App),document.getElementById("root"));
