import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./CourseListStudent.module.css";
import { getAllCourses } from "../services/courseService";
import { enrollInCourse } from "../services/enrollmentService";
import { useAuth } from "../context/AuthContext";
import CourseNavbar from "../components/CourseNavbar";
import axios from "../api/axios";

const CourseListStudent = () => {
  const [courses, setCourses] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [domain, setDomain] = useState("");
  const [domains, setDomains] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, token } = useAuth();

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchCourses = async () => {
    console.log("🔤 Limbile utilizatorului:", user?.Languages);
    const params = {};
    if (startDate) params.startDate = startDate.toISOString().split("T")[0];
    if (endDate) params.endDate = endDate.toISOString().split("T")[0];
    if (domain) params.domain = domain;

    try {
      const res = await getAllCourses(params);

      // Extrage toate domeniile din rezultate
      const domainSet = new Set(res.map((course) => course.domain));
      setDomains([...domainSet]);

      let filtered = [...res];

      // Filtrare după perioadă (frontend)
      filtered = filtered.filter((course) => {
        const courseStart = new Date(course.startDate);
        const courseEnd = new Date(course.endDate);

        // normalizează ziua
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (courseStart < start) return false;
        }

        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (courseEnd > end) return false;
        }

        return true;
      });

      // Filtrare după domeniu (frontend fallback, dacă nu filtrezi în backend)
      if (domain) {
        filtered = filtered.filter((course) => course.domain === domain);
      }

      // Căutare după titlu
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const preferredLanguageIds = user?.Languages?.map((lang) => lang.id) || [];

      filtered.sort((a, b) => {
        const aLang = a.Language?.id;
        const bLang = b.Language?.id;

        const aIsPreferred = preferredLanguageIds.includes(aLang);
        const bIsPreferred = preferredLanguageIds.includes(bLang);

        if (aIsPreferred && !bIsPreferred) return -1;
        if (bIsPreferred && !aIsPreferred) return 1;
        return 0;
      });

      setCourses(filtered);
    } catch (err) {
      console.error("Eroare la preluarea cursurilor:", err);
    }
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setDomain("");
    setSearchTerm("");
    fetchCourses();
  };

  const handleEnroll = async (courseId) => {
    try {
      await enrollInCourse({ userId: user.id, courseId }, token);
      alert("✅ Te-ai înrolat cu succes!");
      fetchCourses();
    } catch (err) {
      alert("❌ Înrolarea a eșuat sau ești deja înrolat.");
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();

    const newMessages = [
      ...chatMessages,
      { role: "user", content: userMessage },
    ];

    setChatMessages(newMessages);
    setChatInput("");
    setIsSending(true);

    try {
      // Build history in expected format for backend
      const formattedHistory = chatMessages
        .filter((msg) => msg.role === "user" || msg.role === "assistant")
        .reduce((acc, msg, idx, arr) => {
          if (msg.role === "user") {
            const aiMsg = arr[idx + 1];
            if (aiMsg && aiMsg.role === "assistant") {
              acc.push({ user: msg.content, ai: aiMsg.content });
            }
          }
          return acc;
        }, []);

      const res = await axios.post("/aichat/", {
        message: userMessage,
        history: formattedHistory,
      });

      const aiReply = res.data.reply;

      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiReply },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      alert("Eroare la trimiterea mesajului către AI.");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [searchTerm]);

  return (
    <div className={styles.container}>
      <CourseNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className={styles.filters}>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="Data început"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText="Data final"
        />
        <select value={domain} onChange={(e) => setDomain(e.target.value)}>
          <option value="">Toate domeniile</option>
          {domains.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <button onClick={fetchCourses}>Filtrează</button>
        <button onClick={resetFilters} className={styles.resetButton}>Reset</button>
      </div>

      {courses.length === 0 ? (
        <p style={{ textAlign: "center", color: "#6b7280" }}>Nu există cursuri disponibile.</p>
      ) : (
        courses.map((course) => (
          <div key={course.id} className={styles.courseCard}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p><strong>Domeniu:</strong> {course.domain}</p>
            <p><strong>Perioadă:</strong> {course.startDate} → {course.endDate}</p>
            <p><strong>Ședințe:</strong> {course.sessions}</p>
            <p><strong>Locuri disponibile:</strong> {course.availableSeats}</p>
            <p><strong>Cost:</strong>{" "}
              {course.Offers?.length > 0 ? (
                <>
                  <span style={{ textDecoration: "line-through", color: "gray" }}>
                    {course.price}€
                  </span>{" "}
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {(course.price * (1 - course.Offers[0].discount / 100)).toFixed(2)}€
                  </span>{" "}
                  <em>({course.Offers[0].discount}% reducere)</em>
                </>
              ) : (
                `${course.price}€`
              )}
            </p>

            <p><strong>Limbă:</strong> {course.Language?.name || "N/A"}</p>
            {course.availableSeats > 0 && new Date(course.endDate) >= new Date() ? (
              <button
                className={styles.enrollButton}
                onClick={() => handleEnroll(course.id)}
              >
                Înrolează-te
              </button>
            ) : (
              <p className={styles.unavailable}>Curs indisponibil</p>
            )}
          </div>
        ))
      )}

      {/* Chat Toggle Button */}
      <button
        onClick={() => setChatOpen((prev) => !prev)}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          zIndex: 1000,
          backgroundColor: "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          cursor: "pointer",
        }}
      >
        💬
      </button>

      {/* Chat Panel */}
      {chatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            left: "20px",
            width: "300px",
            maxHeight: "400px",
            overflowY: "auto",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            zIndex: 999,
          }}
        >
          <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "10px" }}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: "8px" }}>
                <strong>{msg.role === "user" ? "Tu" : "AI"}:</strong> {msg.content}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Scrie un mesaj..."
            style={{ width: "100%", marginBottom: "5px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={isSending || !chatInput.trim()}
            style={{
              width: "100%",
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              padding: "8px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Trimite
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseListStudent;
