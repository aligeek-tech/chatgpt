const Factor = require('./schema/factorSchema');

module.exports = {
  Factor,

  async addFactor (user, authority, state, amount) {
    try {
      const newFactor = await new Factor({
        username: user.username,
        authority,
        state,
        amount
      }).save();

      return newFactor;
    } catch (err) {
      console.error(`Error insert factor: ${err}`);
      throw new Error('Failed to insert factor.');
    }
  },
  async getFactor (authority) {
    try {
      let factor = await Factor.findOne({
        authority
      });

      return factor;
    } catch (err) {
      console.error(`Error getting factor: ${err}`);
      throw new Error('Failed to get factor.');
    }
  },
  async updateFactor (authority, state) {
    try {
      let oldFactor = await Factor.findOne({
        authority
      });

      let factor = await Factor.findOneAndUpdate(
        { authority },
        {
          username: oldFactor.username,
          authority,
          state
        },
        { upsert: true, new: true }
      );

      return factor;
    } catch (err) {
      console.error(`Error updating factor: ${err}`);
      throw new Error('Failed to update factor.');
    }
  }
};
