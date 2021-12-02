import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.currentUser.role && request.currentUser.id) {
      if (request.currentUser.role === "admin") {
        return request.currentUser;
      }
    }

    return false;
  }
}