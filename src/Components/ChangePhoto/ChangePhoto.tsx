import axios from "axios";
import { useUserContext } from "../../Hooks/useUserContext";
import { useEffect, useRef, useState } from "react";
import Loading from "../Loading/Loading";
import type { User } from "../../interfaces";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function ChangePhoto() {
  const [userLogedData, setUserLogedData] = useState<User | null>(null);
  const { token } = useUserContext();
  const [chosenImage, setChosenImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  interface ProfilePhoto {
    photo: File | string;
  }

  const initialValues: ProfilePhoto = {
    photo: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: uploadProfilePhoto,
  });

  async function uploadProfilePhoto(values: ProfilePhoto) {
    if (!values.photo) {
      Swal.fire({
        icon: "error",
        title: "No file chosen",
        text: "Please upload an image",
      });
      setIsSubmit(false);
      return;
    }
    setIsSubmit(true);
    const request = new FormData();
    request.append("photo", values.photo);
    try {
      const { data } = await axios.put(
        "https://linked-posts.routemisr.com/users/upload-photo",
        request,
        {
          headers: {
            token,
          },
        }
      );
      toast.success(data.message);
      setChosenImage(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      getUserLogedData();
    } catch (error) {
      console.warn(error);
    } finally {
      setIsSubmit(false);
    }
  }

  async function getUserLogedData() {
    let { data } = await axios.get(
      "https://linked-posts.routemisr.com/users/profile-data",
      {
        headers: {
          token,
        },
      }
    );
    setUserLogedData(data.user);
  }

  useEffect(() => {
    if (token) {
      getUserLogedData();
    }
  }, [token]);
  return (
    <>
      {userLogedData ? (
        <div className="bg-[#f1f1f1] h-screen">
          <div className="container pt-10">
            <h4 className="text-center text-2xl font-bold my-2">
              Hello, {userLogedData.name}
            </h4>
            <div className="size-52 mx-auto">
              <div className="img rounded-full overflow-hidden bg-white">
                <img
                  src={chosenImage ? chosenImage : userLogedData.photo}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <form
              onSubmit={formik.handleSubmit}
              className="md:w-1/2  mx-auto p-2"
            >
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

                    formik.setFieldValue("photo", file);
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
                      imageInputRef.current &&
                        (imageInputRef.current.value = "");
                      setChosenImage(null);
                    }}
                    className="px-3 py-1 rounded-md cursor-pointer text-red-500 hover:bg-red-500 hover:text-white border border-red-500 absolute right-2 bottom-1"
                  >
                    <i className="fas fa-trash-can"></i>
                  </button>
                )}
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
                  className="text-white  cursor-pointer bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm  sm:w-auto px-5 py-2.5 text-center "
                >
                  Change
                </button>
              )}
            </form>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
