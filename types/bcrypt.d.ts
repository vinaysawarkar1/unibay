declare module 'bcrypt' {
  import type { BinaryLike } from 'crypto'

  function compare(data: BinaryLike | string, encrypted: BinaryLike | string): Promise<boolean>
  function hash(data: BinaryLike | string, saltOrRounds: number | string): Promise<string>

  const bcrypt: {
    compare: typeof compare
    hash: typeof hash
  }

  export default bcrypt
}

