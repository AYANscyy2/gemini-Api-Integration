import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Linkedin, Send, Twitter } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-12 pb-6">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8 pb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">WiWiBot AI</h3>
            <p className="text-gray-400 mb-4">
              Advanced AI chatbot solutions for businesses of all sizes.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/10"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/10"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/10"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/10"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Subscribe</h3>
            <p className="text-gray-400 mb-4">
              Get the latest news and updates
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter your email"
                type="email"
                className="bg-white/10 border-white/10"
              />
              <Button className="bg-white text-black hover:bg-gray-200">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} WiWiBot AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
