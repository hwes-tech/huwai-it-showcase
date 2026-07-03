const pageButtons = document.querySelectorAll("[data-page]");
const pagePanels = document.querySelectorAll("[data-page-panel]");
const navTabs = document.querySelectorAll(".nav-tab");
const resultButtons = document.querySelectorAll("[data-result]");
const resultPanels = document.querySelectorAll("[data-result-panel]");
const heroSlider = document.querySelector("#hero-slider");
const sliderDots = document.querySelectorAll("[data-slide]");
const heroSlides = document.querySelectorAll(".hero-slide");
const heroCopy = document.querySelector(".hero-copy");
const heroBoard = document.querySelector(".hero-board");
const sliderDotGroup = document.querySelector(".slider-dots");
const structureImage = document.querySelector(".feature-image img");
const structureFigure = document.querySelector(".feature-image");
const structureContent = document.querySelector(".structure-content");
const stageGrid = document.querySelector(".structure-content .stage-grid");
const autoCarousels = document.querySelectorAll("[data-auto-carousel]");
const activePageEyebrow = document.querySelector("#active-page-eyebrow");
const activePageTitle = document.querySelector("#active-page-title");
const heroPageTitle = document.querySelector(".hero-page-title");
const scratchPlayerFrame = document.querySelector("#scratch-player-frame");
const scratchProjectButtons = document.querySelectorAll("[data-scratch-project]");
const inkScapeCarousels = document.querySelectorAll("[data-inkscape-carousel]");
const unpluggedCarousels = document.querySelectorAll("[data-unplugged-carousel]");
const microbitCarousels = document.querySelectorAll("[data-microbit-carousel]");
let activeSlide = 0;
let touchStartX = 0;
let heroAutoplayTimer;

const pageTitles = {
  structure: { eyebrow: "Curriculum", title: "課程架構" },
  honor: { eyebrow: "Honor Roll", title: "榮譽榜" },
  results: { eyebrow: "Learning Works", title: "教學成果" },
};

function updateActivePageTitle(pageName) {
  const pageTitle = pageTitles[pageName];
  if (!pageTitle || !activePageEyebrow || !activePageTitle) return;

  activePageEyebrow.textContent = pageTitle.eyebrow;
  activePageTitle.textContent = pageTitle.title;
}

function showPage(pageName) {
  pagePanels.forEach((panel) => {
    const isTarget = panel.dataset.pagePanel === pageName;
    panel.hidden = !isTarget;
    panel.classList.toggle("is-visible", isTarget);
  });

  navTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.page === pageName);
  });

  updateActivePageTitle(pageName);
  heroPageTitle?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showResult(resultName) {
  resultPanels.forEach((panel) => {
    const isTarget = panel.dataset.resultPanel === resultName;
    panel.hidden = !isTarget;
    panel.classList.toggle("is-visible", isTarget);
  });

  resultButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.result === resultName);
  });
}

pageButtons.forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});

document.querySelectorAll("[data-page-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

resultButtons.forEach((button) => {
  button.addEventListener("click", () => showResult(button.dataset.result));
});

function loadScratchProject(projectPath) {
  if (!scratchPlayerFrame) return;

  const projectUrl = new URL(projectPath, window.location.href).href;
  scratchPlayerFrame.src = `https://turbowarp.org/embed?project_url=${encodeURIComponent(projectUrl)}`;
}

scratchProjectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    scratchProjectButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    loadScratchProject(button.dataset.scratchProject);
  });
});

if (scratchProjectButtons.length > 0) {
  loadScratchProject(scratchProjectButtons[0].dataset.scratchProject);
}

function setHeroSliderHeight() {
  if (!heroSlider || !heroBoard) return;

  heroBoard.style.height = "";
  heroSlider.style.removeProperty("--slider-height");
}

function syncStructureHeight() {
  if (!structureImage || !structureFigure || !structureContent || !stageGrid) return;

  if (window.innerWidth <= 900) {
    structureFigure.style.marginTop = "";
    stageGrid.style.height = "";
    return;
  }

  const imageHeight = structureImage.getBoundingClientRect().height;
  structureFigure.style.marginTop = "0px";
  stageGrid.style.height = `${imageHeight}px`;
}

function showHeroSlide(slideIndex) {
  if (heroSlides.length === 0) return;

  activeSlide = (slideIndex + heroSlides.length) % heroSlides.length;
  const prevSlide = (activeSlide - 1 + heroSlides.length) % heroSlides.length;
  const nextSlide = (activeSlide + 1) % heroSlides.length;

  heroSlides.forEach((slide, index) => {
    slide.classList.toggle("is-active", index === activeSlide);
    slide.classList.toggle("is-prev", index === prevSlide);
    slide.classList.toggle("is-next", index === nextSlide);
  });

  sliderDots.forEach((dot) => {
    dot.classList.toggle("is-active", Number(dot.dataset.slide) === activeSlide);
  });

  requestAnimationFrame(setHeroSliderHeight);
}

function startHeroAutoplay() {
  if (heroSlides.length <= 1) return;

  window.clearInterval(heroAutoplayTimer);
  heroAutoplayTimer = window.setInterval(() => {
    showHeroSlide(activeSlide + 1);
  }, 3600);
}

sliderDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showHeroSlide(Number(dot.dataset.slide));
    startHeroAutoplay();
  });
});

heroSlider?.addEventListener("pointerdown", (event) => {
  touchStartX = event.clientX;
});

heroSlider?.addEventListener("pointerup", (event) => {
  const swipeDistance = event.clientX - touchStartX;
  if (Math.abs(swipeDistance) < 36) return;
  showHeroSlide(activeSlide + (swipeDistance < 0 ? 1 : -1));
  startHeroAutoplay();
});

window.addEventListener("load", () => {
  setHeroSliderHeight();
  syncStructureHeight();
  showHeroSlide(0);
  startHeroAutoplay();
});
window.addEventListener("resize", () => {
  setHeroSliderHeight();
  syncStructureHeight();
});
showHeroSlide(0);
syncStructureHeight();
startHeroAutoplay();

autoCarousels.forEach((carousel) => {
  const images = carousel.querySelectorAll("img");
  const dotGroup = carousel.querySelector(".honor-carousel-dots");
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  if (images.length <= 1) return;

  let activeImage = 0;

  images.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "honor-carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `切換到第 ${index + 1} 張照片`);
    dot.addEventListener("click", () => showHonorImage(index));
    dotGroup?.appendChild(dot);
  });

  const dots = carousel.querySelectorAll(".honor-carousel-dot");

  function showHonorImage(imageIndex) {
    images[activeImage].classList.remove("is-active");
    dots[activeImage]?.classList.remove("is-active");
    activeImage = (imageIndex + images.length) % images.length;
    images[activeImage].classList.add("is-active");
    dots[activeImage]?.classList.add("is-active");
  }

  prevButton?.addEventListener("click", () => showHonorImage(activeImage - 1));
  nextButton?.addEventListener("click", () => showHonorImage(activeImage + 1));

  showHonorImage(0);
  window.setInterval(() => showHonorImage(activeImage + 1), 3200);
});

inkScapeCarousels.forEach((carousel, carouselIndex) => {
  const images = carousel.querySelectorAll("img");
  const dotGroup = carousel.querySelector(".inkscape-dots");
  const prevButton = carousel.querySelector("[data-inkscape-prev]");
  const nextButton = carousel.querySelector("[data-inkscape-next]");
  if (images.length <= 1) return;

  let activeImage = 0;

  images.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "inkscape-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `切換到第 ${index + 1} 張照片`);
    dot.addEventListener("click", () => {
      showInkscapeImage(index);
      restartInkscapeAutoplay();
    });
    dotGroup?.appendChild(dot);
  });

  const dots = carousel.querySelectorAll(".inkscape-dot");
  let autoplayTimer;

  function showInkscapeImage(imageIndex) {
    images[activeImage].classList.remove("is-active");
    dots[activeImage]?.classList.remove("is-active");
    activeImage = (imageIndex + images.length) % images.length;
    images[activeImage].classList.add("is-active");
    dots[activeImage]?.classList.add("is-active");
  }

  function restartInkscapeAutoplay() {
    window.clearInterval(autoplayTimer);
    autoplayTimer = window.setInterval(() => {
      showInkscapeImage(activeImage + 1);
    }, 3000 + carouselIndex * 400);
  }

  prevButton?.addEventListener("click", () => {
    showInkscapeImage(activeImage - 1);
    restartInkscapeAutoplay();
  });
  nextButton?.addEventListener("click", () => {
    showInkscapeImage(activeImage + 1);
    restartInkscapeAutoplay();
  });

  showInkscapeImage(0);
  restartInkscapeAutoplay();
});

unpluggedCarousels.forEach((carousel) => {
  const images = carousel.querySelectorAll("img");
  const dotGroup = carousel.querySelector(".unplugged-dots");
  const prevButton = carousel.querySelector("[data-unplugged-prev]");
  const nextButton = carousel.querySelector("[data-unplugged-next]");
  if (images.length <= 1) return;

  let activeImage = 0;
  let autoplayTimer;

  images.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "unplugged-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `切換到第 ${index + 1} 張照片`);
    dot.addEventListener("click", () => {
      showUnpluggedImage(index);
      restartUnpluggedAutoplay();
    });
    dotGroup?.appendChild(dot);
  });

  const dots = carousel.querySelectorAll(".unplugged-dot");

  function showUnpluggedImage(imageIndex) {
    images[activeImage].classList.remove("is-active");
    dots[activeImage]?.classList.remove("is-active");
    activeImage = (imageIndex + images.length) % images.length;
    images[activeImage].classList.add("is-active");
    dots[activeImage]?.classList.add("is-active");
  }

  function restartUnpluggedAutoplay() {
    window.clearInterval(autoplayTimer);
    autoplayTimer = window.setInterval(() => {
      showUnpluggedImage(activeImage + 1);
    }, 3300);
  }

  prevButton?.addEventListener("click", () => {
    showUnpluggedImage(activeImage - 1);
    restartUnpluggedAutoplay();
  });

  nextButton?.addEventListener("click", () => {
    showUnpluggedImage(activeImage + 1);
    restartUnpluggedAutoplay();
  });

  showUnpluggedImage(0);
  restartUnpluggedAutoplay();
});

microbitCarousels.forEach((carousel) => {
  const images = carousel.querySelectorAll("img");
  const dotGroup = carousel.querySelector(".microbit-dots");
  const prevButton = carousel.querySelector("[data-microbit-prev]");
  const nextButton = carousel.querySelector("[data-microbit-next]");
  if (images.length <= 1) return;

  let activeImage = 0;
  let autoplayTimer;

  images.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "microbit-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `切換到第 ${index + 1} 張照片`);
    dot.addEventListener("click", () => {
      showMicrobitImage(index);
      restartMicrobitAutoplay();
    });
    dotGroup?.appendChild(dot);
  });

  const dots = carousel.querySelectorAll(".microbit-dot");

  function showMicrobitImage(imageIndex) {
    images[activeImage].classList.remove("is-active");
    dots[activeImage]?.classList.remove("is-active");
    activeImage = (imageIndex + images.length) % images.length;
    images[activeImage].classList.add("is-active");
    dots[activeImage]?.classList.add("is-active");
  }

  function restartMicrobitAutoplay() {
    window.clearInterval(autoplayTimer);
    autoplayTimer = window.setInterval(() => {
      showMicrobitImage(activeImage + 1);
    }, 3200);
  }

  prevButton?.addEventListener("click", () => {
    showMicrobitImage(activeImage - 1);
    restartMicrobitAutoplay();
  });

  nextButton?.addEventListener("click", () => {
    showMicrobitImage(activeImage + 1);
    restartMicrobitAutoplay();
  });

  showMicrobitImage(0);
  restartMicrobitAutoplay();
});
