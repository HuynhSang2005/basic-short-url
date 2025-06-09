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

Đây là một dự án mini project URL Shortener (giống như bit.ly) giúp rút gọn link, được xây dựng để tôi tự học về **gRPC** và **Microservices Architecture**. Project sử dụng **NestJS**, **PostgreSQL**, và **Protocol Buffers** để tạo ra một hệ thống rút gọn URL hiệu quả.

> **Bạn là người mới giống tôi và muốn học về gRPC, microservice cùng với NestJS?**  
> Đừng lo! README này sẽ giải thích rõ các khái niệm như microservice, gRPC, NestJS và cách chúng kết hợp với nhau.

### 💡 Microservices, gRPC, và NestJS là gì?

- **Microservices:**  
  Là cách chia ứng dụng lớn thành các “service nhỏ”, mỗi service sẽ đảm nhiệm một chức năng riêng biệt. Mỗi service có thể phát triển, triển khai và có khả năng mở rộng độc lập tốt.
- **gRPC:**  
  Là giao thức giao tiếp giữa các service, nhanh hơn REST nhờ sử dụng HTTP/2 và Protocol Buffers (là binary nên nhẹ và nhanh).
- **NestJS:**  
  Một framework cho Node.js, giúp xây dựng các ứng dụng server-side hiện đại, hỗ trợ tốt cho microservices và gRPC.
---
## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐    gRPC     ┌──────────────────┐    Prisma   ┌─────────────┐
│   API Gateway   │ ──────────> │ Shortener Service│ ──────────> │ PostgreSQL  │
│   (Port 3000)   │   Proto     │   (Port 50051)   │             │ (Port 5432) │
│   HTTP REST     │             │   gRPC Server    │             │  Database   │
└─────────────────┘             └──────────────────┘             └─────────────┘
```

### Thành phần hệ thống:

1. **API Gateway:** Nhận request HTTP từ client, chuyển tiếp qua gRPC.
2. **Shortener Service:** Xử lý logic rút gọn URL, giao tiếp với database.
3. **Database(PostgreSQL với Prisma ORM)**: Lưu trữ data URL.
4. **Proto Contract:** Định nghĩa giao tiếp giữa các service bằng Protocol Buffers.

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
1. Client gửi request POST `/urls` với URL gốc.
2. API Gateway nhận, gửi gRPC đến Shortener Service.
3. Shortener Service tạo mã rút gọn (short code) bằng thư viện `nanoid`.
4. Lưu thông tin vào database.
5. Trả về short URL cho client.

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

1. Client truy cập `/aB3fGh8k`.
2. API Gateway gửi gRPC đến Shortener Service để lấy URL gốc.
3. Shortener Service truy vấn database, trả về URL gốc.
4. API Gateway chuyển hướng (redirect) client đến URL gốc.

## 🔧 Cách hoạt động của Short URL

### 1. Algorithm tạo Short Code
```typescript
import { nanoid } from 'nanoid';

const shortCode = nanoid(8); // Generates: "V1StGXR8"
```

- **nanoid**: Tạo ID ngẫu nhiên, URL-safe và tôi sử dụng version 3.3.11 vì nó ổn định hơn so với version 5 hiện tại.
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

## 🎯 Những gì tôi học được và kinh nghiệm rút ra

### 1. Tại sao tôi dùng gRPC thay vì REST?

| Tiêu chí         | gRPC (Protocol Buffers) | REST (JSON)         |
|------------------|------------------------|---------------------|
| Tốc độ           | ⚡ Rất nhanh            | 🐢 Chậm hơn          |
| Định dạng        | Binary (rất nhẹ)     | Plain-text (JSON)      |
| Kiểm tra kiểu    | Có, tự động sinh code  | Không, phải tự validate |
| Hỗ trợ streaming | Có đến 4 loại và native                    | Hạn chế|
| Hỗ trợ trình duyệt| Chưa tốt lắm              | Rất tốt             |

### 2. Microservices Architecture

- **Service Separation:**  
  Phân tách rõ ràng giữa business logic (xử lý nghiệp vụ) và API layer (lớp giao tiếp với client). Điều này giúp codebase gọn gàng, dễ bảo trì, dễ mở rộng.
- **Independent Deployment:**  
  Mỗi service là một ứng dụng độc lập, có thể build, deploy, scale riêng mà không phụ thuộc các service khác.
- **Technology Diversity:**  
  Các service có thể sử dụng ngôn ngữ lập trình, framework, công nghệ khác nhau miễn là tuân thủ chuẩn giao tiếp (ví dụ: gRPC).
- **Fault Isolation:**  
  Nếu một service gặp lỗi (crash, downtime), các service còn lại vẫn hoạt động bình thường, giúp tăng độ ổn định toàn hệ thống.

### 3. gRPC Fundamentals

- **Protocol Buffers (Protobuf):**  
  Phát triển theo hướng schema-first (định nghĩa cấu trúc dữ liệu trước), giúp đồng bộ và sinh code tự động cho cả client và server.
- **Type Safety:**  
  Kiểm tra kiểu dữ liệu ngay khi biên dịch (compile-time checking), giảm lỗi runtime.
- **Code Generation:**  
  Tự động sinh mã nguồn cho client/server từ file .proto, tiết kiệm thời gian, tránh sai sót khi viết tay.
- **Performance:**  
  Dữ liệu truyền ở dạng nhị phân (binary serialization), kết hợp HTTP/2 multiplexing nên tốc độ rất nhanh, tiết kiệm băng thông.

### 4. NestJS gRPC Integration

- **@GrpcMethod:**  
  Decorator trong NestJS để định nghĩa các gRPC endpoint (method) giống như REST controller.
- **ClientGrpc:**  
  Cơ chế inject gRPC client vào service để gọi sang service khác qua gRPC.
- **RpcException:**  
  Công cụ chuẩn để xử lý và trả về lỗi gRPC theo đúng format, dễ debug và bắt lỗi phía client.
- **Microservice Bootstrap:**  
  Sử dụng hàm `createMicroservice()` để khởi tạo gRPC server trong NestJS, giúp tách biệt với HTTP server.

### 5. Database Design Patterns

- **Prisma ORM:**  
  Truy cập database an toàn kiểu dữ liệu (type-safe), tự động generate type cho TypeScript, dễ dùng và hiện đại.
- **Schema Migration:**  
  Quản lý version cho schema database, hỗ trợ migrate (nâng cấp/cập nhật) cấu trúc bảng dễ dàng.
- **Connection Pooling:**  
  Tối ưu hiệu suất bằng cách tái sử dụng (reuse) các kết nối database, giảm chi phí khi tạo mới một connect.
- **Indexing Strategy:**  
  Định nghĩa các chỉ mục (index) hợp lý để tối ưu tốc độ truy vấn, đặc biệt với các field dùng để tìm kiếm như short_code.

### 6. Error Handling & Validation

- **gRPC Status Codes:**  
  Chuẩn hóa mã lỗi trả về giữa các service (ví dụ: NOT_FOUND, UNAVAILABLE, INVALID_ARGUMENT...), dễ xử lý ở cả hai phía.
- **DTO Validation:**  
  Sử dụng class-validator để kiểm tra dữ liệu đầu vào (input validation), đảm bảo chỉ nhận dữ liệu hợp lệ.
- **Exception Propagation:**  
  Truyền và xử lý exception giữa các service, giúp trace error đầy đủ, dễ debug trong môi trường phân tán.
- **Graceful Degradation:**  
  Thiết kế hệ thống để có thể “chấp nhận lỗi” (ví dụ: một service tạm thời không khả dụng, hệ thống vẫn trả về thông báo phù hợp thay vì crash toàn bộ).


## 🚀 Cách run project

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
Serialization:    gRPC: 2-10x nhanh hơn JSON
Network Overhead: gRPC(HTTP/2): ít hơn ~30% so với HTTP/1.1
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
**Solution:** Đảm bảo URL bắt đầu với `http://` hoặc `https://` (Do DTO tôi validate khá strict)

## 📚 Learning Resources
### **Tech Stack tôi sử dụng**: NestJS, gRPC, Protocol Buffers, PostgreSQL, Prisma, Docker và TypeScript

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

## 🎓 Kết luận

Project này có thể giúp tôi hiểu hơn về:
- **Microservices communication** với gRPC
- **Protocol Buffers** cho type-safe APIs
- **Service-oriented architecture** để design
- **Database optimization** cho read-heavy workloads
- **Error handling** trong distributed systems

> **Feeling của tôi sau khi hoàn thành mini project này:**  
> Đây có thể sẽ là foundation cơ bản để tôi để xây dựng các system microservices phức tạp hơn trong tương lai.
>
> Bạn hoàn toàn có thể sử dụng project này để phục vụ cho mục đích nộp bài về môn Lập trình mạng ở UTH. Và nếu muốn cùng phát triển và mở rộng project này thì có thể liên hệ tôi.
