import { citySlugs, cityToSlug, mappedStartups } from "../data";
import ExploreClient from "../explore-client";

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const matchedCity = [...new Set(mappedStartups.map((startup) => startup.city))]
    .find((name) => cityToSlug(name) === city);

  return <ExploreClient city={matchedCity || citySlugs[city] || city} />;
}
