import cors from "cors";

export const useCors = cors({
  // Don't use CORS in testing mode
  origin: process.env.NODE_ENV !== "test",
});
