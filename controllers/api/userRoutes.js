const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
  try {

    console.log("gotuserpostrequest")
    

    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  console.log("gotuserloginrequest")
  console.log("req.body= ",req.body);
  console.log("username= ",req.body.username);
  try {
    const userData = await User.findOne({ where: { username: req.body.user } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    console.log("founduser = ", userData)

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      // res.json({ user: userData, message: 'You are now logged in!' });

      res.render({"profile",{layout:}})
    });

    res.render('profile', {
      ...user,
      logged_in: true
    });


  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {


  console.log("gotuserpostlogout")
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
