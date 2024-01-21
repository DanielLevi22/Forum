import { ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { hash } from "bcryptjs";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import {  z } from "zod";


const CreateAccountBodySchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof CreateAccountBodySchema >

@Controller('/accounts')
export class CreateAccountController {

  constructor(private prisma: PrismaService) { }

@Post()
@HttpCode(201)
@UsePipes(new ZodValidationPipe(CreateAccountBodySchema))
async handle(@Body() body:CreateAccountBodySchema) {

  const { name, email, password } = body;



  const userWithSameEmail = await this.prisma.user.findUnique({
    where:{
      email
    }
  })
  if(userWithSameEmail) {
    throw new ConflictException('User with same e-mail already exists')
  }
  const hashPassword = await hash(password,8)
  await this.prisma.user.create({
    data: {
      name,
      email,
      password:hashPassword
    }
  })
}

}

