# API Documentation
## Burmese Tea Shop POS System

Base URL: `http://localhost:5000/api`

## Authentication
No authentication required for this version.

---

## Tables Endpoints

### Get All Tables
**GET** `/tables`

Returns all tables with current order information.

**Response:**
```json
[
  {
    "id": 1,
    "table_number": 1,
    "status": "FREE",
    "current_bill": 0,
    "order_id": null
  },
  {
    "id": 2,
    "table_number": 2,
    "status": "OCCUPIED",
    "current_bill": 5000,
    "order_id": 15
  }
]
```

### Get Single Table
**GET** `/tables/:id`

**Response:**
```json
{
  "id": 1,
  "table_number": 1,
  "status": "FREE",
  "current_bill": 0,
  "order_id": null
}
```

### Update Table Status
**PATCH** `/tables/:id/status`

**Request Body:**
```json
{
  "status": "FREE"
}
```

**Response:**
```json
{
  "id": 1,
  "table_number": 1,
  "status": "FREE",
  "created_at": "2025-12-10T10:00:00.000Z"
}
```

---

## Categories Endpoints

### Get All Categories
**GET** `/categories`

**Response:**
```json
[
  {
    "id": 1,
    "name_mm": "လက်ဖက်ရည်",
    "name_en": "Tea",
    "created_at": "2025-12-10T10:00:00.000Z"
  }
]
```

### Get Categories with Products
**GET** `/categories/with-products`

**Response:**
```json
[
  {
    "category_id": 1,
    "category_name_mm": "လက်ဖက်ရည်",
    "category_name_en": "Tea",
    "products": [
      {
        "id": 1,
        "name_mm": "လက်ဖက်ရည်ပုံမှန်",
        "name_en": "Regular Tea",
        "price": 500,
        "available": true
      }
    ]
  }
]
```

---

## Products Endpoints

### Get All Products
**GET** `/products`

**Response:**
```json
[
  {
    "id": 1,
    "name_mm": "လက်ဖက်ရည်ပုံမှန်",
    "name_en": "Regular Tea",
    "category_id": 1,
    "price": 500,
    "available": true,
    "category_name_mm": "လက်ဖက်ရည်",
    "category_name_en": "Tea",
    "created_at": "2025-12-10T10:00:00.000Z"
  }
]
```

### Search Products
**GET** `/products/search?q={query}`

Supports Burmese Unicode and English search.

**Example:** `/products/search?q=လက်ဖက်`

**Response:**
```json
[
  {
    "id": 1,
    "name_mm": "လက်ဖက်ရည်ပုံမှန်",
    "name_en": "Regular Tea",
    "price": 500,
    "available": true
  }
]
```

### Get Single Product
**GET** `/products/:id`

---

## Orders Endpoints

### Start New Order
**POST** `/orders/start`

Creates a new order or returns existing open order for a table.

**Request Body:**
```json
{
  "table_id": 1
}
```

**Response:**
```json
{
  "id": 1,
  "table_id": 1,
  "status": "OPEN",
  "total_amount": 0,
  "created_at": "2025-12-10T10:00:00.000Z",
  "completed_at": null
}
```

### Get Order Details
**GET** `/orders/:id`

**Response:**
```json
{
  "id": 1,
  "table_id": 1,
  "status": "OPEN",
  "total_amount": 2000,
  "created_at": "2025-12-10T10:00:00.000Z",
  "completed_at": null,
  "items": [
    {
      "id": 1,
      "order_id": 1,
      "product_id": 1,
      "quantity": 2,
      "price": 500,
      "status": "PENDING",
      "name_mm": "လက်ဖက်ရည်ပုံမှန်",
      "name_en": "Regular Tea",
      "created_at": "2025-12-10T10:05:00.000Z",
      "served_at": null
    }
  ]
}
```

### Add Items to Order
**POST** `/orders/:id/items`

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 5,
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "message": "Items added successfully",
  "items": [
    {
      "id": 1,
      "order_id": 1,
      "product_id": 1,
      "quantity": 2,
      "price": 500,
      "status": "PENDING"
    }
  ]
}
```

### Get Checkout Info
**GET** `/orders/:id/checkout`

**Response:**
```json
{
  "id": 1,
  "table_id": 1,
  "table_number": 1,
  "status": "OPEN",
  "total_amount": 3500,
  "created_at": "2025-12-10T10:00:00.000Z",
  "items": [
    {
      "quantity": 2,
      "price": 500,
      "name_mm": "လက်ဖက်ရည်ပုံမှန်",
      "name_en": "Regular Tea"
    }
  ]
}
```

### Complete Order
**POST** `/orders/:id/complete`

Completes the order and frees the table.

**Response:**
```json
{
  "message": "Order completed and table closed successfully"
}
```

### Get Kitchen Pending Items
**GET** `/orders/kitchen/pending`

Returns all pending items across all open orders.

**Response:**
```json
[
  {
    "id": 1,
    "quantity": 2,
    "status": "PENDING",
    "created_at": "2025-12-10T10:05:00.000Z",
    "name_mm": "လက်ဖက်ရည်ပုံမှန်",
    "name_en": "Regular Tea",
    "table_number": 1,
    "order_id": 1
  }
]
```

### Mark Item as Served
**PATCH** `/orders/items/:itemId/serve`

**Response:**
```json
{
  "id": 1,
  "order_id": 1,
  "product_id": 1,
  "quantity": 2,
  "price": 500,
  "status": "SERVED",
  "created_at": "2025-12-10T10:05:00.000Z",
  "served_at": "2025-12-10T10:15:00.000Z"
}
```

---

## Error Responses

All endpoints may return these error responses:

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Status Values

### Table Status
- `FREE` - Table is available
- `OCCUPIED` - Table has an active order

### Order Status
- `OPEN` - Order is in progress
- `COMPLETED` - Order has been paid and closed

### Order Item Status
- `PENDING` - Item ordered but not yet prepared
- `SERVED` - Item has been prepared and served

---

## Data Types

- **Decimal values** (prices): Always use 2 decimal places
- **Timestamps**: ISO 8601 format
- **Burmese text**: UTF-8 encoded Unicode

---

## Rate Limiting
No rate limiting implemented in this version.

## CORS
CORS is enabled for all origins in development mode.
