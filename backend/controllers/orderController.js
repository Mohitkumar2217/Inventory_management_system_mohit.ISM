import Category from "../models/Category.js";
import Order from "../models/Order.js";  
import Warehouse from "../models/Warehouse.js";
import Supplier from "../models/Supplier.js"; 

// HISTORICAL TREND ANALYSIS
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

// GET ALL ORDERS & REAL-TIME SUMMARY
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        const suppliers = await Supplier.find({});
        const categories = await Category.find(); 
        const warehouses = await Warehouse.find();
 
        const totalOrders = orders.length;
        const completedOrders = orders.filter(o => o.status === "Completed");

        const totalRevenue = completedOrders.reduce((sum, o) => { 
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
            availableSuppliers: [...new Set(suppliers.map(o => o.name))],
            notices, 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching order analytics" });
    }
};

// CRUD OPERATIONS 
export const syncOrder = async (req, res) => {
    try {
        const { id } = req.params;

        if (id) { 
            const updatedOrder = await Order.findById(id);
            if (!updatedOrder) return res.status(404).json({ success: false, message: "Not found" });

            Object.assign(updatedOrder, req.body);
            await updatedOrder.save();

            return res.status(200).json({ success: true, message: "Order updated", order: updatedOrder });
        } 
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

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        // Update the current status
        order.status = status;

        // --- TRACKING LOGIC: Update specific timestamps based on status ---
        if (!order.timeline) order.timeline = {}; // Initialize if missing

        switch (status) {
            case "Processing":
                order.timeline.processedAt = new Date();
                break;
            case "Shipped":
                order.timeline.shippedAt = new Date();
                break;
            case "Delivered":
                order.timeline.deliveredAt = new Date();
                order.actualDeliveryDate = new Date(); // Mark the final delivery date
                break;
            case "Cancelled":
                // Logic for cancellation if needed
                break;
            default:
                break;
        }

        await order.save();
        
        res.status(200).json({ 
            success: true, 
            message: `Order status updated to ${status}`,
            order 
        });
    } catch (error) {
        console.error("Status Update Error:", error);
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