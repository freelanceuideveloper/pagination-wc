/**
 * Modern Pagination Web Component
 *
 * @fileoverview A flexible, accessible, and customizable pagination web component
 * @version 1.0.0
 * @author Vega <iam@freelanceuideveloper.com>
 * @created October 23, 2025
 * @license MIT
 *
 * @description
 * This web component provides a complete pagination solution with the following features:
 * - Responsive design that works on all screen sizes
 * - Customizable items per page
 * - Programmable API for external control
 * - Accessible navigation with ARIA support
 * - Event-driven architecture with custom events
 * - Slot-based content projection for maximum flexibility
 * - Auto-calculation of total pages based on content
 * - Mobile-optimized pagination controls
 *
 * @example
 * <pagination-wc items-per-page="5" prev-text="← Previous" next-text="Next →">
 *   <div slot="items">Item 1</div>
 *   <div slot="items">Item 2</div>
 * </pagination-wc>
 *
 * @dependencies None - Pure vanilla JavaScript web component
 * @browser-support Modern browsers that support Custom Elements v1
 */

/**
 * PaginationWebComponent - Main class for the pagination web component
 *
 * @class
 * @extends HTMLElement
 * @since 1.0.0
 */
class PaginationWebComponent extends HTMLElement {
  /**
   * Constructor - Initializes the pagination component
   * Sets up shadow DOM and default configuration
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Default configuration values
    this.itemsPerPage = 3; // Default items to show per page
    this.prevText = "Prev"; // Default previous button text
    this.nextText = "Next"; // Default next button text

    // Internal state management
    this.currentPage = 1; // Current active page (1-based)
    this.totalPages = 1; // Total number of pages available
    this.items = []; // Array of all paginated items

    // Initialize component
    this.render();
    this.setupEventListeners();
  }

  /**
   * Define which attributes should trigger attributeChangedCallback
   *
   * @static
   * @returns {string[]} Array of attribute names to observe
   */
  static get observedAttributes() {
    return ["items-per-page", "prev-text", "next-text"];
  }

  /**
   * Handle attribute changes and update component accordingly
   *
   * @param {string} name - Name of the changed attribute
   * @param {string} oldValue - Previous attribute value
   * @param {string} newValue - New attribute value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // Only process if value actually changed
    if (oldValue !== newValue) {
      switch (name) {
        case "items-per-page":
          // Parse and validate items per page (minimum 1, default 3)
          this.itemsPerPage = parseInt(newValue) || 3;
          break;
        case "prev-text":
          // Update previous button text
          this.prevText = newValue || "Prev";
          break;
        case "next-text":
          // Update next button text
          this.nextText = newValue || "Next";
          break;
      }
      // Recalculate pagination after attribute change
      this.updatePagination();
      // Update button text
      this.updateButtonText();
    }
  }

  /**
   * Lifecycle callback - Called when component is added to DOM
   * Initializes pagination after a short delay to ensure slot content is ready
   */
  connectedCallback() {
    // Use setTimeout to ensure slot content is fully loaded
    setTimeout(() => {
      this.initializePagination();
      this.updateButtonText();
    }, 0);
  }

  /**
   * Render the component's shadow DOM structure and styles
   * Creates the complete HTML template with embedded CSS
   * @private
   */
  render() {
    this.shadowRoot.innerHTML = `
            <style>
                /* Host element styles */
                :host {
                    display: block;
                }
                
                /* Main container layout */
                .pagination-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                /* Items container - uses display: contents for transparent layout */
                .items-container {
                    display: contents;
                }
                
                /* Special handling for table containers */
                :host(.table-container) .items-container {
                    display: contents;
                }
                
                /* Pagination controls layout */
                .pagination-controls {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 0.25rem;
                    margin-top: 1rem;
                }
                
                /* Base button styles for pagination controls */
                .pagination-btn {
                    padding: 0.5rem 0.75rem;
                    border: 1px solid #ccc;
                    background-color: #fff;
                    cursor: pointer;
                    border-radius: 0.25rem;
                    font-size: 0.875rem;
                    transition: all 0.2s ease;
                }
                
                /* Button hover states */
                .pagination-btn:hover:not(:disabled) {
                    background-color: #f8f9fa;
                    border-color: #adb5bd;
                }
                
                /* Disabled button styles */
                .pagination-btn:disabled {
                    cursor: not-allowed;
                    opacity: 0.6;
                    background-color: #e9ecef;
                }
                
                /* Active page button styles */
                .pagination-btn.active {
                    background-color: #007bff;
                    color: #fff;
                    border-color: #007bff;
                    font-weight: bold;
                }
                
                /* Active button hover state */
                .pagination-btn.active:hover {
                    background-color: #0056b3;
                    border-color: #0056b3;
                }
                
                /* Container for page number buttons */
                .numbers-container {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }
                
                /* Mobile responsive styles */
                @media (max-width: 768px) {
                    .pagination-controls {
                        flex-wrap: wrap;
                        gap: 0.125rem;
                    }
                    
                    .pagination-btn {
                        padding: 0.375rem 0.5rem;
                        font-size: 0.8rem;
                    }
                }
            </style>
            
            <!-- Main pagination container -->
            <div class="pagination-container">
                <!-- Content area - uses slot for content projection -->
                <div class="items-container">
                    <slot name="items"></slot>
                </div>
                
                <!-- Pagination controls (hidden by default until items are loaded) -->
                <div class="pagination-controls" style="display: none;">
                    <!-- Previous page button -->
                    <button class="pagination-btn prev-btn" type="button" aria-label="Go to previous page">
                        <slot name="prev-text"><span class="prev-text">${this.prevText}</span></slot>
                    </button>
                    
                    <!-- Container for numbered page buttons -->
                    <div class="numbers-container" role="navigation" aria-label="Pagination Navigation">
                        <!-- Page number buttons will be dynamically inserted here -->
                    </div>
                    
                    <!-- Next page button -->
                    <button class="pagination-btn next-btn" type="button" aria-label="Go to next page">
                        <slot name="next-text"><span class="next-text">${this.nextText}</span></slot>
                    </button>
                </div>
            </div>
        `;
  }

  /**
   * Set up event listeners for pagination controls
   * Handles previous/next button clicks and page number selection
   * @private
   */
  setupEventListeners() {
    // Get references to control elements
    const prevBtn = this.shadowRoot.querySelector(".prev-btn");
    const nextBtn = this.shadowRoot.querySelector(".next-btn");
    const numbersContainer =
      this.shadowRoot.querySelector(".numbers-container");

    // Add error handling for missing elements
    if (!prevBtn || !nextBtn || !numbersContainer) {
      console.error('Pagination component: Required elements not found in shadow DOM');
      return;
    }

    // Previous button click handler
    prevBtn.addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updateDisplay();
      }
    });

    // Next button click handler
    nextBtn.addEventListener("click", () => {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updateDisplay();
      }
    });

    // Page number buttons click handler (using event delegation)
    numbersContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("page-number")) {
        const pageNumber = parseInt(e.target.dataset.page);
        // Only navigate if clicking a different page
        if (pageNumber !== this.currentPage) {
          this.currentPage = pageNumber;
          this.updateDisplay();
        }
      }
    });

    // Handle window resize for responsive pagination
    window.addEventListener("resize", () => {
      this.updatePaginationVisibility();
    });
  }

  /**
   * Initialize pagination by discovering items and setting up initial state
   * Called when component is connected to DOM or when content changes
   * @public
   */
  initializePagination() {
    try {
      // Get all items assigned to the "items" slot
      const slot = this.shadowRoot.querySelector('slot[name="items"]');
      
      if (!slot) {
        console.warn('Pagination component: Items slot not found');
        this.items = [];
      } else {
        const assignedElements = slot.assignedElements();
        this.items = assignedElements;

        // Fallback: if no slotted elements, search in light DOM
        if (this.items.length === 0) {
          this.items = Array.from(this.querySelectorAll('[slot="items"]'));
        }
      }

      // Reset to first page if current page is invalid
      if (this.currentPage < 1) {
        this.currentPage = 1;
      }

      // Calculate pagination and update display
      this.calculateTotalPages();
      this.updatePagination();
    } catch (error) {
      console.error('Pagination component initialization failed:', error);
    }
  }

  /**
   * Calculate total number of pages based on items and items per page
   * @private
   */
  calculateTotalPages() {
    this.totalPages = Math.ceil(this.items.length / this.itemsPerPage) || 1;
    
    // Ensure current page is within valid range
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  /**
   * Update the entire pagination state and display
   * Recalculates pages, recreates controls, and updates visibility
   * @public
   */
  updatePagination() {
    this.calculateTotalPages();
    this.createPageNumbers();
    this.updateDisplay();

    // Show/hide pagination controls based on page count
    const paginationControls = this.shadowRoot.querySelector(
      ".pagination-controls"
    );
    paginationControls.style.display = this.totalPages > 1 ? "flex" : "none";
  }

  /**
   * Create page number buttons dynamically based on total pages
   * Handles accessibility attributes and active state
   * @private
   */
  createPageNumbers() {
    const numbersContainer =
      this.shadowRoot.querySelector(".numbers-container");
    numbersContainer.innerHTML = "";

    // Create a button for each page
    for (let i = 1; i <= this.totalPages; i++) {
      const button = document.createElement("button");
      button.className = "pagination-btn page-number";
      button.dataset.page = i;
      button.textContent = i;
      button.setAttribute("aria-label", `Go to page ${i}`);

      // Mark current page as active
      if (i === this.currentPage) {
        button.classList.add("active");
        button.setAttribute("aria-current", "page");
      }

      numbersContainer.appendChild(button);
    }

    // Update responsive visibility
    this.updatePaginationVisibility();
  }

  /**
   * Update visibility of page numbers based on screen size and current page
   * Implements responsive pagination by hiding non-essential page numbers
   * @private
   */
  updatePaginationVisibility() {
    const buttons = this.shadowRoot.querySelectorAll(".page-number");
    const isMobile = window.innerWidth < 768;
    const displayCount = isMobile ? 3 : 5; // Show fewer buttons on mobile

    buttons.forEach((button) => {
      const pageNumber = parseInt(button.dataset.page);
      const shouldShow = this.shouldShowPageNumber(pageNumber, displayCount);
      button.style.display = shouldShow ? "" : "none";
    });
  }

  /**
   * Determine if a page number should be visible based on current page and display constraints
   * @param {number} pageNumber - The page number to check
   * @param {number} displayCount - Maximum number of page buttons to show
   * @returns {boolean} Whether the page number should be visible
   * @private
   */
  shouldShowPageNumber(pageNumber, displayCount) {
    // Always show first page, last page, and current page
    if (
      pageNumber === 1 ||
      pageNumber === this.totalPages ||
      pageNumber === this.currentPage
    ) {
      return true;
    }

    // Show pages within range of current page
    const range = Math.floor(displayCount / 2);
    return Math.abs(pageNumber - this.currentPage) <= range;
  }

  /**
   * Update the display to show items for the current page
   * Handles item visibility, button states, and fires change events
   * @private
   */
  updateDisplay() {
    // Hide all items initially
    this.items.forEach((item) => {
      item.style.display = "none";
    });

    // Calculate which items to show for current page
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // Show items for current page
    for (let i = startIndex; i < endIndex && i < this.items.length; i++) {
      this.items[i].style.display = "";
    }

    // Update UI state
    this.updateButtonStates();
    this.updateActivePageNumber();
    this.updatePaginationVisibility();

    // Fire custom event for external listeners
    this.dispatchEvent(
      new CustomEvent("pagechange", {
        detail: {
          currentPage: this.currentPage,
          totalPages: this.totalPages,
          itemsPerPage: this.itemsPerPage,
          startIndex: startIndex,
          endIndex: Math.min(endIndex, this.items.length),
        },
        bubbles: true,
      })
    );
  }

  /**
   * Update the enabled/disabled state of navigation buttons
   * @private
   */
  updateButtonStates() {
    const prevBtn = this.shadowRoot.querySelector(".prev-btn");
    const nextBtn = this.shadowRoot.querySelector(".next-btn");

    // Add error handling
    if (!prevBtn || !nextBtn) {
      console.warn('Pagination component: Navigation buttons not found');
      return;
    }

    // Disable previous button on first page
    prevBtn.disabled = this.currentPage === 1;
    // Disable next button on last page
    nextBtn.disabled = this.currentPage === this.totalPages;
  }

  /**
   * Update the active state of page number buttons
   * @private
   */
  updateActivePageNumber() {
    const buttons = this.shadowRoot.querySelectorAll(".page-number");
    buttons.forEach((button) => {
      const isActive = parseInt(button.dataset.page) === this.currentPage;
      button.classList.toggle("active", isActive);

      // Update accessibility attributes
      if (isActive) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    });
  }

  /**
   * Update the text content of navigation buttons
   * Handles both slot-based and attribute-based text
   * @private
   */
  updateButtonText() {
    // Check if slots are being used
    const prevSlot = this.shadowRoot.querySelector('slot[name="prev-text"]');
    const nextSlot = this.shadowRoot.querySelector('slot[name="next-text"]');
    
    // Update fallback text (when no slot content is provided)
    const prevTextElement = this.shadowRoot.querySelector(".prev-text");
    const nextTextElement = this.shadowRoot.querySelector(".next-text");
    
    if (prevTextElement) {
      prevTextElement.textContent = this.prevText;
    }
    if (nextTextElement) {
      nextTextElement.textContent = this.nextText;
    }
  }

  /* ==================== PUBLIC API METHODS ==================== */

  /**
   * Navigate to a specific page number
   * @param {number} pageNumber - The page number to navigate to (1-based)
   * @public
   */
  goToPage(pageNumber) {
    // Validate page number and only navigate if different from current
    if (
      pageNumber >= 1 &&
      pageNumber <= this.totalPages &&
      pageNumber !== this.currentPage
    ) {
      this.currentPage = pageNumber;
      this.updateDisplay();
    }
  }

  /**
   * Refresh the pagination by recalculating items and pages
   * Useful when items are dynamically added or removed
   * @public
   */
  refresh() {
    this.initializePagination();
  }

  /**
   * Get the current active page number
   * @returns {number} Current page number (1-based)
   * @public
   */
  getCurrentPage() {
    return this.currentPage;
  }

  /**
   * Get the total number of pages
   * @returns {number} Total number of pages
   * @public
   */
  getTotalPages() {
    return this.totalPages;
  }
}

/**
 * Register the custom element with the browser
 * Makes <pagination-wc> available as a custom HTML element
 * @since 1.0.0
 */
customElements.define("pagination-wc", PaginationWebComponent);

/**
 * Export for module-based usage (only if modules are supported)
 * @module PaginationWebComponent
 */
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS export
  module.exports = { PaginationWebComponent };
} else if (typeof window !== 'undefined') {
  // Browser global export
  window.PaginationWebComponent = PaginationWebComponent;
}

// ES6 module export (if supported)
// Uncomment the line below if using this as an ES6 module:
// export { PaginationWebComponent };
