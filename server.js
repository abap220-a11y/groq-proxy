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

app.get("/debug-key", (req, res) => {
    const key = process.env.GROQ_API_KEY || "";

    res.json({
        exists: !!key,
        length: key.length,
        starts_with_gsk: key.startsWith("gsk_"),
        first_8: key.slice(0, 8),
        last_4: key.slice(-4),
    });
});

app.get("/debug-env", (req, res) => {
    const env = {};

    for (const key of Object.keys(process.env)) {
        const val = process.env[key];

        if (typeof val === "string" && val.length > 8) {
            env[key] = val.slice(0, 6) + "...";
        } else {
            env[key] = val;
        }
    }

    res.json(env);
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
