const express = require("express");
const router = express.Router();
const {
    createEvent,
    getEventById,
    getEvents,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");
const { isLogin } = require("../middleware/middleware");

const { getCache, setCache, deleteCache } = require("../utils/cache");

// CREATE EVENT
router.post("/", isLogin, async (req, res) => {
    const result = await createEvent(req, res);

    // After creating a new event, clear list cache
    await deleteCache("events:list");

    return result;
});

// GET ALL EVENTS (Optional Cache)
router.get("/", async (req, res) => {
    let cached = await getCache("events:list");
    if (cached) {
        return res.json({
            success: true,
            cached: true,
            data: cached
        });
    }

    const result = await getEvents(req, res);

    // result.events exists now
    await setCache("events:list", result.events, 60);

    return res.json({
        success: true,
        cached: false,
        data: result.events
    });
}); 

// GET EVENT BY ID with caching
router.get("/:id", async (req, res) => {
    const eventId = req.params.id;

    // 1. Try cache
    let cached = await getCache(`event:${eventId}`);

    if (cached) {
        return res.json({
            success: true,
            cached: true,
            event: cached
        });
    }

    // 2. Fetch from controller
    const result = await getEventById(req, res);

    // 3. Save to cache only if event exists
    if (result?.event) {
        await setCache(`event:${eventId}`, result.event, 120);
    }

    return res.json({
        success: true,
        cached: false,
        event: result.event
    });
});


// UPDATE EVENT (clear cache)
router.put("/:id", isLogin, async (req, res) => {
    const eventId = req.params.id;

    const result = await updateEvent(req, res);

    // Invalidate event cache
    await deleteCache(`event:${eventId}`);
    await deleteCache("events:list");

    return result;
});

// DELETE EVENT (clear cache)
router.delete("/:id", isLogin, async (req, res) => {
    const eventId = req.params.id;

    const result = await deleteEvent(req, res);

    await deleteCache(`event:${eventId}`);
    await deleteCache("events:list");

    return result;
});

module.exports = router;
