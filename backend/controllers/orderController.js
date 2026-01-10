import Order from "../models/Order.js"; 

// --- 1. HISTORICAL TREND ANALYSIS (For Analysis Modals) ---
export const getOrderTrends = async (req, res) => {
    try {
        const { type } = req.query; // Matches item.label from frontend
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        let groupCalculation;

        // SELECT LOGIC BASED ON CARD CLICKED
        switch (type) {
            case "Total Revenue":
                // Sums (Quantity * Price) only for Completed orders
                groupCalculation = { 
                    $cond: [
                        { $eq: ["$status", "Completed"] }, 
                        { $multiply: ["$quantity", "$unitPrice"] }, 
                        0
                    ] 
                };
                break;
            
            case "Backorder Volume":
            case "Pending Orders":
                // Counts only Pending orders
                groupCalculation = { 
                    $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] 
                };
                break;
            
            case "Completed Orders":
            case "Order Accuracy":
                // Counts only Completed orders
                groupCalculation = { 
                    $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] 
                };
                break;
            
            case "Cancelled Orders":
                // Counts only Cancelled orders
                groupCalculation = { 
                    $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] 
                };
                break;
            
            case "Average Fulfillment":
                // Calculates Fulfillment hours per day
                groupCalculation = {
                    $cond: [{ $eq: ["$status", "Completed"] },
                        {
                            $divide: [
                                { $subtract: ["$updatedAt", "$createdAt"] },
                                1000 * 60 * 60 // Convert ms to hours
                            ]
                        },
                        0
                    ]
                };
                break;
            
            default:
                // Default: Count all orders placed
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
        res.status(500).json({ success: false, message: "Order trend analysis failed" });
    }
};

// --- 2. GET ALL ORDERS & REAL-TIME SUMMARY ---
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });

        // --- ANALYTICS LOGIC ---
        const totalOrders = orders.length;
        const completedOrdersArray = orders.filter(o => o.status === "Completed");
        const completedCount = completedOrdersArray.length;
        const pendingCount = orders.filter(o => o.status === "Pending").length;
        const cancelledCount = orders.filter(o => o.status === "Cancelled").length;

        // Revenue Calculation
        const totalRevenue = completedOrdersArray.reduce((sum, o) => sum + (o.quantity * o.unitPrice), 0);

        // Average Fulfillment Calculation (Literal Time Difference)
        let avgFulfillment = "0"; 
        if (completedCount > 0) {
            const totalDuration = completedOrdersArray.reduce((sum, order) => {
                const start = new Date(order.createdAt);
                const end = new Date(order.updatedAt); 
                return sum + (end - start);
            }, 0);

            // Convert milliseconds to hours
            avgFulfillment = (totalDuration / completedCount / (1000 * 60 * 60)).toFixed(1);
        }

        // Accuracy Rate: (Completed / (Completed + Cancelled))
        const accuracyRate = (completedCount + cancelledCount) > 0 
            ? ((completedCount / (completedCount + cancelledCount)) * 100).toFixed(1) 
            : 0;

        const notices = [];
        if (pendingCount > 0) {
            notices.push({ id: 1, text: `${pendingCount} Orders are pending fulfillment.`, type: "urgent" });
        }
        if (cancelledCount > 0) {
            notices.push({ id: 2, text: `${cancelledCount} Orders have been cancelled recently.`, type: "alert" });
        }
        
        res.status(200).json({
            success: true,
            orders, 
            summary: {
                totalRevenue,
                totalProducts: totalOrders, 
                totalStock: pendingCount, // Used for "Total Stock" label
                avgFulfillment: `${avgFulfillment}h`, 
                accuracyRate: `${accuracyRate}%`,
                backorderCount: pendingCount,
                cancelledCount: cancelledCount
            },
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

export const deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Order deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete failed" });
    }
};