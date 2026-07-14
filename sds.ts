
// var corsOptions = {
//   // optionsSuccessStatus: 204
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   preflightContinue: false,
//   origin: env.ALLOWED_ORIGINS.split(',') ?? true
//   // origin: "*",
//   // origin: function (_origin, callback) {
//   //   // db.loadOrigins is an example call to load
//   //   // a list of origins from a backing database
//   //   db.loadOrigins(function (error, origins) {
//   //     callback(error, origins);
//   //   });
//   // },
// };
// app.use(cors(corsOptions));


// app.use(authMiddleware(db)); // for now we skip auth middleware

// app.resource = function (path: string, obj: Object) {
//   this.get(path, obj.index);
//   this.get(path + '/:a..:b{.:format}', function (req: Request, res: Response) {
//     var a = parseInt(req.params.a, 10);
//     var b = parseInt(req.params.b, 10);
//     var format = req.params.format;
//     obj.range(req, res, a, b, format);
//   });
//   this.get(path + '/:id', obj.show);
//   this.delete(path + '/:id', function (req, res) {
//     var id = parseInt(req.params.id, 10);
//     obj.destroy(req, res, id);
//   });
// };
// app.resource('/users', User);

// const apiKeys: string[] = [];

// function error(status: number, msg: string | undefined) {
//   var err = new Error(msg);
//   err.cause = status;
//   return err;
// }
// app.use('/api', function (req, res, next) {
//   var key = req.query['api-key'];

//   // key isn't present
//   if (!key) return next(error(400, 'api key required'));

//   // key is invalid
//   if (apiKeys.indexOf(key) === -1) return next(error(401, 'invalid api key'))

//   // all good, store req.key for route access
//   req.key = key;
//   next();
// });


import { Kysely, sql } from 'kysely';
import type { Database, Role, Permission, RoleWithPermissions } from '../database/types.ts';

export class RolePermissionService {
    constructor(private db: Kysely<Database>) { }

    // Get staff roles with permissions
    async getStaffRolesAndPermissions(staffId: number): Promise<RoleWithPermissions[]> {
        // Get roles for staff
        const staffRoles = await this.db
            .selectFrom('Role')
            .innerJoin('RoleStaff', 'Role.id', 'RoleStaff.role_id')
            .where('RoleStaff.staff_id', '=', staffId)
            .where('Role.deleted_at', 'is', null)
            .where('RoleStaff.deleted_at', 'is', null)
            .select(['Role.id', 'Role.name'])
            .execute();

        if (staffRoles.length === 0) return [];

        const roleIds = staffRoles.map(r => r.id);

        // Get permissions for these roles
        const rolePermissions = await this.db
            .selectFrom('Permission')
            .innerJoin('PermissionRole', 'Permission.id', 'PermissionRole.permission_id')
            .where('PermissionRole.role_id', 'in', roleIds)
            .where('Permission.deleted_at', 'is', null)
            .where('PermissionRole.deleted_at', 'is', null)
            .select([
                'Permission.id',
                'Permission.name',
                'PermissionRole.role_id'
            ])
            .execute();

        // Group permissions by role
        const permissionsByRole = new Map<number, Permission[]>();
        rolePermissions.forEach(p => {
            if (!permissionsByRole.has(p.role_id)) {
                permissionsByRole.set(p.role_id, []);
            }
            permissionsByRole.get(p.role_id)!.push({
                id: p.id,
                name: p.name
            } as Permission);
        });

        // Build role objects with permissions
        return staffRoles.map(role => ({
            ...role,
            permissions: permissionsByRole.get(role.id) || []
        }));
    }

    // Check if staff has specific role
    async staffHasRole(staffId: number, roleName: string): Promise<boolean> {
        const result = await this.db
            .selectFrom('Role')
            .innerJoin('RoleStaff', 'Role.id', 'RoleStaff.role_id')
            .where('RoleStaff.staff_id', '=', staffId)
            .where('Role.name', '=', roleName)
            .where('Role.deleted_at', 'is', null)
            .where('RoleStaff.deleted_at', 'is', null)
            .select('Role.id')
            .executeTakeFirst();

        return !!result;
    }

    // Check if staff has specific permission
    async staffHasPermission(staffId: number, permissionName: string): Promise<boolean> {
        const result = await this.db
            .selectFrom('Permission')
            .innerJoin('PermissionRole', 'Permission.id', 'PermissionRole.permission_id')
            .innerJoin('RoleStaff', 'PermissionRole.role_id', 'RoleStaff.role_id')
            .where('RoleStaff.staff_id', '=', staffId)
            .where('Permission.name', '=', permissionName)
            .where('Permission.deleted_at', 'is', null)
            .where('PermissionRole.deleted_at', 'is', null)
            .where('RoleStaff.deleted_at', 'is', null)
            .select('Permission.id')
            .executeTakeFirst();

        return !!result;
    }

    // Get all permissions for staff
    async getStaffPermissions(staffId: number): Promise<string[]> {
        const permissions = await this.db
            .selectFrom('Permission')
            .innerJoin('PermissionRole', 'Permission.id', 'PermissionRole.permission_id')
            .innerJoin('RoleStaff', 'PermissionRole.role_id', 'RoleStaff.role_id')
            .where('RoleStaff.staff_id', '=', staffId)
            .where('Permission.deleted_at', 'is', null)
            .where('PermissionRole.deleted_at', 'is', null)
            .where('RoleStaff.deleted_at', 'is', null)
            .select('Permission.name')
            .distinct()
            .execute();

        return permissions.map(p => p.name);
    }

    // Get all roles for staff
    async getStaffRoles(staffId: number): Promise<string[]> {
        const roles = await this.db
            .selectFrom('Role')
            .innerJoin('RoleStaff', 'Role.id', 'RoleStaff.role_id')
            .where('RoleStaff.staff_id', '=', staffId)
            .where('Role.deleted_at', 'is', null)
            .where('RoleStaff.deleted_at', 'is', null)
            .select('Role.name')
            .execute();

        return roles.map(r => r.name);
    }

    // Cache-friendly: Get all staff permissions in one query
    async getStaffPermissionsMap(staffId: number): Promise<{
        roles: string[];
        permissions: string[];
        roleDetails: RoleWithPermissions[];
    }> {
        const rolesWithPermissions = await this.getStaffRolesAndPermissions(staffId);

        const roles = rolesWithPermissions.map(r => r.name);
        const permissions = rolesWithPermissions
            .flatMap(r => r.permissions)
            .map(p => p.name)
            .filter((v, i, a) => a.indexOf(v) === i); // Unique

        return {
            roles,
            permissions,
            roleDetails: rolesWithPermissions
        };
    }
}