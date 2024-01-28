import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptopgraphy/faker-hasher'
import { FakerEncrypter } from 'test/cryptopgraphy/faker-encrypter'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakerEncrypter: FakerEncrypter
let fakeHasher: FakeHasher

let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    fakerEncrypter =  new FakerEncrypter()
    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakerEncrypter
      )
  })

  it('should be able to authenticate a student', async () => {

    const student = makeStudent({
      email: 'daniel@email.com',
      password: await fakeHasher.hash('123456')
    })

    inMemoryStudentsRepository.create(student)
    const result = await sut.execute({
      email: 'daniel@email.com',
      password: '123456'
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken:expect.any(String)
    })
  })
})
