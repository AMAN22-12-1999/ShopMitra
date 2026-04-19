// Frontend/src/components/Cart/CheckoutModal.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { ThemeConsumer } from '../context/ThemeContexts';
import Loader from '../Loader';

export default function CheckoutModal({ open, onClose, value }) {
  const { cart = [], cartSubTotal = 0, cartTax = 0, cartTotal = 0, clearCart } = value;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [processing, setProcessing] = useState(false)
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
      // 1️⃣ Create Razorpay order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal })
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error("Failed to create payment order");
      }

      const options = {
        key: "rzp_test_ScepFV5nxfMr3m",
        amount: orderData.order.amount,
        currency: "INR",
        name: "ShopMitra",
        description: "Order Payment",
        order_id: orderData.order.id,

        config: {
          display: {
            blocks: {
              netbankingBlock: {
                name: "Netbanking",
                instruments: [
                  {
                    method: "netbanking"
                  }
                ]
              },
              walletBlock: {
                name: "Wallets",
                instruments: [
                  {
                    method: "wallet"
                  }
                ]
              }
            },
            // Define the order in which they appear
            sequence: ["block.netbankingBlock", "block.walletBlock"],
            preferences: {
              show_default_blocks: false // Hides Cards, UPI, Pay Later, etc.
            }
          }
        },

        handler: async function (response) {
          console.log("PAYMENT SUCCESS RESPONSE:", response);

          setProcessing(true);
          setStatus({ type: 'success', text: 'Payment received! Finalizing order and sending email...' });
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });

            const verifyData = await verifyRes.json();
            console.log("VERIFY RESPONSE:", verifyData);

            if (!verifyData.success) {
              alert("Payment verification failed");
              return;
            }

            console.log("CALLING PURCHASE API...");

            const purchaseRes = await fetch('/api/purchase', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                buyer: { name, email, address },
                cart,
                subtotal: cartSubTotal,
                tax: cartTax,
                total: cartTotal
              })
            });

            const data = await purchaseRes.json();
            console.log("PURCHASE RESPONSE:", data);

            clearCart();
            window.location.href = `/success/${data.orderId}`;

          } catch (err) {
            console.error("Final step error:", err);
            alert("Order failed after payment");
          }
        },

        prefill: {
          name,
          email
        },

        theme: {
          color: "#2563eb"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', text: 'Payment failed' });
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
              <h2>{processing ? 'Processing Payment...' : 'Complete your order'}</h2>
              {!processing && <small>Enter buyer details to receive order confirmation</small>}
            </Header>

            {processing ? (
              <ProcessingState $dark={theme}>
                <Loader />
                <h3>Generating your receipt...</h3>
                <p>Please do not close or refresh this window. We are preparing your order and sending the confirmation email.</p>
              </ProcessingState>
            ) : (<Form onSubmit={handleSubmit}>
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
                <div>Subtotal</div><div>₹{Number(cartSubTotal || 0).toFixed(2)}</div>
                <div>Tax</div><div>₹{Number(cartTax || 0).toFixed(2)}</div>
                <div style={{ fontWeight: 800, marginTop: 8 }}>Total</div><div style={{ fontWeight: 800, marginTop: 8 }}>₹{Number(cartTotal || 0).toFixed(2)}</div>
              </Totals>

              {status && <Status $type={status.type}>{status.text}</Status>}

              <ButtonRow>
                <Secondary onClick={(e) => { e.preventDefault(); onClose(); }}>{submitting ? 'Please wait…' : 'Cancel'}</Secondary>
                <Primary type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Save & Send Email'}</Primary>
              </ButtonRow>
            </Form>)}
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


const ProcessingState = styled.div`
  text-align: center;
  padding: 40px 20px;
  
  h3 {
    margin-top: 24px;
    margin-bottom: 8px;
    font-size: 20px;
    color: ${({ $dark }) => ($dark ? '#60a5fa' : '#2563eb')};
  }
  
  p {
    color: ${({ $dark }) => ($dark ? '#94a3b8' : '#64748b')};
    font-size: 14px;
    line-height: 1.5;
  }
`;
