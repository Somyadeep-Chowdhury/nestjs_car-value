import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    create(email: string, password: string) {
        const user = this.userRepository.create({ email, password })

        return this.userRepository.save(user)
    }

    findOne(id: string) {
        return this.userRepository.findOneBy({ id });
    }

    find(email: string) {
        return this.userRepository.find({ where: { email } });
    }

    async update(id: string, attr: Partial<User>) {
        const user = await this.userRepository.findOneBy({ id })
        if (!user) throw new NotFoundException("User not Found")

        Object.assign(user, attr)
        return await this.userRepository.save(user)
    }

    async remove(id: string) {
        const user = await this.userRepository.findOneBy({ id })
        if (!user) throw new NotFoundException("User not Found")

        return await this.userRepository.remove(user)
     }
}
