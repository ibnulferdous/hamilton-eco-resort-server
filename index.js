const express = require('express');
const app = express();
require('dotenv').config();
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dh7kk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("hamilton_eco_resort");
    const villasCollection = database.collection("villas");

    // GET API
    app.get('/villas', async(req, res) => {
      const cursor = villasCollection.find({});
      const villas = await cursor.toArray();
      res.send(villas);
    })

    // POST API
    app.post('/villas', async(req, res) => {
      const villa = req.body;
      const result = await villasCollection.insertOne(villa);

      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    });

    

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hamilton Eco Resort Server is running!');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})