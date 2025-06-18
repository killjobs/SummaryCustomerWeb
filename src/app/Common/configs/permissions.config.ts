import { Roles } from "../enums/roles.enum";

export const RolePermissions: Record<Roles, string[]> = {
    [Roles.administrador] : ['delete'],
    [Roles.asesor] : [],
    [Roles.optometra] : ['delete'],
    [Roles.usuario] : []
}