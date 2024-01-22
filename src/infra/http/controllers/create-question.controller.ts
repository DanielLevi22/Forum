import {Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/infra/auth/jwt.auth.guard";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";



const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema >


@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionsController{

  constructor(
    private createQuestion: CreateQuestionUseCase
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
   await this.createQuestion.execute({
    title,
    content,
    authorId: userId,
    attachmentsIds: []
   })
  } 
}

