# All AI prompts you used to build the POC (exact wording)

## Prompt 1:

File: `src/types/Customer.ts`
Define a Region type with 'APAC', 'UK', 'US' values and a Customer interface containing:

- customerId: 6-character uppercase alphanumeric string
- name, email, phone: standard string fields
- region: Region type

File: `src/types/Order.ts`
Define OrderStatus type with 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled' values, Currency type with 'AUD', 'GBP', 'USD' values, and Order interface containing:

- id: unique string identifier
- region: Region type
- customerId: links to Customer
- product: product name string
- quantity: number
- totalAmount: number
- currency: Currency type
- status: OrderStatus type
- createdAt: Date object

**Requirements**:

- Export all types and interfaces
- Use union types for enums
- Keep interfaces simple and focused
- Import Region type in Order.ts from Customer.ts
- Include proper TypeScript imports. Example: import type

---

## Prompt 2:

File: `src/data/generateMockCustomers.ts`
Create generateMockCustomers function that:

- Takes optional customersPerRegion parameter (default: 30)
- Generates customers for each region (APAC, UK, US)
- Uses @faker-js/faker for realistic data
- Creates 6-character uppercase alphanumeric customerIds
- Generates appropriate names, emails, and phone numbers
- Returns array sorted by region, then by name

File: `src/data/generateMockOrders.ts`
Create generateMockOrders function that:

- Takes customers array and optional ordersPerRegion parameter (default: 50)
- Links each order to a random customer from the same region
- Uses predefined furniture products array (Milano Sofa, Sydney Dining Table, etc.)
- Implements region-to-currency mapping (APAC→AUD, UK→GBP, US→USD)
- Generates realistic quantities (1-5) and base prices (500-5000)
- Calculates proper totalAmount (basePrice × quantity)
- Uses recent dates (last 90 days) for createdAt
- Returns orders sorted by most recent date

**Requirements**:

- Ensure data relationships are logical (customer region matches order region)
- Use faker for realistic but consistent data
- Include proper TypeScript imports. Example: import type
- Handle edge cases gracefully

---

## Prompt 3:

File: `src/hooks/useOrders.ts`
Create useOrders hook that:

- Takes orders array as parameter
- Manages regionFilter and statusFilter state (strings, default 'All')
- Returns filteredOrders using useMemo for performance
- Provides setRegionFilter and setStatusFilter functions
- Filters orders based on region and status criteria

File: `src/hooks/useCustomers.ts`
Create useCustomers hook that:

- Takes customers and orders arrays as parameters
- Creates getCustomerById function using useMemo with Map for O(1) lookup
- Creates getCustomerOrders function using useMemo to group orders by customerId
- Returns both lookup functions for efficient customer data access

File: `src/hooks/useDashboardStats.ts`
Create useDashboardStats hook that:

- Takes orders array as parameter
- Calculates totalOrders, totalRevenue (converted to USD), deliveredCount, processingCount
- Uses USD conversion rates (USD: 1, GBP: 1.27, AUD: 0.67)
- Generates regionStats array with per-region totals in native currency
- Returns all statistics using single useMemo for performance

**Requirements**:

- Use proper dependency arrays in useMemo
- Handle empty arrays gracefully
- Ensure type safety throughout
- Keep hooks focused and single-purpose
- Include proper TypeScript imports. Example: import type

---

## Prompt 4:

File: `src/App.tsx`
Create main App component that:

- Uses useMemo to generate customers and orders on mount
- Integrates all three custom hooks
- Implements layout with sidebar and main content area
- Includes header with title and last updated timestamp
- Passes proper props to child components
- Uses flexbox layout with overflow handling

File: `src/components/Sidebar.tsx`
Create Sidebar component that:

- Displays navigation menu with Dashboard
- Shows Dashboard as active, others as disabled
- Uses Lucide React icons for visual appeal
- Implements hover effects and active state styling
- Uses proper Tailwind classes for dark sidebar theme

File: `src/components/DashboardStats.tsx`
Create DashboardStats component that:

- Takes stats object from useDashboardStats hook
- Displays summary cards in responsive grid layout
- Shows total orders, revenue, delivered count, processing count
- Includes regional breakdown with native currencies
- Uses Intl.NumberFormat for proper currency formatting
- Implements card design with shadows and hover effects

File: `src/components/OrderTable.tsx`
Create OrderTable component that:

- Takes orders, customerHooks, and orderHooks as props
- Implements filter dropdowns for region and status
- Creates sortable table with proper headers
- Shows order ID, region, customer name, product, quantity, total, status, date
- Handles customer name clicks to open modal
- Uses zebra striping and hover effects
- Implements responsive design with horizontal scroll

File: `src/components/CustomerModal.tsx`
Create CustomerModal component that:

- Takes customer data, orders, isOpen, and onClose props
- Displays customer information in modal overlay
- Shows order history table with recent orders
- Calculates total spent in USD
- Implements backdrop click to close
- Uses smooth animations for open/close
- Includes proper modal accessibility

**Requirements**:

- Use consistent Tailwind spacing and colors
- Implement smooth transitions (duration-200)
- Add proper hover and focus states
- Ensure mobile responsiveness
- Include proper TypeScript imports. Example: import type
- Include loading states where appropriate

---

## Prompt 5:

Design Polish

- Apply border radius to corners to make it looks and feels like Shopify Admin Dashboard: Sidebar & Main Dashboard
- Add loading skeleton states for initial data load
- Implement empty states with friendly messages
- Include micro-animations for status changes
- Use consistent color coding for order statuses
- Add subtle shadows and borders for depth

Desktop & Tablet Devices

- Using inline CSS to set the CustomerModal backdrop to have a white overlay with 55% opacity so the dashboard background is still visible but with a light overlay effect

Mobile Responsiveness

- Implement collapsible sidebar for mobile screens.
- Add horizontal scroll for table on small screens
- Ensure touch targets are minimum 44px
- Use responsive typography and spacing
- Using inline CSS to apply a light white overlay with 55% opacity that allows dashboard background visibility when sidebar is shown on mobile

---

# Your technical design decisions and reasoning

1. Planned out what tech to use in the project:

- I chose React because it's well-suited for building interactive UIs and dashboards. Easy to setup.
- I used TypeScript to ensure strong type safety, reduce runtime errors.
- Use ViteJS to create React for faster development and build times instead of using CRA
- Use FakerJS to generate dummy data
- Use Claude CLI for faster development

2.  I created a clean project structure with separation of layers:

    ```
    src/
      ├── types/ # Domain models (Customer, Order)
      ├── data/ # Mock data generators using faker-js
      ├── components/ # UI components (Sidebar, Table, Stats, Modal)
      ├── hooks/ # Custom logic for filtering, lookups, stats
      ├── App.tsx # Main entry point and layout
    ```

3.  I defined the data structures and how the mock data would simulate real commerce instances:
    Example:

    - Used @faker-js/faker to generate 30 customers per region (APAC, UK, US)
    - 50 orders per region, each linked to a customer from that region
    - Orders include quantity, base price, currency by region, status, and recent date
    - Sorted and structured the data to reflect production-like environment

    Name the files correctly so Claude CLI can easily understand: Example:

    - generateMockCustomers.ts
    - generateMockOrders.ts

4.  I planned out what elements should have on the dashboard, sketch it on the paper to illustrate the basic ideas:
    Example:

    - Sidebar on the left
    - Main dashboard on the right
    - Inside dashboard, it contains multiple sections: Table, Stats, Modal, ...

    Name the files correctly so Claude CLI can easily understand: Example:

    - Sidebar.tsx
    - OrderTable.tsx
    - DashboardStats.tsx
    - CustomerModal.tsx

5.  I have to understand what I want before giving the prompt to Claude CLI. When everything is setup and planned out properly:

- Structure of the project
- Data structure inside the project
- Dashboard Ui

  Failing to have a proper setup and unsure what inside the project, Claude Ai or
  any Ai will not give me exactly the output that I want. Also, I will end up having a messy code and will waste more time to
  fix it, clean it up. It is like building a house, I need to have a proper scaffold, then start using labors to build on top of it. Having a bad scaffold will result in having a failure architecture. Now, time to think about writing the prompt. I always write some basic functions inside the file first to give Ai the insights. This will improve the output code that I get from the Ai.

  Example:
  Function: generateCustomerId will return a random customerId result. Inside the file, I can write something like this.

  ```
    function generateCustomerId(): string {
      // TODO: generate random customerId and return customerId
      return customerId
    }
  ```

  Once I am very clear about the expected outcome for each file. I can write down a draft prompt. Then ask ChatGPT to re-write the prompt in a very clear way. Next, come back to Claude Ai, paste it in, and very high chance, the code should work on the spot.

---

# Setup and run instructions

## Setup from scatch

npm create vite@latest kingliving

- Select React
- Select Typescript

```
  cd kingliving
  npm install
  npm install @faker-js/faker lucide-react
  npm install tailwindcss @tailwindcss/vite
```

Add:

```
  `import tailwindcss from '@tailwindcss/vite'` in vite.config.ts
  `tailwindcss(),` in vite.config.ts
  `@import "tailwindcss";` in index.css file.
```

```
  npm run dev
```

Create project structure - folders & files:

```

src/
├── App.tsx
├── components/
│ ├── Sidebar.tsx
│ ├── OrderTable.tsx
│ ├── CustomerModal.tsx
│ └── DashboardStats.tsx
├── hooks/
│ ├── useOrders.ts
│ ├── useCustomers.ts
│ └── useDashboardStats.ts
├── data/
│ ├── generateMockCustomers.ts
│ └── generateMockOrders.ts
└── types/
├── Customer.ts
└── Order.ts

```

In a new terminal inside same directory: `claude kingliving index` - this is to ensure Claude CLI understand the context of the project.

Now, use 5 prompts as shared above

## Run Instructions

```
  git clone https://github.com/henrydcao/kingliving
  cd kingliving
  npm install
  npm run dev
```

# Any assumptions you made
