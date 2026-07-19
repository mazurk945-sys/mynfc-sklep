'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, User, LogOut, Plus, Trash2, QrCode, Package, Key, ChevronRight, X, Check } from 'lucide-react';

export default function NFCStore() {
  const [view, setView] = useState('shop');
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [toast, setToast] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    // Symulacja danych na start, żeby strona nie była pusta
    setProducts([
      { id: 1, name: 'Karta NFC Single', price: '15.00', type: 'single' },
      { id: 2, name: 'Pakiet 5 Kart NFC', price: '60.00', type: 'pack5' },
      { id: 3, name: 'Pakiet 10 Kart NFC', price: '120.00', type: 'pack10' }
    ]);
    const saved = localStorage.getItem('nfc_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const pop = (msg:string, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000); };
  const addToCart = (p:any) => { setCart([...cart, p]); pop(`Dodano ${p.name}`); };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4">
      <nav className="max-w-7xl mx-auto flex justify-between items-center py-6 border-b border-zinc-900">
        <button onClick={()=>setView('shop')} className="text-2xl font-black italic tracking-tighter">MYNFC.PL</button>
        <div className="flex gap-6 items-center">
          <button onClick={()=>setView('cart')} className="relative bg-zinc-900 p-3 rounded-2xl">
            <ShoppingCart className="w-5 h-5"/>
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-blue-600 text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cart.length}</span>}
          </button>
          {user ? (
            <button onClick={()=>{localStorage.removeItem('nfc_user'); window.location.reload();}} className="text-xs font-bold text-zinc-500 uppercase">Wyloguj</button>
          ) : (
            <button onClick={()=>{const login=prompt('Login:'); if(login==='admin'){setUser({email:'admin', role:'admin'}); localStorage.setItem('nfc_user', JSON.stringify({email:'admin', role:'admin'})); pop('Witaj Admin!');}}} className="bg-white text-black px-6 py-2 rounded-xl font-bold text-xs uppercase">Zaloguj</button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-20">
        {view === 'shop' && (
          <div>
            <h1 className="text-7xl font-black uppercase italic mb-16 leading-none">Karty NFC <span className="text-blue-600">Dla Ciebie</span></h1>
            <div className="grid md:grid-cols-3 gap-8">
              {products.map(p => (
                <div key={p.id} className="bg-zinc-900 p-10 rounded-[3rem] border border-zinc-800 hover:border-blue-600 transition-all">
                  <h3 className="text-3xl font-black uppercase mb-4">{p.name}</h3>
                  <div className="flex justify-between items-end mt-10">
                    <div className="text-4xl font-black">{p.price} zł</div>
                    <button onClick={()=>addToCart(p)} className="bg-white text-black p-4 rounded-2xl hover:scale-110 transition-all"><Plus/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-xl mx-auto">
            <h2 className="text-5xl font-black mb-10 italic uppercase">Koszyk</h2>
            <div className="bg-zinc-900 p-10 rounded-[3rem] border border-zinc-800">
              {cart.map((p,i)=>(<div key={i} className="flex justify-between py-4 border-b border-zinc-800 font-bold"><span>{p.name}</span><span>{p.price} zł</span></div>))}
              {cart.length === 0 && <p className="text-zinc-500 py-10">Twój koszyk jest pusty</p>}
              <button className="w-full py-5 bg-blue-600 rounded-2xl font-black mt-10 uppercase tracking-widest">Kupuję Teraz</button>
            </div>
          </div>
        )}
      </main>

      {toast && <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white text-black px-10 py-5 rounded-full font-black shadow-2xl flex items-center gap-3 animate-bounce"> {toast.ok ? <Check/> : <X/>} {toast.msg.toUpperCase()} </div>}
    </div>
  );
}
