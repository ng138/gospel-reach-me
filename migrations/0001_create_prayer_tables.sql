-- Create prayers table with all necessary fields
CREATE TABLE IF NOT EXISTS prayers (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  content TEXT NOT NULL CHECK(length(content) <= 500),
  original_language TEXT NOT NULL CHECK(original_language IN ('EN','ES','FR','DE','IT')),
  country_code TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  approved_at DATETIME,
  anonymous_user_id TEXT NOT NULL,
  hearts_count INTEGER DEFAULT 0,
  prayers_count INTEGER DEFAULT 0,
  is_answered BOOLEAN DEFAULT 0,
  is_reported BOOLEAN DEFAULT 0,
  report_count INTEGER DEFAULT 0,
  translation_en TEXT,
  translation_es TEXT,
  translation_de TEXT,
  translation_fr TEXT,
  translation_it TEXT
);

-- Create prayer reactions table
CREATE TABLE IF NOT EXISTS prayer_reactions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  prayer_id TEXT NOT NULL,
  anonymous_user_id TEXT NOT NULL,
  reaction_type TEXT NOT NULL CHECK(reaction_type IN ('heart','pray')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(prayer_id, anonymous_user_id, reaction_type),
  FOREIGN KEY (prayer_id) REFERENCES prayers(id) ON DELETE CASCADE
);

-- Create prayer categories table
CREATE TABLE IF NOT EXISTS prayer_categories (
  id TEXT PRIMARY KEY,
  name_key TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Create prayer category assignments table
CREATE TABLE IF NOT EXISTS prayer_category_assignments (
  prayer_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  PRIMARY KEY (prayer_id, category_id),
  FOREIGN KEY (prayer_id) REFERENCES prayers(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES prayer_categories(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prayers_status ON prayers(status);
CREATE INDEX IF NOT EXISTS idx_prayers_created ON prayers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prayers_country ON prayers(country_code);
CREATE INDEX IF NOT EXISTS idx_prayers_approved ON prayers(approved_at DESC);
CREATE INDEX IF NOT EXISTS idx_reactions_prayer ON prayer_reactions(prayer_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user ON prayer_reactions(anonymous_user_id);

-- Insert default prayer categories
INSERT OR IGNORE INTO prayer_categories (id, name_key, icon, sort_order) VALUES
('health', 'category.health', '🏥', 1),
('family', 'category.family', '👨‍👩‍👧‍👦', 2),
('work', 'category.work', '💼', 3),
('spiritual', 'category.spiritual', '🙏', 4),
('gratitude', 'category.gratitude', '🙌', 5),
('guidance', 'category.guidance', '🧭', 6),
('relationships', 'category.relationships', '❤️', 7),
('peace', 'category.peace', '☮️', 8),
('protection', 'category.protection', '🛡️', 9),
('other', 'category.other', '📿', 10);