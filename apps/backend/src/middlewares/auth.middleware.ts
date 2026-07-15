import type { Request, Response, NextFunction } from 'express';
import { Kysely } from 'kysely';
import type { Database } from '../database/schema.ts';
import * as utils from '../libs/utils.ts';
import type { SessionUser } from '../types.ts';
// import { RolePermissionService } from '../services/RolePermissionService.ts';

// Main auth middleware
// export function authMiddleware(db: Kysely<Database>) {
//     const roleService = new RolePermissionService(db);

//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             // Get staff ID from token/session
//             const staffId = req.user?.id || req.session?.staffId;

//             if (!staffId) {
//                 return res.status(401).json({ error: 'Unauthorized - No staff ID found' });
//             }

//             // Get staff permissions and roles
//             const { roles, permissions, roleDetails } = await roleService.getStaffPermissionsMap(staffId);

//             // Attach to request for later use
//             req.user = {
//                 id: staffId,
//                 roles,
//                 permissions
//             };

//             next();
//         } catch (error) {
//             console.error('Auth middleware error:', error);
//             return res.status(500).json({ error: 'Internal server error' });
//         }
//     };
// }

// // Role-based middleware
// export function requireRole(roleNames: string | string[]) {
//     const roles = Array.isArray(roleNames) ? roleNames : [roleNames];

//     return (req: Request, res: Response, next: NextFunction) => {
//         if (!req.user) {
//             return res.status(401).json({ error: 'Unauthorized - Not authenticated' });
//         }

//         const hasRequiredRole = req.user.roles.some(role => roles.includes(role));

//         if (!hasRequiredRole) {
//             return res.status(403).json({
//                 error: 'Forbidden - Insufficient role privileges',
//                 required_roles: roles,
//                 user_roles: req.user.roles
//             });
//         }

//         next();
//     };
// }

// // Permission-based middleware
// export function requirePermission(permissionNames: string | string[]) {
//     const permissions = Array.isArray(permissionNames) ? permissionNames : [permissionNames];

//     return (req: Request, res: Response, next: NextFunction) => {
//         if (!req.user) {
//             return res.status(401).json({ error: 'Unauthorized - Not authenticated' });
//         }

//         const hasRequiredPermission = permissions.some(permission =>
//             req.user?.permissions.includes(permission)
//         );

//         if (!hasRequiredPermission) {
//             return res.status(403).json({
//                 error: 'Forbidden - Insufficient permission privileges',
//                 required_permissions: permissions,
//                 user_permissions: req.user.permissions
//             });
//         }

//         next();
//     };
// }

// // Combined role OR permission middleware
// export function requireRoleOrPermission(options: {
//     roles?: string | string[];
//     permissions?: string | string[];
// }) {
//     const roles = options.roles ? (Array.isArray(options.roles) ? options.roles : [options.roles]) : [];
//     const permissions = options.permissions ?
//         (Array.isArray(options.permissions) ? options.permissions : [options.permissions]) : [];

//     return (req: Request, res: Response, next: NextFunction) => {
//         if (!req.user) {
//             return res.status(401).json({ error: 'Unauthorized - Not authenticated' });
//         }

//         const hasRequiredRole = roles.some(role => req.user?.roles.includes(role));
//         const hasRequiredPermission = permissions.some(permission =>
//             req.user?.permissions.includes(permission)
//         );

//         if (!hasRequiredRole && !hasRequiredPermission) {
//             return res.status(403).json({
//                 error: 'Forbidden - Insufficient privileges',
//                 required_roles: roles,
//                 required_permissions: permissions,
//                 user_roles: req.user.roles,
//                 user_permissions: req.user.permissions
//             });
//         }

//         next();
//     };
// }

// // Resource ownership middleware
// export function requireResourceOwnership(
//     getResourceOwnerId: (req: Request) => Promise<number | null>
// ) {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         if (!req.user) {
//             return res.status(401).json({ error: 'Unauthorized - Not authenticated' });
//         }

//         // Check if user is admin (has admin role)
//         const isAdmin = req.user.roles.includes('admin');
//         if (isAdmin) {
//             return next();
//         }

//         try {
//             const ownerId = await getResourceOwnerId(req);

//             if (!ownerId) {
//                 return res.status(404).json({ error: 'Resource not found' });
//             }

//             if (ownerId !== req.user.id) {
//                 return res.status(403).json({
//                     error: 'Forbidden - You do not own this resource'
//                 });
//             }

//             next();
//         } catch (error) {
//             console.error('Resource ownership check error:', error);
//             return res.status(500).json({ error: 'Internal server error' });
//         }
//     };
// }

export function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    // Extract token from the "Authorization: Bearer <TOKEN>" header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        // Decodes and checks expiration/tampering
        const verifiedData = utils.verifyToken(token);
        req.user = verifiedData as unknown as SessionUser; // Store the user data in the request
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or Expired Token' });
    }
}

// Auth middleware
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// Role-based middleware
// export const requireRole = (roles: SessionUser['role'][]) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         if (!req.session.user) {
//             return res.status(401).json({ error: 'Unauthorized' });
//         }

//         if (!roles.includes(req.session.user.role)) {
//             return res.status(403).json({ error: 'Forbidden' });
//         }

//         next();
//     };
// };

// Attach user to request for easy access
export const attachUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
        req.user = req.session.user;
    }
    next();
};