import Supplier from "../models/Supplier.js";
import Category from "../models/Category.js";
import Warehouse from "../models/Warehouse.js";

// get supplier information from back
export const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().sort({ createdAt: -1 });
        const categories = await Category.find().sort({ createdAt: -1 });
        const warehouses = await Warehouse.find().sort({ createdAt: -1 });
        // --- ANALYTICS LOGIC ---
        const totalPartners = suppliers.length;
        const verifiedPartners = suppliers.filter(v => v.verification === "Verified").length;
        const activePartners = suppliers.filter(v => v.status === "Active").length;
        const pendingVerification = suppliers.filter(v => v.verification === "Pending").length;
        const totalSkuVolume = suppliers.reduce((sum, v) => sum + (v.suppliesQuantity || 0), 0);
        // Calculate Percentages for Progress Bars
        const verifiedRate = totalPartners > 0 ? (verifiedPartners / totalPartners) * 100 : 0;
        const activeRate = totalPartners > 0 ? (activePartners / totalPartners) * 100 : 0;
        const pendingRate = totalPartners > 0 ? (pendingVerification / totalPartners) * 100 : 0;
        res.status(200).json({
            success: true,
            suppliers, 
            summary: {
                totalPartners,
                verifiedPartners,
                activePartners,
                pendingVerification,
                totalSkuVolume,
                verifiedRate,
                activeRate,
                pendingRate,
                growth: "+12.5%"
            },
            availableCategories: categories.map(c => c.name),
            availableWarehouses: warehouses,  
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching supplier analytics" });
    }
};


// Create or Update Supplier logic
export const addSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        let supplierData = { ...req.body };

        // 1. Parse JSON strings back into Objects/Arrays
        // FormData sends everything as a string, so we must parse nested structures
        const complexFields = ['itemsDetails', 'connectedWarehouses', 'bankDetails', 'description', 'performance'];
        complexFields.forEach(field => {
            if (req.body[field] && typeof req.body[field] === 'string') {
                try {
                    supplierData[field] = JSON.parse(req.body[field]);
                } catch (e) {
                    console.error(`Error parsing ${field}:`, e);
                }
            }
        });

        // 2. Map Uploaded Files to the Data Object
        if (req.files) {
            if (req.files['photo']) supplierData.photo = `/uploads/${req.files['photo'][0].filename}`;
            if (req.files['idCard']) supplierData.idCard = `/uploads/${req.files['idCard'][0].filename}`;

            // Handle nested documents object
            if (!supplierData.documents) supplierData.documents = {};
            const docTypes = ['licence', 'contract', 'idProof', 'addressProof'];
            docTypes.forEach(type => {
                if (req.files[`documents.${type}`]) {
                    supplierData.documents[type] = `/uploads/${req.files[`documents.${type}`][0].filename}`;
                }
            });

            // Handle Bank Proof
            if (req.files['bankDetails.bankPassbookProof']) {
                if (!supplierData.bankDetails) supplierData.bankDetails = {};
                supplierData.bankDetails.bankPassbookProof = `/uploads/${req.files['bankDetails.bankPassbookProof'][0].filename}`;
            }
        }

        // 3. Database Operation (Update or Create)
        if (id && id !== "null") {
            const updated = await Supplier.findByIdAndUpdate(id, supplierData, { new: true });
            return res.status(200).json({ success: true, message: "Partner profile updated", supplier: updated });
        } else {
            const newSupplier = new Supplier(supplierData);
            await newSupplier.save();
            res.status(201).json({ success: true, message: "New partner registered successfully", supplier: newSupplier });
        }
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete Supplier
export const deleteSupplier = async (req, res) => {
    try {
        await Supplier.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Partner removed from network" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Protocol failed" });
    }
};