import { useState } from "react";

const LogIn = () => {
  const formSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex justify-center items-center -mt-32 h-[100vh]">
      <form className="flex flex-col gap-2 items-center w-fit">
        <h1 className="text-4xl self-start mb-2">Log in</h1>
        <div className="flex flex-col w-full">
          <label htmlFor="email" className="text-sm text-gray-400">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            className="border rounded h-10 px-1 w-80"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm text-gray-400">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="border rounded h-10 px-1 w-80"
            />
          </div>
        </div>
        <button className="flex w-full justify-center items-center h-12 rounded bg-purple-pink text-white mt-4 hover:brightness-75 duration-75">
          LOGIN
        </button>
      </form>
    </div>
  );
};

export default LogIn;
