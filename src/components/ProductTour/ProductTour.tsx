/**
 * ProductTour Component
 *
 * A custom product tour overlay with spotlight cutout, tooltip positioning,
 * and smooth step transitions. Renders via createPortal into document.body.
 *
 * Two phases:
 * - "list": Mina samtal overview (3-4 steps)
 * - "detail": Inside a samtal (4-6 steps)
 */

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTour } from '@/hooks/use-tour'
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'

export default function ProductTour() {
  const {
    tourActive,
    currentStep,
    targetRect,
    tourStep,
    totalSteps,
    isLastStep,
    next,
    prev,
    skip,
  } = useTour()

  const [isAnimating, setIsAnimating] = useState(false)
  const [displayStep, setDisplayStep] = useState(tourStep)

  // Animate step transitions
  useEffect(() => {
    if (!tourActive) return
    setIsAnimating(true)
    const timeout = setTimeout(() => {
      setDisplayStep(tourStep)
      setIsAnimating(false)
    }, 150)
    return () => clearTimeout(timeout)
  }, [tourStep, tourActive])

  if (!tourActive || !currentStep) return null

  // Build clip-path for backdrop with spotlight cutout
  // Uses evenodd polygon: outer viewport boundary, then inner cutout in reverse
  const clipPath = targetRect
    ? `polygon(
        evenodd,
        0 0, 100% 0, 100% 100%, 0 100%, 0 0,
        ${targetRect.left}px ${targetRect.top}px,
        ${targetRect.left}px ${targetRect.top + targetRect.height}px,
        ${targetRect.left + targetRect.width}px ${targetRect.top + targetRect.height}px,
        ${targetRect.left + targetRect.width}px ${targetRect.top}px,
        ${targetRect.left}px ${targetRect.top}px
      )`
    : undefined

  // Compute tooltip position
  const tooltipStyle = computeTooltipPosition(
    targetRect,
    currentStep.placement
  )

  return createPortal(
    <div className="tour-container">
      {/* Backdrop overlay with spotlight cutout */}
      <div
        className="tour-overlay"
        style={{ clipPath }}
        onClick={skip}
        aria-hidden="true"
      />

      {/* Spotlight ring */}
      {targetRect && (
        <div
          className="tour-spotlight"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
          }}
        />
      )}

      {/* Tooltip */}
      {targetRect && (
        <div
          className={`tour-tooltip ${isAnimating ? 'tour-tooltip--stepping' : ''}`}
          style={tooltipStyle}
          role="dialog"
          aria-label={`Guide steg ${tourStep + 1} av ${totalSteps}`}
        >
          {/* Green accent bar */}
          <div className="tour-tooltip__accent-bar" />

          {/* Header with green wash background */}
          <div className="tour-tooltip__header">
            <div className="tour-tooltip__step-counter">
              <Sparkles className="w-3 h-3" />
              <span>Steg {tourStep + 1} av {totalSteps}</span>
            </div>
            <h4 className="tour-tooltip__title">{currentStep.title}</h4>

            {/* Close button */}
            <button
              onClick={skip}
              className="tour-tooltip__close"
              aria-label="Stang guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="tour-tooltip__body">
            <p className="tour-tooltip__description">{currentStep.content}</p>
          </div>

          {/* Progress dots */}
          <div className="tour-progress">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`tour-progress__dot ${
                  i === tourStep
                    ? 'tour-progress__dot--active'
                    : i < tourStep
                      ? 'tour-progress__dot--completed'
                      : ''
                }`}
              />
            ))}
          </div>

          {/* Footer with navigation */}
          <div className="tour-tooltip__footer">
            <button onClick={skip} className="tour-btn tour-btn--skip">
              Hoppa over
            </button>

            <div className="tour-tooltip__nav">
              {tourStep > 0 && (
                <button onClick={prev} className="tour-btn tour-btn--ghost">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Tillbaka
                </button>
              )}
              <button
                onClick={next}
                className={`tour-btn ${isLastStep ? 'tour-btn--finish' : 'tour-btn--primary'}`}
              >
                {isLastStep ? 'Klar!' : 'Nasta'}
                {!isLastStep && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  )
}

/** Compute absolute position for tooltip based on placement and target rect */
function computeTooltipPosition(
  rect: { top: number; left: number; width: number; height: number } | null,
  placement: 'top' | 'bottom' | 'left' | 'right'
): React.CSSProperties {
  if (!rect) return {}

  const GAP = 14
  const TOOLTIP_WIDTH = 360

  switch (placement) {
    case 'bottom':
      return {
        top: rect.top + rect.height + GAP,
        left: Math.max(
          16,
          Math.min(
            rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2,
            window.innerWidth - TOOLTIP_WIDTH - 16
          )
        ),
      }
    case 'top':
      return {
        bottom: window.innerHeight - rect.top + GAP,
        left: Math.max(
          16,
          Math.min(
            rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2,
            window.innerWidth - TOOLTIP_WIDTH - 16
          )
        ),
      }
    case 'left':
      return {
        top: Math.max(16, rect.top + rect.height / 2 - 80),
        right: window.innerWidth - rect.left + GAP,
      }
    case 'right':
      return {
        top: Math.max(16, rect.top + rect.height / 2 - 80),
        left: rect.left + rect.width + GAP,
      }
    default:
      return {
        top: rect.top + rect.height + GAP,
        left: rect.left,
      }
  }
}
