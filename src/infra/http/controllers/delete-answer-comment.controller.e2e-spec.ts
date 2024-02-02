import { INestApplication } from "@nestjs/common";
import { AppModule } from "@/infra/app.module";
import { Test } from "@nestjs/testing";
import request from 'supertest'
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";
import { DataBaseModule } from "@/infra/database/database.module";
import { AnswerFactory } from "test/factories/make-answer";
import { QuestionCommentFactory } from "test/factories/make-question-comment";
import { AnswerCommentFactory } from "test/factories/make-answer-comment";


describe('Delete answer comment (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory



  let questionFactory: QuestionFactory

  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule,DataBaseModule],
      providers: [StudentFactory,QuestionFactory, AnswerFactory,AnswerCommentFactory,AnswerFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    questionFactory = moduleRef.get(QuestionFactory)
    

    studentFactory = moduleRef.get(StudentFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    answerFactory = moduleRef.get(AnswerFactory)



    await app.init();
  });
  test('[DELETE]/answers/comments/:id', async() => {

   const user = await studentFactory.makePrismaStudent()

  const accessToken = jwt.sign({sub: user.id.toString()})

  const question = await questionFactory.makePrismaQuestion({
    authorId: user.id
  })

  const  answer = await answerFactory.makePrismaAnswer({
    questionId: question.id,
    authorId: user.id
  })

  const answerComment = await answerCommentFactory.makePrismaAnswerComment({
    answerId: answer.id,
    authorId: user.id
  })

  const answerCommentId = answerComment.id.toString()
  const response = await request(app.getHttpServer())
  .delete(`/answers/comments/${answerCommentId}`)
  .set('Authorization', 'Bearer ' + accessToken)
  .send()
    expect(response.statusCode).toEqual(204)
  
    const commentOnDataBase =  await prisma.comment.findUnique({
      where: {
      id: answerCommentId,
      }
    })
 
   expect(commentOnDataBase).toBeNull()

  })
})