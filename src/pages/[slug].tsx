import { createServerSideHelpers } from "@trpc/react-query/server";
import Head from "next/head";
import { api } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import type { GetStaticPropsContext, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/PostView";
import { generateSSGHelper } from "~/server/helpers/serverSideHelper";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) return <LoadingPage />;

  if (!data || data.length == 0) return <div>User has not posted</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};
const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username: username.replace(/"/g, ""), // Remove double quotes
  });

  if (!data) return <div>404 Not Found</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 bg-secondary">
          <Image
            src={data.imageUrl}
            alt={`${data.username ?? ""}'s profile picture`}
            width={128}
            height={128}
            unoptimized={true}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full bg-background ring-4 ring-text"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-semibold">
          {`@${data.username ?? ""}`}
        </div>
        <div className="w-full border-b border-primary"></div>
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>
) {
  const helpers = generateSSGHelper();

  //this needs a non-null assertion (!) on params to tell TS that its not null/undefined
  const slug = context.params!.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  // Remove the "@" symbol and any extra spaces
  const username = JSON.stringify(slug.replace("@", ""));

  // Fetch data for the queried username
  await helpers.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      username,
    },
    revalidate: 1,
  };
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
