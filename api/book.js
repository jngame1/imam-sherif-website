const CAL_API_KEY = process.env.CAL_API_KEY;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { start, eventTypeId, attendee, metadata } = req.body || {};

  if (!start || !eventTypeId || !attendee) {
    return res.status(400).json({ error: 'Missing required fields: start, eventTypeId, attendee' });
  }

  try {
    const payload = { start, eventTypeId, attendee };
    if (metadata && Object.keys(metadata).length) payload.metadata = metadata;

    const r = await fetch('https://api.cal.com/v2/bookings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CAL_API_KEY}`,
        'cal-api-version': '2024-08-13',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await r.json();
    res.setHeader('Cache-Control', 'no-store');
    res.status(r.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
