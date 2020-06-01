import {InputType, Field} from '@nestjs/graphql';
import { User } from '../user.entity';

@InputType({description: "Signup User"})
export class SignupInput implements Partial<User> {
  @Field()
  userName: string;

  @Field()
  email:string;

  @Field()
  password:string
  
}