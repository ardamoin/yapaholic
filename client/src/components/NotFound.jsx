import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <div className="flex justify-center items-center -mt-32 h-[100vh]">
      <div className="flex flex-col gap-2 items-center w-fit">
        <h1 className="text-4xl text-purple-pink font-bold self-start mb-2">
          Oops!
        </h1>
        <h2 className="text-xl text-purple-pink self-start mb-2">
          We can't seem to find the page you're looking for.
        </h2>
        <h3 className="text-md text-gray-600 self-start mb-2">
          Here are some helpful links instead:
          <ul className="mt-3 list-disc">
            <li>
              <Link className="text-pink-600 hover:text-pink-900" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="text-pink-500 hover:text-pink-900" to="/log-in">
                Log In
              </Link>
            </li>
            <li>
              <Link className="text-pink-500 hover:text-pink-900" to="/sign-up">
                Sign Up
              </Link>
            </li>
          </ul>
        </h3>
      </div>
    </div>
  );
};

export default NotFound;
