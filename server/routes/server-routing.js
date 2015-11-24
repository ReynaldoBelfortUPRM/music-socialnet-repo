/* Server Router
  Every http requiest comming from the views are captured here.
*/

//Loading required packages:
var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var jwt = require('jsonwebtoken');
//var bcrypt = require('bcryptjs');
var bcrypt = [];
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
      var user = {first_name: req.body.first_name, last_name:req.body.last_name, email:req.body.email, password:req.body.password, photo_path:"photo", about:"I'm a MusicVenue user!" };

     // Get a Postgres client from the connection pool
     pg.connect(connectionString, function(err, client, done) {
         // Handle connection errors
         if(err) {
           done();
           console.log("DEBUG: PG ERROR REGISTER: " + err);        
           return res.status(500).json({ success: false, data: err});
         }

         // Generate a salt as a requirement for the encryption method
         // var salt = bcrypt.genSaltSync(10); //Level 10 encryption, considering hardware limitaitions.
          //Encrypt new password
          //var hashPass = bcrypt.hashSync(user.password, salt);
          //TODO user_id attribute is needed in this query???
            //client.query("INSERT INTO uuser(user_id, first_name, last_name,email, password, photo_path, about) values($1, $2,$3, $4,$5, $6,$7)", [id, user.first_name, user.last_name, user.email, hashPass, user.photo_path, user.about]);
         client.query("INSERT INTO uuser(user_id, first_name, last_name,email, password, photo_path, about) values($1, $2,$3, $4,$5, $6,$7)", [id, user.first_name, user.last_name, user.email, user.password, user.photo_path, user.about]);
           // client.query("INSERT INTO follow(follower_id, followed_id) values($1, $2)", [id, id]);

          //Return sucess response
          return res.status(200);
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
//====GET====
router.get('/mvenue-database/homepage/:token', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: Homepage server entry. GET Posts");

    var uPayload;
    var posts = [];

    //Token validation
    try{
        //Get payload data from the client that is logged in
        uPayload = verifyToken(req.params.token);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

   console.log("DEBUG: TOKEN VERIFIED. DECODED PAYLOAD GETPOSTS:" + JSON.stringify(uPayload));

    pg.connect(connectionString, function (err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        if (uPayload.isBusinessMode){

          console.log("DEBUG: DB QUERY BUSINESS MODE");
          //----Get all post related to the user----
          var getQuery="(SELECT post_id, user_id as id, data, media_path, media_type, date_time,  \"isBusinessPost\", first_name as name FROM post_user NATURAL JOIN uuser NATURAL FULL JOIN(SELECT post_id, count(liked_by_id) as likes FROM post_user_like GROUP BY post_id) as postoffollowedusers)  UNION (SELECT post_id, business_id as id, data, media_path, media_type, date_time, \"isBusinessPost\", name FROM post_business NATURAL JOIN businesspage ) ORDER BY date_time DESC ;";

          // SQL Query > Select Data
          var query = client.query(getQuery);


          // Stream results back one row at a time
          query.on('row', function (row) {
              posts.push(row);
          });

          // After all data is returned, close connection and return results
          query.on('end', function () {
              done();

              console.log("DEBUG: RESULTS GET POSTS BusinessMode ");

              return res.json([posts, uPayload.business_id]);
          });

          }
          else{
              //IN USER MODE
                  //----Get all post related to the user----
                  var squery="(WITH followintposts AS (SELECT *  FROM post_user WHERE user_id IN (SELECT followed_id FROM follow WHERE follower_id= $1) )SELECT post_id, user_id as id, data, media_path, media_type, date_time,  \"isBusinessPost\", first_name as name  FROM followintposts NATURAL JOIN uuser NATURAL FULL JOIN(SELECT post_id, count(liked_by_id) as likes FROM post_user_like GROUP BY post_id) as postoffollowedusers)  UNION (SELECT post_id, business_id as id, data, media_path, media_type, date_time,  \"isBusinessPost\", name FROM (SELECT post_id, business_id, data, media_path, media_type, date_time, \"isBusinessPost\", name FROM post_business NATURAL JOIN businesspage  ) as bpostwithnames WHERE business_id IN (SELECT business_id FROM follow_business WHERE user_id = $2)) ORDER BY date_time DESC ;" ;

                  // SQL Query > Select Data
                  var query = client.query(squery, [uPayload.user_id, uPayload.user_id]);

                  // Stream results back one row at a time
                  query.on('row', function (row) {
                      posts.push(row);
                  });

                  // After all data is returned, close connection and return results
                  query.on('end', function () {
                      done();
                      console.log("DEBUG: RESULTS GET POSTS RegularMode");
                      return res.json([posts, uPayload.user_id]);
                  });

       }// end else isBusinessMode

    });

});

//====POST====
router.post('/mvenue-database/homepage/:token', function(req, res) {
    console.log("DEBUG: Homepage POST------.");

    var post_input={
        data: req.body.data,
        media_path: req.body.media_path,
        media_type: req.body.media_type
    };
    var uPayload;
    var updatedPosts = [];

    //Token validation
    try{
        //Get payload data from the client that is logged in
        uPayload = verifyToken(req.params.token);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

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

            console.log("BUSINESS MODE");

            client.query("INSERT INTO post_business( business_id, data, media_path, media_type, date_time, \"isBusinessPost\")" +
                "VALUES ( $1 , $2, $3, $4, CURRENT_TIMESTAMP, true)"
                , [uPayload.business_id, post_input.data, post_input.media_path,post_input.media_type ]);
            
            //----Get all post related to the user----
            var getQuery="(SELECT post_id, user_id as id, data, media_path, media_type, date_time,  \"isBusinessPost\", first_name as name FROM post_user NATURAL JOIN uuser NATURAL FULL JOIN(SELECT post_id, count(liked_by_id) as likes FROM post_user_like GROUP BY post_id) as postoffollowedusers)  UNION (SELECT post_id, business_id as id, data, media_path, media_type, date_time, \"isBusinessPost\", name FROM post_business NATURAL JOIN businesspage ) ORDER BY date_time DESC ;";

            // SQL Query > Select Data
            var query = client.query(getQuery);


            // Stream results back one row at a time
            query.on('row', function (row) {
                updatedPosts.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function () {
                done();

                console.log("DEBUG: RESULTS GET POSTS AFTER ADD POST BusinessMode");

                return res.json([updatedPosts, uPayload.business_id]);
            });
        }
        else{
            //THIS IS A USER POST

            // SQL Query > Insert Data

            console.log("USER MODE");
            client.query("INSERT INTO post_user( user_id, data, media_path, media_type, date_time, \"isBusinessPost\")" +
                "VALUES ( $1 , $2, $3, $4, CURRENT_TIMESTAMP, false)"
                , [uPayload.user_id, post_input.data, post_input.media_path,post_input.media_type ]);
            
            //----Get all post related to the user----
            var getQuery ="(WITH followintposts AS (SELECT *  FROM post_user WHERE user_id IN (SELECT followed_id FROM follow WHERE follower_id= $1) )SELECT post_id, user_id as id, data, media_path, media_type, date_time,  \"isBusinessPost\", first_name as name  FROM followintposts NATURAL JOIN uuser NATURAL FULL JOIN(SELECT post_id, count(liked_by_id) as likes FROM post_user_like GROUP BY post_id) as postoffollowedusers)  UNION (SELECT post_id, business_id as id, data, media_path, media_type, date_time,  \"isBusinessPost\", name FROM (SELECT post_id, business_id, data, media_path, media_type, date_time, \"isBusinessPost\", name FROM post_business NATURAL JOIN businesspage  ) as bpostwithnames WHERE business_id IN (SELECT business_id FROM follow_business WHERE user_id = $2)) ORDER BY date_time DESC ;" ;

            // SQL Query > Select Data
            var query = client.query(getQuery, [uPayload.user_id, uPayload.user_id]);

            // Stream results back one row at a time
            query.on('row', function (row) {
                updatedPosts.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function () {
                done();
                console.log("DEBUG: RESULTS GET POSTS AFTER ADD POST RegularMode");
                return res.json([updatedPosts, uPayload.user_id]);
            });

        }
    });


});


//====DELETE====
router.delete('/mvenue-database/homepage/', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: Homepage server entry. DELETE Post: TOKEN:" + req.query.tk + " , POST_ID: " + req.query.postID)
    var uPayload;
    var postID = req.query.postID;
    var posts = [];

    //Token validation
    try{
        //Get payload data from the client that is logged in
        uPayload = verifyToken(req.query.tk);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

   console.log("DEBUG: TOKEN VERIFIED. DECODED PAYLOAD DELETEPOST:" + JSON.stringify(uPayload));

    pg.connect(connectionString, function (err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        if (uPayload.isBusinessMode){

          console.log("DEBUG: DB DELETE QUERY BUSINESS MODE");
          //=============TODO Aqui va query para DELETE POST=================
          //Execte delete query
          client.query("DELETE FROM post_business WHERE post_id=$1;", [postID]);

          //----Get all post related to the user----
          var getQuery= "NATURAL FULL JOIN(SELECT post_id, count(liked_by_id) as likes FROM post_user_like GROUP BY post_id) as postoffollowedusers)  UNION (SELECT post_id, business_id as id, data, media_path, media_type, date_time, \"isBusinessPost\", name FROM post_business NATURAL JOIN businesspage ) ORDER BY date_time DESC ;";

          // SQL Query > Select Data
          var query = client.query(getQuery);


          // Stream results back one row at a time
          query.on('row', function (row) {
              posts.push(row);
          });

          // After all data is returned, close connection and return results
          query.on('end', function () {
              done();

              console.log("DEBUG: RESULTS GET POSTS BusinessMode ");

              return res.json([posts, uPayload.business_id]);
          });

          }
          else{
              //IN USER MODE

              console.log("DEBUG: DB DELETE QUERY USER MODE");
              //=============TODO Aqui va query para DELETE POST=================
              //Execte delete query
              client.query("DELETE FROM post_user WHERE post_id=$1;", [postID]);

              //----Get all post related to the user----
              var getQuery="(WITH followintposts AS (SELECT *  FROM post_user WHERE user_id IN (SELECT followed_id FROM follow WHERE follower_id= $1) )SELECT post_id, user_id as id, data, media_path, media_type, date_time,  \"isBusinessPost\", first_name as name  FROM followintposts NATURAL JOIN uuser NATURAL FULL JOIN(SELECT post_id, count(liked_by_id) as likes FROM post_user_like GROUP BY post_id) as postoffollowedusers)  UNION (SELECT post_id, business_id as id, data, media_path, media_type, date_time,  \"isBusinessPost\", name FROM (SELECT post_id, business_id, data, media_path, media_type, date_time, \"isBusinessPost\", name FROM post_business NATURAL JOIN businesspage  ) as bpostwithnames WHERE business_id IN (SELECT business_id FROM follow_business WHERE user_id = $2)) ORDER BY date_time DESC ;" ;

              // SQL Query > Select Data
              var query = client.query(getQuery, [uPayload.user_id, uPayload.user_id]);

              // Stream results back one row at a time
              query.on('row', function (row) {
                  posts.push(row);
              });

              // After all data is returned, close connection and return results
              query.on('end', function () {
                  done();
                  console.log("DEBUG: RESULTS GET POSTS RegularMode after DELETE");
                  return res.json([posts, uPayload.user_id]);
              });

       }// end else isBusinessMode

    });

});

//====EDIT/UPDATE====
router.put('/mvenue-database/homepage/', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: Homepage server entry. UPDATE Post: TOKEN:" + req.query.tk + " , POST_ID: " + req.query.postID)
    var uPayload;
    var postID = req.query.postID;
    var posts = [];
    var post_input={
        data: req.body.data,
        media_path: req.body.media_path,
        media_type: req.body.media_type
    };

    //Token validation
    try{
        //Get payload data from the client that is logged in
        uPayload = verifyToken(req.query.tk);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

   console.log("DEBUG: TOKEN VERIFIED. DECODED PAYLOAD DELETEPOST:" + JSON.stringify(uPayload));

    pg.connect(connectionString, function (err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        if (uPayload.isBusinessMode){

          console.log("DEBUG: DB UPDATE QUERY BUSINESS MODE");
          //=============TODO Aqui va query para UPDATE POST=================
          //Execte UPDATE query
          client.query("UPDATE post_business SET data=$1, media_path=$2, media_type=$3 WHERE post_id=$4;", [post_input.data, post_input.media_path, post_input.media_type, postID]);

          //----Get all post related to the user----
          var getQuery= "NATURAL FULL JOIN(SELECT post_id, count(liked_by_id) as likes FROM post_user_like GROUP BY post_id) as postoffollowedusers)  UNION (SELECT post_id, business_id as id, data, media_path, media_type, date_time, \"isBusinessPost\", name FROM post_business NATURAL JOIN businesspage ) ORDER BY date_time DESC ;";

          // SQL Query > Select Data
          var query = client.query(getQuery);


          // Stream results back one row at a time
          query.on('row', function (row) {
              posts.push(row);
          });

          // After all data is returned, close connection and return results
          query.on('end', function () {
              done();

              console.log("DEBUG: RESULTS GET POSTS BusinessMode ");

              return res.json([posts, uPayload.business_id]);
          });

          }
          else{
              //IN USER MODE

              console.log("DEBUG: DB UPDATE QUERY USER MODE");
              //=============TODO Aqui va query para UPDATE POST=================
              //Execte UPDATE query
              client.query("UPDATE post_user SET  data=$1, media_path=$2, media_type=$3 WHERE post_id=$4;", [post_input.data, post_input.media_path, post_input.media_type, postID]);

              //----Get all post related to the user----
              var getQuery="(WITH followintposts AS (SELECT *  FROM post_user WHERE user_id IN (SELECT followed_id FROM follow WHERE follower_id= $1) )SELECT post_id, user_id as id, data, media_path, media_type, date_time,  \"isBusinessPost\", first_name as name  FROM followintposts NATURAL JOIN uuser NATURAL FULL JOIN(SELECT post_id, count(liked_by_id) as likes FROM post_user_like GROUP BY post_id) as postoffollowedusers)  UNION (SELECT post_id, business_id as id, data, media_path, media_type, date_time,  \"isBusinessPost\", name FROM (SELECT post_id, business_id, data, media_path, media_type, date_time, \"isBusinessPost\", name FROM post_business NATURAL JOIN businesspage  ) as bpostwithnames WHERE business_id IN (SELECT business_id FROM follow_business WHERE user_id = $2)) ORDER BY date_time DESC ;" ;

              // SQL Query > Select Data
              var query = client.query(getQuery, [uPayload.user_id, uPayload.user_id]);

              // Stream results back one row at a time
              query.on('row', function (row) {
                  posts.push(row);
              });

              // After all data is returned, close connection and return results
              query.on('end', function () {
                  done();
                  console.log("DEBUG: RESULTS GET POSTS RegularMode after UPDATE");
                  return res.json([posts, uPayload.user_id]);
              });

       }// end else isBusinessMode

    });

});

//------------------------ END HOMEPAGE--------------------------------------------|


//------------------------START TRADESPACE------------------------------------------
//====GET====
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

//====GET BASIC INFO====
router.get('/mvenue-database/settings/basic-info/:token', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: SETTINGS BASIC INFO Request entry.");    
    var uPayload;
    var results = [];

    //Token validation
    try{
      //Get payload data from the client that is logged in
      uPayload = verifyToken(req.params.token);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

  console.log("DEBUG: TOKEN VERIFIED. DECODED PAYLOAD GET BASIC INFO SETTINGS:" + JSON.stringify(uPayload));

    pg.connect(connectionString, function (err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        //=============TODO Aqui va query para UPDATE POST=================
        //Get basic info from user
        var query = client.query("SELECT first_name, last_name, email, photo_path, about FROM uuser WHERE user_id = $1", [uPayload.user_id]);

        // Stream results back one row at a time
        query.on('row', function (row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            done();

            console.log("DEBUG: RESULTS GET BASIC INFO SETTINGS ");
            return res.json({first_name: results[0].first_name, last_name: results[0].last_name,
                email: results[0].email, photo_path: results[0].photo_path, about: results[0].about});
        });

          

    });

});

//====UPDATE BASIC INFO====
router.post('/mvenue-database/settings/basic-info/:token', function(req, res) {
    console.log("DEBUG: SETTINGS UPDATE Basic Info------.");

    var basicInfo = req.body;
    var uPayload;
    var updatedPosts = [];

    //Token validation
    try{
        //Get payload data from the client that is logged in
        uPayload = verifyToken(req.params.token);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

    // Get a Postgres client from the connection pool
    console.log("DEBUG: DB CONNECT");
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        //Update user's basic data
        client.query("UPDATE uuser SET first_name=$1, last_name=$2, email=$3, " + 
          "photo_path=$4,  about=$5 WHERE user_id=$6;",
          [basicInfo.first_name, basicInfo.last_name, basicInfo.email, basicInfo.photo_path, basicInfo.about, uPayload.user_id]);
        
        //----Get all post related to the user----
        var getQuery="(SELECT post_id, user_id as id, data, media_path, media_type, date_time,  \"isBusinessPost\", first_name as name FROM post_user NATURAL JOIN uuser NATURAL FULL JOIN(SELECT post_id, count(liked_by_id) as likes FROM post_user_like GROUP BY post_id) as postoffollowedusers)  UNION (SELECT post_id, business_id as id, data, media_path, media_type, date_time, \"isBusinessPost\", name FROM post_business NATURAL JOIN businesspage ) ORDER BY date_time DESC ;";

        // SQL Query > Select Data
        var query = client.query(getQuery);


        // Stream results back one row at a time
        query.on('row', function (row) {
            updatedPosts.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            done();

            console.log("DEBUG: RESULTS GET POSTS AFTER ADD POST BusinessMode");

            return res.json([updatedPosts, uPayload.business_id]);
        });
    });


});

//====DELETE ACCOUNT====
router.delete('/mvenue-database/settings/user/:token', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: SETTINGS MY TAGS DELETE Request entry.");
    var uPayload;

    //Token validation
    try{
        //Get payload data from the client that is logged in
        uPayload = verifyToken(req.params.token);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

    pg.connect(connectionString, function (err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        //Delete the user from the database
        client.query("DELETE FROM uuser WHERE user_id=$1;", [ uPayload.user_id]);

        //Return a success Response
        return res.status(200);

    });

});

//====PASSWORD RESET====
router.post('/mvenue-database/settings/password-reset/:token', function(req, res) {
    console.log("DEBUG: SETTINGS PASSWORD RESET------.")

    var passData = req.body;
    var uPayload;
    var results = [];

    //Token validation
    try{
        //Get payload data from the client that is logged in
        uPayload = verifyToken(req.params.token);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

    // Get a Postgres client from the connection pool
    console.log("DEBUG: DB CONNECT");
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        //Verify if user password is correct
        var query = client.query("SELECT password FROM uuser WHERE user_id = $1", [uPayload.user_id]);

        // Stream results back one row at a time
        query.on('row', function (row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            done();
            //Verify user's current password
            if(bcrypt.compareSync(passData.currentPass, results[0].password)){
              console.log("DEBUG: SETTINGS CURRENT PASSWORD VERIFIED. Changing for new passowrd");

              // Generate a salt as a requirement for the encryption method
              var salt = bcrypt.genSaltSync(10);
              //Encrypt new password
              var hashPass = bcrypt.hashSync(passData.newPass, salt);

              //Update password on database
              client.query("UPDATE uuser SET password = $1 WHERE user_id = $2;", [hashPass, uPayload.user_id]);
              
              //Return success response
              return res.status(200);
            }
            else
            {
              //Return a failure response
              console.log("DEBUG: SETTINGS CURRENT PASSWORD INCORRECT.");
              return res.status(401).json({data: "Incorrect password!"});
            }

        });
    });


});



//====GET MY TAGS====
router.get('/mvenue-database/settings/tag-info/:token', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: SETTINGS MY TAGS Request entry.");        
    var uPayload;
    var results = [];

    //Token validation
    try{
      //Get payload data from the client that is logged in
      uPayload = verifyToken(req.params.token);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

  console.log("DEBUG: TOKEN VERIFIED. DECODED PAYLOAD GET BASIC INFO SETTINGS:" + JSON.stringify(uPayload));

    pg.connect(connectionString, function (err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        //Get tags from user
        var query = client.query("SELECT data FROM tag_user WHERE user_id= $1;", [uPayload.user_id]);

        // Stream results back one row at a time
        query.on('row', function (row) {
            results.push(row);
        });

        // Capture error from query execution
        query.on('error', function (err) {
            return res.status(500).json({data: err});
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            done();
            
            console.log("DEBUG: RESULTS SETTINGS Get MY TAGS" + JSON.stringify(results));
            return res.json(results);
        });
   
    });

});

//====ADD MY TAGS====
router.post('/mvenue-database/settings/tag-info/:token', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: SETTINGS MY TAGS ADD Request entry.");        
    var uPayload;
    var results = [];

    //Token validation
    try{
      //Get payload data from the client that is logged in
      uPayload = verifyToken(req.params.token);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

    pg.connect(connectionString, function (err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        //Add the tag to the database
        client.query("INSERT INTO tag_user(data, user_id) VALUES ($1, $2);", [req.body.data, uPayload.user_id]);

        //----Get all the available tags for this user----
        var query = client.query("SELECT data FROM tag_user WHERE user_id= $1;", [uPayload.user_id]);

        // Stream results back one row at a time
        query.on('row', function (row) {
            results.push(row);
        });

        // Capture error from query execution
        query.on('error', function (err) {
            return res.status(500).json({data: err});
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            done();

            console.log("DEBUG: RESULTS SETTINGS Get MY TAGS after ADD MY TAG");
            return res.json(results);
        });
   
    });

});

//====EDIT/UPDATE MY TAGS====
router.put('/mvenue-database/settings/tag-info/:token', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: SETTINGS MY TAGS EDIT Request entry.");        
    var uPayload;
    var results = [];
    var currentTag = req.body;

    //Token validation
    try{
      //Get payload data from the client that is logged in
      uPayload = verifyToken(req.params.token);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

    pg.connect(connectionString, function (err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        //Edit the tag to the database
        client.query("UPDATE tag_user SET data = $1 WHERE tag_id = $2 and user_id= $3;", 
                      [currentTag.data, currentTag.tag_id, uPayload.user_id]);

        //Return a success Response
        return res.status(200);
   
    });

});

//====DELETE MY TAGS====
router.delete('/mvenue-database/settings/tag-info/', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: SETTINGS MY TAGS DELETE Request entry.");
    console.log("DEBUG: SETTINGS MY TAGS DELETE Request entry. TOKEN:" + req.query.tk + " , TAG_ID: " + req.query.tagID);
    var uPayload;
    var results = [];
    var tagID = req.query.tagID;

    //Token validation
    try{
      //Get payload data from the client that is logged in
      uPayload = verifyToken(req.query.tk);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

    pg.connect(connectionString, function (err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        //Delete the tag from the database
        client.query("DELETE FROM tag_user WHERE tag_id = $1 and user_id = $2;", [tagID, uPayload.user_id]);

        //Return a success Response
        return res.status(200);
   
    });

});


//==== GET GROUPS THE USER ADMINISTRATES====
router.get('/mvenue-database/settings/group-administrating-info/:token', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: SETTINGS GROUPS Request entry.");        
    var uPayload;
    var results = [];

    //Token validation
    try{
      //Get payload data from the client that is logged in
      uPayload = verifyToken(req.params.token);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

  console.log("DEBUG: TOKEN VERIFIED. DECODED PAYLOAD GET GROUPS SETTINGS:" + JSON.stringify(uPayload));

    pg.connect(connectionString, function (err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        //Get tags from user
        //var query = client.query("SELECT group_id, name, description, group_administrator, photo_path FROM ggroup" +
        //                          "WHERE group_administrator =  $1 OR group_id IN (SELECT group_id FROM group_membership WHERE user_id= $1);", [uPayload.user_id]);


        var query = client.query("SELECT group_id, name, description, group_administrator, photo_path FROM ggroup" +
                                 "WHERE group_administrator =  $1 ", [uPayload.user_id]);

        // Stream results back one row at a time
        query.on('row', function (row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            done();

            var groups = [];
            //Store tag results in the var to be sent as a response
            for (res in results) {
                groups.push({group_id: res[0].group_id, name: res[0].name, description: res[0].description,
                            group_administrator: res[0].group_administrator, photo_path: res[0].photo_path});
            }

            console.log("DEBUG: RESULTS SETTINGS Get GROUPS");
            return res.json(groups);
        });
    });
});

//====GET GROUPS THE USER IS IN====
router.get('/mvenue-database/settings/group-administrating-info/:token', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: SETTINGS GROUPS Request entry.");
    var uPayload;
    var results = [];

    //Token validation
    try{
        //Get payload data from the client that is logged in
        uPayload = verifyToken(req.params.token);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

    console.log("DEBUG: TOKEN VERIFIED. DECODED PAYLOAD GET GROUPS SETTINGS:" + JSON.stringify(uPayload));

    pg.connect(connectionString, function (err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        //Get tags from user
        var query = client.query("SELECT group_id, name, description, group_administrator, photo_path FROM ggroup" +
            "WHERE group_id IN (SELECT group_id FROM group_membership WHERE user_id= $1);", [uPayload.user_id]);

        // Stream results back one row at a time
        query.on('row', function (row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            done();

            var groups = [];
            //Store tag results in the var to be sent as a response
            for (res in results) {
                groups.push({group_id: res[0].group_id, name: res[0].name, description: res[0].description,
                    group_administrator: res[0].group_administrator, photo_path: res[0].photo_path});
            }

            console.log("DEBUG: RESULTS SETTINGS Get GROUPS");
            return res.json(groups);
        });
    });
});

//==== ADD GROUP====
router.post('/mvenue-database/settings/new-group/:token', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: SETTINGS GROUP ADD Request entry.");        
    var uPayload;
    var results = [];
    var post_input={
        name: req.body.name,
        description: req.body.description,
        photo_path: req.body.photo_path
    }
    //Token validation
    try{
      //Get payload data from the client that is logged in
      uPayload = verifyToken(req.params.token);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

    pg.connect(connectionString, function (err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        //Add the tag to the database

        var insertQuery = "INSERT INTO ggroup(name, description, group_administrator, photo_path)VALUES ($1, $2, $3, $4)";
        client.query(insertQuery, [post_input.name, post_input.last_name, post_input.description,uPayload.user_id, post_input.photo_path]);

        //----Get all the available tags for this user----
        var getquery="SELECT name, description,  photo_path, group_id FROM ggroup WHERE  group_administrator = $1;";
        var query = client.query(getquery, [uPayload.user_id]);

        // Stream results back one row at a time
        query.on('row', function (row) {
            results.push(row);
        });

        // Capture error from query execution
        query.on('error', function (err) {
            return res.status(500).json({data: err});
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            done();



            console.log("DEBUG: RESULTS SETTINGS Get GROUP after ADD GROUP");
            return res.json(results);
        });
   
    });

});

//==== EDIT/UPDATE GROUP====
router.put('/mvenue-database/settings/update-group/:token', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: SETTINGS GROUP EDIT Request entry.");        
    var uPayload;
    var results = [];
    var input={
        group_id: group_id,
        name:  name,
        description: description,
        photo_path: photo_path
    }


    try{
      //Get payload data from the client that is logged in
      uPayload = verifyToken(req.params.token);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

    pg.connect(connectionString, function (err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        //Edit the tag to the database

        var updateQuery="(UPDATE ggroup SET name=$1, description=$2,  photo_path=$3, WHERE group_administrator=$4)" ;

        //Token validation
        client.query(updateQuery, [input.name, input.description,input.photo_path, uPayload.user_id]);

        //Return a success Response
        return res.status(200);
   
    });

});

//====DELETE GROUP====
router.delete('/mvenue-database/settings/tag-info/:token', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: SETTINGS GROUP DELETE Request entry.");        
    var uPayload;
    var results = [];
    var groupID = req.body.tagID;

    //Token validation
    try{
      //Get payload data from the client that is logged in
      uPayload = verifyToken(req.params.token);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

    pg.connect(connectionString, function (err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        //Delete the tag from the database
        client.query("DELETE FROM ggroup WHERE group_id=$1;", [groupID]);

        //Return a success Response
        return res.status(200);
   
    });
});


//====TODO GET BUSINESS====
//====TODO UPDATE BUSINESS====
//====TODO DELETE BUSINESS====

//====CHANGE USER====
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
//------------------------ START PROFILE page--------------------------------------------
//====TODO USERINFO====

//====TODO FOLLOW====

//====TODO UNFOLLOW====

//====TODO ADD TO A GROUP====

//====TODO REMOVE FROM A GROUP====
//------------------------ END PROFILE page--------------------------------------------

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

  var decoded;

  try{
    //Validate token
    decoded = jwt.verify(token, config.secret);
  }catch(err){
    //Token is invalid. Let the function caller handle the situation
    throw ({ success: false, data: err});
  }
  
  console.log("DEBUG: PAYLOAD TO RETURN: " + JSON.stringify(decoded));
  return decoded;
}


module.exports = router;