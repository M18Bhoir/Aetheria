import React from "react";
import { Clock, Bell, Users, Wrench } from "lucide-react";
const icons = { Bell, Users, Wrench }; // Map icon names to components
const ActivityFeed = ({ activities }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">Activity Feed</h3>
      <div className="space-y-3">
        {activities.map((activity) => {
          const IconComponent = icons[activity.icon]; // Get the correct icon component
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                <IconComponent className={`w-4 h-4 ${activity.color}`} />
              </div>
              <div>
                <h4 className="text-sm font-semibold">{activity.title}</h4>
                <p className="text-xs text-slate-500">{activity.description}</p>
                <div className="flex items-center text-xs text-slate-400 mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ActivityFeed;