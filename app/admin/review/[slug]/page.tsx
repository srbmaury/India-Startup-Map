import { notFound } from "next/navigation";
import { chatGPTSignOutPath } from "../../../chatgpt-auth";
import { startupLinks, startupSources, startups } from "../../../data";
import { requireAdmin } from "../../admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminReview({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{issue?:string}>}) {
  const {slug}=await params;
  const query=await searchParams;
  const {user,allowed}=await requireAdmin(`/admin/review/${slug}${query.issue?`?issue=${encodeURIComponent(query.issue)}`:""}`);
  if(!allowed) return <main className="adminDenied"><div className="adminDeniedCard"><span className="adminKicker">ADMIN / RESTRICTED</span><h1>This account is not a moderator.</h1><p>Signed in as <strong>{user.email}</strong>.</p><div className="adminDeniedActions"><a className="adminPrimary" href="/">Return to public map</a><a href={chatGPTSignOutPath(`/admin/review/${slug}`)}>Use another account</a></div></div></main>;
  const startup=startups.find(item=>item.slug===slug);
  if(!startup) notFound();
  const issue=query.issue==="technology"?"Technology evidence":"Location verification";
  const source=startupSources[startup.slug];
  const links=startupLinks[startup.slug];
  const currentIndex=startups.findIndex(item=>item.slug===slug);
  const next=startups.slice(currentIndex+1).find(item=>issue==="Location verification"?item.city==="India":item.tech.length===0);
  const githubSearch=`https://github.com/srbmaury/India-Startup-Map/search?q=${encodeURIComponent(startup.slug)}&type=code`;
  return <main className="reviewPage"><header className="reviewTop"><a href="/admin">← Review queue</a><span>ADMIN / {issue.toUpperCase()}</span><a href={chatGPTSignOutPath("/")}>Sign out</a></header><section className="reviewLayout"><article className="reviewRecord"><div className="reviewTitle"><span className="bigLogo" style={{background:startup.color}}><span>{startup.initials}</span><img src={startup.logoUrl} alt=""/></span><div><span className="adminPriority high">NEEDS REVIEW</span><h1>{startup.name}</h1><p>{startup.description}</p></div></div><div className="reviewFacts"><div><small>CURRENT LOCATION</small><b>{startup.city==="India"?"Unverified":`${startup.neighborhood}, ${startup.city}`}</b></div><div><small>TECHNOLOGY</small><b>{startup.tech.length?startup.tech.join(" · "):"No evidence recorded"}</b></div><div><small>SECTOR</small><b>{startup.sector}</b></div><div><small>CAREERS</small><b>{startup.hiring?"Hiring signal present":"No active signal"}</b></div></div><section className="evidenceCard"><div><span className="adminKicker">PRIMARY EVIDENCE</span><h2>Check the public source</h2><p>Confirm that the source explicitly supports this record. Do not infer an office from a service area, job listing, or India-only association.</p></div>{source?<a href={source} target="_blank" rel="noreferrer">Open evidence ↗</a>:<span className="missingEvidence">No source attached</span>}</section><section className="reviewChecklist"><h2>Decision checklist</h2>{(issue==="Location verification"?["A city or office address is explicitly named","The source belongs to the company or a reliable registry","The location is current, not a historic office"]:["The stack is explicitly named by the company","The claim describes production engineering, not a job wishlist","The evidence is current enough to publish"]).map((item,index)=><label key={item}><input type="checkbox"/> <span><b>0{index+1}</b>{item}</span></label>)}</section></article><aside className="reviewActions"><span className="adminKicker">NEXT STEP</span><h2>Update the source of truth</h2><p>Reviews are completed through a code change, so every correction stays attributable and reversible.</p><a className="reviewPrimary" href={githubSearch} target="_blank" rel="noreferrer">Find record on GitHub ↗</a><a href={`/startup/${startup.slug}`} target="_blank" rel="noreferrer">View public profile ↗</a><a href={links.website} target="_blank" rel="noreferrer">Company website ↗</a><hr/><p className="reviewHint">After editing and publishing the record, return here and continue to the next item.</p>{next?<a className="reviewNext" href={`/admin/review/${next.slug}?issue=${query.issue??"location"}`}>Next: {next.name} →</a>:<a className="reviewNext" href="/admin">Back to queue →</a>}</aside></section></main>;
}
