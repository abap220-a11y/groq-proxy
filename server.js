import express from "express";
import fetch from "node-fetch";

const app = express();

app.use(express.json({ limit: "2mb" }));

function getGroqKey() {
    return (process.env.GROQ_API_KEY || "").replace(/^["']|["']$/g, "").trim();
}

app.get("/", (req, res) => {
    res.json({ ok: true, service: "groq-proxy" });
});

app.get("/debug-key", (req, res) => {
    const key = getGroqKey();

    res.json({
        exists: !!key,
        length: key.length,
        starts_with_gsk: key.startsWith("gsk_"),
        first_8: key.slice(0, 8),
        last_4: key.slice(-4),
    });
});

app.post("/ai", async (req, res) => {
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getGroqKey()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();

        res.status(response.status).json(data);
    } catch (e) {
        res.status(500).json({
            error: "Proxy failed",
            details: e.message,
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Groq proxy running on port ${PORT}`);
});
