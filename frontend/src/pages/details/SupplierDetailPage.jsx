import React from "react";
import {
    ArrowLeft, Globe, MapPin, ShieldCheck, Truck, Landmark, BarChart3,
    History, FileText, CheckCircle2, User, Package, ChevronRight, ExternalLink
} from "lucide-react";

export default function SupplierDetailPage({ selectedVendor, onBack }) {
    // --- HELPERS ---
    const BASE_URL = `${import.meta.env.VITE_API_URL}`;

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(val || 0);

    // --- FILE VIEWING ACTIVATION ---
    const openFile = (path) => {
        if (!path) return;
        const fullUrl = path.startsWith('http') ? path : `${BASE_URL}${path}`;
        window.open(fullUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="max-w-7xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-700 pb-20 mt-10">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-xs uppercase tracking-widest mb-8 group transition-all"
            >
                <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:bg-slate-100 transition-all">
                    <ArrowLeft size={18} />
                </div>
                Back to Network
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Identity & Metrics */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50 flex flex-col items-center text-center">
                        <div
                            onClick={() => selectedVendor.photo && openFile(selectedVendor.photo)}
                            className="w-40 h-40 bg-green-50 rounded-[3rem] flex items-center justify-center text-7xl font-black text-green-600 border border-green-100 shadow-xl overflow-hidden mb-6 cursor-pointer hover:opacity-80 transition-all"
                        >
                            {selectedVendor.photo ? (
                                <img src={`${BASE_URL}${selectedVendor.photo}`} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                selectedVendor.name?.charAt(0)
                            )}
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tighter mb-2">{selectedVendor.name}</h1>
                        <span className="bg-slate-100 text-slate-500 px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest mb-4">
                            {selectedVendor.hierarchy || 'Level 1'} Partner
                        </span>
                        <div className="flex gap-2">
                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase border ${selectedVendor.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                {selectedVendor.status}
                            </span>
                            <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase border border-blue-100">
                                {selectedVendor.verificationStatus || selectedVendor.verification || 'Pending'}
                            </span>
                        </div>
                    </div>

                    {/* --- ADDED: ID CARD SECTION --- */}
                    <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-slate-400">
                            <User size={16} className="text-indigo-500" /> Identity Verification
                        </h3>
                        <div
                            onClick={() => selectedVendor.idCard && openFile(selectedVendor.idCard)}
                            className={`p-5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${selectedVendor.idCard ? 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100 cursor-pointer' : 'bg-slate-50 border-slate-100 opacity-50'}`}
                        >
                            <FileText size={24} className={selectedVendor.idCard ? 'text-indigo-500' : 'text-slate-300'} />
                            <p className="text-[10px] font-black uppercase text-slate-500">
                                {selectedVendor.idCard ? 'View Partner ID Card' : 'ID Card Not Provided'}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-slate-400">
                            <BarChart3 size={16} className="text-green-500" /> Performance Metrics
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <MetricCard label="Delivery %" val={`${selectedVendor.performance?.deliveryPercentage || 100}%`} />
                            <MetricCard label="Accuracy" val={`${selectedVendor.performance?.deliveryAccuracy || 100}%`} />
                            <MetricCard label="Active Days" val={selectedVendor.performance?.daysActive || 0} />
                            <MetricCard label="Total Orders" val={selectedVendor.performance?.totalOrdersCompleted || 0} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Deep Details */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Goods & Geo */}
                    <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <section>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-slate-400">
                                    <Package size={16} className="text-indigo-500" /> Goods Catalog
                                </h3>
                                <div className="max-h-[250px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                    {selectedVendor.itemsDetails?.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{item.itemName || 'Unnamed Item'}</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase">{item.category || 'General'}</p>
                                            </div>
                                            <p className="font-black text-indigo-600 text-sm">{formatCurrency(item.unitPrice)}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-slate-400">
                                    <MapPin size={16} className="text-rose-500" /> Logistics Hub
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Registered Address</p>
                                        <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                            {selectedVendor.address || 'No Address Provided'}
                                        </p>
                                    </div>
                                    {/* <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-3">Linked Warehouses</p>
                                        <div className="space-y-2">
                                            {selectedVendor.connectedWarehouses?.map((wh, idx) => (
                                                <div key={idx} className="flex items-center justify-between text-xs font-bold text-slate-600 bg-white p-2 rounded-lg border border-slate-50">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2 size={12} className="text-green-500" />
                                                        {wh.warehouseName || 'General Hub'}
                                                    </div>
                                                    <span className="text-indigo-500 font-black">{wh.itemCountSupplied || 0} U</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div> */}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Finance & Compliance Activated */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-slate-400">
                                <ShieldCheck size={16} className="text-blue-500" /> Verification Docs
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { key: 'licence', label: 'Licence' },
                                    { key: 'contract', label: 'Contract' },
                                    { key: 'idProof', label: 'ID Proof' },
                                    { key: 'addressProof', label: 'Address Proof' }
                                ].map((doc) => {
                                    const filePath = selectedVendor.documents?.[doc.key];
                                    const hasFile = !!filePath;
                                    return (
                                        <div
                                            key={doc.key}
                                            onClick={() => hasFile && openFile(filePath)}
                                            className={`flex flex-col p-4 rounded-2xl border transition-all cursor-pointer group ${hasFile ? 'bg-emerald-50 border-emerald-100 hover:border-emerald-300' : 'bg-slate-50 border-slate-100'}`}
                                        >
                                            <FileText size={18} className={hasFile ? 'text-emerald-500' : 'text-slate-300'} />
                                            <p className="text-[9px] font-black uppercase text-slate-500 mt-2">{doc.label}</p>
                                            <p className={`text-[8px] font-bold mt-1 ${hasFile ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                {hasFile ? 'View Digital Copy' : 'Missing File'}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-slate-400">
                                <Landmark size={16} className="text-amber-500" /> Treasury Setup
                            </h3>
                            <div className="space-y-4">
                                <TreasuryRow label="Bank" val={selectedVendor.bankDetails?.bankName} />
                                <TreasuryRow label="A/C Number" val={selectedVendor.bankDetails?.accountNumber} isMono />
                                <TreasuryRow label="IFSC Code" val={selectedVendor.bankDetails?.ifscCode} isMono />

                                {/* --- ADDED: BANK PASSBOOK SECTION --- */}
                                {selectedVendor.bankDetails?.bankPassbookProof && (
                                    <div
                                        onClick={() => openFile(selectedVendor.bankDetails.bankPassbookProof)}
                                        className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between cursor-pointer hover:bg-emerald-100 transition-all"
                                    >
                                        <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">View Passbook Proof</span>
                                        <ExternalLink size={14} className="text-emerald-500" />
                                    </div>
                                )}
                                <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Payout Ready</span>
                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white relative overflow-hidden">
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                            <section>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-slate-500">
                                    <History size={16} className="text-cyan-400" /> Audit Log
                                </h3>
                                <div className="space-y-5">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Last Transit Event</p>
                                            <p className="text-sm font-bold text-white mt-1">
                                                {selectedVendor.history?.lastDelivery?.date
                                                    ? new Date(selectedVendor.history.lastDelivery.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })
                                                    : 'Never Active'}
                                            </p>
                                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-tighter block mt-1 underline decoration-cyan-400/30">
                                                Order Status: {selectedVendor.history?.lastDelivery?.status || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-white/5">
                                        <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Payment Pipeline</p>
                                        <div className="space-y-2">
                                            {selectedVendor.history?.paymentHistory?.slice(0, 3).map((pay, i) => (
                                                <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <span className="text-[9px] font-mono text-slate-400 uppercase">
                                                        TXN_{pay.transactionId?.slice(-6) || 'UNK'}
                                                    </span>
                                                    <span className="text-xs font-black text-cyan-400">{formatCurrency(pay.amount)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-slate-500">
                                    <User size={16} className="text-indigo-400" /> Network Insights
                                </h3>
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 italic text-slate-300 text-sm leading-relaxed mb-6">
                                    "{selectedVendor.details || selectedVendor.description?.additionalNotes || 'Enterprise data profile synchronized correctly. No specific strategic notes registered for this partner.'}"
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="px-5 py-3 bg-indigo-500/20 border border-indigo-500/40 rounded-2xl flex flex-col">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Global Ranking</span>
                                        <span className="text-2xl font-black text-white"># {selectedVendor.description?.ranking || '0'}</span>
                                    </div>
                                    <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Feedback Rating</span>
                                        <div className="flex gap-1 text-amber-400 mt-1">★ ★ ★ ★ ☆</div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <Globe className="absolute -right-20 -bottom-20 text-white/5 rotate-12" size={300} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SHARED UI HELPERS ---
function MetricCard({ label, val }) {
    return (
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-xl font-black text-slate-800 mt-1">{val}</p>
        </div>
    );
}

function TreasuryRow({ label, val, isMono }) {
    return (
        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
            <span className={`text-xs font-bold text-slate-700 ${isMono ? 'font-mono' : ''}`}>{val || "N/A"}</span>
        </div>
    );
}