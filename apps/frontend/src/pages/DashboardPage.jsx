import { useEffect, useState } from 'react';
import { Car, CheckCircle, Wrench, Users } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import api from '@/lib/api';
import { NumberTicker } from '@/components/magic/NumberTicker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const STATUS_COLORS = {
  available:   '#22c55e',
  in_use:      '#3b82f6',
  maintenance: '#f59e0b',
  retired:     '#6b7280',
};
const STATUS_LABEL = {
  available:   '可用',
  in_use:      '使用中',
  maintenance: '維修中',
  retired:     '報廢',
};

function buildLast6Months(data = []) {
  const map = Object.fromEntries(data.map(d => [d.month, d.count]));
  const result = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    result.push({ month: key, count: map[key] ?? 0 });
  }
  return result;
}

function KpiCard({ icon: Icon, label, value, colorClass }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-bold tracking-tight text-slate-900">
              {value != null ? <NumberTicker value={value} className="text-3xl font-bold" /> : '—'}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${colorClass}`}>
            <Icon size={22} className="text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setStats(r.data)).catch(console.error);
  }, []);

  const pieData = stats?.vehicleStatusBreakdown.map(d => ({
    name: STATUS_LABEL[d.status] ?? d.status,
    value: d.count,
    fill: STATUS_COLORS[d.status] ?? '#94a3b8',
  })) ?? [];

  const barData = buildLast6Months(stats?.monthlyVehicles);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">儀表板</h2>
        <p className="text-slate-500 text-sm mt-1">車隊即時狀態總覽</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Car}         label="車輛總數" value={stats?.totalVehicles}   colorClass="bg-blue-500" />
        <KpiCard icon={CheckCircle} label="可用車輛" value={stats?.available}       colorClass="bg-emerald-500" />
        <KpiCard icon={Wrench}      label="維修中"   value={stats?.maintenance}      colorClass="bg-amber-500" />
        <KpiCard icon={Users}       label="員工人數" value={stats?.totalEmployees}   colorClass="bg-violet-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">車輛狀態分佈</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {pieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm py-16 text-center">尚無車輛資料</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">每月新增車輛（近 6 個月）</CardTitle>
          </CardHeader>
          <CardContent>
            {barData.some(d => d.count > 0) ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip />
                  <Bar dataKey="count" name="新增數量" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm py-16 text-center">近 6 個月無新增車輛記錄</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
