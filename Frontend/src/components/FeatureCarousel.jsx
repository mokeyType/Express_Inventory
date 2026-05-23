import { useEffect, useRef, useState } from 'react'
import FeatureCard from './FeatureCard'

function FeatureCarousel({ items }) {
  const containerRef = useRef(null)
  const animationRef = useRef(null)
  const lastTimeRef = useRef(0)
  const pauseTimeoutRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)

  const featureItems = [...items, ...items]

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const speed = 0.03

    const step = (time) => {
      if (!container) return
      const deltaTime = time - lastTimeRef.current
      lastTimeRef.current = time

      if (!isPaused) {
        container.scrollLeft += deltaTime * speed
        const loopPoint = container.scrollWidth / 2
        if (container.scrollLeft >= loopPoint) {
          container.scrollLeft -= loopPoint
        }
      }

      animationRef.current = requestAnimationFrame(step)
    }

    animationRef.current = requestAnimationFrame((time) => {
      lastTimeRef.current = time
      step(time)
    })

    return () => cancelAnimationFrame(animationRef.current)
  }, [isPaused])

  useEffect(() => {
    return () => {
      clearTimeout(pauseTimeoutRef.current)
    }
  }, [])

  const pauseAutoScroll = () => {
    setIsPaused(true)
    clearTimeout(pauseTimeoutRef.current)
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false)
    }, 1600)
  }

  const scrollByDistance = (distance) => {
    const container = containerRef.current
    if (!container) return

    pauseAutoScroll()
    container.scrollBy({ left: distance, behavior: 'smooth' })
  }

  return (
    <div className="carousel-wrapper">
      <div className="carousel-frame">
        <div className="carousel-controls">
          <button
            type="button"
            className="carousel-button"
            onClick={() => scrollByDistance(-340)}
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            type="button"
            className="carousel-button"
            onClick={() => scrollByDistance(340)}
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
        <div className="feature-carousel" ref={containerRef}>
          {featureItems.map((feature, index) => (
            <div className="carousel-slide" key={`${feature.title}-${index}`}>
              <FeatureCard
                icon={<span>{feature.icon}</span>}
                title={feature.title}
                description={feature.description}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeatureCarousel
