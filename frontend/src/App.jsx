import Auth from "./pages/auth";
import ChatApp from "./pages/chatApp";
import Loading from "./pages/loading";
import { useUser } from "./state/user";

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) return <Loading />;
  if (!user) return <Auth />;
  return <ChatApp />;
}

export default App;
