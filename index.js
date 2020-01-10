var express = require("express"),
  request = require("request"),
  bodyParser = require("body-parser"),
  app = express();

var myLimit = typeof process.argv[2] != "undefined" ? process.argv[2] : "100kb";
console.log("Using limit: ", myLimit);

app.use(bodyParser.json({ limit: myLimit }));

app.get("/", function(req, res) {
  // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header(
    "Access-Control-Allow-Headers",
    req.header("access-control-request-headers")
  );

  if (req.method === "OPTIONS") {
    res.send();
  } else {
    request(
      {
        url: "https://gtfsrt.api.translink.com.au/Feed/SEQ",
        method: "GET",
        encoding: null
      },
      function(error, response) {
        if (error) {
          console.error("error: " + response.statusCode);
        }
      }
    ).pipe(res);
  }
});

app.set("port", process.env.PORT || 3001);

app.listen(app.get("port"), function() {
  console.log("TransLink API listening on port " + app.get("port"));
});
