import React from 'react';
import { FaSearch, FaTimes, FaFilter } from "react-icons/fa";
import OutOfStockCard from '../../components/OutStockCard.jsx';
import LowStockCard from '../../components/LowStockCard.jsx';
import SummaryCard from '../../components/Summerys/SummaryCard.jsx';
import SalesChart from '../../components/Charts/SalesChart.jsx';
import TopProducts from '../../components/TopProducts.jsx';
import RevenueChart from '../../components/Charts/RevenueCostChart.jsx';

const DashboardHome = () => {
    const [dashboardData, setDashboardData] = React.useState({
        totalProducts: 563,
        totalStock: 1200,
        totalOrders: 450,
        totalRevenue: 125000,
        outOfStockItems: [
            { name: "Organic Cream", category: { name: "Beauty" }, image: "🧴" },
            { name: "Rain Umbrella", category: { name: "Grocery" }, image: "⛱️" },
            { name: "Serum Bottle", category: { name: "Beauty" }, image: "🧪" },
            { name: "Coffee Beans", category: { name: "Food" }, image: "🫘" },
            { name: "Wireless Mouse", category: { name: "Electronics" }, image: "🖱️" },
            { name: "Smart Watch", category: { name: "Electronics" }, image: "⌚" },
            { name: "Yoga Mat", category: { name: "Home" }, image: "🧘" },
            { name: "Green Tea", category: { name: "Food" }, image: "🍵" },
            { name: "Desk Lamp", category: { name: "Home" }, image: "💡" },
            { name: "Bluetooth Speaker", category: { name: "Electronics" }, image: "🔊" },
            { name: "Face Wash", category: { name: "Beauty" }, image: "🧼" },
            { name: "Running Shoes", category: { name: "Home" }, image: "👟" },
            { name: "Milk Carton", category: { name: "Grocery" }, image: "🥛" },
            { name: "Dark Chocolate", category: { name: "Food" }, image: "🍫" },
            { name: "Headphones", category: { name: "Electronics" }, image: "🎧" },
            { name: "Water Bottle", category: { name: "Grocery" }, image: "🍼" },
            { name: "Hand Sanitizer", category: { name: "Grocery" }, image: "🧴" },
            { name: "Laptop Stand", category: { name: "Electronics" }, image: "💻" },
            { name: "Olive Oil", category: { name: "Food" }, image: "🫒" },
            { name: "Backpack", category: { name: "Home" }, image: "🎒" },
        ],
        lowStockItems: [
            { id: 1, name: "MacBook Pro M3", category: { name: "Electronics" }, stock: 2, imageURL: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop" },
            { id: 2, name: "Cotton Crew Tee", category: { name: "Apparel" }, stock: 5, imageURL: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&h=200&fit=crop" },
            { id: 3, name: "Smart Coffee Maker", category: { name: "Home" }, stock: 3, imageURL: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=200&h=200&fit=crop" },
            { id: 4, name: "Yoga Mat Pro", category: { name: "Fitness" }, stock: 12, imageURL: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=200&h=200&fit=crop" },
            { id: 5, name: "Organic Honey", category: { name: "Grocery" }, stock: 8, imageURL: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop" },
            { id: 6, name: "Sony WH-1000XM5", category: { name: "Electronics" }, stock: 1, imageURL: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" },
            { id: 7, name: "Denim Jacket", category: { name: "Apparel" }, stock: 4, imageURL: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=200&h=200&fit=crop" },
            { id: 8, name: "LED Floor Lamp", category: { name: "Home" }, stock: 6, imageURL: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=200&fit=crop" },
            { id: 9, name: "Adjustable Dumbbells", category: { name: "Fitness" }, stock: 15, imageURL: "https://images.unsplash.com/photo-1583454110551-21f2fa20e32c?w=200&h=200&fit=crop" },
            { id: 10, name: "Cold Brew Pack", category: { name: "Grocery" }, stock: 20, imageURL: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=200&h=200&fit=crop" },
            { id: 11, name: "iPad Air", category: { name: "Electronics" }, stock: 2, imageURL: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop" },
            { id: 12, name: "Running Shoes", category: { name: "Apparel" }, stock: 7, imageURL: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" },
            { id: 13, name: "Ceramic Vase", category: { name: "Home" }, stock: 9, imageURL: "https://images.unsplash.com/photo-1580910051074-3eb6948865c5?w=200&h=200&fit=crop" },
            { id: 14, name: "Resistance Bands", category: { name: "Fitness" }, stock: 3, imageURL: "https://images.unsplash.com/photo-1598289431512-b97b0917a63e?w=200&h=200&fit=crop" },
            { id: 15, name: "Protein Bars", category: { name: "Grocery" }, stock: 25, imageURL: "https://images.unsplash.com/photo-1622484211148-19747c34823e?w=200&h=200&fit=crop" },
        ],
    });

    return (
        <div className="p-4 min-h-screen bg-gray-50">
            <SummaryCard items={dashboardData} />
            <TopProducts />
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-slate-900 tracking-tight ml-4">Inventory Insights</h2>
            </div>
            <div className='m-3 grid grid-cols-1 md:grid-cols-2 gap-4'>
                <OutOfStockCard />
                <LowStockCard />
                <SalesChart />
                <RevenueChart />
            </div>
        </div >
    );
};

export default DashboardHome;