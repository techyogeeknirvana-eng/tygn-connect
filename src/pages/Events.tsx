import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ExternalLink,
  Plus,
  Filter,
  Star,
  Bell,
  Share2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Events = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upcoming");

  // Mock data - will be replaced with actual database
  const events = [
    {
      id: 1,
      title: "CodeChef January Challenge",
      description: "Monthly competitive programming contest with exciting problems and cash prizes.",
      organizer: "CodeChef",
      contactName: "Team CodeChef",
      contactEmail: "support@codechef.com",
      contactPhone: "+91-9876543210",
      locationName: "Online",
      address: "https://codechef.com/contest",
      mode: "Virtual",
      dateStart: "2024-01-15T15:00:00",
      dateEnd: "2024-01-15T18:00:00",
      registerLink: "https://codechef.com/register",
      approved: true,
      participants: 2847,
      prizes: "₹50,000",
      difficulty: "All Levels",
      tags: ["Competitive Programming", "Contest", "Prizes"]
    },
    {
      id: 2,
      title: "React & Next.js Workshop",
      description: "Hands-on workshop covering modern React development, Next.js features, and deployment strategies.",
      organizer: "TYGN Community",
      contactName: "Arjun Kumar",
      contactEmail: "arjun@tygn.dev",
      contactPhone: "+91-8765432109",
      locationName: "Tech Hub Bangalore",
      address: "123 Innovation Street, Koramangala, Bangalore - 560034",
      mode: "Hybrid",
      dateStart: "2024-01-20T10:00:00",
      dateEnd: "2024-01-20T17:00:00",
      registerLink: "https://eventbrite.com/react-workshop",
      approved: true,
      participants: 156,
      prizes: "Certificates & Swag",
      difficulty: "Beginner to Intermediate",
      tags: ["Workshop", "React", "Web Development"]
    },
    {
      id: 3,
      title: "Google DevFest Delhi 2024",
      description: "Annual developer festival featuring talks on AI/ML, Cloud, Web, and Mobile technologies.",
      organizer: "Google Developer Groups Delhi",
      contactName: "Priya Sharma",
      contactEmail: "delhi@gdg.org",
      contactPhone: "+91-7654321098",
      locationName: "India Habitat Centre",
      address: "Lodhi Road, New Delhi - 110003",
      mode: "In-Person",
      dateStart: "2024-01-25T09:00:00",
      dateEnd: "2024-01-25T18:00:00",
      registerLink: "https://gdg.community.dev/events/devfest",
      approved: true,
      participants: 892,
      prizes: "Swag & Networking",
      difficulty: "All Levels",
      tags: ["Conference", "Google", "AI/ML", "Cloud"]
    },
    {
      id: 4,
      title: "Blockchain Hackathon 2024",
      description: "48-hour hackathon focused on building innovative blockchain and Web3 solutions.",
      organizer: "Crypto Developers India",
      contactName: "Rahul Verma",
      contactEmail: "rahul@cryptodev.in",
      contactPhone: "+91-6543210987",
      locationName: "IIT Bombay",
      address: "Powai, Mumbai - 400076",
      mode: "In-Person",
      dateStart: "2024-02-10T18:00:00",
      dateEnd: "2024-02-12T18:00:00",
      registerLink: "https://blockchain-hack.dev",
      approved: false,
      participants: 0,
      prizes: "₹2,00,000",
      difficulty: "Intermediate to Advanced",
      tags: ["Hackathon", "Blockchain", "Web3", "Prizes"]
    }
  ];

  const upcomingEvents = events.filter(event => 
    new Date(event.dateStart) > new Date() && event.approved
  );
  
  const pastEvents = events.filter(event => 
    new Date(event.dateStart) <= new Date() && event.approved
  );

  const handleRegister = (eventTitle: string, registerLink: string) => {
    window.open(registerLink, '_blank');
    toast({
      title: "Opening Registration",
      description: `Redirecting to ${eventTitle} registration...`,
    });
  };

  const handleSubmitEvent = () => {
    toast({
      title: "Event Submitted!",
      description: "Your event has been submitted for admin approval.",
    });
  };

  const handleSetReminder = (eventTitle: string) => {
    toast({
      title: "Reminder Set",
      description: `You'll be notified before ${eventTitle} starts.`,
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-2">
            <Calendar className="w-8 h-8 text-secondary" />
            <h1 className="text-3xl font-heading font-bold">Events & Hackathons</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Discover coding contests, workshops, hackathons, and tech conferences. Join the community, learn from experts, and win exciting prizes.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming" className="text-neutral-200">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past" className="text-neutral-200">Past Events</TabsTrigger>
            <TabsTrigger value="submit" className="text-neutral-200">Submit Event</TabsTrigger>
          </TabsList>

          {/* Upcoming Events */}
          <TabsContent value="upcoming" className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {upcomingEvents.length} upcoming events
              </p>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendar View
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="card-interactive">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
                            {event.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            by {event.organizer}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-secondary" />
                          <Button variant="ghost" size="sm" onClick={() => handleSetReminder(event.title)}>
                            <Bell className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {new Date(event.dateStart).toLocaleDateString()} • 
                            {new Date(event.dateStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                            {new Date(event.dateEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{event.locationName} • {event.mode}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{event.participants} participants</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-secondary">
                            Prizes: {event.prizes}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {event.difficulty}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Learn More
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleRegister(event.title, event.registerLink)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Register
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {upcomingEvents.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No upcoming events</h3>
                  <p className="text-muted-foreground mb-4">
                    Check back soon for new events, or submit your own event for the community.
                  </p>
                  <Button onClick={() => setActiveTab("submit")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Event
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Past Events */}
          <TabsContent value="past" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pastEvents.map((event) => (
                <Card key={event.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">by {event.organizer}</p>
                        </div>
                        <Badge variant="outline">Completed</Badge>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(event.dateStart).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{event.participants} participants</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">{event.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-secondary">
                          Prizes: {event.prizes}
                        </div>
                        <Button variant="outline" size="sm">
                          View Results
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Submit Event */}
          <TabsContent value="submit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Submit New Event</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-accent" />
                    <span className="font-medium text-sm">Submission Guidelines</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• All event submissions require admin approval</li>
                    <li>• Provide accurate contact information</li>
                    <li>• Include detailed event description and agenda</li>
                    <li>• Events will be visible once approved</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="event-title">Event Title *</Label>
                      <Input id="event-title" placeholder="e.g. React Workshop 2024" />
                    </div>

                    <div>
                      <Label htmlFor="organizer">Organized By *</Label>
                      <Input id="organizer" placeholder="Organization or person name" />
                    </div>

                    <div>
                      <Label htmlFor="location-name">Location Name *</Label>
                      <Input id="location-name" placeholder="e.g. Tech Hub Bangalore, Online" />
                    </div>

                    <div>
                      <Label htmlFor="mode">Event Mode *</Label>
                      <select className="w-full p-2 border border-border rounded-lg bg-background">
                        <option value="">Select mode</option>
                        <option value="In-Person">In-Person</option>
                        <option value="Virtual">Virtual/Online</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="prizes">Prizes/Benefits</Label>
                      <Input id="prizes" placeholder="e.g. ₹50,000, Certificates, Swag" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="start-date">Start Date & Time *</Label>
                      <Input id="start-date" type="datetime-local" />
                    </div>

                    <div>
                      <Label htmlFor="end-date">End Date & Time *</Label>
                      <Input id="end-date" type="datetime-local" />
                    </div>

                    <div>
                      <Label htmlFor="register-link">Registration Link *</Label>
                      <Input id="register-link" placeholder="https://..." />
                    </div>

                    <div>
                      <Label htmlFor="contact-name">Contact Person *</Label>
                      <Input id="contact-name" placeholder="Primary contact name" />
                    </div>

                    <div>
                      <Label htmlFor="contact-email">Contact Email *</Label>
                      <Input id="contact-email" type="email" placeholder="contact@example.com" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Event Description *</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Provide detailed information about the event, agenda, target audience, etc."
                    className="min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Complete Address/Meeting Link</Label>
                  <Textarea 
                    id="address" 
                    placeholder="Full address for in-person events or meeting link for virtual events"
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input id="tags" placeholder="e.g. Workshop, React, Web Development" />
                </div>

                <Button onClick={handleSubmitEvent} className="w-full" size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Event for Approval
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;