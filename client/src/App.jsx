import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Messages from "./components/Messages";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import GrantMembership from "./components/GrantMembership";
import NotFound from "./components/NotFound";

function App() {
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
