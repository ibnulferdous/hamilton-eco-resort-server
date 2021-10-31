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
    const bookingCollection = database.collection("bookings");

    

    // Villas- GET API for all
    app.get('/villas', async(req, res) => {
      const cursor = villasCollection.find({});
      const villas = await cursor.toArray();
      res.send(villas);
    })

    // Villas- GET API for one villa
    app.get('/villas/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const villa = await villasCollection.findOne(query);
      res.json(villa);
    })

    // Villas- POST API
    app.post('/villas', async(req, res) => {
      const villa = req.body;
      const result = await villasCollection.insertOne(villa);

      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    });

    // Bookings- GET API for all
    app.get('/bookings', async(req, res) => {
      const cursor = bookingCollection.find({});
      const allBookings = await cursor.toArray();
      res.send(allBookings);
    })

    // Bookings- POST API
    app.post('/bookings', async(req, res) => {
      const booking = req.body;

      const result = await bookingCollection.insertOne(booking);

      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    });

    // Bookings- POST API to find data by googleId
    app.post('/bookings/bygoogleid', async(req, res) => {
      const userId = req.body;
      const query = { googleId: {$in: userId} };
      const bookingByUser = await bookingCollection.find(query).toArray();
      res.json(bookingByUser);
    })

    // Bookings- UPDATE API
    app.put('/bookings/:id', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateStatus = {
        $set: {
          orderStatus: `approved`
        },
      };

      const result = await bookingCollection.updateOne(filter, updateStatus, options);

      res.json(result);
    })
    
    // Bookings- DELETE API
    app.delete('/bookings/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);

      res.json(result);
    })

    

    

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