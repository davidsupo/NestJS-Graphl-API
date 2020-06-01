import { ObjectType, Field } from "@nestjs/graphql";
import { User } from "../user.entity";

@ObjectType()
export class UserResponse {
  @Field()
  error:boolean
  @Field()
  message:string
  @Field({nullable:true})
  user?:User
}