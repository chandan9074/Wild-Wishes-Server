const { MongoClient } = require('mongodb');
const express = require("express");
const app = express();
require('dotenv').config()
const cors = require("cors");
const ObjectId = require('mongodb').ObjectId;


app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z2qxz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();

    const database = client.db("wildWishesdb");
    const serviceCollection = database.collection("services");
    const bookingsCollection = database.collection("bookings");


    // get api
    app.get("/services", async (req, res)=>{

        const cursor = serviceCollection.find({});
        const services = await cursor.toArray();
        res.send(services)
        
    })

    app.get("/my-bookings", async (req, res)=>{

        const cursor = bookingsCollection.find({});
        const services = await cursor.toArray();
        res.send(services)
        
    })

    app.get("/services/:id", async (req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const user = await serviceCollection.findOne(query)
      res.send(user);
    })

     // post api
    app.post('/bookings', async (req, res)=>{
      const data = req.body;
      const result = await bookingsCollection.insertOne(data);
      res.json(result);
    })

     // post api
    app.post('/services', async (req, res)=>{
      const data = req.body;
      const result = await serviceCollection.insertOne(data)
      res.json(result)
    })

    //delete api
    app.delete('/bookings/:id', async (req, res)=>{
      const userid = req.params.id;
      const query = {_id: ObjectId(userid)};
      const result = await bookingsCollection.deleteOne(query);
      res.json(result);

    })

    app.put("/bookings/:id", async (req, res)=>{
      const id = req.params.id;
      const newBook = req.body;
      const filter = {_id: ObjectId(id)};
       const updateDoc = {
          $set: {
            oderSt: newBook.oderSt
          },
        };

        const result = await bookingsCollection.updateOne(filter, updateDoc);
        res.json(result)
      })
    
    }
  finally{
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res)=>{
    res.send("Responding server")
})

app.listen(port, ()=>{
    console.log(`lisiting port on ${port}`)
})