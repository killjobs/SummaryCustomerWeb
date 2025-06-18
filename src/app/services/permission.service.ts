import { Injectable } from '@angular/core';
import { Roles } from '../Common/enums/roles.enum';
import { RolePermissions } from '../Common/configs/permissions.config';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private role: Roles = Roles.usuario;
  
  constructor() { }

  setRole(role:string){
    if(Object.values(Roles).includes(role as Roles)){
      this.role = role as Roles;
    }
  }

  has(permission: string):boolean{
    return RolePermissions[this.role]?.includes(permission) ?? false;
  }

  getRole():string{
    return this.role;
  }
}
