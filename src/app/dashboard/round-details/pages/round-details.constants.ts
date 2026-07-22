import type { CandidateEvaluationData } from "./round-details.types";

export const MOCK_EVALUATION: CandidateEvaluationData = {
  candidateName: "Shrinidhi V.",
  email: "talk2shrinidhi20@gmail.com",
  status: "Complete",
  jobTitle: "Senior GCP Architect",
  appliedDate: "1d ago",
  aiRecommendation: "REJECT",
  aiSummary:
    "The candidate confused GCP services with other cloud providers, deferred basic network troubleshooting to other teams, and recommended access policies that would compromise the security of our infrastructure.",
  overallScore: 1.5,
  criteriaMet: 1,
  totalCriteria: 6,
  topics: [
    {
      id: "t1",
      title: "Qa Gcp Security Iam",
      rating: 1.1,
      maxRating: 5,
      summaryBullets: [
        "The candidate failed to demonstrate foundational security knowledge, incorrectly suggesting 'super admin' roles for GCE access and conflating password policies with IAM Conditions.",
        "Significant gaps exist in both GCP KMS and Azure DevOps integration, with the candidate admitting no practical experience and providing incorrect theoretical explanations.",
      ],
      subCriteria: [
        {
          title: "Gcp Iam Governance",
          status: "BELOW_BAR",
          points: [
            { type: "negative", text: "Recommended granting 'admin role or the super admin role' for GCE access, violating the principle of least privilege." },
            { type: "negative", text: "Conflated IAM Conditions for resource-bound access with user password expiration policies." },
            { type: "negative", text: "Explicitly admitted to having no experience with Cloud KMS or CMEK configuration for Compute Engine." },
          ],
        },
        {
          title: "Azure Devops Integration",
          status: "BELOW_BAR",
          points: [
            { type: "negative", text: "Admitted to having no practical experience with Workload Identity Federation (WIF) and failed to explain OIDC mechanics." },
            { type: "negative", text: "Focused on Terraform state locking rather than secure pipeline identities or IAM role-scoping when asked about IaC security." },
            { type: "negative", text: "Used vague terminology like 'oauth' and 'service principal ID' without demonstrating technical understanding of the trust handshake between Azure and GCP." },
          ],
        },
      ],
      timestampStart: 45,
    },
    {
      id: "t2",
      title: "Sys Design Three Tier",
      rating: 2.5,
      maxRating: 5,
      problemStatement: "Design a highly available three-tier web application on GCP with global reach, secure database access, and CI/CD pipeline integration.",
      summaryBullets: [
        "Candidate possesses a solid understanding of high-level security components like Cloud Armor and Secret Manager, but demonstrated severe fundamental gaps in GCP networking and high availability.",
        "Major red flags identified: confused GCP with AWS/Azure services (Route 53, ExpressRoute) and incorrectly described storage replication mechanics.",
      ],
      subCriteria: [
        {
          title: "Enterprise Networking Load Balancing",
          status: "BELOW_BAR",
          points: [
            { type: "negative", text: "Exhibited significant platform confusion, suggesting AWS Route 53 and Azure ExpressRoute for a GCP hybrid connectivity design." },
            { type: "negative", text: "Misunderstood VPC scopes, claiming standard VPCs are geographically restricted while Shared VPC is required for multi-region failover." },
            { type: "negative", text: "Gave factually incorrect information on high availability, stating Azure ZRS copies data 22 times across two regions instead of explaining GCP Cloud SQL HA." },
            { type: "positive", text: "Correctly identified the use of Cloud Load Balancer with SSL termination and Cloud Armor for edge DDoS protection." },
          ],
        },
        {
          title: "Iam Kms Security Controls",
          status: "MEETS_BAR",
          points: [
            { type: "positive", text: "Proposed using IAM Service Accounts and GKE RBAC to enforce the principle of least privilege for pod-to-database access." },
            { type: "positive", text: "Correctly identified GCP Secret Manager as the standard tool for managing database credentials and sensitive keys." },
            { type: "negative", text: "Recommended using 'admin' and 'super admin' roles for GCE access rather than defining custom least-privilege roles." },
            { type: "warning", text: "Mentioned Identity-Aware Proxy (IAP) but called it 'internet access proxy,' suggesting conceptual awareness with imprecise terminology." },
          ],
        },
      ],
      timestampStart: 312,
    },
    {
      id: "t3",
      title: "Scenario Intermittent Connection",
      rating: 1.0,
      maxRating: 5,
      problemStatement: "A customer's application is experiencing intermittent 50% packet loss to a Cloud SQL instance over VPN. Diagnose and resolve.",
      summaryBullets: [
        "Candidate failed to demonstrate troubleshooting competency for GCP hybrid networking, explicitly asking to skip technical questions about BGP and routing.",
        "Relies heavily on delegating core technical tasks to a networking team rather than performing independent diagnostics or proposing mitigation.",
      ],
      subCriteria: [
        {
          title: "Case Study Diagnostic Approach Gcp Observability",
          status: "BELOW_BAR",
          points: [
            { type: "positive", text: "Correctly identified that the investigation must focus on the egress path and VPN configuration rather than the frontend." },
            { type: "negative", text: "Could not explain how to use VPC Flow Logs or Connectivity Tests to identify asymmetric routing or packet drops." },
            { type: "negative", text: "Deferred core diagnostic work to a separate networking team, stating, 'I have to take the help of the networking team on this.'" },
          ],
        },
        {
          title: "Case Study Hybrid Network Resolution",
          status: "BELOW_BAR",
          points: [
            { type: "negative", text: "Explicitly refused to answer questions regarding BGP route priority or Cloud Router, stating it was 'too technical' and 'too network' focused." },
            { type: "negative", text: "Failed to propose any technical mitigation for the 50% drop, prioritizing high availability over resolving the active outage." },
            { type: "negative", text: "Confused compute autoscaling (MIGs/HPA) with networking throughput, failing to address VPN tunnel capacity constraints." },
          ],
        },
      ],
      timestampStart: 589,
    },
  ],
  transcript: [
    { id: "u1", speaker: "INTERVIEWER", timestamp: "00:01", timeInSeconds: 1, text: "Welcome to the technical assessment. Could you please introduce yourself and describe your experience with GCP?" },
    { id: "u2", speaker: "CANDIDATE", timestamp: "00:18", timeInSeconds: 18, text: "I have been working with GCP for about 3 years. I've worked on various projects involving compute, storage, and networking." },
    { id: "u3", speaker: "INTERVIEWER", timestamp: "00:45", timeInSeconds: 45, text: "Let's start with IAM. Can you explain how IAM policies work in GCP and how they differ from AWS IAM?" },
    { id: "u4", speaker: "CANDIDATE", timestamp: "01:02", timeInSeconds: 62, text: "IAM policies in GCP are attached to resources rather than users. They use a hierarchy of organization, folder, project, and resource level." },
    { id: "u5", speaker: "INTERVIEWER", timestamp: "05:12", timeInSeconds: 312, text: "Now let's move to system design. Design a three-tier web application on GCP." },
    { id: "u6", speaker: "CANDIDATE", timestamp: "05:30", timeInSeconds: 330, text: "I would use Cloud Load Balancing, Compute Engine for the application tier, and Cloud SQL for the database." },
    { id: "u7", speaker: "INTERVIEWER", timestamp: "09:49", timeInSeconds: 589, text: "Scenario: Your application is experiencing intermittent connection drops to Cloud SQL. How would you debug this?" },
    { id: "u8", speaker: "CANDIDATE", timestamp: "10:05", timeInSeconds: 605, text: "I would check network connectivity, look at the VPC firewall rules, and verify the Cloud SQL private IP configuration." },
  ],
  transcriptSections: [
    {
      id: "sec-1",
      title: "STANDARD PROFESSIONAL INTRODUCTION",
      utterances: [
        { id: "u1", speaker: "INTERVIEWER", timestamp: "00:01", timeInSeconds: 1, text: "Hello! I am Kiran from Recruit41. I will be conducting your interview for the Senior GCP Architect role. How are you doing today?" },
        { id: "u2", speaker: "CANDIDATE", timestamp: "00:18", timeInSeconds: 18, text: "Hey, I am good. Thanks for giving me this opportunity! How about you?" },
        { id: "u3", speaker: "INTERVIEWER", timestamp: "00:26", timeInSeconds: 26, text: "Doing great! Today we will cover GCP security, system design, and a live troubleshooting scenario. Ready?" },
        { id: "u4", speaker: "CANDIDATE", timestamp: "00:39", timeInSeconds: 39, text: "Yes, I am ready. Let us begin." },
      ],
    },
    {
      id: "sec-2",
      title: "GCP IAM & WORKLOAD IDENTITY FEDERATION",
      utterances: [
        { id: "u5", speaker: "INTERVIEWER", timestamp: "00:45", timeInSeconds: 45, text: "Let us start with IAM. How would you configure Workload Identity Federation for Azure DevOps pipelines?" },
        { id: "u6", speaker: "CANDIDATE", timestamp: "01:10", timeInSeconds: 70, text: "For securing the pipeline, I would create service account keys and store them in Secret Manager, then give full admin permissions to the runner." },
        { id: "u7", speaker: "INTERVIEWER", timestamp: "01:45", timeInSeconds: 105, text: "Would you use service account keys directly or OIDC tokens via WIF without key JSON files?" },
        { id: "u8", speaker: "CANDIDATE", timestamp: "02:05", timeInSeconds: 125, text: "Normally we just use service account JSON keys. I have not set up OIDC provider trusts directly in GCP pools." },
      ],
    },
    {
      id: "sec-3",
      title: "SYS DESIGN THREE TIER ARCHITECTURE",
      utterances: [
        { id: "u9", speaker: "INTERVIEWER", timestamp: "05:12", timeInSeconds: 312, text: "Moving to System Design: How do you handle multi-region failover for a database tier?" },
        { id: "u10", speaker: "CANDIDATE", timestamp: "05:35", timeInSeconds: 335, text: "We can use Cloud SQL with Azure ZRS replication across 22 zones and Route 53 for traffic switching." },
        { id: "u11", speaker: "INTERVIEWER", timestamp: "06:02", timeInSeconds: 362, text: "Notice you mentioned Route 53 and Azure ZRS - what would be the GCP native equivalents?" },
        { id: "u12", speaker: "CANDIDATE", timestamp: "06:20", timeInSeconds: 380, text: "I think GCP has similar services but I am more familiar with the AWS naming conventions." },
      ],
    },
    {
      id: "sec-4",
      title: "SCENARIO INTERMITTENT CONNECTION & HYBRID NETWORKING",
      utterances: [
        { id: "u13", speaker: "INTERVIEWER", timestamp: "12:15", timeInSeconds: 735, text: "In a hybrid setup with Cloud Interconnect dropping 50% packets intermittently, how do you diagnose BGP route priorities?" },
        { id: "u14", speaker: "CANDIDATE", timestamp: "12:40", timeInSeconds: 760, text: "I usually ask the dedicated network team to check BGP routing logs since it is too network-focused for my role." },
        { id: "u15", speaker: "INTERVIEWER", timestamp: "13:02", timeInSeconds: 782, text: "So you would not use VPC Flow Logs or Connectivity Tests yourself for initial diagnosis?" },
        { id: "u16", speaker: "CANDIDATE", timestamp: "13:18", timeInSeconds: 798, text: "I have used VPC Flow Logs a few times but for BGP specifically that is handled by the infrastructure team." },
        { id: "u17", speaker: "INTERVIEWER", timestamp: "13:45", timeInSeconds: 825, text: "What about Cloud Router and custom route advertisements? Do you have experience configuring those?" },
        { id: "u18", speaker: "CANDIDATE", timestamp: "14:02", timeInSeconds: 842, text: "To be honest, I have not configured Cloud Router myself. My experience is more on the application architecture side." },
      ],
    },
  ],
};
