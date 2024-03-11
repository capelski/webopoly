import { Controller, Get } from '@nestjs/common';

@Controller('/system')
export class SystemController {
  @Get('/is-up')
  isUp() {
    return true;
  }
}
