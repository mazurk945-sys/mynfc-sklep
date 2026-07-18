'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingCart, User, LogOut, Plus, Trash2, QrCode,
  Image as ImageIcon, Tag, Users, Package, Key, ChevronRight,
  Mail, X, Check
} from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={()=>setView('shop')} className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold">NFC</div>
             <div className="font-bold text-xl">MYNFC.PL</div>
          </button>
          <div className="flex gap-4">
            {user ? (
              <button onClick={()=>{localStorage.removeItem('nfc_user'); window.location.reload();}} className="text-xs border border-zinc-800 px-3 py-2 rounded-lg">Wyloguj</button>
            ) : <button onClick={()=>setView('login')} className="text-xs bg-white text-black px-4 py-2 rounded-lg font-bold">Zaloguj</button>}
            <button onClick={()=>setView('cart')} className="bg-zinc-900 p-2 rounded-lg relative"><ShoppingCart className="w-5 h-5"/>{cart.length>0 && <span className="absolute -top-1 -right-1 bg-blue-600 text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{cart.length}</span>}</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {view === 'shop' && (
          <div className="grid md:grid-cols-3 gap-6 py-20">
            {products.length === 0 ? <p className="text-zinc-500">Ładowanie ofert...</p> : products.map(p=>(
              <div key={p.id} className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
                <h3 className="text-2xl font-bold mb-4">{p.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black">{plnFmt(p.price)} zł</span>
                  <button onClick={()=>addToCart(p)} className="p-3 bg-white text-black rounded-xl"><Plus/></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'login' && (
          <div className="max-w-md mx-auto py-20">
            <form onSubmit={handleLogin} className="bg-zinc-900 p-10 rounded-3xl border border-zinc-800 space-y-4">
              <h2 className="text-2xl font-bold mb-6">Zaloguj się</h2>
              <input name="email" placeholder="Login" className="w-full bg-black p-4 rounded-xl border border-zinc-800"/>
              <input name="password" type="password" placeholder="Hasło" className="w-full bg-black p-4 rounded-xl border border-zinc-800"/>
              <button className="w-full py-4 bg-white text-black font-bold rounded-xl">WEJDŹ</button>
            </form>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-2xl mx-auto py-20 text-center">
            <h2 className="text-4xl font-bold mb-10">Twój Koszyk</h2>
            {cart.map((p,i)=>(<div key={i} className="flex justify-between p-4 bg-zinc-900 rounded-xl mb-2"><span>{p.name}</span><b>{plnFmt(p.price)} zł</b></div>))}
            <button className="w-full py-5 bg-blue-600 rounded-2xl font-bold mt-10">KUPUJĘ (DOŁADUJ KONTO ABY ZAPŁACIĆ)</button>
          </div>
        )}
      </main>

      {toast && <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-4 rounded-full font-bold shadow-2xl">{toast.msg}</div>}
    </div>
  );
}
