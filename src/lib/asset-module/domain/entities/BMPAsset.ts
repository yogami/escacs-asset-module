/**
 * BMPAsset - Domain Entity
 */

export type MaintenanceStatus = 'Healthy' | 'Needs Inspection' | 'Overdue';

export interface BMPAssetProps {
    id: string;
    name: string;
    location: string;
    type: 'detention_pond' | 'silt_fence' | 'bioswale';
    installedAt: Date;
    lastMaintenanceAt: Date | null;
    currentHealth: number; // 0-100
}

export class BMPAsset {
    readonly id: string;
    readonly name: string;
    readonly location: string;
    readonly type: BMPAssetProps['type'];
    readonly installedAt: Date;
    private _lastMaintenanceAt: Date | null;
    private _currentHealth: number;

    constructor(props: BMPAssetProps) {
        this.id = props.id;
        this.name = props.name;
        this.location = props.location;
        this.type = props.type;
        this.installedAt = props.installedAt;
        this._lastMaintenanceAt = props.lastMaintenanceAt;
        this._currentHealth = props.currentHealth;
    }

    static create(props: Omit<BMPAssetProps, 'currentHealth' | 'lastMaintenanceAt'>): BMPAsset {
        return new BMPAsset({
            ...props,
            lastMaintenanceAt: null,
            currentHealth: 100,
        });
    }

    get lastMaintenanceAt(): Date | null {
        return this._lastMaintenanceAt;
    }

    get currentHealth(): number {
        return this._currentHealth;
    }

    get status(): MaintenanceStatus {
        if (this.isOverdue()) return 'Overdue';
        if (this._currentHealth < 70) return 'Needs Inspection';
        return 'Healthy';
    }

    recordMaintenance(date: Date): void {
        this._lastMaintenanceAt = date;
        this._currentHealth = Math.min(100, this._currentHealth + 20);
    }

    decayHealth(points: number): void {
        this._currentHealth = Math.max(0, this._currentHealth - points);
    }

    private isOverdue(): boolean {
        const referenceAt = this._lastMaintenanceAt ?? this.installedAt;
        const twoYearsInMs = 2 * 365 * 24 * 60 * 60 * 1000;
        return Date.now() - referenceAt.getTime() > twoYearsInMs;
    }
}
