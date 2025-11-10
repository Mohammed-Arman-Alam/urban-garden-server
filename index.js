const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app =express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jgws5o6.mongodb.net/?appName=Cluster0`;


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
    const featuredGardenersCollection = client.db('urbanGardenDB').collection('featuredGardeners');
    const tipsCollection = client.db('urbanGardenDB').collection('tips');
    app.get('/featuredGardeners', async (req, res) => {
            const result = await featuredGardenersCollection.find().toArray();
            res.send(result);
        });
    app.get('/activeFeaturedGardeners', async (req, res) => {
            const activeGardeners = await featuredGardenersCollection
              .find({ status: "active" })
              .limit(6)
              .toArray();
            res.send(activeGardeners);
        });
    app.get('/tips', async(req,res)=>{
            const result = await tipsCollection.find().toArray();
            res.send(result);
        });
    app.get('/topTips', async(req,res)=>{
            const result = await tipsCollection.find().limit(6).toArray();
            res.send(result);
        });
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("UrbanGarden")
})
app.listen(port,()=>{
    console.log(`runng on port ${port}`);
});