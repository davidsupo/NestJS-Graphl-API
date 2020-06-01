import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { SignupInput } from './input/signup.input';
import { UserRepository } from './user.repository';
import { UserResponse } from './shared/userResponse';
import { InjectRepository } from '@nestjs/typeorm';
import { confirmEmailLink } from 'src/utils/confirmEmailLink';
import { sendEmail } from 'src/utils/sendEmail';
import { redis } from 'src/redis';
import { Response, Request } from 'express';
import { LoginInput } from './input/login.input';
import * as bcrypt from 'bcryptjs';
import { MyContext } from 'src/types/myContext';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository:UserRepository
  ){}

  async signup(signupInput:SignupInput):Promise<UserResponse>{
    const userExits = await this.userRepository.findOne({where:{email:signupInput.email}});
    if(userExits){ return  { error:true , message:'Error: Email is used'} }

    const user = await this.userRepository.save({...signupInput});
    await sendEmail(user.email,await confirmEmailLink(user.id));
    return {error:false, message: 'User register', user};
  }

  async confirmEmail(id:string, res:Response){

    const userId = await redis.get(id);
    if(!userId){ throw new NotFoundException() }
    await this.userRepository.update({id:userId},{confirmed:true});
    res.send('Ok') 
   
  }

  async login(loginInput:LoginInput,req:Request):Promise<UserResponse>{

    const user = await this.userRepository.findOne({where:{email:loginInput.email}});
    if(!user){ return {error:true,message:'Invalid user or password'} }
    const checkPassword = await bcrypt.compare(loginInput.password,user.password);
    if(!checkPassword){ return {error:true,message:'Invalid user or password'} }
    const confirmedUser = user.confirmed;
    if(!confirmedUser){ return {error:true,message:'Unconfirmed email'}}
    req.session.userId = {user:user.id,isAdmin:false};
    return {error:false,message:'Login success',user}
    
  }

  async logout(ctx:MyContext){
    await ctx.req.session.destroy(error=>{
      console.log(error);
      return false;
    })
    await ctx.res.clearCookie('votingapp');
    return true;
  }
}
