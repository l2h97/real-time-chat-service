import { Controller } from '@nestjs/common';

@Controller({
  path: 'user',
  version: ['v1'],
})
export class UserController {}
