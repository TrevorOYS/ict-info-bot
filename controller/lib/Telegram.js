const axiosInstance = require("./axios");
const fs = require("fs");
const path = require("path");

// Load command responses from JSON file
const commandsFilePath = path.join(__dirname, "../../data/commands.json");
const commandResponses = JSON.parse(fs.readFileSync(commandsFilePath, "utf8"));

function sendMessage(messageObj, messageText, replyMarkup = null) {
    const params = {
        chat_id: messageObj.chat.id,
        text: messageText,
        parse_mode: "HTML",
    };

    if (replyMarkup) {
        params.reply_markup = JSON.stringify(replyMarkup);
    }
    console.log(`Sending message to chat_id ${messageObj.chat.id}: ${messageText}`);
    return axiosInstance.get("sendMessage", { params
        }).catch(error => {
        console.error("Error sending message:", error.response ? error.response.data : error.message);
    });
}
function handleCommand(messageObj, command) {
    if (command === "start") {
        const messageText = "Welcome! Please choose a command:";
        const replyMarkup = {
            inline_keyboard: [
                [{ text: "Commands", callback_data: "start" }],
                [{ text: "General Info", callback_data: "generalinfo" }],
                [{ text: "3DSB Info", callback_data: "3dsbinfo" }],
                [{ text: "OneNS", callback_data: "onens" }],
                [{ text: "Feedback", callback_data: "feedback" }],
                [{ text: "Others", callback_data: "others" }]
            ]
        };
        return sendMessage(messageObj, messageText, replyMarkup);
    }
    const commandResponse = commandResponses[command];
    console.log(`Command: ${command}, Response: ${commandResponse}`);
    if (commandResponse) {
        let messageText = "";
        
        if (typeof commandResponse === "object") {
            messageText = `<b>${command}</b>\n`;
            for (const [key, value] of Object.entries(commandResponse)) {
                messageText += `${key}: ${value}\n`;
            }
        } else {
            messageText = commandResponse;
        }
        return sendMessage(messageObj, messageText);
    } else {
        return sendMessage(messageObj, "Command not found");
    }
}

function handleCallbackQuery(callbackQuery) {
    console.log("Handling callback query:", callbackQuery);
    const messageObj = callbackQuery.message;
    const command = callbackQuery.data;
    return handleCommand(messageObj, command);
}

function handleMessage(update) {
    //console.log("Handling message update:", JSON.stringify(update, null, 2));
    if (update.callback_query) {
        console.log("Received callback query");
        return handleCallbackQuery(update.callback_query);
    } else if (update.message) {
        const messageObj = update.message;
        const messageText = messageObj.text || "";
        const chatId = messageObj.chat.id;
        console.log(`Received message: ${messageText}`);

        if (messageText.charAt(0) === "/") {
            const command = messageText.substr(1);
            return handleCommand(messageObj, command);
        } else {
            return sendMessage(messageObj, "Command not recognised. Please use /start to see available commands.");
        }
    } 
}

module.exports = { handleMessage };