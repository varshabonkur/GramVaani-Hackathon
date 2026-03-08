exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
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
    })
  };
};