const SPARK_INITIAL_BASE = 50;
const SPARK_INITIAL_RANGE = 10;
const SPARK_DOWN_THRESHOLD = 0.55;
const SPARK_UP_THRESHOLD = 0.45;
const SPARK_STEP_MULTIPLIER = 3;
const SPARK_MIN_VALUE = 10;
const SPARK_MAX_VALUE = 90;
const SPARK_DEFAULT_LENGTH = 40;

export const generateSparkData = (trend = "down", len = SPARK_DEFAULT_LENGTH) => {
  let val = SPARK_INITIAL_BASE + Math.random() * SPARK_INITIAL_RANGE;
  return Array.from({ length: len }, () => {
    val += (Math.random() - (trend === "down" ? SPARK_DOWN_THRESHOLD : SPARK_UP_THRESHOLD)) * SPARK_STEP_MULTIPLIER;
    return Math.max(SPARK_MIN_VALUE, Math.min(SPARK_MAX_VALUE, val));
  });
};