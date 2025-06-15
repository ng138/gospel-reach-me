#!/usr/bin/env python3
"""
Cloudflare R2 Upload Script for Gospel Reach TTS Audio
将生成的TTS音频文件上传到Cloudflare R2存储
"""

import os
import json
import boto3
from pathlib import Path
import argparse
from tqdm import tqdm
from botocore.exceptions import ClientError

class R2Uploader:
    def __init__(self, account_id, access_key_id, secret_access_key, bucket_name):
        """初始化R2客户端"""
        self.bucket_name = bucket_name
        
        # 配置R2客户端
        self.s3_client = boto3.client(
            's3',
            endpoint_url=f'https://{account_id}.r2.cloudflarestorage.com',
            aws_access_key_id=access_key_id,
            aws_secret_access_key=secret_access_key,
            region_name='auto'
        )
        
        print(f"✅ R2 client initialized for bucket: {bucket_name}")

    def upload_file(self, local_path, r2_key):
        """上传单个文件到R2"""
        try:
            # 检查文件是否已存在
            try:
                self.s3_client.head_object(Bucket=self.bucket_name, Key=r2_key)
                return f"https://pub-{self.bucket_name}.r2.dev/{r2_key}"  # 文件已存在
            except ClientError:
                pass  # 文件不存在，继续上传
            
            # 上传文件
            self.s3_client.upload_file(
                local_path, 
                self.bucket_name, 
                r2_key,
                ExtraArgs={
                    'ContentType': 'audio/wav',
                    'CacheControl': 'public, max-age=31536000'  # 1年缓存
                }
            )
            
            # 返回公共URL
            return f"https://pub-{self.bucket_name}.r2.dev/{r2_key}"
            
        except Exception as e:
            print(f"❌ Error uploading {local_path}: {e}")
            return None

    def upload_audio_files(self, audio_dir, report_file):
        """批量上传音频文件"""
        # 读取生成报告
        with open(report_file, 'r', encoding='utf-8') as f:
            report = json.load(f)
        
        uploaded_files = []
        failed_uploads = []
        
        print(f"📤 Uploading {len(report['files'])} audio files to R2...")
        
        for file_info in tqdm(report['files'], desc="Uploading"):
            local_path = file_info['audio_path']
            
            if not os.path.exists(local_path):
                print(f"⚠️  File not found: {local_path}")
                failed_uploads.append(file_info)
                continue
            
            # 生成R2存储路径
            filename = os.path.basename(local_path)
            r2_key = f"tts-audio/{file_info['language']}/{file_info['version']}/{filename}"
            
            # 上传文件
            public_url = self.upload_file(local_path, r2_key)
            
            if public_url:
                file_info['r2_url'] = public_url
                file_info['r2_key'] = r2_key
                uploaded_files.append(file_info)
            else:
                failed_uploads.append(file_info)
        
        # 保存上传结果
        self.save_upload_report(uploaded_files, failed_uploads, audio_dir)
        
        return uploaded_files, failed_uploads

    def save_upload_report(self, uploaded_files, failed_uploads, audio_dir):
        """保存上传报告"""
        upload_report = {
            'total_uploaded': len(uploaded_files),
            'total_failed': len(failed_uploads),
            'total_size_mb': sum(f['file_size'] for f in uploaded_files) / (1024 * 1024),
            'bucket_name': self.bucket_name,
            'uploaded_files': uploaded_files,
            'failed_uploads': failed_uploads
        }
        
        report_path = Path(audio_dir) / 'r2_upload_report.json'
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(upload_report, f, indent=2, ensure_ascii=False)
        
        print(f"📊 Upload Report:")
        print(f"   Successfully uploaded: {upload_report['total_uploaded']} files")
        print(f"   Failed uploads: {upload_report['total_failed']} files")
        print(f"   Total size uploaded: {upload_report['total_size_mb']:.2f} MB")
        print(f"   Report saved: {report_path}")

    def generate_api_manifest(self, uploaded_files, output_path):
        """生成API清单文件，供前端使用"""
        # 按语言和版本组织文件
        manifest = {}
        
        for file_info in uploaded_files:
            language = file_info['language']
            version = file_info['version']
            verse_id = file_info['verse_id']
            gender = file_info['gender']
            
            if language not in manifest:
                manifest[language] = {}
            if version not in manifest[language]:
                manifest[language][version] = {}
            if verse_id not in manifest[language][version]:
                manifest[language][version][verse_id] = {}
            
            manifest[language][version][verse_id][gender] = {
                'url': file_info['r2_url'],
                'reference': file_info['reference'],
                'text': file_info['text']
            }
        
        # 保存清单文件
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(manifest, f, indent=2, ensure_ascii=False)
        
        print(f"📋 API manifest saved: {output_path}")
        return manifest

def main():
    parser = argparse.ArgumentParser(description='Upload TTS audio files to Cloudflare R2')
    parser.add_argument('--audio-dir', default='tts_audio',
                       help='Directory containing generated audio files')
    parser.add_argument('--account-id', required=True,
                       help='Cloudflare account ID')
    parser.add_argument('--access-key-id', required=True,
                       help='R2 access key ID')
    parser.add_argument('--secret-access-key', required=True,
                       help='R2 secret access key')
    parser.add_argument('--bucket-name', required=True,
                       help='R2 bucket name')
    parser.add_argument('--manifest-output', default='public/tts-manifest.json',
                       help='Output path for API manifest file')
    
    args = parser.parse_args()
    
    # 检查生成报告文件
    report_file = Path(args.audio_dir) / 'generation_report.json'
    if not report_file.exists():
        print(f"❌ Generation report not found: {report_file}")
        print("Please run the TTS generation script first")
        return
    
    # 初始化上传器
    uploader = R2Uploader(
        args.account_id,
        args.access_key_id,
        args.secret_access_key,
        args.bucket_name
    )
    
    # 上传文件
    uploaded_files, failed_uploads = uploader.upload_audio_files(
        args.audio_dir, 
        report_file
    )
    
    if uploaded_files:
        # 生成API清单
        uploader.generate_api_manifest(uploaded_files, args.manifest_output)
        print(f"✅ Upload complete! {len(uploaded_files)} files uploaded successfully")
    else:
        print("❌ No files were uploaded successfully")

if __name__ == "__main__":
    main() 