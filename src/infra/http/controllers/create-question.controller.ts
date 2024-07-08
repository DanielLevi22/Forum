import {BadRequestException, Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";



const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachements: z.array(z.string().uuid()),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema >


@Controller('/questions')
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
    const { title,content,attachements} =  body
    const { sub: userId} = user
   const result = await this.createQuestion.execute({
    title,
    content,
    authorId: userId,
    attachmentsIds: attachements
   })
   
   if(result.isLeft()){
    throw new BadRequestException()
  }
  } 
}

