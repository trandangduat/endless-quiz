import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const schema = {
    type: SchemaType.ARRAY,
    description: "Create a quiz with 10 questions, split into 5 Medium (understanding), and 5 Hard (advance application). Questions must resemble real exams.",
    minItems: 10,
    maxItems: 10,
    items: {
        type: SchemaType.OBJECT,
        properties: {
            "questionText": {
                type: SchemaType.STRING,
                description: "A clear, exam-like question focused on core content. Must end with a question mark.",
                nullable: false,
            },
            "choices": {
                type: SchemaType.ARRAY,
                description: "Provide 4 plausible options (max 100 characters each), with one correct answer.",
                nullable: false,
                minItems: 4,
                maxItems: 4,
                items: {
                    type: SchemaType.STRING,
                    description: "Each option must be concise, relevant, and grammatically correct.",
                    nullable: false,
                },
            },
            "correctChoice": {
                type: SchemaType.NUMBER,
                description: "Index (0-3) of the correct answer.",
                nullable: false,
            },
            "difficulty": {
                type: SchemaType.STRING,
                description: "Set difficulty: Medium (understanding), Hard (analytical/advance application).",
                enum: ["Medium", "Hard"],
                nullable: false,
            },
        },
        required: ["difficulty", "questionText", "choices", "correctChoice"],
    },
};

export const generateQuiz = async(subject) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
        }
    });

    const prompt = "The subject is: " + subject;
    const result = await model.generateContent(prompt);
    const jsonResult = JSON.parse(result.response.text());
    return jsonResult;
};
