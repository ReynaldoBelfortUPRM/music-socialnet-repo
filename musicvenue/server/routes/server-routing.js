var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
//var connectionString = require(path.join(__dirname, '../', '../', 'config'));

var connectionString={
  user: "nhtxclclofbeab",
  password: "K9eQnPqG_yWOgquFHw9PkfhmhX",
  database: "d1jo4i2pnj1en2",
  port: 5432,
  host: "ec2-54-163-228-188.compute-1.amazonaws.com",
  ssl: true
};

//Sending the MusicVenue welcome page to the client
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', '../', 'client', 'public', 'views', 'index.html'));
});

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


//--------------TODO Area where the database queries will be handled---------------------
//--------------TODO Check section for info on router methods: Response methods    http://expressjs.com/guide/routing.html 


//------------------------Tradespace page------------------------------------------

router.get('/mvenue-database/tradespace/', function(req, res) {
    
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

//------------------------ END Tradespace page------------------------------------------


//------------------------ START login page------------------------------------------

router.post('/mvenue-database/login/', function(req, res) {
    //TODO DEBUG
    console.log("DEBUG: Login server entry.");

    var results = [];

    // Grab data from http request
    var logintry = {email: req.body.email, password: req.body.password };
    //TODO DEBUG
    //console.log("DEBUG: Request data:" + logintry.email + " " + logintry.password);

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({ success: false, data: err});
        }


        // client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);
        //client.query("INSERT INTO uuser(user_id, first_name, last_name,email, password, photo_path, about) values($1, $2,$3, $4,$5, $6,$7)", [id, user.first_name, user.last_name, user.email, user.password, user.photo_path, user.about]);


        //TODO Aquí se debería enviar de vuelta al usuario sobre si pasó el registro o no:
        //Si email existe, etc.

        var query = client.query("SELECT * FROM uuser WHERE email = $1", logintry.email);

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        //TODO DEBUG
          console.log("DEBUG: Results" + results.toString());

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            console.log(JSON.stringify(results));
            return res.json(results);
        });

        
    });
});
//------------------------ END login page--------------------------------------------

//------------------------ START Register page------------------------------------------

 router.post('/mvenue-database/register/', function(req, res) {

     var results = [];

     // Grab data from http request
     //var data = {text: req.body.text, complete: false};
      var user = {first_name: req.body.text, last_name:"del valle", email:"asdsasa", password:"pass", photo_path:"photo", about:"about" };

     // Get a Postgres client from the connection pool
     pg.connect(connectionString, function(err, client, done) {
         // Handle connection errors
         if(err) {
           done();
           console.log(err);
           return res.status(500).json({ success: false, data: err});
         }

    
        // client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);
        client.query("INSERT INTO uuser(user_id, first_name, last_name,email, password, photo_path, about) values($1, $2,$3, $4,$5, $6,$7)", [id, user.first_name, user.last_name, user.email, user.password, user.photo_path, user.about]);

         
         //TODO Aquí se debería enviar de vuelta al usuario sobre si pasó el registro o no: 
            //Si email existe, etc.
            
         var query = client.query("SELECT * FROM uuser ORDER BY user_id ASC");

         // Stream results back one row at a time
         query.on('row', function(row) {
             results.push(row);
         });

         // After all data is returned, close connection and return results
         query.on('end', function() {
             done();
             return res.json(results);
         });
     });
 });
//------------------------ END Register page--------------------------------------------








//######################TODO - CODE TO BE USED AS REFERENCE######################

// router.post('/api/v1/todos', function(req, res) {

//     var results = [];

//     // Grab data from http request
//     var data = {text: req.body.text, complete: false};

//     // Get a Postgres client from the connection pool
//     pg.connect(connectionString, function(err, client, done) {
//         // Handle connection errors
//         if(err) {
//           done();
//           console.log(err);
//           return res.status(500).json({ success: false, data: err});
//         }

//         // SQL Query > Insert Data
//         client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);

//         // SQL Query > Select Data
//         var query = client.query("SELECT * FROM items ORDER BY id ASC");

//         // Stream results back one row at a time
//         query.on('row', function(row) {
//             results.push(row);
//         });

//         // After all data is returned, close connection and return results
//         query.on('end', function() {
//             done();
//             return res.json(results);
//         });


//     });
// });

// router.get('/api/v1/todos', function(req, res) {

//     var results = [];

//     // Get a Postgres client from the connection pool
//     pg.connect(connectionString, function(err, client, done) {
//         // Handle connection errors
//         if(err) {
//           done();
//           console.log(err);
//           return res.status(500).json({ success: false, data: err});
//         }

//         // SQL Query > Select Data
//         var query = client.query("SELECT * FROM items ORDER BY id ASC;");

//         // Stream results back one row at a time
//         query.on('row', function(row) {
//             results.push(row);
//         });

//         // After all data is returned, close connection and return results
//         query.on('end', function() {
//             done();
//             return res.json(results);
//         });

//     });

// });

// router.put('/api/v1/todos/:todo_id', function(req, res) {

//     var results = [];

//     // Grab data from the URL parameters
//     var id = req.params.todo_id;

//     // Grab data from http request
//     var data = {text: req.body.text, complete: req.body.complete};

//     // Get a Postgres client from the connection pool
//     pg.connect(connectionString, function(err, client, done) {
//         // Handle connection errors
//         if(err) {
//           done();
//           console.log(err);
//           return res.status(500).send(json({ success: false, data: err}));
//         }

//         // SQL Query > Update Data
//         client.query("UPDATE items SET text=($1), complete=($2) WHERE id=($3)", [data.text, data.complete, id]);

//         // SQL Query > Select Data
//         var query = client.query("SELECT * FROM items ORDER BY id ASC");

//         // Stream results back one row at a time
//         query.on('row', function(row) {
//             results.push(row);
//         });

//         // After all data is returned, close connection and return results
//         query.on('end', function() {
//             done();
//             return res.json(results);
//         });
//     });

// });

// router.delete('/api/v1/todos/:todo_id', function(req, res) {

//     var results = [];

//     // Grab data from the URL parameters
//     var id = req.params.todo_id;


//     // Get a Postgres client from the connection pool
//     pg.connect(connectionString, function(err, client, done) {
//         // Handle connection errors
//         if(err) {
//           done();
//           console.log(err);
//           return res.status(500).json({ success: false, data: err});
//         }

//         // SQL Query > Delete Data
//         client.query("DELETE FROM items WHERE id=($1)", [id]);

//         // SQL Query > Select Data
//         var query = client.query("SELECT * FROM items ORDER BY id ASC");

//         // Stream results back one row at a time
//         query.on('row', function(row) {
//             results.push(row);
//         });

//         // After all data is returned, close connection and return results
//         query.on('end', function() {
//             done();
//             return res.json(results);
//         });
//     });

// });

//######################TODO - ABOVE CODE TO BE USED AS REFERENCE######################


module.exports = router;
