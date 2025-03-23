"use client"

import React, { useState, useEffect, useRef } from "react";
import { Analytics } from "@vercel/analytics/react"

export default function BirthdayWish() {
  // Add a state variable to track score
  const [score, setScore] = useState(0);
  const gameActiveRef = useRef(false);
  // Add this new audio ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Add this new function to create a floating music button
  function createMusicButton() {
    const existingButton = document.getElementById("music-button");
    if (existingButton) return; // Ensure only one instance exists

    const musicButton = document.createElement('button');
    let isPlaying = false; // Initial state
    
    // Check if audio is already playing
    if (audioRef.current) {
      isPlaying = !audioRef.current.paused;
    }
    
    // Set initial button text based on playback state
    musicButton.innerHTML = isPlaying ? "⏸ Pause Music" : "🎵 Play Music";
    musicButton.className = 'music-button';
    musicButton.id = "music-button"; // Add an ID
    
    // Style the button
    musicButton.style.position = 'fixed';
    musicButton.style.bottom = '20px';
    musicButton.style.left = '20px';
    musicButton.style.zIndex = '1000';
    musicButton.style.background = 'rgba(255, 82, 168, 0.9)';
    musicButton.style.color = 'white';
    musicButton.style.border = 'none';
    musicButton.style.borderRadius = '30px';
    musicButton.style.padding = '12px 20px';
    musicButton.style.fontSize = '16px';
    musicButton.style.fontWeight = 'bold';
    musicButton.style.cursor = 'pointer';
    musicButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    musicButton.style.transition = 'all 0.3s ease';

    // Check if it's a mobile device
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Apply mobile-specific styles
    if (isMobile) {
      musicButton.style.padding = '8px 16px';
      musicButton.style.fontSize = '14px';
      musicButton.style.bottom = '15px';
      musicButton.style.left = '15px';
    }
    
    // Add hover effect
    musicButton.onmouseenter = () => {
      musicButton.style.transform = 'scale(1.05)';
      musicButton.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
    };
    
    musicButton.onmouseleave = () => {
      musicButton.style.transform = 'scale(1)';
      musicButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    };

    musicButton.addEventListener("click", () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause(); // Pause music
          musicButton.innerHTML = "▶️ Play Music";
        } else {
          audioRef.current.play().catch((err) => {
            console.error("Failed to play audio:", err);
          });
          musicButton.innerHTML = "⏸ Pause Music";
        }
        isPlaying = !isPlaying; // Toggle play state
      }
    });

    // Handle window resize to adjust styles dynamically
    window.addEventListener('resize', () => {
      const isMobileNow = window.matchMedia('(max-width: 768px)').matches;
  
      if (isMobileNow) {
        musicButton.style.padding = '8px 16px';
        musicButton.style.fontSize = '14px';
        musicButton.style.bottom = '15px';
        musicButton.style.left = '15px';
      } else {
        musicButton.style.padding = '12px 20px';
        musicButton.style.fontSize = '16px';
        musicButton.style.bottom = '20px';
        musicButton.style.left = '20px';
      }
    });
    
    document.body.appendChild(musicButton);
  }
  
  useEffect(() => {
    const appHeight = () => {
      const doc = document.documentElement
      doc.style.setProperty('--app-height', `${window.innerHeight}px`)
    }
    window.addEventListener('resize', appHeight)
    appHeight()

    // Try to load from your public folder, fallback to an external source
    const audioSrc = "/birthday-song.mp3"; // Public folder path
    const fallbackSrc = "https://raw.githubusercontent.com/nirajjjj77/birthday/main/audio/birthday-song.mp3"; // External backup URL

    const audio = new Audio(audioSrc);
    audio.loop = true; // Set to loop continuously
    audio.volume = 0.7; // Set volume to 70%

    // Handle error and switch to fallback source
    audio.onerror = () => {
      console.log("Failed to load audio from project, trying fallback");
      audio.src = fallbackSrc;
    };

    audioRef.current = audio;
     
    // Try to play (may be blocked by browser)
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Autoplay prevented:", error);
      });
    }

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
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
      const isLowPower = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : isMobile;

      // Adjust particle count based on device
      let totalParticles = 60; // Default
      if (isMobile) totalParticles = 30;
      else if (isTablet) totalParticles = 45;
      if (isLowPower) totalParticles = Math.floor(totalParticles * 0.7);

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

    function createInteractiveBirthdayCard() {
      // Try to ensure music is playing when transitioning to the card
      if (audioRef.current) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Audio play prevented during card transition:", error);
          });
        }
      }

      // Clear the body first
      document.body.innerHTML = '';
      
      // Create card container
      const cardContainer = document.createElement('div');
      cardContainer.className = 'birthday-card-container';
      
      // Create the card with front and inside
      const card = document.createElement('div');
      card.className = 'birthday-card';
      
      // Create card front
      const cardFront = document.createElement('div');
      cardFront.className = 'card-front';
      cardFront.innerHTML = `
        <div class="ribbon"></div>
        <div class="cake">
          <div class="cake-base"></div>
          <div class="cake-middle"></div>
          <div class="cake-top"></div>
          <div class="candle">
            <div class="flame"></div>
          </div>
        </div>
        <h2>Happy 18th Birthday!</h2>
        <p>Click to open</p>
      `;
      
      // Create card inside
      const cardInside = document.createElement('div');
      cardInside.className = 'card-inside';
      cardInside.innerHTML = `
        <div class="inside-text">
          <h2>Happy Birthday Motiii!</h2>
          <p class="birthday-wish">Congratulations! You just turned up 18. Hope your previous eighteen years have been wonderful, and may the upcoming years be even more amazing and full of happiness.</p>
          <p class="birthday-wish">Wishing you a day filled with happiness and a year filled with joy.<br>Enjoy your day....</p>
          <p class="birthday-signature">Again, Happy Birthday!</p>
        </div>
        <div class="card-decorations">
          <div class="sparkle sparkle-1">✨</div>
          <div class="sparkle sparkle-2">✨</div>
          <div class="sparkle sparkle-3">✨</div>
          <div class="sparkle sparkle-4">✨</div>
        </div>
      `;
      
      // Add elements to DOM
      card.appendChild(cardFront);
      card.appendChild(cardInside);
      cardContainer.appendChild(card);
      document.body.appendChild(cardContainer);

      createMusicButton(); // Add music button

      // Add continue button after 5 seconds
      setTimeout(() => {
        const continueButton = document.createElement('button');
        continueButton.className = 'continue-button';
        continueButton.textContent = 'Continue';
    
        // Style the continue button
        continueButton.style.position = 'fixed';
        continueButton.style.bottom = '20px';
        continueButton.style.right = '20px';
        continueButton.style.padding = '12px 24px';
        continueButton.style.background = 'linear-gradient(135deg, #ff6b99 0%, #ff96b8 100%)';
        continueButton.style.color = 'white';
        continueButton.style.border = 'none';
        continueButton.style.borderRadius = '30px';
        continueButton.style.fontSize = '16px';
        continueButton.style.fontWeight = 'bold';
        continueButton.style.cursor = 'pointer';
        continueButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        continueButton.style.transition = 'all 0.3s ease';
        continueButton.style.zIndex = '1000';

        // Check if it's a mobile device
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
  
        // Apply mobile-specific styles
        if (isMobile) {
          continueButton.style.padding = '8px 16px';
          continueButton.style.fontSize = '14px';
          continueButton.style.bottom = '15px';
          continueButton.style.right = '15px';
        }

        // Add hover effects
        if (!('ontouchstart' in window)) {
          continueButton.onmouseenter = () => {
            continueButton.style.transform = 'scale(1.05)';
            continueButton.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
          };
    
          continueButton.onmouseleave = () => {
            continueButton.style.transform = 'scale(1)';
            continueButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
          };
        }

        // Add click handler for the continue button
        continueButton.addEventListener('click', () => {
          // Remove everything except background
          cardContainer.remove();
          continueButton.remove();

          // Create and show the cake
          const cakeContainer = document.createElement('div');
          cakeContainer.className = 'cake-container';
          cakeContainer.innerHTML = `
            <div class="cake-container">
              <div class="cake">
                <div class="cake-top"></div>
                <div class="cake-middle"></div>
                <div class="cake-bottom"></div>
                <div class="plate"></div>
                <div class="candle">
                  <div class="flame"></div>
                </div>
              </div>
              <div class="cake-sparkles"></div>
              <div class="cake-background">
                <div class="confetti"></div>
                <div class="confetti"></div>
                <div class="confetti"></div>
                <div class="confetti"></div>
                <div class="confetti"></div>
                <div class="confetti"></div>
                <div class="confetti"></div>
              </div>
              <div class="stars"></div>
              <div class="stars"></div>
              <div class="stars"></div>
              <div class="stars"></div>
            </div>
            <div class="wish-text">Make a Wish 🧙🏻‍♂️🌟</div>
          `;

          // Add cake styles
          const cakeStyles = `
            .cake-container {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              perspective: 1000px;
              width: 300px;
              height: 300px;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .cake {
              position: absolute;
              width: 250px;
              height: 200px;
              transform-style: preserve-3d;
              animation: cakeAppear 1s ease-out forwards;
              transform: translate(-50%, -50%);
            }

            @keyframes cakeAppear {
              0% { transform: translateY(50px) scale(0.5) rotateY(180deg); opacity: 0; }
              100% { transform: translateY(0) scale(1) rotateY(0); opacity: 1; }
            }

            .cake-top {
              position: absolute;
              width: 60%;
              height: 40px;
              background: linear-gradient(135deg, #ff9ecd, #ff6b99);
              border-radius: 8px;
              bottom: 110px;
              left: 20%;
              transform: translateZ(20px);
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }

            
            .cake-top::after {
              content: '';
              position: absolute;
              width: 100%;
              height: 20px;
              background: linear-gradient(135deg, #ff96b8, #ff3366);
              bottom: 0;
              border-radius: 8px;
            }

            /* Frosting decorations */
            .cake-top::before {
              content: '';
              position: absolute;
              width: 100%;
              height: 10px;
              background: white;
              top: -5px;
              border-radius: 50%;
              background: repeating-radial-gradient(circle at 10px 5px, white, white 5px, transparent 5px, transparent 10px);
            }

            .cake-middle {
              position: absolute;
              width: 80%;
              height: 50px;
              background: linear-gradient(135deg, #ffb6e1, #ff82b2);
              border-radius: 8px;
              bottom: 60px;
              left: 10%;
              transform: translateZ(10px);
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }

            .cake-middle::before {
              content: '';
              position: absolute;
              width: 100%;
              height: 15px;
              background: repeating-linear-gradient(45deg, #ff96b8, #ff96b8 10px, #ff82b2 10px, #ff82b2 20px);
              top: 10px;
            }

            /* Add sprinkles to middle layer */
            .cake-middle::after {
              content: '';
              position: absolute;
              width: 100%;
              height: 100%;
              background-image: 
                radial-gradient(circle, #ffff00 1px, transparent 1px),
                radial-gradient(circle, #00ffff 1px, transparent 1px),
                radial-gradient(circle, #ff00ff 1px, transparent 1px),
                radial-gradient(circle, #00ff00 1px, transparent 1px);
              background-size: 16px 16px;
              background-position: 0 0, 8px 8px, 4px 4px, 12px 12px;
              opacity: 0.6;
            }

            .cake-bottom {
              position: absolute;
              width: 100%;
              height: 60px;
              background: linear-gradient(135deg, #ffc6e9, #ff96b8);
              border-radius: 8px;
              bottom: 0;
              left: 0;
              transform: translateZ(0);
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }

            .cake-bottom::after {
              content: '';
              position: absolute;
              width: 100%;
              height: 20px;
              background: repeating-linear-gradient(-45deg, #ff96b8, #ff96b8 10px, #ff82b2 10px, #ff82b2 20px);
              bottom: 10px;
            }

            /* Add dripping frosting */
            .cake-bottom::before {
              content: '';
              position: absolute;
              height: 15px;
              width: 100%;
              background: 
                radial-gradient(circle at 10% 0, transparent 15px, #ffb6e1 15px),
                radial-gradient(circle at 30% 0, transparent 15px, #ffb6e1 15px),
                radial-gradient(circle at 50% 0, transparent 15px, #ffb6e1 15px),
                radial-gradient(circle at 70% 0, transparent 15px, #ffb6e1 15px),
                radial-gradient(circle at 90% 0, transparent 15px, #ffb6e1 15px);
              top: -8px;
            }

            .plate {
              position: absolute;
              width: 300px;
              height: 20px;
              background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
              border-radius: 50%;
              bottom: -14px;
              left: -25px;
              transform: translateZ(-10px);
              box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            }

            .plate::after {
              content: '';
              position: absolute;
              width: 90%;
              height: 90%;
              top: 5%;
              left: 5%;
              border-radius: 50%;
              background: linear-gradient(135deg, transparent, rgba(255,255,255,0.5));
            }

            .candle {
              position: absolute;
              width: 10px;
              height: 30px;
              background: linear-gradient(135deg, #fff5cc, #ffeb99);
              bottom: 150px;
              left: 50%;
              transform: translateX(-50%);
              border-radius: 5px;
              z-index: 5;
            }

            .candle::before {
              content: '';
              position: absolute;
              width: 100%;
              height: 5px;
              background: #ff9ecd;
              bottom: 0;
              border-radius: 5px;
            }
            
            /* Add candle details */
            .candle::after {
              content: '';
              position: absolute;
              width: 80%;
              height: 80%;
              top: 5%;
              left: 10%;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
            }

            .flame {
              position: absolute;
              width: 16px;
              height: 20px;
              background: linear-gradient(to top, #ff9d00, #ff4500);
              border-radius: 50% 50% 20% 20%;
              top: -18px;
              left: 50%;
              transform-origin: center bottom;
              transform: translateX(-50%);
              animation: flicker 0.6s ease-in-out infinite alternate;
              box-shadow: 
                0 0 10px #ff9d00,
                0 0 20px #ff9d00,
                0 0 30px #ff4500,
                0 0 40px #ff4500;
              z-index: 3;
            }

            /* Enhanced flame effect */
            .flame::before {
              content: '';
              position: absolute;
              width: 60%;
              height: 60%;
              background: rgba(255, 255, 255, 0.7);
              border-radius: 50%;
              top: 20%;
              left: 20%;
              filter: blur(2px);
            }

            .cake-sparkles {
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
            }

            .cake-sparkles::before,
            .cake-sparkles::after {
              content: '';
              position: absolute;
              width: 15px;
              height: 15px;
              background: white;
              border-radius: 50%;
            }

            .cake-sparkles::before {
              top: 20%;
              left: 20%;
              animation: sparkle 1.5s ease-in-out infinite;
            }

            .cake-sparkles::after {
              top: 60%;
              right: 20%;
              animation: sparkle 1.5s ease-in-out 0.5s infinite;
            }

            
            /* Add more sparkles */
            .cake-sparkles::nth-child(1) {
              top: 30%;
              left: 70%;
              animation: sparkle 2s ease-in-out 0.3s infinite;
            }

            .cake-sparkles::nth-child(2) {
              top: 70%;
              left: 40%;
              animation: sparkle 1.7s ease-in-out 0.7s infinite;
            }

            @keyframes flicker {
              0% { transform: translateX(-50%) scale(1) rotate(-5deg); }
              25% { transform: translateX(-50%) scale(1.1) rotate(5deg); }
              50% { transform: translateX(-50%) scale(0.9) rotate(-2deg); }
              75% { transform: translateX(-50%) scale(1.2) rotate(3deg); }
              100% { transform: translateX(-50%) scale(1) rotate(0deg); }
            }

            @keyframes sparkle {
              0% { transform: scale(0) rotate(0deg); opacity: 0; }
              50% { transform: scale(1) rotate(180deg); opacity: 0.8; }
              100% { transform: scale(0) rotate(360deg); opacity: 0; }
            }

            /* Enhanced floating elements around the cake */
            .cake-container::before,
            .cake-container::after,
            .cake-container {
              content: '';
              position: absolute;
            }

            /* Add some floating hearts around the cake */
            .cake::before,
            .cake::after {
              content: '❤️';
              position: absolute;
              font-size: 20px;
              animation: float 3s ease-in-out infinite;
            }

            .cake::before {
              left: -30px;
              top: 40%;
              animation-delay: 0.5s;
            }

            .cake::after {
              right: -30px;
              top: 60%;
              animation-delay: 1s;
            }

            /* Add more decorative elements around the cake */
            .cake-container::before {
              content: '🎉';
              font-size: 25px;
              left: -40px;
              top: 30%;
              animation: float 3.5s ease-in-out infinite;
            }

            .cake-container::after {
              content: '🎂';
              font-size: 22px;
              right: -40px;
              top: 20%;
              animation: float 4s ease-in-out 0.5s infinite;
            }

            /* Add decorative background elements */
            .cake-background {
              position: absolute;
              width: 400px;
              height: 400px;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: -1;
              overflow: hidden;
              border-radius: 50%;
              pointer-events: none;
            }
            
            .cake-background::before {
              content: '';
              position: absolute;
              width: 100%;
              height: 100%;
              background: 
                radial-gradient(circle at 20% 30%, rgba(255, 182, 193, 0.4) 0%, transparent 40%),
                radial-gradient(circle at 70% 60%, rgba(255, 218, 185, 0.4) 0%, transparent 40%),
                radial-gradient(circle at 50% 50%, rgba(221, 160, 221, 0.2) 0%, transparent 60%);
            }

            /* Add confetti to the background */
            .confetti {
              position: absolute;
              width: 8px;
              height: 8px;
              background: #f0f0f0;
              opacity: 0.7;
            }
            
            .confetti:nth-child(1) {
              left: 20%;
              top: 10%;
              background: #ff96b8;
              animation: confetti-fall 5s linear infinite;
            }
            
            .confetti:nth-child(2) {
              left: 40%;
              top: 5%;
              background: #ffeb99;
              animation: confetti-fall 4.5s linear 0.3s infinite;
            }
            
            .confetti:nth-child(3) {
              left: 60%;
              top: 8%;
              background: #a5d8ff;
              animation: confetti-fall 6s linear 0.7s infinite;
            }
            
            .confetti:nth-child(4) {
              left: 80%;
              top: 15%;
              background: #c9a8ff;
              animation: confetti-fall 5.5s linear 1s infinite;
            }
            
            .confetti:nth-child(5) {
              left: 30%;
              top: 5%;
              background: #a7ff83;
              animation: confetti-fall 5.2s linear 1.3s infinite;
            }
            
            .confetti:nth-child(6) {
              left: 70%;
              top: 7%;
              background: #ff96b8;
              animation: confetti-fall 4.8s linear 1.7s infinite;
            }
            
            @keyframes confetti-fall {
              0% { transform: translateY(-50px) rotate(0deg); opacity: 0.7; }
              100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
            }

            @keyframes float {
              0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
              50% { transform: translateY(-20px) rotate(10deg); opacity: 1; }
              100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
            }

            /* Additional stars and magical elements */
            .star {
              position: absolute;
              opacity: 0;
              animation: star-appear 4s ease-in-out infinite;
            }
            
            .star:nth-child(1) {
              content: '✨';
              font-size: 18px;
              left: -20px;
              top: 20%;
              animation-delay: 0.5s;
            }
            
            .star:nth-child(2) {
              content: '✨';
              font-size: 15px;
              right: -15px;
              top: 30%;
              animation-delay: 1.5s;
            }
            
            .star:nth-child(3) {
              content: '✨';
              font-size: 20px;
              left: 20px;
              bottom: 20%;
              animation-delay: 2.5s;
            }
            
            .star:nth-child(4) {
              content: '✨';
              font-size: 16px;
              right: 30px;
              bottom: 30%;
              animation-delay: 3.5s;
            }
            
            @keyframes star-appear {
              0% { transform: scale(0); opacity: 0; }
              20% { transform: scale(1.2); opacity: 1; }
              40% { transform: scale(1); opacity: 0.8; }
              70% { transform: scale(1.1); opacity: 0.9; }
              100% { transform: scale(0); opacity: 0; }
            }

            /* Wish text styling */
            .wish-text {
              position: absolute;
              width: 100%;
              text-align: center;
              bottom: -80px;
              left: 0;
              font-family: 'Brush Script MT', 'Pacifico', 'Dancing Script', 'Satisfy', cursive;
              font-weight: bold;
              font-size: 2.5rem;
              color: #ffffff;
              text-shadow: 
                0 0 10px #ff69b4,
                0 0 20px #9932cc,
                0 0 30px #8a2be2;
              opacity: 0;
              transform: translateY(20px);
              animation: fadeInWish 1.5s ease-in-out forwards;
              animation-delay: 5s; /* Will appear 5 seconds after cake appears */
            }
            
            /* Add glowing effect to the wish text */
            .wish-text::after {
              content: '';
              position: absolute;
              top: -10px;
              left: 0;
              width: 100%;
              height: calc(100% + 20px);
              background: radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
              z-index: -1;
              opacity: 0;
              animation: glowPulse 3s ease-in-out infinite;
              animation-delay: 5s;
            }
            
            /* Fade in animation for the wish text */
            @keyframes fadeInWish {
              0% {
                opacity: 0;
                clip-path: inset(0 100% 0 0);
              }
              100% {
                opacity: 1;
                clip-path: inset(0 0 0 0);
              }
            }
            
            /* Subtle glow pulse animation */
            @keyframes glowPulse {
              0%, 100% {
                opacity: 0.3;
                transform: scale(1);
              }
              50% {
                opacity: 0.7;
                transform: scale(1.1);
              }
            }

            /* Responsive adjustments for smaller screens */
            @media (max-width: 768px) {
              .cake-container {
                width: 250px;
                height: 250px;
                transform: translate(-50%, -50%) scale(0.85);
              }
              
              .cake {
                width: 200px;
                height: 160px;
              }
              
              .plate {
                width: 240px;
                left: -20px;
              }
              
              .cake-background {
                width: 300px;
                height: 300px;
              }
              
              .wish-text {
                font-size: 1.8rem;
                bottom: -60px;
              }
            }
            
            /* Even smaller devices */
            @media (max-width: 480px) {
              .cake-container {
                transform: translate(-50%, -50%) scale(0.7);
              }
              
              .cake-background {
                width: 250px;
                height: 250px;
              }
              
              .wish-text {
                font-size: 1.5rem;
                bottom: -50px;
              }
            }
          `;
      
          // Add styles to document
          const styleSheet = document.createElement('style');
          styleSheet.textContent = cakeStyles;
          document.head.appendChild(styleSheet);

          // Add cake to document
          document.body.appendChild(cakeContainer);
        });

        // Handle window resize to adjust styles dynamically
        window.addEventListener('resize', () => {
          const isMobileNow = window.matchMedia('(max-width: 768px)').matches;
    
          if (isMobileNow) {
            continueButton.style.padding = '8px 16px';
            continueButton.style.fontSize = '14px';
            continueButton.style.bottom = '15px';
            continueButton.style.right = '15px';
          } else {
            continueButton.style.padding = '12px 24px';
            continueButton.style.fontSize = '16px';
            continueButton.style.bottom = '20px';
            continueButton.style.right = '20px';
          }
        });

        document.body.appendChild(continueButton);
      }, 5000); // 5 seconds delay

      // Add card flip functionality
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
        
        // Add sparkle animation when card is opened
        if (card.classList.contains('flipped')) {
          setTimeout(() => {
            const sparkles = document.querySelectorAll('.sparkle');
            sparkles.forEach((element, index) => {
              setTimeout(() => {
                element.classList.add('float');
              }, index * 300);
            });
          }, 500);
        }
      });
      
      // Add CSS for the birthday card
      const style = document.createElement('style');
      style.textContent = `
        body {
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #9932cc 0%, #b85ee6 50%, #d896ff 100%);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          overflow: hidden;
        }
        
        .birthday-card-container {
          width: 100%;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1200px;
          padding: 20px;
          box-sizing: border-box;
        }
        
        .birthday-card {
          width: 90%;
          max-width: 400px;
          min-height: 500px;
          height: auto;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 1s ease;
          cursor: pointer;
        }
        
        .birthday-card.flipped {
          transform: rotateY(180deg);
        }
        
        .card-front, .card-inside {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 15px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }
        
        .card-front {
          background: linear-gradient(145deg, #ff96b8, #ff3366);
          color: white;
          text-align: center;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .card-inside {
          background: linear-gradient(135deg, #f9f9ff 0%, #f0f8ff 100%);
          transform: rotateY(180deg);
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: auto;
          max-height: 90vh;
        }

        .card-inside::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(circle at 10% 20%, rgba(255, 182, 193, 0.2) 10%, transparent 20%),
          radial-gradient(circle at 70% 65%, rgba(173, 216, 230, 0.2) 15%, transparent 25%),
          radial-gradient(circle at 40% 50%, rgba(255, 223, 186, 0.2) 20%, transparent 30%);
          animation: shimmer 8s infinite linear;
          z-index: 0;
        }

        @keyframes shimmer {
          0% { background-position: 0% 0%, 0% 0%, 0% 0%; }
          100% { background-position: 100% 100%, 100% 100%, 100% 100%; }
        }
        
        .inside-text {
          position: relative;
          text-align: center;
          color: #333;
          z-index: 2;
        }
        
        .birthday-wish {
          margin: 30px 0;
          line-height: 1.6;
          font-size: 18px;
        }
        
        .birthday-signature {
          font-style: italic;
          margin-top: 40px;
          align-self: flex-end;
        }
        
        /* Cake styles */
        .cake {
          position: relative;
          width: 120px;
          height: 120px;
          margin-bottom: 30px;
        }
        
        .cake-base {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 40px;
          background: #f9d2af;
          border-radius: 10px;
        }
        
        .cake-middle {
          position: absolute;
          bottom: 40px;
          width: 90%;
          height: 35px;
          left: 5%;
          background: #f9afd0;
          border-radius: 8px;
        }
        
        .cake-top {
          position: absolute;
          bottom: 75px;
          width: 80%;
          height: 30px;
          left: 10%;
          background: #aff9c9;
          border-radius: 6px;
        }
        
        .candle {
          position: absolute;
          bottom: 105px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 25px;
          background: #fdfd96;
          border-radius: 4px;
        }
        
        .flame {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 10px;
          height: 15px;
          background: #ff9d00;
          border-radius: 50% 50% 20% 20%;
          box-shadow: 0 0 10px #ff9d00, 0 0 20px #ff9d00;
          animation: flicker 0.6s infinite alternate;
        }
        
        /* Ribbon */
        .ribbon {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 80px;
          height: 80px;
          background: #ff3366;
          transform: rotate(45deg);
        }
        
        /* Card decorations */
        .card-decorations {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }
        
        /* Sparkles */
        .sparkle {
          position: absolute;
          font-size: 28px;
          opacity: 0;
          transition: opacity 0.5s ease;
          text-shadow: 0 0 10px white, 0 0 20px gold;
        }
        
        .sparkle.float {
          opacity: 1;
          animation: sparkle-pulse 3s ease-in-out infinite;
        }
        
       .sparkle-1 {
          top: 20px;
          left: 20px;
          animation-delay: 0.3s;
        }

        .sparkle-2 {
          top: 20px;
          right: 20px;
          animation-delay: 0.7s;
        }
        
        .sparkle-3 {
          bottom: 20px;
          left: 20px;
          animation-delay: 1s;
        }
        
        .sparkle-4 {
          bottom: 20px;
          right: 20px;
          animation-delay: 0.5s;
        }

        /* New animation for sparkles */
        @keyframes sparkle-pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.3) rotate(20deg); opacity: 1; }
        }
        
        /* Responsive adjustments */
        @media (max-width: 480px) {
          .birthday-card {
            max-width: 300px;
            min-height: 420px;
            height: auto;
          }
          
          .cake {
            width: 100px;
            height: 100px;
          }
          
          .birthday-wish {
            font-size: 16px;
            margin: 15px 0;
          }

          .inside-text h2 {
            font-size: 28px;
          }
  
          .birthday-signature {
            margin-top: 20px;
            font-size: 20px;
          }
  
          .card-inside {
            padding: 20px;
          }
        }

        @media (max-height: 600px) {
         .birthday-card {
            min-height: 380px;
          }
  
          .birthday-wish {
            margin: 10px 0;
            line-height: 1.4;
          }
        }
      `;

      style.textContent += `
       .inside-text h2 {
          font-family: 'Brush Script MT', cursive, sans-serif;
          font-size: 32px;
          color: #ff6b99;
          margin-bottom: 15px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
  
        .birthday-wish {
          font-family: 'Comic Sans MS', 'Segoe Print', cursive, sans-serif;
          font-weight: 500;
          font-size: 18px;
          color: #6a5acd;
          line-height: 1.8;
          letter-spacing: 0.5px;
          word-spacing: 2px;
        }
  
        .birthday-signature {
          font-family: 'Brush Script MT', cursive, sans-serif;
          font-size: 24px;
          color: #9932cc;
          margin-top: 40px;
          text-shadow: 1px 1px 3px rgba(153, 50, 204, 0.2);
        }
      
        .card-inside {
          background: linear-gradient(135deg, #f9f9ff 0%, #f0f8ff 100%);
          transform: rotateY(180deg);
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
        }
      `;

      // Add this at the end of createInteractiveBirthdayCard function
      const cardInsideElement = document.querySelector('.card-inside');
      if (cardInsideElement) {
        cardInsideElement.addEventListener('touchstart', function(e) {
          e.stopPropagation(); // Prevent card flip when scrolling content
        }, { passive: true });
      }
      
      document.head.appendChild(style);
    }

    function launchConfetti() {
      const confettiCount = 200;
      for (let i = 0; i < confettiCount; i++) {
          const confetti = document.createElement("div");
          confetti.classList.add("confetti");
          document.body.appendChild(confetti);
  
          confetti.style.left = `${Math.random() * window.innerWidth}px`;
          confetti.style.animation = `confetti-fall ${Math.random() * 2 + 3}s linear infinite`;
  
          setTimeout(() => {
              confetti.remove();
          }, 5000);
      }
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

    // Add emoji catch game logic
    function startEmojiGame() {
      gameActiveRef.current = true;
      const messagesContainer = document.querySelector('.messages-container');
      const scoreDisplay = document.createElement('div');
      scoreDisplay.id = 'score-display';
      scoreDisplay.className = 'score-display';
      scoreDisplay.textContent = 'Score: 0/10';
      
      // Style the score display
      scoreDisplay.style.position = 'fixed';
      scoreDisplay.style.top = '20px';
      scoreDisplay.style.left = '50%';
      scoreDisplay.style.transform = 'translateX(-50%)';
      scoreDisplay.style.padding = '10px 20px';
      scoreDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
      scoreDisplay.style.borderRadius = '20px';
      scoreDisplay.style.fontWeight = 'bold';
      scoreDisplay.style.fontSize = '1.2rem';
      scoreDisplay.style.color = '#6a1b9a';
      scoreDisplay.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
      scoreDisplay.style.zIndex = '1000';
      
      document.body.appendChild(scoreDisplay);
      
      let playerScore = 0;
      let emojiInterval: NodeJS.Timeout;

      
      function createEmoji() {
        if (!gameActiveRef.current) return;
        
        // Check if we've reached 10 points
        if (playerScore >= 10) {
          clearInterval(emojiInterval);
          endGame(true);
          return;
        }
        
        // Create emoji element
        const emoji = document.createElement('div');
        emoji.className = 'cake-emoji';
        emoji.textContent = '🎂';
        
        // Style the emoji
        emoji.style.position = 'absolute';
        emoji.style.fontSize = '3rem';
        emoji.style.cursor = 'pointer';
        emoji.style.transition = 'all 0.2s ease';
        emoji.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))';
        emoji.style.zIndex = '100';
        emoji.style.userSelect = 'none';
        
        // Random position - avoid edges
        const safeMargin = 100; // 100px from edges
        const left = Math.random() * (window.innerWidth - 2 * safeMargin) + safeMargin;
        const top = Math.random() * (window.innerHeight - 2 * safeMargin) + safeMargin;
        
        emoji.style.left = `${left}px`;
        emoji.style.top = `${top}px`;
        
        // Add click handler
        emoji.addEventListener('click', () => {
          if (!gameActiveRef.current) return;
          
          // Increase score
          playerScore++;
          scoreDisplay.textContent = `Score: ${playerScore}/10`;
          
          // Animation for clicked emoji
          emoji.style.transform = 'scale(1.5)';
          emoji.style.opacity = '0';
          
          // Show spark effect when clicked
          createClickSpark(left, top);
          
          // Remove after animation
          setTimeout(() => {
            if (emoji.parentNode) {
              emoji.parentNode.removeChild(emoji);
            }
          }, 300);
        });
        
        document.body.appendChild(emoji);
        
        // Automatic disappear after random time (1-2 seconds)
        const disappearTime = Math.random() * 1000 + 1000;
        setTimeout(() => {
          if (emoji.parentNode) {
            emoji.style.opacity = '0';
            setTimeout(() => {
              if (emoji.parentNode) {
                emoji.parentNode.removeChild(emoji);
              }
            }, 300);
          }
        }, disappearTime);
      }
      
      // Create visual effect when emoji is clicked
      function createClickSpark(x: number, y: number) {
        const sparkContainer = document.createElement('div');
        sparkContainer.style.position = 'absolute';
        sparkContainer.style.left = `${x}px`;
        sparkContainer.style.top = `${y}px`;
        sparkContainer.style.zIndex = '99';
        sparkContainer.style.pointerEvents = 'none';
        
        document.body.appendChild(sparkContainer);
        
        // Create multiple spark particles
        const colors = ['#FF9800', '#FFEB3B', '#FFC107', '#FF5722', '#E91E63'];
        
        for (let i = 0; i < 12; i++) {
          const spark = document.createElement('div');
          const size = Math.random() * 10 + 5;
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          spark.style.position = 'absolute';
          spark.style.width = `${size}px`;
          spark.style.height = `${size}px`;
          spark.style.backgroundColor = color;
          spark.style.borderRadius = '50%';
          spark.style.transform = 'translate(-50%, -50%)';
          spark.style.opacity = '1';
          
          sparkContainer.appendChild(spark);
          
          // Animate each spark particle
          const angle = Math.random() * Math.PI * 2;
          const velocity = Math.random() * 10 + 5;
          const vx = Math.cos(angle) * velocity;
          const vy = Math.sin(angle) * velocity;
          
          let posX = 0;
          let posY = 0;
          
          const startTime = performance.now();
          
          function animateSpark(timestamp: number) {
            const elapsed = timestamp - startTime;
            const progress = elapsed / 1000; // 1 second animation
            
            if (progress >= 1) {
              if (spark.parentNode) {
                spark.parentNode.removeChild(spark);
              }
              
              if (sparkContainer.childNodes.length === 0 && sparkContainer.parentNode) {
                sparkContainer.parentNode.removeChild(sparkContainer);
              }
              return;
            }
            
            posX += vx * 0.06;
            posY += vy * 0.06;
            
            // Add gravity effect
            posY += progress * 9;
            
            // Set position
            spark.style.transform = `translate(calc(-50% + ${posX}px), calc(-50% + ${posY}px))`;
            
            // Fade out
            spark.style.opacity = (1 - progress).toString();
            
            requestAnimationFrame(animateSpark);
          }
          
          requestAnimationFrame(animateSpark);
        }
      }
      
      // Determine emoji spawn speed based on device
      const isMobile = window.innerWidth <= 768;
      const spawnInterval = isMobile ? 1000 : 800; // Slightly easier on mobile
      
      // Start spawning emojis
      emojiInterval = setInterval(createEmoji, spawnInterval);
      
      // Also spawn one immediately
      createEmoji();
      
      // Function to end the game
      function endGame(success: boolean) {
        clearInterval(emojiInterval);
        gameActiveRef.current = false;
        
        // Remove any remaining emojis
        document.querySelectorAll('.cake-emoji').forEach(elem => {
          if (elem.parentNode) {
            elem.parentNode.removeChild(elem);
          }
        });
        
        if (scoreDisplay.parentNode) {
          scoreDisplay.parentNode.removeChild(scoreDisplay);
        }
        
        if (success) {
          // Show success message or proceed to next stage
          createCongratulationsMessage();
        }
      }
    }
    
    function createCongratulationsMessage() {
      const congratsMessage = document.createElement('div');
      congratsMessage.className = 'message-box';
      congratsMessage.id = 'congrats-message';
      congratsMessage.innerHTML = `
        <span class="emoji">🎉</span>
        <span class="text">Amazing! Click to proceed</span>
        <span class="emoji">🎉</span>
      `;
      
      // Style similar to other message boxes
      congratsMessage.style.opacity = '0';
      congratsMessage.style.transform = 'translateY(20px)';
      
      // Add to container
      const messagesContainer = document.querySelector('.messages-container');
      messagesContainer?.appendChild(congratsMessage);
      
      // Create fireworks to celebrate
      createFireworks();

      congratsMessage.addEventListener("click", () => {
        createInteractiveBirthdayCard(); // Show interactive card instead of 3D model
        launchConfetti(); // Show confetti
    });
      
      // Show message
      setTimeout(() => {
        congratsMessage.style.opacity = '1';
        congratsMessage.style.transform = 'translateY(0)';
      }, 100);
      
      // You can add logic here to proceed to the next part of your birthday surprise
    }

    // Modified setupMessageBox function to include the emoji game
    function setupMessageBox() {
      const mainMessage = document.getElementById("main-message")
      const secondMessage = document.getElementById("second-message")
      const thirdMessage = document.getElementById("third-message")
      const fourthMessage = document.getElementById("fourth-message")

      if (!mainMessage || !secondMessage || !thirdMessage || !fourthMessage) return // Add safety check

      // Initially hide the third and fourth message completely
      thirdMessage.style.display = "none";
      fourthMessage.style.display = "none";

      let clicked = false; // Track if button has been clicked

      mainMessage.addEventListener("click", () => {
        if (clicked) return; // Prevent multiple activations
        clicked = true;

        mainMessage.style.pointerEvents = "none"; // Disable further clicks

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

              // After 5 seconds, hide the third message and show the fourth message
              setTimeout(() => {
                thirdMessage.classList.remove("visible")
            
                // Add a small delay before showing the fourth message
                setTimeout(() => {
                  thirdMessage.style.display = "none";
                  fourthMessage.style.display = ""; // Reset to default display value
                  fourthMessage.classList.add("visible")

                  // After 5 seconds, start the game
                  setTimeout(() => {
                    fourthMessage.classList.remove("visible");
                    mainMessage.classList.remove("visible");
                    
                    // Small delay before starting the game
                    setTimeout(() => {
                      // Hide all message boxes
                      fourthMessage.style.display = "none";
                      mainMessage.style.display = "none";
                      
                      // Start the emoji catch game
                      startEmojiGame();
                    }, 300);
                  }, 5000);
                }, 300)
              }, 5000) // 5 seconds for the third message
            }, 300)
          }, 5000)
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

    // Add cleanup function
    return () => {
      window.removeEventListener('resize', appHeight);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
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
          <div className="message-box second-box" id="fourth-message">
            <span className="text">Catch the emoji 🎂 to proceed</span>
          </div>
        </div>
      </div>
    </>
  )
}

