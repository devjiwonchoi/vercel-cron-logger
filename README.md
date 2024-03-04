# Vercel Cron Jobs Logger

> Vercel Cron Jobs logger for those who are in pain with the log span limit.

## Why this project?

For hobby plan users, Vercel has a log span limit of an hour. It is hard to debug your cron jobs after the span, only choice is to create a reprouction, which would consume much time and the result may vary due to numerous factors. This project is to help you to log your cron jobs to a database and view them later.

## Setup

### Create a Vercel Postgres Database

> See [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres/quickstart#quickstart) for details.

Connect the database to your project with the cronjobs.

### Create a Vercel Secret `CRON_SECRET`

> See [Securing cron jobs](https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs) for details.

If you are not using this secret, it is highly recommended to use it.

### Import `vercel-cron-logger` to your cron job

```sh
npm install vercel-cron-logger
```

```ts
import VercelCronLogger from 'vercel-cron-logger';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')

  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    // ...Your cron job logic
    await VercelCronLogger(request)
    return new Response('Success!', { status: 200 })
  }

  return new Response('Unauthorized.', { status: 401 })
}
```

> The logger returns a `Response` objects above with same `CRON_SECRET` validation logic internally.

### Check your Vercel Postgres Database

You can check the logs in your project database.
