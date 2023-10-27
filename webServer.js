const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const async = require("async");

const express = require("express");
const app = express();

// Load the Mongoose schema for User, Photo, and SchemaInfo
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");

// XXX - Your submission should work without this line. Comment out or delete
// this line for tests and before submission!
//const models = require("./modelData/photoApp.js").models;
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});


app.get("/test/:p1", function (request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params
  // objects.
  console.log("/test called with param1 = ", request.params.p1);

  const param = request.params.p1 || "info";

  if (param === "info") {
    // Fetch the SchemaInfo. There should only one of them. The query of {} will
    // match it.
    SchemaInfo.find({}, function (err, info) {
      if (err) {
        // Query returned an error. We pass it back to the browser with an
        // Internal Service Error (500) error code.
        console.error("Error in /user/info:", err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (info.length === 0) {
        // Query didn't return an error but didn't find the SchemaInfo object -
        // This is also an internal error return.
        response.status(500).send("Missing SchemaInfo");
        return;
      }

      // We got the object - return it in JSON format.
      console.log("SchemaInfo", info[0]);
      response.end(JSON.stringify(info[0]));
    });
  } else if (param === "counts") {
    // In order to return the counts of all the collections we need to do an
    // async call to each collections. That is tricky to do so we use the async
    // package do the work. We put the collections into array and use async.each
    // to do each .count() query.
    const collections = [
      { name: "user", collection: User },
      { name: "photo", collection: Photo },
      { name: "schemaInfo", collection: SchemaInfo },
    ];
    async.each(
        collections,
        function (col, done_callback) {
          col.collection.countDocuments({}, function (err, count) {
            col.count = count;
            done_callback(err);
          });
        },
        function (err) {
          if (err) {
            response.status(500).send(JSON.stringify(err));
          } else {
            const obj = {};
            for (let i = 0; i < collections.length; i++) {
              obj[collections[i].name] = collections[i].count;
            }
            response.end(JSON.stringify(obj));
          }
        }
    );
  } else {
    response.status(400).send("Bad param " + param);
  }
});


app.get("/user/list", function (request, response) {
  User.find({}, "_id first_name last_name", function (err, users) {
    if (err) {
      console.error("Error in /user/list:", err);
      response.status(500).send(JSON.stringify(err));
    } else {
      // Convert the users to the required format
      const userList = users.map(user => ({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
      }));
      response.status(200).json(userList);
    }
  });
});


app.get("/user/:id", function (request, response) {
  const id = request.params.id;
  //if (user === null) {
  //console.log("User with _id:" + id + " not found.");
  //response.status(400).send("Not found");
  //return;
  //}
  User.findById(id, "_id first_name last_name location description occupation", function (err, user) {
    if (err) {
      console.error("Error in /user/:id:", err);
      response.status(500).send(JSON.stringify(err));
    } else if (!user) {
      response.status(400).send("User not found");
    } else {
      response.status(200).json(user);
    }
  });
});


app.get("/photosOfUser/:id", function (request, response) {
  const id = request.params.id;
  Photo.find({
    user_id: id
  }, function (err, photos) {
    if (err !== null) {
      response.status(400).send("error");

    } else if (photos.length === 0) {
      response.status(400).send("no such user photos");

    } else {
      var functionStack = [];
      var info = JSON.parse(JSON.stringify(photos));
      for (var i = 0; i < info.length; i++) {
        delete info[i].__v;
        var comments = info[i].comments;

        comments.forEach(function (comment) {
          var uid = comment.user_id;

          functionStack.push(function (callback) {
            User.findOne({
              _id: uid
              // eslint-disable-next-line no-shadow
            }, function (err, result) {
              if (err !== null) {
                response.status(400).send("error");
              } else {
                var userInfo = JSON.parse(JSON.stringify(result));
                var user = {
                  _id: uid,
                  first_name: userInfo.first_name,
                  last_name: userInfo.last_name
                };
                comment.user = user;
              }
              callback();
            });
          });
          delete comment.user_id;
        });

      }

      // eslint-disable-next-line no-unused-vars
      async.parallel(functionStack, function (res) {
        response.status(200).send(info);
      });
    }
  });
});

const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log(
      "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});
