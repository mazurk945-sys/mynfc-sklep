'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingCart, User, LogOut, Plus, Trash2, QrCode,
  Image as ImageIcon, Tag, Users, Package, Key, ChevronRight,
  Mail, X, Check
} from 'lucide-react';
import { generateQRCode } from '../lib/qrcode';

/* --- Helpery --- */
const plnFmt = (v:string|number) => parseFloat(String(v)).toFixed(2);
const cls = (...a:(string|boolean|undefined)[]) => a.filter(Boolean).join(' ');

export default function NFCStore() {
  const [view, setView] = useState('shop');
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [toast, setToast] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [regStatus, setRegStatus] = useState('none');
  const [verCode, setVerCode] = useState('');
  const [adminTab, setAdminTab] = useState('products');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [payMethods, setPayMethods] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products').then(r=>r.json()).then(setProducts).catch(()=>{});
    fetch('/api/settings').then(r=>r.json()).then(setPayMethods).catch(()=>{});
    const saved = localStorage.getItem('nfc_user');
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      if (u.role === 'admin') fetchAdminData();
    }
  }, []);

  const pop = (msg:string, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3500); };
  const fetchAdminData = () => {
    fetch('/api/admin/users').then(r=>r.json()).then(setAllUsers).catch(()=>{});
    fetch('/api/admin/orders').then(r=>r.json()).then(setOrders).catch(()=>{});
  };

  const handleLogin = async (e:any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const res = await fetch('/api/auth/login',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(Object.fromEntries(fd)) });
    const d = await res.json();
    if (d.success) { setUser(d.user); localStorage.setItem('nfc_user', JSON.stringify(d.user)); window.location.reload(); }
    else pop(d.error, false);
  };

  const addToCart = (p:any) => { setCart([...cart, p]); pop(`Dodano ${p.name}`); };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'pending': return 'Złożone';
      case 'accepted': return 'Przyjęte';
      case 'shipped': return 'Wysłane';
      case 'delivered': return 'Odebrane';
      default: return s;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30">
      <nav className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={()=>setView('shop')} className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-blue-900/20">NFC</div>
             <div className="font-bold text-xl tracking-tighter">MYNFC.PL</div>
          </button>
          <div className="flex gap-4">
            {user && user.role !== 'admin' && (
              <button onClick={()=>setView('orders')} className="hidden lg:flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-300">
                <Package className="w-4 h-4"/> MOJE ZAMÓWIENIA
              </button>
            )}
            {user ? (
              <button onClick={()=>{localStorage.removeItem('nfc_user'); window.location.reload();}} className="text-xs border border-zinc-800 px-3 py-2 rounded-lg text-zinc-500 hover:text-white transition-colors">Wyloguj</button>
            ) : <button onClick={()=>setView('shop')} className="text-xs bg-white text-black px-4 py-2 rounded-lg font-bold">Zaloguj się</button>}
            <button onClick={()=>setView('cart')} className="bg-zinc-900 p-2 rounded-lg relative"><ShoppingCart className="w-5 h-5"/>{cart.length>0 && <span className="absolute -top-1 -right-1 bg-blue-600 text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{cart.length}</span>}</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {view === 'shop' && (
          <div className="py-20">
            {!user && (
               <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                  <div>
                    <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase italic">KARTY NFC <span className="text-blue-500">DLA CIEBIE</span></h1>
                    <p className="text-xl text-zinc-400 max-w-md">Najnowocześniejsze karty NFC spersonalizowane pod Ciebie. Jeden dotyk i Twoje dane są w telefonie klienta.</p>
                  </div>
                  <div className="bg-zinc-900 p-10 rounded-[3rem] border border-zinc-800">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <h2 className="text-3xl font-bold mb-6">Witaj ponownie</h2>
                      <input name="email" placeholder="Login" className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 focus:border-blue-600 outline-none"/>
                      <input name="password" type="password" placeholder="Hasło" className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 focus:border-blue-600 outline-none"/>
                      <button className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all uppercase">ZALOGUJ SIĘ</button>
                    </form>
                  </div>
               </div>
            )}
            <div className="grid md:grid-cols-3 gap-8">
              {products.map(p=>(
                <div key={p.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 overflow-hidden hover:border-zinc-600 transition-all">
                  <h3 className="text-3xl font-bold mb-3">{p.name}</h3>
                  <div className="flex items-end justify-between pt-6 border-t border-zinc-800/50">
                    <div className="text-4xl font-black">{plnFmt(p.price)} <span className="text-base font-medium text-zinc-500">zł</span></div>
                    <button onClick={()=>addToCart(p)} className="p-4 bg-white text-black rounded-3xl hover:scale-110 transition-all"><Plus/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'orders' && (
          <div className="py-10">
            <h1 className="text-6xl font-black tracking-tighter mb-12 italic uppercase">Moje <span className="text-blue-500">Zamówienia</span></h1>
            <div className="space-y-6">
              {(!Array.isArray(orders) || orders.length === 0) ? <div className="text-zinc-500 py-20 text-center bg-zinc-900 border border-zinc-800 rounded-[2.5rem]">Brak zamówień.</div> : orders.map(o=>(
                <div key={o.id} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex items-center justify-between">
                  <div>
                    <div className="text-zinc-500 text-[10px] font-black uppercase mb-1">NR {o.id} · {new Date(o.createdAt).toLocaleDateString()}</div>
                    <div className="text-2xl font-bold">{o.product?.name || 'Karta NFC'}</div>
                    <div className="text-emerald-500 font-mono font-bold text-sm mt-2">{plnFmt(o.totalAmount)} zł · {getStatusLabel(o.status).toUpperCase()}</div>
                  </div>
                  <ChevronRight className="w-8 h-8 text-zinc-800"/>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-2xl mx-auto py-20">
            <h2 className="text-5xl font-black tracking-tighter mb-10">KOSZYK</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10">
              {cart.map((p,i)=>(<div key={i} className="flex justify-between items-center py-4 border-b border-zinc-800 last:border-0"><span className="font-bold">{p.name}</span><b>{plnFmt(p.price)} zł</b></div>))}
              {cart.length === 0 && <p className="text-zinc-500 text-center py-10">Koszyk jest pusty</p>}
              <button className="w-full py-5 bg-blue-600 rounded-2xl font-bold mt-10 hover:bg-blue-500 transition-all uppercase tracking-widest shadow-xl shadow-blue-900/20">KUPUJĘ TERAZ</button>
            </div>
          </div>
        )}
      </main>

      {toast && <div className={cls('fixed bottom-8 left-1/2 -translate-x-1/2 px-10 py-5 rounded-[2rem] text-sm font-black shadow-2xl z-50 flex items-center gap-4 transition-all animate-in slide-in-from-bottom duration-300', toast.ok ? 'bg-white text-black' : 'bg-red-600 text-white')}>{toast.msg.toUpperCase()}</div>}
    </div>
  );
}
