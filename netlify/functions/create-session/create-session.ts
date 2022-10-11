import { Handler } from '@netlify/functions'
import fetch from 'node-fetch'

export const handler: Handler = async (event, _context) => {
  const body = JSON.parse(event.body)

  const response = await fetch('https://komoju.com/api/v1/sessions', {
    method: 'POST',
    body: JSON.stringify({
      currency: 'USD',
      line_items: body.line_items
    }),
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json',
      'authorization': `Basic ${btoa('degica-mart-test:')}`,
    }
  })

  return {
    statusCode: response.status,
    body: await response.text(),
  }
}
