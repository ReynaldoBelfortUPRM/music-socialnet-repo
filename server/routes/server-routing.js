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


//--READS--//
    //CLIENT INPUT: none
    router.get('/mvenue-database/user-info/:token', function(req, res) {
        //TODO DEBUG
        console.log("DEBUG: Change User Mode Request entry.");
        var uPayload={
            isBusinessMode: false,
            user_id: 1,
            business_id_:1
        };
        var userInfo = [];

        //Token validation
        //try{
        //    //Get payload data from the client that is logged in
        //    uPayload = verifyToken(req.params.token);
        //}catch(err){
     //    return res.status(401).json(err); //End request by returning a failure response.
        //}

        pg.connect(connectionString, function (err, client, done) {
            // Handle connection errors
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }


                console.log("DEBUG: DB QUERY BUSINESS MODE");

                var getQuery="(SELECT first_name, last_name, email, photo_path, about FROM uuser WHERE user_id=$1)";

                // SQL Query > Select Data
                var query = client.query(getQuery, [uPayload.user_id]);


                // Stream results back one row at a time
                query.on('row', function (row) {
                    userInfo.push(row);
                });

                // After all data is returned, close connection and return results
                query.on('end', function () {
                    done();

                    console.log("DEBUG: GET userInfo - SETTINGS: "+ JSON.stringify(userInfo));

                    return res.json(userInfo);
                });

        });

    });

    //CLIENT INPUT: none
    router.get('/mvenue-database/user-tags/:token', function(req, res) {

        console.log("DEBUG: Change User Mode Request entry.");

        var uPayload={
            isBusinessMode: false,
            user_id: 1,
            business_id_:1
        };
        var userTags = [];

        //Token validation
        //try{
        //    //Get payload data from the client that is logged in
        //    uPayload = verifyToken(req.params.token);
        //}catch(err){
        //    return res.status(401).json(err); //End request by returning a failure response.
        //}

        pg.connect(connectionString, function (err, client, done) {
            // Handle connection errors
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }


            console.log("DEBUG: DB QUERY BUSINESS MODE");

            var getQuery="(SELECT data FROM tag_user WHERE user_id=$1)";

            // SQL Query > Select Data
            var query = client.query(getQuery, [uPayload.user_id]);

            // Stream results back one row at a time
            query.on('row', function (row) {
                userTags.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function () {
                done();

                console.log("DEBUG: GET userTags - SETTINGS: "+ JSON.stringify(userTags));

                return res.json(userTags);
            });



        });








    });

    //CLIENT INPUT: none
    router.get('/mvenue-database/user-groups/:token', function(req, res) {
    //The groups that the user administrates and the group that the user is in
        console.log("DEBUG: Change User Mode Request entry.");

        var uPayload={
            isBusinessMode: false,
            user_id: 1,
            business_id_:1
        };
        var userGroups = [];

        //Token validation
        //try{
        //    //Get payload data from the client that is logged in
        //    uPayload = verifyToken(req.params.token);
        //}catch(err){
        //    return res.status(401).json(err); //End request by returning a failure response.
        //}

        pg.connect(connectionString, function (err, client, done) {
            // Handle connection errors
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }


            console.log("DEBUG: DB QUERY BUSINESS MODE");

            var getQuery="(SELECT group_id, name, description, group_administrator, photo_path FROM ggroupWHERE group_administrator =  $1 OR group_id IN  (SELECT group_id FROM group_membership WHERE user_id=$2)";

            // SQL Query > Select Data
            var query = client.query(getQuery, [uPayload.user_id,uPayload.user_id]);

            // Stream results back one row at a time
            query.on('row', function (row) {
                userGroups.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function () {
                done();

                console.log("DEBUG: GET userInfo - SETTINGS: "+ JSON.stringify(userGroups));

                return res.json(userGroups);
            });



        });










    });

    //CLIENT INPUT: none
    router.get('/mvenue-database/user-business-pages/:token', function(req, res) {
    //The groups that the user administrates and the group that the user is in
        console.log("DEBUG: Change User Mode Request entry.");

        var uPayload={
            isBusinessMode: false,
            user_id: 1,
            business_id_:1
        };
        var business = [];

        //Token validation
        //try{
        //    //Get payload data from the client that is logged in
        //    uPayload = verifyToken(req.params.token);
        //}catch(err){
        //    return res.status(401).json(err); //End request by returning a failure response.
        //}

        pg.connect(connectionString, function (err, client, done) {
            // Handle connection errors
            if (err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }


            console.log("DEBUG: DB QUERY BUSINESS MODE");

            var getQuery="(SELECT name, about, photo_path, user_id, business_id FROM businesspage WHERE user_id = $1)";

            // SQL Query > Select Data
            var query = client.query(getQuery, [uPayload.user_id]);

            // Stream results back one row at a time
            query.on('row', function (row) {
                business.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function () {
                done();

                console.log("DEBUG: GET business - SETTINGS: "+ JSON.stringify(business));

                return res.json(business);
            });



        });










    });
//--READS--//

//-------------------------------------------------------------------------
//--CREATE--//
    //USER//
    //CLIENT INPUT: {data: data}
    router.post('/mvenue-database/new-user-tag/:token', function(req, res) {
        console.log("DEBUG: Homepage POST------.");

        var post_input={
            data: req.body.data
        };



        var uPayload;
        var updatedTags = [];

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

            //This is a BUSINESS POST
            // SQL Query > Insert Data

            client.query(" INSERT INTO tag_user(data, user_id))" +
                "VALUES ($1, $2)"
                , [post_input.data, uPayload.user_id]);

            //----Get all post related to the user----



            var getQuery="(SELECT data FROM tag_user WHERE user_id=$1)";

            // SQL Query > Select Data
            var query = client.query(getQuery, uPayload.user_id);

            // Stream results back one row at a time
            query.on('row', function (row) {
                updatedTags.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function () {
                done();

                console.log("DEBUG: new-user-tag DONE");

                return res.json(updatedTags);
            });

        });


    });



    //GROUP//
    /*CLIENT INPUT: {
     name: name,
     about: description,
     photo_path: photo_path

     CLIENT OUTPUT:{

     group_id,
     name,
     description,
     group_administrator,
     photo_path
     }
     }*/
    router.post('/mvenue-database/new-group/:token', function(req, res) {
        console.log("DEBUG: Homepage POST------.");

        var post_input={
            name: req.body.name,
            about: req.body.description,
            photo_path: req.body.photo_path
        };

        var uPayload;
        var updatedGroups = [];

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

            //This is a BUSINESS POST
            // SQL Query > Insert Data


            var postquery = "(INSERT INTO ggroup(name, description, group_administrator, photo_path)VALUES ($1 , $2 , $3, $4))";

            client.query(postquery, [post_input.name,post_input.description,post_input.photo_path ,uPayload.user_id]);




            //----Get all groups that the user is in or administrates----
            var getQuery="(SELECT group_id, name, description, group_administrator, photo_path FROM ggroup WHERE group_administrator =  $1 OR group_id IN  (SELECT group_id FROM group_membership WHERE user_id=$2)";
            // SQL Query > Select Data
            var query = client.query(getQuery, [uPayload.user_id,uPayload.user_id]);

            // Stream results back one row at a time
            query.on('row', function (row) {
                updatedGroups.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function () {
                done();

                console.log("DEBUG: new-group DONE");

                return res.json(updatedGroups);
            });

        });


    });

    /*
    CLIENT INPUT: {
     user_id: user_id,
     group_id: group_id
     }

     CLIENT OUTPUT:// The people that are in whe group with id group_id in input
    * user_id
    * first_name
    * last_name
    * */
    router.post('/mvenue-database/new-group-member/:token', function(req, res) {
        console.log("DEBUG: Homepage POST------.");

        var post_input={
            user_id: req.body.user_id,
            group_id: req.body.group_id
        };

        var uPayload;
        var updatedMembers = [];

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

            //This is a BUSINESS POST
            // SQL Query > Insert Data

            var insertquery="(INSERT INTO group_membership(group_id, user_id) VALUES ($1, $2))";

            client.query(insertquery, [post_input.group_id, post_input.user_id]);

            //----Get all the members of the group with id group_id----

            var getQuery=   "SELECT user_id, first_name, last_name"+
                            "FROM uuser"+
                            "WHERE user_id IN (SELECT user_id FROM group_membership WHERE group_id = $1)";
            // SQL Query > Select Data
            var query = client.query(getQuery, [post_input.group_id]);

            // Stream results back one row at a time
            query.on('row', function (row) {
                updatedMembers.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function () {
                done();

                console.log("DEBUG: new-group-member DONE");

                return res.json(updatedMembers);
            });

        });


    });

    /*CLIENT INPUT:
     {data: data,
     group_id: group_id}

     OUTPUT: // with the new tag
     {data: data}
     */
    router.post('/mvenue-database/new-group-tag/:token', function(req, res) {
        console.log("DEBUG: Homepage POST------.");

        var post_input={
            data: req.body.data,
            group_id: req.body.group_id
        };



        var uPayload;
        var updatedTags = [];

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

            //This is a BUSINESS POST
            // SQL Query > Insert Data

            client.query(" INSERT INTO tag_group(data, group_id))" +
                "VALUES ($1, $2)"
                , [post_input.data, post_input.group_id]);

            //----Get all tags related to the group----



            var getQuery="(SELECT data FROM tag_group WHERE group_id=$1)";

            // SQL Query > Select Data
            var query = client.query(getQuery, post_input.group_id);

            // Stream results back one row at a time
            query.on('row', function (row) {
                updatedTags.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function () {
                done();

                console.log("DEBUG: new-group-tag DONE");

                return res.json(updatedTags);
            });

        });


    });



    //BUSINESS//
    /*CLIENT INPUT:
    {   name: name,
        about: about,
        photo_path: photo_path
    }

    CLIENT OUTPUT:// That the user logged in administrates
    {
    business_id,
    name,
    about,
    user_id,
    photo_path
    }

    */
    router.post('/mvenue-database/new-business/:token', function(req, res) {
        console.log("DEBUG: Homepage POST------.");

        var post_input={
            name: req.body.name,
            about: req.body.about,
            photo_path: req.body.photo_path
        };

        var uPayload;
        var updatedGroups = [];

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

            //This is a BUSINESS POST
            // SQL Query > Insert Data
            var postquery ="(INSERT INTO businesspage(name, about, photo_path, user_id) VALUES ($1, $2, $3, $4))";

            client.query(postquery, [post_input.name,post_input.about,post_input.photo_path ,uPayload.user_id]);

            //----Get all business that the user is in or administrates----
            var getQuery="(SELECT business_id, name, about, user_id, photo_path FROM businesspage WHERE user_id =  $1 )";
            // SQL Query > Select Data
            var query = client.query(getQuery, [uPayload.user_id]);

            // Stream results back one row at a time
            query.on('row', function (row) {
                updatedGroups.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function () {
                done();
                console.log("DEBUG: new-business DONE");
                return res.json(updatedGroups);
            });

        });


    });

/*
 CLIENT INPUT:
 {
 data: data,
 group_id: business_id
 }

 CLIENT OUTPUT:
 {
 data
 }
 */
    router.post('/mvenue-database/new-business-tag/:token', function(req, res) {
        console.log("DEBUG: Homepage POST------.");

        var post_input={
            data: req.body.data,
            group_id: req.body.business_id
        };



        var uPayload;
        var updatedTags = [];

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

            //This is a BUSINESS POST
            // SQL Query > Insert Data

            client.query(" INSERT INTO tag_busines(data, business_id))" +
                "VALUES ($1, $2)"
                , [post_input.data, post_input.business_id]);

            //----Get all tags related to the business----

            var getQuery="(SELECT data FROM tag_busines WHERE business_id=$1)";

            // SQL Query > Select Data
            var query = client.query(getQuery, post_input.business_id);

            // Stream results back one row at a time
            query.on('row', function (row) {
                updatedTags.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function () {
                done();

                console.log("DEBUG: new-business-tag DONE");

                return res.json(updatedTags);
            });

        });


    });

//--CREATE--//
//-------------------------------------------------------------------------
//--DELETE--//
router.delete('/mvenue-database/delete-user/', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: Homepage server entry. DELETE Post: TOKEN:" + req.query.tk + " , POST_ID: " + req.query.postID)
    var uPayload;
    var toDeleteID = req.query.ID;
    var posts = [];

    //Token validation
    try{
        //Get payload data from the client that is logged in
        uPayload = verifyToken(req.query.tk);
    }catch(err){
        return res.status(401).json(err); //End request by returning a failure response.
    }

    console.log("DEBUG: TOKEN VERIFIED. DELETE USER:" + JSON.stringify(uPayload));

    pg.connect(connectionString, function (err, client, done) {
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }


        //Execute delete query
        client.query("DELETE FROM post_business WHERE post_id=$1;", [toDeleteID]);

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

            console.log("DEBUG: DELETE USERS ");

            return res.json([posts]);
        });





    });

});




//--DELETE--//
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