import React from 'react';

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-slate-500">
            <div className="w-10 h-10 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p>กำลังโหลดข้อมูล...</p>
        </div>
    );
};

export default Loading;
