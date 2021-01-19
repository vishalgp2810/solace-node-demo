bodyParser = require('body-parser');
const productSchema = require('../models/product-schema');
var multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'upload/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage });

module.exports = (app, connection) => {
    app.use(bodyParser.json());

    /*Create prodcut API*/
    app.post("/api/product", upload.single('profile'), (req, res) => {
        const postData = {
            product_name: req.body.product_name,
            product_image: req.file.path,
            product_price: req.body.product_price,
            product_rating: req.body.product_rating,
            product_descreption: req.body.product_descreption,
            product_category: req.body.product_category,
            timestamp: new Date()
        };
        const product = new productSchema(postData);
        product.save().then(response => {
            return res.send({ message: 'Product created sucessfully', product: response });
        }).catch(err => {
            return res.status(400).json({ message: 'Error while creating product', error: err });
        });
    });

    /*Get products list API*/
    app.get('/api/product', (req, res) => {
        productSchema.find().then(response => {
            if (!response.length) return res.status(400).json({ message: 'No products founds' });
            return res.send(response);
        }).catch(error => {
            return res.status(400).json({ message: 'Somethin went wrong  while geting produts' });
        });
    });

    /*Get products bu ID API*/
    app.get('/api/product/:id', (req, res) => {
        console.log(req.params.id)
        productSchema.find({ _id: req.params.id }).then(response => {
            if (!response.length) return res.status(400).json({ message: 'No products founds' });
            return res.send(response);
        }).catch(error => {
            return res.status(400).json({ message: 'Something went wrong  while geting produts' });
        });
    });

    /*Product update by ID API*/
    app.put('/api/product/:id', (req, res) => {
        const query = { _id: req.params.id };
        const update = req.body;
        const options = { "upsert": false };
        productSchema.updateOne(query, update, options)
            .then(result => {
                console.log(result)
                return res.send(result);
            }).catch(err => {
                return res.send(err);
            });
    });

    /*Delete product by ID*/
    app.delete('/api/product/:id', (req, res) => {
        productSchema.deleteOne({ _id: req.params.id }).then(deleteRes => {
            res.send({ message: 'Product deleted successfully', deleteRes });
        }).catch(err => {
            return res.status(400).json({ message: 'Error while deleting product', err });
        });
    });
};