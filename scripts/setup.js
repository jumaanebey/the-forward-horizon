#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SetupScript {
  constructor() {
    this.projectRoot = process.cwd();
  }

  async run() {
    console.log('🚀 Setting up UI-TARS Workflow Hub...\n');

    try {
      await this.checkPrerequisites();
      await this.installDependencies();
      await this.setupEnvironment();
      await this.createDirectories();
      await this.setupGit();
      
      console.log('\n✅ Setup completed successfully!');
      console.log('\n🎉 Next steps:');
      console.log('1. Copy env.example to .env.local and add your API keys');
      console.log('2. Run: npm run dev');
      console.log('3. Run: npm run agent (in another terminal)');
      console.log('\n📚 Documentation: https://github.com/bytedance/UI-TARS-desktop');
      
    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      process.exit(1);
    }
  }

  async checkPrerequisites() {
    console.log('📋 Checking prerequisites...');
    
    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 18) {
      throw new Error(`Node.js 18+ required. Current version: ${nodeVersion}`);
    }
    
    console.log(`✅ Node.js ${nodeVersion}`);
    
    // Check npm
    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      console.log(`✅ npm ${npmVersion}`);
    } catch (error) {
      throw new Error('npm not found. Please install Node.js and npm.');
    }
    
    // Check Git
    try {
      const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
      console.log(`✅ ${gitVersion}`);
    } catch (error) {
      console.log('⚠️  Git not found. Some features may not work properly.');
    }
  }

  async installDependencies() {
    console.log('\n📦 Installing dependencies...');
    
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('✅ Dependencies installed');
    } catch (error) {
      throw new Error('Failed to install dependencies');
    }
  }

  async setupEnvironment() {
    console.log('\n🔧 Setting up environment...');
    
    const envExamplePath = path.join(this.projectRoot, 'env.example');
    const envLocalPath = path.join(this.projectRoot, '.env.local');
    
    if (!fs.existsSync(envLocalPath) && fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envLocalPath);
      console.log('✅ Created .env.local from template');
      console.log('💡 Please edit .env.local with your API keys');
    } else if (fs.existsSync(envLocalPath)) {
      console.log('✅ .env.local already exists');
    } else {
      console.log('⚠️  No env.example found, creating basic .env.local');
      const basicEnv = `# UI-TARS Configuration
UI_TARS_PROVIDER=anthropic
UI_TARS_MODEL=claude-3-5-sonnet-20241022
UI_TARS_API_KEY=your-api-key-here

# Next.js Configuration
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
`;
      fs.writeFileSync(envLocalPath, basicEnv);
    }
  }

  async createDirectories() {
    console.log('\n📁 Creating directories...');
    
    const directories = [
      'src/app/api',
      'src/components',
      'src/lib',
      'src/agent',
      'public',
      'scripts',
      'docs',
      'backup-leads'
    ];
    
    directories.forEach(dir => {
      const fullPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✅ Created ${dir}`);
      }
    });
  }

  async setupGit() {
    console.log('\n🔗 Setting up Git...');
    
    const gitPath = path.join(this.projectRoot, '.git');
    
    if (!fs.existsSync(gitPath)) {
      try {
        execSync('git init', { stdio: 'pipe' });
        console.log('✅ Initialized Git repository');
        
        // Create .gitignore if it doesn't exist
        const gitignorePath = path.join(this.projectRoot, '.gitignore');
        if (!fs.existsSync(gitignorePath)) {
          const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Next.js
.next/
out/

# Production
build/

# Misc
.DS_Store
*.tgz
*.tar.gz

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Backup files
backup-leads/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db
`;
          fs.writeFileSync(gitignorePath, gitignoreContent);
          console.log('✅ Created .gitignore');
        }
        
        // Initial commit
        try {
          execSync('git add .', { stdio: 'pipe' });
          execSync('git commit -m "Initial commit: UI-TARS Workflow Hub setup"', { stdio: 'pipe' });
          console.log('✅ Created initial commit');
        } catch (error) {
          console.log('⚠️  Could not create initial commit (no changes or Git not configured)');
        }
        
      } catch (error) {
        console.log('⚠️  Could not initialize Git repository');
      }
    } else {
      console.log('✅ Git repository already exists');
    }
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new SetupScript();
  setup.run().catch(console.error);
}

module.exports = SetupScript;
