'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  Monitor, 
  Globe, 
  Zap, 
  Shield, 
  ArrowRight,
  Play,
  Settings,
  Code,
  Database
} from 'lucide-react'

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false)

  const features = [
    {
      icon: Monitor,
      title: 'Desktop Automation',
      description: 'Control your computer with natural language commands',
      color: 'bg-blue-500'
    },
    {
      icon: Globe,
      title: 'Browser Automation',
      description: 'Automate web tasks and browser interactions',
      color: 'bg-green-500'
    },
    {
      icon: Zap,
      title: 'Workflow Designer',
      description: 'Create and manage automation workflows visually',
      color: 'bg-purple-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'All processing happens locally on your machine',
      color: 'bg-red-500'
    }
  ]

  const stats = [
    { label: 'Automation Tasks', value: '1000+' },
    { label: 'Supported Apps', value: '50+' },
    { label: 'Workflow Templates', value: '25+' },
    { label: 'Active Users', value: '10K+' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                  <Bot className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                UI-TARS
                <span className="block text-3xl md:text-4xl font-normal mt-2 text-blue-100">
                  Workflow Hub
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                AI-powered workflow automation that combines desktop and browser control 
                with natural language commands
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Get Started
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 text-lg px-8 py-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Settings className="w-5 h-5" />
                  View Demo
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <Code className="w-12 h-12 animate-bounce" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <Database className="w-12 h-12 animate-pulse" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to automate your workflows with AI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Automate Your Workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already automating their daily tasks with AI
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
          >
            Start Automating Now
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>
    </div>
  )
}