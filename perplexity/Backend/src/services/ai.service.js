import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3-flash-preview",
  apiKey: process.env.GOOGLE_API_KEY
});

export async function generateResponse() {

        model.invoke("hello").then((response) => {
            console.log( response.text);
})
}