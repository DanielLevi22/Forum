import { INestApplication } from "@nestjs/common";
import { AppModule } from "@/infra/app.module";
import { Test } from "@nestjs/testing";
import request from 'supertest'
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { StudentFactory } from "test/factories/make-student";
import { DataBaseModule } from "@/infra/database/database.module";
import { AttachmentFactory } from "test/factories/make-attachment";
describe('Create question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let attachmentFactory: AttachmentFactory
  let studentFactory: StudentFactory
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DataBaseModule],
      providers: [StudentFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /questions', async() => {

   const user = await studentFactory.makePrismaStudent()

  const accessToken = jwt.sign({sub: user.id.toString()})

  const attachement1 = await attachmentFactory.makePrismaAttachment()
  const attachement2 = await  attachmentFactory.makePrismaAttachment()


  const response = await request(app.getHttpServer())
  .post('/questions')
  .set('Authorization', 'Bearer ' + accessToken)
  .send({
      title:'New Question',
      content: 'Question Content',
      attachements: [attachement1.id.toString(),attachement2.id.toString()]
    })
    const questionOnDataBase =  await prisma.question.findFirst({
      where: {
        title: 'New Question'
      }
    })
 
  expect(response.statusCode).toEqual(201)
  expect(questionOnDataBase).toBeTruthy()
  

  const attachmentOnDataBase =  await prisma.attachment.findMany({
    where: {
      questionId: questionOnDataBase?.id
    } 
  })

  expect(attachmentOnDataBase.length).toEqual(2)
})

})