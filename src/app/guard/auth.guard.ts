import { CanActivateFn } from '@angular/router';
import { UserService, isLogin } from '../service/user.service';
import { Inject, inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  return inject(UserService).Canactive();
};

