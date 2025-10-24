# 🚀 Modern Pagination Web Component

A flexible, accessible, and beautifully designed web component for seamless content navigation. Built with pure vanilla JavaScript and modern web standards.

## ✨ Features

- 🎯 **Zero Dependencies** - Pure vanilla JavaScript implementation
- 📱 **Responsive Design** - Works perfectly on all screen sizes
- ♿ **Accessible** - Full ARIA support and keyboard navigation
- 🎨 **Customizable** - Easy styling with CSS custom properties
- 🔧 **Flexible API** - Comprehensive JavaScript methods and events
- 🚀 **Performance** - Lightweight and optimized for speed
- 🔄 **Dynamic Content** - Auto-updates when items are added/removed
- 🎪 **Slot-based** - Use any HTML content as paginated items
- 🌐 **Framework Agnostic** - Works with React, Vue, Angular, or vanilla JS

## 📦 Installation

```html
<script src="path/to/pagination-wc.js"></script>
```

## 🚀 Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pagination Example</title>
</head>
<body>
    <!-- Basic pagination with default settings -->
    <pagination-wc>
        <div slot="items">Item 1</div>
        <div slot="items">Item 2</div>
        <div slot="items">Item 3</div>
        <div slot="items">Item 4</div>
        <div slot="items">Item 5</div>
    </pagination-wc>

    <script src="pagination-wc.js"></script>
</body>
</html>
```

### Custom Configuration

```html
<pagination-wc 
    items-per-page="5" 
    prev-text="← Previous" 
    next-text="Next →"
    id="my-pagination">
    
    <div slot="items" class="product-card">
        <h3>Product 1</h3>
        <p>Product description...</p>
    </div>
    <!-- More items... -->
</pagination-wc>
```

## 📋 API Reference

### HTML Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `items-per-page` | Number | `3` | Number of items to display per page |
| `prev-text` | String | `"Prev"` | Text or HTML for previous button |
| `next-text` | String | `"Next"` | Text or HTML for next button |
| `id` | String | `auto` | Unique identifier for JavaScript access |

### JavaScript Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `goToPage(pageNumber)` | `pageNumber: Number` | `void` | Navigate to specific page (1-based) |
| `refresh()` | None | `void` | Recalculate pagination after content changes |
| `getCurrentPage()` | None | `Number` | Get current active page number |
| `getTotalPages()` | None | `Number` | Get total number of pages |

### Custom Events

#### `pagechange` Event

Fired when the user navigates to a different page.

```javascript
document.getElementById('my-pagination').addEventListener('pagechange', (event) => {
    console.log('Page changed:', event.detail);
    // event.detail contains:
    // {
    //     currentPage: 2,
    //     totalPages: 5,
    //     itemsPerPage: 3,
    //     startIndex: 3,
    //     endIndex: 6
    // }
});
```

## 💡 Usage Examples

### E-commerce Product Grid

```html
<pagination-wc items-per-page="6" prev-text="← Previous Products" next-text="Next Products →">
    <div slot="items" class="product-card">
        <img src="product1.jpg" alt="Product 1">
        <h3>Wireless Headphones</h3>
        <p class="price">$99.99</p>
        <button class="btn-primary">Add to Cart</button>
    </div>
    <!-- More products... -->
</pagination-wc>
```

### User Directory

```html
<pagination-wc items-per-page="5">
    <div slot="items" class="user-card">
        <div class="user-avatar">AE</div>
        <div class="user-info">
            <h4>Albert Einstein</h4>
            <p>Theoretical Physicist</p>
            <p>albert.einstein@example.com</p>
        </div>
    </div>
    <!-- More users... -->
</pagination-wc>
```

### Data Table Pagination

```html
<pagination-wc items-per-page="10" id="table-pagination">
    <table slot="items" class="data-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>#001</td>
                <td>John Doe</td>
                <td>john@example.com</td>
                <td>Active</td>
            </tr>
        </tbody>
    </table>
    <!-- More table pages... -->
</pagination-wc>
```

## 🎨 Styling & Customization

### CSS Custom Properties

```css
pagination-wc {
    --pagination-button-color: #007bff;
    --pagination-button-hover: #0056b3;
    --pagination-active-bg: #28a745;
    --pagination-border-radius: 8px;
    --pagination-gap: 0.5rem;
}
```

### Custom Styles

```css
/* Style the pagination container */
pagination-wc {
    display: block;
    margin: 2rem 0;
}

/* Customize pagination buttons */
pagination-wc::part(pagination-button) {
    background: linear-gradient(45deg, #667eea, #764ba2);
    border: none;
    color: white;
    border-radius: 25px;
    font-weight: 600;
    transition: all 0.3s ease;
}

pagination-wc::part(pagination-button):hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
```

## 🔧 Advanced Usage

### Dynamic Content Management

```javascript
const pagination = document.getElementById('my-pagination');

// Add new items dynamically
function addNewItem(content) {
    const newItem = document.createElement('div');
    newItem.slot = 'items';
    newItem.innerHTML = content;
    
    pagination.appendChild(newItem);
    pagination.refresh(); // Always refresh after adding items
}

// Remove items
function removeItem(index) {
    const items = pagination.querySelectorAll('[slot="items"]');
    if (items[index]) {
        items[index].remove();
        pagination.refresh();
    }
}
```

### URL Integration

```javascript
// Update URL when page changes
pagination.addEventListener('pagechange', (event) => {
    const url = new URL(window.location);
    url.searchParams.set('page', event.detail.currentPage);
    history.replaceState(null, '', url);
});

// Initialize from URL on page load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('page')) || 1;
    pagination.goToPage(page);
});
```

### AJAX Integration

```javascript
// Load data via AJAX
async function loadPageData(page) {
    try {
        const response = await fetch(`/api/data?page=${page}&limit=10`);
        const data = await response.json();
        
        // Clear existing items
        const items = pagination.querySelectorAll('[slot="items"]');
        items.forEach(item => item.remove());
        
        // Add new items
        data.items.forEach(item => {
            const element = document.createElement('div');
            element.slot = 'items';
            element.innerHTML = createItemHTML(item);
            pagination.appendChild(element);
        });
        
        pagination.refresh();
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}

// Listen for page changes
pagination.addEventListener('pagechange', (event) => {
    loadPageData(event.detail.currentPage);
});
```

## 🎯 Framework Integration

### React

```jsx
import React, { useRef, useEffect } from 'react';

function ProductList({ products }) {
    const paginationRef = useRef();
    
    useEffect(() => {
        const handlePageChange = (event) => {
            console.log('Page changed:', event.detail.currentPage);
            // Update application state
        };
        
        const pagination = paginationRef.current;
        if (pagination) {
            pagination.addEventListener('pagechange', handlePageChange);
            return () => {
                pagination.removeEventListener('pagechange', handlePageChange);
            };
        }
    }, []);
    
    return (
        <pagination-wc 
            ref={paginationRef} 
            items-per-page="6"
            prev-text="← Previous"
            next-text="Next →">
            {products.map(product => (
                <div key={product.id} slot="items">
                    <ProductCard product={product} />
                </div>
            ))}
        </pagination-wc>
    );
}
```

### Vue.js

```vue
<template>
    <pagination-wc 
        :items-per-page="itemsPerPage"
        :prev-text="prevText"
        :next-text="nextText"
        @pagechange="onPageChange"
        ref="pagination">
        
        <div 
            v-for="item in items" 
            :key="item.id" 
            slot="items">
            {{ item.content }}
        </div>
    </pagination-wc>
</template>

<script>
export default {
    data() {
        return {
            itemsPerPage: 5,
            prevText: '← Back',
            nextText: 'Next →',
            items: []
        };
    },
    methods: {
        onPageChange(event) {
            this.$emit('page-changed', event.detail);
        }
    }
};
</script>
```

## 📱 Browser Support

- ✅ Chrome 54+
- ✅ Firefox 63+  
- ✅ Safari 10.1+
- ✅ Edge 79+
- ✅ Opera 41+

> **Note:** Requires support for Custom Elements v1. For older browsers, consider using a [polyfill](https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements).

## 🚀 Performance Tips

1. **Use `refresh()` judiciously** - Only call after batch operations
2. **Optimize item rendering** - Use lightweight HTML structures
3. **Implement lazy loading** - Load items on-demand for large datasets
4. **Debounce rapid updates** - Prevent excessive recalculations

```javascript
// Debounced refresh for multiple rapid updates
let refreshTimeout;
function debouncedRefresh() {
    clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(() => {
        pagination.refresh();
    }, 100);
}
```

## 🔍 Accessibility Features

- **ARIA Labels** - Proper labeling for screen readers
- **Keyboard Navigation** - Full keyboard support
- **Focus Management** - Logical tab order
- **Screen Reader Support** - Announces page changes
- **High Contrast** - Supports high contrast modes

### Accessibility Best Practices

```html
<!-- Provide meaningful labels -->
<pagination-wc 
    prev-text="Previous products"
    next-text="Next products"
    aria-label="Product pagination">
    
    <!-- Use semantic HTML in items -->
    <article slot="items">
        <h3>Product Title</h3>
        <p>Product description</p>
    </article>
</pagination-wc>
```

## 🐛 Troubleshooting

### Common Issues

**Q: Pagination doesn't appear**
```javascript
// Ensure items are properly slotted
<div slot="items">Content here</div>

// Check if refresh is needed after dynamic content
pagination.refresh();
```

**Q: Events not firing**
```javascript
// Wait for component to be ready
document.addEventListener('DOMContentLoaded', () => {
    const pagination = document.getElementById('my-pagination');
    pagination.addEventListener('pagechange', handlePageChange);
});
```

**Q: Styles not applying**
```css
/* Use ::part() selector for styling shadow DOM */
pagination-wc::part(pagination-button) {
    /* Your styles here */
}
```

## 📂 Project Structure

```
pagination-component/
├── README.md
├── LICENSE
├── package.json
├── src/
│   ├── pagination-component.js     # Main component source
│   └── pagination-wc.js           # Compiled component
├── examples/
│   ├── index.html                 # Interactive examples
│   ├── basic.html                 # Basic usage examples
│   └── advanced.html              # Advanced examples
├── tests/
│   ├── unit.test.js              # Unit tests
│   └── integration.test.js       # Integration tests
└── docs/
    ├── api.md                    # API documentation
    └── examples.md               # Usage examples
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/pagination-wc.git
   cd pagination-wc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Vega**
- Email: iam@freelanceuideveloper.com
- GitHub: [@your-github-username](https://github.com/your-username)
- Website: [your-website.com](https://your-website.com)

## 🙏 Acknowledgments

- Inspired by modern web component best practices
- Built with love for the web development community
- Thanks to all contributors and users

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/your-username/pagination-wc?style=social)
![GitHub forks](https://img.shields.io/github/forks/your-username/pagination-wc?style=social)
![GitHub issues](https://img.shields.io/github/issues/your-username/pagination-wc)
![GitHub last commit](https://img.shields.io/github/last-commit/your-username/pagination-wc)

---

<div align="center">
    <p>Made with ❤️ for the web development community</p>
    <p>⭐ Star this repo if you find it useful!</p>
</div>
