const express = require('express');
const router = express.Router();
const { getLastAccountsInfo } = require('../../models/Account');
const requireJwtAuth = require('../../middleware/requireJwtAuth');
const zarinpal = require('../../lib/zarinpal');
const { addFactor, getFactor, updateFactor } = require('../../models/Factor');
const accountSchema = require('../../models/schema/accountSchema');

router.get('/me', requireJwtAuth, async (req, res) => {
  let lastUserAccount = await getLastAccountsInfo(req.user);
  if (lastUserAccount.length > 0) {
    const currentDate = new Date();
    const lastAccountDate = lastUserAccount[0].createdAt;
    const timeDifference = Math.abs(lastAccountDate.getTime() - currentDate.getTime());
    const differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

    const utcDate = lastUserAccount[0].createdAt;

    let date = new Date(utcDate);

    // date.setHours(date.getHours() - 1);

    if (lastUserAccount[0].day - differentDays <= 0) {
      res.status(200).send({ account: null });
    } else {
      res.status(200).send({
        account: {
          createdAt: lastUserAccount[0].createdAt,
          createdAtData: {
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear(),
            hour: date.getHours(),
            minute: date.getMinutes()
          },
          account: lastUserAccount[0].day,
          differentDays,
          remainedDays: lastUserAccount[0].day - differentDays
        }
      });
    }
  } else {
    res.status(200).send({ account: null });
  }
});

router.get('/buy', requireJwtAuth, async (req, res) => {
  let createdZarinpal = zarinpal.create(process.env.MERCHANT_ID);
  let amount = `${process.env.PREMIUM_ACCOUNT_AMOUNT}`; // Toman
  try {
    let payReqResponse = await createdZarinpal.PaymentRequest({
      Amount: amount, // Toman
      CallbackURL: process.env.ZARINPAL_PAYMNET_CALLBACK,
      Description: 'pay premium account',
      Email: 'aligeek@yahoo.com',
      Mobile: '09374458208'
    });
    if (
      payReqResponse &&
      payReqResponse.status === 100 &&
      payReqResponse.authority &&
      payReqResponse.authority.length > 0
    ) {
      let authority = payReqResponse.authority;
      let zUrl = payReqResponse.url;

      await addFactor(req.user, authority, 0, amount);

      res.status(200).send({ zUrl });
      // res.status(307).redirect(zUrl);
    } else {
      res.status(500).send('Oops something went wrong, try again later.');
    }
  } catch (error) {
    res.status(500).send('Oops something went wrong, try again later.');
  }
});

router.get('/callback', async (req, res) => {
  let authority = req.query.Authority;
  let status = req.query.Status;
  if (authority && status === 'OK') {
    let factor = await getFactor(authority);

    if (!factor) {
      return res.status(404).send('factor does not exits.');
    } else if (factor && factor.state === 1) {
      return res.status(409).send('factor is paid before');
    } else {
      let createdZarinpal = zarinpal.create(process.env.MERCHANT_ID);

      let payVerifyResponse = await createdZarinpal.PaymentVerification({
        Amount: factor.amount,
        Authority: authority
      });

      if (!payVerifyResponse) {
        return res.status(500).send('Oops something went wrong while verifing your request.');
      }

      if (payVerifyResponse.status !== 100) {
        return res.status(500).send('Oops something went wrong while verifing your request.');
      } else {
        console.log(payVerifyResponse);
        await updateFactor(authority, 1);
        await new accountSchema({
          username: factor.username,
          day: 30
        }).save();

        return res.status(200).send('successfully paid you can now enjoy');
      }
    }
  } else {
    res.status(500).send('Oops something went wrong, try again later.');
  }
});

module.exports = router;
