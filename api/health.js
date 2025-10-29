// Vercel Serverless Function for health check
module.exports = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Vegan Diet API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
};
