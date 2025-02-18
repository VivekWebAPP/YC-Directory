import StartupCard from "@/components/StartupCard";
import SearchForm from "../../components/SearchForm";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { StartupTypeCard } from "@/components/Navbar";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";

export default async function Home({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params });

  const secssion = await auth();
  console.log(secssion?.id);

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">Pitch Your Start-Up, <br /> Connect with You Enrepreneurs</h1>
        <p className="sub-heading !max-w-3xl">Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions</p>
        <SearchForm query={query} />
      </section>
      <section className="section_container">
        <p className="text-30-semibold">{query ? `Search results for "${query}"` : "All Startups"}</p>
        <div className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard, index: number) => (
              <ul>
                <StartupCard key={post?._id} post={post} />
              </ul>
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </div>
      </section>
      <SanityLive />
    </>
  );
}
