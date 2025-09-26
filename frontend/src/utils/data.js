import {
  Search,
  Users,
  FileText,
  Menu,
  MessageSquare,
  BarChart3,
  Shield,
  Clock,
  Award,
  Briefcase,
  Building2,
  LayoutDashboard,
  Plus,
  ArrowRight, 
  TrendingUp,
} from "lucide-react"

export const jobSeekerFeatures = [
  {
    icon: Search,
    title: "Smart Job Matching",
    description: "AI-powered alorithm matches you with relevant opportunities on your skills and preferences."
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Create professional resumes with our intuitive builder and templates designed by experts."
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description: "Connect directly with having and recruties throught our service messaging platform."
  },
  {
    icon: Award,
    title: "Skill Assessment",
    description: "Showcase your verifited skill and earn badges employers trust."
  },
];

export const employerFeatures = [
  {
    icon: Users,
    title: "Talent Pool Access",
    description: "Access our database of pre-screened candidates and find the perfect fit for your team."
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track your hiring performance with detailed analytics and inisghts on candidate enagement."
  },
  {
    icon: Shield,
    title: "Verifited Candidates",
    description: "All candidates undergo background verification to ensure your're hiring trustworthy professionals."
  },
  {
    icon: Clock,
    title: "Quick Hiring",
    description: "Streamlined hiring process reduces time-try-hire by 60% with automated screening tools."
  },
]

export const status = [
  { icon: Users, label: "Active Users", value: "2.4M+" },
  { icon: Building2, label: "Companies", value: "50K+" },
  { icon: TrendingUp, label: "Jobs Posteds", value: "150M+" },
]

export const NAVIGATION_MENU = [
  { id: "employer-dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "post-job", name: "Post Job", icon: Plus },
  { id: "manage-jobs", name: "Manage Jobs", icon: Briefcase },
  { id: "company-profile", name: "Company Profile", icon: Building2 },
]

export const CATEGORIES = [
  { value: "Engineering", label: "Engineering" },
  { value: "Design", label: "Design" },
  { value: "IT & Software", label: "IT & Software" },
  { value: "Marketing", label: "Marketing" },
  { value: "Customer-service", label: "Customer-service" },
  { value: "Finance", label: "Finance" },
  { value: "HR", label: "HR" },
  { value: "Product", label: "Product" },
  { value: "Other", label: "Other" },
]

export const JOB_TYPES = [
  { value: "Remote", label: "Remote" },
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Inernship", label: "Inernship" },
]

export const SALARY_RANGES = [
  "Less than $1000",
  "$1000 - $15,000",
  "More than $15,000",
]
