import {
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Picture, User} from "@/typeorm";

@Injectable()
export class PictureService {
    constructor(
        @InjectRepository(Picture)
        private pictureRepository: Repository<Picture>,
    ) {}

    async createPicture(
        name: string,
        data: Buffer,
        user: User,
    ): Promise<Picture> {
        const picture = this.pictureRepository.create({ name, data, user });

        await this.pictureRepository.save(picture);

        return picture;
    }

    async deletePicture(pictureId: number): Promise<void> {
        try {
            await this.pictureRepository.delete(pictureId);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

}