# ESCACS Asset Module (BMP Co-Pilot)

## Objective
Implement a post-construction maintenance portal for municipalities to track the 10-year health and compliance of permanent Best Management Practices (BMPs).

---

## Task Breakdown

### 1. Project Scaffolding
- [x] Create project structure
- [x] Initialize `package.json`
- [x] Link Berlin AI Studio rules via `install-brain.sh`
- [ ] Set up `tsconfig.json` and `vite.config.ts`
- [ ] Create `tests/setup.ts`

### 2. Acceptance Tests (ATDD)
- [ ] Write `asset-health-tracking.feature`
- [ ] Create step definitions

### 3. Domain Implementation
- [ ] Entities: `BMPAsset`, `MaintenanceRecord`, `HealthScore`
- [ ] Services: `AssetHealthService`, `ComplianceTrendingService`
- [ ] Ports: `IAssetRepository`, `IComplianceCheckPort`

### 4. Infrastructure Implementation
- [ ] `InMemoryAssetRepository`
- [ ] `HealthCalculationEngine` (Rule-based)

### 5. API Layer
- [ ] `/api/assets` (GET/POST)
- [ ] `/api/assets/:id/maintenance` (POST)
- [ ] `/api/assets/:id/health-score` (GET)

### 6. Gold Standards Compliance
- [ ] Cyclomatic Complexity ≤ 3 per function
- [ ] Unit Test Coverage ≥ 80%
- [ ] 100% Acceptance Test Pass Rate

### 7. Registration & Deployment
- [ ] Register in `Microservices_Catalog.md`
- [ ] Register with Capability Broker
- [ ] Deploy to Railway
