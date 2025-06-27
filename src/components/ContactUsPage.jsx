import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Mail, Phone, MapPin, Send, Building, Clock } from 'lucide-react';


const ContactUsPage = ({ onBack }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Message Sent (Simulated) 📬",
      description: "Thank you for contacting us! We'll get back to you soon.",
    });
    e.target.reset();
  };
 
  const openInGoogleMaps = "https://example.com/facebook";


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-sky-600 to-indigo-700 text-white p-4 sm:p-8 flex flex-col items-center justify-center dark:from-sky-800 dark:to-indigo-900"
    >
      <div className="w-full max-w-5xl relative">
        <Button
          onClick={onBack}
          variant="ghost"
          className="absolute top-0 left-0 text-white hover:bg-white/20 p-2 sm:-top-4 sm:-left-4 dark:text-gray-300 dark:hover:bg-gray-700/50"
        >
          <ArrowLeft className="h-5 w-5 mr-1" /> Back
        </Button>

        <motion.h1 
          className="text-4xl sm:text-5xl font-extrabold mb-8 sm:mb-12 text-center dark:text-white"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Get In Touch
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl h-full dark:bg-gray-800/30 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white dark:text-gray-100">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-indigo-100 dark:text-gray-300">
                <div className="flex items-start space-x-3">
                  <Building className="h-6 w-6 text-sky-300 dark:text-sky-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white dark:text-gray-100">Our Office</h3>
                    <p>VoteSmart Headquarters, Chennai, India</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-sky-300 dark:text-sky-400" />
                  <a href="siva7305852@gmail.com" className="hover:text-sky-200 dark:hover:text-sky-300">siva7305852@gmail.com</a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-sky-300 dark:text-sky-400" />
                  <a href="tel:+1234567890" className="hover:text-sky-200 dark:hover:text-sky-300">+91 7305852492</a>
                </div>
                 <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-sky-300 dark:text-sky-400" />
                  <p>Response Time: Typically within 24-48 hours.</p>
                </div>
                <div className="h-64 sm:h-80 bg-gray-700 rounded-lg overflow-hidden border-2 border-sky-400/50 shadow-inner dark:border-sky-600/50">
                 <a href='https://example.com/facebook'> <img  
                    alt="Map showing the location of VoteSmart Headquarters"
                    className="w-full h-full object-cover opacity-80"
                   src="/image.jpg" />
                   </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl h-full dark:bg-gray-800/30 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white dark:text-gray-100">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nameContact" className="text-indigo-100 dark:text-gray-300">Full Name</Label>
                    <Input id="nameContact" placeholder="Your Name" required className="bg-white/5 border-white/20 text-white placeholder-indigo-200/70 focus:bg-white/10 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-100 dark:placeholder-white-400 dark:focus:bg-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailContact" className="text-indigo-100 dark:text-gray-300">Email Address</Label>
                    <Input id="emailContact" type="email" placeholder="your.email@example.com" required className="bg-white/5 border-white/20 text-white placeholder-indigo-200/70 focus:bg-white/10 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:bg-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subjectContact" className="text-indigo-100 dark:text-gray-300">Subject</Label>
                    <Input id="subjectContact" placeholder="Regarding..." required className="bg-white/5 border-white/20 text-white placeholder-indigo-200/70 focus:bg-white/10 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:bg-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="messageContact" className="text-indigo-100 dark:text-gray-300">Message</Label>
                    <Textarea id="messageContact" placeholder="Your message here..." rows={4} required className="bg-white/5 border-white/20 text-white placeholder-indigo-200/70 focus:bg-white/10 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:bg-gray-700" />
                  </div>
                  <Button type="submit" className="w-full bg-sky-400 hover:bg-sky-300 text-indigo-900 font-semibold py-3 text-base dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-white">
                    <Send className="mr-2 h-5 w-5" /> Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactUsPage;