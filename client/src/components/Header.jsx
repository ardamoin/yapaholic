import { Link } from "react-router-dom";

import login from "../assets/login.svg";
import logout from "../assets/logout.svg";
import signup from "../assets/signup.svg";
import upgrade from "../assets/upgrade.svg";

const Header = () => {
  return (
    <div className="flex justify-between px-10 py-6 bg-golden-yellow">
      <Link to="/">
        <h1 className="text-purple-pink text-3xl font-semibold">Yapaholic</h1>
      </Link>
      <div className="flex gap-10 text-purple-pink text-md">
        <Link to="/log-in">
          <button className="border-solid border-[1px] px-4 py-1 rounded-md border-purple-pink hover:bg-purple-pink hover:text-golden-yellow transition flex items-center gap-2">
            <img src={login} className="h-5 w-auto" />
            Log In
          </button>
        </Link>
        <Link to="/sign-up">
          <button className="border-solid border-[1px] px-4 py-1 rounded-md border-purple-pink hover:bg-purple-pink hover:text-golden-yellow transition flex items-center gap-2">
            <img src={signup} className="h-5 w-auto" />
            Sign Up
          </button>
        </Link>
        {/* <Link to="/grant-membership">
          <button className="border-solid border-[1px] px-4 py-1 rounded-md border-purple-pink hover:bg-purple-pink hover:text-golden-yellow transition flex items-center gap-2">
            <img src={upgrade} className="h-5 w-auto" />
            Become a Member
          </button>
        </Link>

        <Link to="/">
          <button className="border-solid border-[1px] px-4 py-1 rounded-md border-purple-pink hover:bg-purple-pink hover:text-golden-yellow transition flex items-center gap-2">
            <img src={logout} className="h-5 w-auto" />
            Log Out
          </button>
        </Link> */}
      </div>
    </div>
  );
};

export default Header;