const GrantMembership = () => {
  const formSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex justify-center items-center -mt-32 h-[100vh]">
      <form className="flex flex-col gap-2 items-center w-fit">
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
          />
        </div>
        <button
          className="flex w-full justify-center items-center h-12 rounded bg-purple-pink text-white mt-4 hover:brightness-75 duration-75"
          onClick={formSubmitHandler}
        >
          BECOME A MEMBER
        </button>
      </form>
    </div>
  );
};

export default GrantMembership;
