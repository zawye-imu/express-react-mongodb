var express = require('express');
var router = express.Router();


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
