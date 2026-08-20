import { chatGPTSignOutPath, requireChatGPTUser } from "../chatgpt-auth";
import { locationUnverifiedStartups, mappedStartups, startupSources, startups } from "../data";

export const dynamic = "force-dynamic";
const ADMIN_EMAILS = new Set(["srbmaury@gmail.com"]);

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export default async function Admin() {
  const user = await requireChatGPTUser("/admin");
  const email = user.email.toLowerCase();
  if (!ADMIN_EMAILS.has(email)) {
    return <main className="adminDenied"><div className="adminDeniedCard"><span className="adminKicker">ADMIN / RESTRICTED</span><h1>This account is not a moderator.</h1><p>You are signed in as <strong>{user.email}</strong>. India Startup Map is public, but its review workspace is limited to approved moderators.</p><div className="adminDeniedActions"><a className="adminPrimary" href="/">Return to public map</a><a href={chatGPTSignOutPath("/admin")}>Use another account</a></div></div></main>;
  }

  const missingTech = startups.filter((startup) => startup.tech.length === 0);
  const hiring = startups.filter((startup) => startup.hiring);
  const sourced = startups.filter((startup) => Boolean(startupSources[startup.slug]));
  const completeness = Math.round(((mappedStartups.length + sourced.length + startups.length - missingTech.length) / (startups.length * 3)) * 100);
  const queue = [
    ...locationUnverifiedStartups.slice(0, 5).map((startup) => ({startup, issue:"Location verification", note:"Excluded from map until a reliable office source is found", priority:"HIGH"})),
    ...missingTech.slice(0, 3).map((startup) => ({startup, issue:"Technology evidence", note:"No public engineering-stack source recorded", priority:"NORMAL"})),
  ];
  const displayName = user.fullName?.split(" ")[0] || "Saurabh";

  return <main className="admin">
    <aside className="adminSide"><a className="brand adminBrand" href="/"><span className="brandMark">ISM</span><span>Map Admin</span></a><nav aria-label="Admin sections"><b>WORKSPACE</b><a className="active" href="#overview">Overview</a><a href="#review-queue">Review queue <i>{queue.length}</i></a><a href="/location-unverified">Location checks <i>{locationUnverifiedStartups.length}</i></a><a href="/explore">Company directory</a><b>PUBLIC SITE</b><a href="/">Live map ↗</a><a href="/remote">Remote companies ↗</a><a href="/add-startup">Submission form ↗</a></nav><div className="adminUser"><span>{initials(user.displayName)}</span><div><b>{user.fullName || "Site moderator"}</b><small>{user.email}</small></div></div></aside>
    <section className="adminMain" id="overview">
      <header className="adminHeader"><div><span className="adminKicker">PRIVATE MODERATION WORKSPACE</span><h1>Good to see you, {displayName}.</h1><p>Review uncertain records without interrupting the public directory.</p></div><div className="adminHeaderActions"><a href="/add-startup">+ Add company</a><a className="adminSignOut" href={chatGPTSignOutPath("/")}>Sign out</a></div></header>
      <section className="adminStats" aria-label="Directory statistics"><div><span>Companies indexed</span><b>{startups.length.toLocaleString()}</b><small>Public directory</small></div><div><span>Location review</span><b>{locationUnverifiedStartups.length}</b><small>Not plotted on map</small></div><div><span>Missing tech evidence</span><b>{missingTech.length}</b><small>Needs a public source</small></div><div><span>Data completeness</span><b>{completeness}%</b><small>{sourced.length.toLocaleString()} sourced profiles</small></div></section>
      <section className="adminQueue" id="review-queue"><div className="adminSectionHead"><div><span className="adminKicker">TRIAGE</span><h2>Review queue</h2><p>Real records with missing or uncertain public evidence.</p></div><a href="/location-unverified">Open all location checks →</a></div><div className="adminQueueLabels"><span>COMPANY</span><span>REVIEW TYPE</span><span>PRIORITY</span><span>ACTION</span></div>{queue.map(({startup,issue,note,priority})=><article className="adminQueueRow" key={`${startup.slug}-${issue}`}><div className="adminCompany"><span style={{background:startup.color}}>{startup.initials}</span><div><b>{startup.name}</b><small>{startup.city === "India" ? "City unverified" : startup.city} · {startup.sector}</small></div></div><div><b>{issue}</b><small>{note}</small></div><span className={`adminPriority ${priority === "HIGH" ? "high" : ""}`}>{priority}</span><a href={`/startup/${startup.slug}`}>Review profile →</a></article>)}</section>
      <div className="adminHealthGrid"><section className="adminPanel"><div className="adminSectionHead"><div><span className="adminKicker">COVERAGE</span><h2>Data health</h2></div></div>{[["Mapped to a city",Math.round(mappedStartups.length/startups.length*100)],["Public source attached",Math.round(sourced.length/startups.length*100)],["Technology evidence",Math.round((startups.length-missingTech.length)/startups.length*100)],["Currently hiring",Math.round(hiring.length/startups.length*100)]].map(([label,value])=><div className="adminHealthRow" key={label}><div><span>{label}</span><strong>{value}%</strong></div><i><b style={{width:`${value}%`}}/></i></div>)}</section><section className="adminPanel adminPolicy"><span className="adminKicker">PUBLISHING STANDARD</span><h2>Evidence before visibility.</h2><p>Office markers require a city-level source. Remote status and technology claims remain evidence-labelled. Uncertain companies stay searchable but off the map.</p><a href="/methodology">Review methodology →</a></section></div>
    </section>
  </main>;
}
