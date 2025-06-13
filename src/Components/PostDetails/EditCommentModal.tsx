import axios from "axios";
import { useFormik } from "formik";
import { useUserContext } from "../../Hooks/useUserContext";
import type { Comment } from "../../interfaces";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface EditCommentProps {
  setOpenEditComment: (value: boolean) => void;
  openEditComment: boolean;
  setComments: (values: any) => void;
  content: string;
  commentId: string;
}

export default function EditCommentModal({
  setOpenEditComment,
  openEditComment,
  setComments,
  content,
  commentId,
}: EditCommentProps) {
  const { token } = useUserContext();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const EditCommentRef: any = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!openEditComment) return;
      if (
        EditCommentRef.current &&
        !EditCommentRef.current.contains(e.target as Node)
      ) {
        setOpenEditComment(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openEditComment]);

  const formik = useFormik({
    initialValues: {
      content: content,
    },
    onSubmit: updateComment,
  });

  async function updateComment(values: { content: string }) {
    setIsSubmit(true);
    try {
      let { data } = await axios.put(
        `https://linked-posts.routemisr.com/comments/${commentId}`,
        values,
        {
          headers: {
            token,
          },
        }
      );
      const updatedComment = data.comment;
      setComments((oldComments: Comment[]) => {
        let cpyComments = structuredClone(oldComments);
        const index = cpyComments.findIndex(
          (c: Comment) => c._id === updatedComment._id
        );
        if (index !== -1) {
          cpyComments[index] = updatedComment;
        }
        return cpyComments;
      });
      toast.success(data.message);
      setOpenEditComment(false);
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setIsSubmit(false);
    }
  }
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
        <form
          ref={EditCommentRef}
          className="bg-white p-6 rounded shadow-lg w-full max-w-md"
          onSubmit={formik.handleSubmit}
        >
          <h2 className="text-xl mb-4 text-center uppercase text-blue-500 font-bold">
            Edit Comment
          </h2>
          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Comment
            </label>
            <textarea
              value={formik.values.content}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              id="content"
              name="content"
              rows={4}
              className="mt-1 block p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Edit your comment here..."
            ></textarea>{" "}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setOpenEditComment(false)}
              type="button"
              className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            {isSubmit ? (
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <i className="fas fa-spinner fa-spin"></i>
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
