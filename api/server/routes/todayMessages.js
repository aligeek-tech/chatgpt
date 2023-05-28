const express = require('express');
const router = express.Router();
const { getTodayMessage } = require('../../models/Message');
const requireJwtAuth = require('../../middleware/requireJwtAuth');

router.get('/messages', requireJwtAuth, async (req, res) => {
  res.status(200).send({ messages: await getTodayMessage(req.user) });
});

module.exports = router;
