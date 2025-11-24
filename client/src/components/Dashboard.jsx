import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import Loading from './Loading';

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'Food',
    });
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await fetch('/api/expenses');
            if (!response.ok) {
                throw new Error('Failed to fetch expenses');
            }
            const data = await response.json();
            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = editingId ? `/api/expenses/${editingId}` : '/api/expenses';
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setFormData({ description: '', amount: '', category: 'Food' });
                setEditingId(null);
                fetchExpenses();
            }
        } catch (error) {
            console.error('Error saving expense:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (expense) => {
        setFormData({
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
        });
        setEditingId(expense.id);
    };

    const handleCancelEdit = () => {
        setFormData({ description: '', amount: '', category: 'Food' });
        setEditingId(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) return;

        try {
            const response = await fetch(`/api/expenses/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchExpenses();
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-br from-slate-100 to-slate-400 bg-clip-text text-transparent">แดชบอร์ด</h1>
                <p className="text-slate-400 text-[15px]">จัดการรายรับรายจ่ายของคุณ</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20">
                    <div className="text-sm text-slate-400 mb-2">ยอดรวมทั้งหมด</div>
                    <div className="text-3xl font-bold bg-gradient-to-br from-indigo-500 to-violet-500 bg-clip-text text-transparent">฿{totalExpenses.toFixed(2)}</div>
                </div>
                <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20">
                    <div className="text-sm text-slate-400 mb-2">จำนวนรายการ</div>
                    <div className="text-3xl font-bold bg-gradient-to-br from-indigo-500 to-violet-500 bg-clip-text text-transparent">{expenses.length}</div>
                </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-8 mb-8 shadow-lg shadow-black/5">
                <h3 className="text-xl font-semibold mb-6 text-slate-100">{editingId ? 'แก้ไขรายจ่าย' : 'เพิ่มรายจ่ายใหม่'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="description" className="block text-sm font-medium text-slate-400 mb-2">รายละเอียด</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="เช่น ค่าอาหารกลางวัน"
                            required
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-slate-100 text-[15px] transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-600"
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="amount" className="block text-sm font-medium text-slate-400 mb-2">จำนวนเงิน (บาท)</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            required
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-slate-100 text-[15px] transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-600"
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="category" className="block text-sm font-medium text-slate-400 mb-2">หมวดหมู่</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-slate-100 text-[15px] transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        >
                            <option value="Food">อาหาร</option>
                            <option value="Transport">ค่าเดินทาง</option>
                            <option value="Utilities">ค่าสาธารณูปโภค</option>
                            <option value="Entertainment">ความบันเทิง</option>
                            <option value="Other">อื่นๆ</option>
                        </select>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button
                            type="submit"
                            className="flex items-center justify-center gap-2 w-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white border-none rounded-xl px-6 py-3.5 text-[15px] font-semibold cursor-pointer transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 hover:shadow-indigo-500/40 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={loading}
                        >
                            {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
                            {loading ? 'กำลังบันทึก...' : (editingId ? 'บันทึกการแก้ไข' : 'เพิ่มรายจ่าย')}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 bg-slate-700 text-white border-none rounded-xl px-6 py-3.5 text-[15px] font-medium cursor-pointer transition-all duration-200 hover:bg-slate-600"
                                onClick={handleCancelEdit}
                                disabled={loading}
                            >
                                <X size={20} />
                                ยกเลิก
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-8 mb-8 shadow-lg shadow-black/5">
                <h3 className="text-xl font-semibold mb-6 text-slate-100">รายการล่าสุด</h3>
                <div className="flex flex-col gap-4">
                    {loading && !editingId ? (
                        <Loading />
                    ) : expenses.length === 0 ? (
                        <div className="text-center text-slate-500 py-12 italic">ยังไม่มีรายการ</div>
                    ) : (
                        expenses.slice(0, 5).map((expense) => (
                            <div key={expense.id} className="flex justify-between items-center p-5 bg-slate-900/30 border border-slate-700/30 rounded-xl transition-all duration-200 hover:translate-x-1 hover:bg-slate-900/50 hover:border-indigo-500/30 group">
                                <div className="flex flex-col gap-1.5">
                                    <span className="font-semibold text-[15px] text-slate-100">{expense.description}</span>
                                    <div className="flex items-center gap-2 text-[13px] text-slate-400">
                                        <span>{expense.category}</span>
                                        <span>•</span>
                                        <span>{new Date(expense.createdAt).toLocaleDateString('th-TH')}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-lg bg-gradient-to-br from-indigo-500 to-violet-500 bg-clip-text text-transparent">฿{parseFloat(expense.amount).toFixed(2)}</span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={() => handleEdit(expense)}
                                            className="p-2 bg-transparent border border-slate-700/50 text-slate-400 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-indigo-500/10 hover:text-indigo-500 hover:border-indigo-500/20"
                                            title="แก้ไข"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(expense.id)}
                                            className="p-2 bg-transparent border border-slate-700/50 text-slate-400 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                                            title="ลบ"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
