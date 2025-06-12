import axios from "axios";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useUserContext } from "../../Hooks/useUserContext";
import { useState } from "react";

export default function ChangePass() {
  const [isSubmit, setIsSubmit] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const { token, setToken } = useUserContext();

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
      )
      .required("Password is required"),

    password: Yup.string()
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "wrong password pattern"
      )
      .required("Please write your password"),
  });

  interface ChangePass {
    newPassword: string;
    password: string;
  }

  const initialValues: ChangePass = {
    newPassword: "",
    password: "",
  };

  async function changePass(values: ChangePass) {
    setIsSubmit(true);
    try {
      const { data } = await axios.patch(
        "https://linked-posts.routemisr.com/users/change-password",
        values,
        {
          headers: {
            token,
          },
        }
      );
      toast.success(data.message);
      setApiError("");
      setToken(null);
      localStorage.setItem("token", "");
      navigate("/login");
    } catch (error: any) {
      setApiError(error.response.data.error);
    } finally {
      setIsSubmit(false);
    }
  }

  const formik = useFormik({
    initialValues,
    onSubmit: changePass,
    validationSchema,
  });

  return (
    <>
      <div className="container mx-auto">
        <h1 className="uppercase text-blue-500 text-center text-3xl my-5 font-bold">
          change password
        </h1>
        <form onSubmit={formik.handleSubmit} className="max-w-sm mx-auto p-2">
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
              htmlFor="password"
              className="block mb-2 text-sm font-bold text-gray-900"
            >
              password
            </label>
            <input
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              name="password"
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:outline-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="name@exmple.com"
            />
            {formik.errors.password && formik.touched.password && (
              <div
                className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
                role="alert"
              >
                {formik.errors.password}
              </div>
            )}
          </div>

          <div className="mb-2 relative">
            <label
              htmlFor="newPassword"
              className="block mb-2 text-sm font-bold text-gray-900"
            >
              new password
            </label>
            <input
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
              name="newPassword"
              type={showPass ? "text" : "password"}
              id="newPassword"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:outline-blue-500 focus:border-blue-500 block w-full p-2.5 "
            />
            <span
              className="absolute right-3 top-9 cursor-pointer  text-blue-500"
              title={showPass ? "Hide password" : "Show password"}
              onClick={() => setShowPass(!showPass)}
            >
              <i className={`fas fa-eye${showPass ? "-slash" : ""}`}></i>
            </span>
            {formik.errors.newPassword && formik.touched.newPassword && (
              <div
                className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
                role="alert"
              >
                {formik.errors.newPassword}
              </div>
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
              Submit
            </button>
          )}
        </form>
      </div>
    </>
  );
}
