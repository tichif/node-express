const path = require('path');
const fs = require('fs');

const express = require('express');
const { v4: uuidv4, v4 } = require('uuid');

// Inisyalize express
const app = express();

// middleware
app.use(express.json());

const getData = () => {
  const pathFile = path.join(__dirname, 'data', 'data.json');
  const data = fs.readFileSync(pathFile);
  return JSON.parse(data);
};

const writeData = (data) => {
  const pathFile = path.join(__dirname, 'data', 'data.json');
  fs.writeFileSync(pathFile, JSON.stringify(data));
};

// wout
app.get('/', (req, res) => {
  const data = getData();
  res.send(data);
});

// POST Route
// ajoute yon posts nan fichye data
app.post('/', (req, res) => {
  const tit = req.body.tit;
  const konteni = req.body.konteni;
  // const { tit, konteni } = req.body;

  if (!tit || !konteni) {
    return res.status(401).json({
      success: false,
      msg: 'Tout chan yo obligatwa',
    });
  }
  const post = { id: v4(), tit, konteni };
  const data = getData();
  data.push(post);
  writeData(data);
  return res.status(201).json({
    success: true,
    data: post,
  });
});

// GET Route
// jwenn yon spesifik post
app.get('/:id', (req, res) => {
  const id = req.params.id;
  const data = getData();
  const post = data.find((item) => item.id === id);

  if (!post) {
    return res.status(404).json({
      success: false,
      msg: 'Post sa a pa egziste',
    });
  }

  return res.status(200).json({
    success: true,
    data: post,
  });
});

// PUT Route
// update yon post
app.put('/:id', (req, res) => {
  const id = req.params.id;
  const data = getData();
  const post = data.find((item) => item.id === id);

  if (!post) {
    return res.status(404).json({
      success: false,
      msg: 'Post sa a pa egziste',
    });
  }

  const { tit, konteni } = req.body;

  post.tit = tit || post.tit;
  post.konteni = konteni || post.konteni;

  // data.map(item => {
  //   if(item.id === post.id){
  //      item = post
  //   }else{
  //      item = item
  // }})
  data.map((item) => (item.id === post.id ? post : item));
  writeData(data);
  return res.status(200).json({
    success: true,
    data: post,
  });
});

// Delete Route
// delete yon post
app.delete('/:id', (req, res) => {
  const id = req.params.id;
  const data = getData();
  const post = data.find((item) => item.id === id);

  if (!post) {
    return res.status(404).json({
      success: false,
      msg: 'Post sa a pa egziste',
    });
  }

  const newData = data.filter((post) => post.id !== id);
  writeData(newData);
  return res.status(200).json({
    success: true,
    data: {},
  });
});

const PORT = process.env.PORT || 5000;

// lanse sèvè a
app.listen(PORT, () => console.log(`Sèvè a ap mache nan pò ${PORT}`));
