const { MongoClient } = require('mongodb');
const express = require("express");
const app = express();
require('dotenv').config()
const cors = require("cors");
const ObjectId = require('mongodb').ObjectId;


app.use(cors());
app.use(express.json());

const port = 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z2qxz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// db_name = wildWishes
// db_pass = n1WZeVsIxzzpebit

async function run() {
  try {
    await client.connect();
    console.log("hello man")

    const database = client.db("wildWishesdb");
    const serviceCollection = database.collection("services");
    const bookingsCollection = database.collection("bookings");


    // get api
    app.get("/services", async (req, res)=>{

        const cursor = serviceCollection.find({});
        const services = await cursor.toArray();
        res.send(services)
        // console.log(services)
        
    })

    app.get("/my-bookings", async (req, res)=>{

        const cursor = bookingsCollection.find({});
        const services = await cursor.toArray();
        res.send(services)
        // console.log(services)
        
    })

    app.get("/services/:id", async (req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const user = await serviceCollection.findOne(query)
      // console.log(id)
      res.send(user);
    })

     // post api
    app.post('/bookings', async (req, res)=>{
      const data = req.body;
      const result = await bookingsCollection.insertOne(data);
      console.log("here krishna", result);
      res.json(result);
    })

     // post api
    app.post('/services', async (req, res)=>{
      const data = req.body;
      const result = await serviceCollection.insertOne(data)
      // console.log("here krishna", result);
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
      // console.log("update id ", id)
      // console.log("data ", req.body)
    })
    

    // const docs = [
    //   {img:"https://i.pinimg.com/originals/65/af/98/65af98c3716878368d15427dc017c9f6.jpg", name: "UNDERWATER Call Us Ishmael", des:"Dive into blue Caribbean waters and be dwarfed by some of the largest animals in the ocean.", date:"Jul 01,2022 – Jul 09,2022", place:"Dominica",days:"9-Days", price:"$1,995/person", sit_limit:"26"},
    //   {img:"https://cdn.i-scmp.com/sites/default/files/styles/768x768/public/d8/images/methode/2019/10/31/1462c3a4-fb85-11e9-acf9-cafedce87d15_image_hires_173517.JPG?itok=b2AJ94GH&v=1572514523", name: "CITY In Excess", des:"It’s not just the Middle East being transformed by oil revenue. The capital of Turkmenistan is spectacularly OTT.", date:"Jul 20,2022 – Jul 25,2022", place:"Turkmenistan",days:"5-Days", price:"$1,500/person", sit_limit:"20"},
    //   {img:"https://media-cdn.tripadvisor.com/media/photo-m/1280/15/8e/3a/05/wind-surf-ta-listings.jpg", name: "CRUISE Ahoy There", des:"Feel as though you’re conquering the high seas on this restored schooner while exploring this group of 10 islands, 600 kilometres off the coast of Senegal.", date:"Apr 10,2022 – Apr 17,2022", place:"Cape Verde",days:"7-Days", price:"$2,500/person", sit_limit:"23"},
    //   {img:"https://i.pinimg.com/736x/e7/b9/c4/e7b9c4ff761d5af8b2b2b2639a9bd234--borneo-rainforest-amazon-rainforest.jpg", name: "JUNGLE Take Me to the River", des:" You’ve never really got over your fascination with Indiana Jones, and dropping out, even if only for a week or so, seems like the best idea you’ve heard in forever.", date:"May 12,2022 – May 16,2022", place:"Cape Verde",days:"4-Days", price:"$3,050/person", sit_limit:"30"},
    //   {img:"https://www.europeanceo.com/wp-content/uploads/2019/06/Skiing_winter_sports.jpg", name: "SNOW Off the Piste", des:" Freedom is the key to any great adventure, and this bit of kit takes it to the next level.", date:"Oct 12,2022 – Oct 20,2022", place:"Canada",days:"8-Days", price:"$6,100/person", sit_limit:"25"},
    //   {img:"https://wwwimage-us.pplusstatic.com/thumbnails/photos/w1920-q80/marquee/1039092/wwe_sp_hero_landscape.jpg", name: "IMMERSE The Wild, Wild East", des:"You wanna be a cowboy, but Texas doesn’t cut it any more.", date:"Nov 15,2022 – Nov 20,2022", place:"Colombia",days:"5-Days", price:"$5,500/person", sit_limit:"34"}
    // ];

    // const result = await serviceCollection.insertMany(docs);
    // console.log(result);
    }
  finally{
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, ()=>{
    console.log(`lisiting port on ${port}`)
})