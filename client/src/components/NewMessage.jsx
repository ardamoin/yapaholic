import { useState } from "react";
import { useSelector } from "react-redux";
import ErrorPage from "./ErrorPage";

const NewMessage = () => {
  const [charCount, setCharCount] = useState(0);
  const userName = useSelector((state) => state.user.name);
  const userId = useSelector((state) => state.user.id);

  const charCountHandler = (event) => {
    setCharCount(event.target.value.length);
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    const messageFormData = new FormData(event.target);
    const title = messageFormData.get("title");
    const text = messageFormData.get("text");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/messages/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            title,
            text,
          }),
          credentials: "include",
        }
      );

      const responseData = await response.json();
      console.log(responseData);

      if (response.ok) {
        alert(responseData.message);
        event.target.reset();
      } else {
        alert(responseData.error[0].msg);
      }
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  if (typeof userId !== "number") {
    return (
      <ErrorPage errorMessage="Please log in before creating a message..." />
    );
  }

  return (
    <div className="flex flex-col justify-center items-center mt-16 mb-40">
      <div className="flex flex-col items-start gap-5">
        <h1 className="font-bold text-4xl mb-3">
          New <span className="text-purple-600">message</span>
        </h1>
        <p className="text-lg">
          Hi, <span className="text-purple-500">{userName}</span>
        </p>
        <p className="text-lg">
          What's on <span className="text-purple-500">your</span> mind?
        </p>
        <form
          className="flex flex-col gap-2 items-center w-fit"
          onSubmit={formSubmitHandler}
        >
          <div className="flex flex-col w-full">
            <label htmlFor="name" className="text-sm text-gray-400">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="border rounded h-10 px-1"
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="email" className="text-sm text-gray-400">
              Text
            </label>
            <textarea
              id="text"
              name="text"
              className="border rounded h-40 px-1 resize-none"
              cols={50}
              maxLength={255}
              onChange={charCountHandler}
            />
            <span className="text-xs text-gray-400 self-end">
              {charCount}/255
            </span>
          </div>
          <button className="flex w-full justify-center items-center h-12 rounded bg-purple-pink text-white mt-4 hover:brightness-75 duration-75 disabled:brightness-50">
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewMessage;
