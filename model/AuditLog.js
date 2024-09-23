import mongoose, { Schema } from "mongoose";

const auditLogSchema = new Schema({
    queryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Query',
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    actionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }, { timestamps: true });
  
const AuditLogModel =  mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);

export default AuditLogModel;