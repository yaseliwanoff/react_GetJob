import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Проверка размера файла (до 5 МБ)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({...errors, image: "File size must be less than 5MB"});
        return;
      }
      
      // Проверка типа файла
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setErrors({...errors, image: "Only JPG and PNG files are allowed"});
        return;
      }
      
      setProfileImage(URL.createObjectURL(file));
      setErrors({...errors, image: null});
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setErrors({...errors, role: null});
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Проверка имени
    const firstName = document.querySelector('input[placeholder="Your first name..."]').value;
    if (!firstName) newErrors.firstName = "First name is required";
    
    // Проверка фамилии
    const lastName = document.querySelector('input[placeholder="Your last name..."]').value;
    if (!lastName) newErrors.lastName = "Last name is required";
    
    // Проверка email
    const email = document.querySelector('input[placeholder="Enter your email address..."]').value;
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    // Проверка пароля
    const password = document.querySelector('input[placeholder="Enter your password..."]').value;
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // Проверка повторного пароля
    const repeatPassword = document.querySelector('input[placeholder="Repeat your password..."]').value;
    if (password !== repeatPassword) {
      newErrors.repeatPassword = "Passwords do not match";
    }
    
    // Проверка роли
    if (!selectedRole) {
      newErrors.role = "Please select your role";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Форма валидна, можно отправлять данные
      console.log("Form submitted successfully");
      // Здесь обычно отправка данных на сервер
    }
  };

  return (
    <section className="px-4">
      <div className="flex gap-4 items-stretch">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/0 border border-white/10 w-1/2 rounded-[30px] overflow-hidden p-10"
        >
          <div className="flex flex-col items-center justify-center h-full">
            <div 
              className="relative w-48 h-48 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer mb-4 overflow-hidden"
              onClick={() => fileInputRef.current.click()}
            >
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="text-white/40 text-center p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-sm">Upload Photo</p>
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 text-center">
                <span className="text-xs text-white">Change Photo</span>
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept=".jpg,.jpeg,.png"
                className="hidden"
              />
            </div>
            
            {errors.image && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mb-2"
              >
                {errors.image}
              </motion.p>
            )}
            
            <p className="text-white/40 text-sm text-center">
              Max 5MB JPG or PNG
            </p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 w-full max-w-xs"
            >
              <h3 className="text-white text-lg font-medium mb-4">I am a...</h3>
              
              <div className="flex gap-4">
                <div 
                  className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedRole === "employer" 
                      ? "bg-blue-500/20 border-blue-500" 
                      : "bg-white/5 border-white/10 hover:border-white/30"
                  }`}
                  onClick={() => handleRoleSelect("employer")}
                >
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    <span className="text-white font-medium">Employer</span>
                  </div>
                </div>
                
                <div 
                  className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedRole === "worker" 
                      ? "bg-blue-500/20 border-blue-500" 
                      : "bg-white/5 border-white/10 hover:border-white/30"
                  }`}
                  onClick={() => handleRoleSelect("worker")}
                >
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-white font-medium">Worker</span>
                  </div>
                </div>
              </div>
              
              {errors.role && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {errors.role}
                </motion.p>
              )}
            </motion.div>
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
              Sign Up
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="max-w-[340px]"
            >
              If you do not have an account, you will need to create one to further use the functionality of our site.
            </motion.p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2.5">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex flex-col gap-3 mb-[15px] flex-1"
              >
                <label className="text-[16px] font-medium">Full name</label>
                <input 
                  type="text" 
                  placeholder="Your full name..." 
                  className="inline-flex text-[14px] border border-white/10 bg-white/5 px-4 py-3 rounded-[10px] max-w-[350px]" 
                />
                {errors.firstName && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm"
                  >
                    {errors.firstName}
                  </motion.p>
                )}
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col gap-3 mb-[15px]"
            >
              <label className="text-[16px] font-medium">Email</label>
              <input 
                type="email" 
                placeholder="Enter your email address..." 
                className="inline-flex text-[14px] border border-white/10 bg-white/5 px-4 py-3 rounded-[10px] w-full max-w-[350px]" 
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
                  placeholder="Enter your password..." 
                  className="inline-flex text-[14px] border border-white/10 bg-white/5 px-4 py-3 rounded-[10px] w-full pr-10" 
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
              transition={{ duration: 0.5, delay: 1.0 }}
              className="flex flex-col gap-3 mb-[20px]"
            >
              <label className="text-[16px] font-medium">Repeat password</label>
              <div className="relative w-full max-w-[350px]">
                <input 
                  type={showRepeatPassword ? "text" : "password"} 
                  placeholder="Repeat your password..." 
                  className="inline-flex text-[14px] border border-white/10 bg-white/5 px-4 py-3 rounded-[10px] w-full pr-10" 
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                >
                  {showRepeatPassword ? (
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
              {errors.repeatPassword && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm"
                >
                  {errors.repeatPassword}
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
              Sign Up
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
            Sign Up with Google
          </motion.button>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="text-center text-white/70 text-sm max-w-[350px]"
          >
            You have account?{" "}
            <Link className="text-white font-medium hover:underline" to={"/login"}>
              Login in
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SignUp;
