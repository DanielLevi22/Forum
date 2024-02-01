import {BadRequestException, Body, Controller, HttpCode, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";



const answerQuestionBodySchema = z.object({

  content: z.string(),
})

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema >


@Controller('/questions/:questionId/answers')
export class AnswerQuestionController{

  constructor(
    private answerQuestion: AnswerQuestionUseCase
    )
   { }

@Post()
@HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(answerQuestionBodySchema)) body: AnswerQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId:string
    ) {
    const { content} =  body
    const { sub: userId} = user
   const result = await this.answerQuestion.execute({
    content,
    questionId,
    authorId: userId,
    attachmentsIds: []
   })
   
   if(result.isLeft()){
    throw new BadRequestException()
  }
  } 
}

