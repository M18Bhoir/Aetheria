import React, { useState } from "react";
import StatsCards from "../components/StatsCards";
import ActivityFeed from "../components/ActivityFeed";
import MaintenanceSummary from "../components/MaintenanceSummary";
import VisitorLogs from "../components/VisitorLogs";
import ComplaintTracker from "../components/ComplaintTracker";
import Notices from "../components/Notices";
import ExpenseCharts from "../components/ExpenseCharts";

const Dashboard = () => {
  // Centralized state for all dynamic data
  const [stats, setStats] = useState([
    { title: "Total Residents", value: "120" },
    { title: "Visitors Today", value: "45" },
    { title: "Complaints Pending", value: "2" }, // Consistent data
    { title: "Maintenance Due", value: "₹50,000" },
  ]);

  const [activities, setActivities] = useState([
    {
      id: 1,
      title: "Visitor Entry",
      description: "Mr. Sharma entered at Gate 2",
      time: "2 mins ago",
      icon: "Users",
      bgColor: "bg-green-100",
      color: "text-green-600",
    },
    {
      id: 2,
      title: "Complaint Registered",
      description: "Water leakage in B-302",
      time: "10 mins ago",
      icon: "Bell",
      bgColor: "bg-red-100",
      color: "text-red-600",
    },
    {
      id: 3,
      title: "Maintenance Update",
      description: "Lift maintenance completed in Tower A",
      time: "1 hr ago",
      icon: "Wrench",
      bgColor: "bg-blue-100",
      color: "text-blue-600",
    },
  ]);

  const [maintenanceSummary, setMaintenanceSummary] = useState({
    collected: "₹4,50,000",
    pending: "₹50,000", // Consistent data
  });

  const [visitors, setVisitors] = useState([
    { name: "Mr. Sharma", purpose: "Delivery", time: "10:00 AM" },
    { name: "Mrs. Gupta", purpose: "Relative Visit", time: "11:15 AM" },
    { name: "Electrician", purpose: "Repair Work", time: "12:30 PM" },
  ]);

  const [complaints, setComplaints] = useState([
    { flat: "B-302", issue: "Water leakage", status: "Pending" },
    { flat: "C-104", issue: "Lift not working", status: "Resolved" },
  ]);

  const [notices, setNotices] = useState([
    { date: "20 Sept 2025", msg: "Society meeting at 6 PM in clubhouse" },
    { date: "18 Sept 2025", msg: "Water supply maintenance on 21 Sept" },
  ]);

  return (
    <div className="space-y-6">
      <StatsCards stats={stats} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActivityFeed activities={activities} />
        <MaintenanceSummary summary={maintenanceSummary} />
      </div>
      <ExpenseCharts/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VisitorLogs visitors={visitors} />
        <ComplaintTracker complaints={complaints} />
      </div>
      <Notices notices={notices} />
    </div>
  );
};

export default Dashboard;