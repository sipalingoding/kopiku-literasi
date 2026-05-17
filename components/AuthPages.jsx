'use client';
import { useState, useRef, useMemo } from 'react';
import { signIn } from 'next-auth/react';
import { Icon } from './Icons';
import { Input, Btn } from './UI';

const authWrap = { minHeight:'calc(100vh - 64px)', background:'var(--c-bg,#FBF5E6)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 };
const authCard = { background:'#FFFDF7', borderRadius:20, width:'100%', maxWidth:460, boxShadow:'0 8px 40px rgba(58,26,10,0.12)', border:'1px solid #E0CEAD' };
const authTitle = { fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#3A2212', fontSize:28, fontWeight:800, textAlign:'center', margin:'0 0 8px' };
const authSub = { color:'#7A5A42', textAlign:'center', margin:'0 0 24px', fontSize:15 };

const BookLogo = () => (
  <div style={{ textAlign:'center', marginBottom:16 }}>
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="6" y="8" width="28" height="34" rx="3" fill="#E8C07A"/>
      <rect x="9" y="11" width="22" height="28" rx="2" fill="#FFFDF7"/>
      <rect x="12" y="18" width="16" height="2" rx="1" fill="#C17A2A"/>
      <rect x="12" y="23" width="12" height="2" rx="1" fill="#C17A2A"/>
      <rect x="12" y="28" width="14" height="2" rx="1" fill="#C17A2A"/>
      <rect x="34" y="12" width="8" height="26" rx="2" fill="#9B6347" opacity=".6"/>
    </svg>
  </div>
);

export function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    if (!email || !pass) { setErr('Email dan password wajib diisi.'); return; }
    setLoading(true);
    const result = await signIn('credentials', { email, password: pass, redirect: false });
    if (result?.error) {
      setErr(result.error === 'EMAIL_NOT_VERIFIED' ? 'Email belum diverifikasi.' : 'Email atau password salah.');
      setLoading(false);
    }
    // On success, session updates and page.js useEffect handles navigation
  }

  return (
    <div style={authWrap}>
      <div style={authCard} className="kp-auth-card">
        <BookLogo/>
        <h1 style={authTitle}>Selamat Datang</h1>
        <p style={authSub}>Masuk ke akun <strong>Kopiku Literasi</strong> Anda</p>
        <form onSubmit={submit}>
          <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="nama@email.com" icon={<Icon name="mail" size={16}/>}/>
          <Input label="Password" type="password" value={pass} onChange={setPass} placeholder="••••••••" icon={<Icon name="lock" size={16}/>}/>
          {err && <div style={{ background:'#FFF0F0', color:'#B22222', borderRadius:8, padding:'10px 14px', fontSize:13, marginBottom:14 }}>{err}</div>}
          <Btn onClick={submit} fullWidth size="lg" disabled={loading}>{loading ? 'Memproses...' : 'Masuk'}</Btn>
        </form>
        <div style={{ textAlign:'center', marginTop:20, fontSize:14, color:'#7A5A42' }}>
          Belum punya akun?{' '}
          <button onClick={() => onNavigate('register')} style={{ background:'none', border:'none', color:'#C17A2A', fontWeight:700, cursor:'pointer', fontSize:14 }}>Daftar sekarang</button>
        </div>
        <div style={{ textAlign:'center', marginTop:12, padding:'12px', background:'#FBF5E6', borderRadius:8, fontSize:12, color:'#9B6347' }}>
          Demo Admin: admin@kopiku.id / admin123
        </div>
      </div>
    </div>
  );
}

export function RegisterPage({ onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Nama wajib diisi';
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Format email tidak valid';
    if (pass.length < 6) e.pass = 'Password minimal 6 karakter';
    if (pass !== pass2) e.pass2 = 'Password tidak sama';
    return e;
  }

  async function submit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErrors({ email: data.error || 'Pendaftaran gagal.' });
      setLoading(false);
      return;
    }
    // Store credentials temporarily for post-OTP sign-in
    sessionStorage.setItem('kopiku_otp_data', JSON.stringify({ email, password: pass }));
    setLoading(false);
    onNavigate('otp');
  }

  return (
    <div style={authWrap}>
      <div style={authCard} className="kp-auth-card">
        <BookLogo/>
        <h1 style={authTitle}>Buat Akun</h1>
        <p style={authSub}>Bergabung dengan komunitas pembaca <strong>Kopiku Literasi</strong></p>
        <form onSubmit={submit}>
          <Input label="Nama Lengkap" value={name} onChange={v => { setName(v); setErrors(p => ({...p, name:''})); }} placeholder="Nama Anda" icon={<Icon name="user" size={16}/>} error={errors.name}/>
          <Input label="Email" type="email" value={email} onChange={v => { setEmail(v); setErrors(p => ({...p, email:''})); }} placeholder="nama@email.com" icon={<Icon name="mail" size={16}/>} error={errors.email}/>
          <Input label="Password" type="password" value={pass} onChange={v => { setPass(v); setErrors(p => ({...p, pass:''})); }} placeholder="Min. 6 karakter" icon={<Icon name="lock" size={16}/>} error={errors.pass}/>
          <Input label="Konfirmasi Password" type="password" value={pass2} onChange={v => { setPass2(v); setErrors(p => ({...p, pass2:''})); }} placeholder="Ulangi password" icon={<Icon name="lock" size={16}/>} error={errors.pass2}/>
          <Btn onClick={submit} fullWidth size="lg" disabled={loading}>{loading ? 'Mendaftar...' : 'Daftar'}</Btn>
        </form>
        <div style={{ textAlign:'center', marginTop:20, fontSize:14, color:'#7A5A42' }}>
          Sudah punya akun?{' '}
          <button onClick={() => onNavigate('login')} style={{ background:'none', border:'none', color:'#C17A2A', fontWeight:700, cursor:'pointer', fontSize:14 }}>Masuk di sini</button>
        </div>
      </div>
    </div>
  );
}

export function OTPPage({ onNavigate }) {
  const [otp, setOtp] = useState(['','','','','','']);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const inputRefs = useRef([]);

  const otpData = useMemo(() => {
    if (typeof window === 'undefined') return { email: '', password: '' };
    const stored = sessionStorage.getItem('kopiku_otp_data');
    return stored ? JSON.parse(stored) : { email: '', password: '' };
  }, []);

  const email = otpData.email;

  function handleInput(i, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus();
  }

  async function verify() {
    const code = otp.join('');
    if (code.length < 6) { setErr('Masukkan 6 digit kode OTP'); return; }
    setLoading(true);
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    if (!res.ok) {
      const data = await res.json();
      setErr(data.error || 'Kode OTP salah. (Demo: 123456)');
      setLoading(false);
      return;
    }
    // Sign in after successful verification
    const result = await signIn('credentials', { email, password: otpData.password, redirect: false });
    sessionStorage.removeItem('kopiku_otp_data');
    if (result?.error) {
      setErr('Verifikasi berhasil, silakan masuk secara manual.');
      setLoading(false);
      onNavigate('login');
      return;
    }
    // Session will update; page.js useEffect will navigate home
  }

  return (
    <div style={authWrap}>
      <div style={{...authCard, maxWidth:420}} className="kp-auth-card">
        <div style={{ textAlign:'center', marginBottom:8, color:'var(--c-accent,#C17A2A)' }}>
          <Icon name="mailOpen" size={48}/>
        </div>
        <h1 style={authTitle}>Verifikasi OTP</h1>
        <p style={{...authSub, marginBottom:28}}>Kode OTP dikirim ke <strong>{email}</strong>. Masukkan 6 digit kode di bawah.</p>
        <div className="kp-otp-row">
          {otp.map((d, i) => (
            <input key={i} ref={el => inputRefs.current[i] = el} value={d} maxLength={1}
              onChange={e => handleInput(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)}
              className="kp-otp-input"
              style={{ borderColor: d ? '#C17A2A' : '#E0CEAD', background: d ? '#FFF8EE' : '#FFFDF7' }}/>
          ))}
        </div>
        {err && <div style={{ background:'#FFF0F0', color:'#B22222', borderRadius:8, padding:'10px 14px', fontSize:13, marginBottom:14, textAlign:'center' }}>{err}</div>}
        <Btn onClick={verify} fullWidth size="lg" disabled={loading}>{loading ? 'Memverifikasi...' : 'Verifikasi'}</Btn>
        <div style={{ textAlign:'center', marginTop:18, fontSize:13, color:'#7A5A42' }}>
          Tidak dapat kode?{' '}
          <button onClick={() => setResent(true)} style={{ background:'none', border:'none', color:'#C17A2A', fontWeight:700, cursor:'pointer' }}>
            {resent ? 'Terkirim ✓' : 'Kirim ulang'}
          </button>
        </div>
        <div style={{ textAlign:'center', marginTop:8, padding:'10px', background:'#FBF5E6', borderRadius:8, fontSize:12, color:'#9B6347' }}>
          Demo OTP: <strong>123456</strong>
        </div>
      </div>
    </div>
  );
}
