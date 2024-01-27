import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Student } from '../../enterprise/entities/student'
import { StudentsRepository } from '../repositories/students-repository'
import { HashGenerator } from '../cryptography/hash-generate'
import { StudentAlreadyExistsError } from './erros/student-already-exists-error'

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student
  }
>
@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentRepository: StudentsRepository,
    private hashGenerator: HashGenerator
    ) {}

  async execute({
  name,
  password,
  email
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    



  const userWithSameEmail = await this.studentRepository.findByEmail(email)

  if(userWithSameEmail) {
    return left(new StudentAlreadyExistsError(email))
  }
  const hashPassword = await this.hashGenerator.hash(password)
  
  const student = Student.create({
    name,
    email,
    password: hashPassword,
  })

  await this.studentRepository.create(student)

    return right({
      student,
    })
  }
}
