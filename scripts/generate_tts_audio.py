#!/usr/bin/env python3
"""
Gospel Reach TTS Audio Generator
批量生成所有圣经经文的TTS音频文件
"""

import os
import json
import torch
from TTS.api import TTS
from pathlib import Path
import argparse
from tqdm import tqdm
import hashlib

class GospelTTSGenerator:
    def __init__(self, output_dir="tts_audio"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # 初始化XTTS-v2模型
        print("🔄 Loading XTTS-v2 model...")
        self.tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(self.device)
        print(f"✅ Model loaded on {self.device}")
        
        # 语言映射
        self.language_map = {
            'en': 'en',
            'de': 'de', 
            'es': 'es',
            'fr': 'fr',
            'it': 'it'
        }
        
        # 男女声音频样本路径
        self.voice_samples = {
            'male': {
                'en': 'voice_samples/male_en.wav',
                'de': 'voice_samples/male_de.wav',
                'es': 'voice_samples/male_es.wav',
                'fr': 'voice_samples/male_fr.wav',
                'it': 'voice_samples/male_it.wav'
            },
            'female': {
                'en': 'voice_samples/female_en.wav',
                'de': 'voice_samples/female_de.wav',
                'es': 'voice_samples/female_es.wav',
                'fr': 'voice_samples/female_fr.wav',
                'it': 'voice_samples/female_it.wav'
            }
        }

    def get_file_hash(self, text, language, gender, version):
        """生成文件的唯一哈希标识"""
        content = f"{text}_{language}_{gender}_{version}"
        return hashlib.md5(content.encode()).hexdigest()[:12]

    def generate_audio(self, text, language, gender, verse_id, version):
        """生成单条经文的TTS音频"""
        try:
            # 获取对应的语音样本
            speaker_wav = self.voice_samples[gender][language]
            
            if not os.path.exists(speaker_wav):
                print(f"⚠️  Warning: Voice sample not found: {speaker_wav}")
                return None
            
            # 生成文件名
            file_hash = self.get_file_hash(text, language, gender, version)
            filename = f"{language}_{version}_{verse_id}_{gender}_{file_hash}.wav"
            output_path = self.output_dir / filename
            
            # 如果文件已存在，跳过
            if output_path.exists():
                return str(output_path)
            
            # 生成TTS音频
            self.tts.tts_to_file(
                text=text,
                speaker_wav=speaker_wav,
                language=language,
                file_path=str(output_path)
            )
            
            return str(output_path)
            
        except Exception as e:
            print(f"❌ Error generating audio for {verse_id}: {e}")
            return None

    def process_verse_file(self, file_path, language, version):
        """处理单个经文文件"""
        print(f"📖 Processing {file_path}")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            verses = json.load(f)
        
        results = []
        
        for verse in tqdm(verses, desc=f"Generating {language}_{version}"):
            verse_id = verse['index']
            text = verse['verse_content']
            reference = verse['reference']
            
            # 生成男声和女声版本
            for gender in ['male', 'female']:
                audio_path = self.generate_audio(
                    text=text,
                    language=language,
                    gender=gender,
                    verse_id=verse_id,
                    version=version
                )
                
                if audio_path:
                    results.append({
                        'verse_id': verse_id,
                        'reference': reference,
                        'text': text,
                        'language': language,
                        'version': version,
                        'gender': gender,
                        'audio_path': audio_path,
                        'file_size': os.path.getsize(audio_path)
                    })
        
        return results

    def generate_all_audio(self, data_dir="src/data/bible_verses"):
        """批量生成所有经文的TTS音频"""
        data_path = Path(data_dir)
        all_results = []
        
        # 获取所有经文文件
        verse_files = list(data_path.glob("bible_verses_*.json"))
        
        print(f"📚 Found {len(verse_files)} verse files")
        
        for file_path in verse_files:
            # 解析文件名获取语言和版本信息
            filename = file_path.stem
            parts = filename.split('_')
            
            if len(parts) >= 4:
                language = parts[2]  # en, de, es, fr, it
                version = parts[3]   # esv, kjv, niv, etc.
                
                # 映射到TTS支持的语言代码
                if language in self.language_map:
                    tts_language = self.language_map[language]
                    results = self.process_verse_file(file_path, tts_language, version)
                    all_results.extend(results)
                else:
                    print(f"⚠️  Unsupported language: {language}")
        
        # 保存生成结果
        self.save_generation_report(all_results)
        return all_results

    def save_generation_report(self, results):
        """保存生成报告"""
        report = {
            'total_files': len(results),
            'total_size_mb': sum(r['file_size'] for r in results) / (1024 * 1024),
            'languages': list(set(r['language'] for r in results)),
            'versions': list(set(r['version'] for r in results)),
            'genders': list(set(r['gender'] for r in results)),
            'files': results
        }
        
        report_path = self.output_dir / 'generation_report.json'
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"📊 Generation Report:")
        print(f"   Total files: {report['total_files']}")
        print(f"   Total size: {report['total_size_mb']:.2f} MB")
        print(f"   Languages: {', '.join(report['languages'])}")
        print(f"   Report saved: {report_path}")

def main():
    parser = argparse.ArgumentParser(description='Generate TTS audio for Gospel Reach verses')
    parser.add_argument('--data-dir', default='src/data/bible_verses', 
                       help='Directory containing verse JSON files')
    parser.add_argument('--output-dir', default='tts_audio',
                       help='Output directory for audio files')
    parser.add_argument('--voice-samples-dir', default='voice_samples',
                       help='Directory containing voice sample files')
    
    args = parser.parse_args()
    
    # 检查语音样本目录
    if not os.path.exists(args.voice_samples_dir):
        print(f"❌ Voice samples directory not found: {args.voice_samples_dir}")
        print("Please create voice samples for male and female voices in each language")
        return
    
    # 初始化生成器
    generator = GospelTTSGenerator(args.output_dir)
    
    # 开始生成
    print("🎵 Starting TTS audio generation...")
    results = generator.generate_all_audio(args.data_dir)
    
    print(f"✅ Generation complete! Generated {len(results)} audio files")

if __name__ == "__main__":
    main() 