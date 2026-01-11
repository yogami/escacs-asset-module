/**
 * AssetHealthService Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AssetHealthService } from '../../../src/lib/asset-module/domain/services/AssetHealthService';
import { InMemoryAssetRepository } from '../../../src/lib/asset-module/infrastructure/InMemoryAssetRepository';

describe('AssetHealthService', () => {
    let service: AssetHealthService;
    let repository: InMemoryAssetRepository;

    beforeEach(() => {
        repository = new InMemoryAssetRepository();
        service = new AssetHealthService(repository);
    });

    it('should register a new asset', async () => {
        const asset = await service.registerNewAsset('Pond', 'North', 'detention_pond');
        expect(asset.name).toBe('Pond');

        const stored = await repository.findById(asset.id);
        expect(stored).toBeDefined();
    });

    it('should update all health scores', async () => {
        const asset = await service.registerNewAsset('Pond', 'North', 'detention_pond');
        await service.updateHealthScores();

        const updated = await repository.findById(asset.id);
        expect(updated?.currentHealth).toBe(95);
    });

    it('should throw error when adding maintenance to non-existent asset', async () => {
        await expect(service.addMaintenanceRecord('non-existent'))
            .rejects.toThrow('not found');
    });
});
