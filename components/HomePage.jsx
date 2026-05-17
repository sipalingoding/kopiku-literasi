'use client';
import { useState, useEffect } from 'react';
import { Icon } from './Icons';
import { BookCard, SectionHeader } from './UI';
import { AppData } from '@/lib/data';

const PARTICLES = [
  {x:6,y:18,size:5,delay:0,dur:5,op:.14},{x:88,y:12,size:8,delay:1.2,dur:7,op:.1},
  {x:14,y:72,size:4,delay:.5,dur:4.5,op:.18},{x:92,y:62,size:7,delay:2,dur:6,op:.1},
  {x:50,y:90,size:4,delay:.8,dur:5.5,op:.13},{x:72,y:28,size:6,delay:1.6,dur:6.5,op:.09},
];

function Particle({x,y,size,delay,dur,op}) {
  return <div style={{position:'absolute',left:x+'%',top:y+'%',width:size,height:size,borderRadius:'50%',background:`rgba(193,122,42,${op})`,animation:`particleDrift ${dur}s ease-in-out ${delay}s infinite alternate`,pointerEvents:'none'}}/>;
}

function FloatCard({ style, children, delay=0 }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 2800+delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      position:'absolute',...style,
      background:'#FFFDF7',borderRadius:16,boxShadow:'0 8px 32px rgba(58,26,10,0.18)',
      border:'1px solid rgba(224,206,173,0.8)',backdropFilter:'blur(8px)',
      opacity:vis?1:0,transform:vis?'translateY(0) scale(1)':'translateY(12px) scale(.96)',
      transition:`all 0.7s cubic-bezier(.34,1.4,.64,1) ${delay}ms`,zIndex:10,
    }}>{children}</div>
  );
}

function VisualPanel({ onAnimDone }) {
  const books = AppData.getBooks();
  const [phase, setPhase] = useState('idle');
  const [hov, setHov] = useState(false);
  const [tilt, setTilt] = useState({x:0,y:0});
  const [pageFlip, setPageFlip] = useState(0);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('wobble'), 400);
    const t2 = setTimeout(() => setPhase('opening'), 1500);
    const t3 = setTimeout(() => setPhase('pages'), 2700);
    const t4 = setTimeout(() => { setPhase('done'); onAnimDone && onAnimDone(); }, 4400);
    return () => { [t1,t2,t3,t4].forEach(clearTimeout); };
  }, [replayKey]);

  useEffect(() => {
    if (phase !== 'pages') return;
    let i = 0;
    const interval = setInterval(() => { i++; setPageFlip(i); if (i >= 3) clearInterval(interval); }, 380);
    return () => clearInterval(interval);
  }, [phase]);

  function replay() { setPhase('idle'); setPageFlip(0); setReplayKey(k=>k+1); }

  function onMouseMove(e) {
    if (phase !== 'done') return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX-r.left)/r.width-0.5)*2;
    const y = ((e.clientY-r.top)/r.height-0.5)*2;
    setTilt({x:-y*8,y:x*12});
  }
  function onMouseLeave() { setHov(false); setTilt({x:0,y:0}); }

  const shelf = [
    {w:22,h:100,c:'#1B4332'},{w:28,h:118,c:'#44236A'},{w:18,h:88,c:'#6B1A1A'},
    {w:24,h:108,c:'#0D5C7A'},{w:20,h:95,c:'#4A3000'},{w:30,h:125,c:'#2A4A6A'},
    {w:16,h:80,c:'#1D3557'},{w:26,h:112,c:'#3A1A0A'},{w:22,h:98,c:'#5C4A1E'},
  ];

  const coverAnim = phase==='opening'||phase==='pages'||phase==='done'
    ? 'coverOpenSpring 1.8s cubic-bezier(.34,1.56,.64,1) forwards'
    : phase==='wobble' ? 'bookWobble 1.0s cubic-bezier(.36,.07,.19,.97)' : 'none';

  const finalTransform = phase==='done'
    ? `rotateX(${6+tilt.x}deg) rotateY(${tilt.y}deg) ${hov?'scale(1.04)':''}`
    : 'rotateX(6deg)';

  return (
    <div className="kp-hero-visual">
      <div style={{ position:'absolute', inset:0, borderRadius:24, overflow:'hidden', background:'#2A1008', boxShadow:'0 32px 80px rgba(42,16,8,0.22), 0 8px 24px rgba(42,16,8,0.12)' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 90% 70% at 50% 25%, #7B3520 0%, #4A1E08 55%, #1E0A02 100%)' }}/>
        <div style={{ position:'absolute', top:'15%', left:'50%', transform:'translateX(-50%)', width:260, height:260, background:'radial-gradient(circle, rgba(212,168,67,0.2) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none', animation:phase==='done'?'glowPulse 4s ease-in-out infinite':'none' }}/>

        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:160 }}>
          <div style={{ position:'absolute', bottom:80, left:-10, right:-10, height:12, background:'linear-gradient(180deg,#8B5E2A,#5C3A10)', borderRadius:2, boxShadow:'0 4px 12px rgba(0,0,0,0.4)' }}/>
          <div style={{ position:'absolute', bottom:92, left:20, display:'flex', gap:3, alignItems:'flex-end' }}>
            {shelf.map((b,i) => (
              <div key={i} style={{ width:b.w, height:b.h, background:`linear-gradient(180deg,${b.c}ee,${b.c})`, borderRadius:'2px 2px 0 0', position:'relative', flexShrink:0, boxShadow:'1px 0 4px rgba(0,0,0,0.3)' }}>
                <div style={{ position:'absolute', top:0, left:0, bottom:0, width:3, background:'rgba(0,0,0,0.25)' }}/>
                <div style={{ position:'absolute', top:10, left:4, right:4, height:1, background:'rgba(255,255,255,0.12)' }}/>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position:'absolute', top:'10%', left:'50%', transform:'translateX(-50%)', cursor:phase==='done'?'pointer':'default' }}
          onMouseEnter={()=>setHov(true)} onMouseLeave={onMouseLeave} onMouseMove={onMouseMove}
          onClick={()=>phase==='done'&&replay()}>
          <div style={{ perspective:'1600px' }}>
            <div key={replayKey} style={{ position:'relative', width:190, height:258, transformStyle:'preserve-3d', transform:finalTransform, animation:phase==='done'?'bookFloat 5s ease-in-out infinite':'none', transition:'transform .35s cubic-bezier(.34,1.4,.64,1)', filter:'drop-shadow(0 28px 44px rgba(0,0,0,0.55))' }}>
              {[6,4,2].map((o,i) => (
                <div key={'back'+i} style={{ position:'absolute', left:12+o, top:o/2, width:178-o, height:257, background:'linear-gradient(160deg,#FFF8F0,#F5ECD7)', borderRadius:'2px 10px 10px 2px', boxShadow:'inset -4px 0 10px rgba(0,0,0,0.07)', opacity:1-i*0.15, transformStyle:'preserve-3d' }}/>
              ))}

              <div style={{ position:'absolute', left:12, top:0, width:178, height:257, background:'linear-gradient(160deg,#FFFDF5,#F5ECD0)', borderRadius:'2px 10px 10px 2px', boxShadow:'inset -6px 0 14px rgba(0,0,0,0.08), inset 6px 0 18px rgba(0,0,0,0.04)', overflow:'hidden' }}>
                <div style={{ padding:'32px 22px', opacity:phase==='done'||phase==='pages'?1:0, transform:phase==='done'||phase==='pages'?'translateY(0)':'translateY(8px)', transition:'all .8s ease .2s' }}>
                  <div style={{ color:'#9B6347', fontSize:9, letterSpacing:3, textTransform:'uppercase', marginBottom:12, opacity:.7 }}>Bab Satu</div>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#4A2810', fontSize:14, fontWeight:800, lineHeight:1.4, marginBottom:14 }}>Selamat Datang di Kopiku</div>
                  <div style={{ width:28, height:1.5, background:'#C17A2A', marginBottom:14, borderRadius:1 }}/>
                  {[92,76,88,65,80,70,85].map((w,j) => <div key={j} style={{ height:1.5, background:'#E0CEAD', borderRadius:1, marginBottom:7, width:w+'%' }}/>)}
                </div>
              </div>

              {[0,1,2].map(idx => {
                const flipped = pageFlip>idx||phase==='done';
                const flipping = pageFlip===idx+1&&phase==='pages';
                return (
                  <div key={'flip'+idx} style={{ position:'absolute', left:12, top:0, width:178, height:257, transformOrigin:'left center', transform:flipped?'rotateY(-178deg)':'rotateY(0deg)', transition:'transform 0.8s cubic-bezier(.65,.05,.36,1)', transitionDelay:flipping?'0s':`${idx*0.05}s`, transformStyle:'preserve-3d', zIndex:pageFlip>idx?10-idx:5-idx, pointerEvents:'none' }}>
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,#FFFDF5,#FAF0DA)', borderRadius:'2px 10px 10px 2px', backfaceVisibility:'hidden', boxShadow:'inset -4px 0 10px rgba(0,0,0,0.06)', padding:'32px 22px' }}>
                      {idx===0&&(<><div style={{ color:'#9B6347', fontSize:9, letterSpacing:3, textTransform:'uppercase', marginBottom:14, opacity:.7 }}>Halaman Judul</div><div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#4A2810', fontSize:16, fontWeight:800, lineHeight:1.35, marginBottom:16 }}>Kopiku<br/>Literasi</div><div style={{ width:28, height:1.5, background:'#C17A2A', marginBottom:14, borderRadius:1 }}/><div style={{ fontFamily:"'Nunito',sans-serif", fontStyle:'italic', color:'#7A5A42', fontSize:11, lineHeight:1.6 }}>Perpustakaan pribadi untuk para pencinta buku.</div></>)}
                      {idx===1&&(<><div style={{ color:'#9B6347', fontSize:9, letterSpacing:3, textTransform:'uppercase', marginBottom:14, opacity:.7 }}>Daftar Isi</div>{['I. Cerita Kami','II. Koleksi','III. Booking','IV. Aturan'].map((t,j)=><div key={j} style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'#5A3A28', marginBottom:8, fontWeight:600 }}><span>{t}</span><span>{(j+1)*3}</span></div>)}</>)}
                      {idx===2&&(<><div style={{ color:'#9B6347', fontSize:9, letterSpacing:3, textTransform:'uppercase', marginBottom:12, opacity:.7 }}>Pendahuluan</div>{[85,70,90,78,82,65,75].map((w,j)=><div key={j} style={{ height:1.5, background:'#E0CEAD', borderRadius:1, marginBottom:7, width:w+'%' }}/>)}</>)}
                    </div>
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,#F5ECD7,#EBE0C0)', borderRadius:'10px 2px 2px 10px', backfaceVisibility:'hidden', transform:'rotateY(180deg)', boxShadow:'inset 4px 0 10px rgba(0,0,0,0.06)' }}/>
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg, rgba(0,0,0,0.18) 0%, transparent 50%)', opacity:flipping?1:0, transition:'opacity .4s', pointerEvents:'none', borderRadius:'2px 10px 10px 2px' }}/>
                  </div>
                );
              })}

              <div style={{ position:'absolute', left:0, top:0, width:14, height:258, background:'linear-gradient(90deg,#2A1008,#6B3A2A,#9B6347)', borderRadius:'4px 0 0 4px', boxShadow:'3px 0 8px rgba(0,0,0,0.4)', zIndex:20 }}/>
              <div style={{ position:'absolute', right:28, top:-16, width:16, height:52, background:'linear-gradient(180deg,#C17A2A,#8B4513)', clipPath:'polygon(0 0,100% 0,100% 78%,50% 100%,0 78%)', opacity:phase==='done'?1:0, transform:phase==='done'?'translateY(0)':'translateY(-12px)', transition:'all .8s cubic-bezier(.34,1.56,.64,1) .4s', boxShadow:'0 4px 8px rgba(0,0,0,0.25)', zIndex:25 }}/>

              <div style={{ position:'absolute', left:0, top:0, width:190, height:258, transformOrigin:'0 50%', animation:coverAnim, background:'linear-gradient(155deg,#A0522D,#7B3520,#5C2A10)', borderRadius:'4px 12px 12px 4px', backfaceVisibility:'hidden', zIndex:30 }}>
                <div style={{ position:'absolute', inset:0, borderRadius:'inherit', background:'repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)' }}/>
                <div style={{ position:'absolute', inset:0, borderRadius:'inherit', background:`linear-gradient(${135+tilt.y*2}deg, rgba(255,200,140,0.18) 0%, transparent 40%)`, transition:'background .4s', pointerEvents:'none' }}/>
                <div style={{ position:'absolute', inset:11, border:'1px solid rgba(232,192,122,0.4)', borderRadius:7 }}/>
                <div style={{ position:'absolute', inset:14, border:'1px solid rgba(232,192,122,0.15)', borderRadius:5 }}/>
                <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, padding:'0 18px' }}>
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                    <circle cx="22" cy="22" r="20" fill="rgba(232,192,122,0.12)" stroke="rgba(232,192,122,0.5)" strokeWidth="1.5"/>
                    <rect x="8" y="12" width="17" height="22" rx="2" fill="rgba(232,192,122,0.22)" stroke="rgba(232,192,122,0.7)" strokeWidth="1"/>
                    <rect x="11" y="16" width="11" height="1.5" rx=".75" fill="#E8C07A"/>
                    <rect x="11" y="20" width="8" height="1.5" rx=".75" fill="#E8C07A" opacity=".7"/>
                    <rect x="26" y="14" width="10" height="18" rx="2" fill="rgba(232,192,122,0.18)" stroke="rgba(232,192,122,0.5)" strokeWidth="1" opacity=".8"/>
                  </svg>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#E8C07A', fontSize:16, fontWeight:800, textAlign:'center', lineHeight:1.3, textShadow:'0 2px 6px rgba(0,0,0,0.4)' }}>Kopiku Literasi</div>
                  <div style={{ width:30, height:1, background:'linear-gradient(90deg,transparent,#E8C07A,transparent)' }}/>
                  <div style={{ color:'rgba(232,192,122,0.65)', fontSize:9, letterSpacing:2.5, textTransform:'uppercase' }}>Perpustakaan Pribadi</div>
                </div>
              </div>
            </div>
          </div>

          {phase==='done' && (
            <div style={{ textAlign:'center', marginTop:32, fontSize:11, color:'rgba(232,192,122,0.55)', letterSpacing:1.8, textTransform:'uppercase', fontWeight:600, opacity:hov?1:0.55, transition:'opacity .3s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <Icon name="spark" size={11} color="rgba(232,192,122,0.55)"/>
              Klik untuk buka ulang
            </div>
          )}
        </div>
      </div>

      <FloatCard style={{ top:90, right:24, width:210, padding:'14px 16px' }} delay={0}>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ width:38, height:52, background:books[4]?.color||'#6B1A1A', borderRadius:5, flexShrink:0, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:5, background:'rgba(0,0,0,0.3)' }}/>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:10, color:'#C17A2A', fontWeight:700, letterSpacing:1, textTransform:'uppercase', marginBottom:2 }}>
              <Icon name="star" size={10} color="#D4A843"/> Terpopuler
            </div>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#3A2212', fontSize:13, fontWeight:700, lineHeight:1.3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{books[4]?.title}</div>
            <div style={{ color:'#9B6347', fontSize:11 }}>{books[4]?.author}</div>
          </div>
        </div>
      </FloatCard>

      <FloatCard style={{ top:'38%', left:20, padding:'10px 16px' }} delay={150}>
        <div style={{ display:'flex', alignItems:'center', gap:7, color:'#C17A2A' }}>
          <Icon name="novel" size={15}/>
          <span style={{ fontWeight:700, color:'#3A2212', fontSize:13 }}>Novel Indonesia</span>
        </div>
      </FloatCard>

      <FloatCard style={{ top:'52%', right:24, padding:'10px 16px' }} delay={300}>
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <Icon name="star" size={14} color="#D4A843"/>
          <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, color:'#3A2212', fontSize:16 }}>4.8</span>
          <span style={{ color:'#9B6347', fontSize:11 }}>Rating</span>
        </div>
      </FloatCard>

      <FloatCard style={{ bottom:60, left:28, right:28, padding:'14px 18px' }} delay={450}>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ width:36, height:50, background:books[0]?.color||'#7B3F20', borderRadius:4, flexShrink:0, position:'relative' }}>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:5, background:'rgba(0,0,0,0.3)', borderRadius:'3px 0 0 3px' }}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#3A2212', fontSize:13, fontWeight:700 }}>{books[0]?.title}</div>
            <div style={{ color:'#7A5A42', fontSize:11, marginBottom:6 }}>{books[0]?.author}</div>
            <div style={{ display:'flex', gap:6, alignItems:'center' }}>
              <span style={{ background:'#D4EDDA', color:'#2E7D52', borderRadius:8, padding:'2px 8px', fontSize:10, fontWeight:700, display:'inline-flex', alignItems:'center', gap:3 }}>
                <Icon name="checkCircle" size={10} color="#2E7D52"/> Tersedia
              </span>
              <span style={{ background:'rgba(193,122,42,0.12)', color:'#C17A2A', borderRadius:8, padding:'2px 8px', fontSize:10, fontWeight:700, display:'inline-flex', alignItems:'center', gap:3 }}>
                <Icon name="calendar" size={10}/> Gratis
              </span>
            </div>
          </div>
        </div>
      </FloatCard>
    </div>
  );
}

export function HomePage({ onNavigate, onBook, user }) {
  const [animDone, setAnimDone] = useState(false);
  const [vis, setVis] = useState({});
  const books = AppData.getBooks();
  const featured = books.slice(0,4);
  const categories = AppData.CATEGORIES.filter(c=>c!=='Semua');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setVis(p=>({...p,[e.target.dataset.section]:true})); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('[data-section]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background:'var(--c-bg,#FFFFFF)', minHeight:'100vh', overflowX:'hidden' }}>
      <section className="kp-hero">
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
          {PARTICLES.map((p,i) => <Particle key={i} {...p}/>)}
        </div>

        <div className="kp-hero-text">
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:22, fontSize:12, color:'var(--c-accent,#C17A2A)', fontWeight:700, letterSpacing:2, textTransform:'uppercase', padding:'7px 16px', background:'rgba(193,122,42,0.1)', borderRadius:30, border:'1px solid rgba(193,122,42,0.25)', width:'fit-content' }}>
            <Icon name="feather" size={14}/> Perpustakaan Pribadi
          </div>

          <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'clamp(36px,4.2vw,58px)', color:'var(--c-text,#1A0A04)', margin:'0 0 20px', lineHeight:1.1, fontWeight:800, letterSpacing:-1 }}>
            Temukan Buku<br/>
            <span style={{ color:'var(--c-accent,#C17A2A)' }}>Favoritmu</span><br/>
            di Rak Kami
          </h1>

          <p style={{ fontSize:16, color:'#7A5A42', lineHeight:1.75, margin:'0 0 36px', maxWidth:400 }}>
            Perpustakaan pribadi dengan koleksi buku pilihan. Pinjam <strong>gratis</strong>, baca, dan kembalikan tepat waktu — semudah menyeduh kopi pagi.
          </p>

          <div className="kp-hero-stats">
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:'var(--c-surface,#FBF5E6)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-primary,#6B3A2A)', border:'1px solid var(--c-border,#E8D8C0)' }}>
                <Icon name="bookStack" size={22}/>
              </div>
              <div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, color:'var(--c-text,#2A1008)', fontSize:26, lineHeight:1 }}>{books.length}+</div>
                <div style={{ color:'var(--c-text-muted,#9B6347)', fontSize:12, marginTop:4 }}>Koleksi Buku</div>
              </div>
            </div>
            <div style={{ width:1, height:40, background:'var(--c-border,#E0CEAD)' }}/>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:'var(--c-surface,#FBF5E6)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-primary,#6B3A2A)', border:'1px solid var(--c-border,#E8D8C0)' }}>
                <Icon name="bookmark" size={22}/>
              </div>
              <div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, color:'var(--c-text,#2A1008)', fontSize:26, lineHeight:1 }}>{AppData.CATEGORIES.length-1}</div>
                <div style={{ color:'#9B6347', fontSize:12, marginTop:2 }}>Kategori</div>
              </div>
            </div>
          </div>

          <div className="kp-hero-cta">
            <button onClick={() => onNavigate('catalog')}
              style={{ background:'var(--c-primary,#6B3A2A)', color:'#FBF5E6', border:'none', borderRadius:50, padding:'14px 32px', cursor:'pointer', fontWeight:700, fontSize:15, transition:'all .3s', boxShadow:'0 4px 20px rgba(107,58,42,0.28)' }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(107,58,42,0.4)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 20px rgba(107,58,42,0.28)'; }}>
              Jelajahi Koleksi
            </button>
            {!user && (
              <button onClick={() => onNavigate('register')}
                style={{ background:'transparent', color:'#6B3A2A', border:'1.5px solid #C17A2A', borderRadius:50, padding:'14px 32px', cursor:'pointer', fontWeight:700, fontSize:15, transition:'all .3s' }}
                onMouseEnter={e=>{ e.currentTarget.style.background='var(--c-primary,#6B3A2A)'; e.currentTarget.style.color='#FBF5E6'; e.currentTarget.style.borderColor='var(--c-primary,#6B3A2A)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#6B3A2A'; e.currentTarget.style.borderColor='#C17A2A'; }}>
                Daftar Gratis
              </button>
            )}
          </div>
        </div>

        <VisualPanel onAnimDone={() => setAnimDone(true)}/>
      </section>

      <div className="kp-strip">
        {[['bookOpen','Koleksi Buku Pilihan','Diseleksi dengan teliti untuk pengalaman baca terbaik'],['calendar','Booking Mudah & Gratis','Atur jadwal pinjam dengan kalender, tanpa biaya peminjaman']].map(([icon,title,desc],i) => (
          <span key={title} style={{ display:'contents' }}>
            {i>0&&<div style={{ width:1, height:48, background:'var(--c-border,#E0CEAD)', margin:'0 48px' }}/>}
            <div style={{ display:'flex', alignItems:'center', gap:16, flex:1, minWidth:220 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'var(--c-card,#FFF)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'var(--c-primary,#6B3A2A)', border:'1px solid var(--c-border,#E0CEAD)' }}>
                <Icon name={icon} size={20}/>
              </div>
              <div>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, color:'var(--c-text,#2A1008)', fontSize:14 }}>{title}</div>
                <div style={{ color:'var(--c-text-muted,#9B6347)', fontSize:13, marginTop:2 }}>{desc}</div>
              </div>
            </div>
          </span>
        ))}
      </div>

      <section data-section="cats" className="kp-section">
        <SectionHeader title="Jelajahi Kategori" sub="Temukan buku berdasarkan minat membacamu"/>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
          {categories.map((cat,i) => {
            const icons = { Novel:'novel', Bisnis:'business', Ekonomi:'economy', Politik:'politics', 'Self-Help':'selfHelp', Sejarah:'history', Sains:'science', Filsafat:'philosophy' };
            return (
              <button key={cat} onClick={() => onNavigate('catalog',cat)}
                style={{ display:'flex', alignItems:'center', gap:10, background:'var(--c-card,#FFF)', border:'1.5px solid var(--c-border,#E0CEAD)', borderRadius:40, padding:'11px 22px', cursor:'pointer', fontWeight:600, color:'var(--c-text,#3A2212)', fontSize:14, transition:'all .28s cubic-bezier(.34,1.56,.64,1)', boxShadow:'0 2px 10px rgba(58,26,10,0.05)', opacity:vis.cats?1:0, transform:vis.cats?'translateY(0) scale(1)':'translateY(16px) scale(.96)', transitionDelay:`${i*.06}s` }}
                onMouseEnter={e=>{ e.currentTarget.style.background='var(--c-primary,#6B3A2A)'; e.currentTarget.style.color='#FBF5E6'; e.currentTarget.style.borderColor='var(--c-primary,#6B3A2A)'; e.currentTarget.style.transform='translateY(-3px) scale(1.04)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.background='var(--c-card,#FFF)'; e.currentTarget.style.color='var(--c-text,#3A2212)'; e.currentTarget.style.borderColor='var(--c-border,#E0CEAD)'; e.currentTarget.style.transform='translateY(0) scale(1)'; }}>
                <Icon name={icons[cat]||'book'} size={17}/>{cat}
              </button>
            );
          })}
        </div>
      </section>

      <section data-section="featured" className="kp-section-featured">
        <SectionHeader title="Koleksi Unggulan" sub="Buku-buku pilihan yang paling banyak diminati"/>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:24 }}>
          {featured.map((b,i) => (
            <div key={b.id} style={{ opacity:vis.featured?1:0, transform:vis.featured?'translateY(0)':'translateY(28px)', transition:`all .55s ease ${i*.1}s` }}>
              <BookCard book={b} onClick={() => onNavigate('detail',b)} onBook={() => onBook(b)}/>
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center', marginTop:40 }}>
          <button onClick={() => onNavigate('catalog')}
            style={{ background:'none', border:'1.5px solid #C17A2A', color:'#6B3A2A', borderRadius:40, padding:'12px 32px', cursor:'pointer', fontWeight:700, fontSize:15, transition:'all .28s' }}
            onMouseEnter={e=>{ e.currentTarget.style.background='var(--c-primary,#6B3A2A)'; e.currentTarget.style.color='#FBF5E6'; e.currentTarget.style.borderColor='var(--c-primary,#6B3A2A)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.background='none'; e.currentTarget.style.color='#6B3A2A'; e.currentTarget.style.borderColor='#C17A2A'; }}>
            Lihat Semua Buku →
          </button>
        </div>
      </section>

      <section data-section="how" className="kp-section-dark">
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 80% at 50% 50%,rgba(193,122,42,.08) 0%,transparent 70%)', pointerEvents:'none' }}/>
        <SectionHeader title="Cara Kerja" sub="Mudah dan cepat, seperti menyeduh kopi pagi" dark/>
        <div style={{ display:'flex', gap:40, justifyContent:'center', flexWrap:'wrap', maxWidth:960, margin:'0 auto', position:'relative' }}>
          {[['search','Pilih Buku','Jelajahi koleksi dan temukan buku yang ingin kamu baca'],['calendar','Atur Jadwal Pinjam','Pilih tanggal mulai dan lama pinjam lewat kalender booking'],['mailOpen','Ambil & Nikmati','Ambil buku dan nikmati bacaanmu. Kembalikan tepat waktu!']].map(([icon,title,desc],i) => (
            <div key={title} style={{ textAlign:'center', maxWidth:250, flex:'1 1 200px', opacity:vis.how?1:0, transform:vis.how?'translateY(0)':'translateY(24px)', transition:`all .6s ease ${i*.15}s` }}>
              <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(232,192,122,.1)', border:'1.5px solid rgba(232,192,122,.35)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', color:'#E8C07A', transition:'all .35s' }}
                onMouseEnter={e=>{ e.currentTarget.style.background='rgba(232,192,122,.2)'; e.currentTarget.style.transform='scale(1.1) rotate(-5deg)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.background='rgba(232,192,122,.1)'; e.currentTarget.style.transform='none'; }}>
                <Icon name={icon} size={28}/>
              </div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#E8C07A', fontSize:19, fontWeight:800, marginBottom:10 }}>{title}</div>
              <div style={{ color:'rgba(251,245,230,.7)', fontSize:14, lineHeight:1.7 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="kp-footer">
        © 2025 Kopiku Literasi — Perpustakaan Pribadi
      </footer>
    </div>
  );
}
