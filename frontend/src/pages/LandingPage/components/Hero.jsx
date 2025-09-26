import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Users, Building2, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Light from "../../../assets/images/png/light.png";

import { status } from "../../../utils/data";

const Hero = () => {
  const [isAuthentification, setIsAuthentification] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullName: "Yaroslav",
    role: "employer",
  });
  const navigate = useNavigate();

  return (
    <>
      <div className="absolute top-[-50%] opacity-35 blur-lg z-[-1] left-0 w-full flex justify-center">
        <img draggable={false} src={Light} alt="light" className="max-w-full h-auto" />
      </div>
      <section className="container mx-auto px-4 z-10">
        <div className="bg-white/5 border border-white/10 rounded-[30px] w-full px-10 py-10">
          <div className="">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl mb-4 flex flex-col items-center text-center font-bold tracking-tight"
            >
              <span>Find Your Dream</span>
              <span>
                Job or{" "}
                <span className="bg-red-400 inline-block text-red-900 rounded-[20px] px-3 py-1 w-fit">
                  Perfect Hire
                </span>
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-white/70 max-w-[400px] text-center flex mx-auto mb-5"
            >
              Connect talented professionals with innovative companies.
              Your next career move or perfect candidate is just one click away.
            </motion.p>
            <motion.div className="flex gap-2.5 justify-center">
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="flex justify-between gap-2 items-center cursor-pointer bg-white/10 rounded-[10px] text-white/60 px-2 py-1"
              >
                <Search width={14} height={14} />
                <span>Find Jobs</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer bg-white rounded-[10px] text-black px-2 py-1"
                onClick={() => {
                  navigate(
                    isAuthentification && userInfo?.role === "employer"
                      ? "/employer-dashboard"
                      : "/login"
                  );
                }}
              >
                Post a Job
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0.8, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-1  md:flex gap-2.5 mt-10 justify-center"
            >
              {status.map((start, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  className="flex items-start gap-2 border border-white/15 bg-white/10 rounded-[10px] px-6 py-3.5"
                >
                  <div className="bg-white/20 rounded-[10px] px-2 py-2">
                    <start.icon width={16} height={16} />
                  </div>
                  <div>
                    <div className="font-medium text-[17px]">{start.value}</div>
                    <div className="text-[14px] text-white/60">{start.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero;
