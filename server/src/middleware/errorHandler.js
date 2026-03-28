const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "ZodError") {
    return res.status(400).json({
      message: err.issues?.[0]?.message || "Please check the form and try again.",
    });
  }

  if (err.code === "P2002") {
    return res.status(409).json({
      message: "This value already exists. Please use a different one.",
    });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong. Please try again.",
  });
};

module.exports = { errorHandler };
