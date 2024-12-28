import {CanActivate, ExecutionContext, ForbiddenException} from "@nestjs/common";
import { jwtDecode } from 'jwt-decode';


type IRoleValidator<Role extends string> = {
  validate(role: Role): boolean;

}

type Roles = 'user' | 'admin';

const canChange: Roles[] = ['admin'];

class RoleValidator implements IRoleValidator<Roles>{
  validate(role: Roles) {
    return canChange.includes(role);
  }
}

export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const role = request.headers['x-role'];
    const auth = request.headers.authorization && request.headers.authorization.toString().split(' ')[0] === 'Bearer';

    if (auth) {
      const token: string = request.headers.authorization.toString().split(' ')[1]
      const { role }: { role: Roles } = jwtDecode(token);

      console.log(new RoleValidator().validate(role))
    }

    if (new RoleValidator().validate(role)) {
      return true;
    }

    throw new ForbiddenException('Доступ запрещён: требуется роль admin');
  }
}
