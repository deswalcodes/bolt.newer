require("dotenv").config();
import express from 'express';
import {basePrompt as nodeBasePrompt} from './defaults/node'
import {basePrompt as reactBasePrompt} from './defaults/react'

import Anthropic from '@anthropic-ai/sdk'
import { BASE_PROMPT, getSystemPrompt } from './prompts';
import { TextBlock } from '@anthropic-ai/sdk/resources/messages';

const anthropic = new Anthropic();
const app = express();
app.use(express.json());

app.post('/template',async (req,res)=>{
    const prompt = req.body.prompt;
    const response = await anthropic.messages.create({
        model : "claude-3-5-sonnet-20241022",
        max_tokens : 1000,
        temperature : 0,
        system : "Return either node or react based on what do you think this project should be.Only return a single word either 'node' or 'react'.Do not return anything extra",
        messages : [{
            role : 'user',
            content : prompt
        }]
    });
    const answer = (response.content[0] as TextBlock).text;
    if(answer != "react" && answer != "node"){
        res.status(403).json({
            message : "You cant access this"
        })
        return
    }
    if(answer === "react"){
        res.json({
            prompts : [BASE_PROMPT,reactBasePrompt]
        })
    }
    if(answer === "node"){
        res.json({
            prompts : [nodeBasePrompt]
        })
    }



})








async function main(){
   anthropic.messages.stream({
        model : "claude-3-5-sonnet-20241022",
        max_tokens : 1000,
        temperature : 0,
        system : getSystemPrompt(),
        messages : [{
            role : 'user' ,
            content : ""
        },{
            role : 'user',
            content : "Here is an artifact that contains all files of project visible to you.\nConsider the contents of ALL files in the project.\n\n{{BASE_PROMPT}} \n\nHere is a list of files that exist on the file system but are not shown to you:\n\n - .gitignore\n -package-lock.json\n - .bolt/prompt"
        },{
            role : 'user',
            content : "what is capital of india"
        }]
    }).on('text',(text)=>{
        console.log(text);
    });
    
}

main();
