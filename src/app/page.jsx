'use client';

import React, { useState, useEffect } from 'react';
import { Search, Phone, Loader2, ChevronLeft, ChevronRight, User } from 'lucide-react';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch('https://script.google.com/macros/s/AKfycbysTcnJgcKr8b2O7b3ARlDaPCYRKEfH72ZLOZK-G5VDPvedSD-VM8XK8FtS-CujXMsJzg/exec')
      .then((res) => res.json())
      .then((data) => { setData(data); setLoading(false); });
  }, []);

  // Update filter: Sekarang mencari berdasarkan Bagian, Ekstension, atau Pemegang
  const filteredData = data.filter(item => 
    item['Bagian']?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item['Ekstension']?.toString().includes(searchTerm) ||
    item['Pemegang']?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
        <h1 className="text-xl font-black text-blue-950">Data Buku Telepon</h1>
        <p className="text-blue-600 font-bold tracking-[0.2em] uppercase mt-5">PLN INDONESIA POWER</p>
        <p className="text-blue-600 font-bold tracking-[0.2em] uppercase">UBP MRICA</p>
        <Loader2 size={24} className="animate-spin text-blue-500 mt-8" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-blue-50 p-4 md:p-10 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="bg-blue-900 text-white p-8 rounded-[2rem] shadow-2xl shadow-blue-200 mb-8">
          <div className="flex items-center gap-4">
            <img src="/logo.jpeg" alt="Logo PLN" className="w-10 h-10 object-contain" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-blue-200 tracking-wide uppercase">DATA BUKU TELEPON KANTOR</span>
              <span className="text-base font-black tracking-widest text-white uppercase mt-2">PLN INDONESIA POWER</span>
              <span className="text-base font-black tracking-widest text-white uppercase">UBP MRICA</span>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="sticky top-4 z-20 mb-8">
          <div className="relative shadow-lg shadow-blue-200 rounded-[2rem]">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
            <input
              type="text"
              placeholder="Cari bagian, nomor, atau pemegang..."
              className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-0 focus:ring-4 focus:ring-blue-300 outline-none transition-all bg-white text-blue-950 placeholder:text-blue-300"
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        {/* List Data */}
        {loading ? <p className="text-center text-blue-400">Memuat data...</p> : (
          <div className="grid gap-4">
            {paginatedData.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-[2rem] shadow-sm border border-blue-50 flex items-center justify-between hover:shadow-md hover:border-blue-100 transition-all">
                <div className="flex flex-col">
                  <h3 className="font-bold text-blue-950">{item['Bagian']}</h3>
                  {/* Menampilkan Pemegang di bawah Bagian */}
                  <div className="flex items-center gap-1 text-xs text-blue-500 mt-1">
                    <User size={14} />
                    <span>{item['Pemegang'] || '-'}</span>
                  </div>
                </div>
                <div className="bg-blue-50 text-blue-700 px-6 py-3 rounded-2xl font-black flex items-center gap-2">
                  <Phone size={16} /> {item['Ekstension']}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginasi */}
        <div className="flex justify-center items-center gap-4 mt-10 pb-10">
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