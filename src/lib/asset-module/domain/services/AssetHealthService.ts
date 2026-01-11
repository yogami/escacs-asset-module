/**
 * AssetHealthService - Domain Service
 */

import { BMPAsset } from '../entities/BMPAsset';

export interface IAssetRepository {
    save(asset: BMPAsset): Promise<void>;
    findById(id: string): Promise<BMPAsset | null>;
    findAll(): Promise<BMPAsset[]>;
}

export class AssetHealthService {
    constructor(private readonly repository: IAssetRepository) { }

    async registerNewAsset(name: string, location: string, type: 'detention_pond' | 'silt_fence' | 'bioswale'): Promise<BMPAsset> {
        const asset = BMPAsset.create({
            id: crypto.randomUUID(),
            name,
            location,
            type,
            installedAt: new Date()
        });
        await this.repository.save(asset);
        return asset;
    }

    async addMaintenanceRecord(assetId: string): Promise<BMPAsset> {
        const asset = await this.getExistingAsset(assetId);
        asset.recordMaintenance(new Date());
        await this.repository.save(asset);
        return asset;
    }

    async updateHealthScores(): Promise<void> {
        const assets = await this.repository.findAll();
        for (const asset of assets) {
            asset.decayHealth(5); // Weekly decay constant
            await this.repository.save(asset);
        }
    }

    private async getExistingAsset(assetId: string): Promise<BMPAsset> {
        const asset = await this.repository.findById(assetId);
        if (!asset) {
            throw new Error(`Asset with id ${assetId} not found`);
        }
        return asset;
    }
}
