/**
 * ESCACS Asset Module API Server
 */

import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { assetRoutes } from './routes/assets';
import process from 'node:process';

const app = new OpenAPIHono();

app.use('*', cors());

// Mount routes
app.route('/api/assets', assetRoutes);

// Health check
app.get('/api/health', (c) => c.json({ status: 'healthy', service: 'asset-module' }));

const port = parseInt(process.env.PORT || '8080', 10);

// OpenAPI doc
app.doc('/api/openapi.json', {
    openapi: '3.0.0',
    info: {
        title: 'ESCACS Asset Module API',
        version: '1.0.0',
        description: 'Post-construction BMP health tracking',
    },
    servers: [{ url: `http://localhost:${port}`, description: 'Local' }],
});

app.get('/api/docs', swaggerUI({ url: '/api/openapi.json' }));

console.log(`Asset Module running on port ${port}`);

serve({
    fetch: app.fetch,
    port: port,
    hostname: '0.0.0.0'
});

export default app;
