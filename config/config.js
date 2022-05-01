const { MongoClient } = require("mongodb");

// const uri = "mongodb://localhost:27017";
// const client = new MongoClient(uri, {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
// });

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.1wbmx.mongodb.net/mongodb-review-electron-shop?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db("mongodb-electron-shop");
      console.log("Successfully connected to MongoDB.");

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};
