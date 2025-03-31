import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();
import axios from "axios";
import { get } from "mongoose";

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState("");

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "api/user/data");
      data.success ? setUserData(data.UserData) : toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "api/auth/is-auth");
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
