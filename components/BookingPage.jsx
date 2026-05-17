'use client';
import { useState, useEffect } from 'react';
import { Icon } from './Icons';
import { Badge, Btn, Input } from './UI';

const DURATION_OPTS = [
  { days:3, label:'3 Hari' },
  { days:7, label:'1 Minggu' },
  { days:14, label:'2 Minggu' },
  { days:30, label:'1 Bulan' },
];

const DAYS = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

function CalendarPicker({ bookId, startDate, onSelect, days }) {
  const [viewDate, setViewDate] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [bookedRanges, setBookedRanges] = useState([]);

  useEffect(() => {
    fetch(`/api/bookings?bookId=${bookId}`)
      .then(r => r.json())
      .then(bookings => {
        const ranges = bookings
          .filter(b => !['cancelled','returned'].includes(b.status))
          .map(b => ({ from: new Date(b.pickupDate), to: new Date(b.returnDate) }));
        setBookedRanges(ranges);
      })
      .catch(() => {});
  }, [bookId]);

  function isBooked(date) { return bookedRanges.some(r => date >= r.from && date <= r.to); }
  function isPast(date) { const t = new Date(); t.setHours(0,0,0,0); return date < t; }
  function inRange(date) {
    if (!startDate) return false;
    const end = new Date(startDate); end.setDate(end.getDate() + days - 1);
    return date > startDate && date <= end;
  }
  function isStart(date) { return startDate && date.toDateString() === startDate.toDateString(); }

  const year = viewDate.getFullYear(), month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const cells = Array.from({ length: firstDay+daysInMonth }, (_,i) => i < firstDay ? null : new Date(year, month, i-firstDay+1));

  return (
    <div style={{ background:'var(--c-card,#FFF)', borderRadius:14, padding:20, border:'1.5px solid var(--c-border,#E0CEAD)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <button onClick={() => setViewDate(new Date(year, month-1, 1))}
          style={{ background:'var(--c-surface,#FBF5E6)', border:'none', borderRadius:8, cursor:'pointer', width:32, height:32, color:'var(--c-text,#3A2212)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon name="arrowLeft" size={14}/>
        </button>
        <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:15, color:'var(--c-text,#1A0A04)' }}>{MONTHS[month]} {year}</span>
        <button onClick={() => setViewDate(new Date(year, month+1, 1))}
          style={{ background:'var(--c-surface,#FBF5E6)', border:'none', borderRadius:8, cursor:'pointer', width:32, height:32, color:'var(--c-text,#3A2212)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon name="arrowRight" size={14}/>
        </button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, marginBottom:6 }}>
        {DAYS.map(d => <div key={d} style={{ textAlign:'center', fontSize:11, fontWeight:700, color:'var(--c-text-muted,#9B6347)', padding:'4px 0' }}>{d}</div>)}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
        {cells.map((date,i) => {
          if (!date) return <div key={i}/>;
          const booked = isBooked(date), past = isPast(date);
          const start = isStart(date), range = inRange(date);
          const today = date.toDateString() === new Date().toDateString();
          const disabled = booked || past;
          return (
            <button key={i} disabled={disabled} onClick={() => !disabled && onSelect(date)}
              style={{ aspectRatio:'1', borderRadius:start?10:range?4:8, border:today&&!start?'1.5px solid var(--c-accent,#C17A2A)':'none', background:start?'var(--c-accent,#C17A2A)':range?'rgba(193,122,42,0.18)':booked?'rgba(178,34,34,0.1)':'transparent', color:start?'#FFF':booked?'#B22222':past?'#CCC':'var(--c-text,#1A0A04)', fontSize:13, fontWeight:start?700:500, cursor:disabled?'not-allowed':'pointer', transition:'all .15s', textDecoration:booked?'line-through':'none' }}
              onMouseEnter={e => { if(!disabled&&!start&&!range) e.currentTarget.style.background='rgba(193,122,42,0.12)'; }}
              onMouseLeave={e => { if(!disabled&&!start&&!range) e.currentTarget.style.background='transparent'; }}>
              {date.getDate()}
            </button>
          );
        })}
      </div>
      <div style={{ display:'flex', gap:14, marginTop:14, flexWrap:'wrap' }}>
        {[['var(--c-accent,#C17A2A)','Tanggal Pinjam'],['rgba(193,122,42,0.18)','Periode'],['rgba(178,34,34,0.1)','Sudah Dibooking']].map(([c,l]) => (
          <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:12, height:12, borderRadius:3, background:c }}/>
            <span style={{ fontSize:11, color:'var(--c-text-muted,#9B6347)' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BookingPage({ book, user, onNavigate, onSuccess }) {
  const [step, setStep] = useState(1);
  const [duration, setDuration] = useState(DURATION_OPTS[0]);
  const [startDate, setStartDate] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [errMsg, setErrMsg] = useState('');

  if (!book || !user) return null;
  const endDate = startDate ? new Date(startDate.getTime() + (duration.days-1)*86400000) : null;
  const fmtDate = d => d ? new Date(d).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'}) : '—';
  const fmtDateLong = d => d ? new Date(d).toLocaleDateString('id-ID', {weekday:'long',day:'numeric',month:'long',year:'numeric'}) : '—';

  async function submitBooking() {
    if (!startDate) { setErrMsg('Pilih tanggal mulai pinjam terlebih dahulu.'); return; }
    setErrMsg('');
    setLoading(true);
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookId: book.id,
        duration: duration.days,
        durationLabel: duration.label,
        note,
        pickupDate: startDate.toISOString(),
        returnDate: endDate.toISOString(),
      }),
    });
    const nb = await res.json();
    if (!res.ok) { setErrMsg(nb.error || 'Booking gagal.'); setLoading(false); return; }
    setBooking(nb); setStep(2); setLoading(false); onSuccess && onSuccess();
  }

  const cardStyle = { background:'var(--c-card,#FFF)', borderRadius:16, padding:28, border:'1px solid var(--c-border,#E0CEAD)', boxShadow:'0 2px 12px rgba(58,26,10,0.07)' };

  return (
    <div className="kp-page">
      <div style={{ maxWidth:880, margin:'0 auto' }}>
        <button onClick={() => step===1 ? onNavigate('detail',book) : onNavigate('home')}
          style={{ background:'none', border:'none', color:'var(--c-primary,#6B3A2A)', fontSize:15, cursor:'pointer', marginBottom:24, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
          <Icon name="arrowLeft" size={15}/> {step===1?'Kembali ke Buku':'Kembali ke Beranda'}
        </button>

        <div className="kp-booking-steps">
          {['Detail Booking','Selesai'].map((s,i) => (
            <span key={s} style={{ display:'contents' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:step>i?'var(--c-primary,#6B3A2A)':step===i+1?'var(--c-accent,#C17A2A)':'var(--c-border,#E0CEAD)', display:'flex', alignItems:'center', justifyContent:'center', color:step>=i+1?'#FFF':'#9B6347', fontWeight:700, fontSize:14, transition:'all .3s' }}>
                  {step>i+1 ? <Icon name="check" size={14} color="#FFF"/> : i+1}
                </div>
                <span className="kp-booking-step-label" style={{ color:step===i+1?'var(--c-text,#1A0A04)':'var(--c-text-muted,#9B6347)' }}>{s}</span>
              </div>
              {i<1 && <div style={{ flex:1, height:2, background:step>i+1?'var(--c-primary,#6B3A2A)':'var(--c-border,#E0CEAD)', margin:'0 14px', transition:'background .3s' }}/>}
            </span>
          ))}
        </div>

        {step===1 && (
          <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
            <div style={{ flex:2, minWidth:300 }}>
              <div style={cardStyle}>
                <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:'var(--c-text,#1A0A04)', margin:'0 0 6px', fontSize:22, fontWeight:800 }}>Detail Booking</h2>
                <p style={{ color:'var(--c-text-muted,#7A5A42)', fontSize:14, margin:'0 0 24px' }}>Pilih jadwal dan durasi peminjaman buku ini. <strong>Gratis</strong> — tidak ada biaya.</p>

                <div style={{ display:'flex', gap:14, padding:16, background:'var(--c-surface,#FBF5E6)', borderRadius:12, marginBottom:24, border:'1px solid var(--c-border,#E0CEAD)' }}>
                  <div style={{ width:48, height:66, background:book.color, borderRadius:4, flexShrink:0, position:'relative' }}>
                    <div style={{ position:'absolute', left:0, top:0, bottom:0, width:6, background:'rgba(0,0,0,0.3)' }}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, color:'var(--c-text,#1A0A04)', fontSize:16 }}>{book.title}</div>
                    <div style={{ color:'var(--c-text-muted,#7A5A42)', fontSize:13 }}>{book.author}</div>
                    <div style={{ display:'flex', gap:6, marginTop:6 }}>
                      <Badge>{book.category}</Badge>
                      <Badge type="success">Tersedia</Badge>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom:24 }}>
                  <label style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, color:'var(--c-text,#1A0A04)', fontSize:14, marginBottom:10 }}>
                    <Icon name="calendar" size={16}/> Pilih Tanggal Mulai Pinjam
                  </label>
                  <CalendarPicker bookId={book.id} startDate={startDate} days={duration.days} onSelect={setStartDate}/>
                </div>

                <div style={{ marginBottom:24 }}>
                  <label style={{ display:'flex', alignItems:'center', gap:8, fontWeight:700, color:'var(--c-text,#1A0A04)', fontSize:14, marginBottom:10 }}>
                    <Icon name="clock" size={16}/> Lama Waktu Pinjam
                  </label>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
                    {DURATION_OPTS.map(d => (
                      <button key={d.days} onClick={() => setDuration(d)}
                        style={{ padding:'14px 16px', borderRadius:12, border:`2px solid ${duration.days===d.days?'var(--c-accent,#C17A2A)':'var(--c-border,#E0CEAD)'}`, background:duration.days===d.days?'rgba(193,122,42,0.1)':'var(--c-card,#FFF)', cursor:'pointer', textAlign:'left', transition:'all .2s', display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${duration.days===d.days?'var(--c-accent,#C17A2A)':'#CCC'}`, background:duration.days===d.days?'var(--c-accent,#C17A2A)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          {duration.days===d.days&&<div style={{ width:8, height:8, borderRadius:'50%', background:'#FFF' }}/>}
                        </div>
                        <div>
                          <div style={{ fontWeight:700, color:'var(--c-text,#1A0A04)', fontSize:15 }}>{d.label}</div>
                          <div style={{ fontSize:12, color:'var(--c-text-muted,#9B6347)' }}>{d.days} hari pinjam</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Input label="Catatan untuk Pemilik (opsional)" value={note} onChange={setNote} placeholder="Misal: alasan ingin baca, kapan ingin ambil..." icon={<Icon name="note" size={16}/>}/>
                {errMsg && <div style={{ background:'#FFF0F0', color:'#B22222', borderRadius:8, padding:'10px 14px', fontSize:13, marginTop:8 }}>{errMsg}</div>}
              </div>
            </div>

            <div style={{ flex:1, minWidth:260 }}>
              <div style={{...cardStyle, position:'sticky', top:90}}>
                <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:'var(--c-text,#1A0A04)', margin:'0 0 6px', fontSize:18, fontWeight:800 }}>Ringkasan Booking</h3>
                <p style={{ color:'var(--c-text-muted,#9B6347)', fontSize:12, margin:'0 0 18px' }}>Pastikan jadwalmu sebelum konfirmasi</p>

                <div style={{ fontSize:14, color:'var(--c-text,#1A0A04)' }}>
                  {[['calendar','Tanggal Mulai',startDate?fmtDateLong(startDate):null,'Belum dipilih'],['checkCircle','Tanggal Kembali',endDate?fmtDateLong(endDate):null,'—'],['clock','Durasi',duration.label,null]].map(([icon,label,val,placeholder]) => (
                    <div key={label} style={{ marginBottom:14 }}>
                      <div style={{ color:'var(--c-text-muted,#9B6347)', fontSize:12, marginBottom:2, display:'flex', alignItems:'center', gap:6 }}>
                        <Icon name={icon} size={12}/> {label}
                      </div>
                      <div style={{ fontWeight:700 }}>{val||<span style={{ color:'var(--c-text-muted,#9B6347)', fontWeight:400 }}>{placeholder}</span>}</div>
                    </div>
                  ))}
                  <hr style={{ border:'none', borderTop:'1px solid var(--c-border,#E0CEAD)', margin:'14px 0' }}/>
                  <div style={{ background:'rgba(46,125,82,0.1)', border:'1px solid rgba(46,125,82,0.3)', borderRadius:10, padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
                    <Icon name="checkCircle" size={20} color="#2E7D52"/>
                    <div>
                      <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, color:'#2E7D52', fontSize:15 }}>Gratis</div>
                      <div style={{ fontSize:11, color:'#2E7D52' }}>Tidak ada biaya peminjaman</div>
                    </div>
                  </div>
                </div>

                <button onClick={submitBooking} disabled={!startDate||loading}
                  style={{ width:'100%', marginTop:20, background:!startDate?'var(--c-border,#E0CEAD)':'var(--c-accent,#C17A2A)', color:'#FFF', border:'none', borderRadius:10, padding:14, fontWeight:700, fontSize:15, cursor:!startDate||loading?'not-allowed':'pointer', transition:'opacity .2s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  {loading?'Memproses...':<><Icon name="check" size={16} color="#FFF"/> Konfirmasi Booking</>}
                </button>
                <div style={{ marginTop:12, fontSize:11, color:'var(--c-text-muted,#9B6347)', textAlign:'center', lineHeight:1.5 }}>
                  Dengan booking, kamu setuju untuk mengembalikan buku tepat waktu.
                </div>
              </div>
            </div>
          </div>
        )}

        {step===2&&booking&&(
          <div className="kp-booking-success">
            <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(46,125,82,0.12)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', color:'#2E7D52', border:'2px solid rgba(46,125,82,0.3)' }}>
              <Icon name="checkCircle" size={40} strokeWidth={2}/>
            </div>
            <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", color:'var(--c-text,#1A0A04)', margin:'0 0 10px', fontWeight:800 }}>Booking Berhasil!</h2>
            <p style={{ color:'var(--c-text-muted,#7A5A42)', marginBottom:24, fontSize:15, lineHeight:1.6 }}>
              Terima kasih, <strong>{user.name}</strong>!<br/>Jadwal pinjam buku kamu sudah tercatat.
            </p>

            <div className="kp-booking-summary" style={{ background:'var(--c-surface,#FBF5E6)', borderRadius:14, padding:'20px', marginBottom:28, textAlign:'left', border:'1px solid var(--c-border,#E0CEAD)' }}>
              <div style={{ fontSize:11, color:'var(--c-text-muted,#9B6347)', fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', marginBottom:6 }}>Kode Booking</div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:24, color:'var(--c-text,#1A0A04)', fontWeight:800, letterSpacing:2, marginBottom:16 }}>{booking.id}</div>

              <div style={{ display:'flex', gap:14, alignItems:'center', marginBottom:16, paddingBottom:16, borderBottom:'1px solid var(--c-border,#E0CEAD)' }}>
                <div style={{ width:44, height:60, background:book.color, borderRadius:5, flexShrink:0, position:'relative' }}>
                  <div style={{ position:'absolute', left:0, top:0, bottom:0, width:6, background:'rgba(0,0,0,0.3)' }}/>
                </div>
                <div>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, color:'var(--c-text,#1A0A04)', fontSize:15 }}>{book.title}</div>
                  <div style={{ color:'var(--c-text-muted,#7A5A42)', fontSize:12 }}>{book.author}</div>
                </div>
              </div>

              <div style={{ fontSize:13, color:'var(--c-text,#1A0A04)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <Icon name="calendar" size={14} color="#C17A2A"/>
                  <span>{fmtDate(booking.pickupDate)} → {fmtDate(booking.returnDate)}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Icon name="clock" size={14} color="#C17A2A"/>
                  <span>{booking.durationLabel}</span>
                </div>
              </div>
            </div>

            <div style={{ background:'rgba(193,122,42,0.08)', border:'1px solid rgba(193,122,42,0.25)', borderRadius:12, padding:'16px 20px', marginBottom:24, textAlign:'left' }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:'rgba(193,122,42,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-accent,#C17A2A)', flexShrink:0, marginTop:2 }}>
                  <Icon name="mapPin" size={18}/>
                </div>
                <div>
                  <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, color:'var(--c-text,#1A0A04)', fontSize:14, marginBottom:4 }}>Lokasi Pengambilan Buku</div>
                  <div style={{ fontSize:13, color:'var(--c-text-muted,#7A5A42)', lineHeight:1.6 }}>
                    Desa Cileungsir, RT.06/RW.03<br/>
                    Kecamatan Rancah, Kabupaten Ciamis
                  </div>
                </div>
              </div>
            </div>

            <div className="kp-booking-btns">
              <Btn onClick={() => onNavigate('dashboard')} variant="primary">Lihat Dashboard</Btn>
              <Btn onClick={() => onNavigate('catalog')} variant="outline">Cari Buku Lain</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
