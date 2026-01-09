import Order from "../models/Order.js";

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });

        // --- ANALYTICS LOGIC ---
        const totalOrders = orders.length;
        const completedOrders = orders.filter(o => o.status === "Completed").length;
        const pendingOrders = orders.filter(o => o.status === "Pending").length;
        const cancelledOrders = orders.filter(o => o.status === "Cancelled").length;

        // 1. Revenue Calculation (Only from Completed orders)
        const totalRevenue = orders
            .filter(o => o.status === "Completed")
            .reduce((sum, o) => sum + (o.quantity * o.unitPrice), 0);

        // 2. Average Fulfillment Logic (Simulated for this demo)
        // In a real app, you would subtract 'createdAt' from 'updatedAt' for Completed orders
        const avgFulfillment = totalOrders > 0 ? "1.4 Days" : "0 Days";

        // 3. Accuracy Rate: (Completed / (Completed + Cancelled)) * 100
        const accuracyRate = (completedOrders + cancelledOrders) > 0 
            ? ((completedOrders / (completedOrders + cancelledOrders)) * 100).toFixed(1) 
            : 0;

        // 4. Backorder Volume: Count of Pending orders with specific flags or just Pending count
        const backorderCount = pendingOrders;

        res.status(200).json({
            success: true,
            orders, // List for the table
            summary: {
                totalRevenue,
                totalProducts: totalOrders, // Maps to 'Total Orders' in UI
                totalStock: pendingOrders,   // Maps to 'Total Stock' in UI (items awaiting action)
                avgFulfillment,
                accuracyRate: `${accuracyRate}%`,
                backorderCount,
                cancelledCount: cancelledOrders
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching order analytics" });
    }
};
// Create or Update Order
export const syncOrder = async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
            return res.status(200).json({ success: true, message: "Order updated", order: updatedOrder });
        }
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ success: true, message: "Order created successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update Order Status only
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await Order.findByIdAndUpdate(id, { status });
        res.status(200).json({ success: true, message: `Order status set to ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: "Status update failed" });
    }
};

// Delete Order
export const deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Order deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete failed" });
    }
};