/**
 * Extrafazant-Grade Kinetic Creative Engine
 * Complete architectural implementation for Aditya Soni's Portfolio
 * - Lenis Smooth Inertial Scrolling synced to GSAP Ticker
 * - Custom Easing Curves ("osmo", "move")
 * - Dynamic Viewport Text-Fitting Algorithm (data-heading-fit)
 * - Kinetic Variable Font Proximity Wave (data-font-weight-hover)
 * - Interactive Repelling Media Collage Physics (data-interactive-collage-init)
 * - 3D Pinned Stacking Card Deck (data-featured-stack) with Mouse Tilt
 * - Velocity-Sensitive Reversing Infinite Marquee (data-marquee-scroll-direction-target)
 * - GSAP DrawSVG Organic Highlighter Lines (data-draw-line)
 * - Liquid Magnetic Dot Button (data-button-093)
 * - Trailing Magnetic Cursor Badge
 * - Dual-Theme Dynamic Navigation Switcher
 */

(function () {
  "use strict";

  // 1. Wait for DOM Ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initExtrafazantEngine);
  } else {
    initExtrafazantEngine();
  }

  function initExtrafazantEngine() {
    // Verify GSAP is available
    if (typeof window.gsap === "undefined") {
      console.warn("[ExtrafazantEngine] GSAP not detected, retrying in 100ms...");
      setTimeout(initExtrafazantEngine, 100);
      return;
    }

    const { gsap, ScrollTrigger, CustomEase, SplitText, DrawSVGPlugin, InertiaPlugin } = window;

    // Register all active plugins
    const pluginsToRegister = [ScrollTrigger, CustomEase, SplitText, DrawSVGPlugin, InertiaPlugin].filter(Boolean);
    if (pluginsToRegister.length) {
      gsap.registerPlugin(...pluginsToRegister);
    }

    // Register signature custom eases
    if (CustomEase) {
      try {
        CustomEase.create("osmo", "0.625, 0.05, 0, 1");
        CustomEase.create("move", "0.3, 0.075, 0, 1");
        CustomEase.create("osmo-bounce", "0.625, 0.05, 0, 1.2");
      } catch (e) {
        console.warn("[ExtrafazantEngine] CustomEase creation error:", e);
      }
    }

    // Initialize smooth scrolling with Lenis
    initLenisScroll(gsap, ScrollTrigger);

    // Initialize all kinetic systems
    initHeadingFit();
    initTextReveal(gsap, SplitText);
    initFontWeightHover(gsap, SplitText);
    initInteractiveCollage(gsap, CustomEase);
    initFeaturedStack(gsap, ScrollTrigger);
    initMarqueeScrollDirection(gsap, ScrollTrigger);
    initDrawSVGHighlights(gsap, DrawSVGPlugin);
    initLiquidDotButton();
    initCursorBadge(gsap);
    initNavThemeSwitch(ScrollTrigger);
    initVideoOnHover();
    initMouseImageTrail(gsap);

    console.log("%c[ExtrafazantEngine] %c100% Kinetic Architecture Initialized Successfully", "color:#0038FF;font-weight:bold", "color:#10B981;font-weight:bold");
  }

  // =========================================================================
  // 1. Lenis Smooth Scrolling Engine & GSAP Ticker Synchronization
  // =========================================================================
  function initLenisScroll(gsap, ScrollTrigger) {
    if (typeof window.Lenis === "undefined") return;

    try {
      const lenis = new window.Lenis({
        lerp: 0.085,
        duration: 1.2,
        wheelMultiplier: 0.95,
        smoothWheel: true,
        touchMultiplier: 1.2,
        syncTouch: true
      });

      window.lenisInstance = lenis;

      if (ScrollTrigger) {
        lenis.on("scroll", ScrollTrigger.update);
      }

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      // Connect any anchor links to smooth scroll
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          const href = this.getAttribute("href");
          if (!href || href === "#") return;
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -60, duration: 1.2 });
          }
        });
      });
    } catch (err) {
      console.warn("[ExtrafazantEngine] Lenis init failed:", err);
    }
  }

  // =========================================================================
  // 2. Dynamic Viewport Text-Fitting Algorithm (data-heading-fit)
  // =========================================================================
  function initHeadingFit() {
    const headings = document.querySelectorAll("[data-heading-fit], .heading-stretch_text");
    if (!headings.length) return;

    function scaleElement(el) {
      const minRatio = parseFloat(el.dataset.headingFitMin) || 0.35;
      const room = parseFloat(el.dataset.headingFitRoom) || 0.98;
      el.style.removeProperty("font-size");

      const parent = el.closest("[data-heading-fit-box]") || el.parentElement;
      if (!parent) return;

      const pStyle = getComputedStyle(parent);
      const availableWidth = (parent.clientWidth - parseFloat(pStyle.paddingLeft || 0) - parseFloat(pStyle.paddingRight || 0)) * room;
      const currentSize = parseFloat(getComputedStyle(el).fontSize) || 100;
      if (availableWidth <= 0) return;

      // Create ghost element to measure exact virtual width without line wrapping
      const probe = el.cloneNode(true);
      probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;white-space:nowrap;width:max-content;max-width:none;left:0;top:0;font-size:${currentSize}px;`;
      parent.appendChild(probe);
      const naturalWidth = probe.getBoundingClientRect().width;
      probe.remove();

      if (naturalWidth > 0) {
        const ratio = Math.max(minRatio, availableWidth / naturalWidth);
        el.style.fontSize = (currentSize * ratio) + "px";
      }
    }

    const runAll = () => headings.forEach(scaleElement);
    window.addEventListener("resize", runAll, { passive: true });
    if (document.fonts) {
      document.fonts.ready.then(runAll).catch(() => {});
    }
    runAll();
  }

  // =========================================================================
  // 3. Kinetic SplitText Reveal Engine (Lines & Chars with Masks)
  // =========================================================================
  function initTextReveal(gsap, SplitText) {
    const revealElements = document.querySelectorAll("[data-text-reveal], [data-scroll-reveal]");
    if (!revealElements.length) return;

    if (!SplitText) {
      revealElements.forEach((el) => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.8 });
      });
      return;
    }

    revealElements.forEach((el) => {
      const type = el.dataset.textReveal || el.dataset.scrollReveal || "lines";
      const stagger = parseFloat(el.dataset.textRevealStagger) || 0.08;
      const delay = parseFloat(el.dataset.textRevealDelay) || 0.1;

      try {
        const split = new SplitText(el, {
          type: type === "chars" ? "chars,words,lines" : "lines,words",
          linesClass: "line",
          charsClass: "char",
          mask: "lines"
        });

        const targets = type === "chars" ? split.chars : split.lines;
        gsap.set(targets, { yPercent: 135, opacity: 0 });

        if (el.hasAttribute("data-scroll-reveal") && window.ScrollTrigger) {
          gsap.to(targets, {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "expo.out",
            stagger: stagger,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true
            }
          });
        } else {
          gsap.to(targets, {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            delay: delay,
            ease: "expo.out",
            stagger: stagger,
            onComplete: () => {
              el.dispatchEvent(new CustomEvent("reveal:done", { bubbles: false }));
            }
          });
        }
      } catch (err) {
        console.warn("[ExtrafazantEngine] SplitText reveal error:", err);
        gsap.set(el, { opacity: 1 });
      }
    });
  }

  // =========================================================================
  // 4. Kinetic Variable Font Proximity Wave (data-font-weight-hover)
  // =========================================================================
  function initFontWeightHover(gsap, SplitText) {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const elements = document.querySelectorAll("[data-font-weight-hover]");
    if (!elements.length) return;

    elements.forEach((el) => {
      const radius = parseFloat(el.dataset.radius) || 380;
      const restWeight = parseFloat(el.dataset.weightRest) || 300;
      const nearWeight = parseFloat(el.dataset.weightNear) || 800;

      let chars = [];
      if (SplitText) {
        try {
          const split = new SplitText(el, { type: "chars,words", charsClass: "char" });
          chars = split.chars;
        } catch (e) {
          chars = Array.from(el.querySelectorAll(".char"));
        }
      } else {
        chars = Array.from(el.querySelectorAll(".char"));
      }

      if (!chars.length) {
        // Fallback: wrap words/characters in spans
        const text = el.innerText;
        el.innerHTML = text.split("").map(c => c === " " ? " " : `<span class="char">${c}</span>`).join("");
        chars = Array.from(el.querySelectorAll(".char"));
      }

      const charsData = [];
      chars.forEach((c) => {
        c.style.fontVariationSettings = "'wght' var(--wght, " + restWeight + ")";
        c.style.setProperty("--wght", restWeight);

        charsData.push({
          el: c,
          rest: restWeight,
          near: nearWeight,
          radius: radius,
          cx: 0,
          cy: 0,
          setter: gsap.quickTo(c, "--wght", { duration: 0.35, ease: "power2.out", overwrite: "auto" })
        });
      });

      const updateCoordinates = () => {
        charsData.forEach((c) => {
          const rect = c.el.getBoundingClientRect();
          c.cx = rect.left + rect.width / 2 + window.scrollX;
          c.cy = rect.top + rect.height / 2 + window.scrollY;
        });
      };
      updateCoordinates();
      window.addEventListener("resize", updateCoordinates, { passive: true });
      window.addEventListener("scroll", updateCoordinates, { passive: true });

      let mouseX = -9999, mouseY = -9999, hasMoved = false;
      window.addEventListener("pointermove", (e) => {
        hasMoved = true;
        mouseX = e.pageX;
        mouseY = e.pageY;
      }, { passive: true });

      gsap.ticker.add(() => {
        if (!hasMoved) return;
        charsData.forEach((c) => {
          const dist = Math.hypot(mouseX - c.cx, mouseY - c.cy);
          const factor = dist >= c.radius ? 0 : 1 - dist / c.radius;
          const targetWght = c.rest + (c.near - c.rest) * factor;
          c.setter(targetWght);
        });
      });
    });
  }

  // =========================================================================
  // 5. Interactive Repelling Media Collage (data-interactive-collage-init)
  // =========================================================================
  function initInteractiveCollage(gsap) {
    const collages = document.querySelectorAll("[data-interactive-collage-init]");
    if (!collages.length) return;

    collages.forEach((container) => {
      const items = [...container.querySelectorAll("[data-interactive-collage-item]")];
      if (!items.length) return;

      const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

      items.forEach((item) => {
        const inner = item.querySelector("[data-interactive-collage-item-inner]") || item;

        if (!isTouch) {
          item.addEventListener("pointerenter", () => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width / 2;

            items.forEach((sibling) => {
              const sInner = sibling.querySelector("[data-interactive-collage-item-inner]") || sibling;
              if (sibling === item) {
                sibling.setAttribute("data-interactive-collage-focus", "true");
                gsap.to(sInner, {
                  scale: 1.08,
                  xPercent: 0,
                  yPercent: 0,
                  rotation: 0,
                  duration: 0.7,
                  ease: "move",
                  overwrite: true
                });
                return;
              }

              sibling.removeAttribute("data-interactive-collage-focus");
              const sRect = sibling.getBoundingClientRect();
              const sCenter = sRect.left + sRect.width / 2;
              const isLeft = sCenter < itemCenter;
              const repelX = isLeft ? -10 : 10;
              const arcY = 6;
              const subtleRot = isLeft ? -2.5 : 2.5;

              gsap.to(sInner, {
                scale: 0.94,
                xPercent: repelX,
                yPercent: arcY,
                rotation: subtleRot,
                duration: 0.7,
                ease: "move",
                overwrite: true
              });
            });
          });

          container.addEventListener("pointerleave", () => {
            items.forEach((sibling) => {
              sibling.removeAttribute("data-interactive-collage-focus");
              const sInner = sibling.querySelector("[data-interactive-collage-item-inner]") || sibling;
              gsap.to(sInner, {
                scale: 1,
                xPercent: 0,
                yPercent: 0,
                rotation: 0,
                duration: 0.7,
                ease: "move",
                overwrite: true
              });
            });
          });
        }
      });
    });
  }

  // =========================================================================
  // 6. 3D Pinned Stacking Card Deck (data-featured-stack)
  // =========================================================================
  function initFeaturedStack(gsap, ScrollTrigger) {
    if (!ScrollTrigger) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 992px)", () => {
      const stacks = document.querySelectorAll("[data-featured-stack]");

      stacks.forEach((stack) => {
        const pinEl = stack.querySelector("[data-featured-stack-pin]");
        const rootEl = stack.querySelector("[data-featured-stack-root]");
        const slides = [...stack.querySelectorAll("[data-featured-stack-slide]")];
        if (!pinEl || slides.length < 2) return;

        const depth = parseFloat(stack.dataset.featuredStackDepth) || 110;
        const offset = parseFloat(stack.dataset.featuredStackOffset) || 36;
        const tiltX = parseFloat(stack.dataset.featuredStackTiltX) || 5;
        const tiltY = parseFloat(stack.dataset.featuredStackTiltY) || 8;
        const scrollMultiplier = parseFloat(stack.dataset.featuredStackScroll) || 1.35;

        // Position slides with 3D depth
        slides.forEach((slide, idx) => {
          gsap.set(slide, {
            z: -idx * depth,
            y: -idx * offset,
            zIndex: slides.length - idx,
            transformOrigin: "center center"
          });
        });

        // Scrub timeline
        const tl = gsap.timeline({ paused: true });
        slides.forEach((slide, idx) => {
          if (idx === slides.length - 1) return;
          const startTime = idx;

          // Drop top slide downwards out of viewport
          tl.to(slide, {
            y: "+=" + window.innerHeight * 0.85,
            ease: "power2.in",
            duration: 1
          }, startTime);
          tl.to(slide, { autoAlpha: 0, duration: 0.25 }, startTime + 0.7);

          // Elevate subsequent slides
          slides.slice(idx + 1).forEach((nextSlide, subIdx) => {
            tl.to(nextSlide, {
              z: -subIdx * depth,
              y: -subIdx * offset,
              ease: "none",
              duration: 1
            }, startTime);
          });
        });

        ScrollTrigger.create({
          trigger: stack,
          start: "top top",
          end: () => `+=${window.innerHeight * scrollMultiplier * (slides.length - 1)}`,
          pin: pinEl,
          pinSpacing: true,
          scrub: 0.3,
          onUpdate: (self) => tl.progress(self.progress)
        });

        // 3D Mouse Parallax Tilt
        if (rootEl) {
          const setRotX = gsap.quickTo(rootEl, "rotationX", { duration: 0.6, ease: "power3" });
          const setRotY = gsap.quickTo(rootEl, "rotationY", { duration: 0.6, ease: "power3" });

          pinEl.addEventListener("mousemove", (e) => {
            const rect = pinEl.getBoundingClientRect();
            const normX = (e.clientX - rect.left) / rect.width - 0.5;
            const normY = (e.clientY - rect.top) / rect.height - 0.5;
            setRotX(-normY * tiltX);
            setRotY(normX * tiltY);
          });

          pinEl.addEventListener("mouseleave", () => {
            setRotX(0);
            setRotY(0);
          });
        }
      });
    });
  }

  // =========================================================================
  // 7. Velocity-Sensitive Reversing Infinite Marquee
  // =========================================================================
  function initMarqueeScrollDirection(gsap, ScrollTrigger) {
    const marquees = document.querySelectorAll("[data-marquee-scroll-direction-target]");
    if (!marquees.length) return;

    marquees.forEach((u) => {
      const track = u.querySelector("[data-marquee-scroll-target], .ef-marquee__track");
      if (!track) return;

      const speed = parseFloat(u.dataset.marqueeSpeed) || 28;
      const initialDirection = u.dataset.marqueeDirection === "right" ? 1 : -1;

      // Duplicate content to achieve seamless continuous loop
      const originalContent = track.innerHTML;
      track.innerHTML = originalContent + originalContent;

      const tween = gsap.to(track, {
        xPercent: -50,
        repeat: -1,
        duration: speed,
        ease: "none"
      });

      tween.timeScale(initialDirection);

      if (ScrollTrigger) {
        ScrollTrigger.create({
          trigger: u,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            // Direction: 1 = scrolling down, -1 = scrolling up
            const dir = self.direction === 1 ? -1 : 1;
            tween.timeScale(dir * (1 + Math.min(Math.abs(self.getVelocity() / 600), 3)));
            gsap.to(tween, { timeScale: dir, duration: 0.6, overwrite: "auto" });
          }
        });
      }
    });
  }

  // =========================================================================
  // 8. GSAP DrawSVG Organic Highlighter Lines (data-draw-line)
  // =========================================================================
  function initDrawSVGHighlights(gsap, DrawSVGPlugin) {
    const drawElements = document.querySelectorAll("[data-draw-line]");
    if (!drawElements.length) return;

    drawElements.forEach((el) => {
      const path = el.querySelector("path");
      if (!path) return;

      if (DrawSVGPlugin) {
        gsap.set(path, { drawSVG: "0% 0%" });
        if (window.ScrollTrigger) {
          gsap.to(path, {
            drawSVG: "0% 100%",
            duration: 1.25,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true
            }
          });
        } else {
          gsap.to(path, { drawSVG: "0% 100%", duration: 1.25, delay: 0.4, ease: "power2.out" });
        }
      } else {
        // Fallback via stroke-dashoffset
        const len = path.getTotalLength ? path.getTotalLength() : 300;
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, { strokeDashoffset: 0, duration: 1.2, ease: "power2.out" });
      }
    });
  }

  // =========================================================================
  // 9. Liquid Magnetic Dot Button (data-button-093)
  // =========================================================================
  function initLiquidDotButton() {
    const buttons = document.querySelectorAll("[data-button-093]");
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      const updateButtonScale = () => {
        const w = btn.offsetWidth || 150;
        const h = btn.offsetHeight || 50;
        const scale = Math.ceil(Math.hypot(w, h) / 14) + 2;
        btn.style.setProperty("--button-093-scale-x", scale);
        btn.style.setProperty("--button-093-scale-y", scale);
      };
      updateButtonScale();
      window.addEventListener("resize", updateButtonScale, { passive: true });
    });
  }

  // =========================================================================
  // 10. Trailing Custom Cursor Badge
  // =========================================================================
  function initCursorBadge(gsap) {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    let badge = document.querySelector(".ef-cursor-badge");
    if (!badge) {
      badge = document.createElement("div");
      badge.className = "ef-cursor-badge";
      badge.textContent = "VIEW CASE STUDY →";
      document.body.appendChild(badge);
    }

    const setX = gsap.quickTo(badge, "left", { duration: 0.35, ease: "power3" });
    const setY = gsap.quickTo(badge, "top", { duration: 0.35, ease: "power3" });

    window.addEventListener("pointermove", (e) => {
      setX(e.clientX);
      setY(e.clientY);
    }, { passive: true });

    document.querySelectorAll("[data-cursor-badge]").forEach((target) => {
      target.addEventListener("pointerenter", () => {
        const customText = target.getAttribute("data-cursor-badge");
        if (customText) badge.textContent = customText;
        badge.classList.add("is-active");
      });
      target.addEventListener("pointerleave", () => {
        badge.classList.remove("is-active");
      });
    });
  }

  // =========================================================================
  // 11. Dual-Theme Dynamic Navigation Switcher
  // =========================================================================
  function initNavThemeSwitch(ScrollTrigger) {
    const navPill = document.querySelector(".ef-nav-pill, #main-nav-pill");
    const darkSections = document.querySelectorAll("[data-nav-theme='dark'], .ef-theme-dark, .theme-dark, #projects");
    if (!navPill || !darkSections.length || !ScrollTrigger) return;

    darkSections.forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top 60px",
        end: "bottom 60px",
        onEnter: () => navPill.classList.add("is-dark"),
        onLeave: () => navPill.classList.remove("is-dark"),
        onEnterBack: () => navPill.classList.add("is-dark"),
        onLeaveBack: () => navPill.classList.remove("is-dark")
      });
    });
  }

  // =========================================================================
  // 12. Instant Video / Hover Scrubbing (data-video-on-hover)
  // =========================================================================
  function initVideoOnHover() {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    document.querySelectorAll("[data-video-on-hover]").forEach((card) => {
      const video = card.querySelector("video");
      if (!video) return;

      card.addEventListener("pointerenter", () => {
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise) playPromise.catch(() => {});
      });

      card.addEventListener("pointerleave", () => {
        video.pause();
      });
    });
  }

  // =========================================================================
  // 13. Elastic Mouse Image Trail (data-image-trail)
  // =========================================================================
  function initMouseImageTrail(gsap) {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const containers = document.querySelectorAll("[data-image-trail]");
    if (!containers.length) return;

    containers.forEach((container) => {
      const mediaUrls = [...container.querySelectorAll("[data-image-trail-media]")]
        .map(el => el.getAttribute("src") || el.dataset.src)
        .filter(Boolean);

      if (!mediaUrls.length) return;

      let lastX = 0, lastY = 0, distanceAccum = 0, imgIndex = 0;
      const threshold = 75; // px distance traveled before spawning next image

      container.addEventListener("pointermove", (e) => {
        const rect = container.getBoundingClientRect();
        const curX = e.clientX;
        const curY = e.clientY;

        const delta = Math.hypot(curX - lastX, curY - lastY);
        distanceAccum += delta;

        if (distanceAccum >= threshold) {
          distanceAccum = 0;
          spawnTrailImage(curX - rect.left, curY - rect.top, mediaUrls[imgIndex]);
          imgIndex = (imgIndex + 1) % mediaUrls.length;
        }

        lastX = curX;
        lastY = curY;
      });

      function spawnTrailImage(x, y, src) {
        const img = document.createElement("img");
        img.className = "ef-trail-img";
        img.src = src;
        img.style.left = x + "px";
        img.style.top = y + "px";
        container.appendChild(img);

        const rot = (Math.random() - 0.5) * 24;

        gsap.fromTo(img, 
          { scale: 0.6, rotation: rot, opacity: 0, xPercent: -50, yPercent: -50 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1.8, 0.6)" }
        );

        gsap.to(img, {
          scale: 0.4,
          opacity: 0,
          duration: 0.4,
          delay: 0.8,
          ease: "power2.in",
          onComplete: () => img.remove()
        });
      }
    });
  }

})();
