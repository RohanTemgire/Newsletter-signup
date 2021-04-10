const express = require('express');
const body_parser = require('body-parser');
const https = require('https');
// const request = require('request');
// const client = require('mailchimp-marketing');

const app = express();

//to use the css and images from the files itself you have to use an express module to do that
app.use(express.static("public")); //inside this parenthesis you have declare the folder name so that it can access the
//file from there
//once this is declared you can use css and other files which are not remotely placed

app.use(body_parser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

//
// client.setConfig({
//   apiKey: "2f8655ceddd627796220e24f8264452f-us1",
//   server: "us1",
// });

app.post("/",function(req,res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
        {
          email_address:email,
          status:"subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          }
        }
      ]
  }

  const jsonData = JSON.stringify(data);

//   const run = async () => {
//   const response = await client.lists.batchListMembers("83574ef5fd", {
//     members: [
//       {
//         email_address:email,
//         status:"subscribed",
//         merge_fields: {
//           FNAME: firstName,
//           LNAME: lastName
//         }
//       }
//     ],
//   });
//   res.send(response);
// };
//
// run();


  const url="https://us1.api.mailchimp.com/3.0/lists/83574ef5fd";
  const options={
    method:"POST",
    auth:"rohan:2f8655ceddd627796220e24f8264452f-us1"
  }

  const request = https.request(url,options,function(response){
    response.on("data",function(data){
      // console.log(JSON.parse(data));
      if(response.statusCode === 200){
          res.sendFile(__dirname+"/success.html");
      }
      else{
        res.sendFile(__dirname+"/failure.html")
      }


    })
  })
  request.write(jsonData);
  request.end();
});

app.post("/failure",function(req,res){

  res.redirect("/");

});

app.listen(process.env.PORT || 3000,function(){
  console.log("server has started in port 3000");
});


//api key for mailchimp---> 2f8655ceddd627796220e24f8264452f-us1

//list_id---> 83574ef5fd
