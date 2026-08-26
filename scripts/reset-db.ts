import { rmSync } from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'
import 'dotenv/config'

const url = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'
if (!url.startsWith('file:')) {
  throw new Error('검증 준비는 SQLite file: DATABASE_URL만 지원합니다.')
}

const dbPath = path.resolve(process.cwd(), url.slice('file:'.length).split('?')[0])
for (const suffix of ['', '-journal', '-wal', '-shm']) {
  rmSync(`${dbPath}${suffix}`, { force: true })
}

execSync('npm run db:ensure', { stdio: 'inherit' })
