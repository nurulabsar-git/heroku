const express = require('express')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
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




  
});








app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || 5050, () => {
  console.log("your port link: http://localhost:5050");
})