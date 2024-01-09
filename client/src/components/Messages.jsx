import { useEffect, useState } from "react";
import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";
import Spinner from "./Spinner";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        setMessages((prev) => [...prev.sort(compareMessageDates)]);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();
  }, []);

  const compareMessageDates = (a, b) => {
    if (a.date < b.date) {
      return 1;
    }
    if (a.date > b.date) {
      return -1;
    }
    return 0;
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
            <p className="text-2xl font-bold mb-2 text-cyan-600">{message.title}</p>
            <p className="text-lg mb-4 break-all">{message.text}</p>
            {message.name && (
              <p className="flex justify-end">by&nbsp;<span className="font-bold text-violet-600">{message.name}</span></p>
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
