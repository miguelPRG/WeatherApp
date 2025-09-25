import Header from "./components/Header";
import Graphics from "./components/Graphics";
import Footer from "./components/Footer";
import { WeatherProvider } from "./hooks/WeatherContext";


function App() {
  return (
    <WeatherProvider>
      <Header />
      <Graphics />
      <Footer />
    </WeatherProvider>
  );
}

export default App;
