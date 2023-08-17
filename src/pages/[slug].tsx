import { createServerSideHelpers } from "@trpc/react-query/server";
import Head from "next/head";
import { api } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import type { GetStaticPropsContext, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Image from "next/image";

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
      </PageLayout>
    </>
  );
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  const slug = context.params?.slug as string;

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
