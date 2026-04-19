// Frontend/src/pages/OrderSuccess.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { ThemeConsumer } from '../components/context/ThemeContexts';

const money = n => Number(n || 0).toFixed(2);

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(`/api/purchase/${orderId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Failed to load order');
        if (!ignore) setOrder(data);
      } catch (e) {
        setError(e.message);
      }
    })();
    return () => { ignore = true; };
  }, [orderId]);

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <Page $dark={theme}>
          <Inner>
            <Card $dark={theme}>
              <Header>
                <h1>Order Successful</h1>
                <p>Thank you for shopping with ShopMitra!</p>
              </Header>

              {error && <Notice $type="error">{error}</Notice>}

              {!order ? (
                <p>Loading order…</p>
              ) : (
                <>
                  <Meta>
                    <div><strong>Order #</strong> {order.orderNumber}</div>
                    <div><strong>Placed</strong> {new Date(order.createdAt).toLocaleString()}</div>
                  </Meta>

                  <Buyer>
                    <div><strong>Name:</strong> {order.name}</div>
                    <div><strong>Email:</strong> {order.email}</div>
                    <div><strong>Address:</strong> {order.address}</div>
                  </Buyer>

                  <Table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th className="right">Qty</th>
                        <th className="right">Price</th>
                        <th className="right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(order.items || []).map((it, idx) => (
                        <tr key={idx}>
                          <td>{it.title}</td>
                          <td className="right">{it.count}</td>
                          <td className="right">₹{money(it.price)}</td>
                          <td className="right">₹{money(it.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <Totals>
                    <div>Subtotal</div><div className="right">₹{money(order.subtotal)}</div>
                    <div>Tax</div><div className="right">₹{money(order.tax)}</div>
                    <div className="bold">Total</div><div className="right bold">₹{money(order.total)}</div>
                  </Totals>

                  <Actions>
                    {/* <a
                      href={`/api/purchase/receipt/${orderId}`}
                      className="btn"
                    >
                      Download Receipt
                    </a> */}
                    <Link to="/" className="btn alt">Continue Shopping</Link>
                  </Actions>
                </>
              )}
            </Card>
          </Inner>
        </Page>
      )}
    </ThemeConsumer>
  );
}

/* ---------------- styled ---------------- */

const Page = styled.div`
  min-height: 100vh;
  background: ${({ $dark }) => ($dark ? '#0f172a' : '#e5ebf1')};
  padding: 36px 0 64px;
`;

const Inner = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Card = styled.div`
  background: ${({ $dark }) => ($dark ? '#111827' : '#ffffff')};
  color: ${({ $dark }) => ($dark ? '#e5e7eb' : '#0f172a')};
  border-radius: 16px;
  padding: 22px;
  box-shadow: ${({ $dark }) =>
    $dark ? '0 18px 40px rgba(0,0,0,.35)' : '0 14px 28px rgba(0,0,0,.08)'};
`;

const Header = styled.div`
  h1 { margin: 0 0 6px; font-size: 22px; }
  p { margin: 0; color: #6b7280; }
`;

const Notice = styled.div`
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: ${({ $type }) => $type === 'error' ? '#fee2e2' : '#ecfeff'};
  color: ${({ $type }) => $type === 'error' ? '#7f1d1d' : '#155e75'};
  font-weight: 700;
`;

const Meta = styled.div`
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 10px; margin-top: 14px;
`;

const Buyer = styled.div`
  margin-top: 10px; display: grid; gap: 4px;
  color: #94a3b8;
`;

const Table = styled.table`
  width: 100%; border-collapse: collapse; margin-top: 16px;
  th, td { padding: 8px 10px; border-bottom: 1px solid rgba(148,163,184,.25); }
  .right { text-align: right; }
`;

const Totals = styled.div`
  margin-top: 12px; display: grid; grid-template-columns: 1fr 160px;
  gap: 6px;
  .right { text-align: right; }
  .bold { font-weight: 800; }
`;

const Actions = styled.div`
  margin-top: 16px; display: flex; gap: 10px; flex-wrap: wrap;
  .btn {
    display: inline-block; text-decoration: none;
    padding: 10px 14px; border-radius: 10px; font-weight: 800;
    background: #2563eb; color: #fff;
  }
  .btn.alt {
    background: transparent; color: #2563eb; border: 2px solid #2563eb;
  }
`;
