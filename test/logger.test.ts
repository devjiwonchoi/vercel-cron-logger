import VercelCronLogger from '../src'

process.env.CRON_SECRET = 'CRON_SECRET'

describe('Vercel Cron Jobs Logger', () => {
  const logSpy = jest.spyOn(global.console, 'log')

  it('should log unauthorized requests', async () => {
    const request = new Request('https://example.com', {
      headers: {
        authorization: 'Bearer INVALID',
      },
    })

    const response = await VercelCronLogger(request)
    expect(response.status).toBe(401)
    expect(logSpy).toHaveBeenCalledWith(
      'Unauthorized request to run the cron job.'
    )
  })

  it('should log successful requests', async () => {
    const request = new Request('https://example.com', {
      headers: {
        authorization: 'Bearer CRON_SECRET',
      },
    })

    const response = await VercelCronLogger(request)

    expect(response.status).toBe(200)
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringMatching(/Cron job triggered at .+/)
    )
  })
})
