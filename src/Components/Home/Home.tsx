import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUserContext } from "../../Hooks/useUserContext";
import Loading from "../Loading/Loading";
import type { IPost } from "../../interfaces";
import PostDetails from "../PostDetails/PostDetails";

export default function Home() {
  const { token } = useUserContext();
  function getAllPosts() {
    return axios.get("https://linked-posts.routemisr.com/posts?limit=50", {
      headers: {
        token,
      },
    });
  }

  const { data, isError, isLoading } = useQuery({
    queryKey: ["homePosts"],
    queryFn: getAllPosts,
    select: (data) => data.data.posts,
  });

  return (
    <>
      {isError ? (
        <div>
          <h2 className="text-red-500 text-3xl text-center mt-20 font-bold">
            Error, Try again later
          </h2>
        </div>
      ) : isLoading ? (
        <Loading />
      ) : (
        <div className="bg-[#f1f1f1] pt-5 p-2">
          {data &&
            data.length > 0 &&
            data.map((post: IPost, index: number) => {
              const hasImage = !!post.image;
              const hasBody = !!post.body;

              if (!hasImage && !hasBody) return null;

              return (
                <PostDetails
                  key={index}
                  content={post.body}
                  image={post.image}
                  photo={post.user.photo}
                  time={post.createdAt}
                  userName={post.user.name}
                  postId={post._id}
                  allComments={post.comments}
                />
              );
            })}
        </div>
      )}
    </>
  );
}
