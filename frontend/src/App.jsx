import Auth from "./pages/auth";
import Loading from "./pages/loading";
import { useUser } from "./state/user";

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) return <Loading />;
  if (!user) return <Auth />;

  return (
    <main>
      <h1>Hello world</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam,
        architecto!
      </p>
    </main>
  );
}

export default App;
