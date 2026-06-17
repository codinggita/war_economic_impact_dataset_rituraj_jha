# Implementation Plan for War Economic Impact API

This plan outlines the architecture and steps required to build out the extensive list of API routes for the War Economic Impact dataset project. 

## Goal Description

The objective is to implement a comprehensive RESTful API handling complex querying, sorting, pagination, authentication, validation, and analytics based on the War Economic Impact dataset. The API will be built using Node.js, Express, and MongoDB (Mongoose). 

## User Review Required

> [!IMPORTANT]
> **Database Schema Design:** The requested routes imply a highly normalized database structure (e.g., separate endpoints for `/poverty-records`, `/inflation-records`, `/regions`). However, the `GET /conflicts` endpoints require filtering by fields that would belong to these other collections (e.g., `/conflicts?inflationAbove=50`). 
> 
> **Recommendation:** To make filtering and sorting performant and straightforward, I propose we adopt a more **denormalized** (flat or embedded) schema for `Conflict` where possible, or use MongoDB's aggregation pipeline heavily. 
> 
> Given the POST routes requested, we will create the following separate Mongoose models and link them via `ref` to the `Conflict` model:
> 1. `Conflict` (core details, links to others)
> 2. `Region`
> 3. `Country`
> 4. `EconomicRecord` (GDP, inflation)
> 5. `PovertyRecord` (poverty rates, food insecurity)
> 6. `BlackMarketRecord` (levels, goods, gap)
> 7. `WarCostRecord` (cost of war)
> 8. `ReconstructionRecord` (reconstruction costs)
> 9. `UnemploymentRecord` (unemployment rates)
>
> Please confirm if you want a highly normalized database (many separate models) or if we can consolidate some of these into a single comprehensive `Conflict` model with embedded subdocuments for easier querying.

> [!WARNING]
> **Authentication:** The plan includes implementing JWT-based authentication. We will need to install `jsonwebtoken`, `bcryptjs`, and potentially `express-rate-limit` for rate limiting.

## Open Questions

1. **Database Seed:** Do you want me to create a script to seed the MongoDB database from the provided Google Drive dataset (CSV)?
2. **Schema Normalization:** Do you approve of creating ~10 separate Mongoose models to support the specific POST routes (`/regions`, `/poverty-records`, etc.), knowing it will make the `GET /conflicts` aggregation queries much more complex? Or would you prefer to collapse these into a unified `Conflict` schema and handle those POST routes as updates to the main conflict document?

## Proposed Changes

### Models

We will define or update the following models to support all fields required by the search and filter queries.

#### [MODIFY] `models/Conflict.js`
Expand schema to support more fields, or add references to the new models.

#### [NEW] `models/Country.js`
Schema for countries.

#### [NEW] `models/Region.js`
Schema for regions.

#### [MODIFY] `models/EconomicRecord.js`
Update fields to match dataset.

#### [NEW] `models/PovertyRecord.js`
Schema for poverty and food insecurity.

#### [NEW] `models/BlackMarketRecord.js`
Schema for black market levels and goods.

#### [NEW] `models/WarCostRecord.js`
Schema for war costs.

#### [NEW] `models/ReconstructionRecord.js`
Schema for reconstruction costs.

#### [NEW] `models/UnemploymentRecord.js`
Schema for unemployment metrics.

### Controllers & Routes

We will implement standard controllers and route files for each entity, plus specialized controllers for search, stats, and auth.

#### [MODIFY] `controllers/conflictController.js`
Implement all the complex `GET` logic:
- Basic CRUD operations.
- Dynamic building of MongoDB query objects based on `req.query` (e.g., `status`, `region`, `inflationAbove`, `minGDP`, `maxGDP`, `keyword`).
- Pagination (`skip`, `limit`).
- Sorting (`sort`).

#### [MODIFY] `routes/conflictRoutes.js`
Add all the specific route parameters and query parameter handling routes.

#### [NEW] `controllers/authController.js` & `routes/authRoutes.js`
Implement user registration, login, JWT token generation, refresh, and password reset logic.

#### [NEW] `controllers/statsController.js` & `routes/statsRoutes.js`
Implement aggregation queries to find highest/lowest values and counts.

#### [NEW] `middlewares/authMiddleware.js`
JWT verification middleware for protected routes.

#### [NEW] `middlewares/rateLimiter.js`
Implementation of express-rate-limit.

#### [NEW] `middlewares/errorHandler.js`
Global error handling and Mongoose validation error formatting.

### Application Setup

#### [MODIFY] `app.js`
Register all new route files, rate limiters, and error handling middleware.

## Verification Plan

### Automated Tests
- We will test the API endpoints using the `run_command` tool with `curl` or by writing simple node scripts to test the endpoints and ensure the correct JSON structure is returned.

### Manual Verification
- We will verify that queries like `/conflicts?inflationAbove=50&sort=-GDP_Change_%&page=1&limit=10` correctly translate to MongoDB queries and aggregations.
