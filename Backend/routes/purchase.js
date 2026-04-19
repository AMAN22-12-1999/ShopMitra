// Backend/routes/purchase.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Buyer = require('../models/Buyer');
require('dotenv').config();

const pdf = require('html-pdf-node'); // lightweight PDF from HTML (no puppeteer download)

// Env
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const MAIL_FROM = process.env.MAIL_FROM || `ShopMitra <no-reply@shopmitra.com>`;

const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || 'http://localhost:5000';
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
const LOGO_URL = process.env.LOGO_URL || 'https://dummyimage.com/160x48/1e40af/ffffff&text=ShopMitra';

/* ---------------- helpers ---------------- */

function generateOrderNumber() {
  const d = new Date();
  const ymd = [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('');
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SM-${ymd}-${rand}`;
}

function escapeHtml(s) {
  if (!s && s !== 0) return '';
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function money(n){ return Number(n || 0).toFixed(2); }

function generateOrderEmailHtml(buyer, items, subtotal, tax, total, orderNumber, links) {
  const itemsHtml = items.map(it => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e6e6e6;">${escapeHtml(it.title)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e6e6e6;text-align:right;">${it.count}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e6e6e6;text-align:right;">₹${money(it.price)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e6e6e6;text-align:right;">₹${money(it.total)}</td>
    </tr>
  `).join('');

  return `
  <!doctype html>
  <html>
  <head><meta charset="utf-8" /><title>Order Confirmation</title></head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial; background:#f4f6f8; margin:0; padding:24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:720px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;">
      <tr>
        <td style="padding:18px 24px;background:linear-gradient(90deg,#1e3a8a,#2563eb);">
          <img src="${LOGO_URL}" alt="ShopMitra" style="height:42px; display:block;" />
        </td>
      </tr>

      <tr>
        <td style="padding:18px 24px;">
          <h1 style="margin:0 0 6px 0;font-size:20px;color:#111827;">Thanks for your purchase, ${escapeHtml(buyer.name)}!</h1>
          <p style="margin:0;color:#374151;">Your order has been received.</p>
          <div style="margin-top:10px;padding:10px 12px;border-radius:8px;background:#f8fafc;border:1px solid #e6eef9;">
            <strong style="color:#111827;">Order #:</strong> <span>${escapeHtml(orderNumber)}</span>
          </div>
        </td>
      </tr>

      <tr>
        <td style="padding:0 24px 18px;">
          <h3 style="margin:0 0 12px 0;font-size:16px;color:#111827;">Order summary</h3>

          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:12px;">
            <thead>
              <tr>
                <th style="text-align:left;padding:8px 12px;border-bottom:2px solid #e6e6e6;">Product</th>
                <th style="text-align:right;padding:8px 12px;border-bottom:2px solid #e6e6e6;">Qty</th>
                <th style="text-align:right;padding:8px 12px;border-bottom:2px solid #e6e6e6;">Price</th>
                <th style="text-align:right;padding:8px 12px;border-bottom:2px solid #e6e6e6;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
            <tr><td style="padding:8px 12px;color:#6b7280;">Subtotal</td><td style="padding:8px 12px;text-align:right;color:#111827;"><strong>₹${money(subtotal)}</strong></td></tr>
            <tr><td style="padding:8px 12px;color:#6b7280;">Tax</td><td style="padding:8px 12px;text-align:right;color:#111827;"><strong>₹${money(tax)}</strong></td></tr>
            <tr><td style="padding:8px 12px;color:#111827;font-weight:700;">Total</td><td style="padding:8px 12px;text-align:right;color:#111827;font-weight:700;"><strong>₹${money(total)}</strong></td></tr>
          </table>

          <div style="margin-top:18px;padding:14px;border-radius:8px;background:#f8fafc;border:1px solid #e6eef9;">
            <h4 style="margin:0 0 6px 0;font-size:14px;">Shipping & Billing</h4>
            <div style="font-size:13px;color:#374151;"><strong>Address:</strong> ${escapeHtml(buyer.address)}</div>
            <div style="font-size:13px;color:#374151;margin-top:6px;"><strong>Email:</strong> ${escapeHtml(buyer.email)}</div>
          </div>

          <p style="margin:18px 0 0 0;font-size:13px;color:#6b7280;">If you have any questions, just reply to this email. Thanks for shopping with ShopMitra!</p>
        </td>
      </tr>

      <tr>
        <td style="padding:12px 24px;background:#f1f5f9;text-align:center;color:#6b7280;font-size:12px;">
          ShopMitra • <span style="opacity:0.9;">no-reply@shopmitra.com</span>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/* ---------------- routes ---------------- */

// Create purchase, send email, save record
router.post('/', async (req, res) => {
  try {
    const { buyer, cart, subtotal, tax, total } = req.body;

    if (!buyer || !buyer.name || !buyer.email || !buyer.address) {
      return res.status(400).json({ message: 'Buyer name, email and address required' });
    }
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: 'Cart must contain at least one item' });
    }

    const orderNumber = generateOrderNumber();

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
    });

    // Save first to get the _id for links
    const saved = await Buyer.create({
      orderNumber,
      name: buyer.name,
      email: buyer.email,
      address: buyer.address,
      items: cart.map(it => ({
        id: it.id,
        title: it.title,
        price: it.price,
        count: it.count,
        total: it.total
      })),
      subtotal: subtotal || 0,
      tax: tax || 0,
      total: total || 0
    });

    const links = {
      success: `${FRONTEND_BASE_URL}/success/${saved._id}`,
      receipt: `${PUBLIC_BASE_URL}/api/purchase/receipt/${saved._id}`
    };

    const html = generateOrderEmailHtml(buyer, cart, subtotal || 0, tax || 0, total || 0, orderNumber, links);
    const mailOptions = {
      from: MAIL_FROM,
      to: buyer.email,
      subject: `Your ShopMitra Order ${orderNumber}`,
      html
    };

    // Try to generate PDF and attach to email
    try {
      const file = { content: html };
      const pdfBuffer = await pdf.generatePdf(file, {
        format: 'A4',
        printBackground: true,
        margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' }
      });

      mailOptions.attachments = [
        { filename: `receipt-${orderNumber}.pdf`, content: pdfBuffer }
      ];
    } catch (pdfErr) {
      console.warn('PDF generation failed; sending email without PDF attachment.', pdfErr);
      // continue without attachment
    }

    const info = await transporter.sendMail(mailOptions);

    return res.json({
      message: 'Order processed',
      orderId: saved._id,
      orderNumber,
      mailInfo: { accepted: info.accepted, messageId: info.messageId },
      links
    });
  } catch (err) {
    console.error('purchase error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get purchase by id (for success page)
router.get('/:id', async (req, res) => {
  try {
    const doc = await Buyer.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ message: 'Order not found' });
    res.json(doc);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Receipt: return PDF (download). Falls back to HTML if PDF generation fails.
router.get('/receipt/:id', async (req, res) => {
  try {
    const doc = await Buyer.findById(req.params.id).lean();
    if (!doc) return res.status(404).send('Order not found');

    const rows = (doc.items || []).map(it => `
      <tr>
        <td>${escapeHtml(it.title)}</td>
        <td style="text-align:right">${it.count}</td>
        <td style="text-align:right">₹${money(it.price)}</td>
        <td style="text-align:right">₹${money(it.total)}</td>
      </tr>
    `).join('');

    const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Receipt ${escapeHtml(doc.orderNumber)}</title>
        <style>
          body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; padding: 24px; color: #0f172a; }
          .card { max-width: 800px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; }
          .brand { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; }
          .brand img { height: 40px; }
          h1 { margin: 8px 0; font-size: 20px; }
          table { width:100%; border-collapse: collapse; }
          th, td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }
          th { text-align: left; }
          .totals td { border: none; }
          .right { text-align: right; }
          .muted { color: #64748b; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="brand">
            <img src="${LOGO_URL}" alt="ShopMitra"/>
            <div>
              <div><strong>ShopMitra</strong></div>
              <div class="muted">Order Receipt</div>
            </div>
          </div>

          <h1>Order # ${escapeHtml(doc.orderNumber)}</h1>
          <div class="muted">Placed: ${new Date(doc.createdAt).toLocaleString()}</div>
          <div style="margin-top:10px;">Buyer: <strong>${escapeHtml(doc.name)}</strong> — ${escapeHtml(doc.email)}</div>
          <div>Address: ${escapeHtml(doc.address)}</div>

          <h3 style="margin-top:18px;">Items</h3>
          <table>
            <thead>
              <tr><th>Product</th><th class="right">Qty</th><th class="right">Price</th><th class="right">Total</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>

          <table style="margin-top:12px;">
            <tr class="totals"><td class="muted">Subtotal</td><td class="right"><strong>₹${money(doc.subtotal)}</strong></td></tr>
            <tr class="totals"><td class="muted">Tax</td><td class="right"><strong>₹${money(doc.tax)}</strong></td></tr>
            <tr class="totals"><td><strong>Total</strong></td><td class="right"><strong>₹${money(doc.total)}</strong></td></tr>
          </table>
        </div>
      </body>
    </html>
    `;

    // Generate PDF and send as download
    try {
      const file = { content: html };
      const pdfBuffer = await pdf.generatePdf(file, {
        format: 'A4',
        printBackground: true,
        margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' }
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=receipt-${doc.orderNumber}.pdf`);
      return res.send(pdfBuffer);
    } catch (e) {
      console.error('PDF generation error, falling back to HTML:', e);
      // fallback to HTML download if PDF fails
      res.setHeader('Content-Disposition', `attachment; filename=receipt-${doc.orderNumber}.html`);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(html);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
});

module.exports = router;
