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

      // Chat Toggle Button
      <button
        onClick={() => setChatOpen((prev) => !prev)}
        className={styles.chatToggleButton}
        aria-label="Deschide chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="white"
          className={styles.chatIcon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3.75h5.25M21 12a9 9 0 11-16.5-5.74c.2-.3.65-.36.9-.13l.63.64a1.5 1.5 0 002.25-.18l.36-.48a.75.75 0 011.23 0l.36.48a1.5 1.5 0 002.25.18l.63-.64c.25-.23.7-.17.9.13A9 9 0 0121 12z"
          />
        </svg>
      </button>

      {chatOpen && (
        <div className={styles.chatContainer}>
          <div className={styles.chatMessages}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`${styles.chatBubble} ${msg.role === "user" ? styles.userBubble : styles.aiBubble
                  }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
          <div className={styles.chatInputContainer}>
            <textarea
              className={styles.chatTextarea}
              rows={1}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Scrie un mesaj..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isSending || !chatInput.trim()}
              className={styles.chatSendButton}
            >
              Trimite
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default CourseListStudent;
