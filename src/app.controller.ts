import { Controller, Get, Request, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {

  @Get([ '', 'ping' ])
  healthCheck(): any {
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  @Get('api/profile')
  async getProfile(@Request() req) {
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        user: req.user,
      },
    };
  }
}
