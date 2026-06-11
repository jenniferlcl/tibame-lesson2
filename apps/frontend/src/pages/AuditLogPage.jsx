import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const ACTION_LABEL = { create: '新增', update: '更新', delete: '刪除' };
const ACTION_VARIANT = { create: 'default', update: 'secondary', delete: 'destructive' };
const RESOURCE_LABEL = { vehicle: '車輛', employee: '員工' };

function summarize(detail) {
  if (!detail) return '—';
  if (detail.plate) return `車牌：${detail.plate}`;
  if (detail.name) return `姓名：${detail.name}`;
  return JSON.stringify(detail);
}

export function AuditLogPage() {
  const [page, setPage]     = useState(1);
  const limit               = 20;
  const [data, setData]     = useState([]);
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get(`/audit-log?page=${page}&limit=${limit}`)
      .then(res => { if (!cancelled) { setData(res.data.data); setTotal(res.data.total); } })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-brand-primary/10 rounded-lg flex items-center justify-center">
          <ClipboardList size={18} className="text-brand-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gradient">操作紀錄</h2>
      </div>

      <div className="rounded-xl border border-border-subtle bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-44">操作時間</TableHead>
              <TableHead className="w-28">操作者</TableHead>
              <TableHead className="w-20">動作</TableHead>
              <TableHead className="w-20">資源類型</TableHead>
              <TableHead className="w-20">資源 ID</TableHead>
              <TableHead>摘要</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-400">載入中…</TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-400">尚無操作紀錄</TableCell>
              </TableRow>
            ) : data.map(row => (
              <TableRow key={row.id} className="border-l-2 border-l-transparent hover:border-l-brand-primary/40 transition-colors">
                <TableCell className="text-xs text-slate-500 tabular-nums">
                  {new Date(row.created_at).toLocaleString('zh-TW', { hour12: false })}
                </TableCell>
                <TableCell className="font-medium">{row.username ?? '—'}</TableCell>
                <TableCell>
                  <Badge variant={ACTION_VARIANT[row.action] ?? 'outline'}>
                    {ACTION_LABEL[row.action] ?? row.action}
                  </Badge>
                </TableCell>
                <TableCell>{RESOURCE_LABEL[row.resource_type] ?? row.resource_type}</TableCell>
                <TableCell className="tabular-nums">{row.resource_id ?? '—'}</TableCell>
                <TableCell className="text-slate-600 text-sm">{summarize(row.detail)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>共 {total} 筆</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline" size="sm"
            onClick={() => setPage(p => p - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft size={14} /> 上一頁
          </Button>
          <span className="px-2">第 {page} / {totalPages} 頁</span>
          <Button
            variant="outline" size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= totalPages}
          >
            下一頁 <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
