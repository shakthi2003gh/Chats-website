import Auth from "./pages/auth";
import { useUser } from "./state/user";

function App() {
  const { user } = useUser();

  if (!user) return <Auth />;

  return (
    <>
      <h1>Hello world</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam,
        architecto!
      </p>
    </>
  );
}

export default App;
