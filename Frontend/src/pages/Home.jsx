import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'
import FeatureCard from '../components/FeatureCard'

const features = [
  {
    icon: 'box',
    title: 'Inventory Tracking',
    description: 'Keep stock counts accurate and view item movement in real time.',
  },
  {
    icon: 'trend',
    title: 'Sales Management',
    description: 'Monitor orders, invoices, and revenue from your personal inventory.',
  },
  {
    icon: 'chart',
    title: 'Analytics Dashboard',
    description: 'Visualize your inventory trends and sales performance clearly.',
  },
  {
    icon: 'tenant',
    title: 'Multi-Tenant Support',
    description: 'Support separate personal spaces for every store user.',
  },
  {
    icon: 'user',
    title: 'User Management',
    description: 'Log in securely and manage your own store data effortlessly.',
  },
  {
    icon: 'bolt',
    title: 'Real-Time Updates',
    description: 'Receive instant updates when inventory changes or sales occur.',
  },
]

const benefits = [
  'Simplify your inventory operations with one user-friendly dashboard.',
  'Speed up daily workflows with intuitive, task-focused tools.',
  'Keep your store data organized and accessible at a glance.',
  'Manage your inventory securely and confidently every day.',
]

const heroStats = [
  { target: 1250, suffix: '+', label: 'Items managed' },
  { target: 98, suffix: '%', label: 'Stock accuracy' },
  { target: 24, suffix: '/7', label: 'Live updates' },
]

const dashboardStates = [
  {
    status: 'Live',
    label: 'Total Revenue',
    value: '$18,420',
    bars: ['42%', '66%', '54%', '78%', '62%'],
    notes: [
      'Personal inventory space for every user',
      'Fast access to stock, pricing, and sales activity',
      'Clear insights for smarter restocking',
    ],
  },
  {
    status: 'Updated',
    label: 'Low Stock Alerts',
    value: '14 items',
    bars: ['58%', '46%', '72%', '50%', '84%'],
    notes: [
      'Spot products that need attention quickly',
      'Prioritize restocking before sales slow down',
      'Keep daily operations moving smoothly',
    ],
  },
  {
    status: 'Synced',
    label: 'Monthly Sales',
    value: '428',
    bars: ['34%', '52%', '68%', '76%', '90%'],
    notes: [
      'Track sales activity as it changes',
      'Review performance in a clear dashboard',
      'Connect sales decisions with stock movement',
    ],
  },
]

const sliderItems = [
  {
    headline: 'Built for every store',
    title: 'All your inventory workflows in one polished app.',
    description:
      'Manage stock, sales, and orders with powerful previews, instant updates, and clean controls built for busy teams.',
    accent: 'Fast setup • Real-time updates • Secure control',
  },
  {
    headline: 'Sell more without the chaos',
    title: 'Create sales, review totals, and manage products from a single workspace.',
    description:
      'Keep every sale accurate with product selection, quantity controls, and automatic totals that make checkout effortless.',
    accent: 'Smart sales flow • Better accuracy • Faster checkout',
  },
  {
    headline: 'Stay ahead of stock levels',
    title: 'Low-stock alerts and inventory insights to avoid surprises.',
    description:
      'Spot items that need restocking quickly, so you keep shelves stocked and orders moving smoothly.',
    accent: 'Actionable alerts • Inventory clarity • confident restocking',
  },
]

function Home() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [activePreview, setActivePreview] = useState(0)
  const [activeSlide, setActiveSlide] = useState(0)
  const animatedStats = useAnimatedStats(heroStats)
  const preview = dashboardStates[activePreview]
  const selectedFeature = features[activeFeature]

  useEffect(() => {
    const previewTimer = window.setInterval(() => {
      setActivePreview((currentPreview) => (currentPreview + 1) % dashboardStates.length)
    }, 1200)

    return () => window.clearInterval(previewTimer)
  }, [])

  useEffect(() => {
    const sliderTimer = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % sliderItems.length)
    }, 4200)

    return () => window.clearInterval(sliderTimer)
  }, [])

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow">ExpressInventory</span>
          <h1>Cleaner inventory control for growing store.</h1>
          <p>
            ExpressInventory gives each user a polished personal space to manage stock, sales,
            and store data with confidence. Focus on running your business while the app keeps
            everything organized.
          </p>

          <div className="hero-actions">
            <Link to="/login" className="hero-button">
              Get Started
            </Link>
          </div>

          <div className="hero-stats">
            {heroStats.map((stat, index) => (
              <div className="hero-stat" key={stat.label}>
                <strong>
                  {animatedStats[index]}
                  {stat.suffix}
                </strong>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="hero-panel">
          <div className="hero-panel-card">
            <div className="panel-top">
              <span>Today overview</span>
              <strong>{preview.status}</strong>
            </div>
            <div className="panel-metric">
              <span>{preview.label}</span>
              <strong>{preview.value}</strong>
            </div>
            <div className="panel-bars" aria-label="Sales chart preview">
              {preview.bars.map((height, index) => (
                <span key={`${height}-${index}`} style={{ height }} />
              ))}
            </div>
            <ul>
              {preview.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="home-slider">
        <div className="slider-head">
          <p className="eyebrow">Spotlight</p>
          <h2>See the workflow built for every sale and stock decision.</h2>
        </div>

        <div className="slider-panel">
          <div className="slider-track" aria-live="polite">
            {sliderItems.map((slide, index) => (
              <article
                key={slide.headline}
                className={`slider-item ${index === activeSlide ? 'active' : ''}`}
                aria-hidden={index !== activeSlide}
              >
                <span className="slider-label">{slide.headline}</span>
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
                <strong>{slide.accent}</strong>
              </article>
            ))}
          </div>

          <div className="slider-footer">
            <div className="slider-controls">
              <button
                type="button"
                className="slider-button"
                onClick={() => setActiveSlide((current) => (current - 1 + sliderItems.length) % sliderItems.length)}
                aria-label="Previous spotlight"
              >
                ← Previous
              </button>
              <button
                type="button"
                className="slider-button slider-button-primary"
                onClick={() => setActiveSlide((current) => (current + 1) % sliderItems.length)}
                aria-label="Next spotlight"
              >
                Next →
              </button>
            </div>

            <div className="slider-dots">
              {sliderItems.map((slide, index) => (
                <button
                  key={slide.headline}
                  type="button"
                  className={`slider-dot ${index === activeSlide ? 'active' : ''}`}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-head">
          <p className="eyebrow">Core workflow</p>
          <h2>Everything your inventory ecosystem needs</h2>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={<FeatureIcon type={feature.icon} />}
              title={feature.title}
              description={feature.description}
              active={index === activeFeature}
              onSelect={() => setActiveFeature(index)}
            />
          ))}
        </div>

        <div className="feature-spotlight">
          <span>Selected workflow</span>
          <strong>{selectedFeature.title}</strong>
          <p>{selectedFeature.description}</p>
        </div>
      </section>

      <section className="choose-section">
        <div className="choose-layout">
          <div className="choose-panel">
            <h2>Why choose ExpressInventory?</h2>
            <p>
              Designed to streamline daily operations and deliver a clean, scalable foundation for
              growing inventory businesses. ExpressInventory balances professional clarity with a
              calm user experience.
            </p>
          </div>

          <div className="benefit-panel">
            <div className="benefits-list">
              {benefits.map((benefit) => (
                <div className="benefit-card" key={benefit}>
                  <span className="benefit-dot" />
                  <p>{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <span>ExpressInventory</span> - {new Date().getFullYear()} ExpressInventory. All rights reserved.
      </footer>
    </div>
  )
}

function useAnimatedStats(stats) {
  const targets = useMemo(() => stats.map((stat) => stat.target), [stats])
  const [values, setValues] = useState(() => targets.map(() => 0))

  useEffect(() => {
    let frameId = 0
    const start = performance.now()
    const duration = 950

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      setValues(targets.map((target) => Math.round(target * easedProgress)))

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate)
      }
    }

    frameId = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frameId)
  }, [targets])

  return values.map((value) => value.toLocaleString())
}

function FeatureIcon({ type }) {
  const icons = {
    box: (
      <>
        <path d="m4 7 8-4 8 4-8 4-8-4Z" />
        <path d="m4 7 8 4v10L4 17V7Z" />
        <path d="m20 7-8 4v10l8-4V7Z" />
      </>
    ),
    trend: (
      <>
        <path d="M4 17 9 12l4 4 7-8" />
        <path d="M15 8h5v5" />
      </>
    ),
    chart: (
      <>
        <path d="M5 20V10" />
        <path d="M12 20V4" />
        <path d="M19 20v-7" />
      </>
    ),
    tenant: (
      <>
        <path d="M4 20V7l8-4 8 4v13" />
        <path d="M9 20v-6h6v6" />
        <path d="M8 9h.01M12 9h.01M16 9h.01" />
      </>
    ),
    user: (
      <>
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    bolt: <path d="m13 2-8 12h6l-1 8 9-13h-6V2Z" />,
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {icons[type]}
    </svg>
  )
}

export default Home
