'use client';
import { useState } from 'react';

interface Goal {
  id: number;
  category: string;
  title: string;
  description: string;
  targetDate: string;
  status: string;
  progress: number;
  notes: string;
  dateCreated: string;
  dateCompleted?: string;
}

interface Milestone {
  id: number;
  date: string;
  type: string;
  description: string;
  staffMember: string;
}

interface ProgressTrackingModalProps {
  resident: any;
  onClose: () => void;
}

export default function ProgressTrackingModal({ resident, onClose }: ProgressTrackingModalProps) {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      category: 'Employment',
      title: 'Find Full-time Employment',
      description: 'Secure stable employment in construction or warehouse work',
      targetDate: '2024-06-01',
      status: 'In Progress',
      progress: 65,
      notes: 'Applied to 5 positions, had 2 interviews',
      dateCreated: '2024-01-15'
    },
    {
      id: 2,
      category: 'Housing',
      title: 'Save for Independent Housing',
      description: 'Save $3000 for security deposit and first month rent',
      targetDate: '2024-08-01',
      status: 'In Progress',
      progress: 40,
      notes: 'Current savings: $1200',
      dateCreated: '2024-01-20'
    },
  ]);

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 1,
      date: '2024-01-15',
      type: 'Program Entry',
      description: 'Successfully completed intake process and orientation',
      staffMember: 'Sarah Johnson'
    },
    {
      id: 2,
      date: '2024-02-01',
      type: 'Achievement',
      description: 'Completed 30 days clean and sober',
      staffMember: 'Mike Rodriguez'
    },
  ]);

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddMilestone, setShowAddMilestone] = useState(false);

  const [newGoal, setNewGoal] = useState({
    category: '',
    title: '',
    description: '',
    targetDate: '',
    status: 'Not Started',
    progress: 0,
    notes: ''
  });

  const [newMilestone, setNewMilestone] = useState({
    date: '',
    type: '',
    description: '',
    staffMember: ''
  });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const goal: Goal = {
      id: Date.now(),
      ...newGoal,
      dateCreated: new Date().toISOString().split('T')[0]
    };
    setGoals([goal, ...goals]);
    setNewGoal({
      category: '',
      title: '',
      description: '',
      targetDate: '',
      status: 'Not Started',
      progress: 0,
      notes: ''
    });
    setShowAddGoal(false);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    const milestone: Milestone = {
      id: Date.now(),
      ...newMilestone
    };
    setMilestones([milestone, ...milestones]);
    setNewMilestone({
      date: '',
      type: '',
      description: '',
      staffMember: ''
    });
    setShowAddMilestone(false);
  };

  const updateGoalProgress = (goalId: number, newProgress: number) => {
    setGoals(goals.map(g => 
      g.id === goalId 
        ? { 
            ...g, 
            progress: newProgress,
            status: newProgress === 100 ? 'Completed' : newProgress > 0 ? 'In Progress' : 'Not Started',
            dateCompleted: newProgress === 100 ? new Date().toISOString().split('T')[0] : undefined
          }
        : g
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMilestoneColor = (type: string) => {
    switch (type) {
      case 'Achievement': return 'bg-green-100 text-green-800';
      case 'Program Entry': return 'bg-blue-100 text-blue-800';
      case 'Setback': return 'bg-red-100 text-red-800';
      case 'Milestone': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOverallProgress = () => {
    if (goals.length === 0) return 0;
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0);
    return Math.round(totalProgress / goals.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Progress Tracking - {resident.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Overall Progress Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Overall Progress Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{getOverallProgress()}%</div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {goals.filter(g => g.status === 'Completed').length}
                </div>
                <div className="text-sm text-gray-600">Goals Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {goals.filter(g => g.status === 'In Progress').length}
                </div>
                <div className="text-sm text-gray-600">Goals In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{milestones.length}</div>
                <div className="text-sm text-gray-600">Total Milestones</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setShowAddGoal(!showAddGoal)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {showAddGoal ? 'Cancel Goal' : 'Add Goal'}
            </button>
            <button
              onClick={() => setShowAddMilestone(!showAddMilestone)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              {showAddMilestone ? 'Cancel Milestone' : 'Add Milestone'}
            </button>
          </div>

          {/* Add Goal Form */}
          {showAddGoal && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Goal</h3>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      <option value="Employment">Employment</option>
                      <option value="Housing">Housing</option>
                      <option value="Education">Education</option>
                      <option value="Health">Health & Wellness</option>
                      <option value="Financial">Financial</option>
                      <option value="Legal">Legal</option>
                      <option value="Family">Family Relations</option>
                      <option value="Recovery">Recovery</option>
                      <option value="Life Skills">Life Skills</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Find full-time employment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Detailed description of the goal..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddGoal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Goal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Add Milestone Form */}
          {showAddMilestone && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Milestone</h3>
              <form onSubmit={handleAddMilestone} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newMilestone.date}
                      onChange={(e) => setNewMilestone({...newMilestone, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      required
                      value={newMilestone.type}
                      onChange={(e) => setNewMilestone({...newMilestone, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Type</option>
                      <option value="Achievement">Achievement</option>
                      <option value="Milestone">Milestone</option>
                      <option value="Program Entry">Program Entry</option>
                      <option value="Setback">Setback</option>
                      <option value="Assessment">Assessment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Staff Member
                    </label>
                    <input
                      type="text"
                      value={newMilestone.staffMember}
                      onChange={(e) => setNewMilestone({...newMilestone, staffMember: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Staff member name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Description of the milestone or achievement..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddMilestone(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Add Milestone
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Goals Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Goals & Objectives</h3>
              
              {goals.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No goals set yet</p>
              ) : (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">{goal.title}</h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                              {goal.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{goal.category}</p>
                          {goal.description && (
                            <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Progress Controls */}
                      <div className="flex items-center space-x-2 mb-3">
                        <button
                          onClick={() => updateGoalProgress(goal.id, Math.max(0, goal.progress - 10))}
                          className="text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                        >
                          -10%
                        </button>
                        <button
                          onClick={() => updateGoalProgress(goal.id, Math.min(100, goal.progress + 10))}
                          className="text-sm bg-blue-200 hover:bg-blue-300 px-2 py-1 rounded"
                        >
                          +10%
                        </button>
                        <button
                          onClick={() => updateGoalProgress(goal.id, 100)}
                          className="text-sm bg-green-200 hover:bg-green-300 px-2 py-1 rounded"
                        >
                          Complete
                        </button>
                      </div>

                      <div className="text-xs text-gray-500">
                        <div>Created: {goal.dateCreated}</div>
                        {goal.targetDate && <div>Target: {goal.targetDate}</div>}
                        {goal.dateCompleted && <div>Completed: {goal.dateCompleted}</div>}
                        {goal.notes && <div className="mt-1">Notes: {goal.notes}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Milestones Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Milestones & Achievements</h3>
              
              {milestones.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No milestones recorded yet</p>
              ) : (
                <div className="space-y-4">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMilestoneColor(milestone.type)}`}>
                            {milestone.type}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {milestone.description}
                          </p>
                          <div className="text-xs text-gray-500">
                            <div>{milestone.date}</div>
                            {milestone.staffMember && <div>Recorded by: {milestone.staffMember}</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}