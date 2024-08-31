import { Type, Expose } from 'class-transformer'

export class BookmarkListDTO {
  @Type(() => Array<number>)
  @Expose({ name: 'bookmark_list' })
  bookmarkList: number[]
}

export class BookmarkListResponseDTO {
  data: BookmarkListDTO

  constructor(data: BookmarkListDTO) {
    this.data = data
  }
}
