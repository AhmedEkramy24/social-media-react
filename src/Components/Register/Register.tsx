import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

export default function Register() {
  const [isSubmit, setIsSubmit] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(30, "Name must be less than 30 characters")
      .required("Name is required"),

    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    password: Yup.string()
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
      )
      .required("Password is required"),

    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),

    dateOfBirth: Yup.date()
      .max(new Date(), "Date of birth cannot be in the future")
      .required("Date of birth is required"),

    gender: Yup.string()
      .oneOf(["male", "female"], "You must select a gender")
      .required("Gender is required"),
  });

  interface register {
    name: string;
    email: string;
    password: string;
    rePassword: string;
    dateOfBirth: string;
    gender: string;
  }

  async function register(values: register) {
    setIsSubmit(true);
    try {
      const response = await fetch(
        "https://linked-posts.routemisr.com/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setApiError(data.error || "Something went wrong");
      } else {
        setApiError("");
        toast.success("Account created successfully! 🎉");
        navigate("/login");
      }
    } catch (error) {
      console.log("Error:", error);
      setApiError("Network error or server is unreachable.");
    } finally {
      setIsSubmit(false);
    }
  }

  const initialValues: register = {
    name: "",
    email: "",
    password: "",
    rePassword: "",
    dateOfBirth: "",
    gender: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: register,
    validationSchema,
  });

  return (
    <>
      <div className="container mx-auto">
        <h1 className="uppercase text-blue-500 text-center text-3xl my-5 font-bold">
          register now
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
              htmlFor="name"
              className="block mb-2 text-sm font-bold text-gray-900"
            >
              Name
            </label>
            <input
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              name="name"
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:outline-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="Write your name "
            />
            {formik.errors.name && formik.touched.name && (
              <div
                className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
                role="alert"
              >
                {formik.errors.name}
              </div>
            )}
          </div>

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

          <div className="mb-2 relative">
            <label
              htmlFor="rePassword"
              className="block mb-2 text-sm font-bold text-gray-900"
            >
              rePassword
            </label>
            <input
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.rePassword}
              name="rePassword"
              type={showPass ? "text" : "password"}
              id="rePassword"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:outline-blue-500 focus:border-blue-500 block w-full p-2.5 "
            />
            <span
              className="absolute right-3 top-9 cursor-pointer  text-blue-500"
              title={showPass ? "Hide password" : "Show password"}
              onClick={() => setShowPass(!showPass)}
            >
              <i className={`fas fa-eye${showPass ? "-slash" : ""}`}></i>
            </span>
            {formik.errors.rePassword && formik.touched.rePassword && (
              <div
                className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
                role="alert"
              >
                {formik.errors.rePassword}
              </div>
            )}
          </div>

          <div className="mb-2">
            <label
              htmlFor="dateOfBirth"
              className="block mb-2 text-sm font-bold text-gray-900"
            >
              Date of birth
            </label>
            <input
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.dateOfBirth}
              name="dateOfBirth"
              type="date"
              id="dateOfBirth"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:outline-blue-500 focus:border-blue-500 block w-full p-2.5 "
            />
            {formik.errors.dateOfBirth && formik.touched.dateOfBirth && (
              <div
                className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
                role="alert"
              >
                {formik.errors.dateOfBirth}
              </div>
            )}
          </div>

          <div className="mb-2">
            <label
              htmlFor="gender"
              className="block mb-2 text-sm font-bold text-gray-900"
            >
              gender
            </label>
            <select
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.gender}
              name="gender"
              id="countries"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:outline-blue-500 focus:border-blue-500 block w-full p-2 "
            >
              <option disabled value={""}>
                Choose your gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {formik.errors.gender && formik.touched.gender && (
              <div
                className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
                role="alert"
              >
                {formik.errors.gender}
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
              to={"/login"}
              className="text-lg underline underline-offset-2 font-bold text-blue-500"
            >
              You have an accont ?
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
