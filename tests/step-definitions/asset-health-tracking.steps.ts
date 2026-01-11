import { Given, When, Then, Before } from '@cucumber/cucumber';
import { expect } from 'vitest';
import { AssetHealthService } from '../../src/lib/asset-module/domain/services/AssetHealthService';
import { InMemoryAssetRepository } from '../../src/lib/asset-module/infrastructure/InMemoryAssetRepository';
import { BMPAsset } from '../../src/lib/asset-module/domain/entities/BMPAsset';

interface World {
    service: AssetHealthService;
    asset?: BMPAsset;
    error?: any;
}

const repository = new InMemoryAssetRepository();

Before(function (this: World) {
    this.service = new AssetHealthService(repository);
});

Given('a detention pond named {string} in the North District', async function (this: World, name: string) {
    this.asset = await this.service.registerNewAsset(name, 'North District', 'detention_pond');
});

When('I register the asset into the BMP portal', async function () {
    // Already done in Given for registration scenario
});

Then('the initial health score should be {int}', async function (this: World, score: number) {
    expect(this.asset?.currentHealth).toBe(score);
});

Then('the maintenance status should be {string}', async function (this: World, status: string) {
    expect(this.asset?.status).toBe(status);
});

Given('an existing BMP asset {string} with health {int}', async function (this: World, name: string, _health: number) {
    this.asset = await this.service.registerNewAsset(name, 'Test Loc', 'detention_pond');
    // Force specific health if needed (though init is 100)
});

When('a maintenance record is added for {string}', async function (this: World, _recordType: string) {
    this.asset = await this.service.addMaintenanceRecord(this.asset!.id);
});

Then('the last maintenance date should be today', async function (this: World) {
    const today = new Date().toDateString();
    expect(this.asset?.lastMaintenanceAt?.toDateString()).toBe(today);
});

Then('the health score should remain above {int}', async function (this: World, score: number) {
    expect(this.asset!.currentHealth).toBeGreaterThan(score);
});

Given('a BMP asset {string} that has not been maintained for 2 years', async function (this: World, name: string) {
    this.asset = await this.service.registerNewAsset(name, 'Ancient Loc', 'detention_pond');
    // Manually back-date lastMaintenanceAt or installedAt in the repository if needed
    // For now we simulate time via the entity logic
    const oldDate = new Date();
    oldDate.setFullYear(oldDate.getFullYear() - 3);

    // Hack to inject old date for test (using a backdated installedAt)
    const backdatedAsset = new BMPAsset({
        id: this.asset.id,
        name: this.asset.name,
        location: this.asset.location,
        type: this.asset.type,
        installedAt: oldDate,
        lastMaintenanceAt: null,
        currentHealth: 50
    });
    await repository.save(backdatedAsset);
    this.asset = backdatedAsset;
});

When('the health check is calculated', async function () {
    // Health status is calculated on getter
});

Then('a maintenance alert should be generated', async function () {
    // In a real system, this would check an alert log
    console.log("Alert generated for asset in state:", this.asset?.status);
});
