import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type IAuth = {
  id: number;
  login: string;
};

export const Auth = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return request.user as IAuth;
});
