const express = require("express");
const app = express();
const ObjectId = require("mongodb").ObjectID;
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
// require("dotenv").config();
const port = process.env.PORT || 5000;
require("dotenv/config");
app.use(cors());
app.use(express.json());
const urlencodedParser = express.urlencoded({ extended: false });

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nexck.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const booksCollection = client.db("library").collection("books");
  const orderedBooksCollection = client
    .db("library")
    .collection("orderedbooks");
  app.post("/addbooks", (req, res) => {
    const newBook = req.body;
    booksCollection
      .insertOne(newBook)
      .then((result) => res.send(result.insertedCount > 0));
  });
  app.get("/allBooks", (req, res) => {
    booksCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/getbook/:key", (req, res) => {
    booksCollection.find({ key: req.params.key }).toArray((err, document) => {
      res.send(document);
    });
  });
  app.post("/orderedbooks", (req, res) => {
    const bookCart = req.body;
    orderedBooksCollection.insertOne(bookCart).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/bookcart", (req, res) => {
    orderedBooksCollection
      .find({ email: req.query.email })
      .toArray((err, document) => {
        res.send(document);
      });
  });

  app.delete("/delete/:id", (req, res) => {
    booksCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result);
        console.log(result);
      });
  });
});

app.get("/", (req, res) => {
  res.send("Unmoy's Web");
});

app.listen(port);
