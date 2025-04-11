"use client";
import React, { useState } from "react";
// import Header from "@/components/Header";
// import HeroSection from "@/components/HeroSection";
// import LoginForm from "@/components/LoginForm";
// import FeaturesSection from "@/components/FeaturesSection";
// import TestimonialsSection from "@/components/TestimonialsSection";
// import ChatDemoSection from "@/components/ChatDemoSection";
// import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Header from "@/components/LandingPage/header";
import LoginForm from "@/components/LandingPage/loginForm";
import ChatDemoSection from "@/components/LandingPage/chatDemoSection";
import SignUpForm from "@/components/LandingPage/signupForm";

const Index = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleIsSignUp = (label: string) => {
    if (label === "true") setIsSignUp(true);

    if (label === "false") setIsSignUp(false);
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <Header handleSignUp={handleIsSignUp} />

      <main>
        <div className="pt-24 md:pt-32 pb-20 relative">
          <div className="absolute inset-0 bg-gradient-radial from-gray-900/20 via-gray-900/10 to-transparent pointer-events-none"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full filter blur-3xl animate-pulse"></div>
          <div
            className="absolute top-40 right-10 w-72 h-72 bg-white/5 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1/3 bg-gradient-to-t from-white/5 via-gray-600/5 to-transparent rounded-full filter blur-3xl"></div>

          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Experience the Future of Conversations
                </h1>
                <p className="text-xl text-gray-400 mb-8 max-w-lg mx-auto md:mx-0">
                  Our AI chatbot provides intelligent, natural conversations
                  that transform how you interact with technology.
                </p>
                <div className="hidden md:block">
                  <Button className="bg-white text-black hover:bg-gray-200 py-6 px-8 text-lg rounded-xl">
                    Try It Now
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                {isSignUp ? <SignUpForm /> : <LoginForm />}
              </div>
            </div>
          </div>
        </div>
      </main>
      <ChatDemoSection />
      {/* Other sections */}
      {/* <FeaturesSection />
        
        <TestimonialsSection />
    
      
      <Footer /> */}
    </div>
  );
};

export default Index;
