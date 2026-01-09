import Product from '../models/Product.js';

const addProduct = async (req, res) => { 
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        return res.status(200).json({success:true, message: 'Product added successfully'});
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const getProducts = async (req, res) => { 
    try {   
        const products = await Product.find();      
        return res.status(200).json({ success: true, message: 'Products fetched successfully', products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const updateProducts = async (req, res) => {   
    try {
        const { id } = req.params;
        const updateData = req.body;    
        Product.findByIdAndUpdate(id, updateData, { new: true }, (err, updatedProduct) => {
            if (err) {
                console.error('Error updating product in DB:', err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            return res.status(200).json({ success: true, message: `Product with id ${id} updated`, updatedProduct });
        }); 
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }               
}

const deleteProducts = async (req, res) => { 
    try {
        const { id } = req.params; 
        Product.findByIdAndDelete(id, (err) => {
            if (err) {
                console.error('Error deleting product from DB:', err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            return res.status(200).json({ success: true, message: `Product with id ${id} deleted` });
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export { addProduct, getProducts, updateProducts, deleteProducts };