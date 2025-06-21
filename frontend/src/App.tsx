import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { LoginForm } from "./features/login/LoginForm";
import RegisterForm from "./features/register/RegisterForm";
import PixelGrid from "./game/GamePage/PixelGrid.tsx";

const Background = () => <div className="background" />;
const BackgroundGame = () => <div className="background-game" />;

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

const AppContent = () => {
    const location = useLocation();

    return (
        <>
            {location.pathname === "/game" ? <BackgroundGame /> : <Background />}

            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/game" element={<PixelGrid />} />
            </Routes>
        </>
    );
};

export default App;