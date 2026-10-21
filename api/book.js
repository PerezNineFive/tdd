// POST /api/book  { start, name, email, notes, timeZone, company }
// Books the 30-minute discovery call on Cal.com. Cal.com sends the invite and Cal Video link.
const CAL = "https://api.cal.com/v2";
const EVENT_ID = 7582505; // cal.com/anthony-perez-k9pq0t/virtual-coffee
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  if (b.company) return res.status(200).json({ ok: true }); // honeypot: bots fill the hidden field

  const name = String(b.name || "").trim().slice(0, 120);
  const email = String(b.email || "").trim().slice(0, 200);
  const notes = String(b.notes || "").trim().slice(0, 2000);
  const start = new Date(b.start || "");
  let tz = String(b.timeZone || "America/New_York");
  try { new Intl.DateTimeFormat("en-US", { timeZone: tz }); } catch { tz = "America/New_York"; }
  if (!name || !EMAIL.test(email) || isNaN(start)) return res.status(400).json({ error: "Please add your name, a valid email and a time." });

  try {
    const r = await fetch(`${CAL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "cal-api-version": "2024-08-13", Authorization: `Bearer ${process.env.CAL_API_KEY}` },
      body: JSON.stringify({
        start: start.toISOString(),
        eventTypeId: EVENT_ID,
        attendee: { name, email, timeZone: tz, language: "en" },
        bookingFieldsResponses: notes ? { notes } : {},
        metadata: { source: "tonydoesdesign.com" },
      }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.status !== "success") {
      const msg = JSON.stringify(j.error || j).toLowerCase();
      const taken = msg.includes("available") || msg.includes("booked") || msg.includes("conflict");
      return res.status(taken ? 409 : 502).json({ error: taken ? "That time was just taken. Please pick another." : "The booking didn't go through. Please try again." });
    }
    return res.status(200).json({ ok: true, start: j.data.start, uid: j.data.uid });
  } catch {
    return res.status(502).json({ error: "The booking didn't go through. Please try again." });
  }
};
