# Lumento Tarot API 鉴权文档

本文档列出了 Lumento Tarot 的 API 接口使用方法，包括公开的身份验证接口和需要 `Authorization` Token 的私有接口。

## 鉴权方式 (私有接口)

对于所有私有接口，请使用以下方式进行鉴权：

1.  **Authorization Header (推荐)**:
    在请求头中加入 `Authorization: Bearer <your_token>`。
2.  **Cookie**:
    在请求中携带名为 `session` 的 Cookie。

---

## 0. 身份验证 (公开接口)

这些接口不需要 Token，用于获取 Token 或管理账户。

### 发送邮箱验证码
向用户邮箱发送一个 6 位数字验证码，用于注册。

- **URL**: `/api/auth/send-code`
- **Method**: `POST`
- **Request Body**:
  - `email`: `string` (用户邮箱)

**cURL 示例**:
```bash
curl -X POST https://www.lumento.cloud/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### 注册新用户
使用邮箱、密码和验证码注册账户。

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Request Body**:
  - `email`: `string`
  - `password`: `string`
  - `code`: `string` (收到的 6 位验证码)
  - `inviteCode`: `string` (可选，邀请码)

**cURL 示例**:
```bash
curl -X POST https://www.lumento.cloud/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your_secure_password",
    "code": "123456",
    "inviteCode": "ABCDEF"
  }'
```

### 登录
使用邮箱和密码登录，获取 `token`。

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Request Body**:
  - `email`: `string`
  - `password`: `string`

**cURL 示例**:
```bash
curl -X POST https://www.lumento.cloud/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your_secure_password"
  }'
```
**响应示例**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "creditBalance": 10,
    ...
  }
}
```

---

## 1. 用户与账户 (私有)

### 获取当前用户信息
获取已登录用户的个人资料、余额及计划信息。

- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Authentication**: Required

**cURL 示例**:
```bash
curl -X GET https://www.lumento.cloud/api/auth/me \
  -H "Authorization: Bearer <your_token>"
```

---

## 2. 塔罗对话 (私有)

### 发起对话/获取 AI 解读
开始一个新的塔罗占卜会话或在现有会话中继续对话。**注意：开启新会话将扣除 1 个额度。**

- **URL**: `/api/chat`
- **Method**: `POST`
- **Authentication**: Required
- **Request Body**:
  - `sessionId`: `string` (由客户端生成的 UUID 或唯一 ID)
  - `messages`: `Array<{role: "user" | "assistant", content: string}>`
  - `context`: (开启新会话时必填)
    - `spread`: `{id: string}`
    - `cards`: `Array<{card: {id: string}, positionId: string, isReversed: boolean}>`
    - `question`: `string`

**cURL 示例**:
```bash
curl -X POST https://www.lumento.cloud/api/chat \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "unique-session-id-123",
    "messages": [{"role": "user", "content": "我的事业运势如何？"}],
    "context": {
      "spread": {"id": "three-cards"},
      "cards": [
        {"card": {"id": "the-magician"}, "positionId": "1", "isReversed": false},
        {"card": {"id": "the-tower"}, "positionId": "2", "isReversed": true},
        {"card": {"id": "the-star"}, "positionId": "3", "isReversed": false}
      ],
      "question": "我的事业运势如何？"
    }
  }'
```

---

## 3. 历史记录 (私有)

### 获取所有会话列表
- **URL**: `/api/sessions`
- **Method**: `GET`
- **Authentication**: Required

**cURL 示例**:
```bash
curl -X GET https://www.lumento.cloud/api/sessions \
  -H "Authorization: Bearer <your_token>"
```

---

## 4. 充值与支付 (私有)

### 兑换激活码
- **URL**: `/api/redeem`
- **Method**: `POST`
- **Request Body**: `{"code": "string"}`

**cURL 示例**:
```bash
curl -X POST https://www.lumento.cloud/api/redeem \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"code": "GIFT-123"}'
```
