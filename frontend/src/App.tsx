import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { LoginForm } from "./features/login/LoginForm";
import RegisterForm from "./features/register/RegisterForm";
import { GamePage } from "./features/GamePage/GamePage";

const Background = () => {
    return (
        <div className="background"></div>
    );
};

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

const AppContent = () => {
    const location = useLocation();
    const showBackground = ["/", "/register"].includes(location.pathname);

    return (
        <>
            {showBackground && <Background />}
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/game" element={<GamePage />} />
            </Routes>
        </>
    );
};

export default App;