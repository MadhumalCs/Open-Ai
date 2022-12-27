import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from "openai";

// to be able to dotenv we need to ---
dotenv.config();

// console.log(process.env.OPENAI_API_KEY);

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// *** Initialize Express Application
const app = express();
app.use(cors());            //this is going to help to make the cors or.. requests
app.use(express.json());    //this is going to allow us to pass json from fronend to backend

// dummy
app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from Codex',
    })
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,  // higher temperature value means the modal will take more risks 
            max_tokens: 3000, //maximum number of tokens generate in completion
            top_p: 1,
            frequency_penalty: 0.5,  //its not going to repeat the similar sentences often
            presence_penalty: 0,
        });

        // send data back to the frontend
        res.status(200).send({
            bot: response.data.choices[0].text
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
})

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));
