exports.handler = async () => {
  const complaints = [
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

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
    body: JSON.stringify(complaints)
  };
};
