# UddoktaPay Payment Integration (Sandbox) - Full API Docs (README)

This README contains the complete, clean documentation for the 3 core UddoktaPay APIs:

1. **Create Charge (Checkout V2)** - create a payment and receive a `payment_url`
2. **Verify Payment** - verify an `invoice_id` and fetch payment details
3. **Refund Payment** - refund a successful transaction using `transaction_id`

> Important security note  
> **Never expose your API key in frontend code.** Call these APIs from your backend (server) only.

---

## Base URLs

### Sandbox

- Base URL: `https://sandbox.uddoktapay.com`
- API Key header value (sandbox key from your docs): `982d381360a69d419689740d9f2e26ce36fb7a50`

### Production

- Base URL: `{base_URL}` (example: `https://pay.your-domain.com`)
- Use your **production** API key (do not use sandbox key)

---

## Common Request Headers

Send these headers for all API calls:

- `RT-UDDOKTAPAY-API-KEY: <YOUR_API_KEY>` (required)
- `Content-Type: application/json`
- `Accept: application/json`

Example:

```http
RT-UDDOKTAPAY-API-KEY: 982d381360a69d419689740d9f2e26ce36fb7a50
Content-Type: application/json
Accept: application/json
```

---

## Payment Flow (Recommended)

1. Your backend calls **Create Charge** -> gets `payment_url`
2. Redirect the user to `payment_url`
3. After payment, UddoktaPay redirects to your `redirect_url` and sends an `invoice_id`
4. Your backend calls **Verify Payment** with that `invoice_id`
5. Only after successful verification, mark the order as **PAID** in your DB
6. (Optional) If needed, call **Refund Payment** using `transaction_id` from Verify response

---

## Understanding `return_type` (GET vs POST)

When payment is completed, UddoktaPay redirects to your `redirect_url` and sends `invoice_id`.

### If `return_type = "GET"`

`invoice_id` is sent as a **URL query param**:

Example redirect URL:

```
https://your-site.com/success?invoice_id=Bs6mm5YKVKHfpJDuT3En
```

You read it via:

- Express: `req.query.invoice_id`
- Next.js route handler: `new URL(req.url).searchParams.get("invoice_id")`

### If `return_type = "POST"`

`invoice_id` is sent in the **POST body** to your `redirect_url` endpoint.

You read it via:

- Express: `req.body.invoice_id` (ensure JSON or urlencoded parser)
- Next.js: `await req.json()` (or formData, depending on how it posts)

**Practical tip**

- If your success page is a frontend page (no backend handler) -> use **GET**
- If you have a backend endpoint to receive the redirect -> **POST** is fine

---

# 1) Create Charge (Checkout V2)

## Endpoint

**POST** `/api/checkout-v2`

Sandbox URL:

```
https://sandbox.uddoktapay.com/api/checkout-v2
```

## Body Params

| Field          | Type   | Required | Description                                             |
| -------------- | ------ | -------: | ------------------------------------------------------- |
| `full_name`    | string |      Yes | Customer full name                                      |
| `email`        | string |      Yes | Customer email                                          |
| `amount`       | string |      Yes | Amount as string (example `"500"`)                      |
| `metadata`     | json   |      Yes | Any custom data, example `{ "order_id": 322 }`          |
| `redirect_url` | string |      Yes | Success redirect URL (invoice_id will be sent here)     |
| `return_type`  | string |      Yes | `"GET"` or `"POST"`                                     |
| `cancel_url`   | string |      Yes | Cancel redirect URL                                     |
| `webhook_url`  | string |       No | Backend URL used when admin triggers webhook from panel |

Example body:

```json
{
  "full_name": "Khalid",
  "email": "bdentrkw@gmail.com",
  "amount": "500",
  "metadata": { "order_id": 322 },
  "redirect_url": "http://ex.com/success",
  "return_type": "GET",
  "cancel_url": "http://skillshikho.com/fail"
}
```

## Success Response (200)

```json
{
  "status": true,
  "message": "Payment Url",
  "payment_url": "https://sandbox.uddoktapay.com/payment/...."
}
```

## Common Failure Response

```json
{
  "status": false,
  "message": "Api Do Not Match"
}
```

This usually means:

- wrong API key
- sandbox key used on production base URL (or vice versa)
- header name typo or extra spaces in the key

## Node.js (Axios) Example

```js
import axios from 'axios';

const res = await axios.post(
  'https://sandbox.uddoktapay.com/api/checkout-v2',
  {
    full_name: 'Khalid',
    email: 'bdentrkw@gmail.com',
    amount: '500',
    metadata: { order_id: 322 },
    redirect_url: 'http://ex.com/success',
    return_type: 'GET',
    cancel_url: 'http://skillshikho.com/fail',
  },
  {
    headers: {
      'RT-UDDOKTAPAY-API-KEY': '982d381360a69d419689740d9f2e26ce36fb7a50',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }
);

console.log(res.data); // { status: true, payment_url: "..." }
```

## cURL Example

```bash
curl -X POST "https://sandbox.uddoktapay.com/api/checkout-v2"   -H "Accept: application/json"   -H "Content-Type: application/json"   -H "RT-UDDOKTAPAY-API-KEY: 982d381360a69d419689740d9f2e26ce36fb7a50"   -d '{
    "full_name": "Khalid",
    "email": "bdentrkw@gmail.com",
    "amount": "500",
    "metadata": { "order_id": 322 },
    "redirect_url": "http://ex.com/success",
    "return_type": "GET",
    "cancel_url": "http://skillshikho.com/fail"
  }'
```

---

# 2) Verify Payment

## Endpoint

**POST** `/api/verify-payment`

Sandbox URL:

```
https://sandbox.uddoktapay.com/api/verify-payment
```

## Body Params

| Field        | Type   | Required | Description                       |
| ------------ | ------ | -------: | --------------------------------- |
| `invoice_id` | string |      Yes | Invoice ID received after payment |

Example body:

```json
{
  "invoice_id": "Bs6mm5YKVKHfpJDuT3En"
}
```

## Success Response (200) - Example

```json
{
  "full_name": "Khalid",
  "email": "khalid@gmail.com",
  "amount": "50.00",
  "fee": "0.00",
  "charged_amount": "50.00",
  "invoice_id": "Bs6mm5YKVKHfpJDuT3En",
  "metadata": { "order_id": 323 },
  "payment_method": "bkash",
  "sender_number": "01771470882",
  "transaction_id": "LKGSJDKLGD",
  "date": "2025-12-30 14:24:49",
  "status": ""
}
```

### What to validate in your backend

Before marking an order as PAID, verify at least:

- the `invoice_id` matches
- the `amount` equals your order amount
- the `metadata.order_id` equals your order id
- (optional) `payment_method` and `transaction_id` exist

## Error Response (Common)

```json
{
  "status": "ERROR",
  "message": "No Data Found"
}
```

This usually means:

- wrong/unknown `invoice_id`
- payment not completed (or cancelled)
- verifying on the wrong environment (sandbox vs production)
- very quick verify right after redirect (rare); retry once after 2-3 seconds

## Node.js (Axios) Example

```js
import axios from 'axios';

const res = await axios.post(
  'https://sandbox.uddoktapay.com/api/verify-payment',
  { invoice_id: 'Bs6mm5YKVKHfpJDuT3En' },
  {
    headers: {
      'RT-UDDOKTAPAY-API-KEY': '982d381360a69d419689740d9f2e26ce36fb7a50',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }
);

console.log(res.data);
```

## cURL Example

```bash
curl -X POST "https://sandbox.uddoktapay.com/api/verify-payment"   -H "Accept: application/json"   -H "Content-Type: application/json"   -H "RT-UDDOKTAPAY-API-KEY: 982d381360a69d419689740d9f2e26ce36fb7a50"   -d '{ "invoice_id": "Bs6mm5YKVKHfpJDuT3En" }'
```

---

# 3) Refund Payment

## Endpoint

**POST** `/api/refund-payment`

Sandbox URL:

```
https://sandbox.uddoktapay.com/api/refund-payment
```

> Note: Do NOT call `/api/verify-payment` for refunds. Refund has its own endpoint: `/api/refund-payment`.

## Body Params

| Field            | Type   | Required | Description                                 |
| ---------------- | ------ | -------: | ------------------------------------------- |
| `transaction_id` | string |      Yes | Transaction ID from Verify Payment response |
| `payment_method` | string |      Yes | Payment method name (example: `"bkash"`)    |
| `amount`         | string |      Yes | Refund amount                               |
| `product_name`   | string |      Yes | Product name                                |
| `reason`         | string |      Yes | Refund reason                               |

Example body:

```json
{
  "transaction_id": "LKGSJDKLGD",
  "payment_method": "bkash",
  "amount": "10",
  "product_name": "new",
  "reason": "for test"
}
```

## Success Response (200)

```json
{
  "status": true,
  "message": "Refund Successful"
}
```

## Failure Response (Typical)

```json
{
  "status": false,
  "message": "..."
}
```

## Node.js (Axios) Example

```js
import axios from 'axios';

const res = await axios.post(
  'https://sandbox.uddoktapay.com/api/refund-payment',
  {
    transaction_id: 'LKGSJDKLGD',
    payment_method: 'bkash',
    amount: '10',
    product_name: 'new',
    reason: 'for test',
  },
  {
    headers: {
      'RT-UDDOKTAPAY-API-KEY': '982d381360a69d419689740d9f2e26ce36fb7a50',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }
);

console.log(res.data);
```

## cURL Example

```bash
curl -X POST "https://sandbox.uddoktapay.com/api/refund-payment"   -H "Accept: application/json"   -H "Content-Type: application/json"   -H "RT-UDDOKTAPAY-API-KEY: 982d381360a69d419689740d9f2e26ce36fb7a50"   -d '{
    "transaction_id": "LKGSJDKLGD",
    "payment_method": "bkash",
    "amount": "10",
    "product_name": "new",
    "reason": "for test"
  }'
```

---

## Optional: Backend Redirect Handlers (Examples)

### Express (GET return_type)

```js
app.get('/payment/success', async (req, res) => {
  const invoice_id = req.query.invoice_id;
  // call verify-payment here
  res.send({ invoice_id });
});
```

### Express (POST return_type)

```js
app.post('/payment/success', async (req, res) => {
  const invoice_id = req.body.invoice_id;
  // call verify-payment here
  res.send({ invoice_id });
});
```

### Minimal verify helper (server-side)

```js
import axios from 'axios';

export async function verifyUddoktaPayInvoice(invoice_id) {
  const res = await axios.post(
    'https://sandbox.uddoktapay.com/api/verify-payment',
    { invoice_id },
    {
      headers: {
        'RT-UDDOKTAPAY-API-KEY': process.env.UDDOKTAPAY_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );
  return res.data;
}
```

---

## Production Checklist

- Replace sandbox URL with your production `{base_URL}`
- Use production API key in server environment variables
- Always verify payment using `invoice_id`
- Always validate `amount` + `metadata.order_id` before marking paid
- Store `invoice_id` and `transaction_id` in your database for audit/refunds

---

## Quick Copy-Paste Environment Variables (Example)

```bash
UDDOKTAPAY_BASE_URL=https://sandbox.uddoktapay.com
UDDOKTAPAY_API_KEY=982d381360a69d419689740d9f2e26ce36fb7a50
```
