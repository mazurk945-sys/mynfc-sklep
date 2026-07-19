'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, User, LogOut, Plus, Trash2, QrCode, Image as ImageIcon, Tag, Users, Package, Key, ChevronRight, Mail, X, Check } from 'lucide-react';

const plnFmt = (v:string|number) => parseFloat(String(v)).toFixed(2);
const cls = (...a:(string|boolean|undefined)[]) => a.filter(Boolean).join(' ');

export default function NFCStore() {
  const [view, setView] = useState('shop');
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [toast, setToast] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [discountInput, setDiscountInput] = useState('');
  const [activeDiscount, setActiveDiscount] = useState<any>(null);
  const [regEmail, setRegEmail] = useState('');
  const [regStatus, setRegStatus] = useState('none');
  const [verCode, setVerCode] = useState('');
  const [adminTab, setAdminTab] = useState('products');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allDiscounts, setAllDiscounts] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [payMethods, setPayMethods] = useState<any[]>([]);
  const [newPayMethod, setNewPayMethod] = useState({ name: '', type: 'link', content: '' });
  const [selProduct, setSelProduct] = useState<any>(null);
  const [cfgImage, setCfgImage] = useState('');
  const [cfgText, setCfgText] = useState('');
  const [cfgLink, setCfgLink] = useState('');

  useEffect(() => {
    fetch('/api/products').then(r=>r.json()).then(setProducts).catch(()=>{});
    fetch('/api/settings').then(r=>r.json()).then(setPayMethods).catch(()=>{});
    const saved = localStorage.getItem('nfc_user');
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      if (u.role === 'admin') fetchAdminData();
      else fetchUserData(u.id);
    }
  }, []);

  const pop = (msg:string, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3500); };
  const fetchUserData = (id:number) => fetch(`/api/user/${id}`).then(r=>r.json()).then(d=>{ setOrders(d.orders||[]); setCards(d.cards||[]); }).catch(()=>{});
  const fetchAdminData = () => {
    fetch('/api/admin/users').then(r=>r.json()).then(setAllUsers).catch(()=>{});
    fetch('/api/admin/discounts').then(r=>r.json()).then(setAllDiscounts).catch(()=>{});
    fetch('/api/admin/orders').then(r=>r.json()).then(setAllOrders).catch(()=>{});
  };  const handleLogin = async (e:any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const res = await fetch('/api/auth/login',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(Object.fromEntries(fd)) });
    const d = await res.json();
    if (d.success) { setUser(d.user); localStorage.setItem('nfc_user', JSON.stringify(d.user)); window.location.reload(); }
    else pop(d.error, false);
  };

  const handleRegister = async (e:any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    setRegEmail(fd.get('email') as string);
    const res = await fetch('/api/auth/register',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(Object.fromEntries(fd)) });
    const d = await res.json();
    if (d.success) { setRegStatus('pending'); pop(`KOD WERYFIKACJI: ${d.debugCode}`); } else pop(d.error, false);
  };

  const handleVerify = async () => {
    const res = await fetch('/api/auth/verify', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email:regEmail, code:verCode}) });
    if ((await res.json()).success) { setRegStatus('none'); pop('Konto aktywne! Zaloguj się.'); } else pop('Błędny kod', false);
  };

  const addToCart = (p:any) => { setCart([...cart, p]); pop(`Dodano ${p.name}`); };
  const totalCartValue = () => {
    const sum = cart.reduce((acc, p) => acc + parseFloat(p.price), 0);
    return activeDiscount ? sum * (1 - activeDiscount.pct/100) : sum;
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'pending': return 'Złożone';
      case 'accepted': return 'Przyjęte';
      case 'shipped': return 'Wysłane';
      case 'delivered': return 'Odebrane';
      default: return 'W toku';
    }
  };  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-500/30">
      <nav className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={()=>setView('shop')} className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-blue-900/20">NFC</div>
             <div className="font-bold text-xl tracking-tighter italic">MYNFC.PL</div>
          </button>
          <div className="flex items-center gap-4">
            {user && user.role !== 'admin' && <button onClick={()=>setView('orders')} className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-xl text-[10px] font-black uppercase">Moje Zamówienia</button>}
            <button onClick={()=>setView('cart')} className="relative p-2 bg-zinc-900 rounded-lg"><ShoppingCart className="w-5 h-5"/>{cart.length>0 && <span className="absolute -top-1 -right-1 bg-blue-600 text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{cart.length}</span>}</button>
            {user ? (
              <div className="flex items-center gap-4 border-l border-zinc-800 pl-4">
                <div className="text-right hidden sm:block"><div className="text-[10px] font-bold text-zinc-500">{user.email}</div><div className="text-sm font-black text-emerald-400">{plnFmt(user.balance)} zł</div></div>
                <button onClick={()=>{localStorage.removeItem('nfc_user'); window.location.reload();}} className="p-2 hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"><LogOut className="w-4 h-4"/></button>
              </div>
            ) : <button onClick={()=>setView('shop')} className="px-4 py-2 bg-white text-black text-xs font-black rounded-lg uppercase">Zaloguj się</button>}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {view === 'shop' && (
          <div className="py-20">
            {!user && (
              <div className="grid md:grid-cols-2 gap-20 items-center mb-32">
                <div>
                  <h1 className="text-8xl font-black uppercase italic leading-[0.8] mb-8">Karty NFC <span className="text-blue-600">Dla Ciebie</span></h1>
                  <p className="text-zinc-500 text-xl max-w-sm font-medium">Zmień swoją wizytówkę na cyfrową. Jeden dotyk, tysiące możliwości.</p>
                </div>
                <div className="bg-zinc-900 p-10 rounded-[3rem] border border-zinc-800 shadow-2xl">
                  {regStatus==='none' ? (
                    <form onSubmit={handleRegister} className="space-y-4">
                      <h2 className="text-3xl font-black mb-8 uppercase italic">Utwórz konto</h2>
                      <input name="name" required placeholder="Imię" className="w-full bg-black p-5 rounded-2xl border border-zinc-800 focus:border-blue-600 outline-none font-bold"/>
                      <input name="email" type="email" required placeholder="E-mail" className="w-full bg-black p-5 rounded-2xl border border-zinc-800 focus:border-blue-600 outline-none font-bold"/>
                      <input name="password" type="password" required placeholder="Hasło" className="w-full bg-black p-5 rounded-2xl border border-zinc-800 focus:border-blue-600 outline-none font-bold"/>
                      <button className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-blue-500 hover:text-white transition-all uppercase tracking-widest">Załóż konto</button>
                      <button type="button" onClick={()=>{const e=prompt('E-mail:'); const p=prompt('Hasło:'); if(e&&p) handleLogin({preventDefault:()=>{}, target:{email:{value:e}, password:{value:p}}})}} className="w-full text-[10px] text-zinc-600 font-bold uppercase hover:text-white mt-4">Masz już konto? Zaloguj się</button>
                    </form>
                  ) : (
                    <div className="text-center">
                      <h2 className="text-3xl font-black mb-10 uppercase italic">Weryfikacja</h2>
                      <input value={verCode} onChange={e=>setVerCode(e.target.value)} placeholder="000000" className="w-full bg-black p-6 rounded-3xl text-5xl text-center font-black tracking-[0.5em] mb-8 border-2 border-blue-600 outline-none"/>
                      <button onClick={handleVerify} className="w-full py-6 bg-blue-600 text-white font-black rounded-3xl text-xl shadow-xl shadow-blue-900/40 uppercase">Potwierdź kod</button>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="grid md:grid-cols-3 gap-8">
              {products.map(p=>(
                <div key={p.id} className="bg-zinc-900 p-10 rounded-[3rem] border border-zinc-800 hover:border-blue-600/50 transition-all group">
                  <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">OFERTA</div>
                  <h3 className="text-3xl font-black mb-8 uppercase italic leading-none group-hover:text-blue-500 transition-colors">{p.name}</h3>
                  <div className="flex justify-between items-end pt-8 border-t border-zinc-800">
                    <div><div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Cena pakietu</div><div className="text-4xl font-black tabular-nums">{plnFmt(p.price)}<span className="text-sm font-bold text-zinc-500 ml-1">zł</span></div></div>
                    <button onClick={()=>addToCart(p)} className="p-5 bg-white text-black rounded-3xl hover:scale-110 active:scale-95 transition-all shadow-xl"><Plus className="w-8 h-8"/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {toast && <div className={cls('fixed bottom-10 left-1/2 -translate-x-1/2 px-10 py-5 rounded-full text-sm font-black shadow-2xl z-50 flex items-center gap-4 transition-all', toast.ok ? 'bg-white text-black' : 'bg-red-600 text-white')}>{toast.msg.toUpperCase()}</div>}
    </div>
  );
}
