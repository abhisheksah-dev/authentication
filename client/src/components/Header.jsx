import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
      <img
        src={assets.header_img}
        alt=""
        className="w-36 h-36 rounded-full mb-6"
      />
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Hey Developer{" "}
        <img className="w-8 aspect-square" src={assets.hand_wave} alt="" />
      </h1>
      <h2 className="text-2xl sm:text-4xl font-semibold mb-4">
        Welcome to our Authentication App
      </h2>
      <p className="mb-6 max-w-lg">
        Lets get started with a quick product tour nd will have you up and
        running in no time
      </p>
      <button className="border border-gray-500 rounded-full px-6 py-2.5 hover:bg-gray-100 transition-all">
        Get Started
      </button>
    </div>
  );
};

export default Header;
