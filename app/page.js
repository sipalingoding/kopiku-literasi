'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Navbar, Toast } from '@/components/UI';
import { HomePage } from '@/components/HomePage';
import { CatalogPage, BookDetailPage } from '@/components/CatalogPage';
import { BookingPage } from '@/components/BookingPage';
import { LoginPage, RegisterPage, OTPPage } from '@/components/AuthPages';
import { DashboardPage, AdminPage, AboutPage } from '@/components/DashboardPage';

export default function App() {
  const { data: session, status } = useSession();
  const user = session?.user || null;
  const prevUserRef = useRef(null);

  const [page, setPage] = useState('home');
  const [selectedBook, setSelectedBook] = useState(null);
  const [catalogCat, setCatalogCat] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user && !prevUserRef.current) {
      showToast(`Selamat datang, ${user.name}!`, 'success');
      navigate('home');
    }
    prevUserRef.current = user;
  }, [user]);

  function navigate(target, data) {
    if (target === 'detail') { setSelectedBook(data); setPage('detail'); }
    else if (target === 'catalog') { setCatalogCat(data || null); setPage('catalog'); }
    else if (target === 'booking') { if (data) setSelectedBook(data); setPage('booking'); }
    else setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBook(book) {
    if (!user) { navigate('login'); showToast('Silakan masuk terlebih dahulu untuk booking.', 'info'); return; }
    navigate('booking', book);
  }

  async function handleLogout() {
    await signOut({ redirect: false });
    navigate('home');
    showToast('Sampai jumpa!', 'info');
  }

  function showToast(msg, type = 'info') { setToast({ msg, type }); }

  if (status === 'loading') {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--c-bg,#FBF5E6)' }}>
        <div style={{ color:'#9B6347', fontSize:16 }}>Memuat...</div>
      </div>
    );
  }

  function renderPage() {
    switch (page) {
      case 'home': return <HomePage onNavigate={navigate} onBook={handleBook} user={user}/>;
      case 'catalog': return <CatalogPage onNavigate={navigate} onBook={handleBook} initialCategory={catalogCat}/>;
      case 'detail': return <BookDetailPage book={selectedBook} onNavigate={navigate} onBook={handleBook} user={user}/>;
      case 'booking': return <BookingPage book={selectedBook} user={user} onNavigate={navigate} onSuccess={() => showToast('Booking berhasil!', 'success')}/>;
      case 'dashboard': return user ? <DashboardPage user={user} onNavigate={navigate}/> : (navigate('login'), null);
      case 'admin': return user?.role === 'admin' ? <AdminPage onNavigate={navigate}/> : (navigate('home'), null);
      case 'about': return <AboutPage onNavigate={navigate}/>;
      case 'login': return <LoginPage onNavigate={navigate}/>;
      case 'register': return <RegisterPage onNavigate={navigate}/>;
      case 'otp': return <OTPPage onNavigate={navigate}/>;
      default: return <HomePage onNavigate={navigate} onBook={handleBook} user={user}/>;
    }
  }

  return (
    <div style={{ fontFamily: "var(--font-nunito,'Nunito',sans-serif)" }}>
      <Navbar user={user} onNavigate={navigate} onLogout={handleLogout}/>
      <div style={{ paddingTop: page === 'home' ? 0 : 72 }}>
        {renderPage()}
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}
    </div>
  );
}
