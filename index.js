const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/demo');
  console.log('db connected');
}

const userSchema = new mongoose.Schema({
  title: String,
  description: String
});

const User = mongoose.model('User', userSchema);

const server = express();

server.use(cors());
server.use(bodyParser.json());

server.post('/demo', async (req, res) => {
  let user = new User();
  user.title = req.body.title;
  user.description = req.body.description;
  const doc = await user.save();
  console.log(doc);
  res.json(doc);
});
server.put('/demo/:id', async (req, res) => {
    const taskId = req.params.id;
    const { title, description } = req.body;
  
    try {
      const updatedTask = await User.findByIdAndUpdate(taskId, { title, description }, { new: true });
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the task.' });
    }
  });
  server.delete('/demo/:id', async (req, res) => {
    const taskId = req.params.id;
  
    try {
      const deletedTask = await User.findByIdAndDelete(taskId);
      res.json(deletedTask);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the task.' });
    }
  });

server.get('/demo', async (req, res) => {
  const docs = await User.find({});
  res.json(docs);
});

server.listen(8080, () => {
  console.log('server started');
});
