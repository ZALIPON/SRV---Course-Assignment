var express = require('express');
var router = express.Router();
const authenticateBasic = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/authMiddlewares');
var db = require('../models');
var ParticipantsService = require('../services/ParticipantsService');
var participantsService = new ParticipantsService(db);
const HomesService = require('../services/HomeService');
const homesService = new HomesService(db);
const WorksService = require('../services/WorksService');
const worksService = new WorksService(db);
const sequelize = db.sequelize;
const { handleValidationErrors, participantRules, isEmail } = require('../middlewares/participantValidator');



router.get('/', authenticateBasic, isAdmin, async function(req, res, next) { //✅
  const allParticipants = await participantsService.findAll()
  const allHomes = await homesService.findAll()
  const allWorks = await worksService.findAll()

  const workByEmail  = new Map(allWorks.map(w  => [w.ParticipantEmail, w]));
  const homeByEmail  = new Map(allHomes.map(h  => [h.ParticipantEmail, h]));

  const result = allParticipants.map(p => ({
    participant: {
      email:      p.email,
      firstname:  p.firstname,
      lastname:   p.lastname,
      dob:        p.dob
    },
    work: workByEmail.get(p.email) || null,
    home: homeByEmail.get(p.email) || null
  }));
  
  return res.status(200).json({ statusCode: 200, result: result});
});

router.post('/add', authenticateBasic, isAdmin, participantRules, handleValidationErrors, async function (req, res, next) { //✅
  const {
    participant: { email, firstname, lastname, dob },
    work:        { companyname, salary, currency },
    home:        { country, city }
  } = req.body;

  try{
    const exists = await participantsService.findOne(email);
      if(!exists){
        await sequelize.transaction(async t => {
          await participantsService.create(email, firstname, lastname, dob, t );
          await homesService.create(country, city, email, t);
          await worksService.create(companyname, salary, currency, email, t );
        })
        return res.status(201).json({ statusCode: 201, result: 'Great success. Participant created'});
      }
      return res.status(409).json({ statusCode: 409, result: 'Participant already exists.'});
  }
  catch(err){
    next(err)
  }
})

router.get('/details', authenticateBasic, isAdmin, async function (req, res, next){       //✅
  try{
    const details = await participantsService.details();
    return res.status(200).json({ statusCode: 200, result: details});
  }catch(err){
    return res.status(400).json({ statusCode: 400, result: 'Unexpected error.'});
  }
})

router.get('/details/:email', authenticateBasic, isAdmin, isEmail, handleValidationErrors, async (req, res, next) => {     //✅
  try {
    const email = req.params.email;
    const detail = await participantsService.emailDetails(email);

    if (!detail) {
      return res.status(404).json({ statusCode: 404, error: 'Participant not found' });
    }

    return res.status(200).json({ statusCode: 200, result: detail });
  } catch (err) {
    next(err);
  }
});

router.get('/work/:email', authenticateBasic, isAdmin, isEmail, handleValidationErrors, async (req, res, next) => {      //✅
  try{
    const email = req.params.email;
    const workDetails = await worksService.workDetails(email);
    if (!workDetails) {
      return res.status(404).json({ statusCode: 404, error: 'Work not found' });
    }
    return res.status(200).json({ statusCode: 200, result: workDetails });
  }catch(err){
    next(err);
  }
})

router.get('/home/:email', authenticateBasic, isAdmin, isEmail, handleValidationErrors, async (req, res, next) => {      //✅
  try{
    const email = req.params.email;
    const homeDetails = await homesService.homeDetails(email);
    if (!homeDetails) {
      return res.status(404).json({ statusCode: 404, error: 'Home not found' });
    }
    return res.status(200).json({ statusCode: 200, result: homeDetails });
  }catch(err){
    next(err);
  }
})

router.delete('/:email', authenticateBasic, isAdmin, isEmail, handleValidationErrors, async (req, res, next) => {      //✅
  try{
    const email = req.params.email;
    const participant = await participantsService.delete(email);
    if (!participant){
      return res.status(404).json({ statusCode: 404, error: 'Participant was not found' });
    }
    return res.status(200).json({ statusCode: 200, result: 'Deleted successful' });
  }catch(err){
    next(err);
  }
})

router.put('/:email', authenticateBasic, isAdmin, isEmail, participantRules, handleValidationErrors, async function (req, res, next) {   
  const sEmail = req.params.email;
    const {
      participant: { email, firstname, lastname, dob },
      work:        { companyname, salary, currency },
      home:        { country, city }
    } = req.body;

  try{
    const exists = await participantsService.findOne(sEmail);
    if (email !== sEmail) {                                                 //if email taken
      const occupied = await participantsService.findOne(email);
      if (occupied) {
        return res.status(409).json({ statusCode: 409, error: 'E-mail already taken' });
      }
    }
    if (!exists) {
      return res.status(404).json({ statusCode: 404, result: 'Participant not found.' });
    }
    
    await sequelize.transaction(async t => {
      await participantsService.update( sEmail, {email, firstname, lastname, dob}, t );
      await homesService.update( sEmail, country, city, email, t );
      await worksService.update( sEmail, companyname, salary, currency, email, t );
    })

    return res.status(200).json({ statusCode: 200, result: 'Great success. Participants details updated' });
  }
  catch(err){
    next(err)
  }
})


module.exports = router;
