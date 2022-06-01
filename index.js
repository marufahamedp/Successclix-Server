const express = require('express')
const app = express()
const cors = require('cors');
const admin = require("firebase-admin");
require('dotenv').config();
const fileUpload = require('express-fileupload');
const imgbbUploader = require("imgbb-uploader");
const { MongoClient, ServerApiVersion, ObjectID } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const morgan = require('morgan')

const port = process.env.PORT || 5000;

const serviceAccount = require('./successclixs-firebase-adminsdk.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});














app.use(cors());
app.use(express.json());
app.use(fileUpload());



const uri = `mongodb+srv://ptcbd:asdfasdfnaisdfhiuasdfkjasdfaosidfj@cluster0.jcoi8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



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
        const userlogsCollection = database.collection('userlogs');
        const serviceCollection = database.collection('service');
        const subscribersCollection = database.collection('subscribers');
        const getpaymentCollection = database.collection('getpayment');

        //get team members
        app.get('/getpayment', async (req, res) => {
            const cursor = getpaymentCollection.find({});
            const getpayment = await cursor.toArray()
            res.send(getpayment)
        });

        // post team members
        app.post('/getpayment', async (req, res) => {
            const getpayment = req.body;
            const result = await getpaymentCollection.insertOne(getpayment);
            res.json(result);
        })
        // get single teammembers

        app.get('/getpayment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const getpayment = await getpaymentCollection.findOne(query);
            res.json(getpayment);
        })

        // delete single teammembers
        app.delete('/getpayment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const getpayment = await getpaymentCollection.deleteOne(query);
            res.json(getpayment);
        })

        app.put('/getpayment/:id', verifyToken, async (req, res) => {
            const id = req.params.id;
            const orders = req.body;
            const filter = { _id: ObjectID(id) };
            const options = { upsert: true };
            const updateDoc = { $set: orders };
            const result = await getpaymentCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });


        //get team members
        app.get('/subscribers', async (req, res) => {
            const cursor = subscribersCollection.find({});
            const subscribers = await cursor.toArray()
            res.send(subscribers)
        });

        // post team members
        app.post('/subscribers', async (req, res) => {
            const subscribers = req.body;
            const result = await subscribersCollection.insertOne(subscribers);
            res.json(result);
        })


        //get team members
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const teammember = await cursor.toArray()
            res.send(teammember)
        });

        // post team members
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.json(result);
        })

        // get single services

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })

       
        // delete single services
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const service = await serviceCollection.deleteOne(query);
            res.json(service);
        })



        // Get user

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });
        // Get userlogs

        app.get('/userlogs', async (req, res) => {
            const cursor = userlogsCollection.find({});
            const userlogs = await cursor.toArray();
            res.send(userlogs);
        });

        app.post('/userlogs', async (req, res) => {
            const userlogs = req.body;
            const result = await userlogsCollection.insertOne(userlogs);
            res.json(result);
        });

        // delete single services
        app.delete('/userlogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const userlogs = await userlogsCollection.deleteOne(query);
            res.json(userlogs);
        })



        //get user by email
        app.get('/users', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = usersCollection.find(query);
            const users = await cursor.toArray()
            res.send(users)
        });


        // //sslcommerz init
        // app.get('/init', (req, res) => {
        //     const data = {
        //         total_amount: 100,
        //         currency: 'USD',
        //         tran_id: 'REF123',
        //         success_url: 'http://yoursite.com/success',
        //         fail_url: 'http://yoursite.com/fail',
        //         cancel_url: 'http://yoursite.com/cancel',
        //         ipn_url: 'http://yoursite.com/ipn',
        //         shipping_method: 'Courier',
        //         product_name: 'Computer.',
        //         product_category: 'Electronic',
        //         product_profile: 'general',
        //         cus_name: 'Customer Name',
        //         cus_email: 'cust@yahoo.com',
        //         cus_add1: 'Dhaka',
        //         cus_add2: 'Dhaka',
        //         cus_city: 'Dhaka',
        //         cus_state: 'Dhaka',
        //         cus_postcode: '1000',
        //         cus_country: 'Bangladesh',
        //         cus_phone: '01711111111',
        //         cus_fax: '01711111111',
        //         ship_name: 'Customer Name',
        //         ship_add1: 'Dhaka',
        //         ship_add2: 'Dhaka',
        //         ship_city: 'Dhaka',
        //         ship_state: 'Dhaka',
        //         ship_postcode: 1000,
        //         ship_country: 'Bangladesh',
        //         multi_card_name: 'mastercard',
        //         value_a: 'ref001_A',
        //         value_b: 'ref002_B',
        //         value_c: 'ref003_C',
        //         value_d: 'ref004_D'
        //     };
        //     const sslcommer = new SSLCommerzPayment(process.env.STOR_ID, process.env.STOR_PASS, false) //true for live default false for sandbox
        //     sslcommer.init(data).then(data => {
        //         //process the response that got from sslcommerz 
        //         //https://developer.sslcommerz.com/doc/v4/#returned-parameters
        //         console.log(data);
        //         res.redirect(data.GatewayPageURL)
        //     });
        // })



        // check admin


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

    




        // app.get('/users/id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const user = await usersCollection.findOne(query);
        //     res.json({ user });
        // })









        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });






        app.put('/users', verifyToken, async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.put('/users/photo', verifyToken, async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);

        })

        app.put('/users/status', verifyToken, async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);

        })
        app.put('/users/adminpower', verifyToken, async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);

        })
        app.put('/users/membership', verifyToken, async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);

        })
        app.put('/users/nidverification', verifyToken, async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);

        })




        app.put('/users/admin', verifyToken, async (req, res) => {
            const user = req.body;
            const requester = req.decodedEmail;
            if (requester) {
                const requesterAccount = await usersCollection.findOne({ email: requester });
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




run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello ptc!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})
