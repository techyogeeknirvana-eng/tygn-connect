import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, FileText, AlertTriangle } from 'lucide-react';
import NotesContributeForm from '@/components/NotesContributeForm';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Notes = () => {
  const [driveError, setDriveError] = useState(false);
  const [showContributeForm, setShowContributeForm] = useState(false);
  const notesMirrorUrl = import.meta.env.VITE_NOTES_MIRROR_URL;

  useEffect(() => {
    AOS.init({ 
      once: true, 
      duration: 700, 
      easing: 'ease-out-quart' 
    });
  }, []);

  const handleDriveOpen = () => {
    const driveUrl = 'https://drive.google.com/drive/folders/1-tXGUSeXXurQkyU7jxzJGuDEdQK9C1bA';
    try {
      window.open(driveUrl, '_blank', 'noopener,noreferrer');
      // Check if drive opened successfully (basic check)
      setTimeout(() => {
        if (window.closed === false) {
          // If window is still open, assume success
          setDriveError(false);
        }
      }, 1000);
    } catch (error) {
      console.error('Failed to open drive:', error);
      setDriveError(true);
    }
  };

  const handleMirrorOpen = () => {
    if (notesMirrorUrl) {
      window.open(notesMirrorUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (showContributeForm) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <NotesContributeForm onClose={() => setShowContributeForm(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tygn-bg">
      
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12" data-aos="fade-up">
          <div className="inline-flex items-center space-x-2 bg-tygn-blue/10 text-tygn-blue px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            <span className="uppercase tracking-wide">Study Notes</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-tygn-blue uppercase tracking-wide mb-6">
            Access Study Materials
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Browse our comprehensive collection of study notes, organized by subjects and semesters. 
            All materials are contributed by the community to help fellow students succeed.
          </p>
        </div>

        {/* Main Action Card */}
        <Card className="mb-8 shadow-lg" data-aos="fade-up" data-aos-delay="200">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-tygn-blue uppercase tracking-wide">
              Drive Access
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-tygn-blue/5 rounded-lg p-6">
              <FileText className="w-16 h-16 text-tygn-blue mx-auto mb-4" />
              <p className="text-gray-600 mb-6">
                Access our complete collection of study materials organized by semester and subject.
              </p>
              
              <Button
                onClick={handleDriveOpen}
                size="lg"
                className="bg-tygn-yellow text-tygn-blue font-bold hover:scale-105 transition-all duration-300 uppercase tracking-wide px-8 py-4 rounded-full shadow-lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Open Notes Drive
              </Button>
            </div>

            {/* Fallback Section */}
            {driveError && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4" data-aos="fade-in">
                <div className="flex items-center gap-2 text-orange-700 mb-3">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Drive Access Issue</span>
                </div>
                <p className="text-orange-600 text-sm mb-4">
                  It looks like Google Drive might be blocked on your network or there's a connection issue. 
                  Try again later or use the alternate link below if available.
                </p>
                
                {notesMirrorUrl && (
                  <Button
                    onClick={handleMirrorOpen}
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Try Alternate Link
                  </Button>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="bg-gray-50 rounded-lg p-6 text-left">
              <h3 className="font-bold text-tygn-blue mb-3 uppercase tracking-wide">How to Use:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-tygn-yellow rounded-full mt-2 flex-shrink-0" />
                  <span>Browse folders by semester and subject</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-tygn-yellow rounded-full mt-2 flex-shrink-0" />
                  <span>Download notes in PDF format</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-tygn-yellow rounded-full mt-2 flex-shrink-0" />
                  <span>Contribute by uploading your own notes</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-tygn-yellow rounded-full mt-2 flex-shrink-0" />
                  <span>Join our WhatsApp group for updates</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-lg" data-aos="fade-up" data-aos-delay="300">
            <CardContent className="p-6">
              <h3 className="font-bold text-tygn-blue mb-3 uppercase tracking-wide">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Can't find what you're looking for? Join our community for assistance.
              </p>
              <Button 
                variant="outline" 
                className="w-full border-tygn-blue text-tygn-blue hover:bg-tygn-blue hover:text-white"
                onClick={() => window.open('https://chat.whatsapp.com/KFUYpSAMVOr0TtuUWqSBpZ', '_blank')}
              >
                Join WhatsApp Group
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg" data-aos="fade-up" data-aos-delay="400">
            <CardContent className="p-6">
              <h3 className="font-bold text-tygn-blue mb-3 uppercase tracking-wide">Contribute</h3>
              <p className="text-gray-600 text-sm mb-4">
                Help fellow students by sharing your notes and study materials.
              </p>
              <Button 
                variant="outline" 
                className="w-full border-tygn-yellow text-tygn-blue hover:bg-tygn-yellow hover:text-tygn-blue"
                onClick={() => setShowContributeForm(true)}
              >
                Upload Notes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default Notes;