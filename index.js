const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// mongodb

// const uri = 'mongodb://localhost:27017';

const uri =
  'mongodb+srv://shohag1102:Saikat12345@cluster0.sd7cqcy.mongodb.net/?retryWrites=true&w=majority';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db('crud');
    const users = database.collection('users');

    app.post('/users', async (req, res) => {
      const newUser = req.body;
      console.log('from server ', newUser);
      const doc = {
        ...newUser,
      };
      const result = await users.insertOne(doc);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result);
    });

    app.get('/users', async (req, res) => {
      const cursor = users.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      console.log('id is ', id);
      const query = { _id: new ObjectId(id) };

      const result = await users.findOne(query);

      res.send(result);
    });

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      console.log('please delete from database', id);
      const query = { _id: new ObjectId(id) };

      const result = await users.deleteOne(query);

      if (result.deletedCount === 1) {
        console.log('Successfully deleted one document.');
      } else {
        console.log('No documents matched the query. Deleted 0 documents.');
      }
      res.send(result);
    });

    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      console.log('please update ', id);
      console.log('updated data', updatedData);

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedData.name,
          email: updatedData.email,
        },
      };

      const result = await users.updateOne(filter, updateDoc, options);
      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Successfully connected to MongoDB!');
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

app.get('/', (req, res) => {
  res.send('Welcome to backend');
});

app.listen(PORT, () => {
  console.log(`Port is connected at ${PORT}`);
});
