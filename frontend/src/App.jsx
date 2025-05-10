import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseListStudent from "./pages/CourseListStudent";
import CourseListPublic from "./pages/CourseListPublic";
import CourseListProfessor from "./pages/CourseListProfessor";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/courses" replace />} />
        <Route path="/courses" element={<CourseListPublic />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student/courses" element={<CourseListStudent />} />
        <Route path="/professor/courses" element={<CourseListProfessor />} />
      </Routes>
    </Router>
  );
}

export default App;
