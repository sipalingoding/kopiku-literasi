'use client';
import { useState, useEffect, useRef } from 'react';
import { Icon } from './Icons';
import { BookCard, Stars, Badge, Btn } from './UI';

const SORT_OPTS = [
  { value: 'default', label: 'Urutan Default', icon: 'list' },
  { value: 'rating',  label: 'Rating Tertinggi', icon: 'star' },
];

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = SORT_OPTS.find(o => o.value === value);

  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position:'relative', flexShrink:0 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 16px', borderRadius:10, border:`1.5px solid ${open ? 'var(--c-accent,#C17A2A)' : 'var(--c-border,#E0CEAD)'}`, background:'var(--c-card,#FFF)', color:'var(--c-text,#3A2212)', fontSize:14, fontWeight:600, cursor:'pointer', transition:'border .2s', minWidth:180, justifyContent:'space-between' }}>
        <span style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Icon name={current.icon} size={14} color="var(--c-accent,#C17A2A)"/>
          {current.label}
        </span>
        <span style={{ color:'#9B6347', fontSize:10, transform:open?'rotate(180deg)':'none', transition:'transform .2s' }}>▼</span>
      </button>
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 6px)', right:0, background:'var(--c-card,#FFFDF7)', borderRadius:12, boxShadow:'0 8px 32px rgba(58,26,10,0.14)', border:'1px solid var(--c-border,#E0CEAD)', zIndex:50, overflow:'hidden', minWidth:'100%' }}>
          {SORT_OPTS.map(o => (
            <button key={o.value} onClick={() => { onChange(o.value); setOpen(false); }}
              style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'11px 16px', border:'none', background: value===o.value ? 'var(--c-surface,#FBF5E6)' : 'transparent', color: value===o.value ? 'var(--c-accent,#C17A2A)' : 'var(--c-text,#3A2212)', fontWeight: value===o.value ? 700 : 500, fontSize:14, cursor:'pointer', transition:'background .15s', textAlign:'left' }}
              onMouseEnter={e => { if (value !== o.value) e.currentTarget.style.background = 'var(--c-surface,#FBF5E6)'; }}
              onMouseLeave={e => { if (value !== o.value) e.currentTarget.style.background = 'transparent'; }}>
              <Icon name={o.icon} size={14} color={value===o.value ? '#C17A2A' : '#9B6347'}/>
              {o.label}
              {value===o.value && <span style={{ marginLeft:'auto', color:'#C17A2A', fontSize:12 }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const CATEGORIES = ["Semua", "Novel", "Bisnis", "Ekonomi", "Politik", "Self-Help", "Sejarah", "Sains", "Filsafat"];

export function CatalogPage({ onNavigate, onBook, initialCategory }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState(initialCategory || 'Semua');
  const [sort, setSort] = useState('default');
  const [allBooks, setAllBooks] = useState([]);

  useEffect(() => {
    fetch('/api/books').then(r => r.json()).then(setAllBooks).catch(() => {});
  }, []);

  useEffect(() => { if (initialCategory) setCat(initialCategory); }, [initialCategory]);

  const filtered = allBooks
    .filter(b => (cat === 'Semua' || b.category === cat) && (b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => sort === 'rating' ? b.rating - a.rating : 0);

  return (
    <div className="kp-catalog-outer">
      <div className="kp-catalog-inner">
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:36, color:'var(--c-text,#3A2212)', margin:'0 0 8px', fontWeight:800 }}>Katalog Buku</h1>
          <p style={{ color:'#7A5A42', margin:0, fontSize:16 }}>{filtered.length} buku tersedia</p>
        </div>

        <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ flex:'1 1 260px', position:'relative' }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9B6347', display:'flex' }}><Icon name="search" size={16}/></span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari judul atau pengarang..."
              style={{ width:'100%', boxSizing:'border-box', padding:'12px 14px 12px 42px', borderRadius:10, border:'1.5px solid #E0CEAD', background:'var(--c-card,#FFF)', fontSize:15, color:'var(--c-text,#3A2212)', outline:'none' }}/>
          </div>
          <SortDropdown value={sort} onChange={setSort}/>
        </div>

        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:32 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding:'8px 18px', borderRadius:20, border:'1.5px solid', borderColor:cat===c?'var(--c-primary,#6B3A2A)':'#E0CEAD', background:cat===c?'var(--c-primary,#6B3A2A)':'#FFFDF7', color:cat===c?'#FBF5E6':'#3A2212', fontWeight:600, fontSize:13, cursor:'pointer', transition:'all .2s' }}>{c}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px', color:'#9B6347' }}>
            <div style={{ marginBottom:16 }}><Icon name="emptyBox" size={48}/></div>
            <div style={{ fontSize:18, fontWeight:600 }}>Buku tidak ditemukan</div>
            <div style={{ fontSize:14, marginTop:8 }}>Coba kata kunci atau kategori lain</div>
          </div>
        ) : (
          <div className="kp-catalog-grid">
            {filtered.map(b => <BookCard key={b.id} book={b} onClick={() => onNavigate('detail', b)} onBook={() => onBook(b)}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

export function BookDetailPage({ book, onNavigate, onBook, user }) {
  const [related, setRelated] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);

  useEffect(() => {
    if (!book) return;
    fetch('/api/books')
      .then(r => r.json())
      .then(books => setRelated(books.filter(b => b.category === book.category && b.id !== book.id).slice(0, 3)))
      .catch(() => {});
    fetch(`/api/bookings?bookId=${book.id}`)
      .then(r => r.json())
      .then(bookings => {
        const active = bookings.find(b => b.status === 'active');
        setActiveBooking(active || null);
      })
      .catch(() => {});
  }, [book]);

  if (!book) return null;
  const isBooked = !!activeBooking;
  const fmtLong = d => new Date(d).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' });

  return (
    <div className="kp-detail-outer">
      <div className="kp-detail-inner">
        <button onClick={() => onNavigate('catalog')} style={{ background:'none', border:'none', color:'#6B3A2A', fontSize:15, cursor:'pointer', marginBottom:24, display:'flex', alignItems:'center', gap:6, fontWeight:600 }}>
          <Icon name="arrowLeft" size={15}/> Kembali ke Katalog
        </button>

        <div className="kp-detail-card">
          <div className="kp-detail-cover">
            <div style={{ width:180, height:250, position:'relative', transform:'rotateY(-15deg) rotateX(5deg)', transformStyle:'preserve-3d', filter:'drop-shadow(8px 16px 24px rgba(0,0,0,0.3))' }}>
              <div style={{ position:'absolute', left:0, top:0, width:12, height:250, background:'linear-gradient(90deg,#3A1A0A,#5C2E0A)', borderRadius:'3px 0 0 3px' }}/>
              <div style={{ position:'absolute', left:12, top:0, width:168, height:250, background:`linear-gradient(145deg, ${book.color}, ${book.color}dd)`, borderRadius:'0 8px 8px 0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, padding:'20px 14px' }}>
                <div style={{ inset:8, position:'absolute', border:'1px solid rgba(255,255,255,0.2)', borderRadius:5 }}/>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#FFF', fontSize:15, fontWeight:700, textAlign:'center', lineHeight:1.4 }}>{book.title}</div>
                <div style={{ width:30, height:1, background:'rgba(255,255,255,0.4)' }}/>
                <div style={{ color:'rgba(255,255,255,0.75)', fontSize:11, textAlign:'center' }}>{book.author}</div>
              </div>
            </div>
          </div>

          <div style={{ flex:1, minWidth:280 }}>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
              <Badge>{book.category}</Badge>
              {isBooked ? <Badge type="danger">Sedang Dipinjam</Badge> : <Badge type="success">Tersedia</Badge>}
            </div>
            <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:30, color:'var(--c-text,#3A2212)', margin:'0 0 6px', lineHeight:1.3, fontWeight:800 }}>{book.title}</h1>
            <p style={{ color:'#7A5A42', fontSize:16, margin:'0 0 14px' }}>oleh <strong>{book.author}</strong></p>
            <div style={{ marginBottom:16 }}><Stars rating={book.rating}/></div>
            <p style={{ color:'var(--c-text,#5A3A28)', lineHeight:1.75, fontSize:15, margin:'0 0 24px' }}>{book.desc}</p>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px 24px', marginBottom:24 }}>
              {[['note','Halaman',book.pages+' hal'],['calendar','Tahun Terbit',book.year],['bookmark','Kategori',book.category],['star','Rating',`${book.rating} / 5`]].map(([icon,k,v]) => (
                <div key={k} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:'var(--c-surface,#FBF5E6)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-primary,#6B3A2A)', flexShrink:0 }}>
                    <Icon name={icon} size={16}/>
                  </div>
                  <div>
                    <div style={{ fontSize:11, color:'var(--c-text-muted,#9B6347)' }}>{k}</div>
                    <div style={{ fontSize:14, color:'var(--c-text,#3A2212)', fontWeight:700 }}>{v}</div>
                  </div>
                </div>
              ))}
            </div>

            {isBooked && (
              <div style={{ background:'rgba(178,34,34,0.08)', border:'1px solid rgba(178,34,34,0.3)', borderRadius:12, padding:'14px 18px', marginBottom:20, display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:42, height:42, borderRadius:10, background:'rgba(178,34,34,0.12)', display:'flex', alignItems:'center', justifyContent:'center', color:'#B22222', flexShrink:0 }}>
                  <Icon name="lock" size={20}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:14, fontWeight:800, color:'#B22222', marginBottom:2 }}>Buku sedang dipinjam</div>
                  <div style={{ fontSize:13, color:'#7A2A2A' }}>Tersedia kembali pada <strong>{fmtLong(activeBooking.returnDate)}</strong></div>
                </div>
              </div>
            )}

            <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap', paddingTop:16, borderTop:'1px solid var(--c-border,#E0CEAD)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:'rgba(46,125,82,0.12)', border:'1px solid rgba(46,125,82,0.3)', display:'flex', alignItems:'center', justifyContent:'center', color:'#2E7D52' }}>
                  <Icon name="checkCircle" size={22}/>
                </div>
                <div>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, color:'#2E7D52', fontSize:17 }}>Pinjam Gratis</div>
                  <div style={{ fontSize:12, color:'var(--c-text-muted,#9B6347)' }}>Tidak ada biaya peminjaman</div>
                </div>
              </div>
              {isBooked ? (
                <Btn disabled variant="ghost" style={{ marginLeft:'auto' }}>Tidak Tersedia</Btn>
              ) : (
                <button onClick={() => user ? onBook(book) : onNavigate('login')}
                  style={{ marginLeft:'auto', background:'var(--c-accent,#C17A2A)', color:'#FFF', border:'none', borderRadius:50, padding:'12px 28px', cursor:'pointer', fontWeight:700, fontSize:15, display:'flex', alignItems:'center', gap:8, transition:'all .2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  <Icon name={user ? 'calendar' : 'lock'} size={16} color="#FFF"/>
                  {user ? 'Booking Sekarang' : 'Masuk untuk Booking'}
                </button>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:24, color:'var(--c-text,#3A2212)', marginBottom:20, fontWeight:800 }}>Buku Sejenis</h2>
            <div className="kp-related-grid">
              {related.map(b => <BookCard key={b.id} book={b} onClick={() => onNavigate('detail', b)} onBook={() => onBook(b)}/>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
