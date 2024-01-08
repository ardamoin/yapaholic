import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../store/user-slice";
import ErrorPage from "./ErrorPage";

const GrantMembership = () => {
  const passcodeRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id);
  const userMembership = useSelector((state) => state.user.membership);

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(userId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/grant-membership`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, passcode: passcodeRef.current.value }),
          credentials: "include",
        }
      );

      const responseData = await response.json();

      if (!response.ok && response.status === 400) {
        // This if check is triggered when input validation fails, i.e. there is an issue with the user id
        console.log(responseData);
        alert(responseData.error[0].msg);
      } else if (!response.ok) {
        // This if check is triggered when input validation didn't fail and user id is valid but the requester is not authenticated or
        // there was an issue with the database
        alert(responseData.message);
      } else {
        // This if check is triggered if user successfully became a member
        alert("Congratulations! You are now a member :)");
        dispatch(userActions.updateMembership());
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (userMembership === "admin" || userMembership === "member") {
    return <ErrorPage errorMessage="User is already a member..."/>
  }

  if (typeof userId === "string") {
    return <ErrorPage errorMessage="User not found..."/>
  }

  return (
    <div className="flex justify-center items-center -mt-32 h-[100vh]">
      <form
        className="flex flex-col gap-2 items-center w-fit"
        // onClick={formSubmitHandler}
      >
        <h1 className="text-4xl self-start mb-2">Join the club</h1>
        <h2 className="text-lg self-start mb-2">
          Enter the secret passcode to become a member...
        </h2>
        <div className="flex flex-col w-full">
          <label htmlFor="name" className="text-sm text-gray-400">
            Passcode
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="border rounded h-10 px-1"
            ref={passcodeRef}
          />
        </div>
        <button
          onClick={formSubmitHandler}
          className="flex w-full justify-center items-center h-12 rounded bg-purple-pink text-white mt-4 hover:brightness-75 duration-75"
        >
          BECOME A MEMBER
        </button>
      </form>
    </div>
  );
};

export default GrantMembership;
