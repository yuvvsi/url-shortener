import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { QRCodeSVG } from 'qrcode.react'

export default function Dashboard() {
  const { username, logout } = useAuth()
  const navigate = useNavigate()

  const [urls, setUrls] = useState([])
  const [totalClicks, setTotalClicks] = useState(0)
  const [loading, setLoading] = useState(true)
  const [shortening, setShortening] = useState(false)
  const [form, setForm] = useState({ longUrl: '', expiryMinutes: '' })
  const [qrCode, setQrCode] = useState(null)
  const [copiedCode, setCopiedCode] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/analytics/my-total-clicks')
      console.log('API response:', res.data)
      console.log('first url:', res.data.urls?.[0])
      setUrls(res.data.urls || [])
      setTotalClicks(res.data.totalClicks || 0)
    } catch (err) {
      console.error('fetch error:', err)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
      console.log('urls state updated:', urls)
  }, [urls])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleShorten = async (e) => {
    e.preventDefault()
    setShortening(true)
    try {
      const res = await api.post('/url/shorten', {
        longUrl: form.longUrl,
        expiryMinutes: form.expiryMinutes ? parseInt(form.expiryMinutes) : null
      })
      toast.success('URL shortened!')
      setForm({ longUrl: '', expiryMinutes: '' })
      fetchData()
    } catch (err) {
      toast.error('Failed to shorten URL')
    } finally {
      setShortening(false)
    }
  }

  const handleCopy = (shortCode) => {
    const url = `http://localhost:8080/api/url/${shortCode}`
    navigator.clipboard.writeText(url)
    setCopiedCode(shortCode)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  if (loading) return (
    <div style={styles.centered}>
      <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
    </div>
  )

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>🔗 Shrinkly</div>
        <div style={styles.navRight}>
          <span style={styles.navUser}>👤 {username}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.container}>

        {/* Stats Row */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total URLs</p>
            <p style={styles.statValue}>{urls.length}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Clicks</p>
            <p style={styles.statValue}>{totalClicks}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Active URLs</p>
            <p style={styles.statValue}>
              {urls.filter(u => !isExpired(u.expiresAt)).length}
            </p>
          </div>
        </div>

        {/* Shorten Form */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Shorten a URL</h2>
          <form onSubmit={handleShorten} style={styles.shortenForm}>
            <input
              style={{ ...styles.input, flex: 1 }}
              type="url"
              placeholder="Paste your long URL here..."
              value={form.longUrl}
              onChange={e => setForm({ ...form, longUrl: e.target.value })}
              required
            />
            <input
              style={{ ...styles.input, width: '160px' }}
              type="number"
              placeholder="Expiry (mins)"
              value={form.expiryMinutes}
              onChange={e => setForm({ ...form, expiryMinutes: e.target.value })}
              min="1"
            />
            <button
              type="submit"
              style={{ ...styles.btn, opacity: shortening ? 0.7 : 1 }}
              disabled={shortening}
            >
              {shortening ? 'Shortening...' : 'Shorten'}
            </button>
          </form>
        </div>

        {/* QR Modal */}
        {qrCode && (
          <div style={styles.qrOverlay} onClick={() => setQrCode(null)}>
            <div style={styles.qrModal} onClick={e => e.stopPropagation()}>
              <h3 style={styles.qrTitle}>QR Code</h3>
              <p style={styles.qrSubtitle}>{qrCode}</p>
              <div style={styles.qrWrapper}>
                <QRCodeSVG value={qrCode} size={200} />
              </div>
              <button
                style={styles.qrClose}
                onClick={() => setQrCode(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* URL List */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Your URLs</h2>
          {urls.length === 0 ? (
            <p style={styles.empty}>No URLs yet. Shorten your first one above!</p>
          ) : (
            <div style={styles.urlList}>
              {urls.map((url) => {
                const expired = isExpired(url.expiresAt)
                const shortUrl = `http://localhost:8080/api/url/${url.shortCode}`
                return (
                  <div key={url.shortCode} style={{
                    ...styles.urlCard,
                    opacity: expired ? 0.6 : 1,
                    borderLeft: expired
                      ? '3px solid var(--danger)'
                      : '3px solid var(--accent)'
                  }}>
                    <div style={styles.urlTop}>
                      <div style={styles.urlInfo}>
                        <div style={styles.urlRow}>

                          <a href={shortUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={styles.shortLink}
                          >
                            {shortUrl}
                          </a>
                          {expired && (
                            <span style={styles.expiredBadge}>Expired</span>
                          )}
                        </div>
                        <p style={styles.longUrl}>{url.longUrl}</p>
                      </div>
                      <div style={styles.clickBadge}>
                        <span style={styles.clickCount}>{url.totalClicks}</span>
                        <span style={styles.clickLabel}>clicks</span>
                      </div>
                    </div>

                    <div style={styles.urlActions}>
                      <button
                        style={styles.actionBtn}
                        onClick={() => handleCopy(url.shortCode)}
                      >
                        {copiedCode === url.shortCode ? '✅ Copied' : '📋 Copy'}
                      </button>
                      <button
                        style={styles.actionBtn}
                        onClick={() => setQrCode(shortUrl)}
                      >
                        📱 QR Code
                      </button>
                      <button
                        style={{ ...styles.actionBtn, color: 'var(--accent)' }}
                        onClick={() => navigate(`/analytics/${url.shortCode}`)}
                      >
                        📊 Analytics
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
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
  navLogo: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  navUser: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    padding: '6px 14px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '32px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  statCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '24px',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--accent)',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '24px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '16px',
  },
  shortenForm: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  input: {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '11px 14px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
  },
  btn: {
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '11px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  urlList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  urlCard: {
    background: 'var(--bg-primary)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    padding: '16px',
  },
  urlTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    gap: '12px',
  },
  urlInfo: {
    flex: 1,
    overflow: 'hidden',
  },
  urlRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  shortLink: {
    color: 'var(--accent)',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
  },
  expiredBadge: {
    background: 'rgba(239,68,68,0.15)',
    color: 'var(--danger)',
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '20px',
    fontWeight: '600',
  },
  longUrl: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  clickBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '50px',
  },
  clickCount: {
    fontSize: '22px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    lineHeight: 1,
  },
  clickLabel: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
  },
  urlActions: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  empty: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    textAlign: 'center',
    padding: '32px 0',
  },
  qrOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  qrModal: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '32px',
    textAlign: 'center',
    maxWidth: '320px',
    width: '100%',
  },
  qrTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  qrSubtitle: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginBottom: '20px',
    wordBreak: 'break-all',
  },
  qrWrapper: {
    background: '#fff',
    padding: '16px',
    borderRadius: 'var(--radius-sm)',
    display: 'inline-block',
    marginBottom: '20px',
  },
  qrClose: {
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
}