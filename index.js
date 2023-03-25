const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const bannerData = client.db('oneTravelAgent').collection('bannerData');
        const cardData = client.db('oneTravelAgent').collection('cardData');
        const teamData = client.db('oneTravelAgent').collection('teamData');
        const userReview = client.db('oneTravelAgent').collection('userReview');
        const userData = client.db('oneTravelAgent').collection('userData');

        app.get('/bannerData', async (req, res) => {
            const query = {};
            const options = await bannerData.find(query).toArray();
            res.send(options)
        });

        app.get('/teamData', async (req, res) => {
            const query = {};
            const options = await teamData.find(query).toArray();
            res.send(options)
        });

        // app.put('/bannerData/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const jahid = req.body;
        //     console.log(jahid)
        //     const filter = { _id: ObjectId(id) }
        //     console.log(filter)
        //     const options = { upsert: true }
        //     const updatedBanner = {
        //         $set: {
        //             text1: jahid
        //         }
        //     }
        //     const result = await bannerData.updateOne(filter, jahid, options)
        //     res.send('yes')

        // });

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await userData.findOne(query);
            res.send({ isAdmin: user?.userType === 'Admin' })
        })

        app.get('/users/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await userData.findOne(query);
            res.send({ isUser: user?.userType === 'User' })
        })


        app.put('/bannerData/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const banner = req.body
            const options = { upsert: true }
            const updatedBanner = {
                $set: {
                    ...banner
                    // text1: banner.text1
                }
            }
            const result = await bannerData.updateOne(filter, updatedBanner, options)
            res.send(result)

        })

        app.get('/islandData', async (req, res) => {
            const query = {};
            const data = await cardData.find(query, { name: 1, _id: 0 }).sort({ "name": 1 }).toArray();
            res.send(data)
        })

        app.get('/userReview', async (req, res) => {
            const query = {};
            const data = await userReview.find(query).toArray();
            res.send(data)
        });

        app.get('/userData', async (req, res) => {
            const query = {};
            const options = await userData.find(query).toArray();
            res.send(options)
        });

        app.post('/userData', async (req, res) => {
            const user = req.body;
            const email = user.email;
            const query = { email: email };
            const find = await userData.findOne(query);
            if (find === null) {
                const insertData = await userData.insertOne(user);
                res.send(insertData)
            }
            else {
                return console.log('hello');
            }

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