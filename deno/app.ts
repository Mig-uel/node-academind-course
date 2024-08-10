const port = 3000

const handler = (req: Request): Response => {
  const body = `Your user agent is: \n\n${
    req.headers.get('user-agent') ?? 'Unknown'
  }`

  console.log('Hello')
  return new Response(body, { status: 200 })
}

const server = Deno.serve({ port }, handler)
