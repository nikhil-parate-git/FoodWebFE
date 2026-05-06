import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/auth/signupSlice"; 
import loginReducer from "../slice/auth/loginSlice";
import logotpReducer from "../slice/auth/logOtpSlice";
import profileReducer from "../slice/profile/profileSlice";
import passwordReducer from "../slice/auth/forgotPassSlice";
import categoryReducer from "../slice/category/categorySlice";
import dishReducer from "../slice/dishes/dishesSlice";
import pagecartReducer from "../slice/cart/cartSlice";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    login: loginReducer,
    logotp: logotpReducer,
    profile: profileReducer,
    password: passwordReducer,
    categories: categoryReducer,
    dishes: dishReducer,
  
    pagecart: pagecartReducer,
   
  },
});