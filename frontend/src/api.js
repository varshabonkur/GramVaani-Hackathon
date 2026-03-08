// frontend/src/api.js - MOCK DATA VERSION
export const fetchComplaints = async () => {
  console.log("Using mock complaints data");
  return [
    {
      id: "C001",
      transcript: "Water pipeline broken near school",
      category: "Water",
      urgency: "High",
      village: "Rampur",
      status: "Open",
      timestamp: "2026-03-01"
    },
    {
      id: "C002",
      transcript: "Road full of potholes",
      category: "Road",
      urgency: "Medium",
      village: "Lakshmipur",
      status: "In Progress",
      timestamp: "2026-03-03"
    },
    {
      id: "C003",
      transcript: "Street lights not working",
      category: "Electricity",
      urgency: "Low",
      village: "Rampur",
      status: "Resolved",
      timestamp: "2026-03-05"
    }
  ];
};

export const fetchStats = async () => {
  console.log("Using mock stats data");
  return {
    total: 12,
    open: 5,
    inProgress: 3,
    resolved: 4,
    byCategory: {
      Water: 4,
      Road: 3,
      Electricity: 2,
      Sanitation: 2,
      Other: 1
    }
  };
};