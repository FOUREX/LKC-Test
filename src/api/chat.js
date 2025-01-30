import {instance} from "./base.js";

export const generate = async (messages) => {
    return instance.post("/chat", {
        "model": "llama3.2-vision",
        "stream": false,
        "raw": true,
        "messages": messages
    })
}

export const sendMessage = async (prompt) => {
    return instance.post("/generate", {
        model: "llama3.2-vision",
        prompt: prompt,
        stream: false
    })
}
