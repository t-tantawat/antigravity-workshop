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
                <h3 className="card-title">{editingId ? 'แก้ไขรายจ่าย' : 'เพิ่มรายจ่ายใหม่'}</h3>
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

                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
                            {loading ? 'กำลังบันทึก...' : (editingId ? 'บันทึกการแก้ไข' : 'เพิ่มรายจ่าย')}
                        </button>
                        {editingId && (
                            <button type="button" className="btn-secondary" onClick={handleCancelEdit} disabled={loading}>
                                <X size={20} />
                                ยกเลิก
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="card">
                <h3 className="card-title">รายการล่าสุด</h3>
                <div className="expense-list">
                    {loading && !editingId ? (
                        <Loading />
                    ) : expenses.length === 0 ? (
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
                                <div className="expense-actions">
                                    <span className="expense-amount">฿{parseFloat(expense.amount).toFixed(2)}</span>
                                    <div className="action-buttons">
                                        <button onClick={() => handleEdit(expense)} className="btn-icon edit" title="แก้ไข">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(expense.id)} className="btn-icon delete" title="ลบ">
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
