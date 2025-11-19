const { Queue } = require("bullmq");

const messageQueue = new Queue("messageQueue", {
    connection: {
        host: "127.0.0.1",
        port: 6379
    }
});

module.exports = messageQueue;
