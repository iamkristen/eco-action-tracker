
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, LogIn, UserPlus } from "lucide-react";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import { useAuth } from "@/contexts/AuthContext";

const AuthButtons = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  // Display user profile menu or login/signup buttons
  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-2">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-eco-medium flex items-center justify-center text-white">
                {user.name.charAt(0)}
              </div>
            )}
            <span className="text-sm font-medium hidden md:inline-block">
              {user.name}
            </span>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={logout}
          className="border-eco-medium hover:bg-eco-light hover:text-eco-dark"
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="border-eco-medium hover:bg-eco-light hover:text-eco-dark"
          onClick={() => setShowLoginModal(true)}
        >
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Button>
        <Button 
          size="sm" 
          className="bg-eco-gradient hover:shadow-md"
          onClick={() => setShowSignupModal(true)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Sign up
        </Button>
      </div>

      <LoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal}
        onShowSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />
      
      <SignupModal 
        open={showSignupModal} 
        onOpenChange={setShowSignupModal}
        onShowLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
};

export default AuthButtons;
