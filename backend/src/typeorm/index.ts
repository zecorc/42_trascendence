import { User } from "./user.entity";
import { Match } from "./match.entity";
import { Picture } from "./picture.entity";
import { Friendship } from "@/typeorm/friendship.entity";
import { Message } from "@/typeorm/message.entity";
import { Chat } from "@/typeorm/chat.entity";

const entities = [User, Match, Picture, Friendship, Message, Chat];

export { User, Match, Picture, Friendship, Message, Chat };
export default entities;
