import { Dependency } from "@/types/dependency";

export const dependencies: Dependency[] = [
  { source: "t1", target: "t2" }, // Authentication blocks API Deployment
  { source: "t2", target: "t3" }, // API Deployment blocks Frontend Release
  { source: "t3", target: "t4" }  // Frontend Release blocks Product Launch
];
