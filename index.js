import express from "express";
import { generateQuiz } from "./genai.js";
const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.post("/api/gen-quiz", async(req, res) => {
    const userInputSubject = req.body.subject;
    const quiz = await generateQuiz(userInputSubject);

    for (let i = 0; i < quiz.length; i++) {
        const Q = quiz[i];
        console.log(Q.questionText)
        for (let i = 1; i <= 4; i++) {
            console.log(i + ". " + Q.choices[i - 1]);
        }
        console.log("Correct answer: ", Q.correctChoice + 1);
        console.log("______________________");
    }
    res.send("hihi");
});

app.listen(PORT, () => {
    console.log(`Listen on port http://localhost:${PORT}`);
});
