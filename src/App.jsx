import "./App.css";
import Routes from "@/pages/Routes";
import { useAuth } from "@/context/AuthContext";
import ScreenLoader from "@/components/screenLoader"; // Loader ko import kiya

const App = () => {

  const { loading } = useAuth();

  // Agar loading ho rahi hai toh sirf Loader component dikhao
  if (loading) { return <ScreenLoader /> }

  // Loading khatam hone par asli Routes
  return (
    <>
      <Routes />
    </>
  );
};

export default App;