const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const myModule = require('./myModule');



app.use(bodyParser.json());





// const fs = require('fs');


// const content = 'Hello, this is a sample text file.';


// const fileName = 'output.txt';

// fs.writeFile(fileName, content, (err) => {
//   if (err) {
//     console.error('Error writing to the file:', err);
//     return;
//   }

//   console.log('File created successfully:', fileName);
// });



// var fs = require('fs');

// // Use fs.readFile() method to read the file
// fs.readFile('Demo.txt', 'utf8', function (err, data) {
//     // Display the file content
//     console.log(data);
// });

// console.log('readFile called');


// const fs = require('fs');

// fs.writeFile('example.txt', 'Hello, Node.js!', 'utf8', (err) => {
//   if (err) {
//     console.error('Error writing file:', err);
//     return;
//   }
//   console.log('File written successfully!');
// });

mongoose.connect('mongodb://localhost:27017/express_mongoose_crud', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model('Item', itemSchema);

// <<<<------------------routes---------->>>>
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/items', async (req, res) => {
  const item = new Item({
    name: req.body.name,
    description: req.body.description,
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/items/:id', getItem, (req, res) => {
  res.json(res.item);
});

app.put('/items/:id', getItem, async (req, res) => {
  if (req.body.name != null) {
    res.item.name = req.body.name;
  }
  if (req.body.description != null) {
    res.item.description = req.body.description;
  }

  try {
    const updatedItem = await res.item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/items/:id', getItem, async (req, res) => {
  try {
    await res.item.remove();
    res.json({ message: 'Deleted Item' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


async function getItem(req, res, next) {
  let item;
  try {
    item = await Item.findById(req.params.id);
    if (item == null) {
      return res.status(404).json({ message: 'Cannot find item' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.item = item;
  next();
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
