'use client';

import React, { useState, useEffect } from 'react';
import { Search, Phone, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch('https://script.google.com/macros/s/AKfycbxvadYA4xWB5M8kyY1UDcXdQbEMkiaVk_2updxeQweRkZv7RRJ3uCuTXpQIxcD_HO1PWA/exec')
      .then((res) => res.json())
      .then((data) => { setData(data); setLoading(false); });
  }, []);

  const filteredData = data.filter(item => item['Bagian']?.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (showWelcome) {
    return (
      <main className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="relative mb-12">
          <div className="absolute w-32 h-32 bg-blue-400 rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-white p-8 rounded-full shadow-xl animate-bounce">
            <Phone size={48} className="text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-black mb-3 text-blue-950">Data Buku Telepon</h1>
        <p className="text-blue-600 font-medium">Memuat data terbaru untuk Anda...</p>
        <Loader2 size={24} className="animate-spin text-blue-500 mt-8" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-blue-50 p-4 md:p-10 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="bg-blue-900 text-white p-8 rounded-[2rem] shadow-2xl shadow-blue-200 mb-8 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6 absolute top-6 left-8">
            <div className="bg-white p-1 rounded-lg">
              <img 
                src="/logo.jpeg" 
                alt="Logo PLN" 
                className="w-6 h-6 object-contain" 
              />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-blue-200 uppercase">
              PLN INDONESIA POWER
            </span>
          </div>

          {/* Judul Utama dengan ukuran yang lebih proporsional */}
          <div className="text-center mt-6">
            <h1 className="text-xl md:text-xl font-black text-white tracking-wide">
              DATA BUKU TELEPON KANTOR
            </h1>
          </div>
        </header>

        <div className="relative mb-8">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
          <input
            type="text"
            placeholder="Cari nama bagian..."
            className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-0 shadow-lg shadow-blue-100 focus:ring-4 focus:ring-blue-200 outline-none transition-all bg-white text-blue-950 placeholder:text-blue-300"
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {loading ? <p className="text-center text-blue-400">Memuat data...</p> : (
          <div className="grid gap-4">
            {paginatedData.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-[2rem] shadow-sm border border-blue-50 flex items-center justify-between hover:shadow-md hover:border-blue-100 transition-all">
                <h3 className="font-bold text-blue-950">{item['Bagian']}</h3>
                <div className="bg-blue-50 text-blue-700 px-6 py-3 rounded-2xl font-black flex items-center gap-2">
                  <Phone size={16} /> {item['Ekstension']}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center gap-4 mt-10">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-3 rounded-full bg-white shadow-md disabled:opacity-30 text-blue-600">
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-blue-950">Hal {currentPage} / {totalPages || 1}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="p-3 rounded-full bg-white shadow-md disabled:opacity-30 text-blue-600">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </main>
  );
}