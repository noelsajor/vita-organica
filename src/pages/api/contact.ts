export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const TO = 'alex@vitaorganicasupps.com';
const FROM = 'submissions@vitaorganicasupps.com';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { type, ...fields } = data;

    if (!type || !fields.email) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Honeypot check
    if (fields.b_name) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    let subject = '';
    let html = '';

    if (type === 'quote') {
      subject = `New Quote Request — ${fields.name} (${fields.company})`;
      html = `
        <h2 style="color:#1a2e1a">New Quote Request</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:500px">
          <tr><td><strong>Name</strong></td><td>${fields.name}</td></tr>
          <tr><td><strong>Email</strong></td><td>${fields.email}</td></tr>
          <tr><td><strong>Company</strong></td><td>${fields.company}</td></tr>
          <tr><td><strong>Format</strong></td><td>${fields.format}</td></tr>
          <tr><td><strong>Quantity</strong></td><td>${fields.quantity || '—'}</td></tr>
          <tr><td><strong>Timeline</strong></td><td>${fields.timeline}</td></tr>
        </table>
      `;
    } else if (type === 'guide') {
      subject = `Guide Download — ${fields.firstName} (${fields.email})`;
      html = `
        <h2 style="color:#1a2e1a">Manufacturing Starter Guide Download</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:500px">
          <tr><td><strong>Name</strong></td><td>${fields.firstName}</td></tr>
          <tr><td><strong>Email</strong></td><td>${fields.email}</td></tr>
          <tr><td><strong>Interest</strong></td><td>${fields.interest || '—'}</td></tr>
        </table>
      `;
    } else if (type === 'mockup') {
      subject = `Mockup Export — ${fields.format} (${fields.email})`;
      html = `
        <h2 style="color:#1a2e1a">Mockup Export Request</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:500px">
          <tr><td><strong>Email</strong></td><td>${fields.email}</td></tr>
          <tr><td><strong>Format</strong></td><td>${fields.format}</td></tr>
        </table>
      `;
    } else {
      return new Response(JSON.stringify({ error: 'Unknown form type' }), { status: 400 });
    }

    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: fields.email,
      subject,
      html,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Email error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
