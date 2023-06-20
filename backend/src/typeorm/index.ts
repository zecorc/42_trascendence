import { User } from "./user.entity";
import { Match } from "./match.entity";
import { Picture } from "./picture.entity";
import { Friendship } from "@/typeorm/friendship.entity";

const entities = [User, Match, Picture, Friendship];

export { User, Match, Picture, Friendship };
export default entities;
