'use client';

const ICON_PATHS = {
  book: <g><path d="M4 5c0-1 1-2 2-2h11v15H6c-1 0-2 .8-2 2V5z" strokeLinejoin="round"/><path d="M4 20c0-1 1-2 2-2h11" strokeLinecap="round"/><path d="M8 7h6M8 10h5" strokeLinecap="round" opacity=".55"/></g>,
  bookOpen: <g><path d="M3 6c0-.5.4-1 1-1h6c1.1 0 2 .9 2 2v12c0-1.1-.9-2-2-2H4c-.5 0-1-.5-1-1V6z" strokeLinejoin="round"/><path d="M21 6c0-.5-.4-1-1-1h-6c-1.1 0-2 .9-2 2v12c0-1.1.9-2 2-2h6c.5 0 1-.5 1-1V6z" strokeLinejoin="round"/></g>,
  bookStack: <g><path d="M4 7h5v13H4z" strokeLinejoin="round"/><path d="M10 9h5v11h-5z" strokeLinejoin="round"/><path d="M16 5l4.5.8-2 13L14 18z" strokeLinejoin="round"/><path d="M6 10v2M11 12v2" strokeLinecap="round" opacity=".5"/></g>,
  bookmark: <g><path d="M6 4h12v17l-6-4-6 4V4z" strokeLinejoin="round"/></g>,
  novel: <g><path d="M5 4h9c1.1 0 2 .9 2 2v14H7c-1.1 0-2-.9-2-2V4z" strokeLinejoin="round"/><path d="M16 4l3 1v14l-3-1" strokeLinejoin="round" opacity=".5"/><path d="M8 8h5M8 11h4" strokeLinecap="round" opacity=".55"/></g>,
  business: <g><rect x="3" y="7" width="18" height="13" rx="1.5" strokeLinejoin="round"/><path d="M9 7V5c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v2" strokeLinejoin="round"/><path d="M3 13h18" opacity=".5"/></g>,
  economy: <g><path d="M3 19h18" strokeLinecap="round"/><path d="M6 19v-6M10 19v-9M14 19v-4M18 19v-11" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 8l4-2 4 3 6-4" strokeLinejoin="round" opacity=".55"/></g>,
  politics: <g><path d="M4 21h16M5 21V10M19 21V10M9 21V10M15 21V10" strokeLinecap="round"/><path d="M3 10h18l-9-7-9 7z" strokeLinejoin="round"/></g>,
  selfHelp: <g><path d="M12 21c0-4-3-4-3-8a3 3 0 016 0c0 4-3 4-3 8z" strokeLinejoin="round"/><path d="M12 21v-3" strokeLinecap="round" opacity=".55"/><path d="M9 11c-1.5-.5-3-1.5-3-4M15 11c1.5-.5 3-1.5 3-4" strokeLinecap="round" opacity=".55"/></g>,
  history: <g><path d="M5 7l7-3 7 3v3c0 5-3 9-7 11-4-2-7-6-7-11V7z" strokeLinejoin="round"/><path d="M9 11l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" opacity=".7"/></g>,
  science: <g><path d="M9 3v6L5 18c-.5 1 .2 2 1.3 2h11.4c1.1 0 1.8-1 1.3-2L15 9V3" strokeLinejoin="round"/><path d="M8 3h8" strokeLinecap="round"/><circle cx="11" cy="15" r="1" fill="currentColor" stroke="none"/><circle cx="14" cy="13" r="1" fill="currentColor" stroke="none" opacity=".7"/></g>,
  philosophy: <g><path d="M5 15c2 4 5 6 7 6s5-2 7-6c0-3-1-9-7-9s-7 6-7 9z" strokeLinejoin="round"/><path d="M9 12c1-2 4-2 6 0" strokeLinecap="round" opacity=".55"/><path d="M10 16c1 1 3 1 4 0" strokeLinecap="round" opacity=".55"/></g>,
  mail: <g><rect x="3" y="5" width="18" height="14" rx="2" strokeLinejoin="round"/><path d="M3 7l9 7 9-7" strokeLinejoin="round"/></g>,
  lock: <g><rect x="5" y="11" width="14" height="10" rx="2" strokeLinejoin="round"/><path d="M8 11V8a4 4 0 018 0v3" strokeLinejoin="round"/><circle cx="12" cy="16" r="1.2" fill="currentColor" stroke="none"/></g>,
  user: <g><circle cx="12" cy="8" r="4" strokeLinejoin="round"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" strokeLinejoin="round" strokeLinecap="round"/></g>,
  shieldCheck: <g><path d="M12 3l8 3v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-3z" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/></g>,
  search: <g><circle cx="11" cy="11" r="6" strokeLinejoin="round"/><path d="M16 16l4 4" strokeLinecap="round"/></g>,
  calendar: <g><rect x="3" y="5" width="18" height="16" rx="2" strokeLinejoin="round"/><path d="M3 10h18" strokeLinejoin="round"/><path d="M8 3v4M16 3v4" strokeLinecap="round"/><circle cx="8" cy="14" r=".8" fill="currentColor" stroke="none"/><circle cx="12" cy="14" r=".8" fill="currentColor" stroke="none"/><circle cx="16" cy="14" r=".8" fill="currentColor" stroke="none"/></g>,
  clock: <g><circle cx="12" cy="12" r="9" strokeLinejoin="round"/><path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round"/></g>,
  card: <g><rect x="3" y="6" width="18" height="13" rx="2" strokeLinejoin="round"/><path d="M3 10h18" strokeLinejoin="round"/><path d="M7 15h3" strokeLinecap="round" opacity=".55"/></g>,
  pin: <g><path d="M12 21s-7-7-7-12a7 7 0 0114 0c0 5-7 12-7 12z" strokeLinejoin="round"/><circle cx="12" cy="9" r="2.5" strokeLinejoin="round"/></g>,
  note: <g><path d="M5 4h10l4 4v12c0 .6-.4 1-1 1H5c-.6 0-1-.4-1-1V5c0-.6.4-1 1-1z" strokeLinejoin="round"/><path d="M14 4v5h5" strokeLinejoin="round"/><path d="M8 13h7M8 16h5" strokeLinecap="round" opacity=".55"/></g>,
  check: <g><path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round"/></g>,
  checkCircle: <g><circle cx="12" cy="12" r="9" strokeLinejoin="round"/><path d="M8 12l3 3 5-6" strokeLinecap="round" strokeLinejoin="round"/></g>,
  close: <g><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round"/></g>,
  menu: <g><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/></g>,
  chevronDown: <g><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/></g>,
  arrowLeft: <g><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></g>,
  arrowRight: <g><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></g>,
  mapPin: <g><path d="M12 2C8.7 2 6 4.7 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.3-2.7-6-6-6z" strokeLinejoin="round"/><circle cx="12" cy="8" r="2" fill="currentColor" stroke="none"/></g>,
  plus: <g><path d="M12 5v14M5 12h14" strokeLinecap="round"/></g>,
  edit: <g><path d="M14 4l6 6-11 11H3v-6L14 4z" strokeLinejoin="round"/><path d="M11 7l6 6" strokeLinecap="round"/></g>,
  trash: <g><path d="M4 7h16" strokeLinecap="round"/><path d="M10 4h4a1 1 0 011 1v2H9V5a1 1 0 011-1z" strokeLinejoin="round"/><path d="M6 7l1 13c0 .6.4 1 1 1h8c.6 0 1-.4 1-1l1-13" strokeLinejoin="round"/><path d="M10 11v6M14 11v6" strokeLinecap="round" opacity=".55"/></g>,
  logout: <g><path d="M15 4h4a1 1 0 011 1v14a1 1 0 01-1 1h-4" strokeLinejoin="round"/><path d="M10 8l-4 4 4 4M6 12h12" strokeLinecap="round" strokeLinejoin="round"/></g>,
  settings: <g><circle cx="12" cy="12" r="3" strokeLinejoin="round"/><path d="M12 2v3M12 19v3M21 12h-3M5 12H2M19 5l-2 2M7 17l-2 2M19 19l-2-2M7 7L5 5" strokeLinecap="round" opacity=".75"/></g>,
  hourglass: <g><path d="M6 3h12M6 21h12" strokeLinecap="round"/><path d="M7 3v3c0 2 5 4 5 6s-5 4-5 6v3M17 3v3c0 2-5 4-5 6s5 4 5 6v3" strokeLinejoin="round"/></g>,
  mailOpen: <g><path d="M3 9l9-5 9 5v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinejoin="round"/><path d="M3 9l9 6 9-6" strokeLinejoin="round"/></g>,
  emptyBox: <g><path d="M3 8l2-4h14l2 4M3 8v12c0 .6.4 1 1 1h16c.6 0 1-.4 1-1V8M3 8h18" strokeLinejoin="round"/><path d="M9 12h6" strokeLinecap="round" opacity=".55"/></g>,
  star: <g><path d="M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6.1L12 16.8 6.6 19.7l1.2-6.1L3.3 9.4l6.1-.8L12 3z" strokeLinejoin="round" fill="currentColor"/></g>,
  starOutline: <g><path d="M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6.1L12 16.8 6.6 19.7l1.2-6.1L3.3 9.4l6.1-.8L12 3z" strokeLinejoin="round"/></g>,
  coffee: <g><path d="M5 8h12v6a5 5 0 01-5 5h-2a5 5 0 01-5-5V8z" strokeLinejoin="round"/><path d="M17 9h2a2 2 0 010 4h-2" strokeLinejoin="round"/><path d="M8 3c0 1.5 1 1.5 1 3M12 3c0 1.5 1 1.5 1 3" strokeLinecap="round" opacity=".7"/></g>,
  feather: <g><path d="M20 4c0 8-6 13-10 14L5 19V4l5-2c4-1 10 1 10 2z" strokeLinejoin="round" opacity=".25" fill="currentColor"/><path d="M20 4c0 8-6 13-10 14L5 19V4l5-2c4-1 10 1 10 2z" strokeLinejoin="round"/><path d="M5 19l9-9" strokeLinecap="round" opacity=".7"/></g>,
  rocketTarget: <g><circle cx="12" cy="12" r="9" strokeLinejoin="round"/><circle cx="12" cy="12" r="5" strokeLinejoin="round" opacity=".6"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></g>,
  scroll: <g><path d="M5 5c0-1 1-2 2-2h11v15c0 1.5-1 3-3 3H7c-1 0-2-1-2-2V5z" strokeLinejoin="round"/><path d="M5 5h-1c0 1 0 2 1 2" strokeLinejoin="round"/><path d="M9 8h6M9 11h4" strokeLinecap="round" opacity=".55"/></g>,
  qrcode: <g><rect x="3" y="3" width="7" height="7" rx="1" strokeLinejoin="round"/><rect x="14" y="3" width="7" height="7" rx="1" strokeLinejoin="round"/><rect x="3" y="14" width="7" height="7" rx="1" strokeLinejoin="round"/><rect x="14" y="14" width="3" height="3" fill="currentColor" stroke="none"/><rect x="18" y="18" width="3" height="3" fill="currentColor" stroke="none"/></g>,
  handshake: <g><path d="M2 14l4-4 5 4-3 3-2-1c-1 1-2 1-3 1-1 0-2-1-1-3z" strokeLinejoin="round"/><path d="M22 14l-4-4-5 4 3 3 2-1c1 1 2 1 3 1 1 0 2-1 1-3z" strokeLinejoin="round"/><path d="M8 14l4 4 4-4" strokeLinejoin="round"/></g>,
  wave: <g><path d="M3 18c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 13c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" strokeLinecap="round" strokeLinejoin="round" opacity=".55"/><path d="M3 8c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" strokeLinecap="round" strokeLinejoin="round" opacity=".3"/></g>,
  sun: <g><circle cx="12" cy="12" r="4" strokeLinejoin="round"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" strokeLinecap="round"/></g>,
  moon: <g><path d="M20 14a8 8 0 11-10-10 7 7 0 0010 10z" strokeLinejoin="round"/></g>,
  spark: <g><path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l4 4M14 14l4 4M18 6l-4 4M10 14l-4 4" strokeLinecap="round"/></g>,
  inbox: <g><path d="M3 12l3-7h12l3 7v7c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1v-7z" strokeLinejoin="round"/><path d="M3 12h5l1 3h6l1-3h5" strokeLinejoin="round"/></g>,
  list: <g><path d="M9 6h12M9 12h12M9 18h12" strokeLinecap="round"/><circle cx="5" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="5" cy="18" r="1" fill="currentColor" stroke="none"/></g>,
  receipt: <g><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2V3z" strokeLinejoin="round"/><path d="M8 8h8M8 11h8M8 14h5" strokeLinecap="round" opacity=".55"/></g>,
  layers: <g><path d="M12 3l9 5-9 5-9-5 9-5z" strokeLinejoin="round"/><path d="M3 13l9 5 9-5" strokeLinejoin="round" opacity=".55"/></g>,
  shelf: <g><path d="M4 6h3v14H4zM8 6h3v14H8zM12 8h3v12h-3zM16 6l3 .5L18 20l-3-.5z" strokeLinejoin="round"/></g>,
  flame: <g><path d="M12 22c-4 0-7-3-7-7 0-3 2-5 3-6 0 2 1 2 2 1 1-2 0-4-1-6 4 1 8 5 8 11 0 4-3 7-5 7z" strokeLinejoin="round"/></g>,
};

export function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.8, style }) {
  const path = ICON_PATHS[name];
  if (!path) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}>
      {path}
    </svg>
  );
}
