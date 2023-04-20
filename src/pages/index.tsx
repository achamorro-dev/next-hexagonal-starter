import { Inter } from "next/font/google";

import { Post } from "@/modules/posts/domain/Post";
import { getAllPosts } from "@/modules/posts/application/get-all/getAllPosts";
import { PostMapper } from "@/modules/posts/application/mappers/PostMapper";

import { createApiPostRepository } from "@/modules/posts/infra/ApiPostRepository";
import { createApiUserRepository } from "@/modules/users/infra/ApiUserRepository";
import { createApiCommentRepository } from "@/modules/comments/infra/ApiCommentRepository";

import { usePagination } from "@/hooks/usePagination";

import { PostsList } from "@/sections/posts/PostsList";
import { Pagination } from "@/components/Pagination";

const inter = Inter({ subsets: ["latin"] });
const ITEMS_PER_PAGE = 5;
const INITIAL_PAGE = 1;

const postRepository = createApiPostRepository();
const userRepository = createApiUserRepository();
const commentRepository = createApiCommentRepository();

interface HomePageProps {
  posts: Post[];
  page?: number;
  limit?: number;
}

export default function HomePage({ posts, page = INITIAL_PAGE, limit = ITEMS_PER_PAGE }: HomePageProps): JSX.Element {
  const [currentPosts, currentPage, setCurrentPage] = usePagination(
    postRepository,
    userRepository,
    commentRepository,
    posts,
    page,
    limit,
  )

  return (
    <main className={inter.className}>
      <PostsList posts={currentPosts}/>
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </main>
  );
}

export async function getStaticProps() {
  const page = INITIAL_PAGE;
  const limit = ITEMS_PER_PAGE;
  const posts = (await getAllPosts(
    postRepository,
    userRepository,
    commentRepository,
    PostMapper,
  )()) as Post[];

  return {
    props: {
      posts,
      page,
      limit,
    },
  };
}
