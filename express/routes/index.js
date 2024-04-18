var express = require('express');
var router = express.Router();
const Users = require('../models/user')

function createDateFromYearMonth(yearMonthString) {
  // Split the string into year and month parts
  var parts = yearMonthString.split('/');

  // Extract year and month from parts
  var year = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10) - 1; // Subtract 1 because months are zero-based in JavaScript

  // Create a new Date object with the specified year and month
  return new Date(year, month);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/users', async function(req, res, next) {
  try{
    const users = await Users.find();
    res.json(users)
  }catch(err){
    res.status().json({'error':'something went wrong'})
  }
  
});


router.post('/user-add', async function(req, res, next) {
    const newUser = new Users({...req.body})
    newUser.save()
    .then(user => (res.json({'success':user})))
    .catch(err => (res.json({"error":err})))
});

router.get('/user-add-dummy', async function(req, res, next) {
  const newUser = new Users({
    name: "dummy",
    ordering: 0,
    active: true,
    fullname: "dummy name",
    company: "DD com.Ltd",
    memberID: "M0001",
    formerID: "F0001",
    mailAddress: "dd@gmail.com",
    startYM: new Date(),
    endYM: new Date()
  })

  newUser.save().then(
    res.json({
      "message":"new Dummy user added."
    })
  ).catch(err => res.json({
    "error":err
  }))
  
});


router.put('/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findByIdAndUpdate(id, { ...req.body }, { new: true });
    res.json(user);
  } catch (error) {
    console.log(error)
    res.status(500).send({"error":error});
  }
});


router.get('/test-data', function(req, res, next) {
  let sampleData = [
    {
      id:1,
      ordering: 0,  
      active: true,
      name: "John",
      fullname: "JohnDoe",
      company: '261 Erdman Ford',
      memberID: '111',
      formerID: '10001',
      mailAddress: 'JD@erd.co',
      startYM: createDateFromYearMonth('2024/04'),
      endYM: '2024/12'
    },
    {
      id:2,
      ordering: 1, 
      active: true,
      name: "Jane",
      fullname: "Jane Doe",
      company: '261 Erdman Ford',
      memberID: '112',
      formerID: '10002',
      mailAddress: 'Jane@erd.co',
      startYM: createDateFromYearMonth('2024/04'),
      endYM: '2024/12'
    },
    {
      id:3,
      ordering: 2, 
      active: true,
      name: "Aung",
      fullname: "Than Aung",
      company: 'Freedom Exp.',
      memberID: '113',
      formerID: 'HJ009',
      mailAddress: 'ta2020@free.net',
      startYM: createDateFromYearMonth('2024/04'),
      endYM: '2025/12'
    },
    {
      id:4,
      ordering: 3, 
      active: true,
      name: "Satou",
      fullname: "Satou",
      company: 'Gfords',
      memberID: '114',
      formerID: 'HHH20',
      mailAddress: 'sky@hotmail.com',
      startYM: createDateFromYearMonth('2024/04'),
      endYM: '2025/12'
    }
  ];
  res.json(sampleData)
});

module.exports = router;
