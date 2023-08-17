import { type RouterOutputs, api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-accent p-4">
      <Image
        width={56}
        height={56}
        src={author.profilePicture}
        alt="Author Profile Picture"
        className="aspect-square w-14 rounded-full"
      />
      <div className="flex flex-col">
        <div className="text-text">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username!}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{` · ${dayjs(
              post.createdAt
            ).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};