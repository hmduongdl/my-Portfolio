import React, { useState } from 'react';

export const ProjectsApp: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  
  const projects = [
    { name: 'Song Phương Website', tech: 'react', desc: 'E-commerce platform built with React, TypeScript & Tailwind CSS', color: '#3B82C4' },
    { name: 'Portfolio OS', tech: 'react', desc: 'macOS-style interactive portfolio built in React + Vite', color: '#4F7C8A' },
    { name: 'SP Admin Dashboard', tech: 'react', desc: 'Product & order management dashboard with role-based access', color: '#7A8C5C' },
    { name: 'Score Tracker App', tech: 'node', desc: 'Grade management web app for university coursework', color: '#C99A2E' },
    { name: 'Brand Identity Kit', tech: 'design', desc: 'Logo, color system & print assets for local businesses', color: '#7E5876' },
    { name: 'Store Inventory CLI', tech: 'node', desc: 'Terminal-based tool to track product stock and pricing', color: '#B85450' },
  ];

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'react', label: 'React' },
    { id: 'node', label: 'Node' },
    { id: 'design', label: 'Design' },
  ];

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.tech === filter);

  return (
    <div className="h-full flex flex-col select-text bg-paper">
      {/* Filtering Tabs */}
      <div className="px-6 pt-3.5 pb-0.5 flex gap-1.5 border-b border-rule bg-paper-2 flex-shrink-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`px-3 py-1 text-[13px] font-medium border-none rounded-md cursor-pointer transition-colors duration-150 ${
              filter === t.id
                ? 'bg-primary text-white'
                : 'text-ink-2 hover:bg-[rgba(0,0,0,0.05)] bg-transparent'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      
      {/* Cards Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4.5">
          {filtered.map((p) => (
            <div
              key={p.name}
              className="bg-paper-2 border border-rule rounded-lg overflow-hidden cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.10)]"
            >
              {/* Fake Window Code Preview */}
              <div
                className="h-[110px] border-b border-rule relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${p.color}22, ${p.color}11)` }}
              >
                {/* Traffic lights */}
                <div className="absolute top-2 left-2.5 flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                  <div className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                  <div className="w-2 h-2 rounded-full bg-[#28C840]" />
                </div>
                {/* Fake editor lines */}
                <div className="absolute inset-x-3.5 top-7 bottom-3.5 flex flex-col gap-1.5">
                  <div className="h-1.5 rounded-full" style={{ width: '70%', backgroundColor: p.color, opacity: 0.6 }} />
                  <div className="h-1 rounded-full" style={{ width: '50%', backgroundColor: p.color, opacity: 0.3 }} />
                  <div className="h-1 rounded-full" style={{ width: '60%', backgroundColor: p.color, opacity: 0.3 }} />
                  <div className="h-1 rounded-full" style={{ width: '40%', backgroundColor: p.color, opacity: 0.3 }} />
                </div>
              </div>
              
              {/* Project description card footer */}
              <div className="p-3.5">
                <div className="text-[13px] font-semibold mb-1 text-ink">{p.name}</div>
                <div className="text-[12px] text-ink-3 leading-relaxed">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
