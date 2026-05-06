import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "./redux/slice/cart/cartSlice";
import Publicroutes from "./routes/Publicroutes";

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.profile.token);

  // ✅ Token hai toh cart fetch karo — refresh pe bhi kaam karega
  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    }
  }, [token, dispatch]);

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        // autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <Publicroutes />
    </BrowserRouter>
  );
};

export default App;
