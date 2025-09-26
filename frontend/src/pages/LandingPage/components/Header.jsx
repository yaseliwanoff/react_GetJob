import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Menu } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const [isAuthentification, setIsAuthentification] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullName: "Yaroslav",
    role: "employer",
  });
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="cursor-default flex items-center space-x-3">
            <div className="flex border border-gray-300/25 items-center justify-center w-9 h-9 bg-gray-950 rounded-[10px]">
              <Briefcase width={20} height={20} color="white" />
            </div>
            <span className="text-[18px]">GetJob</span>
          </div>

          {/* Navigation links - hidden on mobile */}
          <nav className="md:flex items-center gap-4 text-[14px] hidden">
            <Link
              to={"/find-jobs"}
              onClick={() => navigate("/find-jobs")}
              className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300"
            >
              Find Jobs
            </Link>
            <Link
              to={"/saved-jobs"}
              onClick={() => navigate("/saved-jobs")}
              className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300"
            >
              Saved Jobs
            </Link>
            <Link
              to={"/find-jobs"}
              onClick={() => {
                navigate(
                  isAuthentification && userInfo?.role === "employer"
                    ? "/employer-dashboard"
                    : "/login"
                );
              }}
              className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300"
            >
              For Employers
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2.5">
            {isAuthentification ? (
              <div className="flex items-center gap-2.5">
                <span className="px-4 py-2.5 bg-white/10 rounded-full text-white/60">Welcome, {userInfo?.fullName}</span>
                <Link
                  className="underline"
                  to={
                    userInfo?.role === "employer"
                      ? "/employer-dashboard"
                      : "/find-jobs"
                  }
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link className="px-2 py-1 text-white/60 bg-transparent rounded-[10px] text-[14px] hover:bg-white/10  hover:text-white/60 transition-all duration-300" to={"/login"}>Login</Link>
                <Link className="px-2 py-1 text-black bg-white rounded-[10px] text-[14px] hover:opacity-60 transition-opacity duration-300" to={"/signup"}>Sign Up</Link>
              </div>
            )}
            <button className="md:hidden px-2.5 py-1 rounded-[10px] bg-white">
              <Menu color="black" width={13} />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header;
