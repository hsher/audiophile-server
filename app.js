const express = require('express');
const cors = require('cors');
const { v4 } = require('uuid');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const fs = require('fs');
const brandsFile = './database/categories/brands.json';
const typesFile = './database/categories/types.json';
const colorsFile = './database/categories/colors.json';
const productsFile = './database/products/products.json';
const usersFile = './database/users/users.json';
let brands = JSON.parse(fs.readFileSync(brandsFile));
let types = JSON.parse(fs.readFileSync(typesFile));
let colors = JSON.parse(fs.readFileSync(colorsFile));
let users = JSON.parse(fs.readFileSync(usersFile));
let products = JSON.parse(fs.readFileSync(productsFile));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// GET

app.get('/api/products', (req, res) => {
  res.status(200).json(products);
});

app.get('/api/types', (req, res) => {
  res.status(200).json(types);
});

app.get('/api/brands', (req, res) => {
  res.status(200).json(brands);
});

app.get('/api/colors', (req, res) => {
  res.status(200).json(colors);
});

// POST

app.post('/api/types', (req, res) => {
  const type = { id: v4(), ...req.body };
  types.push(type);
  fs.writeFileSync(typesFile, JSON.stringify(types));
  res.status(201).json(type);
});

app.post('/api/brands', (req, res) => {
  const brand = { id: v4(), ...req.body };
  brands.push(brand);
  fs.writeFileSync(brandsFile, JSON.stringify(brands));
  res.status(201).json(brand);
});

app.post('/api/colors', (req, res) => {
  const color = { id: v4(), ...req.body };
  colors.push(color);
  fs.writeFileSync(colorsFile, JSON.stringify(colors));
  res.status(201).json(color);
});

app.post('/api/products', (req, res) => {
  const product = { ...req.body.product, id: v4() };
  products.push(product);
  fs.writeFileSync(productsFile, JSON.stringify(products));
  res.status(201).json(product);
});

// DELETE

app.delete('/api/products', (req, res) => {
  products = products.filter((product) => product.id !== req.body.id);
  fs.writeFileSync(productsFile, JSON.stringify(products));
  res.status(200).json({ massage: 'Товар был удален' });
});

app.delete('/api/types', (req, res) => {
  types = types.filter((elem) => elem.id !== req.body.id);
  fs.writeFileSync(typesFile, JSON.stringify(types));
  res.status(200).json({ massage: 'Тип был удален' });
});

app.delete('/api/brands', (req, res) => {
  brands = brands.filter((elem) => elem.id !== req.body.id);
  fs.writeFileSync(brandsFile, JSON.stringify(brands));
  res.status(200).json({ massage: 'Бренд был удален' });
});

app.delete('/api/colors', (req, res) => {
  colors = colors.filter((elem) => elem.id !== req.body.id);
  fs.writeFileSync(colorsFile, JSON.stringify(colors));
  res.status(200).json({ massage: 'Цвет был удален' });
});

// PUT

app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex((product) => product.id === req.params.id);
  console.log('req', req.body);
  console.log('req', req.params);
  products[index] = req.body;
  // fs.writeFileSync(productsFile, JSON.stringify(products))
  res.status(200).json(products);
});

app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`));
