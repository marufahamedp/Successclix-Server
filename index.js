const express = require('express')
const app = express()
const cors = require('cors');
const admin = require("firebase-admin");
require('dotenv').config();
const fileUpload = require('express-fileupload');
const imgbbUploader = require("imgbb-uploader");
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const port = process.env.PORT || 5000;

const serviceAccount = require('./successclixs-firebase-adminsdk.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const uri = `mongodb+srv://ptcbd:CletBv9cgvFsxZ1k@cluster0.jcoi8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function verifyToken(req, res, next) {
    if (req.headers?.authorization?.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decodedUser = await admin.auth().verifyIdToken(token);
            req.decodedEmail = decodedUser.email;
        }
        catch {

        }

    }
    next();
}

async function run() {
    try {
        await client.connect();
        const database = client.db('PTC_SITE');
        const usersCollection = database.collection('users');



        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.json(users);
        });
        
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });
       

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.put('/users/admin', verifyToken, async (req, res) => {
            const user = req.body;
            const requester = req.decodedEmail;
            if (requester) {
                const requesterAccount = await usersCollection.findOne({ email: requester });
                console.log(req.decodedEmail);
                if (requesterAccount.role === 'admin') {
                    const filter = { email: user.email };
                    const updateDoc = { $set: { role: 'admin' } };
                    const result = await usersCollection.updateOne(filter, updateDoc);
                    res.json(result);
                }
            }
            else {
                res.status(403).json({ message: 'you do not have access to make admin' })
            }

        })





    }
    finally {
        // await client.close();
    }
}




// async function run() {
//     try {
//         await client.connect();
//         const database = client.db('PTC_SITE');
//         const usersCollection = database.collection('users');

//         app.get('/users', async (req, res) => {
//             const cursor = usersCollection.find({});
//             const user = await cursor.toArray();
//             res.json(user);
//         });
//         app.post('/users', async (req, res) => {
//             console.log(req.body.image);
//             const image = req.body.image;
//             const name = req.body.name;
//             const user = {
//                 image: image,
//                 name:name
//             }
//             const result = await usersCollection.insertOne(user);
//             res.json(result);
//         })

//     }
//     finally {
//         // await client.close();
//     }
// }

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello ptc!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})