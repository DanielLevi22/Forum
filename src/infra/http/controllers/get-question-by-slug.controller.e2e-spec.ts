import { INestApplication } from "@nestjs/common";
import { AppModule } from "@/infra/app.module";
import { Test } from "@nestjs/testing";
import request from 'supertest'
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { StudentFactory } from "test/factories/make-student";
import { DataBaseModule } from "@/infra/database/database.module";
import { QuestionFactory } from "test/factories/make-question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";


describe('Get question By Slug (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule,DataBaseModule],
      providers: [StudentFactory,QuestionFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    await app.init();
  });
  test('[GET] /questions/:slug', async() => {

   const user = await studentFactory.makePrismaStudent()

  const accessToken = jwt.sign({sub: user.id.toString()})

  await questionFactory.makePrismaQuestion({
    authorId: user.id,
    title: 'Question 01',
    slug: Slug.create('Question-01')
  })

  const response = await request(app.getHttpServer())
  .get(`/questions/Question-01`)
  .set('Authorization', 'Bearer ' + accessToken)
  .send()
    
 
    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      question:  expect.objectContaining({title: 'Question 01'}),
    })

  })
})