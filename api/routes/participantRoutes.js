const express = require("express");
const router = express.Router();

const {
    createParticipant,
    getParticipantById,
    getParticipants,
    updateParticipant,
    deleteParticipant
} = require("../controllers/participantController");

const { isLogin } = require("../middleware/middleware");

// Redis cache functions
const { getCache, setCache, deleteCache } = require("../utils/cache");


//get all participant
router.get("/", async (req, res) => {
    const cacheKey = "participants:list";

    // 1. Check cache
    const cached = await getCache(cacheKey);
    if (cached) {
        return res.json({
            success: true,
            cached: true,
            data: cached
        });
    }

    // 2. Fetch from controller
    const result = await getParticipants(req, res);

    // 3. Save to cache
    if (result?.data) {
        await setCache(cacheKey, result.data, 120); // 2 min
    }

     return res.json({
        success: true,
        cached: false,
        data: result.data
    });
});


//get participant by id
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const cacheKey = `participant:${id}`;

    const cached = await getCache(cacheKey);
    if (cached) {
        return res.json({
            success: true,
            cached: true,
            data: cached
        });
    }

    const result = await getParticipantById(req, res);

    if (result?.data) {
        await setCache(cacheKey, result.data, 120);
    }

      return res.json({
        success: true,
        cached: false,
        data: result.data
    });
});


// create participant
router.post("/", isLogin, async (req, res) => {
    const result = await createParticipant(req, res);

    // List changes → delete list cache
    await deleteCache("participants:list");

    return result;
});


// update participant
router.put("/:id", isLogin, async (req, res) => {
    const id = req.params.id;
    const result = await updateParticipant(req, res);

    if (result?.data) {
        await deleteCache(`participant:${id}`);
        await deleteCache("participants:list");
    }

    return result;
});


// delete participant
router.delete("/:id", isLogin, async (req, res) => {
    const id = req.params.id;
    const result = await deleteParticipant(req, res);

    if (result?.success) {
        await deleteCache(`participant:${id}`);
        await deleteCache("participants:list");
    }

    return result;
});


module.exports = router;
