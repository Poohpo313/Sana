import React from "react";
import Layout from "@/components/Layout";
import { Heart, Bell, Clock, Shield, Users, Mail, Phone, FileText, Calendar, CheckCircle, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AboutPage = () => {
  return (
    <Layout>
      <div className="space-y-8">
        {/* App Info Section */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="h-20 w-20 rounded-full bg-pink-100 flex items-center justify-center mb-4">
              <Heart className="h-10 w-10 text-pink-500" />
            </div>
            <h1 className="text-2xl font-bold text-center">Sana</h1>
            <p className="text-gray-500 text-center">Your personal medication reminder assistant</p>
            <p className="text-xs text-gray-400 mt-1">Version 1.0.0</p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">About Sana</h2>
            <p className="text-gray-600">
              Sana is a medication management application designed to help you track and remember your 
              medication schedules. We understand how challenging it can be to maintain complex medication 
              regimens, which is why we've created this simple but powerful tool.
            </p>
            <p className="text-gray-600">
              Our goal is to improve medication adherence through timely reminders and easy tracking, 
              helping you maintain better health outcomes without the stress of remembering when to take your medicines.
            </p>
          </div>
        </section>
        
        {/* Key Features Section */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-pink-100 rounded-lg p-4 hover:bg-pink-50 transition-colors">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <Bell className="h-5 w-5 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-medium">Medication Reminders</h3>
                  <p className="text-sm text-gray-600">Set up reminders for your daily, weekly or monthly medications</p>
                </div>
              </div>
            </div>
            
            <div className="border border-pink-100 rounded-lg p-4 hover:bg-pink-50 transition-colors">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <Calendar className="h-5 w-5 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-medium">Calendar Integration</h3>
                  <p className="text-sm text-gray-600">View your medication schedule in an easy-to-use calendar format</p>
                </div>
              </div>
            </div>
            
            <div className="border border-pink-100 rounded-lg p-4 hover:bg-pink-50 transition-colors">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <PenSquare className="h-5 w-5 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-medium">Medication Management</h3>
                  <p className="text-sm text-gray-600">Add, edit and delete your medications with an intuitive interface</p>
                </div>
              </div>
            </div>
            
            <div className="border border-pink-100 rounded-lg p-4 hover:bg-pink-50 transition-colors">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-medium">Adherence Tracking</h3>
                  <p className="text-sm text-gray-600">Mark medications as taken and track your adherence over time</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">How Sana Works</h2>
          
          <div className="space-y-4">
            <div className="flex items-start border-b border-pink-100 pb-4">
              <div className="h-8 w-8 bg-pink-100 rounded-full flex items-center justify-center mr-3 mt-1 shrink-0">
                <span className="text-pink-600 font-medium">1</span>
              </div>
              <div>
                <h3 className="font-medium">Create Your Profile</h3>
                <p className="text-sm text-gray-600 mt-1">Sign up with your name, age, and email to create your personal account</p>
              </div>
            </div>
            
            <div className="flex items-start border-b border-pink-100 pb-4">
              <div className="h-8 w-8 bg-pink-100 rounded-full flex items-center justify-center mr-3 mt-1 shrink-0">
                <span className="text-pink-600 font-medium">2</span>
              </div>
              <div>
                <h3 className="font-medium">Add Your Medications</h3>
                <p className="text-sm text-gray-600 mt-1">Enter the details of your medications including name, dosage, and schedule</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-8 w-8 bg-pink-100 rounded-full flex items-center justify-center mr-3 mt-1 shrink-0">
                <span className="text-pink-600 font-medium">3</span>
              </div>
              <div>
                <h3 className="font-medium">Get Reminders</h3>
                <p className="text-sm text-gray-600 mt-1">Receive notifications when it's time to take your medication</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Team Section */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Our Team</h2>
          <p className="text-gray-600 mb-6">Meet the people behind Sana</p>
          
          <div className="space-y-6">
            <div className="border-b border-pink-100 pb-4">
              <h3 className="font-medium text-lg">Mary Ecelle Cadorna</h3>
              <p className="text-sm text-pink-500 mb-2">Developer</p>
              <p className="text-sm text-gray-600">Focused on creating an accessible medication tracking system that works for users of all ages and abilities.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg">Anna Marie Basinang</h3>
              <p className="text-sm text-pink-500 mb-2">Developer</p>
              <p className="text-sm text-gray-600">Dedicated to developing the reminder system and ensuring reliable medication scheduling.</p>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-2 pb-16">
          © 2025 Sana. All rights reserved.<br />
          Made with care for your health.
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
