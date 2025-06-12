import { useProfileContext } from "../../Hooks/useProfileContext";
import Loading from "../Loading/Loading";
import PostDetails from "../PostDetails/PostDetails";

export default function Profile() {
  const { profilePosts } = useProfileContext();

  if (!profilePosts) {
    return <Loading />;
  }

  return (
    <div className="bg-[#f1f1f1] min-h-screen">
      <div className="container py-4">
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
            />
          ))
        ) : (
          <div className="text-center py-10 text-blue-500 text-xl font-semibold">
            No posts to display yet.
          </div>
        )}
      </div>
    </div>
  );
}
