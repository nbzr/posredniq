import React, { useState, useMemo } from 'react';

// Financial Model Calculator for Commerce MVP
// Shows investors clear path to profitability

export default function FinancialModelCalculator() {
  const [params, setParams] = useState({
    avgDealSize: 5000000,      // Average deal size in RUB
    commissionRate: 3,          // Commission %
    dealsMonth1: 5,
    dealsMonth3: 15,
    dealsMonth6: 40,
    dealsMonth12: 120,
    premiumUsers: 10,
    premiumPrice: 9900,
    boostsPerMonth: 20,
    boostPrice: 5000,
    teamSize: 3,
    avgSalary: 150000,
    serverCosts: 50000,
    marketingBudget: 100000,
  });

  const calculations = useMemo(() => {
    const months = [1, 3, 6, 12];
    const dealsByMonth = [params.dealsMonth1, params.dealsMonth3, params.dealsMonth6, params.dealsMonth12];
    
    return months.map((month, idx) => {
      const deals = dealsByMonth[idx];
      const volume = deals * params.avgDealSize;
      const commission = volume * (params.commissionRate / 100);
      const premium = params.premiumUsers * (month >= 3 ? 1 : 0) * params.premiumPrice * (month >= 6 ? 3 : 1);
      const boosts = params.boostsPerMonth * params.boostPrice * (month >= 3 ? 1 : 0.5);
      
      const totalRevenue = commission + premium + boosts;
      
      const salaries = params.teamSize * params.avgSalary * Math.min(month, 3);
      const servers = params.serverCosts * Math.min(month, 3);
      const marketing = params.marketingBudget * Math.min(month, 3);
      const acquiring = commission * 0.015; // 1.5% acquiring fee
      
      const totalCosts = salaries + servers + marketing + acquiring;
      const profit = totalRevenue - totalCosts;
      const margin = totalRevenue > 0 ? (profit / totalRevenue * 100) : 0;
      
      return {
        month,
        deals,
        volume,
        commission,
        premium,
        boosts,
        totalRevenue,
        salaries,
        servers,
        marketing,
        acquiring,
        totalCosts,
        profit,
        margin
      };
    });
  }, [params]);

  const formatMoney = (value) => {
    if (value >= 1000000) {
      return `₽${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `₽${(value / 1000).toFixed(0)}K`;
    }
    return `₽${value.toFixed(0)}`;
  };

  const formatPercent = (value) => `${value.toFixed(1)}%`;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
      color: '#fff',
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: '40px 20px'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * { box-sizing: border-box; }
        
        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: rgba(255,255,255,0.1);
          outline: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #00ff88;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0,255,136,0.5);
        }
        
        input[type="number"] {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 8px 12px;
          color: #fff;
          font-size: 16px;
          width: 100%;
        }
        
        input[type="number"]:focus {
          outline: none;
          border-color: #00ff88;
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: 700, 
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #00ff88 0%, #00ccff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            💰 Финансовая модель COMMERCE
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px' }}>
            Интерактивный калькулятор для инвесторов
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
          {/* Controls */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>
              ⚙️ Параметры модели
            </h2>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                Средний чек сделки
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="range"
                  min="1000000"
                  max="20000000"
                  step="500000"
                  value={params.avgDealSize}
                  onChange={e => setParams({...params, avgDealSize: Number(e.target.value)})}
                  style={{ flex: 1 }}
                />
                <span style={{ minWidth: '80px', textAlign: 'right', color: '#00ff88', fontWeight: 600 }}>
                  {formatMoney(params.avgDealSize)}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                Комиссия платформы
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={params.commissionRate}
                  onChange={e => setParams({...params, commissionRate: Number(e.target.value)})}
                  style={{ flex: 1 }}
                />
                <span style={{ minWidth: '50px', textAlign: 'right', color: '#00ff88', fontWeight: 600 }}>
                  {params.commissionRate}%
                </span>
              </div>
            </div>

            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', marginTop: '32px', color: 'rgba(255,255,255,0.8)' }}>
              📈 Прогноз сделок
            </h3>

            {[
              { key: 'dealsMonth1', label: 'Месяц 1' },
              { key: 'dealsMonth3', label: 'Месяц 3' },
              { key: 'dealsMonth6', label: 'Месяц 6' },
              { key: 'dealsMonth12', label: 'Месяц 12' },
            ].map(({ key, label }) => (
              <div key={key} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                  {label}
                </label>
                <input
                  type="number"
                  value={params[key]}
                  onChange={e => setParams({...params, [key]: Number(e.target.value)})}
                />
              </div>
            ))}

            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', marginTop: '32px', color: 'rgba(255,255,255,0.8)' }}>
              💼 Расходы
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                Команда (чел)
              </label>
              <input
                type="number"
                value={params.teamSize}
                onChange={e => setParams({...params, teamSize: Number(e.target.value)})}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                Средняя ЗП
              </label>
              <input
                type="number"
                value={params.avgSalary}
                onChange={e => setParams({...params, avgSalary: Number(e.target.value)})}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                Маркетинг/мес
              </label>
              <input
                type="number"
                value={params.marketingBudget}
                onChange={e => setParams({...params, marketingBudget: Number(e.target.value)})}
              />
            </div>
          </div>

          {/* Results */}
          <div>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              {calculations.map((calc, idx) => (
                <div key={calc.month} style={{
                  background: idx === 3 ? 'linear-gradient(135deg, rgba(0,255,136,0.15) 0%, rgba(0,200,255,0.15) 100%)' : 'rgba(255,255,255,0.03)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: idx === 3 ? '2px solid #00ff88' : '1px solid rgba(255,255,255,0.08)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                    Месяц {calc.month}
                  </div>
                  <div style={{ 
                    fontSize: '28px', 
                    fontWeight: 700, 
                    color: calc.profit >= 0 ? '#00ff88' : '#ff4466',
                    marginBottom: '4px'
                  }}>
                    {formatMoney(calc.profit)}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                    {calc.deals} сделок
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Table */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.08)',
              overflowX: 'auto'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
                📊 Детализация по месяцам
              </h2>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: 'rgba(255,255,255,0.6)' }}>Показатель</th>
                    {calculations.map(c => (
                      <th key={c.month} style={{ textAlign: 'right', padding: '12px 8px', color: 'rgba(255,255,255,0.6)' }}>
                        М{c.month}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '10px 8px', fontWeight: 500 }}>Сделок</td>
                    {calculations.map(c => (
                      <td key={c.month} style={{ textAlign: 'right', padding: '10px 8px' }}>{c.deals}</td>
                    ))}
                  </tr>
                  <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 500 }}>Оборот</td>
                    {calculations.map(c => (
                      <td key={c.month} style={{ textAlign: 'right', padding: '10px 8px' }}>{formatMoney(c.volume)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 8px', color: '#00ff88' }}>↳ Комиссия</td>
                    {calculations.map(c => (
                      <td key={c.month} style={{ textAlign: 'right', padding: '10px 8px', color: '#00ff88' }}>{formatMoney(c.commission)}</td>
                    ))}
                  </tr>
                  <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '10px 8px', color: '#00ccff' }}>↳ Premium</td>
                    {calculations.map(c => (
                      <td key={c.month} style={{ textAlign: 'right', padding: '10px 8px', color: '#00ccff' }}>{formatMoney(c.premium)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 8px', color: '#ffaa00' }}>↳ Boost</td>
                    {calculations.map(c => (
                      <td key={c.month} style={{ textAlign: 'right', padding: '10px 8px', color: '#ffaa00' }}>{formatMoney(c.boosts)}</td>
                    ))}
                  </tr>
                  <tr style={{ borderTop: '1px solid rgba(255,255,255,0.1)', fontWeight: 600 }}>
                    <td style={{ padding: '12px 8px' }}>Выручка</td>
                    {calculations.map(c => (
                      <td key={c.month} style={{ textAlign: 'right', padding: '12px 8px' }}>{formatMoney(c.totalRevenue)}</td>
                    ))}
                  </tr>
                  
                  <tr style={{ borderTop: '2px solid rgba(255,255,255,0.1)' }}>
                    <td colSpan={5} style={{ padding: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>РАСХОДЫ</td>
                  </tr>
                  
                  <tr>
                    <td style={{ padding: '10px 8px', color: '#ff6688' }}>ФОТ</td>
                    {calculations.map(c => (
                      <td key={c.month} style={{ textAlign: 'right', padding: '10px 8px', color: '#ff6688' }}>-{formatMoney(c.salaries)}</td>
                    ))}
                  </tr>
                  <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '10px 8px', color: '#ff6688' }}>Серверы</td>
                    {calculations.map(c => (
                      <td key={c.month} style={{ textAlign: 'right', padding: '10px 8px', color: '#ff6688' }}>-{formatMoney(c.servers)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 8px', color: '#ff6688' }}>Маркетинг</td>
                    {calculations.map(c => (
                      <td key={c.month} style={{ textAlign: 'right', padding: '10px 8px', color: '#ff6688' }}>-{formatMoney(c.marketing)}</td>
                    ))}
                  </tr>
                  <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '10px 8px', color: '#ff6688' }}>Эквайринг</td>
                    {calculations.map(c => (
                      <td key={c.month} style={{ textAlign: 'right', padding: '10px 8px', color: '#ff6688' }}>-{formatMoney(c.acquiring)}</td>
                    ))}
                  </tr>
                  
                  <tr style={{ borderTop: '2px solid rgba(255,255,255,0.2)', background: 'rgba(0,255,136,0.05)' }}>
                    <td style={{ padding: '14px 8px', fontWeight: 700, fontSize: '16px' }}>ПРИБЫЛЬ</td>
                    {calculations.map(c => (
                      <td key={c.month} style={{ 
                        textAlign: 'right', 
                        padding: '14px 8px', 
                        fontWeight: 700, 
                        fontSize: '16px',
                        color: c.profit >= 0 ? '#00ff88' : '#ff4466'
                      }}>
                        {formatMoney(c.profit)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 8px', color: 'rgba(255,255,255,0.6)' }}>Маржа</td>
                    {calculations.map(c => (
                      <td key={c.month} style={{ 
                        textAlign: 'right', 
                        padding: '10px 8px',
                        color: c.margin >= 0 ? '#00ff88' : '#ff4466'
                      }}>
                        {formatPercent(c.margin)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Key Metrics */}
            <div style={{
              marginTop: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.08)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                  Годовой оборот
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#00ccff' }}>
                  {formatMoney(calculations.reduce((sum, c) => sum + c.volume, 0))}
                </div>
              </div>
              
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.08)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                  Годовая выручка
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#00ff88' }}>
                  {formatMoney(calculations.reduce((sum, c) => sum + c.totalRevenue, 0))}
                </div>
              </div>
              
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.08)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                  Годовая прибыль
                </div>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 700, 
                  color: calculations.reduce((sum, c) => sum + c.profit, 0) >= 0 ? '#00ff88' : '#ff4466'
                }}>
                  {formatMoney(calculations.reduce((sum, c) => sum + c.profit, 0))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
