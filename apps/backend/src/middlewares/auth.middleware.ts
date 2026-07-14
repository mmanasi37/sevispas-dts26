import type { Request, Response, NextFunction } from 'express';
import { Kysely } from 'kysely';
import type { Database } from '../database/schema.ts';
import { RolePermissionService } from '../services/RolePermissionService.ts';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                roles: string[];
                permissions: string[];
            };
        }
    }
}

// Main auth middleware
export function authMiddleware(db: Kysely<Database>) {
    const roleService = new RolePermissionService(db);

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get staff ID from token/session
            const staffId = req.user?.id || req.session?.staffId;

            if (!staffId) {
                return res.status(401).json({ error: 'Unauthorized - No staff ID found' });
            }

            // Get staff permissions and roles
            const { roles, permissions, roleDetails } = await roleService.getStaffPermissionsMap(staffId);

            // Attach to request for later use
            req.user = {
                id: staffId,
                roles,
                permissions
            };

            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
}

// Role-based middleware
export function requireRole(roleNames: string | string[]) {
    const roles = Array.isArray(roleNames) ? roleNames : [roleNames];

    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized - Not authenticated' });
        }

        const hasRequiredRole = req.user.roles.some(role => roles.includes(role));

        if (!hasRequiredRole) {
            return res.status(403).json({
                error: 'Forbidden - Insufficient role privileges',
                required_roles: roles,
                user_roles: req.user.roles
            });
        }

        next();
    };
}

// Permission-based middleware
export function requirePermission(permissionNames: string | string[]) {
    const permissions = Array.isArray(permissionNames) ? permissionNames : [permissionNames];

    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized - Not authenticated' });
        }

        const hasRequiredPermission = permissions.some(permission =>
            req.user?.permissions.includes(permission)
        );

        if (!hasRequiredPermission) {
            return res.status(403).json({
                error: 'Forbidden - Insufficient permission privileges',
                required_permissions: permissions,
                user_permissions: req.user.permissions
            });
        }

        next();
    };
}

// Combined role OR permission middleware
export function requireRoleOrPermission(options: {
    roles?: string | string[];
    permissions?: string | string[];
}) {
    const roles = options.roles ? (Array.isArray(options.roles) ? options.roles : [options.roles]) : [];
    const permissions = options.permissions ?
        (Array.isArray(options.permissions) ? options.permissions : [options.permissions]) : [];

    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized - Not authenticated' });
        }

        const hasRequiredRole = roles.some(role => req.user?.roles.includes(role));
        const hasRequiredPermission = permissions.some(permission =>
            req.user?.permissions.includes(permission)
        );

        if (!hasRequiredRole && !hasRequiredPermission) {
            return res.status(403).json({
                error: 'Forbidden - Insufficient privileges',
                required_roles: roles,
                required_permissions: permissions,
                user_roles: req.user.roles,
                user_permissions: req.user.permissions
            });
        }

        next();
    };
}

// Resource ownership middleware
export function requireResourceOwnership(
    getResourceOwnerId: (req: Request) => Promise<number | null>
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized - Not authenticated' });
        }

        // Check if user is admin (has admin role)
        const isAdmin = req.user.roles.includes('admin');
        if (isAdmin) {
            return next();
        }

        try {
            const ownerId = await getResourceOwnerId(req);

            if (!ownerId) {
                return res.status(404).json({ error: 'Resource not found' });
            }

            if (ownerId !== req.user.id) {
                return res.status(403).json({
                    error: 'Forbidden - You do not own this resource'
                });
            }

            next();
        } catch (error) {
            console.error('Resource ownership check error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
}