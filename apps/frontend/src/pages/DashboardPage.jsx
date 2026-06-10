import { useEffect, useState } from 'react';
import { Car, CheckCircle, Wrench, Users } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import api from '@/lib/api';
import { NumberTicker } from '@/components/magic/NumberTicker';

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

function KpiCard({ icon: Icon, label, value, gradient, iconBg, colSpan = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ${gradient} ${colSpan}`}>
      {/* 背景裝飾圓 */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -right-2 -bottom-6 w-32 h-32 rounded-full bg-white/5" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-white/70 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold tracking-tight">
            {value != null ? <NumberTicker value={value} className="text-3xl font-bold" /> : '—'}
          </p>
        </div>
        <div className={`p-2.5 rounded-xl bg-white/20 backdrop-blur-sm`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </div>
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">儀表板</h2>
        <p className="text-slate-500 text-sm mt-1">車隊即時狀態總覽</p>
      </div>

      {/* Bento Grid KPI 卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          icon={Car}
          label="車輛總數"
          value={stats?.totalVehicles}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          colSpan="col-span-2"
        />
        <KpiCard
          icon={CheckCircle}
          label="可用車輛"
          value={stats?.available}
          gradient="bg-gradient-to-br from-emerald-500 to-green-600"
        />
        <KpiCard
          icon={Users}
          label="員工人數"
          value={stats?.totalEmployees}
          gradient="bg-gradient-to-br from-violet-500 to-purple-600"
        />
        <KpiCard
          icon={Wrench}
          label="維修中"
          value={stats?.maintenance}
          gradient="bg-gradient-to-br from-amber-500 to-orange-500"
          colSpan="col-span-2"
        />
        <div className="col-span-2 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 p-5 text-white shadow-lg flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/10">
            <Car size={24} className="text-white/80" />
          </div>
          <div>
            <p className="text-white/60 text-xs font-medium mb-0.5">使用中車輛</p>
            <p className="text-2xl font-bold">
              {stats?.inUse != null ? <NumberTicker value={stats.inUse} /> : '—'}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-white/60 text-xs">報廢</p>
            <p className="text-lg font-semibold">
              {stats?.retired != null ? <NumberTicker value={stats.retired} /> : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* 圖表區 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-border-subtle rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">車輛狀態分佈</h3>
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
          ) : <p className="text-slate-400 text-sm">尚無資料</p>}
        </div>

        <div className="bg-white border border-border-subtle rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">每月新增車輛趨勢（近 6 個月）</h3>
          {stats?.monthlyTrend?.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip />
                <Bar dataKey="count" name="新增數量" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-slate-400 text-sm">尚無資料</p>}
        </div>
      </div>
    </div>
  );
}
