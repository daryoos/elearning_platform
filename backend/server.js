require("dotenv").config();

const express = require("express");
const app = express();

const sequelize = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const statRoutes = require("./routes/statRoutes");
const offerRoutes = require("./routes/offerRoutes");
const languageRoutes = require("./routes/languageRoutes");
const aiChatRoute = require("./routes/aiChatRoute");
const bodyParser = require("body-parser");

const cors = require("cors");
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const errorHandler = require("./middleware/errorHandler");

app.use(express.json());

app.get("/ping", (req, res) => {
    res.json({ message: "pong from backend!" });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);
app.use("/stats", statRoutes);
app.use("/offers", offerRoutes);
app.use("/languages", languageRoutes);
app.use(bodyParser.json());
app.use("/aichat", aiChatRoute);

app.use(errorHandler);

sequelize.sync().then(() => {
    console.log("Database synced");
    app.listen(process.env.PORT, () => console.log(`Server running on PORT ${process.env.PORT}`));
}).catch((err) => {
    console.error("Failed to sync DB:", err);
});