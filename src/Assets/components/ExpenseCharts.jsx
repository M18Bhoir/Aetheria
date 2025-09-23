import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

const expenseData = [
  { name: "Maintenance", value: 400 },
  { name: "Electricity", value: 300 },
  { name: "Water", value: 200 },
  { name: "Others", value: 100 },
];

const monthlyExpenses = [
  { month: "Jan", amount: 1200 },
  { month: "Feb", amount: 900 },
  { month: "Mar", amount: 1400 },
  { month: "Apr", amount: 800 },
];

const ExpenseCharts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Expense Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">Monthly Expenses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyExpenses}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseCharts;
