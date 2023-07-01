module.exports = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.log(error);
    res.json({
      error: error.message + "\nSERVER_ERROR",
      errorCode: 500,
      stack: error.stack,
    });
  }
};
