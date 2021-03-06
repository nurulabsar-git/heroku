const express = require('express')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()



const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());


console.log(process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME);



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ivwbd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('Connection error', err)
const recapCollection = client.db("mongoRecap").collection("recap");
  console.log('Connection successfully')


app.post('/addEvent', (req, res) => {
  const newEvent = req.body;
  console.log('adding new body', newEvent);
  recapCollection.insertOne(newEvent)
  .then(result => {
    console.log('inserted Count', result.insertedCount)
    res.send(result.insertedCount > 0)
  })
})


app.get('/events', (req, res) => {
  recapCollection.find()
  .toArray((err, items) => {
    res.send(items)
    console.log('from data base',items)

  })
})

app.delete('/deleteEvent/:id', (req, res) =>{

  const id = ObjectID(req.params.id);
  console.log('delete text', id);
  recapCollection.deleteOne({_id: id})
  .then((err, documents) => res.send({
    success: true
  }))
})



// app.delete('/delete/:id', (req, res) => {
//   console.log(req.params.id)
//   RegisteredEventCollection.deleteOne({_id: ObjectId(req.params.id)})
//   .then(result => {
//     console.log(result);
//     res.send(result.deletedCount > 0);
//   })
// })




  
});








app.get('/', (req, res) => {
  res.send('Hello World, This is heroku home page!')
})

app.listen(process.env.PORT || 5050, () => {
  console.log("your port link: http://localhost:5050");
})