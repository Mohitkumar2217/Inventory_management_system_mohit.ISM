import React from 'react';
import { FaUserEdit, FaEnvelope, FaIdBadge, FaMapMarkerAlt } from 'react-icons/fa';

const MyAccount = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="relative h-48 bg-blue-600 rounded-[2.5rem] overflow-hidden shadow-xl shadow-blue-900/20">
        <div className="absolute -bottom-1 -right-1 opacity-20 text-white text-9xl font-black italic">STAFF</div>
      </div>
      
      <div className="px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-32 h-32 rounded-[2rem] bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center text-4xl font-black text-blue-600">
              JD
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-slate-800">John Doe</h1>
              <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">Senior Staff Member</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm"><FaEnvelope /> john.doe@inventoryms.com</div>
                <div className="flex items-center gap-2 text-slate-500 text-sm"><FaIdBadge /> ID: #ST-9920</div>
              </div>
            </div>
            <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2">
              <FaUserEdit /> Edit Profile
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 border-t border-slate-50 pt-12">
            <div>
              <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Personal Details</h3>
              <ul className="space-y-4">
                <li className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500 text-sm">Full Name</span>
                  <span className="text-slate-800 font-bold text-sm">John Alexander Doe</span>
                </li>
                <li className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500 text-sm">Address</span>
                  <span className="text-slate-800 font-bold text-sm">123 Street, New York</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Work Information</h3>
              <ul className="space-y-4">
                <li className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500 text-sm">Date Joined</span>
                  <span className="text-slate-800 font-bold text-sm">Jan 12, 2024</span>
                </li>
                <li className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500 text-sm">Current Shift</span>
                  <span className="text-slate-800 font-bold text-sm">Morning (08AM - 04PM)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;