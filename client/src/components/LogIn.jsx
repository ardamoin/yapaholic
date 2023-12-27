import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { userActions } from "../store/user-slice";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const [errorMessages, setErrorMessages] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    const loginFormData = new FormData(event.target);
    const email = loginFormData.get("email");
    const password = loginFormData.get("password");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/log-in`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      const responseData = await response.json();
      console.log(response);
      console.log(responseData);
      if (!response.ok && response.status === 400) {
        // Refreshes potential error messages left over from previous attempts
        setErrorMessages([]);

        // Sets error messages for failed input validation
        for (const error of responseData.error) {
          setErrorMessages((prev) => [...prev, error.msg]);
        }
      } else if (!response.ok && response.status == 401) {
        // Sets error message for incorrect password
        setErrorMessages([responseData.message]);
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
        } else {
          alert("Access token could not be found");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-28">
      <form
        className="flex flex-col gap-2 items-center w-fit"
        onSubmit={formSubmitHandler}
      >
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

export default LogIn;
