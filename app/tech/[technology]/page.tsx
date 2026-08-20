import ExploreClient from "../../explore-client";
import { startups } from "../../data";
export default async function TechPage({params}:{params:Promise<{technology:string}>}){const {technology}=await params;const technologies=[...new Set(startups.flatMap(startup=>startup.tech))];const selected=technologies.find(name=>name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")===technology)??technology;return <ExploreClient technology={selected}/>}
