import { LayoutDashboard, History, Settings, Wallet } from 'lucide-react';

function Sidebar({ activeView, setActiveView }) {
    const menuItems = [
        { id: 'dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
        { id: 'history', label: 'ประวัติ', icon: History },
        { id: 'settings', label: 'ตั้งค่า', icon: Settings },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Wallet size={32} className="logo-icon" />
                <h2>Expense Tracker</h2>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                            onClick={() => setActiveView(item.id)}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}

export default Sidebar;
