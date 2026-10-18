import React, { useState } from 'react';
import { PERIODIC_ELEMENTS, ElementData } from '../data/periodicTableData';
import { Search, Info, Sparkles, Filter, Layers, Zap } from 'lucide-react';

export const PeriodicTableExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'metal' | 'nonmetal' | 'noble_gas'>('all');
  const [selectedElement, setSelectedElement] = useState<ElementData>(PERIODIC_ELEMENTS[7]); // Default Oxygen

  const filteredElements = PERIODIC_ELEMENTS.filter(el => {
    const matchesSearch =
      el.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.number.toString() === searchTerm.trim() ||
      el.atomicMass.toString() === searchTerm.trim();
    
    const matchesCategory = selectedCategory === 'all' || el.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Tài liệu tra cứu chuẩn SGK Khoa học tự nhiên Bài 4 (Trang 25)
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Bảng Tuần Hoàn Các Nguyên Tố Hoá Học
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Quy ước màu sắc: <span className="text-cyan-300 font-bold">Xanh lam</span> (Kim loại), <span className="text-rose-300 font-bold">Hồng</span> (Phi kim), <span className="text-amber-300 font-bold">Vàng</span> (Khí hiếm).
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-center">
              <span className="block text-xs text-cyan-300 font-semibold">Kim loại</span>
              <span className="text-base font-bold text-white">&gt; 90 ng.tố</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-rose-950/60 border border-rose-500/30 text-center">
              <span className="block text-xs text-rose-300 font-semibold">Phi kim</span>
              <span className="text-base font-bold text-white">&lt; 20 ng.tố</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-amber-950/60 border border-amber-500/30 text-center">
              <span className="block text-xs text-amber-300 font-semibold">Khí hiếm</span>
              <span className="text-base font-bold text-white">7 ng.tố</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, kí hiệu (O, Fe, Na) hoặc KLNT (16, 56, 23)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-600 focus:outline-none focus:border-cyan-400 text-xs sm:text-sm text-white placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSelectedCategory('metal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                selectedCategory === 'metal'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800 hover:bg-cyan-900/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Kim loại
            </button>
            <button
              onClick={() => setSelectedCategory('nonmetal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                selectedCategory === 'nonmetal'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-rose-950/60 text-rose-300 border border-rose-800 hover:bg-rose-900/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              Phi kim
            </button>
            <button
              onClick={() => setSelectedCategory('noble_gas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                selectedCategory === 'noble_gas'
                  ? 'bg-amber-500 text-slate-900 shadow-sm'
                  : 'bg-amber-950/60 text-amber-300 border border-amber-800 hover:bg-amber-900/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Khí hiếm
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Interactive Grid & Element Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Elements Grid (2 Cols on lg) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Các Nguyên Tố Trọng Tâm SGK (Chu kì 1 - 4 & Nguyên tố tiêu biểu)
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Hiển thị {filteredElements.length} nguyên tố
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {filteredElements.map(el => {
              const isSelected = selectedElement.number === el.number;
              const bgBadge =
                el.category === 'metal'
                  ? 'bg-cyan-50 border-cyan-300 hover:bg-cyan-100 text-cyan-900'
                  : el.category === 'nonmetal'
                  ? 'bg-rose-50 border-rose-300 hover:bg-rose-100 text-rose-900'
                  : 'bg-amber-50 border-amber-300 hover:bg-amber-100 text-amber-900';

              const activeRing = isSelected ? 'ring-2 ring-indigo-600 ring-offset-2 scale-105 shadow-md' : 'shadow-2xs';

              return (
                <button
                  key={el.number}
                  onClick={() => setSelectedElement(el)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${bgBadge} ${activeRing}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono font-bold opacity-75">
                      {el.number}
                    </span>
                    <span className="text-[9px] font-semibold px-1 rounded bg-white/70">
                      {el.group}
                    </span>
                  </div>
                  <div className="text-xl font-black text-center my-1 tracking-tight">
                    {el.symbol}
                  </div>
                  <div className="text-[10px] font-bold truncate text-center">
                    {el.name}
                  </div>
                  <div className="text-[9px] font-mono text-center opacity-80 mt-0.5">
                    {el.atomicMass} amu
                  </div>
                </button>
              );
            })}
          </div>

          {filteredElements.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">
              Không tìm thấy nguyên tố phù hợp với từ khóa "{searchTerm}".
            </div>
          )}
        </div>

        {/* Selected Element Detail Inspector (Hình 4.1 & Hình 4.2 SGK) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Chi Tiết Ô Nguyên Tố (Hình 4.2 SGK)
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                selectedElement.category === 'metal'
                  ? 'bg-cyan-100 text-cyan-800'
                  : selectedElement.category === 'nonmetal'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {selectedElement.categoryVi}
              </span>
            </div>

            {/* High visual element card mimicking textbook Figure 4.1 & 4.2 */}
            <div className="my-5 p-6 rounded-2xl border-2 text-center relative max-w-xs mx-auto shadow-md transition-all duration-300"
              style={{
                backgroundColor:
                  selectedElement.category === 'metal'
                    ? '#cffafe'
                    : selectedElement.category === 'nonmetal'
                    ? '#ffe4e6'
                    : '#fef3c7',
                borderColor:
                  selectedElement.category === 'metal'
                    ? '#22d3ee'
                    : selectedElement.category === 'nonmetal'
                    ? '#fb7185'
                    : '#f59e0b'
              }}
            >
              <div className="text-sm font-mono font-bold text-slate-600">
                Số hiệu nguyên tử: <span className="text-slate-900 font-extrabold text-base">{selectedElement.number}</span>
              </div>
              <div className="text-5xl font-black text-slate-900 my-2 tracking-tight">
                {selectedElement.symbol}
              </div>
              <div className="text-lg font-bold text-slate-800 capitalize">
                {selectedElement.name}
              </div>
              <div className="text-sm font-mono font-bold text-slate-700 mt-1">
                KLNT: <span className="font-extrabold text-slate-900">{selectedElement.atomicMass}</span> amu
              </div>
              {selectedElement.valenceElectrons !== undefined && (
                <div className="mt-2 text-xs font-medium text-slate-600 bg-white/60 py-1 px-2 rounded-lg">
                  e lớp ngoài cùng: <b>{selectedElement.valenceElectrons}</b>
                </div>
              )}
            </div>

            {/* Deductions & Rules */}
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Mối liên hệ suy ra (Mức Vận Dụng):
                </p>
                <p>• Số proton = <b>{selectedElement.number}</b> hạt</p>
                <p>• Số electron = <b>{selectedElement.number}</b> hạt</p>
                <p>• Số đơn vị điện tích hạt nhân = <b>+{selectedElement.number}</b></p>
                <p>• Số thứ tự ô trong bảng tuần hoàn = <b>Ô số {selectedElement.number}</b></p>
                <p>• Chu kì <b>{selectedElement.period}</b> (có <b>{selectedElement.period}</b> lớp electron)</p>
                <p>• Thuộc nhóm <b>{selectedElement.group}</b></p>
              </div>

              {selectedElement.applicationVi && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <p className="font-bold mb-0.5">Ứng dụng thực tế đời sống (SGK):</p>
                  <p>{selectedElement.applicationVi}</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
