import React from 'react';

export const StaffReports = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Personal Performance Reports</h1>
    <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-slate-800">No reports generated yet</h3>
      <p className="text-slate-400 text-sm max-w-xs mx-auto">Reports are automatically compiled at the end of each month based on your logged tasks.</p>
    </div>
  </div>
);

export const StaffSettings = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Settings</h1>
    <div className="bg-white rounded-[2.5rem] border border-slate-100 divide-y divide-slate-50">
      <div className="p-8 flex items-center justify-between">
        <div>
          <p className="font-bold text-slate-800">Email Notifications</p>
          <p className="text-slate-400 text-xs font-medium">Receive task updates via email</p>
        </div>
        <div className="w-12 h-6 bg-blue-600 rounded-full relative p-1 cursor-pointer">
          <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
        </div>
      </div>
      <div className="p-8 flex items-center justify-between">
        <div>
          <p className="font-bold text-slate-800">Dark Mode</p>
          <p className="text-slate-400 text-xs font-medium">Switch between light and dark themes</p>
        </div>
        <div className="w-12 h-6 bg-slate-200 rounded-full relative p-1 cursor-pointer">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
);