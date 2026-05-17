'use client';
import { useState, useEffect } from 'react';
import { Icon } from './Icons';
import { AppData } from '@/lib/data';

export function Navbar({ user, onNavigate, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function toggleDark() {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('kopiku_dark', dark ? '1' : '0');
    setIsDark(dark);
  }

  return (
    <nav style={{
      padding: '0 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 68, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid #F0E6D0' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:9, cursor:'pointer', flexShrink:0 }} onClick={() => onNavigate('home')}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="3" y="4" width="18" height="25" rx="3" fill="#E8C07A"/>
          <rect x="6" y="7" width="12" height="19" rx="2" fill="#FFFDF7"/>
          <rect x="8" y="11" width="8" height="1.5" rx=".75" fill="#C17A2A"/>
          <rect x="8" y="15" width="6" height="1.5" rx=".75" fill="#C17A2A"/>
          <rect x="8" y="19" width="7" height="1.5" rx=".75" fill="#C17A2A"/>
          <rect x="21" y="5" width="8" height="23" rx="2" fill="#9B6347" opacity=".6"/>
        </svg>
        <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#3A2212', fontSize:18, fontWeight:700, letterSpacing:.3 }}>Kopiku Literasi</span>
      </div>

      <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', display:'flex', gap:32, alignItems:'center' }}>
        {[['home','Home'],['catalog','Katalog'],['about','Tentang']].map(([p,l]) => (
          <button key={p} className="nav-link" onClick={() => onNavigate(p)}>
            <span className="dot"/>{l}
          </button>
        ))}
      </div>

      <div style={{ display:'flex', gap:10, alignItems:'center', flexShrink:0 }}>
        <button onClick={toggleDark} title="Ganti tema"
          style={{ width:38, height:38, borderRadius:'50%', background:'rgba(107,58,42,0.08)', border:'1px solid rgba(107,58,42,0.18)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-text,#1A0A04)', transition:'all .2s' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(107,58,42,0.16)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(107,58,42,0.08)'}>
          <Icon name={isDark ? 'sun' : 'moon'} size={17}/>
        </button>
        {user ? (
          <div style={{ position:'relative' }}>
            <button className="avatar-btn" onClick={() => setMenuOpen(!menuOpen)}>
              <span style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#C17A2A,#8B4513)', display:'flex', alignItems:'center', justifyContent:'center', color:'#FFF', fontWeight:800, fontSize:12, flexShrink:0 }}>{user.name[0].toUpperCase()}</span>
              {user.name.split(' ')[0]}
              <span style={{ fontSize:9, color:'#9B6347', transform:menuOpen?'rotate(180deg)':'none', transition:'transform .2s' }}>▾</span>
            </button>
            {menuOpen && (
              <div style={{ position:'absolute', right:0, top:44, background:'#FFFDF7', borderRadius:14, boxShadow:'0 12px 40px rgba(58,26,10,0.15)', minWidth:190, overflow:'hidden', border:'1px solid #E8D8C0' }}>
                <div style={{ padding:'12px 18px 8px', borderBottom:'1px solid #F0E6D0' }}>
                  <div style={{ fontWeight:700, color:'#3A2212', fontSize:14 }}>{user.name}</div>
                  <div style={{ color:'#9B6347', fontSize:12 }}>{user.email}</div>
                </div>
                <button className="dropdown-item" onClick={() => { onNavigate('dashboard'); setMenuOpen(false); }} style={{ display:'flex', alignItems:'center', gap:10 }}><Icon name="layers" size={15}/> Dashboard Saya</button>
                {isAdmin && <button className="dropdown-item" onClick={() => { onNavigate('admin'); setMenuOpen(false); }} style={{ display:'flex', alignItems:'center', gap:10 }}><Icon name="settings" size={15}/> Panel Admin</button>}
                <div style={{ borderTop:'1px solid #F0E6D0' }}/>
                <button className="dropdown-item" onClick={() => { onLogout(); setMenuOpen(false); }} style={{ color:'#B22222', display:'flex', alignItems:'center', gap:10 }}><Icon name="logout" size={15}/> Keluar</button>
              </div>
            )}
          </div>
        ) : (
          <button className="masuk-btn" onClick={() => onNavigate('login')} style={{ display:'inline-flex', alignItems:'center', gap:6 }}>Masuk <Icon name="arrowRight" size={13}/></button>
        )}
      </div>
    </nav>
  );
}

export function BookCard({ book, onClick, onBook }) {
  const [hov, setHov] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);

  useEffect(() => {
    setActiveBooking(AppData.getActiveBookingForBook(book.id));
  }, [book.id]);

  const isBooked = !!activeBooking;
  const fmtShort = d => new Date(d).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });

  return (
    <div onClick={() => onClick(book)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:'var(--c-card,#FFFDF7)', borderRadius:14, overflow:'hidden', cursor:'pointer', boxShadow:hov?'0 12px 36px rgba(58,26,10,0.16)':'0 2px 10px rgba(58,26,10,0.08)', transition:'all .25s', transform:hov?'translateY(-4px)':'none', border:'1px solid #E0CEAD', opacity:isBooked?0.88:1 }}>
      <div style={{ height:180, background:book.color, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'20px 16px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:14, background:'rgba(0,0,0,0.25)' }}/>
        <div style={{ position:'absolute', left:14, top:0, bottom:0, width:4, background:'rgba(255,255,255,0.08)' }}/>
        <div style={{ background:'rgba(255,255,255,0.12)', borderRadius:8, padding:'12px 14px', textAlign:'center', backdropFilter:'blur(4px)', border:'1px solid rgba(255,255,255,0.18)' }}>
          <div style={{ color:'#FFF', fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:15, lineHeight:1.3, marginBottom:6, textShadow:'0 1px 4px rgba(0,0,0,0.3)' }}>{book.title}</div>
          <div style={{ color:'rgba(255,255,255,0.8)', fontSize:11, fontFamily:"'Nunito',sans-serif" }}>{book.author}</div>
        </div>
        {isBooked && (
          <div style={{ position:'absolute', top:10, right:10, background:'rgba(178,34,34,0.95)', color:'#FFF', borderRadius:20, padding:'4px 10px', fontSize:10, fontWeight:800, letterSpacing:.5, display:'flex', alignItems:'center', gap:4 }}>
            <Icon name="lock" size={10} color="#FFF"/> DIPINJAM
          </div>
        )}
      </div>
      <div style={{ padding:'12px 14px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
          <span style={{ background:'#F0E6D0', color:'#6B3A2A', borderRadius:10, padding:'2px 10px', fontSize:11, fontWeight:600 }}>{book.category}</span>
          <span style={{ color:'#C17A2A', fontSize:12, display:'flex', alignItems:'center', gap:3 }}>★ {book.rating}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10, gap:8 }}>
          {isBooked ? (
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:11, color:'#B22222', display:'flex', alignItems:'center', gap:4, marginBottom:2 }}>
                <Icon name="clock" size={11} color="#B22222"/> Dipinjam sampai
              </div>
              <div style={{ fontWeight:800, color:'#B22222', fontSize:13, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                {fmtShort(activeBooking.returnDate)}
              </div>
            </div>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:6, color:'#2E7D52' }}>
              <Icon name="checkCircle" size={14} color="#2E7D52"/>
              <span style={{ fontWeight:700, fontSize:13 }}>Tersedia</span>
            </div>
          )}
          {isBooked ? (
            <button disabled style={{ background:'#E8DCC4', color:'#9B6347', border:'none', borderRadius:8, padding:'7px 12px', cursor:'not-allowed', fontWeight:600, fontSize:12, opacity:.75, flexShrink:0 }}>Tidak Tersedia</button>
          ) : (
            <button onClick={e => { e.stopPropagation(); onBook(book); }}
              style={{ background:'var(--c-accent,#C17A2A)', color:'#FFF', border:'none', borderRadius:8, padding:'7px 14px', cursor:'pointer', fontWeight:600, fontSize:13, transition:'opacity .2s', display:'flex', alignItems:'center', gap:5, flexShrink:0 }}
              onMouseEnter={e=>e.target.style.opacity='.8'} onMouseLeave={e=>e.target.style.opacity='1'}>
              <Icon name="calendar" size={13} color="#FFF"/> Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function Stars({ rating }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => <span key={i} style={{ color:i<=Math.round(rating)?'#D4A843':'#DDD', fontSize:16 }}>★</span>)}
      <span style={{ marginLeft:6, fontSize:13, color:'#7A5A42' }}>{rating}/5</span>
    </span>
  );
}

export function Badge({ children, type='default' }) {
  const colors = { default:['#F0E6D0','#6B3A2A'], success:['#D4EDDA','#2E7D52'], warning:['#FFF3CD','#856404'], danger:['#F8D7DA','#B22222'], info:['#D1ECF1','#1D5A8A'] };
  const [bg, fg] = colors[type] || colors.default;
  return <span style={{ background:bg, color:fg, borderRadius:10, padding:'3px 12px', fontSize:12, fontWeight:600 }}>{children}</span>;
}

export function Modal({ open, onClose, title, children, wide }) {
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  if (!open) return null;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(58,26,10,0.55)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#FFFDF7', borderRadius:18, padding:32, width:'100%', maxWidth:wide?700:500, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 64px rgba(0,0,0,0.3)', position:'relative' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#3A2212', margin:0, fontSize:22, fontWeight:800 }}>{title}</h2>
          <button onClick={onClose} style={{ background:'#F0E6D0', border:'none', borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:16, color:'#6B3A2A', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Input({ label, type='text', value, onChange, placeholder, error, icon }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom:16 }}>
      {label && <label style={{ display:'block', marginBottom:6, fontWeight:600, color:'#3A2212', fontSize:14 }}>{label}</label>}
      <div style={{ position:'relative' }}>
        {icon && <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9B6347', fontSize:16, display:'flex' }}>{icon}</span>}
        <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
          onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
          style={{ width:'100%', boxSizing:'border-box', padding:icon?'12px 14px 12px 40px':'12px 14px', borderRadius:10, border:`1.5px solid ${error?'#B22222':focus?'#C17A2A':'#E0CEAD'}`, background:'var(--c-card,#FFFDF7)', fontSize:15, color:'var(--c-text,#3A2212)', outline:'none', transition:'border .2s' }}/>
      </div>
      {error && <div style={{ color:'#B22222', fontSize:12, marginTop:4 }}>{error}</div>}
    </div>
  );
}

export function Btn({ children, onClick, variant='primary', size='md', fullWidth, disabled, style: extra }) {
  const [hov, setHov] = useState(false);
  const base = { fontFamily:"'Nunito',sans-serif", fontWeight:700, border:'none', borderRadius:10, cursor:disabled?'not-allowed':'pointer', transition:'all .2s', opacity:disabled?0.6:1, width:fullWidth?'100%':'auto', ...extra };
  const sizes = { sm:{padding:'7px 16px',fontSize:13}, md:{padding:'11px 22px',fontSize:15}, lg:{padding:'14px 32px',fontSize:16} };
  const variants = {
    primary:{background:hov?'#9B6347':'var(--c-primary,#6B3A2A)',color:'#FFF'},
    accent:{background:hov?'#D4A843':'var(--c-accent,#C17A2A)',color:'#FFF'},
    outline:{background:'none',color:'#6B3A2A',border:'1.5px solid #C17A2A'},
    ghost:{background:hov?'#F0E6D0':'transparent',color:'#6B3A2A'},
    danger:{background:hov?'#8B1A1A':'#B22222',color:'#FFF'},
  };
  return (
    <button onClick={disabled?undefined:onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{...base,...sizes[size],...variants[variant]}}>{children}</button>
  );
}

export function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  const colors = { success:'#2E7D52', error:'#B22222', info:'#1D5A8A' };
  if (!msg) return null;
  return (
    <div style={{ position:'fixed', bottom:28, right:28, background:colors[type]||'#3A2212', color:'#FFF', padding:'14px 22px', borderRadius:12, fontSize:15, boxShadow:'0 8px 28px rgba(0,0,0,0.2)', zIndex:9999, display:'flex', alignItems:'center', gap:10, maxWidth:340 }}>
      <span>{type==='success'?'✓':type==='error'?'✕':'ℹ'}</span>
      <span>{msg}</span>
    </div>
  );
}

export function statusBadge(status) {
  const map = { pending:['warning','Menunggu'], confirmed:['info','Dikonfirmasi'], active:['success','Aktif'], returned:['default','Dikembalikan'], cancelled:['danger','Dibatalkan'] };
  const [type, label] = map[status] || ['default', status];
  return <Badge type={type}>{label}</Badge>;
}

export function SectionHeader({ title, sub, dark }) {
  return (
    <div style={{ textAlign:'center', marginBottom:40 }}>
      <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:32, color:dark?'#E8C07A':'#1A0A04', margin:'0 0 10px', fontWeight:800, letterSpacing:-0.5 }}>{title}</h2>
      <p style={{ color:dark?'rgba(251,245,230,.7)':'#7A5A42', fontSize:16, margin:0 }}>{sub}</p>
    </div>
  );
}
