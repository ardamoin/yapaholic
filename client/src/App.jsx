import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Messages from "./components/Messages";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import GrantMembership from "./components/GrantMembership";
import NotFound from "./components/NotFound";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "./store/user-slice";
import { jwtDecode } from "jwt-decode";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessTokenCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("access-token="));

    if (accessTokenCookie) {
      const accessToken = accessTokenCookie.replace("access-token=", "");
      const decodedCookie = jwtDecode(accessToken);
      dispatch(userActions.login(decodedCookie));
    }
  }, [dispatch]);
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Messages />} />
        <Route path="/log-in" element={<LogIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/grant-membership" element={<GrantMembership />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
