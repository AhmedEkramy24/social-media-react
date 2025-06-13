import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { useUserContext } from "../Hooks/useUserContext";
import type { IPost } from "../interfaces";

interface ProfileContextType {
  profilePosts: IPost[] | null;
  deletePost: (postId: string) => void;
  getUserPosts: (postId: string) => void;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

interface ProfileContextProviderProps {
  children: ReactNode;
}

export default function ProfileContextProvider({
  children,
}: ProfileContextProviderProps) {
  const [profilePosts, setProfilePosts] = useState<IPost[] | null>(null);
  const { token } = useUserContext();

  async function getUserPosts(userId: string) {
    let { data } = await axios.get(
      `https://linked-posts.routemisr.com/users/${userId}/posts`,
      {
        headers: {
          token,
        },
      }
    );
    setProfilePosts(data.posts.reverse());
  }

  async function deletePost(postId: string) {
    let { data } = await axios.delete(
      `https://linked-posts.routemisr.com/posts/${postId}`,
      {
        headers: {
          token,
        },
      }
    );
    const deletedPost = data.post;
    setProfilePosts((prevPosts) => {
      if (!prevPosts) return prevPosts;
      let cpyPosts = structuredClone(prevPosts);
      cpyPosts = cpyPosts.filter((post) => post._id !== deletedPost._id);
      return cpyPosts;
    });
  }

  useEffect(() => {
    if (token) {
      const safeToken = token || "";
      const { user }: { user: string } = jwtDecode(safeToken);
      getUserPosts(user);
    }
  }, [token]);

  return (
    <ProfileContext.Provider value={{ profilePosts, deletePost, getUserPosts }}>
      {children}
    </ProfileContext.Provider>
  );
}
