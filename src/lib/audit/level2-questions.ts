import { LEVEL2_P1 } from "./level2/p1";
import { LEVEL2_P2 } from "./level2/p2";
import { LEVEL2_P3 } from "./level2/p3";
import { LEVEL2_P4 } from "./level2/p4";
import { LEVEL2_P5 } from "./level2/p5";
import type { Level2Question } from "./types";

/** All 60 Level 2 sub-questions (20 L1 parents × 3). */
export const LEVEL2_QUESTIONS: Level2Question[] = [
  ...LEVEL2_P1,
  ...LEVEL2_P2,
  ...LEVEL2_P3,
  ...LEVEL2_P4,
  ...LEVEL2_P5,
];

if (LEVEL2_QUESTIONS.length !== 60) {
  throw new Error(
    `Expected 60 Level 2 questions, got ${LEVEL2_QUESTIONS.length}`,
  );
}
