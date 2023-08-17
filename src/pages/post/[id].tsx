import Head from "next/head";
import { api } from "~/utils/api";
import type { GetStaticPropsContext, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/serverSideHelper";
import { PostView } from "~/components/PostView";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.posts.getById.useQuery({
    id,
  });

  if (!data) return <div>404 Not Found</div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content} - ${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const helpers = generateSSGHelper();

  //this needs a non-null assertion (!) on params to tell TS that its not null/undefined
  const id = context.params!.id;

  if (typeof id !== "string") throw new Error("no id");

  // Fetch data for the queried username
  await helpers.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
    revalidate: 1,
  };
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SinglePostPage;
