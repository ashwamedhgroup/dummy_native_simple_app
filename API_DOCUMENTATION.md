# Aubizo API Documentation

## Overview

This document provides comprehensive API documentation for the Aubizo application, including all endpoints, request/response formats, authentication requirements, and error handling.

## Base URL

```
http://your-domain.com/
```

## Authentication

Most endpoints require authentication using Token-based authentication. Include the token in the Authorization header:

```
Authorization: Token your_auth_token_here
```

## Response Format

All API responses follow a consistent format:

```json
{
  "status": true/false,
  "message": "Success/Error message",
  "data": {} // Response data (when applicable)
}
```

---

## Authentication APIs (`/auth/`)

### 1. User Registration

**Endpoint:** `POST /auth/register/`
**Authentication:** Not required

**Request Body:**

```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

**Success Response (201):**

```json
{
  "status": true,
  "Message": "User Created Successfully."
}
```

**Error Responses:**

- **400 Bad Request:**

```json
{
  "status": false,
  "message": "username already exists"
}
```

```json
{
  "status": false,
  "message": "email already registered"
}
```

```json
{
  "status": false,
  "data": {
    "username": ["This field is required."],
    "password": ["This field is required."],
    "email": ["Enter a valid email address."]
  }
}
```

### 2. User Login

**Endpoint:** `POST /auth/login/`
**Authentication:** Not required

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response (200):**

```json
{
  "status": true,
  "data": {
    "token": "auth_token_string"
  },
  "message": "login successful"
}
```

**Headers:**

```
login_user_name: username
```

**Error Responses:**

- **400 Bad Request:**

```json
{
  "status": false,
  "data": {},
  "message": "invalid credentials"
}
```

```json
{
  "status": false,
  "data": {
    "username": ["This field is required."],
    "password": ["This field is required."]
  }
}
```

### 3. User Logout

**Endpoint:** `POST /auth/logout/`
**Authentication:** Required

**Request Body:** Empty

**Success Response (200):**

```json
{
  "status": true,
  "Message": "Logged out Successfully.."
}
```

**Error Responses:**

- **401 Unauthorized:** Invalid or missing token

---

## Core APIs (`/core/`)

### 1. Get States

**Endpoint:** `GET /core/api/states/`
**Authentication:** Not specified

**Request Parameters:** None

**Success Response (200):**

```json
[
  {
    "id": 1,
    "name": "State Name",
    "code": "STATE_CODE"
  }
]
```

### 2. Get Districts

**Endpoint:** `GET /core/api/districts/`
**Authentication:** Not specified

**Query Parameters:**

- `state_id` (required): ID of the state

**Success Response (200):**

```json
[
  {
    "id": 1,
    "name": "District Name",
    "state": 1
  }
]
```

### 3. Get Talukas

**Endpoint:** `GET /core/api/talukas/`
**Authentication:** Not specified

**Query Parameters:**

- `district_id` (required): ID of the district

**Success Response (200):**

```json
[
  {
    "id": 1,
    "name": "Taluka Name",
    "district": 1
  }
]
```

### 4. Daily Attendance Report

**Endpoint:** `GET /core/api/attendance/daily/`
**Authentication:** Required (CompanyUserPermission)

**Query Parameters:**

- `date` (required): Date in YYYY-MM-DD format
- `download` (optional): "csv", "excel", or "json" (default)

**Success Response (200):**

```json
{
  "summary": {
    "date": "2024-01-15",
    "total_employees": 50,
    "total_present": 45,
    "total_absent": 5,
    "total_full_day": 40,
    "total_half_day": 5,
    "attendance_percentage": 90.0
  },
  "attendance_data": [
    {
      "employee_id": 1,
      "employee_name": "John Doe",
      "punch_in_time": "09:00",
      "punch_out_time": "18:00",
      "working_hours": 8.5,
      "attendance_status": "Full Day",
      "date": "2024-01-15"
    }
  ]
}
```

**Error Responses:**

- **400 Bad Request:**

```json
{
  "error": "Date parameter is required"
}
```

```json
{
  "error": "Invalid date format. Use YYYY-MM-DD"
}
```

- **500 Internal Server Error:**

```json
{
  "error": "Error message"
}
```

### 5. Monthly Attendance Report

**Endpoint:** `GET /core/api/attendance/monthly/`
**Authentication:** Required (CompanyUserPermission)

**Query Parameters:**

- `month` (required): Month number (1-12)
- `year` (required): Year (e.g., 2024)
- `download` (optional): "csv", "excel", or "json" (default)

**Success Response (200):**

```json
{
  "summary": {
    "month": "January 2024",
    "working_days": 22,
    "total_employees": 50,
    "overall_attendance_percentage": 85.5,
    "total_present_days": 940,
    "total_possible_days": 1100
  },
  "attendance_data": [
    {
      "employee_id": 1,
      "employee_name": "John Doe",
      "total_working_days": 22,
      "present_days": 20,
      "absent_days": 2,
      "full_days": 18,
      "half_days": 2,
      "total_working_hours": 160.5,
      "average_daily_hours": 8.03,
      "attendance_percentage": 90.91
    }
  ]
}
```

**Error Responses:**

- **400 Bad Request:**

```json
{
  "error": "Month and year parameters are required"
}
```

```json
{
  "error": "Invalid month or year"
}
```

### 6. Custom Date Attendance Report

**Endpoint:** `GET /core/api/attendance/custom/`
**Authentication:** Required (CompanyUserPermission)

**Query Parameters:**

- `start_date` (required): Start date in YYYY-MM-DD format
- `end_date` (required): End date in YYYY-MM-DD format
- `download` (optional): "csv", "excel", or "json" (default)

---

## Dealer APIs (`/dealer/`)

### 1. Create Dealer

**Endpoint:** `POST /dealer/create/`
**Authentication:** Required

**Request Body:**

```json
{
  "shop_name": "string",
  "owner_name": "string",
  "phone": "string",
  "gst_number": "string",
  "billing_address": "string",
  "shipping_address": "string",
  "state": 1,
  "district": 1,
  "taluka": 1,
  "agreement_status": "active",
  "remark": "string"
}
```

**Success Response (201):**

```json
{
  "status": true,
  "message": "Dealer created successfully",
  "data": {
    "id": 1,
    "shop_name": "ABC Store",
    "owner_name": "John Doe",
    "phone": "1234567890",
    "gst_number": "GST123456789",
    "billing_address": "Address",
    "shipping_address": "Address",
    "state": 1,
    "district": 1,
    "taluka": 1,
    "agreement_status": "active",
    "remark": "Good dealer",
    "is_phone_verified": false,
    "phone_verified_at": null
  }
}
```

### 2. Get Dealers List

**Endpoint:** `GET /dealer/`
**Authentication:** Required

**Query Parameters:**

- `page` (optional): Page number for pagination
- `page_size` (optional): Number of items per page

**Success Response (200):**

```json
{
  "count": 100,
  "next": "http://example.com/dealer/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "shop_name": "ABC Store",
      "owner_name": "John Doe",
      "phone": "1234567890",
      "gst_number": "GST123456789",
      "billing_address": "Address",
      "shipping_address": "Address",
      "state": {
        "id": 1,
        "name": "State Name"
      },
      "district": {
        "id": 1,
        "name": "District Name"
      },
      "taluka": {
        "id": 1,
        "name": "Taluka Name"
      },
      "agreement_status": "active",
      "remark": "Good dealer",
      "is_phone_verified": true,
      "phone_verified_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 3. Get Dealer Detail

**Endpoint:** `GET /dealer/{id}/`
**Authentication:** Required

**Path Parameters:**

- `id` (required): Dealer ID

**Success Response (200):**

```json
{
  "id": 1,
  "shop_name": "ABC Store",
  "owner_name": "John Doe",
  "phone": "1234567890",
  "gst_number": "GST123456789",
  "billing_address": "Address",
  "shipping_address": "Address",
  "state": {
    "id": 1,
    "name": "State Name"
  },
  "district": {
    "id": 1,
    "name": "District Name"
  },
  "taluka": {
    "id": 1,
    "name": "Taluka Name"
  },
  "agreement_status": "active",
  "remark": "Good dealer",
  "is_phone_verified": true,
  "phone_verified_at": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**

- **404 Not Found:**

```json
{
  "detail": "Not found."
}
```

### 4. Send Dealer OTP

**Endpoint:** `POST /dealer/{dealer_id}/send-otp/`
**Authentication:** Required

**Path Parameters:**

- `dealer_id` (required): Dealer ID

**Request Body:** Empty

**Success Response (200):**

```json
{
  "status": true,
  "message": "OTP sent successfully",
  "data": {
    "otp": "123456"
  }
}
```

### 5. Verify Dealer OTP

**Endpoint:** `POST /dealer/{dealer_id}/verify-otp/`
**Authentication:** Required

**Path Parameters:**

- `dealer_id` (required): Dealer ID

**Request Body:**

```json
{
  "otp": "123456"
}
```

**Success Response (200):**

```json
{
  "status": true,
  "message": "OTP verified successfully"
}
```

**Error Responses:**

- **400 Bad Request:**

```json
{
  "status": false,
  "message": "Invalid or expired OTP"
}
```

### 6. Dealer OTP Status

**Endpoint:** `GET /dealer/{dealer_id}/otp-status/`
**Authentication:** Required

**Path Parameters:**

- `dealer_id` (required): Dealer ID

**Success Response (200):**

```json
{
  "is_phone_verified": true,
  "phone_verified_at": "2024-01-15T10:30:00Z",
  "last_otp_sent": "2024-01-15T10:25:00Z"
}
```

### 7. Update Dealer

**Endpoint:** `PUT /dealer/{id}/`
**Authentication:** Required

**Path Parameters:**

- `id` (required): Dealer ID

**Request Body:**

```json
{
  "shop_name": "string",
  "owner_name": "string",
  "phone": "string",
  "gst_number": "string",
  "billing_address": "string",
  "shipping_address": "string",
  "state": 1,
  "district": 1,
  "taluka": 1,
  "agreement_status": "active",
  "remark": "string"
}
```

### 8. Partial Update Dealer

**Endpoint:** `PATCH /dealer/{id}/`
**Authentication:** Required

**Path Parameters:**

- `id` (required): Dealer ID

**Request Body:** (Any of the dealer fields to update)

### 9. Delete Dealer

**Endpoint:** `DELETE /dealer/{id}/`
**Authentication:** Required

**Path Parameters:**

- `id` (required): Dealer ID

**Success Response (200):**

```json
{
  "message": "Dealer deleted successfully."
}
```

### 10. Daily Dealer Visit Report

**Endpoint:** `GET /dealer/api/visits/daily/`
**Authentication:** Required (CompanyUserPermission)

**Query Parameters:**

- `date` (required): Date in YYYY-MM-DD format
- `download` (optional): "csv", "excel", or "json" (default)

**Success Response (200):**

```json
{
  "summary": {
    "date": "2024-01-15",
    "total_employees": 10,
    "employees_with_visits": 8,
    "employees_without_visits": 2,
    "total_visits": 25,
    "total_unique_dealers_visited": 20,
    "average_visits_per_employee": 2.5,
    "activity_rate": 80.0
  },
  "visit_data": [
    {
      "employee_id": 1,
      "employee_name": "John Doe",
      "total_visits": 3,
      "unique_dealers_visited": 3,
      "assigned_dealers": 10,
      "visit_percentage": 30.0,
      "visit_status": "Moderate",
      "priority": "Medium Priority",
      "dealer_visits": [
        {
          "dealer_id": 1,
          "dealer_name": "ABC Store",
          "owner_name": "Owner Name",
          "visit_time": "10:30",
          "visit_duration": "45 minutes",
          "remark": "Successful visit"
        }
      ],
      "date": "2024-01-15"
    }
  ]
}
```

### 11. Monthly Dealer Visit Report

**Endpoint:** `GET /dealer/api/visits/monthly/`
**Authentication:** Required (CompanyUserPermission)

**Query Parameters:**

- `month` (required): Month number (1-12)
- `year` (required): Year (e.g., 2024)
- `download` (optional): "csv", "excel", or "json" (default)

### 12. Custom Date Dealer Visit Report

**Endpoint:** `GET /dealer/api/visits/custom/`
**Authentication:** Required (CompanyUserPermission)

**Query Parameters:**

- `start_date` (required): Start date in YYYY-MM-DD format
- `end_date` (required): End date in YYYY-MM-DD format
- `download` (optional): "csv", "excel", or "json" (default)

---

## Farmer APIs (`/farmer/`)

### 1. Create Farmer

**Endpoint:** `POST /farmer/create/`
**Authentication:** Required

**Request Body:**

```json
{
  "farmer_name": "string",
  "phone": "string",
  "address": "string",
  "state": 1,
  "district": 1,
  "taluka": 1,
  "aadhaar_number": "string",
  "account_number": "string",
  "ifsc_code": "string",
  "land_area": "string",
  "crop_details": [
    {
      "crop_id": 1,
      "area": "5 acres",
      "irrigation_type": "drip"
    }
  ]
}
```

### 2. Get Farmers List

**Endpoint:** `GET /farmer/`
**Authentication:** Required

**Success Response (200):**

```json
{
  "count": 50,
  "next": "http://example.com/farmer/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "farmer_name": "Farmer Name",
      "phone": "1234567890",
      "address": "Farm Address",
      "state": {
        "id": 1,
        "name": "State Name"
      },
      "district": {
        "id": 1,
        "name": "District Name"
      },
      "taluka": {
        "id": 1,
        "name": "Taluka Name"
      },
      "aadhaar_number": "1234-5678-9012",
      "account_number": "123456789",
      "ifsc_code": "BANK0001234",
      "land_area": "10 acres"
    }
  ]
}
```

### 3. Get Farmer Detail

**Endpoint:** `GET /farmer/{id}/`
**Authentication:** Required

### 4. Get Crop Details

**Endpoint:** `GET /farmer/crop-details/`
**Authentication:** Required

### 5. Get Crops List

**Endpoint:** `GET /farmer/crops/`
**Authentication:** Required

### 6. Get Irrigation Types

**Endpoint:** `GET /farmer/irrigation-types/`
**Authentication:** Required

### 7. Update Farmer

**Endpoint:** `PUT /farmer/{id}/`
**Authentication:** Required

**Path Parameters:**

- `id` (required): Farmer ID

**Request Body:**

```json
{
  "farmer_name": "string",
  "phone": "string",
  "address": "string",
  "state": 1,
  "district": 1,
  "taluka": 1,
  "aadhaar_number": "string",
  "account_number": "string",
  "ifsc_code": "string",
  "land_area": "string",
  "crop_details": [
    {
      "crop_id": 1,
      "area": "5 acres",
      "irrigation_type": "drip"
    }
  ]
}
```

### 8. Partial Update Farmer

**Endpoint:** `PATCH /farmer/{id}/`
**Authentication:** Required

**Path Parameters:**

- `id` (required): Farmer ID

**Request Body:** (Any of the farmer fields to update)

### 9. Delete Farmer

**Endpoint:** `DELETE /farmer/{id}/`
**Authentication:** Required

**Path Parameters:**

- `id` (required): Farmer ID

**Success Response (204):**

```json
{
  "message": "Farmer deleted successfully."
}
```

### 10. Daily Farmer Visit Report

**Endpoint:** `GET /farmer/api/visits/daily/`
**Authentication:** Required (CompanyUserPermission)

**Query Parameters:**

- `date` (required): Date in YYYY-MM-DD format
- `download` (optional): "csv", "excel", or "json" (default)

**Success Response (200):**

```json
{
  "summary": {
    "date": "2024-01-15",
    "total_employees": 10,
    "employees_with_visits": 8,
    "employees_without_visits": 2,
    "active_employees": 8,
    "total_visits": 15,
    "total_unique_farmers_visited": 12,
    "average_visits_per_employee": 1.5,
    "activity_rate": 80.0
  },
  "visit_data": [
    {
      "employee_id": 1,
      "employee_name": "John Doe",
      "total_visits": 2,
      "unique_farmers_visited": 2,
      "assigned_farmers": 8,
      "visit_percentage": 25.0,
      "frequency_status": "Moderate",
      "engagement_level": "Low Engagement",
      "farmer_visits": [
        {
          "farmer_id": 1,
          "farmer_name": "Farmer Name",
          "mobile_no": "1234567890",
          "city": "City Name",
          "total_acre": 5.0,
          "visit_time": "10:30",
          "visit_duration": "30 minutes",
          "remark": "Good meeting"
        }
      ],
      "date": "2024-01-15"
    }
  ]
}
```

### 11. Monthly Farmer Visit Report

**Endpoint:** `GET /farmer/api/visits/monthly/`
**Authentication:** Required (CompanyUserPermission)

**Query Parameters:**

- `month` (required): Month number (1-12)
- `year` (required): Year (e.g., 2024)
- `download` (optional): "csv", "excel", or "json" (default)

### 12. Custom Date Farmer Visit Report

**Endpoint:** `GET /farmer/api/visits/custom/`
**Authentication:** Required (CompanyUserPermission)

**Query Parameters:**

- `start_date` (required): Start date in YYYY-MM-DD format
- `end_date` (required): End date in YYYY-MM-DD format
- `download` (optional): "csv", "excel", or "json" (default)

---

## Field Tracking APIs (`/track/`)

### 1. Punch In

**Endpoint:** `POST /track/punch-in/`
**Authentication:** Required

**Request Body:**

```json
{
  "latitude": 12.345678,
  "longitude": 78.901234,
  "location_address": "Current location address"
}
```

**Success Response (201):**

```json
{
  "status": true,
  "message": "Punched in successfully",
  "data": {
    "id": 1,
    "inpunch_date": "2024-01-15",
    "inpunch_time": "09:00:00",
    "latitude": 12.345678,
    "longitude": 78.901234,
    "location_address": "Current location address"
  }
}
```

### 2. Punch Out

**Endpoint:** `POST /track/punch-out/{id}/`
**Authentication:** Required

**Path Parameters:**

- `id` (required): Punch record ID

**Request Body:**

```json
{
  "latitude": 12.345678,
  "longitude": 78.901234,
  "location_address": "Current location address"
}
```

**Success Response (200):**

```json
{
  "status": true,
  "message": "Punched out successfully",
  "data": {
    "id": 1,
    "inpunch_date": "2024-01-15",
    "inpunch_time": "09:00:00",
    "out_punch_date": "2024-01-15",
    "out_punch_time": "18:00:00",
    "total_working_hours": 9.0
  }
}
```

### 3. Get User Location

**Endpoint:** `POST /track/get_user_lat_lon/`
**Authentication:** Required

**Request Body:**

```json
{
  "lat": 12.345678,
  "lon": 78.901234,
  "distance_m": 10
}
```

**Success Response (200):**

```json
{
  "nearby_farmers": [
    {
      "id": 1,
      "farmer_name": "Farmer Name",
      "mobile_no": "1234567890",
      "distance": 1.8
    }
  ],
  "nearby_dealers": [
    {
      "id": 1,
      "shop_name": "ABC Store",
      "owner_name": "John Doe",
      "phone": "1234567890",
      "distance": 2.5
    }
  ],
  "search_radius_meters": 10,
  "user_location": {
    "latitude": 12.345678,
    "longitude": 78.901234
  }
}
```

### 4. Nearby Dealers

**Endpoint:** `POST /track/nearby-dealers/`
**Authentication:** Required

**Request Body:**

```json
{
  "lat": 12.345678,
  "lon": 78.901234,
  "distance_m": 3
}
```

**Success Response (200):**

```json
{
  "dealers": [
    {
      "id": 1,
      "shop_name": "ABC Store",
      "owner_name": "John Doe",
      "phone": "1234567890",
      "distance": 2.5,
      "location_id": 123
    }
  ],
  "count": 1,
  "user_location": {
    "lat": 12.345678,
    "lon": 78.901234
  },
  "radius_meters": 3
}
```

### 5. Nearby Farmers

**Endpoint:** `POST /track/nearby-farmers/`
**Authentication:** Required

**Request Body:**

```json
{
  "lat": 12.345678,
  "lon": 78.901234,
  "distance_m": 10
}
```

**Success Response (200):**

```json
{
  "farmers": [
    {
      "id": 1,
      "farmer_name": "Farmer Name",
      "mobile_no": "1234567890",
      "distance": 1.8,
      "location_id": 456
    }
  ],
  "count": 1,
  "user_location": {
    "lat": 12.345678,
    "lon": 78.901234
  },
  "radius_meters": 10
}
```

### 6. Start Visit

**Endpoint:** `POST /track/start-visit/`
**Authentication:** Required

**Request Body:**

```json
{
  "punch_id": 123,
  "location_id": 456
}
```

**Success Response (201):**

```json
{
  "visit_id": 789,
  "message": "Visit started successfully"
}
```

### 7. End Visit

**Endpoint:** `PATCH /track/end-visit/{id}/`
**Authentication:** Required

**Path Parameters:**

- `id` (required): Visit ID

**Request Body:**

```json
{
  "remark": "Visit completed successfully"
}
```

**Success Response (200):**

```json
{
  "id": 789,
  "visit_start_time": "2024-01-15T10:30:00Z",
  "visit_end_time": "2024-01-15T11:15:00Z",
  "remark": "Visit completed successfully",
  "location": {
    "id": 456,
    "entity_name": "ABC Store"
  }
}
```

### 8. Visit History

**Endpoint:** `GET /track/visit-history/{location_id}/`
**Authentication:** Required

**Path Parameters:**

- `location_id` (required): Location ID

**Success Response (200):**

```json
{
  "entity": "ABC Store",
  "location_id": 456,
  "visit_history": [
    {
      "visit_start_time": "2024-01-15T10:30:00Z",
      "remark": "Successful visit",
      "employee": "john_doe"
    }
  ]
}
```

### 9. Routes

**Endpoint:** `GET /track/routes/`
**Authentication:** Required

**Query Parameters:**

- `from_date` (optional): Start date filter (YYYY-MM-DD, defaults to today)
- `to_date` (optional): End date filter (YYYY-MM-DD, defaults to today)
- `employee_id` (optional): Filter by specific employee ID

**Success Response (200):**

```json
{
  "routes": [
    {
      "employee_id": 1,
      "employee_name": "John Doe",
      "date": "2024-01-15",
      "punch_in_time": "09:00:00",
      "punch_out_time": "18:00:00",
      "total_working_hours": 9.0,
      "total_distance": 25.5,
      "visits": [
        {
          "location_type": "dealer",
          "location_name": "ABC Store",
          "visit_start_time": "10:30:00",
          "visit_end_time": "11:15:00",
          "distance_from_previous": 5.2,
          "remark": "Successful visit"
        }
      ]
    }
  ]
}
```

### 10. Check Punch Status

**Endpoint:** `GET /track/punch-in/`
**Authentication:** Required

**Success Response (200):**

```json
{
  "punched_in": true,
  "punched_out": false,
  "punch_id": 123
}
```

---

## Product APIs (`/product/`)

### 1. Get Products

**Endpoint:** `GET /product/products/`
**Authentication:** Required

**Query Parameters:**

- `category` (optional): Filter by category ID
- `search` (optional): Search in product name/description

**Success Response (200):**

```json
{
  "count": 25,
  "next": "http://example.com/product/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product description",
      "category": {
        "id": 1,
        "name": "Category Name"
      },
      "price": "100.00",
      "image": "http://example.com/media/product_images/product1.jpg",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 2. Create Product

**Endpoint:** `POST /product/products/create/`
**Authentication:** Required

**Request Body:**

```json
{
  "name": "string",
  "description": "string",
  "category": 1,
  "price": "100.00",
  "image": "file_upload",
  "is_active": true
}
```

### 3. Get Product Detail

**Endpoint:** `GET /product/products/{id}/`
**Authentication:** Required

**Path Parameters:**

- `id` (required): Product ID

**Success Response (200):**

```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Product description",
  "category": {
    "id": 1,
    "name": "Category Name"
  },
  "price": "100.00",
  "image": "http://example.com/media/product_images/product1.jpg",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### 4. Update Product

**Endpoint:** `PUT /product/products/{id}/`
**Authentication:** Required

**Path Parameters:**

- `id` (required): Product ID

**Request Body:**

```json
{
  "name": "string",
  "description": "string",
  "category": 1,
  "price": "100.00",
  "image": "file_upload",
  "is_active": true
}
```

### 5. Delete Product

**Endpoint:** `DELETE /product/products/{id}/`
**Authentication:** Required

**Path Parameters:**

- `id` (required): Product ID

**Success Response (204):**

```json
{
  "message": "Product deleted successfully."
}
```

### 6. Product Categories

**Endpoint:** `GET /product/categories/`
**Authentication:** Required

**Success Response (200):**

```json
[
  {
    "id": 1,
    "name": "Category Name",
    "description": "Category description",
    "is_active": true
  }
]
```

### 7. Create Product Category

**Endpoint:** `POST /product/categories/`
**Authentication:** Required

**Request Body:**

```json
{
  "name": "string",
  "description": "string",
  "is_active": true
}
```

### 8. Get Product Category Detail

**Endpoint:** `GET /product/categories/{id}/`
**Authentication:** Required

**Path Parameters:**

- `id` (required): Category ID

### 9. Update Product Category

**Endpoint:** `PUT /product/categories/{id}/`
**Authentication:** Required

**Path Parameters:**

- `id` (required): Category ID

**Request Body:**

```json
{
  "name": "string",
  "description": "string",
  "is_active": true
}
```

### 10. Delete Product Category

**Endpoint:** `DELETE /product/categories/{id}/`
**Authentication:** Required

**Path Parameters:**

- `id` (required): Category ID

**Success Response (204):**

```json
{
  "message": "Category deleted successfully."
}
```

### 11. Product Packings

**Endpoint:** `GET /product/packing/`
**Authentication:** Required

**Success Response (200):**

```json
[
  {
    "id": 1,
    "product": {
      "id": 1,
      "name": "Product Name"
    },
    "packing_size": "1kg",
    "price": "50.00",
    "is_active": true
  }
]
```

### 12. Create Product Packing

**Endpoint:** `POST /product/packing/`
**Authentication:** Required

**Request Body:**

```json
{
  "product": 1,
  "packing_size": "string",
  "price": "50.00",
  "is_active": true
}
```

### 13. Get Product Packing Detail

**Endpoint:** `GET /product/packing/{id}/`
**Authentication:** Required

**Path Parameters:**

- `id` (required): Packing ID

### 14. Update Product Packing

**Endpoint:** `PUT /product/packing/{id}/`
**Authentication:** Required

**Path Parameters:**

- `id` (required): Packing ID

### 15. Delete Product Packing

**Endpoint:** `DELETE /product/packing/{id}/`
**Authentication:** Required

**Path Parameters:**

- `id` (required): Packing ID

---

## Tenant/Company Management APIs (`/api/`)

### 1. Register Company

**Endpoint:** `POST /api/register-company/`
**Authentication:** Not required

**Request Body:**

```json
{
  "company_name": "string",
  "contact_person": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "subscription_plan": 1,
  "admin_user": {
    "username": "string",
    "password": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string"
  }
}
```

### 2. Company Users Management

**Endpoint:** `GET /api/company-users-crud/`
**Authentication:** Required

**Success Response (200):**

```json
{
  "count": 10,
  "results": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "username": "user1",
        "email": "user1@example.com",
        "first_name": "John",
        "last_name": "Doe"
      },
      "company": {
        "id": 1,
        "name": "Company Name"
      },
      "role": {
        "id": 1,
        "name": "Manager"
      },
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 3. Create Company User

**Endpoint:** `POST /api/company-users-crud/`
**Authentication:** Required

**Request Body:**

```json
{
  "user": {
    "username": "string",
    "password": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string"
  },
  "role": 1,
  "is_active": true
}
```

### 4. Send Company OTP

**Endpoint:** `POST /api/companies/{id}/send-otp/`
**Authentication:** Required

### 5. Verify Company OTP

**Endpoint:** `POST /api/companies/{id}/verify-otp/`
**Authentication:** Required

**Request Body:**

```json
{
  "otp": "123456"
}
```

### 6. Send Company Email OTP

**Endpoint:** `POST /api/companies/{id}/send-email-otp/`
**Authentication:** Required

### 7. Verify Company Email OTP

**Endpoint:** `POST /api/companies/{id}/verify-email-otp/`
**Authentication:** Required

### 8. User Management

**Endpoint:** `GET /api/users/`
**Authentication:** Required

**Success Response (200):**

```json
[
  {
    "id": 1,
    "username": "user1",
    "email": "user1@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true
  }
]
```

### 9. Create User

**Endpoint:** `POST /api/users/`
**Authentication:** Required

### 10. Get User Detail

**Endpoint:** `GET /api/users/{id}/`
**Authentication:** Required

### 11. Update User

**Endpoint:** `PUT /api/users/{id}/`
**Authentication:** Required

### 12. User Profile

**Endpoint:** `GET /api/users/profile/`
**Authentication:** Required

### 13. User Company Context

**Endpoint:** `GET /api/users/{user_id}/context/`
**Authentication:** Required

### 14. Subscription Plans

**Endpoint:** `GET /api/subscription-plans/`
**Authentication:** Required

### 15. Create Subscription Plan

**Endpoint:** `POST /api/subscription-plans/`
**Authentication:** Required

### 16. Get Subscription Plan Detail

**Endpoint:** `GET /api/subscription-plans/{id}/`
**Authentication:** Required

### 17. Update Subscription Plan

**Endpoint:** `PUT /api/subscription-plans/{id}/`
**Authentication:** Required

### 18. Subscription Plan with Modules

**Endpoint:** `GET /api/subscription-plans/{id}/modules/`
**Authentication:** Required

### 19. Companies List

**Endpoint:** `GET /api/companies/`
**Authentication:** Required

### 20. Create Company

**Endpoint:** `POST /api/companies/`
**Authentication:** Required

### 21. Get Company Detail

**Endpoint:** `GET /api/companies/{id}/`
**Authentication:** Required

### 22. Update Company

**Endpoint:** `PUT /api/companies/{id}/`
**Authentication:** Required

**Endpoint:** `PATCH /api/companies/{id}/`
**Authentication:** Required

### 23. Company with Users

**Endpoint:** `GET /api/companies/{id}/users/`
**Authentication:** Required

### 24. Company Roles

**Endpoint:** `GET /api/companies/{company_id}/roles/`
**Authentication:** Required

### 25. Company Users by Company

**Endpoint:** `GET /api/companies/{company_id}/company-users/`
**Authentication:** Required

### 26. Company Users Active

**Endpoint:** `GET /api/company-users-active/`
**Authentication:** Required

### 27. Company Users Active by Company

**Endpoint:** `GET /api/companies/{company_id}/users-active/`
**Authentication:** Required

### 28. Roles Management

**Endpoint:** `GET /api/roles/`
**Authentication:** Required

### 29. Create Role

**Endpoint:** `POST /api/roles/`
**Authentication:** Required

### 30. Get Role Detail

**Endpoint:** `GET /api/roles/{id}/`
**Authentication:** Required

### 31. Update Role

**Endpoint:** `PUT /api/roles/{id}/`
**Authentication:** Required

### 32. Role with Permissions

**Endpoint:** `GET /api/roles/{id}/permissions/`
**Authentication:** Required

### 33. Company User Detail

**Endpoint:** `GET /api/company-users/{id}/`
**Authentication:** Required

### 34. Update Company User

**Endpoint:** `PUT /api/company-users/{id}/`
**Authentication:** Required

### 35. Company User Password Update

**Endpoint:** `PUT /api/company-users-crud/{id}/password/`
**Authentication:** Required

### 36. Company User Role Update

**Endpoint:** `PUT /api/company-users-crud/{id}/role/`
**Authentication:** Required

### 37. Company User Status Update

**Endpoint:** `PUT /api/company-users-crud/{id}/status/`
**Authentication:** Required

### 38. Modules Management

**Endpoint:** `GET /api/modules/`
**Authentication:** Required

### 39. Create Module

**Endpoint:** `POST /api/modules/`
**Authentication:** Required

### 40. Get Module Detail

**Endpoint:** `GET /api/modules/{id}/`
**Authentication:** Required

### 41. Update Module

**Endpoint:** `PUT /api/modules/{id}/`
**Authentication:** Required

### 42. Permissions by Role

**Endpoint:** `GET /api/permissions/role/{role_id}/`
**Authentication:** Required

### 43. Permissions by User

**Endpoint:** `GET /api/permissions/user/{user_id}/`
**Authentication:** Required

### 44. Check User Permission

**Endpoint:** `GET /api/check-permission/{user_id}/{module_code}/{action}/`
**Authentication:** Required

### 45. All Module Permissions

**Endpoint:** `GET /api/auth/all-module-permissions/`
**Authentication:** Required

### 46. User Permission Overrides

**Endpoint:** `GET /api/user-permission-overrides/`
**Authentication:** Required

### 47. Create User Permission Override

**Endpoint:** `POST /api/user-permission-overrides/`
**Authentication:** Required

### 48. User Permission Override Detail

**Endpoint:** `GET /api/user-permission-overrides/{id}/`
**Authentication:** Required

### 49. User Permission Overrides by User

**Endpoint:** `GET /api/users/{user_id}/permission-overrides/`
**Authentication:** Required

### 50. Bulk User Permission Overrides

**Endpoint:** `POST /api/users/{user_id}/permission-overrides/bulk/`
**Authentication:** Required

### 51. User Effective Permissions

**Endpoint:** `GET /api/users/{user_id}/effective-permissions/`
**Authentication:** Required

---

## Employee APIs (`/employee/`)

### 1. Dashboard Redirect

**Endpoint:** `GET /employee/employee/`
**Authentication:** Required

**Success Response (200):**
Returns "Driver" if user is in Driver group, otherwise returns "Hello"

---

## Error Codes

### HTTP Status Codes

- **200 OK:** Request successful
- **201 Created:** Resource created successfully
- **400 Bad Request:** Invalid request data
- **401 Unauthorized:** Authentication required or invalid
- **403 Forbidden:** Permission denied
- **404 Not Found:** Resource not found
- **500 Internal Server Error:** Server error

### Common Error Response Format

```json
{
  "status": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Error message for this field"]
  }
}
```

### Authentication Errors

```json
{
  "detail": "Authentication credentials were not provided."
}
```

```json
{
  "detail": "Invalid token."
}
```

### Validation Errors

```json
{
  "status": false,
  "data": {
    "field_name": ["This field is required."],
    "email": ["Enter a valid email address."],
    "phone": ["Ensure this field has at most 15 characters."]
  }
}
```

---

## Rate Limiting

- Standard rate limit: 1000 requests per hour per user
- Authentication endpoints: 10 requests per minute per IP

## Data Formats

- **Dates:** YYYY-MM-DD (ISO 8601)
- **DateTime:** YYYY-MM-DDTHH:MM:SSZ (ISO 8601 UTC)
- **Phone numbers:** Maximum 15 characters
- **Coordinates:** Decimal degrees (e.g., 12.345678)

## File Uploads

- **Supported formats:** JPG, PNG, PDF
- **Maximum file size:** 10MB
- **Upload path:** Include files as multipart/form-data

## Pagination

List endpoints support pagination with the following parameters:

- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)

Response includes:

```json
{
  "count": 100,
  "next": "http://example.com/api/endpoint/?page=3",
  "previous": "http://example.com/api/endpoint/?page=1",
  "results": []
}
```

---

## Contact Information

For API support and questions, contact the development team.

---

_Last updated: August 18, 2025_
