import axios from "axios";
import { useUserContext } from "../../Hooks/useUserContext";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading/Loading";
import PostDetails from "../PostDetails/PostDetails";
import type { IPost } from "../../interfaces";
import { jwtDecode } from "jwt-decode";

export default function Profile() {
  const { token } = useUserContext();
  const safeToken = token ?? "";
  let { user }: { user: string } = jwtDecode(safeToken);

  function getUserPosts() {
    return axios.get(`https://linked-posts.routemisr.com/users/${user}/posts`, {
      headers: { token },
    });
  }

  const { data, isError, isLoading } = useQuery({
    queryKey: ["profilePosts"],
    queryFn: getUserPosts,
    select: (data) => data.data.posts.reverse(),
  });

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <h2 className="text-red-500 text-3xl text-center mt-20 font-bold">
        Error, Try again later
      </h2>
    );

  return (
    <div className="bg-[#f1f1f1] pt-5 p-2">
      {data?.length > 0 ? (
        data.map((post: IPost, index: number) => {
          const hasContent = post.image || post.body;
          if (!hasContent) return null;

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
        })
      ) : (
        <p className="text-center text-xl text-gray-600 mt-10">
          No posts to display.
        </p>
      )}
    </div>
  );
}
