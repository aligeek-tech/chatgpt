const Account = require('./schema/accountSchema');

module.exports = {
  Account,

  async getLastAccountsInfo (user) {
    try {
      let accounts = await Account.find({
        username: user.username
      })
        .sort({ createdAt: "desc" })
        .limit(1);
      return accounts;
    } catch (err) {
      console.error(`Error getting accounts: ${err}`);
      throw new Error('Failed to get accounts.');
    }
  }
};
