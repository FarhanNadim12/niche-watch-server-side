const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e7skh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("time_zone");
        const watches = database.collection("watches");
        const users = database.collection("users");
        const orders = database.collection("orders");
        const reviews = database.collection("reviews");

        app.get('/watches', async (req, res) => {
            const cursor = watches.find({});
            const watch = await cursor.toArray();
            res.send(watch);

        });
        app.get('/orders', async (req, res) => {
            const cursor = orders.find({});
            const result = await cursor.toArray();
            res.send(result);

        });
        app.get('/reviews', async (req, res) => {
            const cursor = reviews.find({});
            const result = await cursor.toArray();
            res.send(result);

        });
        app.get('/users', async (req, res) => {
            const cursor = users.find({});
            const result = await cursor.toArray();
            res.send(result);

        });
        app.get('/watches/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const watch = await watches.findOne(query);
            res.send(watch)

        });
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orders.deleteOne(query);
            console.log(result);
            res.send(result)

        });
        app.delete('/watches/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await watches.deleteOne(query);
            console.log(result);
            res.send(result)

        });
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await users.insertOne(user);
            console.log(result);
            res.json(result)
        })
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orders.insertOne(order);
            console.log(result);
            res.json(result)
        })
        app.post('/watches', async (req, res) => {
            const watch = req.body;
            const result = await watches.insertOne(watch);
            console.log(result);
            res.json(result)
        })
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviews.insertOne(review);
            console.log(result);
            res.json(result)
        })
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await users.updateOne(filter, updateDoc);
            res.json(result)
        })

        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body.sttatus;
            const query = { _id: ObjectId(id) };
            const updateDoc = { $set: { status: updateStatus } };
            const result = await orders.updateOne(query, updateDoc);
            console.log(result);
            res.json(result)
        })
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await users.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })




    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})