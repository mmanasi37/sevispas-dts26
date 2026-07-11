# API Response Specification

This document defines the requests and responses for endpoints.

## Base API Response Structure

```json
{
  "status": "string",
  "message": "string"
}
```

|     |     |
| --- | --- |
|     |     |

## Base URL

```http
BASE_URL http://base_api_url
```

## Health Status

This endpoint displays health status of LORA

```http
GET /health
```

### Request body

### Response

```json
{
  "status": "ok",
  "did": "did:web:yourdomain.com",
  "version": "1.x.x",
  "ecosystem": "staging"
}
```

**First Run**: On first startup, LORA generates a new DID and key pair. The generated DID is printed to logs and must be registered with DICT in Phase 4.

## Authentication

This endpoint allows LORA to authenticate to get a token for making subsequent calls

```http
POST /token
```

### Request body

```json
{ "username": "admin", "password": "****" }
```

### Successful response

```json
{ "token": "eyJhbGciOiJIUzUxMiJ9..." }
```

## Create

```http
POST /token
```

### Request body

```json
{ "username": "admin", "password": "****" }
```

### Successful response

```json
{
  "status": "success",
  "message": "Customer auth request successfully processed",
  "transactionId": "1236399777"
}
```
