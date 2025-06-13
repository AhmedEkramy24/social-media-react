import { useEffect, useRef, useState } from "react";
import displayDate from "./displayDate";
import toast from "react-hot-toast";
import EditCommentModal from "./EditCommentModal";
import type { Comment } from "../../interfaces";
import axios from "axios";
import { useUserContext } from "../../Hooks/useUserContext";

interface ICommentBlock {
  photo: string;
  name: string;
  time: string;
  creatorId: string;
  userId: string;
  content: string;
  setComments: (values: Comment[]) => void;
  commentId: string;
  postId: string;
}

export default function CommentBlock({
  photo,
  name,
  time,
  creatorId,
  userId,
  content,
  setComments,
  commentId,
  postId,
}: ICommentBlock) {
  const [openEditComment, setOpenEditComment] = useState<boolean>(false);
  const [openCommentTools, setOpenCommentTools] = useState<string | null>(null);

  const { token } = useUserContext();

  const commentsToolsRef: any = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!openCommentTools) return;
      if (
        commentsToolsRef.current &&
        !commentsToolsRef.current.contains(e.target as Node)
      ) {
        setOpenCommentTools(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openCommentTools]);

  async function deleteComment() {
    try {
      let { data } = await axios.delete(
        `https://linked-posts.routemisr.com/comments/${commentId}`,
        {
          headers: {
            token,
          },
        }
      );
      getPostComments();
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }

  async function getPostComments() {
    try {
      let { data } = await axios.get(
        `https://linked-posts.routemisr.com/posts/${postId}/comments`,
        {
          headers: {
            token,
          },
        }
      );
      setComments(data.comments);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="relative">
        <div className="px-5 flex items-center justify-between mt-4 ">
          <div className="flex space-x-3">
            <div className="img size-10 overflow-hidden bg-blue-200 flex justify-center items-center rounded-full">
              {!photo.includes("undefined") ? (
                <img
                  src={photo}
                  className="w-full h-full object-cover"
                  alt={name}
                />
              ) : (
                <span className="text-3xl font-bold text-blue-500 -translate-y-0.5">
                  {name?.charAt(0)}
                </span>
              )}
            </div>
            <div className="text-sm">
              <h4 className="font-bold">{name}</h4>
              <p className="text-sm font-semibold text-blue-500">
                {displayDate(time)}
              </p>
            </div>
          </div>
          {creatorId === userId && (
            <span
              className="me-2 text-blue-500 text-lg cursor-pointer"
              onClick={() => setOpenCommentTools(creatorId)}
            >
              <i className="fas fa-ellipsis-vertical "></i>
            </span>
          )}
        </div>
        <p className="ps-20 pb-4 border-b border-slate-200">{content}</p>
        <div
          ref={commentsToolsRef}
          className={`absolute ${
            openCommentTools ? "block" : "hidden"
          } w-fit bg-white  overflow-hidden rounded-md shadow-lg right-12 top-1 z-10 border border-slate-200`}
        >
          <ul>
            <li
              onClick={() => {
                setOpenCommentTools(null);
                deleteComment();
              }}
              className="text-red-500 text-sm font-bold cursor-pointer border-b border-slate-200 p-2 hover:bg-slate-300"
            >
              <i className="fas fa-trash-can"></i> Delete Comment
            </li>
            <li
              onClick={() => {
                setOpenCommentTools(null);
                setOpenEditComment(true);
              }}
              className="text-blue-500 text-sm  font-bold cursor-pointer p-2 hover:bg-slate-300"
            >
              <i className="fa-solid fa-pen-to-square"></i> Update Comment
            </li>
          </ul>
        </div>
      </div>
      {openEditComment && (
        <EditCommentModal
          setOpenEditComment={setOpenEditComment}
          openEditComment={openEditComment}
          setComments={setComments}
          content={content}
          commentId={commentId}
        />
      )}
    </>
  );
}
