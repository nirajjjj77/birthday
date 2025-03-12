"use client"

import { useEffect } from "react"
import React from "react"

export default function BirthdayWish() {
  useEffect(() => {
    const appHeight = () => {
      const doc = document.documentElement
      doc.style.setProperty('--app-height', `${window.innerHeight}px`)
    }
    window.addEventListener('resize', appHeight)
    appHeight()
    // Create a star shape SVG - performance optimized
    function createStarSVG(size: number, color: string, opacity: number) {
      const points: string[] = []
      const outerRadius = size / 2
      const innerRadius = outerRadius * 0.4
      const numPoints = 5

      for (let i = 0; i < numPoints * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius
        const angle = (Math.PI / numPoints) * i
        const x = radius * Math.sin(angle)
        const y = -radius * Math.cos(angle)
        points.push(`${x},${y}`)
      }

      return `<svg width="${size}" height="${size}" viewBox="${-outerRadius} ${-outerRadius} ${size} ${size}">
          <polygon points="${points.join(" ")}" fill="${color}" opacity="${opacity}" />
      </svg>`
    }

    // Create bokeh particles and stars - responsive version
    function createBokehEffect() {
      const container = document.getElementById("bokeh-container")
      if (!container) return // Safety check

      container.innerHTML = "" // Clear any existing elements

      // Determine device capacity and adjust particle count
      // Reduce particles for mobile/low-powered devices
      const isMobile = window.innerWidth <= 768
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024

      // Adjust particle count based on device
      let totalParticles = 60 // Default
      if (isMobile) totalParticles = 40
      else if (isTablet) totalParticles = 50

      const numberOfCircles = Math.floor(totalParticles / 2)
      const numberOfStars = Math.floor(totalParticles / 2)

      // Responsive grid size
      const gridCols = isMobile ? 4 : isTablet ? 5 : 6
      const gridRows = isMobile ? 4 : isTablet ? 5 : 6

      const cellWidth = window.innerWidth / gridCols
      const cellHeight = window.innerHeight / gridRows

      // Create grid positions array with slight randomization
      const gridPositions: { x: number; y: number }[] = []
      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          gridPositions.push({
            x: col * cellWidth + (Math.random() * cellWidth * 0.8 + cellWidth * 0.1),
            y: row * cellHeight + (Math.random() * cellHeight * 0.8 + cellHeight * 0.1),
          })
        }
      }

      // Shuffle the grid positions to mix circles and stars
      for (let i = gridPositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[gridPositions[i], gridPositions[j]] = [gridPositions[j], gridPositions[i]]
      }

      // Memory optimization - create DocumentFragment
      const fragment = document.createDocumentFragment()

      // Create circular bokeh particles
      for (let i = 0; i < numberOfCircles; i++) {
        const bokeh = document.createElement("div")
        bokeh.classList.add("bokeh")

        // Scale sizes based on device
        const baseSize = isMobile ? 6 : isTablet ? 8 : 10
        const sizeRange = isMobile ? 20 : isTablet ? 25 : 30
        const size = Math.random() * sizeRange + baseSize

        bokeh.style.width = `${size}px`
        bokeh.style.height = `${size}px`

        // Use grid positions for even distribution
        const posIndex = i % gridPositions.length
        const posX = gridPositions[posIndex].x
        const posY = gridPositions[posIndex].y
        bokeh.style.left = `${posX}px`
        bokeh.style.top = `${posY}px`

        // Random opacity
        const opacity = Math.random() * 0.6 + 0.2
        bokeh.style.opacity = opacity.toString()

        // Add slight variety to the white color
        const hue = Math.random() * 30
        const saturation = Math.random() * 20
        const lightness = 90 + Math.random() * 10
        bokeh.style.background = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`

        fragment.appendChild(bokeh)

        // Use requestAnimationFrame for smoother animation
        requestAnimationFrame(() => {
          animateParticle(bokeh, posX, posY, size)
        })
      }

      // Create star-shaped bokeh particles
      for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement("div")
        star.classList.add("star")

        // Scale sizes based on device
        const baseSize = isMobile ? 10 : isTablet ? 12 : 15
        const sizeRange = isMobile ? 20 : isTablet ? 25 : 30
        const size = Math.random() * sizeRange + baseSize

        // Use grid positions for even distribution (offset from circles)
        const posIndex = (i + numberOfCircles) % gridPositions.length
        const posX = gridPositions[posIndex].x
        const posY = gridPositions[posIndex].y
        star.style.left = `${posX}px`
        star.style.top = `${posY}px`

        // Random opacity
        const opacity = Math.random() * 0.6 + 0.3

        // Add slight yellow/gold tint to stars
        const hue = Math.random() * 40 + 40 // 40-80 (yellow range)
        const saturation = Math.random() * 40 + 60 // 60-100%
        const lightness = 80 + Math.random() * 20 // 80-100%
        const color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`

        // Set star content using SVG
        star.innerHTML = createStarSVG(size, color, opacity)

        fragment.appendChild(star)

        // Use requestAnimationFrame for smoother animation
        requestAnimationFrame(() => {
          animateParticle(star, posX, posY, size, true)
        })
      }

      // Add all particles at once for better performance
      container.appendChild(fragment)
    }

    // Animate a single particle (circle or star) - performance optimized
    function animateParticle(
      element: HTMLElement,
      initialX: number,
      initialY: number,
      originalSize: number,
      isStarEnhanced = false,
    ) {
      if (!element || !element.parentNode) return // Safety check

      // Adapt animation complexity based on device performance
      const isLowPower = window.innerWidth <= 768

      // Enhanced movement range (in pixels) - scale for different screen sizes
      const screenSizeMultiplier = Math.min(window.innerWidth, window.innerHeight) / 1000
      const rangeX = Math.random() * 30 + 15 * screenSizeMultiplier
      const rangeY = Math.random() * 30 + 15 * screenSizeMultiplier

      // Adjust speeds based on device capability
      const speedMultiplier = isLowPower ? 0.7 : 1
      const speedX = (0.0015 + Math.random() * 0.002) * speedMultiplier
      const speedY = (0.0015 + Math.random() * 0.002) * speedMultiplier

      // Starting phase (randomized)
      let phase = Math.random() * Math.PI * 2

      // Twinkling variables - adjusted for device capability
      let sparkleTime = Math.random() * 800
      const sparkleInterval = isLowPower
        ? isStarEnhanced
          ? Math.random() * 2000 + 1000
          : Math.random() * 3000 + 1500
        : isStarEnhanced
          ? Math.random() * 1000 + 500
          : Math.random() * 2000 + 1000

      // Track if this is a star
      const isStar = element.classList.contains("star")

      // Use timestamp-based animation for more consistent frame rate
      let lastTimestamp = performance.now()

      // Animate this particle
      function animate(timestamp: number) {
        // Check if element still exists in DOM
        if (!element || !element.parentNode) return

        // Calculate deltaTime for smoother animation regardless of frame rate
        const deltaTime = timestamp - lastTimestamp
        lastTimestamp = timestamp

        // Only update if enough time has passed (optimization)
        if (deltaTime > 0) {
          // Scale phase increment by deltaTime for consistent speed
          phase += 0.01 * (deltaTime / 16)
          sparkleTime += deltaTime

          // Calculate new position with enhanced range
          const newX = initialX + Math.sin(phase * speedX) * rangeX
          const newY = initialY + Math.cos(phase * speedY) * rangeY

          // Performance optimization: use transform instead of left/top
          const translateX = newX - initialX
          const translateY = newY - initialY
          element.style.transform = isStar
            ? `translate(${translateX}px, ${translateY}px) rotate(${Math.sin(phase) * 20}deg)`
            : `translate(${translateX}px, ${translateY}px)`

          // Size pulsing only for circles (skip for stars as they use SVG)
          if (!isStar) {
            const sizeFactor = 1 + Math.sin(phase * 0.5) * 0.15
            element.style.width = `${originalSize * sizeFactor}px`
            element.style.height = `${originalSize * sizeFactor}px`
          }

          // Enhanced twinkling effect
          if (sparkleTime >= sparkleInterval) {
            // Apply appropriate twinkling based on device capability
            if (isStar) {
              const brightenAmount = Math.random() * 0.5 + 0.4
              const flashDuration = 300 + Math.random() * 500

              // Simplified twinkling for low-power devices
              if (isLowPower) {
                const polygon = element.querySelector("polygon")
                if (polygon) {
                  const currentOpacity = Number.parseFloat(polygon.getAttribute("opacity") || "0.5")
                  polygon.setAttribute("opacity", Math.min(currentOpacity + brightenAmount, 0.95).toString())

                  // Basic scale effect
                  element.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${Math.sin(phase) * 20}deg) scale(1.2)`

                  // Reset after flash
                  setTimeout(() => {
                    if (polygon && polygon.parentNode) {
                      polygon.setAttribute("opacity", currentOpacity.toString())
                      element.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${Math.sin(phase) * 20}deg) scale(1)`
                    }
                  }, flashDuration)
                }
              } else {
                // Multi-phase twinkling for more powerful devices
                const twinkleAnimation = () => {
                  const polygon = element.querySelector("polygon")
                  if (polygon) {
                    const currentOpacity = Number.parseFloat(polygon.getAttribute("opacity") || "0.5")
                    const rotation = Math.sin(phase) * 20

                    // First flash
                    polygon.setAttribute("opacity", Math.min(currentOpacity + brightenAmount, 0.95).toString())
                    element.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg) scale(1.3)`
                    element.style.filter = `blur(1px) drop-shadow(0 0 ${originalSize / 3}px rgba(255, 255, 255, 0.9))`

                    // Second phase - dim slightly
                    setTimeout(() => {
                      if (polygon && polygon.parentNode) {
                        polygon.setAttribute("opacity", Math.min(currentOpacity + brightenAmount / 2, 0.7).toString())
                        element.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg) scale(1.15)`
                        element.style.filter = `blur(1px) drop-shadow(0 0 ${originalSize / 5}px rgba(255, 255, 255, 0.7))`

                        // Final phase - second flash
                        setTimeout(() => {
                          if (polygon && polygon.parentNode) {
                            polygon.setAttribute(
                              "opacity",
                              Math.min(currentOpacity + brightenAmount * 0.8, 0.9).toString(),
                            )
                            element.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg) scale(1.25)`
                            element.style.filter = `blur(1px) drop-shadow(0 0 ${originalSize / 4}px rgba(255, 255, 255, 0.85))`

                            // Return to normal
                            setTimeout(() => {
                              if (polygon && polygon.parentNode) {
                                polygon.setAttribute("opacity", currentOpacity.toString())
                                element.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg) scale(1)`
                                element.style.filter = "blur(1px)"
                              }
                            }, flashDuration * 0.3)
                          }
                        }, flashDuration * 0.3)
                      }
                    }, flashDuration * 0.2)
                  }
                }

                twinkleAnimation()
              }
            } else {
              // Circles have more subtle sparkling
              const brightenAmount = Math.random() * 0.35 + 0.25
              const flashDuration = 200 + Math.random() * 300

              const currentOpacity = Number.parseFloat(element.style.opacity || "0.5")
              element.style.opacity = `${Math.min(currentOpacity + brightenAmount, 0.9)}`
              element.style.boxShadow = `0 0 ${originalSize / 2}px rgba(255, 255, 255, 0.8)`

              setTimeout(() => {
                if (element && element.parentNode) {
                  element.style.opacity = currentOpacity.toString()
                  element.style.boxShadow = "none"
                }
              }, flashDuration)
            }

            // Reset timer
            sparkleTime = 0
          }
        }

        // Continue animation loop
        requestAnimationFrame(animate)
      }

      // Start animation
      requestAnimationFrame(animate)
    }

    // NEW FIREWORKS EFFECT - LAUNCHES FROM BOTTOM
    function createFireworks() {
      const container = document.getElementById("fireworks-container")
      if (!container) return // Safety check

      container.innerHTML = ""
      container.classList.add("active")

      // Determine device capacity
      const isMobile = window.innerWidth <= 768
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024

      // Adjust firework count based on device
      const fireworkCount = isMobile ? 8 : isTablet ? 12 : 16

      // Launch multiple fireworks with delays
      for (let i = 0; i < fireworkCount; i++) {
        setTimeout(() => {
          launchRocket(container)
        }, i * 350) // Staggered launch timing
      }

      // After 7 seconds, fade out fireworks
      setTimeout(() => {
        if (container) {
          container.classList.remove("active")
          // After fade out animation completes, clear the container
          setTimeout(() => {
            if (container) {
              container.innerHTML = ""
            }
          }, 500)
        }
      }, 7000)
    }

    // New function to create and launch rockets
    function launchRocket(container: HTMLElement) {
      if (!container) return // Safety check

      // Create rocket launch position at bottom of screen
      const startX = Math.random() * window.innerWidth
      const startY = window.innerHeight

      // Random target position (where rocket will explode)
      const targetX = startX + (Math.random() * 100 - 50) // slight x-drift
      const targetY = window.innerHeight * Math.random() * 0.6 // top 60% of screen

      // Create rocket element
      const rocket = document.createElement("div")
      rocket.classList.add("rocket")
      rocket.style.left = `${startX}px`
      rocket.style.bottom = "0px"

      // Add rocket to container
      container.appendChild(rocket)

      // Create rocket trail effect
      addRocketTrail(rocket, startX)

      // Launch animation variables
      const launchDuration = 700 + Math.random() * 500 // 700-1200ms
      const startTime = performance.now()

      // Animate rocket launch
      function animateRocket(timestamp: number) {
        if (!rocket || !rocket.parentNode) return // Safety check

        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / launchDuration, 1)

        // Easing function for natural motion
        const eased = 1 - Math.pow(1 - progress, 3) // cubic ease-out

        // Calculate current position
        const currentX = startX + (targetX - startX) * eased
        const currentY = startY - (startY - targetY) * eased

        // Apply position
        rocket.style.transform = `translate(${currentX - startX}px, ${-(startY - currentY)}px) rotate(${(Math.random() - 0.5) * 5}deg)`

        // Continue animation until complete
        if (progress < 1) {
          requestAnimationFrame(animateRocket)
        } else {
          // Rocket reached destination - create explosion
          createExplosion(container, currentX, currentY)

          // Remove rocket
          if (rocket && rocket.parentNode) {
            container.removeChild(rocket)
          }
        }
      }

      // Start rocket animation
      requestAnimationFrame(animateRocket)
    }

    // Add trailing particles behind rocket
    function addRocketTrail(rocket: HTMLElement, rocketX: number) {
      const trailInterval = 15 // ms between trail particles
      const trailDuration = 300 // how long trail particles last

      // Create trail at intervals
      const trailTimer = setInterval(() => {
        if (!rocket.parentNode) {
          clearInterval(trailTimer)
          return
        }

        // Get current rocket position
        const rocketRect = rocket.getBoundingClientRect()
        const x = rocketRect.left + rocketRect.width / 2
        const y = rocketRect.top + rocketRect.height

        // Create trail particle
        const trail = document.createElement("div")
        trail.classList.add("rocket-trail")
        trail.style.left = `${x}px`
        trail.style.top = `${y}px`
        trail.style.width = `${4 + Math.random() * 3}px`
        trail.style.height = `${4 + Math.random() * 3}px`

        // Random color for trail (yellow/orange)
        const hue = Math.random() * 30 + 30 // 30-60 (orange/yellow)
        trail.style.backgroundColor = `hsla(${hue}, 100%, 70%, 0.8)`

        rocket.parentNode.appendChild(trail)

        // Animate trail particle
        let opacity = 0.8
        const fadeInterval = 10
        const fadeStep = opacity / (trailDuration / fadeInterval)

        const fadeTimer = setInterval(() => {
          opacity -= fadeStep
          trail.style.opacity = opacity.toString()

          if (opacity <= 0) {
            clearInterval(fadeTimer)
            if (trail.parentNode) {
              trail.parentNode.removeChild(trail)
            }
          }
        }, fadeInterval)
      }, trailInterval)
    }

    // Create explosion when rocket reaches destination
    function createExplosion(container: HTMLElement, x: number, y: number) {
      // Determine device capacity
      const isMobile = window.innerWidth <= 768
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024

      // Number of particles in explosion
      const particleCount = isMobile ? 40 : isTablet ? 60 : 80

      // Create explosion container
      const explosion = document.createElement("div")
      explosion.classList.add("firework")
      explosion.style.left = `${x}px`
      explosion.style.top = `${y}px`

      container.appendChild(explosion)

      // Create particles
      for (let i = 0; i < particleCount; i++) {
        createExplosionParticle(explosion)
      }

      // Remove explosion container after animation completes
      setTimeout(() => {
        if (explosion.parentNode === container) {
          container.removeChild(explosion)
        }
      }, 2500)
    }

    // Create individual explosion particles
    function createExplosionParticle(parent: HTMLElement) {
      if (!parent) return // Safety check

      const isMobile = window.innerWidth <= 768;

      const particle = document.createElement("div")
      particle.classList.add("firework-particle")

      // Particle size - increased for better visibility
      const size = Math.random() * 8 + 4 // Slightly larger particles
      const angle = Math.random() * Math.PI * 2
      const velocity = isMobile && window.innerHeight > window.innerWidth 
        ? Math.random() * 7 + 3 // More vertical spread for portrait phones
        : Math.random() * 8 + 4;

      // Brighter colors with higher lightness
      const hue = Math.random() * 60 + [0, 120, 240][Math.floor(Math.random() * 3)]
      const saturation = 90 + Math.random() * 10
      const lightness = 70 + Math.random() * 20 // Increased lightness

      // Set initial styles with stronger glow effect
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
      particle.style.boxShadow = `0 0 ${size * 6}px hsl(${hue}, ${saturation}%, ${lightness}%)` // Stronger glow

      parent.appendChild(particle)

      // Animate particle
      let opacity = 1
      let posX = 0
      let posY = 0
      const gravity = 0.04
      const vx = Math.cos(angle) * velocity
      let vy = Math.sin(angle) * velocity
      let lastTimestamp = performance.now()

      // Add trail effect
      const trail: { x: number; y: number }[] = []
      const maxTrailLength = 5

      function animateParticle(timestamp: number) {
        const deltaTime = (timestamp - lastTimestamp) / 16
        lastTimestamp = timestamp

        // Update position with gravity
        vy += gravity * deltaTime
        posX += vx * deltaTime
        posY += vy * deltaTime

        // Add current position to trail
        trail.push({ x: posX, y: posY })
        if (trail.length > maxTrailLength) {
          trail.shift()
        }

        // Slower fade-out effect
        opacity -= 0.007 * deltaTime

        // Apply changes
        particle.style.transform = `translate(${posX}px, ${posY}px)`
        particle.style.opacity = opacity.toString()

        // Create trail effect
        if (trail.length > 1 && opacity > 0.3) {
          // Only add trail for brighter particles
          for (let i = 0; i < trail.length - 1; i++) {
            const trailOpacity = opacity * (i / trail.length)
            const trailSize = size * 0.7 * (i / trail.length)

            if (trailOpacity > 0.1) {
              // Only draw visible trails
              const trailElement = document.createElement("div")
              trailElement.style.position = "absolute"
              trailElement.style.width = `${trailSize}px`
              trailElement.style.height = `${trailSize}px`
              trailElement.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
              trailElement.style.boxShadow = `0 0 ${trailSize * 2}px hsl(${hue}, ${saturation}%, ${lightness}%)`
              trailElement.style.borderRadius = "50%"
              trailElement.style.opacity = trailOpacity.toString()
              trailElement.style.transform = `translate(${trail[i].x}px, ${trail[i].y}px)`

              parent.appendChild(trailElement)

              // Remove trail element after short delay
              setTimeout(() => {
                if (trailElement.parentNode === parent) {
                  parent.removeChild(trailElement)
                }
              }, 200)
            }
          }
        }

        // Continue animation until faded out
        if (opacity > 0) {
          requestAnimationFrame(animateParticle)
        } else {
          if (particle && particle.parentNode === parent) {
            // Add safety check
            parent.removeChild(particle)
          }
        }
      }

      requestAnimationFrame(animateParticle)
    }

    // Add click event to show fireworks and then reveal the second message
    function setupMessageBox() {
      const mainMessage = document.getElementById("main-message")
      const secondMessage = document.getElementById("second-message")
      const thirdMessage = document.getElementById("third-message")

      if (!mainMessage || !secondMessage || !thirdMessage) return // Add safety check

      // Initially hide the third message completely
      thirdMessage.style.display = "none";

      mainMessage.addEventListener("click", () => {
        // First show fireworks
        createFireworks()

        // After 5 seconds, show the second message
        setTimeout(() => {
          secondMessage.classList.add("visible")
           
          // After 4 more seconds, hide the second message and show the third message
          setTimeout(() => {
            secondMessage.classList.remove("visible")
        
            // Add a small delay before showing the third message for smoother transition
            setTimeout(() => {
              // Make sure third message is in the same DOM position as second
              secondMessage.style.display = "none";
              thirdMessage.style.display = ""; // Reset to default display value
              thirdMessage.classList.add("visible")
            }, 300)
          }, 4000)
        }, 5000)
      })
    }

    // Initialize and handle loading
    function init() {
      // Create bokeh effect
      createBokehEffect()

      // Show first message box immediately
      const mainMessage = document.getElementById("main-message")
      if (mainMessage) {
        mainMessage.classList.add("visible")
      }

      // Setup message box click handler
      setupMessageBox()

      // Remove loading screen
      setTimeout(() => {
        const loadingScreen = document.getElementById("loading")
        if (loadingScreen) {
          // Fixed: loadingscreen → loadingScreen
          loadingScreen.style.opacity = "0"
          setTimeout(() => {
            loadingScreen.style.display = "none"
          }, 500)
        }
      }, 500)

      // Setup resize listener
      window.addEventListener("resize", handleResize)
    }

    // Debounced window resize handler
    let resizeTimeout: NodeJS.Timeout
    function handleResize() {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        createBokehEffect()
      }, 250)
    }

    // Handle visibility change to pause/resume animations
    let isPageVisible = true
    document.addEventListener("visibilitychange", () => {
      isPageVisible = document.visibilityState === "visible"

      // If page becomes visible again and was previously hidden, recreate effect
      if (isPageVisible && !document.hidden) {
        createBokehEffect()
      }
    })

    // Check if document is already loaded
    if (document.readyState === "complete") {
      init()
    } else {
      window.addEventListener("load", init)
    }
  }, [])

  return (
    <>
      <div className="loading" id="loading">
        <div className="loading-spinner"></div>
      </div>

      <div className="bokeh-container" id="bokeh-container"></div>

      <div className="fireworks-container" id="fireworks-container"></div>

      <div className="messages-container">
        <div className="message-box" id="main-message">
          <span className="emoji">🎁</span>
          <span className="text">I have a small surprise for you</span>
          <span className="emoji">✨</span>
        </div>

        <div className="secondary-messages" style={{ position: 'relative', height: '100px', width: '100%'}}>
          <div className="message-box second-box" id="second-message">
            <span className="text">Are you ready?</span>
          </div>
          <div className="message-box second-box" id="third-message">
            <span className="text">Let's begin...</span>
          </div>
        </div>
      </div>
    </>
  )
}

