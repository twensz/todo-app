import { Toaster } from "react-hot-toast";

import TodoHomepage from "./components/TodoHomepage";
import { TodoProvider } from "./context/TodoContext";

function App() {
  return (
    <>
      <TodoProvider>
        <TodoHomepage />
      </TodoProvider>

      <Toaster />
    </>
  );
}

export default App;
