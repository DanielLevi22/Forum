import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachments-repository'
import { UploadAndAttachmentCase } from './upload-and-create-attachment'
import { FakerUploader } from 'test/storage/faker-uploader'
import { InvalidAttachmentTypeError } from './erros/invalid-attachment-type'

let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let sut: UploadAndAttachmentCase
let fakeUploader: FakerUploader
describe('Upload and create attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository()
    fakeUploader = new  FakerUploader()
    sut = new UploadAndAttachmentCase(inMemoryAttachmentRepository,fakeUploader)
  })

  it('should be able upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from('')
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentRepository.items[0]
    })
    expect(fakeUploader.upload).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
    }))

  })

  it('should not be able to  upload an attachment invalid fileType', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from('')
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)

  })

})
