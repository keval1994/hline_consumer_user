import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter as Router } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import AppRoutes from "./routes/AppRoutes.jsx";
import AnimatedCursor from "react-animated-cursor";
import PageTitleUpdater from "./utils/PageTitleUpdater.jsx";
import { Toast } from "./common/Toast/index.js";

function App() {
  return (
    <Router>
      <Toast />
      <PageTitleUpdater />
      <MainLayout>
        <AnimatedCursor
          innerSize={8}
          outerSize={35}
          color="8, 31, 98"
          outerAlpha={0.2}
          innerScale={1}
          outerScale={2}
          clickables={["a", "button", ".link", "[data-custom-cursor]"]}
          showSystemCursor={false}
        />
        <AppRoutes />
      </MainLayout>
    </Router>
  );
}

export default App;
