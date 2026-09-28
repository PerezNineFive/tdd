import Link from "next/link"
import { Badge, Arrow } from "./ui"

/* ──────────────────────────────────────────────────────────────
   ABOUT
────────────────────────────────────────────────────────────── */
export function About() {
  const PILLS = [
    "Brand Identity", "UX/UI Systems", "Creative Strategy",
    "Visual Systems", "AI-Assisted Design", "Typography",
  ]

  return (
    <section id="about" className="section about">
      <div className="section-num-bg" aria-hidden="true">02</div>
      <div className="about-grid">
        {/* Image */}
        <div className="rv">
          <div style={{ position: "relative" }}>
            <div className="about-frame">
              {/* Placeholder — swap for <Image> when photo is ready */}
              <svg width="100" height="100" viewBox="0 0 80 80" fill="none" opacity={0.18}>
                <rect x="4" y="4" width="72" height="72" fill="#FF4500" />
                <rect x="9" y="9" width="62" height="62" stroke="rgba(12,12,11,0.3)" strokeWidth="1.5" fill="none" />
                <line x1="16" y1="28" x2="64" y2="28" stroke="rgba(12,12,11,0.25)" strokeWidth="1.2" />
                <line x1="16" y1="54" x2="64" y2="54" stroke="rgba(12,12,11,0.25)" strokeWidth="1.2" />
                <text x="40" y="47" fontFamily="var(--font-syne), sans-serif" fontWeight="800" fontSize="22" fill="rgba(12,12,11,0.7)" textAnchor="middle">TDD</text>
                <text x="40" y="23" fontFamily="var(--font-syne), sans-serif" fontWeight="700" fontSize="5" fill="rgba(12,12,11,0.35)" textAnchor="middle" letterSpacing={1.5}>TONY DOES DESIGN</text>
              </svg>
              <div className="about-tag">Tony · Brand Designer</div>
            </div>
            <div className="about-box" />
          </div>
        </div>

        {/* Copy */}
        <div>
          <Badge text="About" />
          <h2 className="section-title rv d1">
            The designer <em>who broke out</em> of the machine.
          </h2>
          <blockquote className="about-quote rv d2">
            &ldquo;I spent over a decade building design systems inside a public utility —
            where getting it wrong has real consequences.&rdquo;
          </blockquote>
          <div className="about-body rv d3">
            <p>
              Hey, I&apos;m <strong>Tony</strong> — Philadelphia-born. Puerto Rican roots.
              12+ years of institutional design thinking, now applied to brands that want
              to <strong>actually mean something</strong>.
            </p>
            <p>
              I&apos;ve shipped design systems for a public utility serving 500,000+
              customers, led go-to-market visual strategy for an AI-powered SaaS platform,
              and built brand identities for founders who are done blending in. I bring{" "}
              <strong>institutional rigor to personal brands</strong> — and street-level
              instinct to enterprise work.
            </p>
          </div>
          <div className="pills rv d4">
            {PILLS.map((p) => <span key={p} className="pill">{p}</span>)}
          </div>
          <Link href="/#contact" className="btn-primary rv d4">
            Work With Me <Arrow />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────
   SERVICES
────────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    tag:   "01 · Foundation",
    name:  "Brand Sprint",
    price: "From $2,500 · 2 weeks",
    desc:  "For founders who need a strong brand foundation fast. Core identity system — logo, color, type, usage — no filler.",
    feats: ["Logo mark + wordmark", "Color & typography system", "Brand usage guidelines", "3 social templates"],
    cta:   "Get Started",
    featured: false,
  },
  {
    tag:   "02 · Signature",
    name:  "Brand Identity System",
    price: "From $6,500 · 4–6 weeks",
    desc:  "The full build. Strategy, identity, guidelines, and collateral — everything your brand needs to show up at the level you're moving toward.",
    feats: ["Brand strategy & positioning", "Full identity system", "50+ page brand guidelines", "Digital & print asset library", "30-day post-launch support"],
    cta:   "Book a Call",
    featured: true,
  },
  {
    tag:   "03 · Ongoing",
    name:  "Creative Retainer",
    price: "From $1,800/mo · Rolling",
    desc:  "Your brand in motion. Monthly design partnership for teams that need consistent, high-quality creative without the overhead.",
    feats: ["40 hrs/mo design time", "Brand management & evolution", "Social content & templates", "Priority turnaround"],
    cta:   "Enquire",
    featured: false,
  },
]

export function Services() {
  return (
    <section id="services" className="section services">
      <div className="section-num-bg" aria-hidden="true">03</div>
      <div className="services-intro">
        <div>
          <Badge text="Services" />
          <h2 className="section-title rv">What I build <em>for you.</em></h2>
        </div>
        <p className="services-note rv d1">
          Every engagement starts with strategy. The visuals follow. No logo-first, no
          shortcuts — just deliberate design work that gives your brand a reason to exist
          and a way to win.
        </p>
      </div>

      <div className="services-grid">
        {SERVICES.map((s) => (
          <div key={s.tag} className={`service-card rv${s.featured ? " featured" : ""}`}>
            <div className="service-tag">{s.tag}</div>
            <div className="service-name">{s.name}</div>
            <div className="service-price">{s.price}</div>
            <div className="service-divider" />
            <p className="service-desc">{s.desc}</p>
            <ul className="service-feats">
              {s.feats.map((f) => <li key={f} className="service-feat">{f}</li>)}
            </ul>
            <Link href="/#contact" className="service-link">
              {s.cta} <Arrow size={14} />
            </Link>
          </div>
        ))}
      </div>

      <div className="services-footer rv">
        <p className="services-footer-text">
          <strong>Not sure which fits?</strong> Book a free discovery call — 30 minutes,
          no pressure, just an honest look at what your brand needs.
        </p>
        <Link href="/#contact" className="btn-primary">
          Book Free Call <Arrow />
        </Link>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────
   PROCESS
────────────────────────────────────────────────────────────── */
const STEPS = [
  {
    n: "01", name: "Discovery",
    desc: "A deep-dive into your business, market, audience, and ambitions. We align on what success looks like before a single pixel is touched.",
    del:  "Brand audit, competitor map, positioning brief, creative direction doc.",
  },
  {
    n: "02", name: "Strategy",
    desc: "We define your brand's position, voice, and story. This is the foundation everything else is built on — and the phase most agencies skip.",
    del:  "Brand strategy deck, messaging framework, visual direction board.",
  },
  {
    n: "03", name: "Design",
    desc: "Concept development, refinement, and presentation. You'll see 2–3 distinct directions before we commit to the one that's right.",
    del:  "3 initial concepts, 2 rounds of refinements, final identity system.",
  },
  {
    n: "04", name: "Production",
    desc: "Your brand system gets built out in full — every format, every use case, every size. Meticulous and production-ready.",
    del:  "Print files, digital files, social templates, web-ready exports.",
  },
  {
    n: "05", name: "Handoff & Launch",
    desc: "You leave with everything needed to deploy your brand with confidence across digital, print, and social — plus a walkthrough so you understand every decision.",
    del:  "Brand guidelines (50+ pages), asset library, 60-min handoff call, 30-day post-launch support.",
  },
]

export function Process() {
  return (
    <section id="process" className="section process">
      <div className="section-num-bg" aria-hidden="true">04</div>
      <div className="process-head">
        <div>
          <Badge text="Process" />
          <h2 className="section-title rv">How we get <em>there, together.</em></h2>
        </div>
        <p className="section-body rv d1">
          Every project follows the same five-phase framework — built to protect your
          investment, keep us aligned, and produce work that lands.
        </p>
      </div>

      <div>
        {STEPS.map((s, i) => (
          <div key={s.n} className={`process-step rv d${Math.min(i + 1, 4)}`}>
            <div className="step-num-col">
              <span className="step-num">{s.n}</span>
            </div>
            <div className="step-content">
              <div>
                <div className="step-name">{s.name}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
              <div className="step-deliverable">
                <div className="step-del-label">Deliverable</div>
                <div className="step-del-text">{s.del}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
