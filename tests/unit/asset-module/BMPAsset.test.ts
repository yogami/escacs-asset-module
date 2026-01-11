/**
 * BMPAsset Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { BMPAsset } from '../../../src/lib/asset-module/domain/entities/BMPAsset';

describe('BMPAsset', () => {
    it('should create a healthy asset', () => {
        const asset = BMPAsset.create({
            id: '1',
            name: 'Pond',
            location: 'Loc',
            type: 'detention_pond',
            installedAt: new Date()
        });

        expect(asset.currentHealth).toBe(100);
        expect(asset.status).toBe('Healthy');
    });

    it('should record maintenance and improve health', () => {
        const asset = new BMPAsset({
            id: '1',
            name: 'Pond',
            location: 'Loc',
            type: 'detention_pond',
            installedAt: new Date(),
            lastMaintenanceAt: null,
            currentHealth: 50
        });

        asset.recordMaintenance(new Date());
        expect(asset.currentHealth).toBe(70);
        expect(asset.lastMaintenanceAt).toBeDefined();
    });

    it('should decay health', () => {
        const asset = BMPAsset.create({
            id: '1',
            name: 'Pond',
            location: 'Loc',
            type: 'detention_pond',
            installedAt: new Date()
        });

        asset.decayHealth(40);
        expect(asset.currentHealth).toBe(60);
        expect(asset.status).toBe('Needs Inspection');
    });

    it('should detect overdue status', () => {
        const oldDate = new Date();
        oldDate.setFullYear(oldDate.getFullYear() - 3);

        const asset = new BMPAsset({
            id: '1',
            name: 'Pond',
            location: 'Loc',
            type: 'detention_pond',
            installedAt: oldDate,
            lastMaintenanceAt: null,
            currentHealth: 100
        });

        expect(asset.status).toBe('Overdue');
    });
});
