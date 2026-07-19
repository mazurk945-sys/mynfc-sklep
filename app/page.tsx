'use client';
import React, { useState } from 'react';
import { ShoppingCart, Plus, LogOut, Package, ChevronRight } from 'lucide-react';

export default function NFCStore() {
  const [view, setView] = useState('shop');
  const [cart, setCart] = useState<any[]>([]);
  const products = [
    { id: 1, name: 'Karta NFC Single', price: '15.00', desc: 'Jedna karta, Twoje logo.' },
    { id: 2, name: 'Pakiet 5 Kart NFC', price: '60.00', desc: 'Zestaw dla firmy.' },
    { id: 3, name: 'Pakiet 10 Kart NFC', price: '120.00', desc: 'Najlepsza oferta.' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      {/* Menu */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #222', alignItems: 'center' }}>
        <div onClick={() => setView('shop')} style={{ fontSize: '24px', fontWeight: '900', cursor: 'pointer', fontStyle: 'italic' }}>MYNFC.PL</div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => setView('shop')} style={{ background: 'none', border: 0, color: '#fff', cursor: 'pointer' }}>Sklep</button>
          <button onClick={() => setView('cart')} style={{ background: '#111', border: '1px solid #333', color: '#fff', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer' }}>
            Koszyk ({cart.length})
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        {view === 'shop' && (
          <div>
            <h1 style={{ fontSize: '50px', fontWeight: '900', marginBottom: '10px' }}>KARTY NFC <span style={{ color: '#3b82f6' }}>DLA CIEBIE</span></h1>
            <p style={{ color: '#666', marginBottom: '50px' }}>Profesjonalne karty z Twoim logo i linkiem.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {products.map(p => (
                <div key={p.id} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '30px', borderRadius: '25px' }}>
                  <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>{p.name}</h3>
                  <p style={{ color: '#444', fontSize: '14px', marginBottom: '30px' }}>{p.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '24px', fontWeight: '900' }}>{p.price} zł</span>
                    <button onClick={() => {setCart([...cart, p]); alert('Dodano!');}} style={{ background: '#fff', border: 0, padding: '10px', borderRadius: '12px', cursor: 'pointer' }}>
                      <Plus size={20} color="#000"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '30px', marginBottom: '30px' }}>TWÓJ KOSZYK</h2>
            {cart.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #222' }}>
                <span>{p.name}</span><b>{p.price} zł</b>
              </div>
            ))}
            {cart.length === 0 && <p style={{ color: '#444' }}>Koszyk jest pusty.</p>}
            <button style={{ width: '100%', padding: '20px', marginTop: '30px', background: '#3b82f6', color: '#fff', border: 0, borderRadius: '15px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
              PRZEJDŹ DO PŁATNOŚCI
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
