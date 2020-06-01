import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { ObjectType, Field } from "@nestjs/graphql";

@Entity("users")
@ObjectType()
export class User {

    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    userName: string;

    @Field()
    @Column()
    email: string;

    @Column()
    password: string;

    @Field()
    @Column({default:false})
    confirmed:boolean;

}