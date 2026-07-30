import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const DataTable = ({
  columns = [],
  data = [],
  searchable = true,
  searchPlaceholder = 'Search...',
  filterOptions = [],
  pageSize = 8,
  emptyMessage = 'No records found.',
  onRowClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        if (!Object.values(item).some((v) => v && String(v).toLowerCase().includes(q))) return false;
      }
      for (const fk in filters) {
        const v = filters[fk];
        if (v && v !== 'all' && String(item[fk]).toLowerCase() !== String(v).toLowerCase()) return false;
      }
      return true;
    });
  }, [data, searchTerm, filters]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const av = a[sortConfig.key] || '', bv = b[sortConfig.key] || '';
      if (av < bv) return sortConfig.direction === 'asc' ? -1 : 1;
      if (av > bv) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize), [sortedData, currentPage, pageSize]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      {(searchable || filterOptions.length > 0) && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          {searchable && (
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-3 h-8 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
          )}

          {filterOptions.length > 0 && (
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
              {filterOptions.map((f) => (
                <select
                  key={f.key}
                  value={filters[f.key] || 'all'}
                  onChange={(e) => { setFilters((p) => ({ ...p, [f.key]: e.target.value })); setCurrentPage(1); }}
                  className="h-8 px-2 pr-6 border border-gray-200 rounded-lg text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                >
                  <option value="all">All {f.label}</option>
                  {f.options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {columns.map((col) => (
                  <th
                    key={col.key || col.header}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`py-3 px-4 font-semibold text-gray-500 uppercase tracking-wide text-[10px] ${col.sortable ? 'cursor-pointer hover:text-gray-700 select-none' : ''} ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}
                  >
                    <div className={`flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : ''}`}>
                      {col.header}
                      {col.sortable && <ArrowUpDown className="w-3 h-3 text-gray-300" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-10 text-center text-gray-400 text-xs">{emptyMessage}</td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr
                    key={row.id || idx}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key || col.header}
                        className={`py-3 px-4 text-gray-700 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}
                      >
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)}–{Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-medium text-gray-700">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-white transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
