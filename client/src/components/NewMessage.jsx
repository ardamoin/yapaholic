import { useState } from "react";
import { useSelector } from "react-redux";

const NewMessage = () => {
  const [charCount, setCharCount] = useState(0);
  const userName = useSelector((state) => state.user.name);

  const charCountHandler = (event) => {
    setCharCount(event.target.value.length);
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();
  };
  return (
    <div className="flex flex-col justify-center items-center mt-16">
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
              required
              maxLength={255}
              onChange={charCountHandler}
            />
            <span className="text-xs text-gray-400 self-end">{charCount}/255</span>
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
