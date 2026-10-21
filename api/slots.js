// GET /api/slots?start=YYYY-MM-DD&end=YYYY-MM-DD&timeZone=Area/City
// Returns Tony's open times for the discovery call, grouped by day in the visitor's time zone.
const CAL = "https://api.cal.com/v2";
const USER = "anthony-perez-k9pq0t";
const EVENT = "virtual-coffee";
const DAY = /^\d{4}-\d{2}-\d{2}$/;

module.exports = async (req, res) => {
  const { start, end } = req.query;
  let tz = String(req.query.timeZone || "America/New_York");
  try { new Intl.DateTimeFormat("en-US", { timeZone: tz }); } catch { tz = "America/New_York"; }
  if (!DAY.test(start || "") || !DAY.test(end || "")) return res.status(400).json({ error: "start and end must be YYYY-MM-DD" });

  const qs = new URLSearchParams({ username: USER, eventTypeSlug: EVENT, start, end, timeZone: tz });
  try {
    const r = await fetch(`${CAL}/slots?${qs}`, {
      headers: { "cal-api-version": "2024-09-04", Authorization: `Bearer ${process.env.CAL_API_KEY}` },
    });
    const j = await r.json();
    if (!r.ok) return res.status(502).json({ error: "Calendar unavailable" });
    const days = {};
    for (const [d, list] of Object.entries(j.data || {})) days[d] = list.map((s) => s.start);
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    return res.status(200).json({ timeZone: tz, days });
  } catch {
    return res.status(502).json({ error: "Calendar unavailable" });
  }
};
