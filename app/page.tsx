'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, User, LogOut, Plus, Trash2, QrCode, Image as ImageIcon, Tag, Users, Package, Key, ChevronRight, Mail, X, Check } from 'lucide-react';

const plnFmt = (v:string|number) => parseFloat(String(v)).toFixed(2);
const cls = (...a:(string|boolean|undefined)[]) => a.filter(Boolean).join(' ');
const getQR = (link: string) => `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(link)}`;

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
  const [allOrders, setAllOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products').then(r=>r.json()).then(setProducts).catch(()=>{});
    const saved = localStorage.getItem('nfc_user');
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      if (u.role === 'admin') fetchAdminData();
      else fetchUserData(u.id);
    }
  }, []);

  const pop = (msg:string, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3500); };
  const fetchUserData = (id:number) => fetch(`/api/user/${id}`).then(r=>r.json()).then(d=>{ setOrders(d.orders||[]); }).catch(()=>{});
  const fetchAdminData = () => {
    fetch('/api/admin/users').then(r=>r.json()).then(setAllUsers).catch(()=>{});
    fetch('/api/admin/orders').then(r=>r.json()).then(setAllOrders).catch(()=>{});
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
    <div className="min-h-screen bg-black text-white p-4">
      <nav className="flex justify-between items-center p-4 border-b border-zinc-800">
        <button onClick={()=>setView('shop')} className="font-bold text-xl">MYNFC.PL</button>
        <div className="flex gap-4">
          {user ? <button onClick={()=>{localStorage.removeItem('nfc_user'); window.location.reload();}}>Wyloguj</button> : <button onClick={()=>setView('shop')}>Zaloguj</button>}
          <button onClick={()=>setView('cart')} className="relative">Koszyk {cart.length > 0 && <span>({cart.length})</span>}</button>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto py-20">
        {view === 'shop' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-zinc-900 p-6 rounded-2xl">
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="text-2xl font-black mt-4">{p.price} zł</p>
                <button onClick={()=>addToCart(p)} className="mt-4 bg-white text-black px-4 py-2 rounded-lg font-bold w-full">DODAJ</button>
              </div>
            ))}
          </div>
        )}
        {view === 'cart' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">Koszyk</h2>
            {cart.map((p,i)=>(<div key={i} className="flex justify-between p-2">{p.name} <span>{p.price} zł</span></div>))}
            <button className="mt-10 bg-blue-600 px-10 py-4 rounded-xl font-bold">KUPUJĘ</button>
          </div>
        )}
      </main>
      {toast && <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-3 rounded-full font-bold">{toast.msg}</div>}
    </div>
  );
}
