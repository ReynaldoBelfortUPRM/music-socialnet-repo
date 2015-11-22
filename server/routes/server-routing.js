/* Server Router
  Every http requiest comming from the views are captured here.
*/

//Loading required packages:
var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var jwt = require('jsonwebtoken');
//For JWT implementation
var config = require('../../config');

var connectionString={
  user: "nhtxclclofbeab",
  password: "K9eQnPqG_yWOgquFHw9PkfhmhX",
  database: "d1jo4i2pnj1en2",
  port: 5432,
  host: "ec2-54-163-228-188.compute-1.amazonaws.com",
  ssl: true
};

//Database initialization
var id =[];
initialize_id();
function initialize_id() {
  pg.connect(connectionString, function (err, client, done) {
    // Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }


    // SQL Query > Select Data
    var query = client.query("SELECT MAX(user_id) FROM uuser");

    // Stream results back one row at a time
    query.on('row', function (row) {
      id.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function () {
      done();

      console.log(id[0].max);//OMG este es el q es
      id = id[0].max+1;
    });


  });
}

//Sending the MusicVenue welcome page to the client
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', '../', 'client', 'public', 'views', 'index.html'));
});


//--------------TODO Area where the database queries will be handled---------------------
//--------------TODO Check section for info on router methods: Response methods    http://expressjs.com/guide/routing.html 

//------------------------ START REGISTER page------------------------------------------

 router.post('/mvenue-database/register/', function(req, res) {

     var results = [];

     // Grab data from http request
     //var data = {text: req.body.text, complete: false};
      var user = {first_name: req.body.first_name, last_name:req.body.last_name, email:req.body.email, password:req.body.password, photo_path:"photo", about:"about..." };

     // Get a Postgres client from the connection pool
     pg.connect(connectionString, function(err, client, done) {
         // Handle connection errors
         if(err) {
           done();
           console.log(err);
             console.log(':(');
           return res.status(500).json({ success: false, data: err});
         }


        // client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);
        client.query("INSERT INTO uuser(user_id, first_name, last_name,email, password, photo_path, about) values($1, $2,$3, $4,$5, $6,$7)", [id, user.first_name, user.last_name, user.email, user.password, user.photo_path, user.about]);


         //TODO Aquí se debería enviar de vuelta al usuario sobre si pasó el registro o no:
            //Si email existe, etc.



         var doneuser=false;
         var donepost=false;

         var queryuser = client.query("SELECT * FROM uuser ORDER BY user_id ASC");


         // Stream results back one row at a time
         queryuser.on('row', function(row) {
             results.push(row);
         });

         // After all data is returned, close connection and return results
         queryuser.on('end', function() {
             done();
             //return res.json(results);
         });



         if(doneuser&&donepost){

           }

       });
 });
//------------------------ END REGISTER page--------------------------------------------

//------------------------ START LOGIN page------------------------------------------

router.post('/mvenue-database/login/', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: Login server entry.");

    var results = [];

    // Grab data from http request
    var logintry = {email: req.body.email, password: req.body.password };

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({ success: false, data: err});
        }

        //TODO Aquí se debería enviar de vuelta al usuario sobre si pasó el registro o no:
        //Si email existe, etc.
        //TODO Password must be encrypted here!

        //TODO Both the email and password must be matched on the query in order to validate the log-in.
        //TODO Be aware of query security
        var query = client.query("SELECT * FROM uuser WHERE email = $1 and password = $2 ", [logintry.email, logintry.password]);

        //----------TODO Query event handlers---------------

        //Capture any database error
        query.on('error', function(error){
          //TODO DEBUG
          console.log("DEBUG: Query error!");
          //Return an server error status code:
          return res.status(500).json({ success: false, data: err});
        });

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        //TODO Account Block State (ABS) will be implemented here

         // After all data is returned, close connection
        query.on('end', function() {
            done();
            
            //User account validation
            if(results.length > 0)
            {
              //TODO DEBUG
              console.log("DEBUG: Query done. Data from query: " + JSON.stringify(results) + " Result obj length: " + results.length.toString()); 

              //Meaning that the account exists and password matched with database.
              try{
                  //Create token for user:
                  var newToken = jwt.sign({user_id: results[0].user_id, business_id: null, isBusinessMode: false}, config.secret, {
                    expiresIn: 3600 //token expires in 1hr
                  });

              //Creating clientAuthentication object:
              var clientAu = {token: newToken, userName: results[0].first_name + " " + results[0].last_name};

              //Return a succesful status response (success code) alogn with token:
              return res.status(200).json(clientAu);
              }catch(err){
                //TODO DEBUG
                console.log("DEBUG: ERROR: " + err.toString());
                //Return a failure status response (failure code):
                return res.status(500).json({success: false, data: err});
              }
              
            }
            else
            {
              //Meaning that there is an error in the email or password
              //Return a failure status response (failure code):
              return res.status(400).json({success: false, data: ''});
            }           
        });

    });
});
//------------------------ END LOGIN page--------------------------------------------



//------------------------ START HOMEPAGE------------------------------------------
router.post('/mvenue-database/homepage-post/:token', function(req, res) {
    console.log("DEBUG: Homepage POST------.");
    var uPayload;
    var results = [];

    //Token validation
    try{
        //Get payload data from the client that is logged in
        uPayload = verifyToken(req.params.token);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

    //var post_input=null;
    var  post_input={
        data: req.body.data,
        media_path: req.body.media_path,
        media_type:req.body.media_type
    };



    // Get a Postgres client from the connection pool
    console.log("DEBUG: DB CONNECT");
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        if (uPayload.isBusinessMode){
            //This is a BUSINESS POST
            // SQL Query > Insert Data
            client.query("INSERT INTO post_business( business_id, data, media_path, media_type, date_time)" +
                "VALUES ( $1 , $2, $3, $4, CURRENT_TIMESTAMP)"
                , [uPayload.business_id, post_input.data, post_input.media_path,post_input.media_type ]);
            // SQL Query > Select Data
            var query = client.query("SELECT * FROM post_business");

            // Stream results back one row at a time
            query.on('row', function (row) {
                results.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function () {
                done();
                return res.json(results);

            });
        }
        else{
            //THIS IS A USER POST



            // SQL Query > Insert Data
            client.query("INSERT INTO post_user( user_id, data, media_path, media_type, date_time)" +
                "VALUES ( $1 , $2, $3, $4, CURRENT_TIMESTAMP)"
                , [uPayload.user_id, post_input.data, post_input.media_path,post_input.media_type ]);
            // SQL Query > Select Data
            var query = client.query("SELECT * FROM post_user");

            // Stream results back one row at a time
            query.on('row', function (row) {
                results.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function () {
                done();




                return res.json(results);

            });


        }
    });


});


router.get('/mvenue-database/homepage/:token', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: Homepage server entry.");
    var uPayload={
        user_id:1,
        business_id:3,
        isBusinessMode: false
    };
    var posts = [];

    ////Token validation
    //try{
    //   request by returning a failure response.
    //}

    // Get a Postgres client from the connection pool  //Get info from the user that is logged in
    //    uPayload = verifyToken(req.params.token);
    //}catch(err){
    //    return res.status(401).json(err); //End

    if (uPayload.isBusinessMode){
        console.log("DEBUG: DB BEFORE");
        pg.connect(connectionString, function (err, client, done) {
            // Handle connection errors
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }

            var squery="";
            squery += "(SELECT post_id, user_id as id, data, media_path, media_type, date_time,  \"isBusinessPost\", first_name as name ";
            squery += "FROM post_user NATURAL JOIN uuser NATURAL FULL JOIN(SELECT post_id, count(liked_by_id) as likes";
            squery += "							FROM post_user_like";
            squery += "							GROUP BY post_id) as postoffollowedusers) ";
            squery += "UNION";
            squery += "(SELECT post_id, business_id as id, data, media_path, media_type, date_time, \"isBusinessPost\", name";
            squery += "FROM post_business NATURAL JOIN businesspage ) ;";

            // SQL Query > Select Data
            var query = client.query(squery);


            // Stream results back one row at a time
            query.on('row', function (row) {
                posts.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function () {
                done();

                console.log("DEBUG: DB ONEND");

                return res.json(posts);
            });


        });

        console.log("DEBUG: DB CONNECT");

    }
    else{
        //IN USER MODE
        console.log("DEBUG: DB CONNECT");
        pg.connect(connectionString, function (err, client, done) {
            // Handle connection errors
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }

            var squery="";
            squery += "(WITH followintposts AS";
            squery += "(SELECT * ";
            squery += "FROM post_user";
            squery += "WHERE user_id IN (SELECT followed_id";
            squery += "FROM follow";
            squery += "WHERE follower_id=$1) )";
            squery += "SELECT post_id, user_id as id, data, media_path, media_type, date_time,  \"isBusinessPost\", first_name as name ";
            squery += "FROM followintposts NATURAL JOIN uuser NATURAL FULL JOIN(SELECT post_id, count(liked_by_id) as likes";
            squery += "FROM post_user_like GROUP BY post_id) as postoffollowedusers) ";
            squery += "UNION";
            squery += "(SELECT post_id, business_id as id, data, media_path, media_type, date_time,  \"isBusinessPost\", name";
            squery += "FROM (SELECT post_id, business_id, data, media_path, media_type, date_time, \"isBusinessPost\", name FROM post_business NATURAL JOIN businesspage  ) as bpostwithnames";
            squery += "WHERE business_id IN (";
            squery += "SELECT business_id";
            squery += "FROM follow_business";
            squery += "WHERE user_id = $2))";

            // SQL Query > Select Data
            var query = client.query(squery, [uPayload.user_id, uPayload.user_id]);

            // Stream results back one row at a time
            query.on('row', function (row) {
                posts.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function () {
                done();
                return res.json(posts);
            });


        });


    }
});


router.get('/mvenue-database/homepage/:token', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: Homepage server entry.");
    var userData;
    var results = [];

    //Token validation
    try{
      //Get info from the user that is logged in
      userData = verifyToken(req.params.token);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }


  return res.send({"posts": [{
      "post_id": "2",
        "post_user": "Pepe Olivera",
        "post_data": {"post_user": "Ramon Martinez", 
              "description": "Esto es un post para que se vea como tilizo los instrumentos que tengo!", 
              "media": ["","",""], 
              "likes": {}},
        "data_time": {}, 
        "post_type": 1,
    },
    {
      "post_id": "2",
        "post_user": "Pepe Olivera",
        "post_data": {"post_user": "Ramon Martinez", 
              "description": "Esto es un post para que se vea como tilizo los instrumentos que tengo!", 
              "media": ["","",""], 
              "likes": {}},
        "data_time": {}, 
        "post_type": 3,
    },
    {
      "post_id": "2",
        "post_user": "Pepe Olivera",
        "post_data": {"post_user": "Ramon Martinez", 
              "description": "Esto es un post para que se vea como tilizo los instrumentos que tengo!", 
              "media": ["","",""], 
              "likes": {}},
        "data_time": {}, 
        "post_type": 0,
    },
    {
      "post_id": "2",
        "post_user": "Pepe Olivera",
        "post_data": {"post_user": "Ramon Martinez", 
              "description": "Esto es un post para que se vea como tilizo los instrumentos que tengo!", 
              "media": ["","",""], 
              "likes": {}},
        "data_time": {}, 
        "post_type": 1,
    },
    {
      "post_id": "2",
        "post_user": "Pepe Olivera",
        "post_data": {"post_user": "Ramon Martinez", 
              "description": "Esto es un post para que se vea como tilizo los instrumentos que tengo!", 
              "media": ["","",""], 
              "likes": {}},
        "data_time": {}, 
        "post_type": 3,
    },
    {
      "post_id": "2",
        "post_user": "Pepe Olivera",
        "post_data": {"post_user": "Ramon Martinez", 
              "description": "Esto es un post para que se vea como tilizo los instrumentos que tengo!", 
              "media": ["","",""], 
              "likes": {}},
        "data_time": {}, 
        "post_type": 2,
    }
    ]});


});
//------------------------ END HOMEPAGE--------------------------------------------|


//------------------------START TRADESPACE------------------------------------------

router.get('/mvenue-database/tradespace/:token', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: Tradespace server entry.");
    var userData;
    var results = [];

    //Token validation
    try{
      //Get info from the user that is logged in
      userData = verifyToken(req.params.token);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }


    //----------TODO Database query code HERE

    //----------TODO Code just for testing. DELETE THIS CODE LINE
    //----------TODO Returning JSON code
    return res.send({"announcements":[
                      {
                        "trade_id": 1,
                        "user_id": 1,
                        "title": "DATA FROM EXPRESS.JS SERVER!!!! YEAHHHH!!!!",
                        "trade_description": "Vendo guitarra. El que quiera comprar me avise! Tengo mas guitarras aqui por si quieres negociar. Llama al numero!",
                        "phone": 3333333330,
                        "price": 255,
                        "seller_name": "Juan Rivera",
                        "tags": ["guitar", "course", "lessons"],
                        "email": "jrivera@example.com",
                        "images": 0
                      },
                      {
                        "trade_id": 2,
                        "user_id": 2,
                        "title": "Piano strings for sale!",
                        "trade_description": "These are new, thus no one have ever used it! Please buy, please!! Dale dale!",
                        "phone": 5904954950,
                        "price": 40.5,
                        "seller_name": "Pepe Oliver",
                        "tags": ["ukulele"],
                        "email": "poliver@example.com",
                        "images": 0
                      },
                      {
                        "trade_id": 29,
                        "user_id": 29,
                        "title": "Thursday night performance band",
                        "trade_description": "Sed non felis ac enim cursus venenatis.",
                        "phone": 3728495867,
                        "price": 6,
                        "seller_name": "Marc Daum",
                        "tags": ["guitar", "course", "lessons"],
                        "email": "criscillis@hotmail.com",
                        "images": 0
                      },
                      {
                        "trade_id": 30,
                        "user_id": 30,
                        "title": "Looking for guitar players for band",
                        "trade_description": "Nunc feugiat nisi quis velit tristique, sit amet dictum libero vehicula.",
                        "phone": 3859486758,
                        "price": 700.9,
                        "seller_name": "Fleta Pavlak",
                        "tags": ["ukulele"],
                        "email": "cotnoir@hotmail.com",
                        "images": 0
                      }
                    ]});
});

//------------------------ END TRADESPACE------------------------------------------

//------------------------ START SETTINGS page------------------------------------------

router.get('/mvenue-database/changeUserMode/:token', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: Change User Mode Request entry.");    
    var uPayload;
    var results = [];

    //Token validation
    try{
      //Get payload data from the client that is logged in
      uPayload = verifyToken(req.params.token);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

    if(req.body.isBusiness){
        //----Change to a business mode----

        //Generate new token based on request date from client
        try{
          var newToken = jwt.sign({user_id: uPayload.user_id, business_id: req.body.targetID, isBusinessMode: true}, config.secret, {
            expiresIn: 3600 //token expires in 1hr
          });

          //Creating clientAuthentication object:
          var clientAu = {token: newToken, userName: req.body.userName};

          //Return a succesful status response (success code) alogn with token:
          return res.status(200).json(clientAu);

        }catch(err){
          //TODO DEBUG
          console.log("DEBUG: ERROR: " + err.toString());
          //Return a failure status response (failure code):
          return res.status(500).json({success: false, data: err});
        }

    }else{
      //----Change to regular user mode----

      //Generate new token based on request date from client
        try{
          var newToken = jwt.sign({user_id: uPayload.user_id, business_id: null, isBusinessMode: false}, config.secret, {
            expiresIn: 3600 //token expires in 1hr
          });

          //Creating clientAuthentication object:
          var clientAu = {token: newToken, userName: req.body.userName};

          //Return a succesful status response (success code) alogn with token:
          return res.status(200).json(clientAu);

        }catch(err){
          //TODO DEBUG
          console.log("DEBUG: ERROR in Change Mode: " + err.toString());
          //Return a failure status response (failure code):
          return res.status(500).json({success: false, data: err});
        }

    }


    //Change the user mode

    //----------TODO Database query code HERE
});

//------------------------ END SETTINGS page--------------------------------------------

//Extra functionality for JWT authentication
//This  funciton verifies and validates any token that is used 
//  throughout the social network. Note: token is an encrypted string
function verifyToken(token){
  //TODO DEBUG
  console.log("DEBUG: TOKEN: " + token);

  //Verify if a token was sent along with the request:
  if(token.length <= 0 || token === undefined){
    //TODO DEBUG
    console.log("DEBUG: Token verification failed! Null token");

    //Token was not sent. Let the function caller handle the error
    throw ({ success: false, data: 'Null token'});
  }

  //Validate token
  jwt.verify(token, config.secret, function(err,decoded) {      
    if (err) {
      //Token is invalid. Let the function caller handle the situation
      throw ({ success: false, data: 'Server authentication failure.'});    
    } else {        
      //TODO DEBUG
      console.log("DEBUG: TOKEN VERIFIED. DECODED PAYLOAD:" + JSON.stringify(decoded));
      //Return the decoded payload of the token
      return decoded;    
    }
  });

}


module.exports = router;




//-----------------OLD CODE----------------------



//-------#######--------From this point below, these routes REQUIRE AUTHENTICATION ----------#######------------

//Express.js route middlepoint: Verify tokens before allowing requests to pass through

// router.use(function(req, res, next){

//   //Of all URLs, the server has to be aware of these ones:
//   var homePageURL = '/mvenue-database/homepage/';
//   var tradespaceURL = '/mvenue-database/tradespace/';

//   //If the URL starts with /mvenue-database/homepage/
//   if( req.originalUrl.slice(0, homePageURL.length) == homePageURL){
    


//   } else if( req.originalUrl.slice(0, tradespaceURL.length) == tradespaceURL){
//       //Retrieve token from url
//       var token = req.originalUrl.slice(tradespaceURL.length, req.originalUrl.length);

//       //TODO DEBUG
//       console.log("DEBUG: TOKEN FROM REQUEST: " + token);

//       //Verify if a token was sent along with the request:
//       if(token.length <= 0){
//           //TODO DEBUG
//         // console.log("DEBUG: Middleware reached! REQUEST URL: " + req.protocol + '://' + req.get('host') + req.originalUrl);
//         console.log("DEBUG: Middleware error reached! Null token");

//         //Token was not sent. Respond with error code
//         return res.status(401).json({success: false, data: 'Null token'});
//       }

//       //Validate token
//       jwt.verify(token, config.secret, function(err,decoded) {      
//         if (err) {
//           return res.status(401).json({ success: false, data: 'Server authentication failure.' });    
//         } else {        
//           //TODO DEBUG
//           console.log("DEBUG: TOKEN VERIFIED FOR: " + tradespaceURL);
//           console.log("DEBUG: DECODED PAYLOAD: " + JSON.stringify(decoded));
//           // Store decoded token along with the request and let it continue
//           req.tokenPayload = decoded;    
//           next();
//         }
//       });
//   }

// }); //End route.use();