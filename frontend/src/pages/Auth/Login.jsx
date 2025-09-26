import { motion } from "framer-motion";
import { use, useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setformData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    // Проверка пароля
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Login form submitted successfully", {
        email: formData.email,
        password: formData.password,
        rememberMe,
      });
      // Здесь обычно отправка данных на сервер для аутентификации
    }
  };

  return (
    <section className="px-4">
      <div className="flex gap-4 items-stretch">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/0 border border-white/10 w-1/2 rounded-[30px] overflow-hidden"
        >
          <div className="flex items-center justify-center h-full">
            <p>content</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/5 border border-white/10 text-white w-1/2 rounded-[30px] px-10 py-10"
        >
          <div className="mb-10">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-5xl font-bold mb-4"
            >
              Login to website
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="max-w-[340px]"
            >
              To further use the functionality of our site, you must have your own account. Log in to your account if you have one to continue.
            </motion.p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col gap-3 mb-[15px]"
            >
              <label className="text-[16px] font-medium">Email</label>
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email address..." 
                className={`inline-flex text-[14px] border bg-white/5 px-4 py-3 rounded-[10px] w-full max-w-[350px] ${
                  errors.email ? "border-red-500/50" : "border-white/10"
                }`}
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm"
                >
                  {errors.email}
                </motion.p>
              )}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="flex flex-col gap-3 mb-[20px]"
            >
              <label className="text-[16px] font-medium">Password</label>
              <div className="relative w-full max-w-[350px]">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  placeholder="Enter your password..." 
                  className={`inline-flex text-[14px] border bg-white/5 px-4 py-3 rounded-[10px] w-full pr-10 ${
                    errors.password ? "border-red-500/50" : "border-white/10"
                  }`}
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm"
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="flex items-center mb-6"
            >
              <input 
                type="checkbox" 
                id="rememberMe" 
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-white/80">
                Remember me
              </label>
            </motion.div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-4 py-3 cursor-pointer hover:shadow-xl shadow-white/10 text-black w-full max-w-[350px] bg-white rounded-[10px] text-[16px] font-medium hover:opacity-90 transition-all duration-300 mb-4"
            >
              Login
            </motion.button>
          </form>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="relative my-6 max-w-[350px]"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/60">Or continue with</span>
            </div>
          </motion.div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 px-4 py-3 cursor-pointer text-white/60 w-full max-w-[350px] bg-white/10 border border-white/10 rounded-[10px] text-[16px] font-normal hover:bg-white/15 transition-colors duration-300 mb-6"
          >
            Login with Google
          </motion.button>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="text-center text-white/70 text-sm max-w-[350px]"
          >
            Don't have an account?{" "}
            <Link className="text-white font-medium hover:underline" to={"/signup"}>Create one</Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Login;
