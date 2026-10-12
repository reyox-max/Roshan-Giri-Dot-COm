(function () {
  var imageConnection =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  function useLowResolutionImages() {
    if (!imageConnection) {
      return false;
    }

    return (
      imageConnection.saveData ||
      /^(slow-2g|2g|3g)$/.test(imageConnection.effectiveType || "") ||
      (typeof imageConnection.downlink === "number" &&
        imageConnection.downlink < 1.5)
    );
  }

  function updateImageSources() {
    var lowResolution = useLowResolutionImages();
    document
      .querySelectorAll("img[data-high-res][data-low-res]")
      .forEach(function (image) {
        var source = lowResolution
          ? image.dataset.lowRes
          : image.dataset.highRes;
        if (image.getAttribute("src") !== source) {
          image.src = source;
        }
      });
  }

  updateImageSources();
  if (imageConnection && imageConnection.addEventListener) {
    imageConnection.addEventListener("change", updateImageSources);
  }

  document.body.classList.add("intro-complete");

  var cvViewer = document.querySelector("#cv-viewer");
  var cvOpenButton = document.querySelector(".navigate-link");
  var cvCloseButton = document.querySelector(".cv-viewer__close");

  if (cvViewer && cvOpenButton && cvCloseButton) {
    cvOpenButton.addEventListener("click", function () {
      cvViewer.showModal();
    });

    cvCloseButton.addEventListener("click", function () {
      cvViewer.close();
    });

    cvViewer.addEventListener("click", function (event) {
      if (event.target === cvViewer) {
        cvViewer.close();
      }
    });
  }

  var aboutDetails = document.querySelector(".about-section__details");
  var aboutSubtitle = document.querySelector("#about-subtitle");
  var aboutCopy = document.querySelector(".about-section__copy");
  var aboutExpandedView = document.querySelector(
    "#about-expanded-content"
  );
  var aboutCardButtons = Array.prototype.slice.call(
    document.querySelectorAll(".about-info-card[data-about-card]")
  );
  var aboutInformation = {
    education: {
      title: "Education",
      cards: [
        {
          title: "Current study",
          description: "4th Year Aerospace Engineering Undergraduate",
        },
        {
          title: "Campus",
          description: "IOE Pulchowk Campus",
        },
      ],
    },
    currently: {
      title: "Currently",
      cards: [
        {
          title: "Current role",
          description: "Aerospace Engineering student",
        },
        {
          title: "Open to",
          description: "Relevant opportunities, collaboration, and new challenges.",
        },
      ],
    },
    skills: {
      title: "Skills",
      cards: [
        {
          title: "CAD",
          description: "Computer-aided design for exploring and communicating ideas.",
        },
        {
          title: "Graphics",
          description: "Graphic design and visual composition.",
        },
        {
          title: "Web design",
          description: "Modern, responsive websites with attention to detail.",
        },
        {
          title: "Interactive interfaces",
          description: "Design and development for engaging interfaces.",
        },
      ],
    },
    interests: {
      title: "Interests",
      cards: [
        {
          title: "Aircraft",
          description: "Flight, aircraft design, and the ideas behind aviation.",
        },
        {
          title: "Spacecraft",
          description: "Space vehicles and the engineering behind exploration.",
        },
      ],
    },
  };
  function renderAboutInformation(information) {
    aboutExpandedView.replaceChildren();
    information.cards.forEach(function (card) {
      var element = document.createElement("article");
      var heading = document.createElement("h4");
      var description = document.createElement("p");

      element.className = "about-expanded-card";
      heading.textContent = card.title;
      description.textContent = card.description;
      element.append(heading, description);
      aboutExpandedView.appendChild(element);
    });
  }

  if (
    aboutDetails &&
    aboutSubtitle &&
    aboutCopy &&
    aboutExpandedView &&
    aboutCardButtons.length
  ) {
    aboutCardButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var information = aboutInformation[button.dataset.aboutCard];
        var isAlreadyOpen =
          button.getAttribute("aria-expanded") === "true";

        if (!information) {
          return;
        }

        aboutCardButtons.forEach(function (cardButton) {
          cardButton.classList.remove("is-active");
          cardButton.setAttribute("aria-expanded", "false");
          cardButton.querySelector(
            ".about-info-card__arrow"
          ).textContent = "↗";
        });

        if (isAlreadyOpen) {
          aboutDetails.classList.remove("is-expanded");
          aboutDetails.closest(".about-section").classList.remove(
            "is-about-expanded"
          );
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
        aboutDetails.closest(".about-section").classList.add(
          "is-about-expanded"
        );
        renderAboutInformation(information);
      });
    });
  }

  var fireflyHost = document.querySelector(".hero__fireflies");
  var fireflies = [
    ["8%", "76%", "-1.2s", "6.2s", "3px"],
    ["14%", "87%", "-4.4s", "7.8s", "4px"],
    ["19%", "63%", "-3.1s", "7.2s", "4px"],
    ["23%", "70%", "-2.6s", "8.4s", "3px"],
    ["31%", "91%", "-6.1s", "7.1s", "5px"],
    ["37%", "66%", "-1.8s", "8.1s", "3px"],
    ["42%", "79%", "-3.8s", "9.2s", "3px"],
    ["51%", "69%", "-0.9s", "6.8s", "4px"],
    ["55%", "95%", "-4.7s", "7.6s", "4px"],
    ["59%", "88%", "-5.5s", "8.7s", "3px"],
    ["67%", "75%", "-2.1s", "7.4s", "5px"],
    ["73%", "94%", "-6.7s", "9.5s", "3px"],
    ["80%", "66%", "-3.3s", "7.9s", "4px"],
    ["88%", "83%", "-1.7s", "8.9s", "3px"],
    ["95%", "72%", "-5.9s", "6.5s", "4px"],
  ];

  if (fireflyHost) {
    fireflies.forEach(function (firefly) {
      var element = document.createElement("i");
      element.style.setProperty("--left", firefly[0]);
      element.style.setProperty("--top", firefly[1]);
      element.style.setProperty("--delay", firefly[2]);
      element.style.setProperty("--duration", firefly[3]);
      element.style.setProperty("--size", firefly[4]);
      fireflyHost.appendChild(element);
    });
  }

  var cloudHost = document.querySelector(".hero__clouds");
  var clouds = cloudHost
    ? Array.prototype.slice.call(cloudHost.querySelectorAll(".hero__cloud"))
    : [];

  if (
    clouds.length &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    var previousCloudIndex = -1;

    function scheduleCloud() {
      var cloudIndex = Math.floor(Math.random() * clouds.length);
      if (clouds.length > 1 && cloudIndex === previousCloudIndex) {
        cloudIndex = (cloudIndex + 1) % clouds.length;
      }
      previousCloudIndex = cloudIndex;

      var cloud = clouds[cloudIndex];
      var duration = 20 + Math.random() * 8;
      cloud.style.setProperty("--cloud-duration", duration + "s");
      cloud.classList.add("is-animating");
      cloud.addEventListener(
        "animationend",
        function () {
          cloud.classList.remove("is-animating");
          window.setTimeout(scheduleCloud, 4000 + Math.random() * 8000);
        },
        { once: true }
      );
    }

    window.setTimeout(scheduleCloud, 2000 + Math.random() * 6000);
  }

  var hero = document.querySelector(".hero");
  var animationFrame = 0;

  if (hero && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener(
      "pointermove",
      function (event) {
        if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
        }
        animationFrame = window.requestAnimationFrame(function () {
          hero.style.setProperty(
            "--parallax-x",
            (event.clientX / window.innerWidth - 0.5).toFixed(3)
          );
          hero.style.setProperty(
            "--parallax-y",
            (event.clientY / window.innerHeight - 0.5).toFixed(3)
          );
        });
      },
      { passive: true }
    );

    document.documentElement.addEventListener("mouseleave", function () {
      hero.style.setProperty("--parallax-x", "0");
      hero.style.setProperty("--parallax-y", "0");
    });
  }

  var carousel = document.querySelector(".project-carousel");
  var cards = carousel
    ? Array.prototype.slice.call(carousel.querySelectorAll(".project-card"))
    : [];
  var indicators = Array.prototype.slice.call(
    document.querySelectorAll(".project-progress button")
  );

  function setActiveProject(index) {
    indicators.forEach(function (indicator, indicatorIndex) {
      var isActive = index === indicatorIndex;
      indicator.classList.toggle("is-active", isActive);
      if (isActive) {
        indicator.setAttribute("aria-current", "true");
      } else {
        indicator.removeAttribute("aria-current");
      }
    });
  }

  indicators.forEach(function (indicator, index) {
    indicator.addEventListener("click", function () {
      if (cards[index]) {
        carousel.scrollTo({
          left: cards[index].offsetLeft - carousel.offsetLeft,
          behavior: "smooth",
        });
        setActiveProject(index);
      }
    });
  });

  if (carousel) {
    carousel.addEventListener(
      "scroll",
      function () {
        var closestIndex = 0;
        var closestDistance = Infinity;
        cards.forEach(function (card, index) {
          var distance = Math.abs(card.offsetLeft - carousel.scrollLeft);
          if (distance < closestDistance) {
            closestIndex = index;
            closestDistance = distance;
          }
        });
        setActiveProject(closestIndex);
      },
      { passive: true }
    );
  }

  var form = document.querySelector(".message-form");
  var messageInput = document.querySelector("#message");
  var formStatus = document.querySelector(".form-status");

  if (form && messageInput && formStatus) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!messageInput.value.trim()) {
        messageInput.focus();
        return;
      }
      formStatus.textContent = "Message sent!";
      messageInput.value = "";
      messageInput.placeholder = "Message sent!";
    });

    messageInput.addEventListener("input", function () {
      formStatus.textContent = "";
      messageInput.placeholder = "Enter Your Message";
    });
  }

  var main = document.querySelector("main");
  var heroStage = document.querySelector(".hero-stage");
  function updateHeroScrollState() {
    document.body.classList.toggle("has-scrolled", window.scrollY > 2);
  }
  updateHeroScrollState();

  var stackedSections = [
    {
      element: document.querySelector(".about-section"),
    },
    {
      element: document.querySelector(".projects-section"),
    },
    {
      element: document.querySelector(".footer"),
    },
  ];

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var sectionStops = [];
  var scrollFrame = 0;

  function getStickyOffset(section) {
    return Number.parseFloat(
      window.getComputedStyle(section.element).top
    ) || 0;
  }

  function getDocumentTop(element) {
    var top = main.getBoundingClientRect().top + window.scrollY;
    var child = main.firstElementChild;

    while (child && child !== element) {
      var childStyle = window.getComputedStyle(child);
      top +=
        child.offsetHeight +
        (Number.parseFloat(childStyle.marginTop) || 0) +
        (Number.parseFloat(childStyle.marginBottom) || 0);
      child = child.nextElementSibling;
    }

    if (!child) {
      return element.offsetTop;
    }

    return top + (Number.parseFloat(window.getComputedStyle(element).marginTop) || 0);
  }

  function getSectionStop(section) {
    return Math.max(
      0,
      getDocumentTop(section.element) - getStickyOffset(section)
    );
  }

  function updateSectionStops() {
    sectionStops = stackedSections.map(getSectionStop);
  }

  function getTransitionDistance(index) {
    var interval = sectionStops[index + 1] - sectionStops[index];
    return Math.max(1, interval * 0.24);
  }

  function easeProgress(progress) {
    return progress * progress * (3 - 2 * progress);
  }

  function updateStackedSectionState() {
    var scrollY = window.scrollY;

    stackedSections.forEach(function (section, index) {
      var entryStop = sectionStops[index];
      var exitStop = sectionStops[index + 1];
      var entryDistance = index > 0 ? getTransitionDistance(index - 1) : 0;
      var exitDistance =
        exitStop !== undefined ? getTransitionDistance(index) : 0;
      var angle = 0;
      var isPending = index > 0 && scrollY < entryStop;

      if (index > 0) {
        if (scrollY < entryStop) {
          angle = 180;
        } else if (scrollY < entryStop + entryDistance) {
          angle =
            180 *
            (1 - easeProgress((scrollY - entryStop) / entryDistance));
        }
      }

      if (exitStop !== undefined && scrollY >= exitStop) {
        var exitProgress = (scrollY - exitStop) / exitDistance;
        if (exitProgress < 1) {
          angle = 180 * easeProgress(Math.min(1, exitProgress));
        }
      }

      if (reducedMotion.matches) {
        angle = 0;
        isPending = index > 0 && scrollY < entryStop;
      }

      section.element.classList.toggle(
        "is-stacked-away",
        exitStop !== undefined && scrollY >= exitStop + exitDistance
      );
      section.element.style.setProperty("--flip-angle", angle + "deg");
      section.element.classList.toggle("is-flip-pending", isPending);
    });
  }

  updateSectionStops();
  updateStackedSectionState();
  window.addEventListener(
    "scroll",
    function () {
      updateHeroScrollState();
      if (!scrollFrame) {
        scrollFrame = window.requestAnimationFrame(function () {
          scrollFrame = 0;
          updateStackedSectionState();
          updateActiveNavigation();
        });
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", function () {
    updateSectionStops();
    updateStackedSectionState();
    updateActiveNavigation();
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      updateSectionStops();
      updateStackedSectionState();
      updateActiveNavigation();
    });
  }
  reducedMotion.addEventListener("change", updateStackedSectionState);

  document.addEventListener("click", function (event) {
    var link =
      event.target.closest && event.target.closest('a[href^="#"]');
    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.hasAttribute("download") ||
      (link.target && link.target !== "_self")
    ) {
      return;
    }

    var targetId = link.getAttribute("href").slice(1);
    var targetSection = stackedSections.find(function (section) {
      return section.element && section.element.id === targetId;
    });
    var targetPosition;

    if (heroStage && heroStage.id === targetId) {
      targetPosition = 0;
    } else if (targetSection) {
      targetPosition = getSectionStop(targetSection);
      var targetIndex = stackedSections.indexOf(targetSection);
      if (targetIndex > 0) {
        targetPosition += getTransitionDistance(targetIndex - 1);
      }
    } else {
      return;
    }

    event.preventDefault();
    window.history.pushState(null, "", "#" + targetId);
    window.scrollTo({
      top: targetPosition,
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  });

  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".main-nav__link")
  );
  var navSections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  function updateActiveNavigation() {
    var activeIndex = 0;

    for (var index = 1; index < navSections.length; index += 1) {
      var transitionEnd = sectionStops[index - 1];
      if (index > 1) {
        transitionEnd += getTransitionDistance(index - 2);
      }
      if (window.scrollY + 1 >= transitionEnd) {
        activeIndex = index;
      }
    }

    navLinks.forEach(function (link, index) {
      var active = index === activeIndex;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  updateActiveNavigation();
})();
