import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Simulate agent status check
    const agentStatus = {
      status: 'running',
      uptime: '2h 15m',
      activeWorkflows: 3,
      completedTasks: 127,
      successRate: 94.2,
      lastActivity: new Date().toISOString(),
      workflows: [
        {
          id: 1,
          name: 'File Organization',
          type: 'desktop',
          status: 'running',
          progress: 75,
          startTime: new Date(Date.now() - 120000).toISOString()
        },
        {
          id: 2,
          name: 'Web Data Collection',
          type: 'browser',
          status: 'completed',
          progress: 100,
          startTime: new Date(Date.now() - 300000).toISOString()
        },
        {
          id: 3,
          name: 'Email Automation',
          type: 'desktop',
          status: 'running',
          progress: 45,
          startTime: new Date(Date.now() - 60000).toISOString()
        }
      ],
      recentActivities: [
        {
          id: 1,
          action: 'Started file organization workflow',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          type: 'start'
        },
        {
          id: 2,
          action: 'Completed web scraping task',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          type: 'complete'
        },
        {
          id: 3,
          action: 'Browser automation finished',
          timestamp: new Date(Date.now() - 480000).toISOString(),
          type: 'complete'
        }
      ]
    };

    return NextResponse.json(agentStatus);
  } catch (error) {
    console.error('Agent status error:', error);
    return NextResponse.json(
      { error: 'Failed to get agent status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, workflowId } = body;

    // Simulate agent control actions
    let response = { success: true, message: '' };

    switch (action) {
      case 'start':
        response.message = 'Agent started successfully';
        break;
      case 'stop':
        response.message = 'Agent stopped successfully';
        break;
      case 'restart':
        response.message = 'Agent restarted successfully';
        break;
      case 'pause_workflow':
        response.message = `Workflow ${workflowId} paused`;
        break;
      case 'resume_workflow':
        response.message = `Workflow ${workflowId} resumed`;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Agent control error:', error);
    return NextResponse.json(
      { error: 'Failed to control agent' },
      { status: 500 }
    );
  }
}
