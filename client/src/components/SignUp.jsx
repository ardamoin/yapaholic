import { useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../store/user-slice";
import { useNavigate } from "react-router-dom";
import ErrorPage from "./ErrorPage";

const SignUp = () => {
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [errorMessages, setErrorMessages] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.id);

  const passwordMatchHandler = () => {
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    const signupFormData = new FormData(event.target);
    const name = signupFormData.get("name");
    const email = signupFormData.get("email");
    const password = signupFormData.get("password");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/sign-up`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
          credentials: "include",
        }
      );

      const responseData = await response.json();
      console.log(responseData);

      if (!response.ok && response.status === 400) {
        // Refreshes potential error messages left over from previous attempts
        setErrorMessages([]);

        // Sets error messages for failed input validation
        for (const error of responseData.errors) {
          setErrorMessages((prev) => [...prev, error.msg]);
        }
      } else if (response.ok) {
        // Login was successful.
        // Removes error messages
        setErrorMessages([]);

        // Pulls access token cookie set by the response to POST request
        const accessTokenCookie = document.cookie
          .split("; ")
          .find((cookie) => cookie.startsWith("access-token="));

        // If access token cookie exists, decodes the cookie
        // and updates Redux with user info
        if (accessTokenCookie) {
          const accessToken = accessTokenCookie.replace("access-token=", "");
          const decodedCookie = jwtDecode(accessToken);
          dispatch(userActions.login(decodedCookie));
          navigate("/");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (userId) {
    return (
    <ErrorPage errorMessage="Can't sign up when user is already signed in..." />
    );
  }

  return (
    <div className="flex flex-col justify-center items-center mt-28">
      <form
        className="flex flex-col gap-2 items-center w-fit"
        onSubmit={formSubmitHandler}
      >
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
        <button
          className="flex w-full justify-center items-center h-12 rounded bg-purple-pink text-white mt-4 hover:brightness-75 duration-75 disabled:brightness-50"
          disabled={!passwordsMatch}
        >
          SUBMIT
        </button>
        {errorMessages.length !== 0 && (
          <ul className="flex flex-col self-start max-w-[22rem] gap-2 mt-6 text-red-600">
            {errorMessages.map((error) => (
              <li key={Math.random()}>{error}</li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
};

export default SignUp;
