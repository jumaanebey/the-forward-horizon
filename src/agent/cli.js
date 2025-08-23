#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class UITarsAgent {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    const configPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(configPath)) {
      const envContent = fs.readFileSync(configPath, 'utf8');
      const config = {};
      
      envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          config[key.trim()] = value.trim();
        }
      });
      
      return config;
    }
    
    return {
      UI_TARS_PROVIDER: 'anthropic',
      UI_TARS_MODEL: 'claude-3-5-sonnet-20241022',
      UI_TARS_API_KEY: process.env.UI_TARS_API_KEY
    };
  }

  async start() {
    console.log('🤖 Starting UI-TARS Workflow Hub Agent...');
    console.log('📋 Configuration:');
    console.log(`   Provider: ${this.config.UI_TARS_PROVIDER}`);
    console.log(`   Model: ${this.config.UI_TARS_MODEL}`);
    console.log(`   API Key: ${this.config.UI_TARS_API_KEY ? '✅ Set' : '❌ Missing'}`);
    
    if (!this.config.UI_TARS_API_KEY) {
      console.error('❌ Error: UI_TARS_API_KEY is required');
      console.log('💡 Please set your API key in .env.local or as an environment variable');
      process.exit(1);
    }

    try {
      // Check if agent-tars CLI is installed
      await this.checkAgentTarsInstallation();
      
      // Start the agent
      await this.runAgent();
    } catch (error) {
      console.error('❌ Error starting agent:', error.message);
      process.exit(1);
    }
  }

  async checkAgentTarsInstallation() {
    return new Promise((resolve, reject) => {
      const check = spawn('npx', ['@agent-tars/cli@latest', '--version'], {
        stdio: 'pipe'
      });

      check.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Agent TARS CLI is available');
          resolve();
        } else {
          console.log('📦 Installing Agent TARS CLI...');
          this.installAgentTars().then(resolve).catch(reject);
        }
      });

      check.on('error', () => {
        console.log('📦 Installing Agent TARS CLI...');
        this.installAgentTars().then(resolve).catch(reject);
      });
    });
  }

  async installAgentTars() {
    return new Promise((resolve, reject) => {
      const install = spawn('npm', ['install', '@agent-tars/cli@latest', '-g'], {
        stdio: 'inherit'
      });

      install.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Agent TARS CLI installed successfully');
          resolve();
        } else {
          reject(new Error('Failed to install Agent TARS CLI'));
        }
      });
    });
  }

  async runAgent() {
    const args = [
      '--provider', this.config.UI_TARS_PROVIDER,
      '--model', this.config.UI_TARS_MODEL,
      '--apiKey', this.config.UI_TARS_API_KEY
    ];

    console.log('🚀 Starting agent with command:');
    console.log(`   agent-tars ${args.join(' ')}`);

    const agent = spawn('agent-tars', args, {
      stdio: 'inherit',
      env: {
        ...process.env,
        UI_TARS_PROVIDER: this.config.UI_TARS_PROVIDER,
        UI_TARS_MODEL: this.config.UI_TARS_MODEL,
        UI_TARS_API_KEY: this.config.UI_TARS_API_KEY
      }
    });

    agent.on('close', (code) => {
      console.log(`🤖 Agent exited with code ${code}`);
      process.exit(code);
    });

    agent.on('error', (error) => {
      console.error('❌ Agent error:', error);
      process.exit(1);
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down agent...');
      agent.kill('SIGINT');
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down agent...');
      agent.kill('SIGTERM');
    });
  }
}

// CLI interface
if (require.main === module) {
  const agent = new UITarsAgent();
  agent.start().catch(console.error);
}

module.exports = UITarsAgent;
