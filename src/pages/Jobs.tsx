import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Building,
  ExternalLink,
  Plus,
  Filter,
  Search,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  BookmarkPlus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Jobs = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedMode, setSelectedMode] = useState("all");

  // Mock data - will be replaced with actual database
  const jobs = [
    {
      id: 1,
      title: "Software Development Engineer",
      organisation: "Microsoft India",
      location: "Bangalore",
      mode: "Offline",
      type: "Full-time",
      experience: "0-2 years",
      salary: "₹8-15 LPA",
      description: "Join Microsoft's engineering team to build cloud-scale applications. Work on Azure services and contribute to products used by millions worldwide.",
      requirements: ["B.Tech/M.Tech in CS/IT", "Strong programming skills in C#, Java, or Python", "Understanding of data structures and algorithms", "Experience with cloud platforms is a plus"],
      link: "https://careers.microsoft.com/apply",
      contactName: "Recruitment Team",
      contactEmail: "careers@microsoft.com",
      contactPhone: "+91-8012345678",
      postedDate: "2024-01-10",
      deadline: "2024-02-10",
      approved: true,
      applications: 234,
      tags: ["SDE", "Cloud", "Full-time", "Fresher"]
    },
    {
      id: 2,
      title: "Frontend Developer Intern",
      organisation: "Swiggy",
      location: "Mumbai",
      mode: "Hybrid",
      type: "Internship",
      experience: "0-1 years",
      salary: "₹25,000/month",
      description: "6-month internship program working on Swiggy's customer-facing applications. Learn from senior developers and contribute to real products.",
      requirements: ["Currently pursuing B.Tech/M.Tech", "Knowledge of React.js, JavaScript, HTML/CSS", "Understanding of responsive design", "Portfolio of personal projects"],
      link: "https://swiggy.com/careers/intern",
      contactName: "HR Team",
      contactEmail: "internships@swiggy.in",
      contactPhone: "+91-9012345678",
      postedDate: "2024-01-08",
      deadline: "2024-01-25",
      approved: true,
      applications: 456,
      tags: ["Frontend", "React", "Internship", "Food Tech"]
    },
    {
      id: 3,
      title: "Data Scientist",
      organisation: "Flipkart",
      location: "Bangalore",
      mode: "Offline",
      type: "Full-time",
      experience: "2-4 years",
      salary: "₹15-25 LPA",
      description: "Work on machine learning models for personalization, search ranking, and supply chain optimization at India's leading e-commerce platform.",
      requirements: ["M.Tech/PhD in CS/Stats/Math", "3+ years experience in ML/AI", "Proficiency in Python, SQL, TensorFlow/PyTorch", "Experience with big data tools"],
      link: "https://flipkart.com/careers/data-science",
      contactName: "Data Science Team",
      contactEmail: "ds-hiring@flipkart.com",
      contactPhone: "+91-7012345678",
      postedDate: "2024-01-05",
      deadline: "2024-01-30",
      approved: true,
      applications: 189,
      tags: ["Data Science", "ML", "E-commerce", "Full-time"]
    },
    {
      id: 4,
      title: "Blockchain Developer Internship",
      organisation: "Web3 Startup",
      location: "Remote",
      mode: "Online",
      type: "Internship",
      experience: "1-2 years",
      salary: "₹30,000/month",
      description: "Build decentralized applications and smart contracts for our DeFi platform. Work remotely with a global team of blockchain enthusiasts.",
      requirements: ["Knowledge of Solidity, Web3.js", "Experience with Ethereum, smart contracts", "Understanding of DeFi protocols", "Portfolio of blockchain projects"],
      link: "https://web3startup.io/careers",
      contactName: "Blockchain Team",
      contactEmail: "hiring@web3startup.io",
      contactPhone: "+91-6012345678",
      postedDate: "2024-01-12",
      deadline: "2024-02-15",
      approved: true,
      applications: 67,
      tags: ["Blockchain", "Web3", "Remote", "Internship"]
    },
    {
      id: 5,
      title: "DevOps Engineer",
      organisation: "Paytm",
      location: "Noida",
      mode: "Offline",
      type: "Full-time",
      experience: "1-3 years",
      salary: "₹6-12 LPA",
      description: "Join our DevOps team to manage scalable infrastructure and CI/CD pipelines for millions of transactions.",
      requirements: ["Experience with AWS/GCP", "Docker & Kubernetes knowledge", "Linux administration", "Scripting skills in Python/Bash"],
      link: "https://paytm.com/careers",
      contactName: "DevOps Team",
      contactEmail: "devops@paytm.com",
      contactPhone: "+91-7012345679",
      postedDate: "2024-01-15",
      deadline: "2024-02-20",
      approved: false,
      applications: 0,
      tags: ["DevOps", "AWS", "Docker", "Full-time"]
    }
  ];

  const approvedJobs = jobs.filter(job => job.approved);
  
  const filteredJobs = approvedJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.organisation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = selectedLocation === "all" || !selectedLocation || job.location.includes(selectedLocation);
    const matchesType = selectedType === "all" || !selectedType || job.type === selectedType;
    const matchesMode = selectedMode === "all" || !selectedMode || job.mode === selectedMode;
    
    return matchesSearch && matchesLocation && matchesType && matchesMode;
  });

  const handleApply = (jobTitle: string, link: string) => {
    window.open(link, '_blank');
    toast({
      title: "Opening Application",
      description: `Redirecting to ${jobTitle} application...`,
    });
  };

  const handleSubmitJob = () => {
    toast({
      title: "Job Posted!",
      description: "Your job posting has been submitted for admin approval.",
    });
  };

  const handleBookmark = (jobTitle: string) => {
    toast({
      title: "Job Bookmarked",
      description: `${jobTitle} has been saved to your bookmarks.`,
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-8 h-8 text-accent" />
            <h1 className="text-3xl font-heading font-bold">Job Opportunities</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Discover exciting career opportunities in tech. From internships to full-time roles, find positions that match your skills and aspirations.
          </p>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
            <TabsTrigger value="submit">Post a Job</TabsTrigger>
          </TabsList>

          {/* Browse Jobs */}
          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search jobs, companies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Bangalore">Bangalore</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Delhi">Delhi/NCR</SelectItem>
                      <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="Pune">Pune</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedMode} onValueChange={setSelectedMode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Work Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modes</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Offline">Offline</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedLocation("all");
                      setSelectedType("all");
                      setSelectedMode("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {filteredJobs.length} jobs found
              </p>
              <Select defaultValue="recent">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="salary">Highest Salary</SelectItem>
                  <SelectItem value="applications">Most Applied</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Job Listings */}
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center space-x-1">
                              <Building className="w-4 h-4" />
                              <span>{job.organisation}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location} • {job.mode}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{job.experience}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleBookmark(job.title)}
                          >
                            <BookmarkPlus className="w-4 h-4" />
                          </Button>
                          <CheckCircle className="w-4 h-4 text-secondary" />
                        </div>
                      </div>

                      {/* Job Info */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{job.type}</Badge>
                        <Badge variant="outline" className="text-secondary">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {job.salary}
                        </Badge>
                        {job.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground">
                        {job.description}
                      </p>

                      {/* Requirements */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Key Requirements:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {job.requirements.slice(0, 3).map((req, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                          {job.requirements.length > 3 && (
                            <li className="text-xs text-muted-foreground">
                              +{job.requirements.length - 3} more requirements
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>{job.applications} applications</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleApply(job.title, job.link)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or check back later for new opportunities.
                  </p>
                  <Button variant="outline">
                    View All Jobs
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Post a Job */}
          <TabsContent value="submit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Post a Job Opening</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-accent" />
                    <span className="font-medium text-sm">Posting Guidelines</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• All job postings require admin approval</li>
                    <li>• Provide accurate company and contact information</li>
                    <li>• Include detailed job description and requirements</li>
                    <li>• Jobs will be visible once approved</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="job-title">Job Title *</Label>
                      <Input id="job-title" placeholder="e.g. Software Engineer" />
                    </div>

                    <div>
                      <Label htmlFor="organisation">Organisation *</Label>
                      <Input id="organisation" placeholder="Company name" />
                    </div>

                    <div>
                      <Label htmlFor="job-location">Location *</Label>
                      <Input id="job-location" placeholder="e.g. Bangalore, Mumbai" />
                    </div>

                    <div>
                      <Label htmlFor="job-mode">Work Mode *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Online">Online</SelectItem>
                          <SelectItem value="Offline">Offline</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="job-type">Job Type *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="experience">Experience Required</Label>
                      <Input id="experience" placeholder="e.g. 0-2 years, Fresher" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="salary">Salary Range</Label>
                      <Input id="salary" placeholder="e.g. ₹8-15 LPA, ₹25,000/month" />
                    </div>

                    <div>
                      <Label htmlFor="apply-link">Application Link *</Label>
                      <Input id="apply-link" placeholder="https://..." />
                    </div>

                    <div>
                      <Label htmlFor="contact-name-job">Contact Person *</Label>
                      <Input id="contact-name-job" placeholder="HR/Recruiter name" />
                    </div>

                    <div>
                      <Label htmlFor="contact-email-job">Contact Email *</Label>
                      <Input id="contact-email-job" type="email" placeholder="careers@company.com" />
                    </div>

                    <div>
                      <Label htmlFor="deadline">Application Deadline</Label>
                      <Input id="deadline" type="date" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="job-description">Job Description *</Label>
                  <Textarea 
                    id="job-description" 
                    placeholder="Detailed job description, responsibilities, and company information"
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="requirements">Requirements & Qualifications *</Label>
                  <Textarea 
                    id="requirements" 
                    placeholder="List key requirements, skills, education, experience needed (one per line)"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="job-tags">Tags (comma-separated)</Label>
                  <Input id="job-tags" placeholder="e.g. SDE, Full-time, React, Frontend" />
                </div>

                <Button onClick={handleSubmitJob} className="w-full" size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Job for Approval
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Jobs;