import dotenv from "dotenv";
dotenv.config();

import { json, urlencoded } from "body-parser";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import { Configuration, OpenAIApi } from "openai";

export const createOpenAi = () => {
  console.log(process.env.OPENAI_API_KEY);
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  return openai;
};

export const createServer = (openai: OpenAIApi) => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .get("/healthz", (req, res) => {
      return res.json({ ok: true });
    })
    .get("/delayedhealth", async (req, res) => {
      const requestStart = Date.now();
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return res.json({
        ok: true,
        duration: `${(Date.now() - requestStart) / 1000}s`,
      });
    })
    .post("/ask", async (req, res) => {
      const { prompt } = req.body;

      try {
        if (typeof prompt === "string") {
          const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
            temperature: 0.7,
            max_tokens: 2000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });

          return res.json({
            article: response.data?.choices?.pop()?.text,
            originalPrompt: prompt,
          });
        }
        return res.status(401).send();
      } catch (e) {
        return res.status(500).send(e as Error);
      }
    });

  return app;
};
