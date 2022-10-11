import { Handler } from '@netlify/functions'
import fetch from 'node-fetch'

export const handler: Handler = async (event, _context) => {
  const { session } = event.queryStringParameters

  const response = await fetch(`https://komoju.com/api/v1/sessions/${session}`, {
    headers: {
      'accept': 'application/json',
      'authorization': `Basic ${btoa('degica-mart-test:')}`,
    }
  })

  return {
    statusCode: response.status,
    body: await response.text(),
  }
}
