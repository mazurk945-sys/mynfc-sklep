'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, User, LogOut, Plus, Trash2, QrCode, Package, Key, ChevronRight, X, Check } from 'lucide-react';

export default function NFCStore() {
  const [view, setView] = useState('shop');
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([
    { id: 1, name: 'Karta NFC Single', price: '15.00', type: 'Sztuka' },
    { id: 2, name: 'Pakiet 5 Kart NFC', price: '60.00', type: 'Pakiet' },
    { id: 3, name: 'Pakiet 10 Kart NFC', price: '120.00', type: 'Okazja' }
  ]);
  const [cart, setCart] = useState<any[]>([]);
  const [toast, setToast] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('nfc_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const pop = (msg:string, ok=true) => {
    setToast({msg,ok});
    setTimeout(()=>setToast(null),3000);
  };D
    const addToCart = (p:any) => {
    setCart([...cart, p]);
    pop(`Dodano ${p.name}`);
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const login = fd.get('email');
    const pass = fd.get('password');
    if (login === 'admin' && pass === 'admin') {
      const u = { email: 'admin', role: 'admin', balance: '9999' };
      setUser(u);
      localStorage.setItem('nfc_user', JSON.stringify(u));
      pop('Witaj Adminie!');
      setView('shop');
    } else {
      pop('Błędne dane (Użyj admin/admin)', false);
    }
  };
    return (
    <div style={{minHeight:'100vh', background:'#000', color:'#fff', fontFamily:'sans-serif'}}>
      <nav style={{display:'flex', justifyContent:'space-between', padding:'20px', borderBottom:'1px solid #222'}}>
        <button onClick={()=>setView('shop')} style={{background:'none', border:0, color:'#fff', fontSize:'24px', fontWeight:'900', cursor:'pointer'}}>MYNFC.PL</button>
        <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
          <button onClick={()=>setView('cart')} style={{background:'#111', border:0, color:'#fff', padding:'10px 20px', borderRadius:'10px', cursor:'pointer'}}>Koszyk ({cart.length})</button>
          {user ? (
            <button onClick={()=>{localStorage.removeItem('nfc_user'); window.location.reload();}} style={{color:'#666', background:'none', border:0, cursor:'pointer'}}>Wyloguj</button>
          ) : (
            <button onClick={()=>setView('login')} style={{background:'#fff', color:'#000', border:0, padding:'10px 20px', borderRadius:'10px', fontWeight:'bold', cursor:'pointer'}}>Zaloguj</button>
          )}
        </div>
      </nav>

      <main style={{maxWidth:'1200px', margin:'0 auto', padding:'40px 20px'}}>
        {view === 'shop' && (
          <div>
            <h1 style={{fontSize:'60px', fontWeight:'900', textTransform:'uppercase', fontStyle:'italic', marginBottom:'40px'}}>Karty NFC <span style={{color:'#3b82f6'}}>Dla Ciebie</span></h1>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'20px'}}>
              {products.map(p => (
                <div key={p.id} style={{background:'#111', padding:'40px', borderRadius:'30px', border:'1px solid #222'}}>
                  <div style={{color:'#555', fontSize:'12px', fontWeight:'bold', marginBottom:'10px'}}>{p.type.toUpperCase()}</div>
                  <h3 style={{fontSize:'24px', fontWeight:'bold', marginBottom:'30px'}}>{p.name}</h3>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span style={{fontSize:'32px', fontWeight:'900'}}>{p.price} zł</span>
                    <button onClick={()=>addToCart(p)} style={{background:'#fff', border:0, padding:'15px', borderRadius:'15px', cursor:'pointer'}}><Plus color="#000"/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'login' && (
          <div style={{maxWidth:'400px', margin:'100px auto', background:'#111', padding:'40px', borderRadius:'30px', border:'1px solid #222'}}>
            <h2 style={{marginBottom:'30px', fontSize:'24px'}}>Zaloguj się</h2>
            <form onSubmit={handleLogin} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
              <input name="email" placeholder="Login" style={{background:'#000', border:'1px solid #333', padding:'15px', borderRadius:'10px', color:'#fff'}}/>
              <input name="password" type="password" placeholder="Hasło" style={{background:'#000', border:'1px solid #333', padding:'15px', borderRadius:'10px', color:'#fff'}}/>
              <button style={{background:'#fff', color:'#000', border:0, padding:'15px', borderRadius:'10px', fontWeight:'bold', cursor:'pointer'}}>WEJDŹ</button>
            </form>
          </div>
        )}

        {view === 'cart' && (
          <div style={{maxWidth:'600px', margin:'0 auto', textAlign:'center'}}>
            <h2 style={{fontSize:'40px', marginBottom:'40px'}}>TWÓJ KOSZYK</h2>
            {cart.map((p,i)=>(<div key={i} style={{display:'flex', justifyContent:'space-between', padding:'20px', background:'#111', marginBottom:'10px', borderRadius:'15px'}}><span>{p.name}</span><b>{p.price} zł</b></div>))}
            {cart.length === 0 && <p style={{color:'#555'}}>Koszyk jest pusty</p>}
            <button style={{width:'100%', background:'#3b82f6', color:'#fff', border:0, padding:'20px', borderRadius:'15px', fontWeight:'bold', marginTop:'30px', fontSize:'18px'}}>ZAMÓW I ZAPŁAĆ</button>
          </div>
        )}
      </main>

      {toast && (
        <div style={{position:'fixed', bottom:'40px', left:'50%', transform:'translateX(-50%)', background:'#fff', color:'#000', padding:'15px 40px', borderRadius:'50px', fontWeight:'bold', boxShadow:'0 20px 50px rgba(0,0,0,0.5)', display:'flex', alignItems:'center', gap:'10px'}}>
          {toast.ok ? <Check size={20}/> : <X size={20}/>} {toast.msg.toUpperCase()}
        </div>
      )}
    </div>
  );
}
