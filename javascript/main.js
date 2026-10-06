// Wait until the HTML document has been fully parsed before running the code.
// This ensures the navigation elements exist before JavaScript tries to select them.
document.addEventListener("DOMContentLoaded", () => {

  // Find the mobile menu button and the navigation container.
  // These elements are shared across all three HTML pages.
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");

  // Closes the mobile navigation and resets its accessibility attributes.
  // The check prevents errors if either element is missing from a page.
  function closeMenu() {
    if (!menuToggle || !siteNav) return;

    // Remove the class that makes the mobile navigation visible.
    siteNav.classList.remove("open");

    // Update the button's accessibility state and screen-reader label.
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  // Only attach menu functionality if both required elements exist.
  if (menuToggle && siteNav) {

    // Listen for clicks on the mobile menu button.
    menuToggle.addEventListener("click", () => {

      // Read the current expanded state.
      // aria-expanded is stored as a string, so compare it with "true".
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      // Toggle the accessibility state between true and false.
      // String() converts the Boolean value into the required attribute string.
      menuToggle.setAttribute("aria-expanded", String(!isOpen));

      // Change the accessible label to describe the action the button will perform.
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Open navigation" : "Close navigation"
      );

      // Add or remove the "open" class to show or hide the mobile navigation.
      // The second argument explicitly sets the class based on the new state.
      siteNav.classList.toggle("open", !isOpen);
    });

    // Select every link inside the navigation.
    // Close the mobile menu after a user chooses a destination.
    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Allow keyboard users to close the mobile menu with Escape.
    document.addEventListener("keydown", (event) => {

      // Only respond when Escape is pressed and the menu is currently open.
      if (event.key === "Escape" && siteNav.classList.contains("open")) {
        closeMenu();

        // Return keyboard focus to the menu button after closing.
        menuToggle.focus();
      }
    });

    // Check the viewport whenever the browser window is resized.
    window.addEventListener("resize", () => {

      // Close the mobile menu when the viewport becomes wider than 640px.
      // This matches the mobile navigation breakpoint in the CSS.
      if (window.innerWidth > 640) {
        closeMenu();
      }
    });
  }

  // Select the elements that should animate into view as the user scrolls.
  // querySelectorAll returns a collection of every matching element.
  const revealElements = document.querySelectorAll(
    ".project-card, .capability, .case-study, .skill-group, .project-detail-section"
  );

  // Check whether the visitor has requested reduced motion in their
  // operating system or browser accessibility settings.
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // If reduced motion is enabled, or IntersectionObserver is unsupported,
  // display all elements immediately instead of using scroll animations.
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

    // Stop running the rest of this callback because no observer is needed.
    return;
  }

  // Create an observer that detects when elements enter the viewport.
  const revealObserver = new IntersectionObserver(

    // This callback runs whenever an observed element's visibility changes.
    (entries, observer) => {
      entries.forEach((entry) => {

        // Check whether the element has entered the visible portion of the page.
        if (entry.isIntersecting) {

          // Add the class that triggers the CSS reveal animation.
          entry.target.classList.add("visible");

          // Stop observing this element once it has appeared.
          // This prevents the same animation from repeatedly triggering.
          observer.unobserve(entry.target);
        }
      });
    },

    // Configure when the observer considers an element visible.
    {
      // Trigger when approximately 10% of the element is visible.
      threshold: 0.1,

      // Adjust the observer's detection area.
      // The negative bottom margin delays the trigger slightly.
      rootMargin: "0px 0px -30px 0px"
    }
  );

  // Add the initial hidden/reveal class and begin observing each element.
  revealElements.forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
  });
});