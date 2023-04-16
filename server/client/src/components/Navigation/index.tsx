import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { NavLink, useLocation } from "react-router-dom";
export const baseUrl = "https://nonstop.sranjan.co│n.in/nonstop_api";
interface NavLinkProps {
  children: React.ReactNode;
  to: string;
}

const CustomLink = ({ to, children }: NavLinkProps) => {
  const {pathname: path} = useLocation();
  const isActive = path === to || path === `/${to}`;
  const className = `text-sm ${
    isActive
      ? "text-green-600 font-bold"
      : "text-gray-600 hover:text-gray-600 dark:text-gray-300"
  } `;
  return (
    <NavLink className={className} to={to}>
      {children}
    </NavLink>
  );
};

export interface User {
  id: string,
  img: string,
  createdAt: string,
  name: string,
  updatedAt: string,
  email: string
}


export const Navbar = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [,, removeCookie] = useCookies(['connect.sid']);

  const [user, setUser] = useState<any>()

  useEffect(() => {
    axios.get(`${baseUrl}/account`).then((res) => {
      setIsLoggedIn(res.data.loggedIn);
      const user: User = res.data
      setUser(user)
      window.localStorage.setItem("user", JSON.stringify(user))
    });
  }, []); 

  const logout = () => {
    axios.post(`${baseUrl}/logout`).then(() => {
    setIsLoggedIn(false)
    })
    removeCookie('connect.sid')
  }  

  return (
    <nav className="relative px-8 h-16 flex justify-between items-center border-y border-gray-400 dark:border-gray-700">
      {/* Home */}
      <NavLink
        className="text-3xl font-bold leading-none flex items-center space-x-4"
        to="#"
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#03fc3d"
            className="w-8 h-8"
          >
            <path
              fillRule="evenodd"
              d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
              clipRule="evenodd"
            />
            <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
          </svg>
        </span>
        <span className="text-gray-600 dark:text-gray-300 text-xl">
          NonStop
        </span>
      </NavLink>

      <div className="lg:hidden">
        <button className="navbar-burger flex items-center text-gray-600 dark:text-gray-300 p-3">
          <svg
            className="block h-4 w-4 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Mobile menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
        </button>
      </div>

      <ul className="hidden lg:flex lg:items-center grow mx-10 space-x-6">
        {/* Home */}
        <li>
          <CustomLink to={""}>Home</CustomLink>
        </li>
        <li>
          <CustomLink to={"mentorship"}>Mentorship</CustomLink>
        </li>
        <li>
          <CustomLink to={"learn"}>Learn</CustomLink>
        </li>
        <li>
          <CustomLink to={"competitions"}>Competitions</CustomLink>
        </li>
      </ul>
      <div className="hidden lg:block">
        {isLoggedIn ? (
          <div className="flex items-center space-x-8">
            <img
              className="inline-block w-12 h-12 rounded-full"
              src={user.img}
              alt="John Doe"
            />
            <span className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user.name}
              </span>
              <CustomLink to={"profile"}><span className="text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer">
                View Profile
              </span></CustomLink>
            </span>
            <button className="bg-green-600 px-4 py-2 rounded-full" onClick={_ => logout()}>Logout</button>
          </div>
        ) : (
          <NavLink to={`${baseUrl}/auth/google`}><button className="bg-green-600 px-4 py-2 rounded-full">Signup with Goggle</button></NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
