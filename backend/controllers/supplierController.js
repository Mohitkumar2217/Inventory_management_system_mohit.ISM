import Supplier from "../models/Supplier.js";

export const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().sort({ createdAt: -1 });

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
            suppliers, // List for the table
            summary: {
                totalPartners,
                verifiedPartners,
                activePartners,
                pendingVerification,
                totalSkuVolume,
                verifiedRate,
                activeRate,
                pendingRate,
                growth: "+12.5%" // This could be calculated by comparing with last month's data
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching supplier analytics" });
    }
};

// Create or Update Supplier logic
export const addSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const updated = await Supplier.findByIdAndUpdate(id, req.body, { new: true });
            return res.status(200).json({ success: true, message: "Partner profile updated", supplier: updated });
        }
        const newSupplier = new Supplier(req.body);
        await newSupplier.save();
        res.status(201).json({ success: true, message: "New partner registered successfully" });
    } catch (error) {
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