"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Stamp } from "./ui"

const NAV_LINKS = [
  { href: "/#about",    label: "About"    },
  { href: "/#services", label: "Services" },
  { href: "/#process",  label: "Process"  },
  { href: "/shop",      label: "Shop"     },
  { href: "/#contact",  label: "Contact"  },
]

export default function Nav() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  return (
    <>
      {/* ── DESKTOP NAV ── */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <Link href="/" className="nav-logo">
          <Stamp size={28} />
          TDD<span className="dot">.</span>
        </Link>

        <ul className="nav-links">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>

        <Link href="/#contact" className="nav-cta">
          Book a Call
        </Link>

        <button
          className="hamburger"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* ── MOBILE NAV ── */}
      <div className={`mobile-nav${mobileOpen ? " open" : ""}`} aria-hidden={!mobileOpen}>
        <button
          className="mobile-nav-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          ×
        </button>
        <ul>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} onClick={() => setMobileOpen(false)}>{label}</Link>
            </li>
          ))}
        </ul>
        <Link href="/#contact" className="mobile-nav-btn" onClick={() => setMobileOpen(false)}>
          Book a Discovery Call
        </Link>
      </div>
    </>
  )
}
