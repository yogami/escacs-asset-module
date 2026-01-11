/**
 * InMemoryAssetRepository - Infrastructure Adapter
 */

import { BMPAsset } from '../domain/entities/BMPAsset';
import { IAssetRepository } from '../domain/services/AssetHealthService';

export class InMemoryAssetRepository implements IAssetRepository {
    private assets: Map<string, BMPAsset> = new Map();

    async save(asset: BMPAsset): Promise<void> {
        this.assets.set(asset.id, asset);
    }

    async findById(id: string): Promise<BMPAsset | null> {
        return this.assets.get(id) ?? null;
    }

    async findAll(): Promise<BMPAsset[]> {
        return Array.from(this.assets.values());
    }
}
