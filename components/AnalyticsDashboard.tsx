import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Supporter } from '../lib/supabaseClient';

interface AnalyticsDashboardProps {
  supporters: Supporter[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ supporters }) => {
  // Utility functions
  const calculateTotals = () => {
    const total = supporters.length;
    const strong = supporters.filter(s => s.status === 'strong').length;
    const weak = supporters.filter(s => s.status === 'weak').length;
    const undecided = supporters.filter(s => s.status === 'undecided').length;
    return { total, strong, weak, undecided };
  };

  const groupByDistrict = () => {
    return supporters.reduce((acc, supporter) => {
      if (supporter.district) {
        acc[supporter.district] = (acc[supporter.district] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  };

  const groupByStatus = () => {
    return [
      { name: 'Strong', value: supporters.filter(s => s.status === 'strong').length },
      { name: 'Weak', value: supporters.filter(s => s.status === 'weak').length },
      { name: 'Undecided', value: supporters.filter(s => s.status === 'undecided').length },
    ];
  };

  const totals = calculateTotals();
  const districtData = Object.entries(groupByDistrict()).map(([name, value]) => ({ name, value }));
  const statusData = groupByStatus();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="p-4 space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Total Supporters</h3>
          <p className="text-2xl font-bold">{totals.total}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Strong</h3>
          <p className="text-2xl font-bold">{totals.strong}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Weak</h3>
          <p className="text-2xl font-bold">{totals.weak}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Undecided</h3>
          <p className="text-2xl font-bold">{totals.undecided}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Supporters by District</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={districtData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Supporters by Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
              {statusData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
