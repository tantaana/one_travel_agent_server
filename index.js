const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eivtc4s.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const cardDataCollection = client.db('oneTravelAgent').collection('cardData');
        const userReviewCollection = client.db('oneTravelAgent').collection('userReview');

        app.get('/islandData', async (req, res) => {
            const query = {};
            const data = await cardDataCollection.find(query, { name: 1, _id: 0 }).sort({ "name": 1 }).toArray();
            res.send(data)
        })

        app.get('/userReview', async (req, res) => {
            const query = {};
            const data = await userReviewCollection.find(query).toArray();
            res.send(data)
        })
    }
    finally {

    }
}
run().catch(console.log);




app.get('/', (req, res) => {
    res.send('server running')
});

app.listen(port, () => {
    console.log(`server is running ${port}`)
})