'use client';
import { useState, useEffect } from 'react';
import { Icon } from './Icons';
import { Badge, Modal, Input, Btn, Toast, statusBadge } from './UI';

const CATEGORIES = ["Novel", "Bisnis", "Ekonomi", "Politik", "Self-Help", "Sejarah", "Sains", "Filsafat"];
const fmtDate = d => new Date(d).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });

function BookingCard({ booking: b, onCancel }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    setLoading(true);
    await onCancel(b.id);
    setLoading(false);
    setConfirming(false);
  }

  return (
    <div style={{ background:'var(--c-card,#FFFDF7)', borderRadius:14, padding:'20px 24px', border:'1px solid #E0CEAD', boxShadow:'0 2px 8px rgba(58,26,10,0.06)', display:'flex', gap:18, flexWrap:'wrap', alignItems:'center' }}>
      <div style={{ width:48, height:66, background:b.book?.color||'#6B3A2A', borderRadius:5, flexShrink:0, position:'relative' }}>
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:7, background:'rgba(0,0,0,0.3)', borderRadius:'4px 0 0 4px' }}/>
      </div>
      <div style={{ flex:1, minWidth:180 }}>
        <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, color:'var(--c-text,#3A2212)', fontSize:16, marginBottom:2 }}>{b.book?.title}</div>
        <div style={{ color:'#7A5A42', fontSize:13 }}>{b.book?.author} • {b.durationLabel}</div>
        <div style={{ color:'#9B6347', fontSize:12, marginTop:4 }}>
          Ambil: {fmtDate(b.pickupDate)} → Kembali: {fmtDate(b.returnDate)}
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10 }}>
        <div>{statusBadge(b.status)}</div>
        {b.status === 'cancelled' && b.cancelReason && (
          <div style={{ fontSize:11, color:'#B22222', background:'rgba(178,34,34,0.07)', border:'1px solid rgba(178,34,34,0.2)', borderRadius:8, padding:'5px 10px', maxWidth:220, textAlign:'right', lineHeight:1.4 }}>
            {b.cancelReason}
          </div>
        )}
        {b.status === 'pending' && (
          confirming ? (
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <span style={{ fontSize:12, color:'#7A5A42' }}>Yakin batalkan?</span>
              <button onClick={handleCancel} disabled={loading}
                style={{ padding:'5px 12px', borderRadius:8, border:'none', background:'#B22222', color:'#FFF', fontWeight:700, fontSize:12, cursor:'pointer' }}>
                {loading ? '...' : 'Ya'}
              </button>
              <button onClick={() => setConfirming(false)}
                style={{ padding:'5px 12px', borderRadius:8, border:'1px solid #E0CEAD', background:'transparent', color:'#7A5A42', fontWeight:700, fontSize:12, cursor:'pointer' }}>
                Tidak
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirming(true)}
              style={{ padding:'6px 14px', borderRadius:8, border:'1px solid #E0CEAD', background:'transparent', color:'#B22222', fontWeight:700, fontSize:12, cursor:'pointer' }}>
              Batalkan
            </button>
          )
        )}
      </div>
    </div>
  );
}

export function DashboardPage({ user, onNavigate }) {
  const [tab, setTab] = useState('active');
  const [bookings, setBookings] = useState([]);

  function loadBookings() {
    fetch('/api/bookings').then(r => r.json()).then(setBookings).catch(() => {});
  }

  useEffect(() => { loadBookings(); }, [user]);

  async function cancelBooking(id) {
    await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    });
    loadBookings();
  }

  const filtered = bookings.filter(b =>
    tab==='active' ? ['pending','active'].includes(b.status) :
    tab==='history' ? ['returned','cancelled'].includes(b.status) : true
  );

  return (
    <div className="kp-page">
      <div className="kp-page-inner">
        <div style={{ display:'flex', gap:20, alignItems:'center', marginBottom:36, flexWrap:'wrap' }}>
          <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--c-primary,#6B3A2A)', display:'flex', alignItems:'center', justifyContent:'center', color:'#E8C07A', fontSize:26, fontWeight:700, flexShrink:0 }}>
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, color:'var(--c-text,#3A2212)', margin:'0 0 4px', fontWeight:800, display:'flex', alignItems:'center', gap:10 }}>
              Halo, {user.name.split(' ')[0]}!
              <span style={{ color:'#C17A2A' }}><Icon name="wave" size={26}/></span>
            </h1>
            <p style={{ color:'#7A5A42', margin:0 }}>{user.email}</p>
          </div>
        </div>

        <div className="kp-stats-grid">
          {[['hourglass',bookings.filter(b=>b.status==='pending').length,'Menunggu','#C17A2A'],['bookOpen',bookings.filter(b=>b.status==='active').length,'Dipinjam','#6B3A2A'],['checkCircle',bookings.filter(b=>b.status==='returned').length,'Sudah Dikembalikan','#2E7D52']].map(([icon,val,label,color]) => (
            <div key={label} style={{ background:'var(--c-card,#FFFDF7)', borderRadius:14, padding:'20px 22px', border:'1px solid var(--c-border,#E0CEAD)', boxShadow:'0 2px 10px rgba(58,26,10,0.07)' }}>
              <div style={{ width:40, height:40, borderRadius:10, background:'var(--c-surface,#FBF5E6)', display:'flex', alignItems:'center', justifyContent:'center', color, marginBottom:12 }}><Icon name={icon} size={20}/></div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, fontWeight:800, color:'var(--c-text,#3A2212)' }}>{val}</div>
              <div style={{ fontSize:13, color:'var(--c-text-muted,#9B6347)' }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:4, marginBottom:24, background:'#F0E6D0', borderRadius:10, padding:4, width:'fit-content' }}>
          {[['active','Aktif'],['history','Riwayat'],['all','Semua']].map(([v,l]) => (
            <button key={v} onClick={() => setTab(v)}
              style={{ padding:'8px 20px', borderRadius:8, border:'none', background:tab===v?'var(--c-card,#FFFDF7)':'transparent', color:tab===v?'var(--c-text,#3A2212)':'#7A5A42', fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:tab===v?'0 1px 4px rgba(0,0,0,0.1)':'none', transition:'all .2s' }}>{l}</button>
          ))}
        </div>

        {filtered.length===0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--c-text-muted,#9B6347)' }}>
            <div style={{ marginBottom:12 }}><Icon name="emptyBox" size={48}/></div>
            <div style={{ fontSize:17, fontWeight:600 }}>Belum ada booking</div>
            <div style={{ fontSize:14, marginTop:8, marginBottom:20 }}>Yuk mulai pinjam buku pertamamu!</div>
            <Btn onClick={() => onNavigate('catalog')} variant="accent">Jelajahi Katalog</Btn>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {filtered.map(b => <BookingCard key={b.id} booking={b} onCancel={cancelBooking}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminPage({ onNavigate }) {
  const [books, setBooks] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('books');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title:'', author:'', category:'Novel', pages:'200', year:'2024', desc:'', color:'#6B3A2A' });
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { refreshData(); }, []);

  async function refreshData() {
    const [books, bookings] = await Promise.all([
      fetch('/api/books').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/bookings').then(r => r.ok ? r.json() : []).catch(() => []),
    ]);
    setBooks(Array.isArray(books) ? books : []);
    setBookings(Array.isArray(bookings) ? bookings : []);
  }

  function openAdd() { setForm({ title:'', author:'', category:'Novel', pages:'200', year:'2024', desc:'', color:'#6B3A2A' }); setModal('add'); }
  function openEdit(b) { setForm({ title:b.title, author:b.author, category:b.category, pages:String(b.pages), year:String(b.year), desc:b.desc, color:b.color, id:b.id }); setModal('edit'); }

  async function saveBook() {
    setSaving(true);
    if (modal==='add') {
      await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, pages: +form.pages, year: +form.year, rating: 4.5 }),
      });
      setToast({ msg:'Buku berhasil ditambahkan!', type:'success' });
    } else {
      await fetch(`/api/books/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, pages: +form.pages, year: +form.year, rating: 4.5 }),
      });
      setToast({ msg:'Buku berhasil diupdate!', type:'success' });
    }
    setSaving(false);
    setModal(null);
    refreshData();
  }

  async function deleteBook(id) {
    if (!confirm('Hapus buku ini?')) return;
    await fetch(`/api/books/${id}`, { method: 'DELETE' });
    refreshData();
    setToast({ msg:'Buku dihapus.', type:'success' });
  }

  async function updateStatus(id, status) {
    await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    refreshData();
  }

  function isBookActive(bookId) {
    return bookings.some(b => b.bookId === bookId && b.status === 'active');
  }

  const f = (k, v) => setForm(p => ({...p, [k]:v}));

  return (
    <div className="kp-page">
      <div className="kp-page-inner-wide">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32, flexWrap:'wrap', gap:12 }}>
          <div>
            <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:30, color:'var(--c-text,#3A2212)', margin:'0 0 4px', fontWeight:800 }}>Panel Admin</h1>
            <p style={{ color:'#7A5A42', margin:0 }}>Kelola koleksi dan transaksi perpustakaan</p>
          </div>
        </div>

        <div style={{ display:'flex', gap:4, marginBottom:28, background:'#F0E6D0', borderRadius:10, padding:4, width:'fit-content' }}>
          {[['books',`Koleksi (${books.length})`,'bookStack'],['bookings',`Booking (${bookings.length})`,'list']].map(([v,l,iconName]) => (
            <button key={v} onClick={() => setTab(v)}
              style={{ padding:'8px 18px', borderRadius:8, border:'none', background:tab===v?'var(--c-card,#FFFDF7)':'transparent', color:tab===v?'var(--c-text,#3A2212)':'#7A5A42', fontWeight:700, fontSize:14, cursor:'pointer', transition:'all .2s', display:'flex', alignItems:'center', gap:8 }}>
              <Icon name={iconName} size={15}/> {l}
            </button>
          ))}
        </div>

        {tab==='books' && (
          <>
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
              <Btn onClick={openAdd} variant="accent">+ Tambah Buku</Btn>
            </div>
            <div className="kp-table-scroll" style={{ borderRadius:14, border:'1px solid #E0CEAD' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', background:'var(--c-card,#FFFDF7)', minWidth:560 }}>
                <thead>
                  <tr style={{ background:'#F0E6D0' }}>
                    {['Buku','Kategori','Status','Rating','Aksi'].map(h => (
                      <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:13, fontWeight:700, color:'#6B3A2A' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {books.map((b,i) => (
                    <tr key={b.id} style={{ borderTop:'1px solid #F0E6D0', background:i%2===0?'var(--c-card,#FFFDF7)':'var(--c-surface,#FDFAF4)' }}>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:32, height:44, background:b.color, borderRadius:3, flexShrink:0 }}/>
                          <div>
                            <div style={{ fontWeight:700, color:'var(--c-text,#3A2212)', fontSize:14 }}>{b.title}</div>
                            <div style={{ color:'#9B6347', fontSize:12 }}>{b.author}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px' }}><Badge>{b.category}</Badge></td>
                      <td style={{ padding:'12px 16px' }}>{isBookActive(b.id)?<Badge type="danger">Dipinjam</Badge>:<Badge type="success">Tersedia</Badge>}</td>
                      <td style={{ padding:'12px 16px', color:'#D4A843' }}><Icon name="star" size={13} color="#D4A843"/> {b.rating}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', gap:8 }}>
                          <Btn onClick={() => openEdit(b)} variant="ghost" size="sm">Edit</Btn>
                          <Btn onClick={() => deleteBook(b.id)} variant="danger" size="sm">Hapus</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab==='bookings' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {bookings.length===0 ? (
              <div style={{ textAlign:'center', padding:60, color:'#9B6347' }}>Belum ada booking masuk.</div>
            ) : bookings.map(b => (
              <div key={b.id} style={{ background:'var(--c-card,#FFFDF7)', borderRadius:12, padding:'18px 22px', border:'1px solid #E0CEAD', display:'flex', gap:16, flexWrap:'wrap', alignItems:'center' }}>
                <div style={{ flex:1, minWidth:200 }}>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, color:'var(--c-text,#3A2212)', fontSize:15 }}>{b.book?.title}</div>
                  <div style={{ color:'#7A5A42', fontSize:13 }}>{b.userName} • {b.durationLabel}</div>
                  <div style={{ color:'#9B6347', fontSize:12, marginTop:2 }}>
                    {fmtDate(b.pickupDate)} → {fmtDate(b.returnDate)}
                  </div>
                  {b.note && <div style={{ fontSize:12, color:'#7A5A42', marginTop:4, fontStyle:'italic' }}>"{b.note}"</div>}
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
                  {statusBadge(b.status)}
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'flex-end' }}>
                    {b.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(b.id, 'active')}
                          style={{ padding:'7px 14px', borderRadius:8, border:'none', background:'#2E7D52', color:'#FFF', fontWeight:700, fontSize:12, cursor:'pointer' }}>
                          ✓ Dipinjam
                        </button>
                        <button onClick={() => updateStatus(b.id, 'cancelled')}
                          style={{ padding:'7px 14px', borderRadius:8, border:'1px solid #E0CEAD', background:'transparent', color:'#B22222', fontWeight:700, fontSize:12, cursor:'pointer' }}>
                          ✕ Batalkan
                        </button>
                      </>
                    )}
                    {b.status === 'active' && (
                      <button onClick={() => updateStatus(b.id, 'returned')}
                        style={{ padding:'7px 14px', borderRadius:8, border:'none', background:'#6B3A2A', color:'#FFF', fontWeight:700, fontSize:12, cursor:'pointer' }}>
                        ✓ Selesai Dikembalikan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal==='add'?'Tambah Buku':'Edit Buku'} wide>
        <div className="kp-modal-grid">
          <Input label="Judul Buku" value={form.title} onChange={v => f('title', v)} placeholder="Judul buku"/>
          <Input label="Pengarang" value={form.author} onChange={v => f('author', v)} placeholder="Nama pengarang"/>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontWeight:600, color:'var(--c-text,#3A2212)', fontSize:14, marginBottom:6 }}>Kategori</label>
            <select value={form.category} onChange={e => f('category', e.target.value)}
              style={{ width:'100%', padding:'12px 14px', borderRadius:10, border:'1.5px solid #E0CEAD', background:'var(--c-card,#FFFDF7)', fontSize:15, color:'var(--c-text,#3A2212)', outline:'none' }}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Jumlah Halaman" type="number" value={form.pages} onChange={v => f('pages', v)} placeholder="200"/>
          <Input label="Tahun Terbit" type="number" value={form.year} onChange={v => f('year', v)} placeholder="2024"/>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontWeight:600, color:'var(--c-text,#3A2212)', fontSize:14, marginBottom:6 }}>Warna Cover</label>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <input type="color" value={form.color} onChange={e => f('color', e.target.value)} style={{ width:48, height:40, borderRadius:8, border:'1.5px solid #E0CEAD', cursor:'pointer', padding:2 }}/>
              <span style={{ fontSize:13, color:'#7A5A42' }}>{form.color}</span>
            </div>
          </div>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ display:'block', fontWeight:600, color:'var(--c-text,#3A2212)', fontSize:14, marginBottom:6 }}>Deskripsi</label>
          <textarea value={form.desc} onChange={e => f('desc', e.target.value)} rows={3} placeholder="Deskripsi singkat buku..."
            style={{ width:'100%', boxSizing:'border-box', padding:'12px 14px', borderRadius:10, border:'1.5px solid #E0CEAD', background:'var(--c-card,#FFFDF7)', fontSize:14, color:'var(--c-text,#3A2212)', outline:'none', resize:'vertical' }}/>
        </div>
        <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
          <Btn onClick={() => setModal(null)} variant="ghost">Batal</Btn>
          <Btn onClick={saveBook} variant="accent" disabled={saving}>{saving?'Menyimpan...':(modal==='add'?'Tambah Buku':'Simpan Perubahan')}</Btn>
        </div>
      </Modal>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}
    </div>
  );
}

export function AboutPage({ onNavigate }) {
  return (
    <div style={{ background:'var(--c-bg,#FFFFFF)', minHeight:'100vh' }}>
      <div className="kp-about-inner">
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" style={{ marginBottom:16 }}>
            <rect x="8" y="10" width="42" height="54" rx="4" fill="#E8C07A"/>
            <rect x="12" y="14" width="34" height="46" rx="3" fill="#FFFDF7"/>
            <rect x="18" y="26" width="22" height="3" rx="1.5" fill="#C17A2A"/>
            <rect x="18" y="33" width="18" height="3" rx="1.5" fill="#C17A2A"/>
            <rect x="18" y="40" width="20" height="3" rx="1.5" fill="#C17A2A"/>
            <rect x="50" y="16" width="14" height="42" rx="3" fill="#9B6347" opacity=".7"/>
          </svg>
          <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:40, color:'var(--c-text,#3A2212)', margin:'0 0 12px', fontWeight:800 }}>Kopiku Literasi</h1>
          <p style={{ color:'#7A5A42', fontSize:18, fontStyle:'italic' }}>&ldquo;Membaca adalah cara terbaik untuk berkeliling dunia tanpa beranjak dari kursi.&rdquo;</p>
        </div>
        {[['coffee','Cerita Kami','Kopiku Literasi lahir dari kecintaan mendalam terhadap buku dan kopi. Berawal dari koleksi pribadi di pojok ruang tamu, kini kami hadir sebagai perpustakaan pribadi yang terbuka untuk siapa saja yang ingin menemani hari-harinya dengan bacaan berkualitas.'],['rocketTarget','Misi Kami','Kami percaya bahwa setiap buku punya pembacanya sendiri. Misi kami adalah mendekatkan buku dengan pembacanya — membuat literasi lebih terjangkau, mudah diakses, dan menyenangkan.'],['scroll','Ketentuan Peminjaman','Booking gratis tanpa biaya. Pilih jadwal melalui kalender dan tentukan lama pinjam sesuai kebutuhanmu. Kembalikan tepat waktu untuk menjaga ketersediaan bagi pembaca lain.']].map(([icon,t,d]) => (
          <div key={t} style={{ background:'var(--c-card,#FFFDF7)', borderRadius:16, padding:'28px 32px', marginBottom:20, border:'1px solid var(--c-border,#E0CEAD)', boxShadow:'0 2px 10px rgba(58,26,10,0.07)' }}>
            <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, color:'var(--c-text,#3A2212)', margin:'0 0 12px', fontWeight:800, display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ width:40, height:40, borderRadius:10, background:'var(--c-surface,#FBF5E6)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-primary,#6B3A2A)' }}><Icon name={icon} size={22}/></span>
              {t}
            </h2>
            <p style={{ color:'var(--c-text,#5A3A28)', lineHeight:1.75, margin:0, fontSize:15 }}>{d}</p>
          </div>
        ))}
        <div style={{ textAlign:'center', marginTop:40 }}>
          <Btn onClick={() => onNavigate('catalog')} variant="accent" size="lg">Mulai Membaca →</Btn>
        </div>
      </div>
    </div>
  );
}
