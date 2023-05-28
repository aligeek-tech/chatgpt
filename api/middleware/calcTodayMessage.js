const { Message } = require('../models/Message');

const calcTodayMessage = async (req, res, next) => {
  const user = req.user;
  const token = req.body.token;

  if (token) {
    return next();
  }

  const currentDate = new Date();
  const startOfToday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

  let todayMessagesCount = await Message.find({
    username: user.username,
    createdAt: { $gte: startOfToday }
  }).count();

  if (todayMessagesCount >= 5) {
    res.status(400).send({
      text: 'you can only ask 5 question per day on free account. please purchase a monthly account to use chatgpt with no limit.'
    });
  } else {
    next();
  }
};

module.exports = calcTodayMessage;
