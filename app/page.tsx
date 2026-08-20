"use client";

import { useState } from "react";
import { cityToSlug, locationUnverifiedStartups, mappedStartups, startups } from "./data";

const palette = ["#ff6b35", "#7c5cff", "#00a896", "#ffd166", "#ef476f", "#118ab2", "#06d6a0"];
const groupedCities = new Map<string, typeof mappedStartups>();
mappedStartups.forEach((startup) => groupedCities.set(startup.city, [...(groupedCities.get(startup.city) || []), startup]));
const cities = [...groupedCities.entries()].map(([name, companies], index) => {
  const lat = companies.reduce((sum, company) => sum + company.lat, 0) / companies.length;
  const lng = companies.reduce((sum, company) => sum + company.lng, 0) / companies.length;
  return {
    name,
    count: companies.length,
    x: Math.max(8, Math.min(90, 12 + ((lng - 68) / 29) * 72)),
    y: Math.max(7, Math.min(91, 8 + ((37 - lat) / 31) * 82)),
    color: palette[index % palette.length],
  };
}).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

export default function Home() {
  const [activeCity, setActiveCity] = useState("All India");
  const [query, setQuery] = useState("");
  const openCity = (name: string) => {
    setActiveCity(name);
    window.location.assign(`/${cityToSlug(name)}`);
  };
  const runSearch = () => {
    const value = query.trim();
    if (!value) { window.location.href = "/explore"; return; }
    const lower = value.toLowerCase();
    const city = cities.find((item) => lower.includes(item.name.toLowerCase()) || (item.name === "Bengaluru" && lower.includes("bangalore")));
    const technology = ["java", "python", "go", "react", "typescript", "node.js", "kubernetes", "aws"].find((item) => lower.includes(item));
    const base = city ? `/${cityToSlug(city.name)}` : technology ? `/tech/${technology.replace("node.js", "nodejs")}` : "/explore";
    window.location.href = `${base}?q=${encodeURIComponent(value)}${lower.includes("hiring") ? "&hiring=true" : ""}`;
  };
  return (
    <main>
      <nav className="nav shell">
        <a className="brand" href="/"><span className="brandMark">ISM</span><span>India Startup Map</span></a>
        <div className="navLinks"><a href="/explore">Explore</a><a href="/remote">Remote companies</a><a href="/tech">Tech stacks</a><a href="/submit">Add a startup</a><a href="https://github.com/srbmaury/India-Startup-Map" target="_blank" rel="noreferrer">GitHub ↗</a></div>
        <a className="navButton warningButton" href="/location-unverified">{locationUnverifiedStartups.length} locations need review</a><button className="navButton" onClick={() => { window.location.href = "/explore"; }}>Browse companies <span>↗</span></button>
      </nav>
      <section className="hero shell">
        <div className="eyebrow"><span className="pulse" /> Mapping India’s builders, city by city</div>
        <h1>Explore India&apos;s<br/><em>Startup Ecosystem.</em></h1>
        <p className="lead">Discover ambitious companies by city, sector, stage, and the technologies they use. Built for curious builders and engineers.</p>
        <div className="searchBox"><span className="searchIcon">⌕</span><input aria-label="Search startups" placeholder="Try “AI companies hiring in Hyderabad”" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") runSearch(); }} /><span className="shortcut">⌘ K</span><button onClick={runSearch}>Search</button></div>
        <div className="quickLinks"><span>Popular:</span><a href="/tech/java">Java</a><a href="/tech/python">Python</a><a href="/bangalore?sector=fintech">FinTech</a><a href="/?hiring=true">Hiring now</a></div>
      </section>
      <section className="explorer shell" id="explore">
        <div className="mapPanel">
          <div className="mapTop"><div><span className="liveDot"/> LIVE ECOSYSTEM MAP</div><button onClick={() => { window.location.href = activeCity === "All India" ? "/explore" : `/${cityToSlug(activeCity)}`; }}>Explore ↗</button></div>
          <div className="indiaMap" aria-label="Map of startup cities in India"><div className="mapGrid" /><div className="indiaShape" />
            {cities.slice(0, 10).map((city) => <button key={city.name} aria-label={`${city.name}: ${city.count} companies`} title={`${city.name} — ${city.count} companies`} className={`mapPin major ${activeCity === city.name ? "active" : ""}`} style={{ left: `${city.x}%`, top: `${city.y}%`, "--pin": city.color } as React.CSSProperties} onClick={() => openCity(city.name)}><span>{city.count.toLocaleString()}</span><b>{city.name}</b></button>)}
            <div className="mapLegend"><span>●</span> Startup density <i/> HIGH</div>
          </div>
        </div>
        <aside className="cityPanel"><div className="sectionLabel">EXPLORE BY CITY <span>{String(cities.length).padStart(2, "0")} ECOSYSTEMS</span></div>
          <button className={`cityRow all ${activeCity === "All India" ? "selected" : ""}`} onClick={() => { window.location.href = "/explore"; }}><span>All mapped cities</span><b>{mappedStartups.length}</b><i>→</i></button>
          <div className="cityScroll">
            {cities.map((city, i) => <button key={city.name} className={`cityRow ${activeCity === city.name ? "selected" : ""}`} onClick={() => openCity(city.name)}><small>{String(i + 1).padStart(2, "0")}</small><span>{city.name}</span><b>{city.count.toLocaleString()}</b><i>→</i></button>)}
          </div>
        </aside>
      </section>
      <section className="stats shell"><div><strong>{mappedStartups.length}</strong><span>LOCATIONS MAPPED</span></div><div><strong>{new Set(mappedStartups.map(item=>item.city)).size}</strong><span>ACTIVE CITIES</span></div><div><strong>{locationUnverifiedStartups.length}</strong><span>LOCATION UNKNOWN</span></div><div><strong>{new Set(startups.flatMap((item) => item.tech)).size}</strong><span>TECHNOLOGIES</span></div></section>
    </main>
  );
}
