const Messages = () => {
  const testMessageObj = {
    name: "McLovin",
    date: "Dec 31, 2023",
    title: "Test",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  };
  return (
    <div className="flex flex-col items-center my-20">
      <div className="flex flex-col bg-pink-200 rounded-xl px-10 py-5 mb-10 w-[30rem]">
        <p className="text-2xl font-bold mb-2">{testMessageObj.title}</p>
        <p className="text-xl mb-4">{testMessageObj.text}</p>
        <p className="flex justify-end">{testMessageObj.name}</p>
        <p className="flex justify-end">{testMessageObj.date}</p>
      </div>
      <div className="flex flex-col bg-pink-200 rounded-xl px-10 py-5 mb-10 w-[30rem]">
        <p className="text-2xl font-bold mb-2">{testMessageObj.title}</p>
        <p className="text-xl mb-4">{testMessageObj.text}</p>
        <p className="flex justify-end">{testMessageObj.name}</p>
        <p className="flex justify-end">{testMessageObj.date}</p>
      </div>
    </div>
  );
};

export default Messages;
