# Gospel Reach TTS 语音播放器设置指南

## 🎯 概述

本指南将帮助你为Gospel Reach项目设置完整的TTS（文本转语音）功能，包括：
- 使用Coqui TTS批量生成5,500条经文的男女声音频
- 将音频文件上传到Cloudflare R2存储
- 在前端集成美观的音频播放器

## 📋 前置要求

### 系统要求
- Python 3.9-3.11
- CUDA GPU（推荐，用于加速TTS生成）
- 至少16GB RAM
- 500GB可用存储空间

### 账户要求
- Cloudflare账户（用于R2存储）
- GitHub账户（用于代码管理）

## 🔧 第一步：环境搭建

### 1. 安装Python依赖

```bash
# 创建虚拟环境
python -m venv tts_env
source tts_env/bin/activate  # Linux/Mac
# 或
tts_env\Scripts\activate     # Windows

# 安装依赖
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install TTS==0.22.0
pip install boto3 tqdm pathlib argparse
```

### 2. 准备语音样本

创建 `voice_samples` 目录并准备男女声样本：

```
voice_samples/
├── male_en.wav    # 英语男声样本（10-30秒）
├── female_en.wav  # 英语女声样本
├── male_de.wav    # 德语男声样本
├── female_de.wav  # 德语女声样本
├── male_es.wav    # 西班牙语男声样本
├── female_es.wav  # 西班牙语女声样本
├── male_fr.wav    # 法语男声样本
├── female_fr.wav  # 法语女声样本
├── male_it.wav    # 意大利语男声样本
└── female_it.wav  # 意大利语女声样本
```

**语音样本要求：**
- 格式：WAV，16kHz，单声道
- 时长：10-30秒
- 内容：清晰的朗读，最好是圣经内容
- 质量：无背景噪音，发音标准

## 🎵 第二步：生成TTS音频

### 1. 运行TTS生成脚本

```bash
# 基本用法
python scripts/generate_tts_audio.py

# 自定义参数
python scripts/generate_tts_audio.py \
  --data-dir src/data/bible_verses \
  --output-dir tts_audio \
  --voice-samples-dir voice_samples
```

### 2. 预期结果

生成完成后，你将得到：
- **11,000个音频文件**（5,500条经文 × 2种性别）
- **总大小约550MB**（每个文件约50KB）
- **生成报告**：`tts_audio/generation_report.json`

### 3. 文件命名规则

```
{language}_{version}_{verse_id}_{gender}_{hash}.wav

示例：
en_esv_1_male_a1b2c3d4e5f6.wav
de_luth2017_1_female_f6e5d4c3b2a1.wav
```

## ☁️ 第三步：上传到Cloudflare R2

### 1. 设置Cloudflare R2

1. 登录Cloudflare Dashboard
2. 创建R2存储桶：`gospel-reach-tts`
3. 获取API凭证：
   - Account ID
   - Access Key ID  
   - Secret Access Key

### 2. 运行上传脚本

```bash
python scripts/upload_to_r2.py \
  --audio-dir tts_audio \
  --account-id YOUR_ACCOUNT_ID \
  --access-key-id YOUR_ACCESS_KEY_ID \
  --secret-access-key YOUR_SECRET_ACCESS_KEY \
  --bucket-name gospel-reach-tts \
  --manifest-output public/tts-manifest.json
```

### 3. 配置公共访问

在Cloudflare R2控制台中：
1. 启用公共访问
2. 设置自定义域名（可选）
3. 配置CORS策略

## 🎨 第四步：前端集成

### 1. 音频播放器功能

新的AudioPlayer组件提供：
- ✅ 播放/暂停控制
- ✅ 男女声切换
- ✅ 进度条和时间显示
- ✅ 音量控制
- ✅ 美观的UI设计
- ✅ 错误处理和加载状态

### 2. 使用方式

播放器已自动集成到BibleVerse组件中，用户可以：
1. 点击播放按钮听经文朗读
2. 切换男声/女声
3. 拖拽进度条跳转
4. 控制音量

## 📊 成本估算

### Cloudflare R2存储成本

| 项目 | 用量 | 费用 |
|------|------|------|
| 存储空间 | 550MB | $0.015/GB/月 ≈ $0.008/月 |
| 请求数 | 1000次/天 | $0.36/百万次 ≈ $0.01/月 |
| 数据传输 | 10GB/月 | 免费（前10GB） |
| **总计** | | **约$0.02/月** |

### TTS生成成本

- **一次性成本**：电力和计算资源
- **时间成本**：约4-8小时（取决于GPU性能）
- **存储成本**：本地存储550MB

## 🔍 故障排除

### 常见问题

**1. CUDA内存不足**
```bash
# 解决方案：减少批处理大小
export CUDA_VISIBLE_DEVICES=0
```

**2. 语音样本质量差**
- 确保音频清晰无噪音
- 使用标准发音
- 检查采样率和格式

**3. R2上传失败**
- 检查API凭证
- 确认网络连接
- 验证存储桶权限

**4. 前端播放失败**
- 检查CORS配置
- 验证音频URL
- 查看浏览器控制台错误

### 调试命令

```bash
# 检查TTS模型
python -c "from TTS.api import TTS; print(TTS().list_models())"

# 测试单个音频生成
python -c "
from TTS.api import TTS
tts = TTS('tts_models/multilingual/multi-dataset/xtts_v2')
tts.tts_to_file('Hello world', speaker_wav='voice_samples/male_en.wav', language='en', file_path='test.wav')
"

# 验证R2连接
aws s3 ls s3://gospel-reach-tts --endpoint-url=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
```

## 🚀 部署清单

### 生产部署前检查

- [ ] 所有11,000个音频文件已生成
- [ ] 音频文件已上传到R2
- [ ] TTS清单文件已生成
- [ ] 前端播放器功能正常
- [ ] CORS配置正确
- [ ] 音频质量满意
- [ ] 加载速度可接受
- [ ] 移动端兼容性测试
- [ ] 多语言测试完成

### 性能优化建议

1. **启用CDN缓存**：设置长期缓存头
2. **音频压缩**：考虑使用MP3格式减小文件大小
3. **预加载策略**：实现智能预加载
4. **错误重试**：添加自动重试机制

## 📈 监控和维护

### 监控指标

- R2存储使用量
- 音频播放成功率
- 加载时间
- 用户使用频率

### 定期维护

- 检查音频文件完整性
- 更新TTS模型（如有新版本）
- 优化存储成本
- 收集用户反馈

---

## 🎉 完成！

按照以上步骤，你将拥有一个完整的多语言TTS系统，为Gospel Reach项目提供高质量的经文朗读功能。这将大大提升用户体验，让神的话语以更生动的方式传达给世界各地的人们。

如有问题，请查看故障排除部分或联系技术支持。 