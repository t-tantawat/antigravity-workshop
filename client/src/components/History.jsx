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
        <div className="history">
            <header className="page-header">
                <h1>ประวัติรายจ่าย</h1>
                <p className="subtitle">ดูรายการทั้งหมดของคุณ</p>
            </header>

            <div className="card">
                <div className="expense-list">
                    {loading ? (
                        <Loading />
                    ) : expenses.length === 0 ? (
                        <div className="empty-state">ยังไม่มีรายการ</div>
                    ) : (
                        expenses.map((expense) => (
                            <div key={expense.id} className="expense-item">
                                <div className="expense-info">
                                    <span className="expense-desc">{expense.description}</span>
                                    <div className="expense-meta">
                                        <span>{expense.category}</span>
                                        <span>•</span>
                                        <span>{new Date(expense.createdAt).toLocaleDateString('th-TH')}</span>
                                    </div>
                                </div>
                                <div className="expense-actions">
                                    <span className="expense-amount">฿{parseFloat(expense.amount).toFixed(2)}</span>
                                    <button onClick={() => handleDelete(expense.id)} className="btn-icon delete" title="ลบ">
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
