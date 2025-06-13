import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useUserContext } from "../../Hooks/useUserContext";
import axios from "axios";
import { useProfileContext } from "../../Hooks/useProfileContext";
import { jwtDecode } from "jwt-decode";

interface AddPost {
  body: string;
  image: File | null;
}

interface EditModalProps {
  setOpenEditModal: (value: boolean) => void;
  openEditModal: boolean;
  postId: string;
  image: string | undefined;
  body: string | undefined;
}

export default function EditModal({
  setOpenEditModal,
  postId,
  openEditModal,
  image,
  body,
}: EditModalProps) {
  const initialValues: AddPost = {
    body: body || "",
    image: null,
  };

  const modalRef: any = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!openEditModal) return;
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpenEditModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openEditModal]);

  const formik = useFormik({
    initialValues,
    onSubmit: editPost,
  });

  const { token } = useUserContext();
  const safeToken = token || "";
  const { user }: { user: string } = jwtDecode(safeToken);
  const [apiError, setApiError] = useState<string>("");
  const { getUserPosts } = useProfileContext();

  async function editPost(values: AddPost) {
    setIsSubmit(true);

    if ((!values.body || values.body.trim() === "") && !values.image) {
      Swal.fire("Error", "you can't post an empty post.😬", "error");
      setIsSubmit(false);
      console.log("Validation failed, aborting request");
      return;
    }

    const request = new FormData();
    request.append("body", values.body);
    if (values.image) {
      request.append("image", values.image);
    }

    try {
      const { data } = await axios.put(
        `https://linked-posts.routemisr.com/posts/${postId}`,
        request,
        {
          headers: {
            token,
          },
        }
      );
      toast.success(data.message || "success");
      setApiError("");
      formik.resetForm({ values: { body: "", image: null } });
      getUserPosts(user);
      setChosenImage(null);
      setOpenEditModal(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } catch (error: any) {
      setApiError(error.response.data.error);
    } finally {
      setIsSubmit(false);
    }
  }

  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [chosenImage, setChosenImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <div className="bg-[rgba(0,0,0,0.6)] min-h-screen pt-3 fixed top-0 right-0 left-0 p-2 bottom-0 flex items-center">
        <div
          ref={modalRef}
          className="container mx-auto flex bg-[#f1f1f1] p-4 rounded-lg justify-around md:flex-row flex-col relative"
        >
          <span
            className="absolute top-2 right-2 cursor-pointer"
            onClick={() => setOpenEditModal(false)}
          >
            <i className="fas fa-xmark-square  fa-xl text-red-500"></i>
          </span>
          <form onSubmit={formik.handleSubmit} className="md:w-2/5 mb-2">
            <h1 className="uppercase text-blue-500 text-center text-3xl mb-3 font-bold">
              Edit Post
            </h1>
            {apiError && (
              <div
                className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
                role="alert"
              >
                {apiError}
              </div>
            )}
            <div className="mb-2">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-bold text-gray-900"
              >
                Content
              </label>
              <textarea
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.body}
                name="body"
                id="body"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:outline-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="write your post here"
              />
            </div>

            <div className="relative mb-2">
              <label
                className="block mb-2 text-sm font-bold text-gray-900 "
                htmlFor="image"
              >
                Upload picture
              </label>
              <input
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0] || null;
                  if (!file) return;

                  if (file.size > 1.5 * 1024 * 1024) {
                    Swal.fire({
                      icon: "error",
                      title: "File too large",
                      text: "Please upload an image smaller than 1.5MB.",
                    });
                    event.currentTarget.value = "";
                    return;
                  }

                  formik.setFieldValue("image", file);
                  setChosenImage(URL.createObjectURL(file));
                }}
                ref={imageInputRef}
                onBlur={formik.handleBlur}
                className="block w-full text-sm file:cursor-pointer text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0  file:text-sm file:font-semibold file:bg-gray-800 file:text-white"
                name="image"
                type="file"
              />

              {chosenImage && (
                <button
                  onClick={() => {
                    imageInputRef.current && (imageInputRef.current.value = "");
                    setChosenImage(null);
                    formik.setFieldValue("image", null);
                  }}
                  className="px-3 py-1 rounded-md cursor-pointer text-red-500 hover:bg-red-500 hover:text-white border border-red-500 absolute right-2 bottom-1"
                >
                  <i className="fas fa-trash-can"></i>
                </button>
              )}
            </div>

            <div className="flex justify-between items-center">
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
                  className="text-white  cursor-pointer bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm  sm:w-auto px-5 py-2.5 text-center "
                >
                  Edit
                </button>
              )}
            </div>
          </form>
          <div className=" p-2  shadow rounded-md bg-white overflow-hidden md:w-2/5">
            <div className="title p-2 border-b border-slate-200">
              <p>{formik.values.body}</p>
            </div>

            <div className="post-image">
              <img
                src={chosenImage ? chosenImage : image}
                className="w-full h-full object-cover object-top"
                alt="chosen image"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
