import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Match, Picture, User } from "src/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "@/users/dtos/CreateUser.dto";
import { PictureService } from "@/users/services/pictures/pictures.service";
import { UserStatus } from "@/enums/status.enum";

@Injectable()
export class UserService {
  constructor(
    private readonly pictureService: PictureService,

    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Match) private readonly matchRepository: Repository<Match>
  ) {}

  createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async createMatch(match: Match): Promise<void> {
    const newMatch: Match = this.matchRepository.create(match);
    await this.matchRepository.save(newMatch);
  }

  getUsers() {
    return this.userRepository.find();
  }

  getUser(id: number, relations = [] as string[]): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: relations,
    });
  }

  // function to get user by email
  getUserByEmail(email: string, relations = [] as string[]): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email,
      },
      relations: relations,
    });
  }

  async getPicture(userId: number): Promise<Picture> {
    const user: User = await this.getUser(userId, ["picture"]);

    return user.picture;
  }

  async setPicture(userId: number, file: Express.Multer.File): Promise<void> {
    const name = file.originalname;
    const data = file.buffer;
    const user: User = await this.getUser(userId, ["picture"]);

    await this.pictureService.createPicture(name, data, user);
    if (user.picture) await this.pictureService.deletePicture(user.picture.id);
  }

  async getMatches(userId: number): Promise<Match[]> {
    const user = await this.getUser(userId, ["won", "lost"]);

    let matches = [];
    if (user.won) matches = matches.concat(user.won);
    if (user.lost) matches = matches.concat(user.lost);

    return matches;
  }
  async setStatus(userId: number, status: UserStatus): Promise<void> {
    const user = await this.getUser(userId);

    if (user.status == status) return;

    await this.userRepository.update(user.id, { status });
  }
}
