import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../../Hooks/useUserContext";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef: any = useRef(null);

  const { token, setToken } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!openMenu) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  function logOut() {
    setToken(null);
    localStorage.setItem("token", "");
    navigate("/login");
  }

  return (
    <>
      <nav className="bg-gray-800 p-3">
        <div className="container flex items-center gap-5 justify-between">
          <div className="logo font-bold ">
            <Link to={""}>
              <h1 className="text-blue-400 text-3xl">Social App</h1>
            </Link>
          </div>
          {/* links big devices */}
          <div className="links md:flex hidden grow justify-between mt-2">
            {token && (
              <ul className="text-white font-semibold flex space-x-5 ">
                <li className="hover:text-blue-400">
                  <NavLink to={"addpost"}>
                    <i className="fas me-1 fa-square-plus"></i> Add Post
                  </NavLink>
                </li>
                <li className="hover:text-blue-400">
                  <NavLink to={"profile"}>
                    <i className="fas me-1 fa-user"></i> Profile
                  </NavLink>
                </li>
                <li className="hover:text-blue-400">
                  <NavLink to={"settings"}>
                    <i className="fas me-1 fa-gear"></i> Settings
                  </NavLink>
                </li>
              </ul>
            )}

            <ul className="text-white font-semibold ms-auto flex space-x-5 ">
              {token ? (
                <li className="hover:text-blue-400">
                  <span
                    className="cursor-pointer hover:text-red-500"
                    onClick={logOut}
                  >
                    <i className="fa-solid me-1 fa-arrow-right-from-bracket text-red-500"></i>{" "}
                    Log out
                  </span>
                </li>
              ) : (
                <>
                  <li className="hover:text-blue-400">
                    <NavLink to={"login"}>Login</NavLink>
                  </li>
                  <li className="hover:text-blue-400">
                    <NavLink to={"register"}>Register</NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
          {/* links small devices */}
          <div
            className={`bg-gray-800 w-52 h-screen duration-300 ${
              openMenu ? "right-0" : "-right-52"
            } top-0 fixed pt-10 md:hidden z-50 `}
            ref={menuRef}
          >
            <ul className="text-white font-semibold p-4 space-y-5">
              <button
                className="absolute top-3 right-3 cursor-pointer"
                onClick={() => setOpenMenu(!openMenu)}
              >
                <i className="fas fa-xmark fa-2xl text-red-500 "></i>
              </button>
              {token ? (
                <>
                  <li
                    className="hover:text-blue-400 hover:translate-x-2 duration-300 "
                    onClick={() => setOpenMenu(!openMenu)}
                  >
                    <NavLink to={"addpost"}>
                      <i className="fas fa-square-plus me-1"></i> Add Post
                    </NavLink>
                  </li>
                  <li
                    className="hover:text-blue-400 hover:translate-x-2 duration-300 "
                    onClick={() => setOpenMenu(!openMenu)}
                  >
                    <NavLink to={"profile"}>
                      <i className="fas fa-user me-1"></i> Profile
                    </NavLink>
                  </li>
                  <li
                    className="hover:text-blue-400 hover:translate-x-2 duration-300 "
                    onClick={() => setOpenMenu(!openMenu)}
                  >
                    <NavLink to={"settings"}>
                      <i className="fas fa-gear me-1"></i> Settings
                    </NavLink>
                  </li>
                  <li
                    className="hover:text-blue-400 hover:translate-x-2 duration-300 "
                    onClick={() => {
                      setOpenMenu(!openMenu);
                      logOut();
                    }}
                  >
                    <span className="cursor-pointer hover:text-red-500">
                      <i className="fa-solid me-1 fa-arrow-right-from-bracket text-red-500"></i>{" "}
                      Log out
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li
                    className="hover:text-blue-400 hover:translate-x-2 duration-300 "
                    onClick={() => setOpenMenu(!openMenu)}
                  >
                    <NavLink to={"login"}>Login</NavLink>
                  </li>
                  <li
                    className="hover:text-blue-400 hover:translate-x-2 duration-300 "
                    onClick={() => setOpenMenu(!openMenu)}
                  >
                    <NavLink to={"register"}>Register</NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
          {/* icon */}
          <button
            className="text-white block md:hidden"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <i className="fas fa-bars fa-xl"></i>
          </button>
        </div>
      </nav>
    </>
  );
}
