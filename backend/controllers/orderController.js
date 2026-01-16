import Category from "../models/Category.js";
import Order from "../models/Order.js";  
import Warehouse from "../models/Warehouse.js";

// --- 1. HISTORICAL TREND ANALYSIS ---
export const getOrderTrends = async (req, res) => {
    try {
        const { type } = req.query;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        let groupCalculation;

        switch (type) {
            case "Total Revenue":
                // Use the totalOrderValue field calculated by our Mongoose middleware
                groupCalculation = {
                    $cond: [
                        { $eq: ["$status", "Completed"] },
                        "$totalOrderValue",
                        0
                    ]
                };
                break;

            case "Backorder Volume":
            case "Pending Orders":
                groupCalculation = { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] };
                break;

            case "Completed Orders":
                groupCalculation = { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] };
                break;

            case "Cancelled Orders":
                groupCalculation = { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] };
                break;

            case "Average Fulfillment":
                groupCalculation = {
                    $cond: [{ $eq: ["$status", "Completed"] },
                    {
                        $divide: [
                            { $subtract: ["$updatedAt", "$createdAt"] },
                            1000 * 60 * 60 // ms to hours
                        ]
                    },
                        0
                    ]
                };
                break;

            default:
                groupCalculation = 1;
                break;
        }

        const trends = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dayOfWeek: "$createdAt" },
                    val: { $sum: groupCalculation }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const chartData = trends.map(item => ({
            name: dayNames[item._id - 1],
            val: Number(item.val.toFixed(type === "Average Fulfillment" ? 1 : 0))
        }));

        res.status(200).json({ success: true, chartData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Trend analysis failed" });
    }
};

// --- 2. GET ALL ORDERS & REAL-TIME SUMMARY ---
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        const categories = await Category.find(); 
        const warehouses = await Warehouse.find();

        // --- ENHANCED ANALYTICS ---
        const totalOrders = orders.length;
        const completedOrders = orders.filter(o => o.status === "Completed");

        const totalRevenue = completedOrders.reduce((sum, o) => {
            // If you have the virtual/calculated field in DB, use it:
            return sum + (o.totalOrderValue || (o.quantity * o.unitPrice));
        }, 0);

        const pendingCount = orders.filter(o => o.status === "Pending").length;
        const cancelledCount = orders.filter(o => o.status === "Cancelled").length;
        const urgentCount = orders.filter(o => o.priority === "urgent" || o.priority === "critical").length;

        // Fulfillment Calculation
        let avgFulfillment = "0";
        if (completedOrders.length > 0) {
            const totalDuration = completedOrders.reduce((sum, order) => {
                return sum + (new Date(order.updatedAt) - new Date(order.createdAt));
            }, 0);
            avgFulfillment = (totalDuration / completedOrders.length / (1000 * 60 * 60)).toFixed(1);
        }

        const accuracyRate = (completedOrders.length + cancelledCount) > 0
            ? ((completedOrders.length / (completedOrders.length + cancelledCount)) * 100).toFixed(1)
            : 0;

        const notices = [];
        if (urgentCount > 0) {
            notices.push({ id: 1, text: `${urgentCount} High-Priority orders require attention.`, type: "urgent" });
        }
        if (pendingCount > 5) {
            notices.push({ id: 2, text: `Heavy backlog: ${pendingCount} orders pending.`, type: "alert" });
        }

        res.status(200).json({
            success: true,
            orders,
            summary: {
                totalRevenue: totalRevenue,
                totalProducts: totalOrders,
                avgFulfillment: `${avgFulfillment}h`,
                accuracyRate: `${accuracyRate}%`,
                backorderCount: pendingCount,
                cancelledCount: cancelledCount,
                urgentCount: urgentCount,
            },
            availableCategories: categories.map(c => c.name),
            availableWarehouses: warehouses.map(w => w.warehouseName),
            availableZones: [...new Set(warehouses .map(w => w.zone))],
            availableSuppliers: [...new Set(orders.map(o => o.venderName))],
            notices
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching order analytics" });
    }
};

// --- 3. CRUD OPERATIONS ---
export const syncOrder = async (req, res) => {
    try {
        const { id } = req.params;

        if (id) {
            // Update logic: ensures middleware runs to recalculate totals
            const updatedOrder = await Order.findById(id);
            if (!updatedOrder) return res.status(404).json({ success: false, message: "Not found" });

            Object.assign(updatedOrder, req.body);
            await updatedOrder.save();

            return res.status(200).json({ success: true, message: "Order updated", order: updatedOrder });
        }

        // Create logic
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ success: true, message: "Order created successfully", order: newOrder });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        // findById and save() is used instead of findByIdAndUpdate to trigger Mongoose timestamps/middleware if needed
        const order = await Order.findById(id);
        order.status = status;
        await order.save();

        res.status(200).json({ success: true, message: `Order status set to ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: "Status update failed" });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Order deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete failed" });
    }
};