exports.handler = async (event) => {
  const body = JSON.parse(event.body || "{}");

  const response = {
    id: "C100",
    transcript: body.transcript || "Sample complaint",
    category: "Water",
    urgency: "High",
    village: body.village || "Rampur",
    status: "Open",
    timestamp: new Date().toISOString()
  };

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      complaint: response
    })
  };
};