import {Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "@/infra/auth/jwt.auth.guard";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";



const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema >


@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionsController{

  constructor(
    private prisma: PrismaService
    )
   { }

@Post()
// @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema)) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload
    ) {
    const { title,content} =  body
    const { sub: userId} = user
    const slug = this.convertToSlug(title)
    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug
      }
    })
  } 


  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u836f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }
}

