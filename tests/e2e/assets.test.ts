import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3004';

test.describe('ESCACS Asset Module E2E', () => {
    test('Health check returns 200', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/health`);
        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body.status).toBe('healthy');
        expect(body.service).toBe('asset-module');
    });

    test('Full Asset Lifecycle: Register -> Maintenance', async ({ request }) => {
        // 1. Register Asset
        const registerResponse = await request.post(`${BASE_URL}/api/assets`, {
            data: {
                name: 'Pond-E2E-01',
                location: 'Sector 7',
                type: 'detention_pond'
            }
        });
        expect(registerResponse.status()).toBe(201);
        const asset = await registerResponse.json();
        expect(asset.currentHealth).toBe(100);
        expect(asset.status).toBe('Healthy');

        // 2. Record Maintenance
        const maintenanceResponse = await request.post(`${BASE_URL}/api/assets/${asset.id}/maintenance`);
        expect(maintenanceResponse.ok()).toBeTruthy();
        const updatedAsset = await maintenanceResponse.json();
        expect(updatedAsset.id).toBe(asset.id);
        // Note: Health stays at 100 since improvement logic caps it
        expect(updatedAsset.currentHealth).toBe(100);
    });

    test('OpenAPI documentation is available', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/openapi.json`);
        expect(response.ok()).toBeTruthy();
        const spec = await response.json();
        expect(spec.info.title).toContain('Asset Module');
    });
});
