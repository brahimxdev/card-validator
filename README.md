# Card Number Validation Endpoint

A backend API that determines whether a submitted card number is structurally and mathematically valid - built for the Backend Developer Intern assessment.

## Prerequisites

- Node.js v20 or later (developed and tested on v24.15.0)
- npm (bundled with Node)

## Install

```bash
npm install
```

## Run

**Development** (auto-restarts on file changes, runs directly from TypeScript source via `tsx`):

```bash
npm run dev
```

**Production-style** (compiles TypeScript to `dist/`, then runs the compiled output):

```bash
npm run build
npm start
```

Either way, the server starts on port `3000` by default. Set the `PORT` environment variable to override it:

```bash
PORT=4000 npm run dev
```

## Run the tests

```bash
npm test
```

Runs the full unit and integration test suite via Vitest.

## Example usage

**Request** — `POST /api/v1/public/cards/validate`

```bash
curl -X POST http://localhost:3000/api/v1/public/cards/validate \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4111 1111 1111 1111"}'
```

**Response** — `200 OK`, valid card:

```json
{
  "success": true,
  "data": {
    "valid": true,
    "brand": "visa"
  }
}
```

**Response** - `200 OK`, well-formed request but the number fails the Luhn checksum:

```bash
curl -X POST http://localhost:3000/api/v1/public/cards/validate \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4111111111111112"}'
```

```json
{
  "success": true,
  "data": {
    "valid": false,
    "brand": "visa"
  }
}
```

Note this is still `200`, not an error - the request was well-formed, and the endpoint successfully determined the number is invalid. See the [Decisions](#decisions) section below for why.

**Response** — `400 Bad Request`, malformed request (e.g. missing field):

```bash
curl -X POST http://localhost:3000/api/v1/public/cards/validate \
  -H "Content-Type: application/json" \
  -d '{}'
```

```json
{ "error": "VALIDATION_ERROR", "message": "cardNumber must be a string" }
```

## Health check

```bash
curl http://localhost:3000/health
```

```json
{ "status": "ok" }
```

This exists purely to confirm the process is up - a wiring smoke test, not a production readiness probe.

## Decisions

**Scope of "valid."** This endpoint defines "valid" as: correctly formatted, and passes the Luhn checksum used by every major card network to catch input typos. It does not mean the card is real, active, or chargeable - that can only be confirmed by an actual payment processor via a live authorization request, which is explicitly out of scope for this exercise (no processor integration exists here).

**`cardNumber` is a string, never a number.** Card numbers can run up to 19 digits, which exceeds `Number.MAX_SAFE_INTEGER`'s reliable precision (~16 digits) - representing it as a JS number risks silent precision loss. A string also avoids ambiguity around leading zeros, however unlikely in practice.

**A Luhn-invalid number returns `200`, not `400`.** The request itself was well-formed - a string was submitted, it was checked, and an answer was produced. `400` is reserved for requests the server can't process at all (missing field, wrong type, empty string). Conflating "the answer is no" with "the request was broken" would misuse HTTP status codes.

**No Repository layer.** This project follows a layered structure (Routes → Validation → Controller → Service), but deliberately has no Repository layer, because there is no persistence or database anywhere in this problem. Including an empty repository layer for the sake of symmetry would be unnecessary complexity with no job to do.

**Brand detection is informational only.** Identifying the card network (Visa, Mastercard, etc.) from its leading digits is useful for UI/UX (e.g. showing the right logo) but says nothing about whether the number is valid. An unrecognized brand prefix does not fail validation - a number can be Luhn-valid with `brand: null`, and that's treated as a normal, expected outcome rather than an error, since new BIN ranges are issued over time.

**API prefix: `/api/v1/public/cards/validate`.** `public` signals this route requires no authentication - an explicit, honest label rather than an implicit assumption. `v1` allows a future breaking change to be introduced as `v2` without disrupting this endpoint, even though only one version exists today.

**Deferred, not built:**

- **CVV and expiry validation** - not required by the assessment brief, and including them would expand scope well beyond "validate a card number."
- **Issuer name / country / card-level lookup** - this data isn't derivable from the card number alone; it requires a commercial BIN database, which is unnecessary infrastructure for what's being asked here.
- **Rate limiting** - a reasonable production concern for a public endpoint, but out of scope for a single-endpoint assessment repo; noted here as a known next step rather than silently omitted.
- **Fraud detection / identity verification** - not achievable from a card number in isolation, and not what Luhn is for.

**Known simplification in error messages.** A missing `cardNumber` field and a `cardNumber` of the wrong type currently produce the same message (`"cardNumber must be a string"`), since both are represented as the same Zod issue type. A future iteration could distinguish "missing" from "wrong type" with more specific messaging if that granularity became useful to API consumers.
