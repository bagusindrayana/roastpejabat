import { json, error } from "@sveltejs/kit";
import axios from "axios";
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { dev } from '$app/environment';
import { GEMINI_AI_KEY } from '$env/static/private';
import { GoogleGenerativeAI, GoogleGenerativeAIResponseError, HarmCategory, HarmBlockThreshold, GoogleGenerativeAIError } from "@google/generative-ai";

const limiter = new RateLimiter({
    IP: [15, 'm'],
    IPUA: [10, 'm'],
});



export const POST = async (event) => {
    const allowedOrigins = ['http://localhost:5173','https://roastpejabat.vercel.app','https://roastpejabat.pages.dev'];
    const origin = event.request.headers.get('origin');
    const headersCors = {
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (dev) {
        headersCors['Access-Control-Allow-Origin'] = '*';
    } else {
        if (!allowedOrigins.includes(origin ?? '')) {
            error(403, 'Forbidden');
        } else {
            headersCors['Access-Control-Allow-Origin'] = origin;
        }
    }
    //limit request
    if (await limiter.isLimited(event)) {
        error(429, 'Too Many Requests');
    }
    const body = await event.request.json();

    //debug name
    console.log(body.officialInfo.profil.nama);

    let prompt = "berikan roasting singkat dengan kejam,menyindir, serta menyakitkan dalam bahasa gaul untuk profile pejabat berikut : " + JSON.stringify(body.officialInfo) + ". (hanya berikan response dengan singkat dalam bahasa indonesia. jangan berikan pujian atau saran.)";
    if (body.language == "english") {
        prompt = "give a short and harsh roasting for the following official profile  " + JSON.stringify(body.officialInfo) + ". (only give short response with english language. dont give praise or advice.)";
    }
    try {

        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
        ];

        //split coma and get one random key
        const geminiApiKeys = GEMINI_AI_KEY.split(",");
        const randomGeminiApiKey = geminiApiKeys[Math.floor(Math.random() * geminiApiKeys.length)];
        let genAI = new GoogleGenerativeAI(randomGeminiApiKey);
        const modelAi = genAI.getGenerativeModel({ model: "gemini-2.5-flash", safetySettings });
        const result = await modelAi.generateContent(prompt);
        const response = await result.response;


        return json({
            roasting: response.text()
        }, {
            headers: headersCors
        });

    } catch (error) {
        return json({
            error: error.message
        }, {
            status: 500,
            headers: headersCors
        });
    }
}