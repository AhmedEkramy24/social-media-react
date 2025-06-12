import axios from "axios";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useUserContext } from "../../Hooks/useUserContext";
import { useState } from "react";

export default function Login() {
  const [isSubmit, setIsSubmit] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const { setToken } = useUserContext();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Wrong password pattern"
      ),
  });

  interface Login {
    email: string;
    password: string;
  }

  const initialValues: Login = {
    email: "",
    password: "",
  };

  async function login(values: Login) {
    setIsSubmit(true);
    try {
      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/users/signin",
        values
      );
      toast.success(data.message);
      setApiError("");
      navigate("/");
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } catch (error: any) {
      setApiError(error.response.data.error);
    } finally {
      setIsSubmit(false);
    }
  }

  const formik = useFormik({
    initialValues,
    onSubmit: login,
    validationSchema,
  });

  return (
    <>
      <div className="container mx-auto">
        <h1 className="uppercase text-blue-500 text-center text-3xl my-5 font-bold">
          login
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
              htmlFor="email"
              className="block mb-2 text-sm font-bold text-gray-900"
            >
              Email
            </label>
            <input
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              name="email"
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:outline-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="name@exmple.com"
            />
            {formik.errors.email && formik.touched.email && (
              <div
                className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
                role="alert"
              >
                {formik.errors.email}
              </div>
            )}
          </div>

          <div className="mb-2 relative">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-bold text-gray-900"
            >
              Password
            </label>
            <input
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              name="password"
              type={showPass ? "text" : "password"}
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:outline-blue-500 focus:border-blue-500 block w-full p-2.5 "
            />
            <span
              className="absolute right-3 top-9 cursor-pointer  text-blue-500"
              title={showPass ? "Hide password" : "Show password"}
              onClick={() => setShowPass(!showPass)}
            >
              <i className={`fas fa-eye${showPass ? "-slash" : ""}`}></i>
            </span>
            {formik.errors.password && formik.touched.password && (
              <div
                className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
                role="alert"
              >
                {formik.errors.password}
              </div>
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
                Submit
              </button>
            )}
            <Link
              to={"/register"}
              className="text-lg underline underline-offset-2 font-bold text-blue-500"
            >
              You don't have an accont ?
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
