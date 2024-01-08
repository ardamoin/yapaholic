const ErrorPage = ({ errorMessage }) => {
  return (
    <div className="flex justify-center items-center -mt-32 h-[100vh]">
      <div className="flex flex-col gap-2 items-center w-fit">
        <h1 className="text-4xl text-purple-pink font-bold self-start mb-2">
          Error
        </h1>
        <h2 className="text-xl text-purple-pink self-start mb-2">
          {errorMessage}
        </h2>
      </div>
    </div>
  );
};

export default ErrorPage;
