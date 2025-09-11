import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Download, 
  Upload, 
  ExternalLink, 
  Filter,
  FileText,
  Star,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Notes = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Mock data - will be replaced with actual database
  const notes = [
    {
      id: 1,
      title: "Data Structures and Algorithms - Complete Guide",
      semester: "3",
      subject: "DSA",
      topic: "Trees, Graphs, Dynamic Programming",
      uploadedBy: "Arjun Kumar",
      downloads: 1247,
      rating: 4.8,
      approved: true,
      createdAt: "2024-01-10",
      fileSize: "12.5 MB",
      pages: 156
    },
    {
      id: 2,
      title: "Operating Systems - Process Management",
      semester: "4",
      subject: "OS",
      topic: "Scheduling, Synchronization, Deadlocks",
      uploadedBy: "Priya Sharma",
      downloads: 892,
      rating: 4.6,
      approved: true,
      createdAt: "2024-01-08",
      fileSize: "8.2 MB",
      pages: 89
    },
    {
      id: 3,
      title: "Database Management Systems - SQL Queries",
      semester: "5",
      subject: "DBMS",
      topic: "Complex Queries, Joins, Optimization",
      uploadedBy: "Rahul Verma",
      downloads: 673,
      rating: 4.9,
      approved: true,
      createdAt: "2024-01-05",
      fileSize: "6.8 MB",
      pages: 67
    },
    {
      id: 4,
      title: "Machine Learning Fundamentals",
      semester: "6",
      subject: "ML",
      topic: "Algorithms, Neural Networks, Deep Learning",
      uploadedBy: "Sneha Patel",
      downloads: 0,
      rating: 0,
      approved: false,
      createdAt: "2024-01-12",
      fileSize: "15.3 MB",
      pages: 234
    }
  ];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = !selectedSemester || note.semester === selectedSemester;
    const matchesSubject = !selectedSubject || note.subject === selectedSubject;
    const isApproved = note.approved; // Only show approved notes to regular users
    
    return matchesSearch && matchesSemester && matchesSubject && isApproved;
  });

  const handleUpload = () => {
    if (!uploadFile) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload.",
        variant: "destructive"
      });
      return;
    }

    // Mock upload process
    toast({
      title: "Upload Successful!",
      description: "Your notes have been uploaded and are pending admin approval.",
    });
    setUploadFile(null);
  };

  const handleDownload = (noteTitle: string) => {
    toast({
      title: "Download Started",
      description: `Downloading "${noteTitle}"...`,
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-2">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-heading font-bold">Study Notes</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Access comprehensive study materials uploaded by the community. Find notes organized by semester and subject, or contribute your own to help fellow students.
          </p>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="secondary"
              onClick={() => window.open('https://drive.google.com/drive/folders/1-tXGUSeXXurQkyU7jxzJGuDEdQK9C1bA?usp=sharing', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Drive Folder
            </Button>
            <Button variant="outline">
              <Star className="w-4 h-4 mr-2" />
              My Favorites
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="search">Search Notes</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by title, topic..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label>Semester</Label>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Semesters" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Semesters</SelectItem>
                      {[1,2,3,4,5,6,7,8].map(sem => (
                        <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Subjects</SelectItem>
                      <SelectItem value="DSA">Data Structures & Algorithms</SelectItem>
                      <SelectItem value="OS">Operating Systems</SelectItem>
                      <SelectItem value="DBMS">Database Management</SelectItem>
                      <SelectItem value="CN">Computer Networks</SelectItem>
                      <SelectItem value="ML">Machine Learning</SelectItem>
                      <SelectItem value="AI">Artificial Intelligence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSemester("");
                    setSelectedSubject("");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>

            {/* Upload Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="file">Select PDF File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8].map(sem => (
                          <SelectItem key={sem} value={sem.toString()}>{sem}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject-upload">Subject</Label>
                    <Input id="subject-upload" placeholder="e.g. DSA" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter note title" />
                </div>

                <div>
                  <Label htmlFor="topic">Topic/Chapter</Label>
                  <Input id="topic" placeholder="Main topics covered" />
                </div>

                <Button onClick={handleUpload} className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Notes
                </Button>
                
                <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <AlertCircle className="w-3 h-3" />
                    <span className="font-medium">Upload Guidelines</span>
                  </div>
                  <ul className="space-y-1 ml-5">
                    <li>• Only PDF files are allowed</li>
                    <li>• Max file size: 20MB</li>
                    <li>• Notes need admin approval</li>
                    <li>• Earn 20 points for approved notes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing {filteredNotes.length} notes
              </p>
              <Select defaultValue="recent">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rated">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredNotes.map((note) => (
                <Card key={note.id} className="card-interactive">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                              {note.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {note.topic}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {note.approved ? (
                              <CheckCircle className="w-4 h-4 text-secondary" />
                            ) : (
                              <Clock className="w-4 h-4 text-accent" />
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">Sem {note.semester}</Badge>
                          <Badge variant="secondary">{note.subject}</Badge>
                          <Badge variant="outline">{note.fileSize}</Badge>
                          <Badge variant="outline">{note.pages} pages</Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Download className="w-4 h-4" />
                              <span>{note.downloads} downloads</span>
                            </div>
                            {note.rating > 0 && (
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-accent text-accent" />
                                <span>{note.rating}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <span>by {note.uploadedBy}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                            <Button size="sm" onClick={() => handleDownload(note.title)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredNotes.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No notes found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or check out our Drive folder for more resources.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => window.open('https://drive.google.com/drive/folders/1-tXGUSeXXurQkyU7jxzJGuDEdQK9C1bA?usp=sharing', '_blank')}
                  >
                    Browse Drive Folder
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;