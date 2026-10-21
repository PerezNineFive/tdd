/* Rotary-phone booking for /book/. Open times come from /api/slots (Cal.com), bookings go to /api/book. */
(function () {
  var root = document.getElementById("booker");
  if (!root) return;
  var $ = function (id) { return document.getElementById(id); };
  var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wheel = $("dial-wheel"), phone = $("phone"), slotsEl = $("slots"), form = $("book-form");
  var days = {}, keys = [], page = 0, day = null, slot = null, spinning = false;
  var STOP = 110; // finger stop angle, degrees clockwise from 12 o'clock

  function fmt(iso, o) { return new Intl.DateTimeFormat("en-US", Object.assign({ timeZone: tz }, o)).format(new Date(iso)); }
  function dayDate(k) { return new Date(k + "T12:00:00Z"); }
  function dayFmt(k, o) { return new Intl.DateTimeFormat("en-US", Object.assign({ timeZone: "UTC" }, o)).format(dayDate(k)); }
  function ymd(d) { return d.toISOString().slice(0, 10); }

  $("tz").textContent = tz.replace(/_/g, " ");

  // ten finger holes, 30 degrees apart, running counterclockwise from about 2 o'clock
  var holes = [];
  for (var i = 0; i < 10; i++) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "hole";
    var a = (60 - 30 * i) * Math.PI / 180;
    b.style.left = (50 + 36 * Math.sin(a)) + "%";
    b.style.top = (50 - 36 * Math.cos(a)) + "%";
    b.dataset.angle = 60 - 30 * i;
    b.addEventListener("click", onHole);
    wheel.appendChild(b); holes.push(b);
  }

  function renderDial() {
    var list = keys.slice(page * 10, page * 10 + 10);
    holes.forEach(function (h, i) {
      var k = list[i];
      h.dataset.day = k || "";
      h.disabled = !k;
      h.setAttribute("aria-pressed", String(!!k && k === day));
      h.innerHTML = k ? "<small>" + dayFmt(k, { weekday: "short" }) + "</small>" + dayFmt(k, { day: "numeric" }) : "<small>&nbsp;</small>·";
      h.setAttribute("aria-label", k ? dayFmt(k, { weekday: "long", month: "long", day: "numeric" }) + ", " + days[k].length + " open times" : "No date");
    });
    $("dial-prev").disabled = page === 0;
    $("dial-next").disabled = (page + 1) * 10 >= keys.length;
    $("dial-range").textContent = list.length ? dayFmt(list[0], { month: "short", day: "numeric" }) + " – " + dayFmt(list[list.length - 1], { month: "short", day: "numeric" }) : "";
    // the center card follows the selected day; otherwise it shows the month the dial opens on
    var shown = day && list.indexOf(day) > -1 ? day : null;
    $("dial-month").textContent = shown ? dayFmt(shown, { month: "short" }) : list.length ? dayFmt(list[0], { month: "short" }) : "";
    $("dial-card-day").textContent = shown ? dayFmt(shown, { day: "numeric" }) : "TDD";
  }

  function onHole(e) {
    var h = e.currentTarget, k = h.dataset.day;
    if (!k || spinning) return;
    pickDay(k);
    if (calm) return;
    spinning = true;
    var turn = ((STOP - Number(h.dataset.angle)) % 360 + 360) % 360;
    var t = 0.25 + turn / 360 * 0.55;
    wheel.style.transition = "transform " + t + "s cubic-bezier(.4,0,.6,1)";
    wheel.style.transform = "rotate(" + turn + "deg)";
    setTimeout(function () {
      wheel.style.transition = "transform " + (t * 1.4) + "s cubic-bezier(.34,1.2,.64,1)";
      wheel.style.transform = "rotate(0deg)";
      setTimeout(function () { spinning = false; }, t * 1400);
    }, t * 1000 + 60);
  }

  function pickDay(k) {
    day = k; slot = null;
    $("day-select").value = k;
    var idx = keys.indexOf(k);
    if (Math.floor(idx / 10) !== page) { page = Math.floor(idx / 10); }
    renderDial();
    $("day-title").textContent = dayFmt(k, { weekday: "long", month: "long", day: "numeric" });
    slotsEl.innerHTML = "";
    days[k].forEach(function (iso) {
      var s = document.createElement("button");
      s.type = "button"; s.className = "slot"; s.setAttribute("aria-pressed", "false");
      s.textContent = fmt(iso, { hour: "numeric", minute: "2-digit" });
      s.addEventListener("click", function () { pickSlot(iso, s); });
      slotsEl.appendChild(s);
    });
    form.hidden = true;
    root.dataset.state = "day";
  }

  function pickSlot(iso, btn) {
    slot = iso;
    slotsEl.querySelectorAll(".slot").forEach(function (s) { s.setAttribute("aria-pressed", String(s === btn)); });
    $("chosen").textContent = fmt(iso, { weekday: "long", month: "long", day: "numeric" }) + " at " + fmt(iso, { hour: "numeric", minute: "2-digit" });
    form.hidden = false;
    $("err").textContent = "";
    root.dataset.state = "time";
    if (window.innerWidth < 900) form.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
    $("f-name").focus({ preventScroll: window.innerWidth < 900 });
  }

  function load() {
    root.dataset.state = "loading";
    var s = new Date(), e = new Date(s.getTime() + 62 * 864e5);
    return fetch("/api/slots/?start=" + ymd(s) + "&end=" + ymd(e) + "&timeZone=" + encodeURIComponent(tz))
      .then(function (r) { if (!r.ok) throw r; return r.json(); })
      .then(function (j) {
        days = {}; keys = [];
        Object.keys(j.days).sort().forEach(function (k) { if (j.days[k].length) { days[k] = j.days[k]; keys.push(k); } });
        if (!keys.length) { root.dataset.state = "empty"; return; }
        var sel = $("day-select");
        sel.innerHTML = '<option value="">Pick a date</option>' + keys.map(function (k) {
          return '<option value="' + k + '">' + dayFmt(k, { weekday: "short", month: "short", day: "numeric" }) + " · " + days[k].length + " times</option>";
        }).join("");
        page = 0; day = null; renderDial();
        $("day-title").textContent = "Dial a day to see open times";
        slotsEl.innerHTML = ""; form.hidden = true;
        root.dataset.state = "ready";
      })
      .catch(function () { root.dataset.state = "error"; });
  }

  $("dial-prev").addEventListener("click", function () { page--; renderDial(); });
  $("dial-next").addEventListener("click", function () { page++; renderDial(); });
  $("day-select").addEventListener("change", function (e) { if (e.target.value) pickDay(e.target.value); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!slot) return;
    var btn = form.querySelector("button[type=submit]");
    btn.disabled = true; btn.classList.add("dialing");
    $("err").textContent = "";
    fetch("/api/book/", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ start: slot, timeZone: tz, name: $("f-name").value, email: $("f-email").value, notes: $("f-notes").value, company: $("f-company").value })
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, j: j }; }); })
      .then(function (x) {
        if (!x.ok) {
          $("err").textContent = x.j.error || "The booking didn't go through. Please try again.";
          if (x.status === 409) load();
          return;
        }
        $("done-when").textContent = $("chosen").textContent;
        $("done-email").textContent = $("f-email").value;
        root.dataset.state = "done";
        phone.classList.add("ringing");
        setTimeout(function () { phone.classList.remove("ringing"); }, 2600);
        $("connected").focus({ preventScroll: true }); $("connected").scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "center" });
        if (window.gtag) gtag("event", "generate_lead", { method: "rotary_booking" });
      })
      .catch(function () { $("err").textContent = "The booking didn't go through. Please try again."; })
      .then(function () { btn.disabled = false; btn.classList.remove("dialing"); });
  });

  $("again").addEventListener("click", function () { form.reset(); load(); });
  load();
})();
