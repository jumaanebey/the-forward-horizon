'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  Monitor, 
  Globe, 
  Zap, 
  Settings,
  Play,
  Square,
  RotateCcw,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function DashboardPage() {
  const [isAgentRunning, setIsAgentRunning] = useState(false)
  const [activeWorkflows, setActiveWorkflows] = useState(3)
  const [completedTasks, setCompletedTasks] = useState(127)

  const workflows = [
    {
      id: 1,
      name: 'File Organization',
      type: 'desktop',
      status: 'running',
      progress: 75,
      lastRun: '2 minutes ago'
    },
    {
      id: 2,
      name: 'Web Data Collection',
      type: 'browser',
      status: 'completed',
      progress: 100,
      lastRun: '5 minutes ago'
    },
    {
      id: 3,
      name: 'Email Automation',
      type: 'desktop',
      status: 'running',
      progress: 45,
      lastRun: '1 minute ago'
    }
  ]

  const recentActivities = [
    { id: 1, action: 'Started file organization workflow', time: '2 min ago', type: 'start' },
    { id: 2, action: 'Completed web scraping task', time: '5 min ago', type: 'complete' },
    { id: 3, action: 'Browser automation finished', time: '8 min ago', type: 'complete' },
    { id: 4, action: 'New workflow created', time: '12 min ago', type: 'create' }
  ]

  const toggleAgent = () => {
    setIsAgentRunning(!isAgentRunning)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">UI-TARS Dashboard</h1>
                <p className="text-sm text-gray-500">Workflow Automation Hub</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleAgent}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isAgentRunning 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {isAgentRunning ? (
                  <>
                    <Square className="w-4 h-4" />
                    <span>Stop Agent</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Start Agent</span>
                  </>
                )}
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                <p className="text-2xl font-bold text-gray-900">{activeWorkflows}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Runtime</p>
                <p className="text-2xl font-bold text-gray-900">2.3m</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Workflows */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Active Workflows</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        workflow.type === 'desktop' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {workflow.type === 'desktop' ? (
                          <Monitor className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Globe className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{workflow.name}</p>
                        <p className="text-sm text-gray-500">{workflow.lastRun}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        {workflow.status === 'running' ? (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-sm text-gray-600 capitalize">{workflow.status}</span>
                      </div>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${workflow.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'start' ? 'bg-blue-100' :
                      activity.type === 'complete' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'start' ? (
                        <Play className="w-4 h-4 text-blue-600" />
                      ) : activity.type === 'complete' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Zap className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Monitor className="w-5 h-5 text-blue-600" />
              <span className="font-medium">New Desktop Workflow</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Globe className="w-5 h-5 text-green-600" />
              <span className="font-medium">New Browser Workflow</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Workflow Templates</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}