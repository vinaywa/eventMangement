const { Worker } = require("bullmq");

const messageWorker = new Worker(
    "messageQueue",
    async (job) => {
        console.log("Processing message job:", job.data);

        // Example slow task — saving to logs
        await new Promise(r => setTimeout(r, 1000));

        console.log("Job completed!");
    },
    {
        connection: {
            host: "127.0.0.1",
            port: 6379
        }
    }
);

messageWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

messageWorker.on("failed", (job, err) => {
    console.log(`Job ${job.id} failed:`, err);
});
