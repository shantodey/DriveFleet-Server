const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const dotenv = require('dotenv')
const cors=require("cors");


const { MongoClient, ServerApiVersion } = require('mongodb');
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


    // sending add card data to database
    app.post('/addCar', async  (req, res) => {
      const cars = req.body;
      const result = await addCarCollection.insertOne(cars)
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