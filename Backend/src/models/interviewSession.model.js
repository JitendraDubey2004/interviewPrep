const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "model"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    interviewReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewReport",
      required: true,
    },
    history: [messageSchema],
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    evaluation: {
      overallScore: Number,
      communicationScore: Number,
      technicalScore: Number,
      starAlignment: {
        score: Number,
        feedback: String,
      },
      strengths: [String],
      improvements: [String],
      detailedFeedback: String,
    },
  },
  {
    timestamps: true,
  },
);

const interviewSessionModel = mongoose.model(
  "InterviewSession",
  interviewSessionSchema,
);

module.exports = interviewSessionModel;
