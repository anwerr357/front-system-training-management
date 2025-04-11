
import React from 'react';

const InstructorSchedulePage: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Schedule</h1>
        <p className="text-gray-600">View your upcoming training sessions</p>
      </div>

      <div className="dashboard-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">May 2025</h2>
          <div className="flex space-x-2">
            <button className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              Today
            </button>
            <button className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Calendar header with days of week */}
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-700">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {/* Week 1 */}
              <div className="bg-white p-2 h-32 text-gray-400 text-sm">30</div>
              <div className="bg-white p-2 h-32 text-sm">1</div>
              <div className="bg-white p-2 h-32 text-sm">2</div>
              <div className="bg-white p-2 h-32 text-sm">3</div>
              <div className="bg-white p-2 h-32 text-sm">4</div>
              <div className="bg-white p-2 h-32 text-sm">
                <div className="text-sm">5</div>
                <div className="mt-1 rounded bg-instructor text-white p-1 text-xs">
                  Advanced JavaScript
                </div>
              </div>
              <div className="bg-white p-2 h-32 text-sm">
                <div className="text-sm">6</div>
                <div className="mt-1 rounded bg-instructor text-white p-1 text-xs">
                  Advanced JavaScript
                </div>
              </div>

              {/* Week 2 */}
              <div className="bg-white p-2 h-32 text-sm">
                <div className="text-sm">7</div>
                <div className="mt-1 rounded bg-instructor text-white p-1 text-xs">
                  Advanced JavaScript
                </div>
              </div>
              <div className="bg-white p-2 h-32 text-sm">8</div>
              <div className="bg-white p-2 h-32 text-sm">9</div>
              <div className="bg-white p-2 h-32 text-sm">10</div>
              <div className="bg-white p-2 h-32 text-sm">11</div>
              <div className="bg-white p-2 h-32 text-sm">12</div>
              <div className="bg-white p-2 h-32 text-sm">13</div>

              {/* Week 3 */}
              <div className="bg-white p-2 h-32 text-sm">14</div>
              <div className="bg-white p-2 h-32 text-sm">
                <div className="text-sm">15</div>
                <div className="mt-1 rounded bg-instructor text-white p-1 text-xs">
                  Data Science Intro
                </div>
              </div>
              <div className="bg-white p-2 h-32 text-sm">
                <div className="text-sm">16</div>
                <div className="mt-1 rounded bg-instructor text-white p-1 text-xs">
                  Data Science Intro
                </div>
              </div>
              <div className="bg-white p-2 h-32 text-sm">17</div>
              <div className="bg-white p-2 h-32 text-sm">18</div>
              <div className="bg-white p-2 h-32 text-sm">19</div>
              <div className="bg-white p-2 h-32 text-sm">20</div>

              {/* Week 4 */}
              <div className="bg-white p-2 h-32 text-sm">21</div>
              <div className="bg-white p-2 h-32 text-sm">22</div>
              <div className="bg-white p-2 h-32 text-sm">23</div>
              <div className="bg-white p-2 h-32 text-sm">24</div>
              <div className="bg-white p-2 h-32 text-sm">25</div>
              <div className="bg-white p-2 h-32 text-sm">26</div>
              <div className="bg-white p-2 h-32 text-sm">27</div>

              {/* Week 5 */}
              <div className="bg-white p-2 h-32 text-sm">28</div>
              <div className="bg-white p-2 h-32 text-sm">29</div>
              <div className="bg-white p-2 h-32 text-sm">30</div>
              <div className="bg-white p-2 h-32 text-sm">31</div>
              <div className="bg-white p-2 h-32 text-gray-400 text-sm">1</div>
              <div className="bg-white p-2 h-32 text-gray-400 text-sm">2</div>
              <div className="bg-white p-2 h-32 text-gray-400 text-sm">3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSchedulePage;
