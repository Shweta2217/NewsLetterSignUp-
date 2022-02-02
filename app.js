const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { send } = require("process");
require ("dotenv").config();

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT||5500;

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  console.log(`${firstName},${lastName},${email}`);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData=JSON.stringify(data);
  const url=process.env.MAILCHIMP_URL;
  

  const options={
    method:"POST",
    auth:process.env.AUTH
}
 const request = https.request(url, options, function(response) {
      if(response.statusCode == "200"){
        res.sendFile(__dirname+"/success.html");
      }else{
        res.sendFile(__dirname+"/failure.html")
      }
       response.on("data",function(data) {
           console.log(JSON.parse(data));
       });
  
  })
  request.write(jsonData);
  request.end();
});

app.post("/failure",function(req,res) {
  res.redirect("/");
})
app.listen(process.env.PORT || port, function () {
  console.log(`Server is Running on Port ${port}`);
});

