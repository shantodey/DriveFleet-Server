const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const dotenv = require('dotenv')
const cors = require("cors");


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config()
const uri = process.env.MONGODB_URI

const app = express()
const PORT = process.env.PORT;
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send("server is runnig fine")
})


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    // creating a Database to stor the data 
    const db = client.db("DriveFleet")


    // Making different collections on the database to store different data
    const addCarCollection = db.collection("cars")
    const bookingCars = db.collection("bookcar")


    // sending add card data to database
    app.post('/cars', async (req, res) => {
      const cars = req.body;
      const result = await addCarCollection.insertOne(cars)
      res.json(result)
    })

    // Getting car data for Explore Cars page from databse
    app.get('/cars', async (req, res) => {
      const result = await addCarCollection.find().toArray();
      res.json(result)
    })


    // Getting Individual card data 
    app.get('/cars/:id', async (req, res) => {
      const { id } = req.params;
      const result = await addCarCollection.findOne({ _id: new ObjectId(id) })
      res.json(result)
    });


    // adding Booking Cars data to database
    app.post('/booking', async (req, res) => {
      const bookscar = req.body;
      const result = await bookingCars.insertOne(bookscar)
      res.json(result)
      console.log(result);

    })


    // getting Booking card data form database who is booking
    app.get('/booking/:userId', async (req, res) => {
      const { userId } = req.params;
      const result = await bookingCars.find({ userId: userId }).toArray();
      res.json(result)
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);

app.listen(PORT, () => {
  console.log(`server is running on port${PORT}`);

})