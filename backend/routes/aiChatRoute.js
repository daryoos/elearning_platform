// aiChatRoute.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const verifyRole = require("../middleware/roleMiddleware");

const TOGETHER_API_KEY = "9685906da3bf2962adc2311ab73ab27ed013e77a3ecaabd4b6ecaad0012f628f";

router.post(
    "/",
    authenticateToken,
    verifyRole("student"),
    async (req, res) => {

        const { message, history = [] } = req.body;

        try {
            const response = await axios.post(
                "https://api.together.xyz/inference",
                {
                    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
                    prompt: buildPrompt(message, history),
                    max_tokens: 512,
                    temperature: 0.7,
                    stop: ["User:", "AI:"], // ✅ add this
                },
                {
                    headers: {
                        Authorization: `Bearer ${TOGETHER_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            res.json({ reply: response.data.output.choices[0].text });
        } catch (error) {
            console.error("AI Error:", error.response?.data || error.message);
            res.status(500).json({ error: "Failed to get AI response" });
        }
    });

function buildPrompt(message, history) {
    const formattedHistory = history
        .map((h) => `User: ${h.user}\nAI: ${h.ai}`)
        .join("\n");
    return `${formattedHistory}\nUser: ${message}\nAI:`;
}

module.exports = router;
