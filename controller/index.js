const { handleMessage } = require("./lib/Telegram");

async function handler(req, method) {
    try {
        const { body } = req;
        if (body) {
            const messageObj = body;
            await handleMessage(messageObj);
        }
    } catch (error) {
        console.error("Error in handler:", error);
        // Optionally, you can return an error response
        return { statusCode: 500, body: "Internal Server Error" };
    }
    return;
}

module.exports = { handler };