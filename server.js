import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const PORT = process.env.PORT || 3000;

app.post("/ai", async (req, res) => {
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: "Proxy failed" });
    }
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
