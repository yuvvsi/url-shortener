import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

export default function Analytics() {
  const { shortCode } = useParams()
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/analytics/${shortCode}`)
        console.log('analytics response:', res.data)
        console.log('first click:', res.data.clicks?.[0])
        setAnalytics(res.data)
      } catch (err) {
        toast.error('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [shortCode])

  if (loading) return (
    <div style={styles.centered}>
      <p style={{ color: 'var(--text-secondary)' }}>Loading analytics...</p>
    </div>
  )

  if (!analytics) return (
    <div style={styles.centered}>
      <p style={{ color: 'var(--text-secondary)' }}>No data found</p>
    </div>
  )

  // convert clicksByDate map to array for recharts
  const chartData = Object.entries(analytics.clicksByDate || {})
    .map(([date, count]) => ({ date, clicks: count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <nav style={styles.nav}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          ← Back
        </button>
        <div style={styles.navTitle}>Analytics</div>
        <div style={{ width: '60px' }} />
      </nav>

      <div style={styles.container}>

        {/* Header */}
        <div style={styles.card}>
          <p style={styles.label}>Short Code</p>
          <h2 style={styles.shortCode}>/{shortCode}</h2>
          <div style={styles.totalRow}>
            <div style={styles.totalBox}>
              <p style={styles.totalLabel}>Total Clicks</p>
              <p style={styles.totalValue}>{analytics.totalClicks}</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 ? (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Clicks Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: '#6366f1', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={styles.card}>
            <p style={styles.empty}>No click data yet — share your link to start tracking!</p>
          </div>
        )}

        {/* Recent Clicks Table */}
        {analytics.clicks && analytics.clicks.length > 0 && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Recent Clicks</h3>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Time</th>
                    <th style={styles.th}>IP Address</th>
                    <th style={styles.th}>User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.clicks.slice(0, 20).map((click, i) => (
                    <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td style={styles.td}>
                        {new Date(click.clickedAt).toLocaleString()}
                      </td>
                      <td style={styles.td}>{click.ipAddress || '—'}</td>
                      <td style={{ ...styles.td, ...styles.uaCell }}>
                        {click.userAgent || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg-primary)',
  },
  centered: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav: {
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    padding: '6px 14px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  navTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '32px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '24px',
  },
  label: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px',
  },
  shortCode: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--accent)',
    marginBottom: '20px',
  },
  totalRow: {
    display: 'flex',
    gap: '16px',
  },
  totalBox: {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '16px 24px',
    textAlign: 'center',
  },
  totalLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginBottom: '4px',
  },
  totalValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--accent)',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '20px',
  },
  empty: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    textAlign: 'center',
    padding: '24px 0',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  th: {
    textAlign: 'left',
    padding: '10px 14px',
    color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border)',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '10px 14px',
    color: 'var(--text-primary)',
    borderBottom: '1px solid var(--border)',
    whiteSpace: 'nowrap',
  },
  uaCell: {
    maxWidth: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: 'var(--text-secondary)',
    fontSize: '12px',
  },
  trEven: {
    background: 'transparent',
  },
  trOdd: {
    background: 'rgba(99,102,241,0.04)',
  },
}