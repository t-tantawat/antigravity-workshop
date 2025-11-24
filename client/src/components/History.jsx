import { useState, useEffect } from 'react';

function History() {
    const [expenses, setExpenses] = useState([]);

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

    return (
        <div className="history">
            <header className="page-header">
                <h1>ประวัติรายจ่าย</h1>
                <p className="subtitle">ดูรายการทั้งหมดของคุณ</p>
            </header>

            <div className="card">
                <div className="expense-list">
                    {expenses.length === 0 ? (
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
                                <span className="expense-amount">฿{parseFloat(expense.amount).toFixed(2)}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default History;
