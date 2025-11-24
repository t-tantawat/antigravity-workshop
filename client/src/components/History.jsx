import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import Loading from './Loading';

function History() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/expenses');
            if (!response.ok) {
                throw new Error('Failed to fetch expenses');
            }
            const data = await response.json();
            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
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

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-br from-slate-100 to-slate-400 bg-clip-text text-transparent">ประวัติรายจ่าย</h1>
                <p className="text-slate-400 text-[15px]">ดูรายการทั้งหมดของคุณ</p>
            </header>

            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-8 mb-8 shadow-lg shadow-black/5">
                <div className="flex flex-col gap-4">
                    {loading ? (
                        <Loading />
                    ) : expenses.length === 0 ? (
                        <div className="text-center text-slate-500 py-12 italic">ยังไม่มีรายการ</div>
                    ) : (
                        expenses.map((expense) => (
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
                                    <button
                                        onClick={() => handleDelete(expense.id)}
                                        className="p-2 bg-transparent border border-slate-700/50 text-slate-400 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 opacity-0 group-hover:opacity-100"
                                        title="ลบ"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default History;
