const express = require('express');
const router = express.Router();

const JwtUtil = require('../utils/JwtUtil');
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require ('../models/ProductDAO');

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
  if (!admin) {
    return res.json({ success: false });
  }

  const token = JwtUtil.genToken(username, password);
  res.json({ success: true, token });
});

// GET categories
router.get('/categories', async (req, res) => {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

// POST category
router.post('/categories', async (req, res) => {
  const result = await CategoryDAO.insert(req.body);
  res.json(result);
});

// PUT /api/admin/categories/:id
router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const updatedCategory = req.body; 

    const result = await CategoryDAO.update({ _id: id, name: updatedCategory.name })
; 
    if (result) {
      res.json({ success: true, message: 'Category updated successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Category not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// category
router.get('/categories/:id', JwtUtil.checkToken, async function (req,res) {
    const categories = await CategoryDAO.selectAll ();
    res.json(categories);
});
router.post('/categories', JwtUtil.checkToken , async function (req,res) {
    const name = req.body.name;
    const category = { name: name};
    const result = await CategoryDAO.insert(category);
    res.json(result);
}) ;
router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const category = { _id: _id, name: name };
  const result = await CategoryDAO.update(category);
  res.json(result);
});
router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
    const category = { _id: _id};
  const result = await CategoryDAO.delete(category);
  res.json(result);
}) ;
//product
router.get('/products',JwtUtil.checkToken,async function(req,res){
var products=await ProductDAO.selectAll();
//pagination
const sizePage=4;
const noPages=Math.ceil(products.length/sizePage);
var curPage=1;
if(req.query.page)curPage=parseInt(req.query.page);///products?page=xxx
const offset=(curPage-1)*sizePage;
products=products.slice(offset,offset+sizePage);
//return
const result={products:products,noPages:noPages,curPage:curPage};
res.json(result);
});
router.post('/products',JwtUtil.checkToken,async function(req,res){
const name=req.body.name;
const price=req.body.price;
const cid=req.body.category;
const image=req.body.image;
const now=Date.now();
const category=await CategoryDAO.selectByID(cid);
if(!category){
return res.status(400).json({error:'Category not found'});
}
const product={name,price,image,cdate:now,category};
const result=await ProductDAO.insert(product);
res.json(result);
});
router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime();

  const category = await CategoryDAO.selectByID(cid);

  const product = {
    _id: _id,
    name: name,
    price: price,
    image: image,
    cdate: now,
    category: category
  };

  const result = await ProductDAO.update(product);
  res.json(result);
});
router.delete('/products/:id', JwtUtil . checkToken , async function ( req , res ) {
 const _id = req . params . id ;
 const result = await ProductDAO.delete( _id) ;
 res . json ( result ) ;
 }) ;

module.exports = router;