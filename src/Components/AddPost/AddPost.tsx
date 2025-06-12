import { useFormik } from "formik";
import postImgae from "../../assets/postImpty.jpg";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useUserContext } from "../../Hooks/useUserContext";
import axios from "axios";

interface AddPost {
  body: string;
  image: File | null;
}

export default function AddPost() {
  const initialValues: AddPost = {
    body: "",
    image: null,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: addPost,
  });

  const { token } = useUserContext();
  const [apiError, setApiError] = useState<string>("");

  async function addPost(values: AddPost) {
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
      const { data } = await axios.post(
        `https://linked-posts.routemisr.com/posts`,
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
      setChosenImage(null);
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
      <div className="bg-[#f1f1f1] min-h-screen pt-3">
        <div className="container mx-auto">
          <h1 className="uppercase text-blue-500 text-center text-3xl mb-3 font-bold">
            Add Post
          </h1>
          <form
            onSubmit={formik.handleSubmit}
            className="md:w-1/2  mx-auto p-2"
          >
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

            <div className="mb-2 relative">
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
                  }}
                  className="px-3 py-1 rounded-md cursor-pointer text-red-500 hover:bg-red-500 hover:text-white border border-red-500 absolute right-2 bottom-1"
                >
                  <i className="fas fa-trash-can"></i>
                </button>
              )}
            </div>

            <div className="mx-auto p-2  shadow rounded-md bg-white mb-5 overflow-hidden">
              <div className="title p-2 border-b border-slate-200">
                <p>{formik.values.body}</p>
              </div>

              <div className="post-image h-72 lg:h-96">
                {chosenImage ? (
                  <img
                    src={chosenImage}
                    className="w-full h-full object-cover object-top"
                    alt="chosen image"
                  />
                ) : (
                  <img
                    src={postImgae}
                    className="w-full h-full object-cover object-center opacity-50"
                    alt="gallery image"
                  />
                )}
              </div>
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
                  Post
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
