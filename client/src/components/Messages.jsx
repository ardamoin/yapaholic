import { useEffect, useState } from "react";
import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";
import Spinner from "./Spinner";
import { useSelector } from "react-redux";

import trash from "../assets/trash.svg";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userMembership = useSelector((state) => state.user.membership);

  useEffect(() => {
    const fetchMessages = async () => {
      const accessTokenCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("access-token="));

      const userMembership = accessTokenCookie
        ? jwtDecode(accessTokenCookie.replace("access-token=", "")).membership
        : "non-member";

      try {
        if (userMembership === "member" || userMembership === "admin") {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/messages/member`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }
          );

          const responseData = await response.json();
          console.log(responseData);
          setMessages(responseData.result);
        } else {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/messages/non-member`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }
          );

          const responseData = await response.json();
          console.log(responseData);
          setMessages(responseData.result);
        }
        setMessages((prev) => [...prev.sort(compareMessageIDs)]);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();
  }, []);

  const compareMessageIDs = (a, b) => {
    if (a.id < b.id) {
      return 1;
    }
    if (a.id > b.id) {
      return -1;
    }
    return 0;
  };

  const messageDeleteHandler = async (event) => {
    const message_id = event.currentTarget.id;
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/messages/delete`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_id }),
        credentials: "include",
      }
    );

    const responseData = await response.json();
    alert(responseData.message);

    if (response.ok) {
      event.target.parentNode.parentNode.parentNode.remove();
    }
  };

  return (
    <div className="flex flex-col items-center my-20">
      {isLoading && <Spinner />}
      {messages.map((message) => {
        return (
          <div
            key={message.id}
            className="flex flex-col bg-pink-200 rounded-xl px-10 py-5 mb-10 w-[30rem]"
          >
            <div className="flex justify-between">
              <p className="text-2xl font-bold mb-2 text-cyan-600">
                {message.title}
              </p>
              {userMembership === "admin" && (
                <button
                  id={message.id}
                  className=" hover:scale-150 transition"
                  onClick={messageDeleteHandler}
                >
                  <img src={trash} />
                </button>
              )}
            </div>
            <p className="text-lg mb-4 break-all">{message.text}</p>
            {message.name && (
              <p className="flex justify-end">
                by&nbsp;
                <span className="font-bold text-violet-600">
                  {message.name}
                </span>
              </p>
            )}
            {message.date && (
              <p className="flex justify-end">
                {format(new Date(Date.parse(message.date)), "MMM d, yyyy")}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
