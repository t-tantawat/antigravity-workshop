import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'Food',
    });
    const [loading, setLoading] = useState(false);

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
            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setFormData({ description: '', amount: '', category: 'Food' });
                fetchExpenses();
            }
        } catch (error) {
            console.error('Error creating expense:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    return (
        <div className="dashboard">
            <header className="page-header">
                <h1>แดชบอร์ด</h1>
                <p className="subtitle">จัดการรายรับรายจ่ายของคุณ</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">ยอดรวมทั้งหมด</div>
                    <div className="stat-value">฿{totalExpenses.toFixed(2)}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">จำนวนรายการ</div>
                    <div className="stat-value">{expenses.length}</div>
                </div>
            </div>

            <div className="card">
                <h3 className="card-title">เพิ่มรายจ่ายใหม่</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="description">รายละเอียด</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="เช่น ค่าอาหารกลางวัน"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">จำนวนเงิน (บาท)</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">หมวดหมู่</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="Food">อาหาร</option>
                            <option value="Transport">ค่าเดินทาง</option>
                            <option value="Utilities">ค่าสาธารณูปโภค</option>
                            <option value="Entertainment">ความบันเทิง</option>
                            <option value="Other">อื่นๆ</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        <Plus size={20} />
                        {loading ? 'กำลังบันทึก...' : 'เพิ่มรายจ่าย'}
                    </button>
                </form>
            </div>

            <div className="card">
                <h3 className="card-title">รายการล่าสุด</h3>
                <div className="expense-list">
                    {expenses.length === 0 ? (
                        <div className="empty-state">ยังไม่มีรายการ</div>
                    ) : (
                        expenses.slice(0, 5).map((expense) => (
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

export default Dashboard;
