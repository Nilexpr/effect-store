import { useSyncExternalStore } from "react";
import { createDataStore } from "./components/data-store/store";

const dataStore = createDataStore();

function App() {
  const todos = useSyncExternalStore();

  return (
    <section className="">
      <div>123</div>
    </section>
  );
}

export default App;
