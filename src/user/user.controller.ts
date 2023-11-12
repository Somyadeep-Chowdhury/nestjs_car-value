import { Controller, Post, Get, Body, Param, Query, Patch, Delete, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('user/auth')
@Serialize(UserDto)
export class UserController {
    constructor(
        private userService: UserService,
        private authService: AuthService
    ) { }

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        return this.authService.signup(body.email, body.password)
    }

    @Post('/signin')
    signin(@Body() body: CreateUserDto) {
        return this.authService.signin(body.email, body.password)
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) {
        const user = await this.userService.findOne(id)
        if (!user) throw new NotFoundException('user not found')

        return user
    }

    @Get()
    findAll(@Query('email') email: string) {
        return this.userService.find(email)
    }

    @Patch('/:id')
    update(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.userService.update(id, body)

    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.userService.remove(id)
    }
}
