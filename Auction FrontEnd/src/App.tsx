import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuctionItem } from "./pages/AuctionItem";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Shop } from "./pages/Shop";
import { Signup } from "./pages/Signup";
import { BigItem } from "./components/BigItem";
import { TimerProvider } from "./Contexts/TimerContext";
function App() {
  return (
    <>
      <BrowserRouter>
        <TimerProvider>
          <Routes>
            <Route index element={<Home />} />
            <Route path="signup" element={<Signup />} />
            <Route path="shop" element={<Shop />} />
            <Route path="login" element={<Login />} />
            <Route path="postitem" element={<AuctionItem />} />
            <Route path="shop/:id" element={<BigItem />} />
          </Routes>
        </TimerProvider>
      </BrowserRouter>
      <Toaster
        position="bottom-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--color-grey-0)",
            color: "var(--color-grey-700)",
          },
        }}
      />
    </>
  );
}

export default App;
