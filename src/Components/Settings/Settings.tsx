import { Link } from "react-router-dom";

export default function Settings() {
  return (
    <>
      <div className="container p-2">
        <Link to={"/changepass"}>
          <h3 className="text-3xl font-semibold my-3 cursor-pointer hover:text-blue-500">
            <i className="fa-solid me-2 fa-circle-arrow-right text-blue-500"></i>
            Change Password
          </h3>
        </Link>

        <Link to={"/changephoto"}>
          <h3 className="text-3xl font-semibold my-3 cursor-pointer hover:text-blue-500">
            <i className="fa-solid me-2 fa-circle-arrow-right text-blue-500"></i>
            Change Profile Photo
          </h3>
        </Link>
      </div>
    </>
  );
}
