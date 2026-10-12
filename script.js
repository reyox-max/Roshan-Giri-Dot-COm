(function () {
  // ==========================================================================
  // 1. IMAGE RESOLUTION HANDLING
  // ==========================================================================
  const imageConnection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  function useLowResolutionImages() {
    if (!imageConnection) return false;
    return (
      imageConnection.saveData ||
      /^(slow-2g|2g|3g)$/.test(imageConnection.effectiveType || "") ||
      (typeof imageConnection.downlink === "number" && imageConnection.downlink < 1.5)
    );
  }

  function updateImageSources() {
    const lowResolution = useLowResolutionImages();
    document.querySelectorAll("img[data-high-res][data-low-res]").forEach((image) => {
      const source = lowResolution ? image.dataset.lowRes : image.dataset.highRes;
      if (image.getAttribute("src") !== source) {
        image.src = source;
      }
    });
  }

  updateImageSources();
  if (imageConnection?.addEventListener) {
    imageConnection.addEventListener("change", updateImageSources);
  }
  document.body.classList.add("intro-complete");

  // ==========================================================================
  // 2. MODAL / CV VIEWER
  // ==========================================================================
  const cvViewer = document.querySelector("#cv-viewer");
  const cvOpenButton = document.querySelector(".navigate-link");
  const cvCloseButton = document.querySelector(".cv-viewer__close");

  if (cvViewer && cvOpenButton && cvCloseButton) {
    cvOpenButton.addEventListener("click", () => cvViewer.showModal());
    cvCloseButton.addEventListener("click", () => cvViewer.close());
    cvViewer.addEventListener("click", (event) => {
      if (event.target === cvViewer) cvViewer.close();
    });
  }

  // ==========================================================================
  // 3. ABOUT SECTION INTERACTIVITY
  // ==========================================================================
  const aboutDetails = document.querySelector(".about-section__details");
  const aboutSubtitle = document.querySelector("#about-subtitle");
  const aboutCopy = document.querySelector(".about-section__copy");
  const aboutExpandedView = document.querySelector("#about-expanded-content");
  const aboutCardButtons = Array.from(document.querySelectorAll(".about-info-card[data-about-card]"));
  
  const aboutInformation = {
    education: { title: "Education", cards: [{ title: "Current study", description: "4th Year Aerospace Engineering Undergraduate" }, { title: "Campus", description: "IOE Pulchowk Campus" }] },
    currently: { title: "Currently", cards: [{ title: "Current role", description: "Aerospace Engineering student" }, { title: "Open to", description: "Relevant opportunities, collaboration, and new challenges." }] },
    skills: { title: "Skills", cards: [{ title: "CAD", description: "Computer-aided design for exploring and communicating ideas." }, { title: "Graphics", description: "Graphic design and visual composition." }, { title: "Web design", description: "Modern, responsive websites with attention to detail." }, { title: "Interactive interfaces", description: "Design and development for engaging interfaces." }] },
    interests: { title: "Interests", cards: [{ title: "Aircraft", description: "Flight, aircraft design, and the ideas behind aviation." }, { title: "Spacecraft", description: "Space vehicles and the engineering behind exploration." }] },
  };

  function renderAboutInformation(information) {
    aboutExpandedView.replaceChildren();
    information.cards.forEach((card) => {
      const element = document.createElement("article");
      element.className = "about-expanded-card";
      
      const heading = document.createElement("h4");
      heading.textContent = card.title;
      
      const description = document.createElement("p");
      description.textContent = card.description;
      
      element.append(heading, description);
      aboutExpandedView.appendChild(element);
    });
  }

  if (aboutDetails && aboutSubtitle && aboutCopy && aboutExpandedView && aboutCardButtons.length) {
    aboutCardButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const information = aboutInformation[button.dataset.aboutCard];
        const isAlreadyOpen = button.getAttribute("aria-expanded") === "true";

        if (!information) return;

        aboutCardButtons.forEach((cardButton) => {
          cardButton.classList.remove("is-active");
          cardButton.setAttribute("aria-expanded", "false");
          cardButton.querySelector(".about-info-card__arrow").textContent = "↗";
        });

        if (isAlreadyOpen) {
          aboutDetails.classList.remove("is-expanded");
          aboutDetails.closest(".about-section").classList.remove("is-about-expanded");
          aboutCopy.setAttribute("aria-hidden", "false");
          aboutExpandedView.setAttribute("aria-hidden", "true");
          aboutSubtitle.textContent = "About Me";
          return;
        }

        button.classList.add("is-active");
        button.setAttribute("aria-expanded", "true");
        button.querySelector(".about-info-card__arrow").textContent = "×";
        aboutSubtitle.textContent = information.title;
        aboutCopy.setAttribute("aria-hidden", "true");
        aboutExpandedView.setAttribute("aria-hidden", "false");
        aboutDetails.classList.add("is-expanded");
        aboutDetails.closest(".about-section").classList.add("is-about-expanded");
        renderAboutInformation(information);
      });
    });
  }

  // ==========================================================================
  // 4. ANIMATIONS (Fireflies, Clouds, Parallax)
  // ==========================================================================
  const fireflyHost = document.querySelector(".hero__fireflies");
  const fireflies = [
    ["8%", "76%", "-1.2s", "6.2s", "3px"], ["14%", "87%", "-4.4s", "7.8s", "4px"],
    ["19%", "63%", "-3.1s", "7.2s", "4px"], ["23%", "70%", "-2.6s", "8.4s", "3px"],
    ["31%", "91%", "-6.1s", "7.1s", "5px"], ["37%", "66%", "-1.8s", "8.1s", "3px"],
    ["42%", "79%", "-3.8s", "9.2s", "3px"], ["51%", "69%", "-0.9s", "6.8s", "4px"],
    ["55%", "95%", "-4.7s", "7.6s", "4px"], ["59%", "88%", "-5.5s", "8.7s", "3px"],
    ["67%", "75%", "-2.1s", "7.4s", "5px"], ["73%", "94%", "-6.7s", "9.5s", "3px"],
    ["80%", "66%", "-3.3s", "7.9s", "4px"], ["88%", "83%", "-1.7s", "8.9s", "3px"],
    ["95%", "72%", "-5.9s", "6.5s", "4px"],
  ];

  if (fireflyHost) {
    fireflies.forEach(([left, top, delay, duration, size]) => {
      const element = document.createElement("i");
      element.style.setProperty("--left", left);
      element.style.setProperty("--top", top);
      element.style.setProperty("--delay", delay);
      element.style.setProperty("--duration", duration);
      element.style.setProperty("--size", size);
      fireflyHost.appendChild(element);
    });
  }

  const cloudHost = document.querySelector(".hero__clouds");
  const clouds = cloudHost ? Array.from(cloudHost.querySelectorAll(".hero__cloud")) : [];

  if (clouds.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let previousCloudIndex = -1;
    function scheduleCloud() {
      let cloudIndex = Math.floor(Math.random() * clouds.length);
      if (clouds.length > 1 && cloudIndex === previousCloudIndex) {
        cloudIndex = (cloudIndex + 1) % clouds.length;
      }
      previousCloudIndex = cloudIndex;

      const cloud = clouds[cloudIndex];
      const duration = 20 + Math.random() * 8;
      cloud.style.setProperty("--cloud-duration", `${duration}s`);
      cloud.classList.add("is-animating");
      cloud.addEventListener("animationend", () => {
        cloud.classList.remove("is-animating");
        setTimeout(scheduleCloud, 4000 + Math.random() * 8000);
      }, { once: true });
    }
    setTimeout(scheduleCloud, 2000 + Math.random() * 6000);
  }

  const hero = document.querySelector(".hero");
  let animationFrame = 0;

  if (hero && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("pointermove", (event) => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        hero.style.setProperty("--parallax-x", (event.clientX / window.innerWidth - 0.5).toFixed(3));
        hero.style.setProperty("--parallax-y", (event.clientY / window.innerHeight - 0.5).toFixed(3));
      });
    }, { passive: true });

    document.documentElement.addEventListener("mouseleave", () => {
      hero.style.setProperty("--parallax-x", "0");
      hero.style.setProperty("--parallax-y", "0");
    });
  }

  // ==========================================================================
  // 5. CAROUSEL & FORMS
  // ==========================================================================
  const carousel = document.querySelector(".project-carousel");
  const cards = carousel ? Array.from(carousel.querySelectorAll(".project-card")) : [];
  const indicators = Array.from(document.querySelectorAll(".project-progress button"));

  function setActiveProject(index) {
    indicators.forEach((indicator, indicatorIndex) => {
      const isActive = index === indicatorIndex;
      indicator.classList.toggle("is-active", isActive);
      isActive ? indicator.setAttribute("aria-current", "true") : indicator.removeAttribute("aria-current");
    });
  }

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      if (cards[index]) {
        carousel.scrollTo({ left: cards[index].offsetLeft - carousel.offsetLeft, behavior: "smooth" });
        setActiveProject(index);
      }
    });
  });

  if (carousel) {
    carousel.addEventListener("scroll", () => {
      let closestIndex = 0;
      let closestDistance = Infinity;
      cards.forEach((card, index) => {
        const distance = Math.abs(card.offsetLeft - carousel.scrollLeft);
        if (distance < closestDistance) {
          closestIndex = index;
          closestDistance = distance;
        }
      });
      setActiveProject(closestIndex);
    }, { passive: true });
  }

  // ==========================================================================
  // 6. SCROLL SECTIONS & 3D ANIMATION LOGIC
  // ==========================================================================
  const main = document.querySelector("main");
  const heroStage = document.querySelector(".hero-stage");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  
  const stackedSections = [
    { element: document.querySelector(".about-section") },
    { element: document.querySelector(".projects-section") },
    { element: document.querySelector(".footer") },
  ].filter(s => s.element);

  let sectionStops = [];
  let scrollFrame = 0;

  function updateHeroScrollState() {
    document.body.classList.toggle("has-scrolled", window.scrollY > 2);
  }
  updateHeroScrollState();

  function getStickyOffset(section) {
    return Number.parseFloat(window.getComputedStyle(section.element).top) || 0;
  }

  function getDocumentTop(element) {
    let top = main.getBoundingClientRect().top + window.scrollY;
    let child = main.firstElementChild;
    while (child && child !== element) {
      const childStyle = window.getComputedStyle(child);
      top += child.offsetHeight + (Number.parseFloat(childStyle.marginTop) || 0) + (Number.parseFloat(childStyle.marginBottom) || 0);
      child = child.nextElementSibling;
    }
    return !child ? element.offsetTop : top + (Number.parseFloat(window.getComputedStyle(element).marginTop) || 0);
  }

  function getSectionStop(section) {
    return Math.max(0, getDocumentTop(section.element) - getStickyOffset(section));
  }

  function updateSectionStops() {
    sectionStops = stackedSections.map(getSectionStop);
  }

  function getTransitionDistance(index) {
    const interval = sectionStops[index + 1] - sectionStops[index];
    return Math.max(window.innerHeight * 0.8, interval * 0.6); 
  }

  function easeProgress(progress) {
    return progress * progress * (3 - 2 * progress);
  }

  function updateStackedSectionState() {
    const scrollY = window.scrollY;

    stackedSections.forEach((section, index) => {
      const entryStop = sectionStops[index];
      const exitStop = sectionStops[index + 1];
      const entryDistance = index > 0 ? getTransitionDistance(index - 1) : 0;
      const exitDistance = exitStop !== undefined ? getTransitionDistance(index) : 0;
      
      let angle = 0;
      let isPending = index > 0 && scrollY < entryStop;

      if (index > 0) {
        if (scrollY < entryStop) {
          angle = 180;
        } else if (scrollY < entryStop + entryDistance) {
          angle = 180 * (1 - easeProgress((scrollY - entryStop) / entryDistance));
        }
      }

      if (exitStop !== undefined && scrollY >= exitStop) {
        const exitProgress = (scrollY - exitStop) / exitDistance;
        if (exitProgress < 1) {
          angle = 180 * easeProgress(Math.min(1, exitProgress));
        }
      }

      if (reducedMotion.matches) {
        angle = 0;
        isPending = index > 0 && scrollY < entryStop;
      }

      section.element.classList.toggle("is-stacked-away", exitStop !== undefined && scrollY >= exitStop + exitDistance);
      section.element.style.setProperty("--flip-angle", `${angle}deg`);
      section.element.classList.toggle("is-flip-pending", isPending);
    });
  }

  // ==========================================================================
  // 7. CUSTOM SMOOTH SCROLL ENGINE (Dual-Speed System)
  // ==========================================================================
  let isScrollLocked = false;

  // The 'isFastScroll' flag tells the engine whether to use the snappy curve 
  // or the slow cinematic 3D curve.
  function customSmoothScroll(targetY, duration, isFastScroll = false) {
    const startY = window.scrollY;
    const difference = targetY - startY;
    const startTime = performance.now();
    isScrollLocked = true;

    function step(currentTime) {
      let progress = (currentTime - startTime) / duration;
      if (progress > 1) progress = 1;

      let ease;
      if (isFastScroll) {
        // Snappy Easing for Hero -> About (No flip involved)
        ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      } else {
        // Luxurious, cinematic Easing for 3D card flips (About -> Projects -> Footer)
        ease = progress < 0.5 ? 8 * Math.pow(progress, 4) : 1 - Math.pow(-2 * progress + 2, 4) / 2;
      }
      
      window.scrollTo(0, startY + difference * ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setTimeout(() => { isScrollLocked = false; }, 50);
      }
    }
    requestAnimationFrame(step);
  }

  function canScrollNestedElement(target, deltaY) {
    let element = target && target.nodeType === 1 ? target : null;
    while (element && element !== document.body && element !== document.documentElement) {
      const overflowY = window.getComputedStyle(element).overflowY;
      if ((overflowY === "auto" || overflowY === "scroll") && element.scrollHeight > element.clientHeight) {
        if ((deltaY > 0 && Math.ceil(element.scrollTop + element.clientHeight) < element.scrollHeight) ||
            (deltaY < 0 && element.scrollTop > 0)) {
          return true;
        }
      }
      element = element.parentElement;
    }
    return false;
  }

  function getWheelScrollStops() {
    return [0].concat(
      stackedSections.map((section, index) => {
        let stop = sectionStops[index];
        if (index > 0) stop += getTransitionDistance(index - 1);
        return stop;
      })
    );
  }

  // Handle Mouse Wheel Hijacking
  document.addEventListener("wheel", (event) => {
    if (
      event.ctrlKey || event.deltaY === 0 ||
      (event.target.closest && event.target.closest("dialog[open]")) ||
      canScrollNestedElement(event.target, event.deltaY)
    ) return;

    event.preventDefault(); 

    if (isScrollLocked) return;

    const direction = Math.sign(event.deltaY);
    if (direction === 0) return;

    const stops = getWheelScrollStops();
    const currentPosition = window.scrollY;
    let targetPosition;

    if (direction > 0) {
      targetPosition = stops.find(stop => stop > currentPosition + 5);
    } else {
      targetPosition = stops.slice().reverse().find(stop => stop < currentPosition - 5);
    }

    if (targetPosition !== undefined) {
      // Check if we are strictly transitioning between the Hero (0) and the First Section (stops[1])
      // If we are, we don't need a slow 3D animation duration.
      const isHeroTransition = (currentPosition <= stops[1] + 10 && targetPosition <= stops[1] + 10);
      
      const scrollDuration = reducedMotion.matches 
        ? 0 
        : (isHeroTransition ? 650 : 1200); // 650ms for snappy top scroll, 1200ms for 3D flips

      customSmoothScroll(targetPosition, scrollDuration, isHeroTransition);
    }
  }, { passive: false });


  // ==========================================================================
  // 8. GLOBAL SCROLL & RESIZE LISTENERS
  // ==========================================================================
  window.addEventListener("scroll", () => {
    updateHeroScrollState();
    if (!scrollFrame) {
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        updateStackedSectionState();
        updateActiveNavigation();
      });
    }
  }, { passive: true });

  window.addEventListener("resize", () => {
    updateSectionStops();
    updateStackedSectionState();
    updateActiveNavigation();
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      updateSectionStops();
      updateStackedSectionState();
      updateActiveNavigation();
    });
  }
  reducedMotion.addEventListener("change", updateStackedSectionState);

  // ==========================================================================
  // 9. SMOOTH LINK NAVIGATION (Clicking Header links)
  // ==========================================================================
  document.addEventListener("click", (event) => {
    const link = event.target.closest && event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || 
        event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute("download") || 
        (link.target && link.target !== "_self")) {
      return;
    }

    const targetId = link.getAttribute("href").slice(1);
    const targetSection = stackedSections.find(section => section.element && section.element.id === targetId);
    let targetPosition;

    if (heroStage && heroStage.id === targetId) {
      targetPosition = 0;
    } else if (targetSection) {
      targetPosition = getSectionStop(targetSection);
      const targetIndex = stackedSections.indexOf(targetSection);
      if (targetIndex > 0) targetPosition += getTransitionDistance(targetIndex - 1);
    } else {
      return;
    }

    event.preventDefault();
    window.history.pushState(null, "", `#${targetId}`);
    
    // Apply same dual-speed logic to clicks
    const stops = getWheelScrollStops();
    const currentPosition = window.scrollY;
    const isHeroTransition = (currentPosition <= stops[1] + 10 && targetPosition <= stops[1] + 10);
    
    const scrollDuration = reducedMotion.matches 
      ? 0 
      : (isHeroTransition ? 650 : 1200);

    customSmoothScroll(targetPosition, scrollDuration, isHeroTransition);
  });

  const navLinks = Array.from(document.querySelectorAll(".main-nav__link"));
  const navSections = navLinks.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);

  function updateActiveNavigation() {
    let activeIndex = 0;
    for (let index = 1; index < navSections.length; index += 1) {
      let transitionEnd = sectionStops[index - 1];
      if (index > 1) transitionEnd += getTransitionDistance(index - 2);
      if (window.scrollY + 1 >= transitionEnd) activeIndex = index;
    }
    navLinks.forEach((link, index) => {
      const active = index === activeIndex;
      link.classList.toggle("is-active", active);
      active ? link.setAttribute("aria-current", "location") : link.removeAttribute("aria-current");
    });
  }

  // Initialize
  updateSectionStops();
  updateStackedSectionState();
  updateActiveNavigation();
})();