import axios from "axios";
import { useUserContext } from "../../Hooks/useUserContext";
import Loading from "../Loading/Loading";
import PostDetails from "../PostDetails/PostDetails";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { IPost } from "../../interfaces";

export default function SinglePost() {
  const { id } = useParams();
  const { token } = useUserContext();
  const [post, setPost] = useState<IPost | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(true);
  async function getAllPosts() {
    let { data } = await axios.get(
      `https://linked-posts.routemisr.com/posts/${id}`,
      {
        headers: {
          token,
        },
      }
    );
    setPost(data.post);
    setisLoading(false);
  }

  useEffect(() => {
    if (token) {
      getAllPosts();
    }
  }, [token]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="bg-[#f1f1f1] py-5 min-h-screen p-2">
          {post && (
            <PostDetails
              userId={post.user._id}
              content={post.body}
              image={post.image}
              photo={post.user.photo}
              time={post.createdAt}
              userName={post.user.name}
              postId={post._id}
              allComments={post.comments}
              showAllComments={true}
            />
          )}
        </div>
      )}
    </>
  );
}
