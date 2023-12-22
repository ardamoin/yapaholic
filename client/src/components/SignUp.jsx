import { useRef, useState } from "react";
const SignUp = () => {
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const passwordMatchHandler = () => {
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex justify-center items-center -mt-32 h-[100vh]">
      <form className="flex flex-col gap-2 items-center w-fit">
        <h1 className="text-4xl self-start mb-2">Sign up</h1>
        <div className="flex flex-col w-full">
          <label htmlFor="name" className="text-sm text-gray-400">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="border rounded h-10 px-1"
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="email" className="text-sm text-gray-400">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            className="border rounded h-10 px-1"
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
              className="border rounded h-10 px-1"
              ref={passwordRef}
              onChange={passwordMatchHandler}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="confim-password" className="text-sm text-gray-400">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="border rounded h-10 px-1"
              onChange={passwordMatchHandler}
              ref={confirmPasswordRef}
            />
            {!passwordsMatch && (
              <p className="text-xs text-red-500">Passwords must match</p>
            )}
          </div>
        </div>
        <button className="flex w-full justify-center items-center h-12 rounded bg-purple-pink text-white mt-4 hover:brightness-75 duration-75">
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default SignUp;
