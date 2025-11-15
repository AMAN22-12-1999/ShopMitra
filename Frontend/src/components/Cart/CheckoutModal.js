// Frontend/src/components/Cart/CheckoutModal.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { ThemeConsumer } from '../context/ThemeContexts';

export default function CheckoutModal({ open, onClose, value }) {
    const { cart = [], cartSubTotal = 0, cartTax = 0, cartTotal = 0, clearCart } = value;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState(null);

    if (!open) return null;

    const validate = () => {
        if (!name.trim()) { setStatus({ type: 'error', text: 'Please enter your name' }); return false; }
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) { setStatus({ type: 'error', text: 'Enter a valid email' }); return false; }
        if (!address.trim()) { setStatus({ type: 'error', text: 'Please enter address' }); return false; }
        if (!cart.length) { setStatus({ type: 'error', text: 'Cart is empty' }); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);
        if (!validate()) return;

        setSubmitting(true);
        try {
            const payload = {
                buyer: { name: name.trim(), email: email.trim(), address: address.trim() },
                cart: cart.map(item => ({ id: item.id, title: item.title, price: item.price, count: item.count, total: item.total })),
                subtotal: cartSubTotal,
                tax: cartTax,
                total: cartTotal
            };

            const res = await fetch('/api/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus({ type: 'error', text: data?.message || 'Failed to send order' });
            } else {
                setStatus({ type: 'success', text: 'Order placed & email sent! Redirecting…' });
                clearCart();
                // Navigate to success page
                setTimeout(() => {
                    window.location.href = `/success/${data.orderId}`;
                }, 900);
            }
        } catch (err) {
            console.error('checkout error', err);
            setStatus({ type: 'error', text: 'Server error, please try again later' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <Overlay role="dialog" aria-modal="true" aria-label="Checkout">
                    <Card $dark={theme}>
                        <Header>
                            <h2>Complete your order</h2>
                            <small>Enter buyer details to receive order confirmation</small>
                        </Header>

                        <Form onSubmit={handleSubmit}>
                            <Field $dark={theme}>
                                <label>Buyer Name</label>
                                <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
                            </Field>

                            <Field $dark={theme}>
                                <label>Buyer Email</label>
                                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" type="email" />
                            </Field>

                            <Field $dark={theme}>
                                <label>Buyer Address</label>
                                <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Shipping address" rows={3} />
                            </Field>

                            <Totals $dark={theme}>
                                <div>Subtotal</div><div>${Number(cartSubTotal || 0).toFixed(2)}</div>
                                <div>Tax</div><div>${Number(cartTax || 0).toFixed(2)}</div>
                                <div style={{ fontWeight: 800, marginTop: 8 }}>Total</div><div style={{ fontWeight: 800, marginTop: 8 }}>${Number(cartTotal || 0).toFixed(2)}</div>
                            </Totals>

                            {status && <Status $type={status.type}>{status.text}</Status>}

                            <ButtonRow>
                                <Secondary onClick={(e) => { e.preventDefault(); onClose(); }}>{submitting ? 'Please wait…' : 'Cancel'}</Secondary>
                                <Primary type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Save & Send Email'}</Primary>
                            </ButtonRow>
                        </Form>
                    </Card>
                </Overlay>
            )}
        </ThemeConsumer>
    );
}

/* ---------------- styled-components ---------------- */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2,6,23,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 720px;
  background: ${({ $dark }) => ($dark ? '#0b1220' : '#ffffff')};
  color: ${({ $dark }) => ($dark ? '#e5e7eb' : '#0f172a')};
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 18px 40px rgba(2,6,23,0.5);
`;

const Header = styled.div`
  text-align: left;
  h2 { margin: 0 0 6px 0; font-size: 20px; }
  small { color: rgba(148,163,184,0.9); }
`;

const Form = styled.form`
  margin-top: 12px;
  display: grid;
  gap: 12px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
    label {
    font-weight: 700;
    margin-bottom: 6px;
    color: ${({ $dark }) => ($dark ? '#cbd5e1' : '#475569')};
  }
  input, textarea {
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid ${({ $dark }) => ($dark ? '#334155' : '#cbd5e1')};
    background: ${({ $dark }) => ($dark ? '#1e293b' : '#f8fafc')};
    color: ${({ $dark }) => ($dark ? '#f1f5f9' : '#0f172a')};
    outline: none;
    transition: all 0.25s ease;
  }
  input:focus, textarea:focus {
    border-color: ${({ $dark }) => ($dark ? '#60a5fa' : '#2563eb')};
    box-shadow: 0 0 0 3px ${({ $dark }) => ($dark ? '#60a5fa44' : '#2563eb33')};
  }
  textarea { resize: vertical; }
`;

const Totals = styled.div`
  display: grid;
  grid-template-columns: 1fr 90px;
  gap: 6px;
  padding: 12px;
  border-radius: 8px;
  background: ${({ $dark }) => ($dark ? '#1e293b' : '#f1f5f9')};
  color: ${({ $dark }) => ($dark ? '#e2e8f0' : '#334155')};
  font-weight: 600;
`;

const Status = styled.div`
  padding: 8px 10px;
  border-radius: 8px;
  font-weight: 700;
  color: ${({ $type }) => ($type === 'error' ? '#7f1d1d' : '#064e3b')};
  background: ${({ $type }) => ($type === 'error' ? '#fee2e2' : '#ecfdf5')};
`;

const ButtonRow = styled.div`
  display:flex;
  justify-content:flex-end;
  gap: 10px;
  margin-top: 6px;
`;

const Primary = styled.button`
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
`;

const Secondary = styled.button`
  padding: 10px 14px;
  border-radius: 8px;
  border: 2px solid rgba(148,163,184,0.25);
  background: transparent;
  color: inherit;
  font-weight: 700;
  cursor: pointer;
`;
