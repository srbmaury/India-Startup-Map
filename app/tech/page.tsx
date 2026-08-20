import { startups } from "../data";

const palette=["#ff5b2e","#7c5cff","#00a896","#ffd166","#118ab2"];

export default function TechnologyIndexPage(){
  const technologies=[...new Set(startups.flatMap(startup=>startup.tech))].map(name=>({name,count:startups.filter(startup=>startup.tech.includes(name)).length,companies:startups.filter(startup=>startup.tech.includes(name)).slice(0,4)})).sort((a,b)=>b.count-a.count);
  return <main><header className="innerNav shell"><a className="brand" href="/"><span className="brandMark">ISM</span><span>India Startup Map</span></a><a href="/explore">← All companies</a></header><section className="listingHero shell"><div className="eyebrow">TECHNOLOGY INDEX / VERIFIED CLAIMS ONLY</div><h2>Explore by <em>technology</em></h2><p>{technologies.length} technologies have supporting company records. Directory records without verified stack information are intentionally excluded.</p></section><section className="techIndex shell">{technologies.map((technology,index)=><a href={`/tech/${technology.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}`} className="techTile" key={technology.name} style={{"--tech-color":palette[index%palette.length]} as React.CSSProperties}><div><span>{String(index+1).padStart(2,"0")}</span><b>{technology.count} companies</b></div><h3>{technology.name}</h3><p>{technology.companies.map(company=>company.name).join(" · ")}</p><strong>Explore stack →</strong></a>)}</section></main>;
}
