import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
  {
    user: {
      type: Object,
    },
    data: {
      type: Array,
      default: [],
    },
    product: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
