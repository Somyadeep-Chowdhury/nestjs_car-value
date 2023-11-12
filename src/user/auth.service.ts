import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { UserService } from "./user.service";
import { randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(private userService: UserService) { }

    async signup(email: string, password: string) {

        // check email already present or not
        const users = await this.userService.find(email)
        if (users.length) throw new BadRequestException('email in use')

        const salt = randomBytes(8).toString('hex');    // create a salt/secret
        const hash = await scrypt(password, salt, 32) as Buffer;    // hash the password with the salt

        const result = `${salt}.${hash.toString('hex')}`;   // password to store in DB in combination of (salt + . + hash)

        const user = this.userService.create(email, result) // save in db

        return user
    }

    async signin(email: string, password: string) {

        // check email already present or not
        const [user] = await this.userService.find(email)
        if (!user) throw new NotFoundException('user not found')

        const [salt, storedHash] = user.password.split('.')     // Destruct hexadecimal salt and hash from db

        const hash = await scrypt(password, salt, 32) as Buffer;    // generate hash with incoming password

        if (storedHash !== hash.toString('hex')) throw new BadRequestException('Incorrect password')

        return user
    }
}