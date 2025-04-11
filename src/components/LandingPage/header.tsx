import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = ({
  handleSignUp
}: {
  handleSignUp: (label: string) => void;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignup, setIssignup] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-lg shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-black font-bold">AI</span>
            </div>
            <span className="text-white font-bold text-xl">WiWiBot</span>
          </a>

          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Documentation
            </a>
          </nav> */}

          <div className="hidden md:flex items-center space-x-2">
            <Button
              onClick={() => {
                handleSignUp("true");
                setIssignup(true);
              }}
              className={`${
                !isSignup
                  ? "bg-none text-white "
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              Sign up
            </Button>
            <Button
              onClick={() => {
                handleSignUp("false");
                setIssignup(false);
              }}
              className={`${
                isSignup
                  ? "bg-none text-white "
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              Login
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-b border-gray-800">
          <div className="container px-4 mx-auto py-4">
            <nav className="flex flex-col space-y-4">
              {/* 
              <a
                href="#features"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-md hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-md hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-md hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Documentation
              </a> */}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-800">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleSignUp("true");
                    setIsMobileMenuOpen(!isMobileMenuOpen);
                  }}
                  className="w-full justify-center text-black border-white/20 hover:bg-white/10"
                >
                  Sign up
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleSignUp("false");
                    setIsMobileMenuOpen(!isMobileMenuOpen);
                  }}
                  className="w-full justify-center bg-white text-black hover:bg-gray-200"
                >
                  Login
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
