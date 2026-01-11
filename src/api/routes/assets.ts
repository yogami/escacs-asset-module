/**
 * Asset API Routes
 */

import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { AssetHealthService } from '../../lib/asset-module/domain/services/AssetHealthService';
import { InMemoryAssetRepository } from '../../lib/asset-module/infrastructure/InMemoryAssetRepository';

export const assetRoutes = new OpenAPIHono();

const repository = new InMemoryAssetRepository();
const service = new AssetHealthService(repository);

const AssetSchema = z.object({
    id: z.string(),
    name: z.string(),
    location: z.string(),
    type: z.string(),
    currentHealth: z.number(),
    status: z.string()
});

assetRoutes.openapi(
    createRoute({
        method: 'post',
        path: '/',
        summary: 'Register new BMP asset',
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            name: z.string(),
                            location: z.string(),
                            type: z.enum(['detention_pond', 'silt_fence', 'bioswale'])
                        })
                    }
                }
            }
        },
        responses: {
            201: {
                description: 'Asset registered',
                content: { 'application/json': { schema: AssetSchema } }
            }
        }
    }),
    async (c) => {
        const { name, location, type } = c.req.valid('json');
        const asset = await service.registerNewAsset(name, location, type);
        return c.json({
            id: asset.id,
            name: asset.name,
            location: asset.location,
            type: asset.type,
            currentHealth: asset.currentHealth,
            status: asset.status
        }, 201);
    }
);

assetRoutes.openapi(
    createRoute({
        method: 'post',
        path: '/{id}/maintenance',
        summary: 'Record maintenance for asset',
        request: {
            params: z.object({ id: z.string() })
        },
        responses: {
            200: {
                description: 'Maintenance recorded',
                content: { 'application/json': { schema: AssetSchema } }
            }
        }
    }),
    async (c) => {
        const { id } = c.req.valid('param');
        const asset = await service.addMaintenanceRecord(id);
        return c.json({
            id: asset.id,
            name: asset.name,
            location: asset.location,
            type: asset.type,
            currentHealth: asset.currentHealth,
            status: asset.status
        });
    }
);
