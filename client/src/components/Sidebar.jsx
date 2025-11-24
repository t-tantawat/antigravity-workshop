import { LayoutDashboard, History, Settings, Wallet } from 'lucide-react';

function Sidebar({ activeView, setActiveView }) {
    const menuItems = [
        { id: 'dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
        { id: 'history', label: 'ประวัติ', icon: History },
        { id: 'settings', label: 'ตั้งค่า', icon: Settings },
    ];

    return (
        <aside className="w-20 md:w-[260px] bg-slate-800/40 backdrop-blur-xl border-r border-slate-700/30 flex flex-col py-8 transition-all duration-300">
            <div className="px-0 md:px-6 pb-8 flex items-center justify-center md:justify-start gap-4 border-b border-slate-700/30 mb-8 mx-4 md:mx-0">
                <Wallet size={32} className="text-indigo-500 shrink-0" />
                <h2 className="hidden md:block text-xl font-bold bg-gradient-to-br from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                    Expense Tracker
                </h2>
            </div>

            <nav className="flex flex-col gap-2 px-2 md:px-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                        <button
                            key={item.id}
                            className={`flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/20'
                                    : 'text-slate-400 hover:bg-indigo-500/10 hover:text-slate-100'
                                }`}
                            onClick={() => setActiveView(item.id)}
                            title={item.label}
                        >
                            <Icon size={20} />
                            <span className="hidden md:block">{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}

export default Sidebar;
