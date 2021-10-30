import { Controller, Post, Session } from '@nestjs/common';

@Controller('api')
export class AppController {
    constructor() {}

    @Post('/signout')
    async signOutAdmin(@Session() session: any) {
        session.user = {};
        return {};
    }
}
