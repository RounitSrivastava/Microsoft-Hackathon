import { Dependency } from "@/types/dependency";

export const dependencies: Dependency[] = [
  // --- Project Phoenix (p1) Dependencies ---
  { source: "t16", target: "t9" },  // Product Requirements Document -> System Architecture Design
  { source: "t9", target: "t5" },   // System Architecture Design -> Database Migration
  { source: "t9", target: "t6" },   // System Architecture Design -> Setup CI/CD Pipeline
  { source: "t6", target: "t7" },   // Setup CI/CD Pipeline -> Kubernetes Clustering
  { source: "t5", target: "t1" },   // Database Migration -> Authentication (Auth needs DB ready)
  
  // API Deployment depends on multiple critical paths:
  { source: "t1", target: "t2" },   // Authentication -> API Deployment
  { source: "t7", target: "t2" },   // Kubernetes Clustering -> API Deployment
  { source: "t11", target: "t2" },  // Security Audit Checklist -> API Deployment
  { source: "t12", target: "t2" },  // Code Review Coordination -> API Deployment
  { source: "t15", target: "t2" },  // SSL Certificate Renewal -> API Deployment

  // Verification & Documentation depend on API Deployment:
  { source: "t2", target: "t10" },  // API Deployment -> Load Testing
  { source: "t2", target: "t13" },  // API Deployment -> API Integration Docs

  // Release pipeline flow:
  { source: "t2", target: "t3" },   // API Deployment -> Frontend Release
  { source: "t3", target: "t4" },   // Frontend Release -> Product Launch

  // Post-launch maintenance:
  { source: "t4", target: "t8" },   // Product Launch -> Infrastructure Monitoring
  { source: "t4", target: "t14" },  // Product Launch -> Database Backup Config

  // --- Project Atlas (p2) Dependencies ---
  { source: "t17", target: "t18" }, // UI Mockups Design -> User Feedback Compilation
  { source: "t18", target: "t19" }, // User Feedback Compilation -> Beta Release Testing
  { source: "t20", target: "t21" }, // Market Research -> Marketing Campaign Setup
  { source: "t21", target: "t22" }  // Marketing Campaign Setup -> Press Release Drafting
];
