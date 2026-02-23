/**
 * useTour Hook
 *
 * Orchestrates the product tour: scroll-into-view, rect tracking,
 * keyboard navigation, and step progression.
 */

import { useEffect, useCallback, useState, useRef } from 'react'
import { useStore } from '@/store/useStore'
import { listTourSteps, detailTourSteps, type TourStep } from '@/lib/tourSteps'

interface TargetRect {
  top: number
  left: number
  width: number
  height: number
}

export function useTour() {
  const {
    tourActive,
    tourPhase,
    tourStep,
    nextTourStep,
    prevTourStep,
    skipTour,
    completeTour,
  } = useStore()

  const [targetRect, setTargetRect] = useState<TargetRect | null>(null)
  const animFrameRef = useRef<number>(0)

  // Resolve active step list
  const steps: TourStep[] =
    tourPhase === 'list'
      ? listTourSteps
      : tourPhase === 'detail'
        ? detailTourSteps
        : []

  const currentStep = steps[tourStep] ?? null
  const isLastStep = tourStep >= steps.length - 1
  const totalSteps = steps.length

  // Measure target element rect with padding
  const updateRect = useCallback(() => {
    if (!currentStep) {
      setTargetRect(null)
      return
    }

    const el = document.querySelector(currentStep.target)
    if (!el) {
      setTargetRect(null)
      return
    }

    const rect = el.getBoundingClientRect()
    const padding = currentStep.spotlightPadding ?? 8
    setTargetRect({
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    })
  }, [currentStep])

  // Scroll target into view + run beforeStep
  useEffect(() => {
    if (!tourActive || !currentStep) return

    // Run beforeStep if defined
    currentStep.beforeStep?.()

    // Small delay to let DOM update from beforeStep
    const timeout = setTimeout(() => {
      const el = document.querySelector(currentStep.target)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        // Wait for scroll to settle before measuring
        setTimeout(updateRect, 350)
      } else {
        updateRect()
      }
    }, 100)

    return () => clearTimeout(timeout)
  }, [tourActive, tourStep, currentStep, updateRect])

  // Continuously track rect (handles resize, scroll, layout shifts)
  useEffect(() => {
    if (!tourActive || !currentStep) return

    const track = () => {
      updateRect()
      animFrameRef.current = requestAnimationFrame(track)
    }
    animFrameRef.current = requestAnimationFrame(track)

    return () => cancelAnimationFrame(animFrameRef.current)
  }, [tourActive, currentStep, updateRect])

  // Keyboard navigation
  useEffect(() => {
    if (!tourActive) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        skipTour()
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault()
        if (isLastStep) {
          completeTour()
        } else {
          nextTourStep()
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevTourStep()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [tourActive, isLastStep, skipTour, completeTour, nextTourStep, prevTourStep])

  return {
    tourActive,
    tourPhase,
    currentStep,
    targetRect,
    tourStep,
    totalSteps,
    isLastStep,
    next: isLastStep ? completeTour : nextTourStep,
    prev: prevTourStep,
    skip: skipTour,
  }
}
