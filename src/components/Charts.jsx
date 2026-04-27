import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as PieTooltip, Legend, BarChart, Bar, XAxis, YAxis, Tooltip as BarTooltip, CartesianGrid } from 'recharts';
import './Charts.css';

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#14b8a6', '#f43f5e', '#84cc16', '#6366f1'];

const Charts = ({ subscriptions }) => {
  const categoryData = useMemo(() => {
    const data = subscriptions.reduce((acc, sub) => {
      const periodicity = sub.periodicity || 'Mensual';
      const price = sub.price !== undefined ? sub.price : (sub.monthlyPrice || 0);
      
      let annualCost = 0;
      if (periodicity === 'Mensual') annualCost = price * 12;
      else if (periodicity === 'Trimestral') annualCost = price * 4;
      else if (periodicity === 'Anual') annualCost = price;
      
      const monthlyCost = annualCost / 12;
      
      if (monthlyCost > 0) {
        const existing = acc.find(item => item.name === sub.category);
        if (existing) {
          existing.value += monthlyCost;
        } else {
          acc.push({ name: sub.category, value: monthlyCost });
        }
      }
      return acc;
    }, []);
    
    return data.sort((a, b) => b.value - a.value);
  }, [subscriptions]);

  if (!subscriptions || subscriptions.length === 0) return null;

  return (
    <div className="charts-container">
      <div className="chart-box">
        <h4>Distribución por Categoría</h4>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <PieTooltip 
                formatter={(value) => `${value.toFixed(2)} €`}
                contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#374151', borderRadius: '8px', color: '#f9fafb' }}
                itemStyle={{ color: '#f9fafb' }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '0.8rem', color: '#9ca3af' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-box">
        <h4>Comparativa Prorrateada (Mensual)</h4>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value}`} />
              <BarTooltip 
                cursor={{ fill: '#2d2d2d' }}
                formatter={(value) => [`${value.toFixed(2)} €`, 'Gasto']}
                contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#374151', borderRadius: '8px', color: '#f9fafb' }}
              />
              <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
