"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const node_1 = require("./defaults/node");
const react_1 = require("./defaults/react");
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const prompts_1 = require("./prompts");
const anthropic = new sdk_1.default();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/template', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = req.body.prompt;
    const response = yield anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 200,
        temperature: 0,
        system: "Return either node or react based on what do you think this project should be.Only return a single word either 'node' or 'react'.Do not return anything extra",
        messages: [{
                role: 'user',
                content: prompt
            }]
    });
    const answer = response.content[0].text;
    if (answer === "react") {
        res.json({
            prompts: [prompts_1.BASE_PROMPT, react_1.basePrompt]
        });
    }
    if (answer === "node") {
        res.json({
            prompts: [node_1.basePrompt]
        });
    }
    res.status(403).json({
        message: "ypu cant access"
    });
    return;
}));
// async function main(){
//    anthropic.messages.stream({
//         model : "claude-3-5-sonnet-20241022",
//         max_tokens : 1000,
//         temperature : 0,
//         system : getSystemPrompt(),
//         messages : [{
//             role : 'user' ,
//             content : ""
//         },{
//             role : 'user',
//             content : "Here is an artifact that contains all files of project visible to you.\nConsider the contents of ALL files in the project.\n\n{{BASE_PROMPT}} \n\nHere is a list of files that exist on the file system but are not shown to you:\n\n - .gitignore\n -package-lock.json\n - .bolt/prompt"
//         },{
//             role : 'user',
//             content : "what is capital of india"
//         }]
//     }).on('text',(text)=>{
//         console.log(text);
//     });
// }
// main();
app.listen(3000);
