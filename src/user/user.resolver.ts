import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { SignupInput } from './input/signup.input';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserResponse } from './shared/userResponse';
import { LoginInput } from './input/login.input';
import { MyContext } from 'src/types/myContext';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';

@Resolver(User)
export class UserResolver {

  constructor(
    private readonly userService:UserService
  ){}

  @Query(()=> String)
  hello (){
    return "Hello World";
  }

  @Mutation(()=>UserResponse,{nullable:true})
  async signup( @Args('signupInput') signupInput:SignupInput ):Promise<UserResponse>{
    return await this.userService.signup(signupInput);
  }

  @Mutation(()=>UserResponse)
  async login(
    @Args('loginInput') loginInput:LoginInput, 
    @Context() ctx:MyContext):Promise<UserResponse>{
    return await this.userService.login(loginInput,ctx.req);
  }

  @Mutation(()=>Boolean)
  async logout(@Context() ctx:MyContext){
    return await this.userService.logout(ctx);
  }

  @Mutation(()=>Boolean)
  @UseGuards(AuthGuard)
  protected(){
    return true
  }

  @Mutation(()=>Boolean)
  @UseGuards(AuthGuard,AdminGuard)
  adminResolver(){
    return true;
  }
}
