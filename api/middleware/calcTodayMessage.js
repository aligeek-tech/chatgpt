const { getLastAccountsInfo } = require('../models/Account');
const { Message } = require('../models/Message');

const runFreeFlow = async (user, res, next) => {
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

const calcTodayMessage = async (req, res, next) => {
  const user = req.user;
  const token = req.body.token;

  if (token) {
    return next();
  }

  let lastUserAccount = await getLastAccountsInfo(req.user);
  if (lastUserAccount.length > 0) {
    const currentDate = new Date();
    const lastAccountDate = lastUserAccount[0].createdAt;
    const timeDifference = Math.abs(lastAccountDate.getTime() - currentDate.getTime());
    const differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24)); 

    if (lastUserAccount[0].day - differentDays <= 0) {
      await runFreeFlow(user, res, next);
    } else {
      return next();
    }
  } else {
    await runFreeFlow(user, res, next);
  }
};

module.exports = calcTodayMessage;
