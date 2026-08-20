import { notFound } from "next/navigation";
import { remoteWork, startupLinks, startupSources, startups } from "../../data";

export default async function StartupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const startup = startups.find((item) => item.slug === slug);
  if (!startup) notFound();
  const links = startupLinks[startup.slug];
  const locationPrecision = "locationPrecision" in startup ? startup.locationPrecision : "NEIGHBORHOOD";
  const isDirectorySource = "verificationStatus" in startup;
  const isCommunitySource = "verificationStatus" in startup && startup.verificationStatus === "COMMUNITY_SOURCE";
  const isTargetEmployer = "verificationStatus" in startup && startup.verificationStatus === "TARGET_LIST";
  const remote = remoteWork[startup.slug];
  const locationSource = "locationSource" in startup ? startup.locationSource : null;

  return <main>
    <header className="innerNav shell"><a className="brand" href="/"><span className="brandMark">ISM</span><span>India Startup Map</span></a><a href="/explore">← Back to ecosystem</a></header>
    <section className="profile shell">
      <div className="profileTop">
        <span className="bigLogo" style={{ background: startup.color }}><span>{startup.initials}</span><img src={startup.logoUrl} alt={`${startup.name} logo`}/></span>
        <div><div className="eyebrow">{isCommunitySource?"COMMUNITY-SOURCED REMOTE PROFILE":isTargetEmployer?"SDE TARGET EMPLOYER":isDirectorySource?"DIRECTORY-SOURCED PROFILE":"CURATED COMPANY PROFILE"}</div><h2>{startup.name}</h2><p>{startup.description}</p></div>
        <div className="profileActions">
          <a href={links.website} target="_blank" rel="noopener noreferrer">Visit website ↗</a>
          <a className="dark" href={links.careers} target="_blank" rel="noopener noreferrer">{startup.hiring?"View careers":"Search careers"} ↗</a>
        </div>
      </div>
      <div className="profileBody">
        <article>
          <h4>ABOUT THE COMPANY</h4><p className="aboutText">{startup.description} The team builds products used by customers across India and beyond.</p>
          <h4>TECHNOLOGY</h4><div className="badges large">{startup.tech.map((technology) => <a href={`/tech/${technology.toLowerCase()}`} key={technology}>{technology}</a>)}</div>
          <h4 id="roles">OPEN ENGINEERING ROLES</h4>
          {startup.roles ? <div className="role"><div><b>Explore current openings</b><span>{startup.city} · Company careers page</span></div><a href={links.careers} target="_blank" rel="noopener noreferrer">View roles ↗</a></div> : <p>No active roles have been verified. Use the careers search for current results.</p>}
        </article>
        <aside className="facts"><h4>COMPANY DETAILS</h4><dl><dt>Founded</dt><dd>{startup.founded??"Not verified"}</dd><dt>Founders</dt><dd>{startup.founders.length?startup.founders.join(", "):"Not verified"}</dd><dt>Sector</dt><dd>{startup.sector}</dd><dt>Funding stage</dt><dd>{startup.stage}</dd><dt>Team size</dt><dd>{startup.size}</dd><dt>Location</dt><dd>{startup.neighborhood}, {startup.city} · {locationPrecision.toLowerCase()} level {locationSource&&<a href={locationSource} target="_blank" rel="noopener noreferrer">source ↗</a>}</dd><dt>Remote work</dt><dd>{remote?<a href={remote.source} target="_blank" rel="noopener noreferrer">{remote.label} ↗</a>:"Unknown"}</dd></dl><div className="miniMap"><span>⌖</span><b>{startup.neighborhood}</b><small>{startup.city}, India</small></div><p className="source">Source: <a href={startupSources[startup.slug]} target="_blank" rel="noopener noreferrer">{isCommunitySource?"Remote In Tech directory record":isTargetEmployer?(startup.slug==="netradyne"?"official office page":"target employer career surface"):isDirectorySource?"Wikidata headquarters record":"official company page"} ↗</a><br/>Checked 21 Aug 2026</p></aside>
      </div>
      <div className="correction"><span>Something not quite right?</span><button>Suggest an edit</button><button>Report incorrect info</button></div>
    </section>
  </main>;
}
