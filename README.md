# Neural Manacle

This is the personal site and research notebook for Neural Manacle, a solo audio software engineer and writer.

## Local setup

1. Install dependencies with `pnpm install`.
2. Copy the example environment file and fill in real provider credentials:
   `cp .env.example .env.local`
3. Start the app with `pnpm dev`.

## Environment variables

Create a local `.env.local` file with the following keys:

```bash
RESEND_API_KEY=
CONTACT_EMAIL=neuralmanacle@gmail.com
RESEND_FROM_EMAIL=Neural Manacle <onboarding@resend.dev>
BUTTONDOWN_API_KEY=
```

- `RESEND_API_KEY` is used by the contact form API route to send emails through Resend.
- `CONTACT_EMAIL` is the destination inbox for inbound messages.
- `RESEND_FROM_EMAIL` is the sender address configured in Resend; use a verified domain or the default onboarding email during setup.
- `BUTTONDOWN_API_KEY` is used by the newsletter signup route to subscribe visitors to the Buttondown list.

## Provider setup

### Resend

- Create an account at https://resend.com
- Verify a sender domain or use the default onboarding address while testing
- Add the API key to `RESEND_API_KEY`
- Keep the contact route server-side so the secret never reaches the browser

### Buttondown

- Create an account at https://buttondown.email
- Generate a newsletter API key
- Add it to `BUTTONDOWN_API_KEY`
- Ensure the list endpoint matches your subscription list configuration

## Notes

- The project uses Next.js App Router route handlers for both contact and newsletter actions.
- The forms never send private credentials to the client.
- `.env*` files are ignored by Git to keep local secrets out of version control.
