import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";

const Messages = () => {
  const [messages, setMessages] = useState([]);

  const userMembership = useSelector((state) => state.user.membership);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (userMembership === null || userMembership === "non-member") {
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
        } else if (userMembership === "member" || userMembership === "admin") {
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
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();
  }, [userMembership]);

  return (
    <div className="flex flex-col items-center my-20">
      {messages.map((message) => {
        return (
          <div
            key={Math.random()}
            className="flex flex-col bg-pink-200 rounded-xl px-10 py-5 mb-10 w-[30rem]"
          >
            <p className="text-2xl font-bold mb-2">{message.title}</p>
            <p className="text-xl mb-4">{message.text}</p>
            {message.name && (
              <p className="flex justify-end">by {message.name}</p>
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
