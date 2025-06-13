import { Link } from "react-router-dom";
import { useProfileContext } from "../../Hooks/useProfileContext";
import Loading from "../Loading/Loading";
import PostDetails from "../PostDetails/PostDetails";
import { useEffect } from "react";
import { useUserContext } from "../../Hooks/useUserContext";
import { jwtDecode } from "jwt-decode";

export default function Profile() {
  const { profilePosts, getUserPosts } = useProfileContext();
  const { token } = useUserContext();
  const safeToken = token || "";
  const { user }: { user: string } = jwtDecode(safeToken);

  if (!profilePosts) {
    return <Loading />;
  }

  useEffect(() => {
    getUserPosts(user);
  }, []);

  return (
    <div className="bg-[#f1f1f1] min-h-screen">
      <div className="container py-4 p-2">
        {profilePosts.length > 0 ? (
          profilePosts.map((post, index) => (
            <PostDetails
              key={index}
              content={post.body}
              image={post.image}
              photo={post.user.photo}
              time={post.createdAt}
              userName={post.user.name}
              postId={post._id}
              allComments={post.comments}
              userId={post.user._id}
            />
          ))
        ) : (
          <div className="text-center py-10 text-blue-500 ">
            <p className="font-bold text-2xl">No posts to display yet.</p>
            <Link to={"/addpost"} className="block my-3">
              <button className="py-1 px-3 rounded-md bg-blue-500 text-white hover:bg-blue-600">
                Click to add post
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
