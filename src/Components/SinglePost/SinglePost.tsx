import axios from "axios";
import { useUserContext } from "../../Hooks/useUserContext";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Loading from "../Loading/Loading";
import PostDetails from "../PostDetails/PostDetails";
import { useParams } from "react-router-dom";

export default function SinglePost() {
  const { id } = useParams();
  const { token } = useUserContext();
  function getAllPosts() {
    return axios.get(`https://linked-posts.routemisr.com/posts/${id}`, {
      headers: {
        token,
      },
    });
  }

  const { data, isError, isLoading } = useQuery({
    queryKey: ["singlePost"],
    queryFn: getAllPosts,
    select: (data) => data.data.post,
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
        <div className="bg-[#f1f1f1] pt-5">
          {data && (
            <PostDetails
              userId={data.user._id}
              content={data.body}
              image={data.image}
              photo={data.user.photo}
              time={data.createdAt}
              userName={data.user.name}
              postId={data._id}
              allComments={data.comments}
              showAllComments={true}
            />
          )}
        </div>
      )}
    </>
  );
}
