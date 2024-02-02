import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { InvalidAttachmentTypeError } from './erros/invalid-attachment-type'
import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentRepository } from '../repositories/attachments-repository'
import { Uploader } from '../storage/uploader'

interface UploadAndAttachmentCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndAttachmentCaseResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment
  }
>
@Injectable()
export class UploadAndAttachmentCase {
  constructor(
    private attachmentsRepository: AttachmentRepository,
    private uploader: Uploader,

    ) {}

  async execute({
  body,
  fileName,
  fileType
  }: UploadAndAttachmentCaseRequest): Promise<UploadAndAttachmentCaseResponse> {
    
    if(!/^(image\/jpe?g|application\/pdf|image\/png)$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body
    })

    const attachment = Attachment.create({
      title: fileName,
      url
    })
    

    await this.attachmentsRepository.create(attachment)
    return right({
      attachment
    })
  }
}
