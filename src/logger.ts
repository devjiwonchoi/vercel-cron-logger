import { sql } from '@vercel/postgres'

async function insertLog(log: string) {
  // Do not throw
  try {
    await sql`INSERT INTO cron_logs (log) VALUES (${log})`
  } catch (error) {
    console.error('Failed to insert log:', error)
  }
}

export default async function VercelCronLogger(request: Request) {
  try {
    await sql`CREATE TABLE IF NOT EXISTS cron_logs (log TEXT)`
  } catch (error) {
    console.error('Failed to create table:', error)
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    const log = `Unauthorized attempt to trigger cron job at ${new Date().toUTCString()}`
    await insertLog(log)
    console.log(log)
    return new Response('Unauthorized', { status: 401 })
  }

  const utcTime = new Date().toUTCString()
  const log = `Cron job triggered at ${utcTime}`
  await insertLog(log)
  console.log(log)
  return new Response('Success', { status: 200 })
}
