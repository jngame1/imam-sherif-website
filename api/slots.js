const CAL_API_KEY = process.env.CAL_API_KEY;

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { eventTypeId, startTime, endTime, timeZone = 'America/New_York' } = req.query;

  if (!eventTypeId || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required params: eventTypeId, startTime, endTime' });
  }

  try {
    const url = new URL('https://api.cal.com/v2/slots/available');
    url.searchParams.set('startTime', startTime);
    url.searchParams.set('endTime', endTime);
    url.searchParams.set('eventTypeId', eventTypeId);
    url.searchParams.set('timeZone', timeZone);

    const r = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${CAL_API_KEY}`,
        'cal-api-version': '2024-08-13'
      }
    });

    const data = await r.json();
    res.setHeader('Cache-Control', 'no-store');
    res.status(r.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
