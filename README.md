<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

# URL Shortener - gRPC + Microservices - Learning Project

## 📋 Tổng quan

Đây là một dự án mini URL Shortener được xây dựng để tôi tự học về **gRPC** và **Microservices Architecture**. Project sử dụng NestJS, PostgreSQL, và Protocol Buffers để tạo ra một hệ thống rút gọn URL hiệu quả.

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐    gRPC     ┌───────────────────┐    Prisma   ┌─────────────┐
│   API Gateway   │ ──────────> │ Shortener Service │ ──────────> │ PostgreSQL  │
│   (Port 3000)   │   Proto     │   (Port 50051)    │             │ (Port 5432) │
│   HTTP REST     │             │   gRPC Server     │             │  Database   │
└─────────────────┘             └───────────-───────┘             └─────────────┘
```

### Thành phần hệ thống:

1. **API Gateway**: HTTP REST API server (NestJS)
2. **Shortener Service**: gRPC microservice (NestJS) 
3. **Database**: PostgreSQL với Prisma ORM
4. **Proto Contract**: Protocol Buffers definitions

## 📁 Cấu trúc thư mục

```
url-shortener/
├── 📄 docker-compose.yml           # PostgreSQL container
├── 📄 README.md                    # Documentation
├── 📁 proto/                       # gRPC Protocol Definitions
│   └── shortener.proto
├── 📁 api-gateway/                 # HTTP REST API Gateway
│   ├── src/
│   │   ├── app.controller.ts       # REST endpoints
│   │   ├── app.module.ts           # gRPC client config
│   │   ├── main.ts                 # HTTP server bootstrap
│   │   ├── url.dto.ts              # Request validation
│   │   └── interface/
│   │       └── gRPC.interface.ts   # gRPC client types
│   └── package.json
└── 📁 shortener-service/           # gRPC Microservice
    ├── src/
    │   ├── shortener.controller.ts # gRPC methods
    │   ├── shortener.service.ts    # Business logic
    │   ├── app.module.ts           # DI container
    │   ├── main.ts                 # gRPC server bootstrap
    │   └── shared/
    │       ├── services/
    │       │   └── prisma.service.ts
    │       └── interface/
    │           └── proto.interface.ts
    ├── prisma/
    │   └── schema.prisma           # Database schema
    ├── .env                        # Database connection
    └── package.json
```

## 🚀 Data Flow & Workflow

### 1. Tạo Short URL
```
Client Request → API Gateway → Shortener Service → Database
      ↓              ↓              ↓              ↓
POST /urls      gRPC Call      Generate ID    Store URL
{url: "..."}    CreateShortUrl   nanoid(8)     Prisma Create
      ↑              ↑              ↑              ↑
JSON Response ← HTTP Response ← gRPC Response ← Success
{short_url,     {shortCode,     {shortCode,
 short_code,     shortUrl}       shortUrl}
 original_url}
```

### 2. Redirect Short URL
```
Client Request → API Gateway → Shortener Service → Database
      ↓              ↓              ↓              ↓
GET /:code      gRPC Call      Lookup URL     Find by code
              GetOriginalUrl                 Prisma findUnique
      ↑              ↑              ↑              ↑
301 Redirect ← HTTP Redirect ← gRPC Response ← Original URL
to original    res.redirect()  {originalUrl}   return url.originalUrl
```

## 🔧 Cách hoạt động của Short URL

### 1. Algorithm tạo Short Code
```typescript
import { nanoid } from 'nanoid';

const shortCode = nanoid(8); // Generates: "V1StGXR8"
```

- **nanoid**: Tạo ID ngẫu nhiên, URL-safe
- **8 characters**: ~2.8 tỷ combinations (62^8)
- **Collision-resistant**: Rất ít khả năng trùng lặp

### 2. Database Schema
```sql
CREATE TABLE urls (
  id           SERIAL PRIMARY KEY,
  original_url VARCHAR NOT NULL,
  short_code   VARCHAR UNIQUE NOT NULL,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_short_code ON urls(short_code);
```

### 3. URL Mapping Process
```
Original: "https://github.com/nestjs/nest"
    ↓
Generate: shortCode = "aB3fGh8k"
    ↓
Store: {originalUrl, shortCode} in database
    ↓
Return: "http://localhost:3000/aB3fGh8k"
```

## 📡 gRPC Communication

### Protocol Buffers Definition
```protobuf
// shortener.proto
syntax = "proto3";
package shortener;

service ShortenerService {
  rpc CreateShortUrl(CreateShortUrlRequest) returns (CreateShortUrlResponse);
  rpc GetOriginalUrl(GetOriginalUrlRequest) returns (GetOriginalUrlResponse);
}

message CreateShortUrlRequest {
  string originalUrl = 1;
}

message CreateShortUrlResponse {
  string shortCode = 1;
  string shortUrl = 2;
}
```

### gRPC vs HTTP REST
| Aspect | gRPC | HTTP REST |
|--------|------|-----------|
| **Protocol** | HTTP/2 | HTTP/1.1 |
| **Format** | Binary (Protocol Buffers) | JSON |
| **Performance** | ⚡ Faster | 🐌 Slower |
| **Type Safety** | ✅ Strong typing | ❌ Runtime validation |
| **Browser Support** | ❌ Limited | ✅ Universal |
| **Streaming** | ✅ Bidirectional | ❌ Limited |

## 🎯 Những gì tôi học được

### 1. **Microservices Architecture**
- **Service Separation**: Tách biệt business logic và API layer
- **Independent Deployment**: Mỗi service có thể deploy riêng biệt
- **Technology Diversity**: Có thể dùng ngôn ngữ khác cho từng service
- **Fault Isolation**: Lỗi ở một service không ảnh hưởng service khác

### 2. **gRPC Fundamentals**
- **Protocol Buffers**: Schema-first development
- **Type Safety**: Compile-time checking
- **Code Generation**: Auto-generate client/server code
- **Performance**: Binary serialization, HTTP/2 multiplexing

### 3. **NestJS gRPC Integration**
- **@GrpcMethod**: Decorator để define gRPC endpoints
- **ClientGrpc**: gRPC client injection
- **RpcException**: gRPC error handling
- **Microservice Bootstrap**: createMicroservice() for gRPC server

### 4. **Database Design Patterns**
- **Prisma ORM**: Type-safe database access
- **Schema Migration**: Version control for database
- **Connection Pooling**: Efficient database connections
- **Indexing Strategy**: Optimize lookup performance

### 5. **Error Handling & Validation**
- **gRPC Status Codes**: Standardized error codes
- **DTO Validation**: class-validator for input validation
- **Exception Propagation**: Error handling across services
- **Graceful Degradation**: Handle service unavailability

## 🚀 Cách chạy project

### 1. Prerequisites
```bash
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (via Docker)
```

### 2. Setup Database
```bash
# Start PostgreSQL
docker-compose up -d postgres

# Setup Prisma
cd shortener-service
npm install
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Start Services
```bash
# Terminal 1: Shortener Service (gRPC Server)
cd shortener-service
npm run start:dev

# Terminal 2: API Gateway (HTTP Server)
cd api-gateway
npm run start:dev
```

### 4. Test APIs
```bash
# Create short URL
curl -X POST http://localhost:3000/urls \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com/nestjs/nest"}'

# Response:
# {
#   "short_code": "aB3fGh8k",
#   "short_url": "http://localhost:3000/aB3fGh8k",
#   "original_url": "https://github.com/nestjs/nest"
# }

# Redirect
curl -I http://localhost:3000/aB3fGh8k
# HTTP/1.1 301 Moved Permanently
# Location: https://github.com/nestjs/nest
```

## 📊 Performance Benefits

### gRPC vs REST Performance
```
Request Size:     gRPC: ~50 bytes  |  REST: ~200 bytes
Response Size:    gRPC: ~30 bytes  |  REST: ~150 bytes
Serialization:    gRPC: 2-10x faster than JSON
Network Overhead: gRPC: ~30% less than HTTP/1.1
```

### Database Optimization
```sql
-- Short code lookup (indexed)
EXPLAIN SELECT original_url FROM urls WHERE short_code = 'aB3fGh8k';
-- Index Scan: ~0.1ms

-- Without index (full table scan)
-- Seq Scan: ~10-100ms depending on table size
```

## 🔄 Scalability Considerations

### Horizontal Scaling
```
Load Balancer
      ↓
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ API Gateway │  │ API Gateway │  │ API Gateway │
│ Instance 1  │  │ Instance 2  │  │ Instance 3  │
└─────────────┘  └─────────────┘  └─────────────┘
      ↓                ↓                ↓
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Shortener   │  │ Shortener   │  │ Shortener   │
│ Service 1   │  │ Service 2   │  │ Service 3   │
└─────────────┘  └─────────────┘  └─────────────┘
      ↓                ↓                ↓
        Database Cluster (Read Replicas)
```


## 🎓 Kết luận

Project này giúp hiểu sâu về:
- **Microservices communication** với gRPC
- **Protocol Buffers** cho type-safe APIs
- **Service-oriented architecture** design
- **Database optimization** cho read-heavy workloads
- **Error handling** trong distributed systems

Đây có thể sẽ là foundation cơ bản để tôi để xây dựng các hệ thống microservices phức tạp hơn trong tương lai! 🚀

---

**Tech Stack**: NestJS, gRPC, Protocol Buffers, PostgreSQL, Prisma, Docker, TypeScript

## 📝 API Documentation

### Create Short URL
```http
POST /urls
Content-Type: application/json

{
  "url": "https://example.com/very/long/url"
}
```

**Response:**
```json
{
  "short_code": "aB3fGh8k",
  "short_url": "http://localhost:3000/aB3fGh8k", 
  "original_url": "https://example.com/very/long/url"
}
```

### Redirect to Original URL
```http
GET /:shortCode
```

**Response:**
```http
HTTP/1.1 301 Moved Permanently
Location: https://example.com/very/long/url
```

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "service": "API Gateway", 
  "timestamp": "2025-06-08T13:00:00.000Z"
}
```

## 🐛 Troubleshooting

### Common Issues

#### 1. gRPC Connection Failed
```
Error: 14 UNAVAILABLE: No connection established
```
**Solution:** Đảm bảo Shortener Service đang chạy trên port 50051

#### 2. Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:** Start PostgreSQL container với `docker-compose up -d`

#### 3. Prisma Client Error
```
Error: Prisma schema file not found
```
**Solution:** Chạy `npx prisma generate` trong thư mục shortener-service

#### 4. Validation Error
```
Error: url must be a valid URL
```
**Solution:** Đảm bảo URL bắt đầu với `http://` hoặc `https://`

## 📚 Learning Resources

### gRPC & Protocol Buffers
- [gRPC Official Documentation](https://grpc.io/docs/)
- [Protocol Buffers Guide](https://developers.google.com/protocol-buffers)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)

### Microservices Architecture
- [Microservices Patterns](https://microservices.io/patterns/)
- [Building Microservices](https://samnewman.io/books/building_microservices/)
- [NestJS Advanced Guide](https://docs.nestjs.com/fundamentals/custom-providers)

### Database Design
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Performance](https://www.postgresql.org/docs/current/performance-tips.html)
- [Database Indexing Strategies](https://use-the-index-luke.com/)
