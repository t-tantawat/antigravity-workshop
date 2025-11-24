const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// GET /api/expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// POST /api/expenses
app.post('/api/expenses', async (req, res) => {
  const { description, amount, category } = req.body;
  try {
    const newExpense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount), // Ensure amount is a float/decimal
        category,
      },
    });
    res.json(newExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// DELETE /api/expenses/:id
app.delete('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// PUT /api/expenses/:id
app.put('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;
  const { description, amount, category } = req.body;
  try {
    const updatedExpense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: {
        description,
        amount: parseFloat(amount),
        category,
      },
    });
    res.json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
