import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  constructor() {}

  async findByEmail(email: string) {
    const student = this.items.find((item) => item.email === email)

    if (!student) {
      return null
    }

    return student
  }
  

  async create(student: Student) {
    this.items.push(student)
    DomainEvents.dispatchEventsForAggregate(student.id)
  }

  

  
}
