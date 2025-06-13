import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import type { Comment } from "../../interfaces";
import { Link } from "react-router-dom";
import { useUserContext } from "../../Hooks/useUserContext";
import axios from "axios";
import { useProfileContext } from "../../Hooks/useProfileContext";
import EditModal from "./EditModal";
import { jwtDecode } from "jwt-decode";
import displayDate from "./displayDate";
import CommentBlock from "./CommentBlock";

interface PostData {
  postId: string;
  content: string | undefined;
  photo: string;
  userName: string;
  time: string;
  image: string | undefined;
  showAllComments?: boolean;
  allComments?: Comment[];
  userId: string;
}

interface ICommentEntry {
  content: string;
  post: string;
}

export default function PostDetails({
  content,
  photo,
  userName,
  time,
  image,
  showAllComments = false,
  postId,
  allComments,
  userId,
}: PostData) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(showAllComments);
  const [comments, setComments] = useState<Comment[]>(allComments || []);
  const [isSubmit, setisSubmit] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openThreeDots, setOpenThreeDots] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");
  const { token } = useUserContext();
  const safeToken = token || "";
  const { user }: { user: string } = jwtDecode(safeToken);
  const { deletePost } = useProfileContext();
  const threeDotsRef: any = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!openThreeDots) return;
      if (
        threeDotsRef.current &&
        !threeDotsRef.current.contains(e.target as Node)
      ) {
        setOpenThreeDots(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openThreeDots]);

  useEffect(() => {
    if (allComments) {
      setComments(allComments.reverse());
    }
  }, [allComments]);

  const validationSchema = Yup.object().shape({
    content: Yup.string().required("add your comment"),
  });
  const initialValues: ICommentEntry = {
    content: "",
    post: postId,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: addComment,
    validationSchema,
  });

  async function addComment(values: ICommentEntry) {
    setisSubmit(true);
    try {
      if (token) {
        let { data } = await axios.post(
          "https://linked-posts.routemisr.com/comments",
          values,
          {
            headers: {
              token,
            },
          }
        );
        toast.success(data.message);
        setComments(data.comments);
        setApiError("");
      }

      formik.resetForm({ values: { content: "", post: postId } });
    } catch (error: any) {
      setApiError(error.response.data.error);
    } finally {
      setisSubmit(false);
    }
  }

  return (
    <div className="md:w-1/2 w-full mx-auto shadow rounded-md bg-white mb-5 overflow-hidden">
      <div className="info flex justify-between p-3 items-center relative">
        <div className="flex space-x-3">
          <div className="img size-12 overflow-hidden bg-blue-200 rounded-full">
            <img src={photo} className="w-full h-full object-cover" alt="" />
          </div>
          <div>
            <h4>{userName}</h4>
            <p className="text-blue-500 text-sm font-semibold">
              {displayDate(time)}
            </p>
          </div>
        </div>
        {userId === user && (
          <span
            onClick={() => setOpenThreeDots(true)}
            className="me-2 text-blue-500 text-lg cursor-pointer"
          >
            <i className="fas fa-ellipsis-vertical "></i>
          </span>
        )}
        <div
          ref={threeDotsRef}
          className={`absolute ${
            openThreeDots ? "block" : "hidden"
          } w-fit bg-white zk overflow-hidden rounded-md shadow-lg right-2 top-12 z-10 border border-slate-200`}
        >
          <ul>
            <li
              onClick={() => {
                deletePost(postId);
                setOpenThreeDots(false);
              }}
              className="text-red-500 font-bold cursor-pointer border-b border-slate-200 p-2 hover:bg-slate-300"
            >
              <i className="fas fa-trash-can"></i> Delete Post
            </li>
            <li
              onClick={() => {
                setOpenThreeDots(false);
                setOpenEditModal(true);
              }}
              className="text-blue-500 font-bold cursor-pointer p-2 hover:bg-slate-300"
            >
              <i className="fa-solid fa-pen-to-square"></i> Update Post
            </li>
          </ul>
        </div>
      </div>
      <div className="title p-2 border-b border-slate-200">
        <p>{content}</p>
      </div>

      {image && (
        <div className="post-image ">
          <img
            src={image}
            className="w-full h-full object-cover"
            alt={content}
          />
        </div>
      )}

      <div className="reacts border-b border-slate-200 py-8 flex justify-around text-blue-500">
        <i className="fa-solid fa-thumbs-up   fa-xl cursor-pointer"></i>
        <i
          className="fa-regular fa-comment   fa-xl cursor-pointer"
          title="show comments"
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
        ></i>
        <i className="fa-solid fa-share-nodes fa-xl cursor-pointer"></i>
      </div>
      {/* comments */}
      {isCommentsOpen && (
        <>
          <form
            className="flex  w-full justify-between p-2 gap-2"
            onSubmit={formik.handleSubmit}
          >
            <div className="grow">
              <input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.content}
                name="content"
                id="content"
                className="bg-gray-50 border w-full  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:outline-blue-500 focus:border-blue-500 p-2.5 "
                placeholder="write your comment here"
              />
            </div>
            {isSubmit ? (
              <button
                type="button"
                className="text-white  bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm  sm:w-auto px-5 py-2.5 text-center "
              >
                <i className="fas fa-spinner fa-spin"></i>
              </button>
            ) : (
              <button
                type="submit"
                className="text-white  cursor-pointer  bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm  sm:w-auto px-5 py-2.5 text-center "
              >
                <i className="fa-solid fa-location-arrow rotate-45 fa-xl me-1"></i>
              </button>
            )}
          </form>
          {formik.errors.content && formik.touched.content && (
            <div
              className="p-4 mx-2 my-1 text-sm text-red-800 rounded-lg bg-red-50"
              role="alert"
            >
              {formik.errors.content}
            </div>
          )}
          {apiError && (
            <div
              className="p-4 mx-2 my-1 text-sm text-red-800 rounded-lg bg-red-50"
              role="alert"
            >
              {apiError}
            </div>
          )}
          <div>
            <h3 className="text-blue-500 ps-5  p-3 text-xl font-bold flex justify-between">
              <span>Comments</span>
              <span>
                {comments.length >= 1000
                  ? comments.length.toString().slice(0, 1) +
                    "." +
                    comments.length.toString().slice(1, 2) +
                    "K"
                  : comments.length}{" "}
                comments
              </span>
            </h3>
            {showAllComments ? (
              comments &&
              comments.length > 0 &&
              comments?.map((comment: Comment, index: number) => (
                <CommentBlock
                  photo={comment.commentCreator.photo}
                  name={comment.commentCreator.name}
                  time={comment.createdAt}
                  content={comment.content}
                  creatorId={comment.commentCreator._id}
                  userId={user}
                  key={index}
                  setComments={setComments}
                  commentId={comment._id}
                  postId={postId}
                />
              ))
            ) : comments[0] ? (
              <>
                <CommentBlock
                  photo={comments[comments.length - 1].commentCreator.photo}
                  name={comments[comments.length - 1].commentCreator.name}
                  time={comments[comments.length - 1].createdAt}
                  content={comments[comments.length - 1].content}
                  creatorId={comments[comments.length - 1].commentCreator._id}
                  userId={user}
                  setComments={setComments}
                  commentId={comments[comments.length - 1]._id}
                  postId={postId}
                />
                <Link to={`/singlepost/${postId}`}>
                  <p className="text-lg text-blue-500 text-center p-4 font-bold hover:bg-slate-100">
                    View all comments <i className="fas fa-arrow-right"></i>
                  </p>
                </Link>
              </>
            ) : (
              <>
                <div className="text-center py-3">No comments yet.</div>
              </>
            )}
          </div>
        </>
      )}
      {openEditModal && (
        <EditModal
          setOpenEditModal={setOpenEditModal}
          openEditModal={openEditModal}
          postId={postId}
          image={image}
          body={content}
        />
      )}
    </div>
  );
}
