var url = `https://api.sportsdata.io/v3/nba/stats/json/PlayerSeasonStats/2019?key=835f8a8af56d4eac98fdcd36de549b85`;
  
d3.json(url).then(function(data) {

  // Grab values from the response json object to build the plots
  var name = data.dataset.name;
  var stock = data.dataset.dataset_code;
  var startDate = data.dataset.start_date;
  var endDate = data.dataset.end_date;
  var dates = unpack(data.dataset.data, 0);
  var openingPrices = unpack(data.dataset.data, 1);
  var highPrices = unpack(data.dataset.data, 2);
  var lowPrices = unpack(data.dataset.data, 3);
  var closingPrices = unpack(data.dataset.data, 4);

  var trace1 = {
    type: "scatter",
    mode: "lines",
    name: name,
    x: dates,
    y: closingPrices,
    line: {
      color: "#17BECF"
    }
  };