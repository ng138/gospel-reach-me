# Cloudflare R2 存储配置指南

## 🎯 目标
将背景图片从Unsplash CDN迁移到Cloudflare R2存储，提供更快的加载速度和更好的控制。

## 🏗 当前Cloudflare存储方案

### 1. **Cloudflare Pages** (前端托管)
- 静态文件托管
- 自动构建和部署
- 全球CDN分发

### 2. **Cloudflare KV** (键值存储)
- 用于存储配置数据
- 圣经经文数据缓存
- 用户统计数据

### 3. **Cloudflare R2** (对象存储)
- 媒体文件存储（推荐）
- 背景图片存储
- 兼容S3 API

## 🚀 R2设置步骤

### 步骤1: 创建R2存储桶
```bash
# 安装/更新wrangler
npm install -g wrangler@latest

# 登录Cloudflare
wrangler login

# 创建R2存储桶
wrangler r2 bucket create gospel-reach-media
```

### 步骤2: 配置Worker访问R2
更新 `worker/wrangler.toml`:
```toml
name = "gospel-reach-me-worker"
compatibility_date = "2024-01-15"

[[r2_buckets]]
binding = "MEDIA_BUCKET"
bucket_name = "gospel-reach-media"
```

### 步骤3: 创建媒体代理Worker
创建 `worker/src/media-proxy.ts`:
```typescript
export interface Env {
  MEDIA_BUCKET: R2Bucket;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const objectName = url.pathname.slice(1); // 移除开头的 '/'
    
    if (request.method === 'GET') {
      const object = await env.MEDIA_BUCKET.get(objectName);
      
      if (!object) {
        return new Response('Not found', { status: 404 });
      }
      
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('Cache-Control', 'public, max-age=31536000'); // 1年缓存
      headers.set('Access-Control-Allow-Origin', '*');
      
      return new Response(object.body, { headers });
    }
    
    return new Response('Method not allowed', { status: 405 });
  },
};
```

### 步骤4: 上传背景图片
创建上传脚本 `scripts/upload-backgrounds.js`:
```javascript
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// 配置Cloudflare R2（使用S3兼容API）
const s3 = new AWS.S3({
  endpoint: 'https://你的账户ID.r2.cloudflarestorage.com',
  accessKeyId: '你的R2访问密钥',
  secretAccessKey: '你的R2密钥',
  region: 'auto',
  signatureVersion: 'v4',
});

const backgrounds = [
  {
    file: 'mountain-sunrise-01.jpg',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center'
  },
  // ... 其他图片
];

async function uploadBackground(filename, sourceUrl) {
  try {
    // 下载图片
    const response = await fetch(sourceUrl);
    const buffer = await response.arrayBuffer();
    
    // 上传到R2
    await s3.upload({
      Bucket: 'gospel-reach-media',
      Key: `backgrounds/${filename}`,
      Body: buffer,
      ContentType: 'image/jpeg',
      CacheControl: 'public, max-age=31536000'
    }).promise();
    
    console.log(`✅ 上传成功: ${filename}`);
  } catch (error) {
    console.error(`❌ 上传失败 ${filename}:`, error);
  }
}

// 批量上传
async function uploadAllBackgrounds() {
  for (const bg of backgrounds) {
    await uploadBackground(bg.file, bg.url);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 避免请求过快
  }
}

uploadAllBackgrounds();
```

## 📋 配置自定义域名

### 选项1: Worker Routes
在Cloudflare Dashboard中添加Worker路由：
- 路由: `gospel-reach-media.你的域名.com/*`
- Worker: `gospel-reach-me-worker`

### 选项2: R2自定义域名
1. 在R2存储桶设置中添加自定义域名
2. 配置DNS记录指向R2

## 🎨 新的背景图片配置

更新后的 `background_media_index.json` 使用R2 URLs:
```json
[
  {
    "type": "image",
    "url": "https://gospel-reach-media.你的域名.com/backgrounds/mountain-sunrise-01.jpg",
    "description": "Mountain sunrise landscape"
  }
]
```

## ⚡ 性能优势

### 使用Cloudflare R2的好处:
1. **更快加载**: 图片通过Cloudflare全球CDN分发
2. **更好缓存**: 自定义缓存策略，1年过期时间
3. **更低成本**: R2比其他云存储更便宜
4. **更高可控性**: 完全控制图片质量和格式
5. **更好压缩**: 可以预处理图片，优化文件大小

### 性能指标预期:
- 首次加载时间: 减少30-50%
- 缓存命中率: 95%+
- CDN覆盖: 200+个城市
- 带宽成本: 显著降低

## 🔄 迁移步骤

1. **创建R2存储桶和Worker**
2. **下载并上传25张高质量背景图片**
3. **更新配置文件**
4. **测试新的图片加载**
5. **监控性能改进**

## 📝 维护

### 添加新背景图片:
```bash
# 上传新图片
wrangler r2 object put gospel-reach-media/backgrounds/new-image.jpg --file ./new-image.jpg

# 更新配置文件
# 提交并推送到GitHub
```

### 监控存储使用:
```bash
# 查看存储桶统计
wrangler r2 bucket list
```

这个配置将为Gospel Reach Me提供最佳的图片加载性能！🚀 