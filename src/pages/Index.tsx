import { useState } from "react";
import { Gift, Lock } from "lucide-react";
import Snowflakes from "@/components/Snowflakes";
import LetterForm from "@/components/LetterForm";
import SendingAnimation from "@/components/SendingAnimation";
import SuccessMessage from "@/components/SuccessMessage";
import AdminPanel from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";

type Step = "write" | "sending" | "sent";

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [step, setStep] = useState<Step>("write");
  const [submittedName, setSubmittedName] = useState("");

  const handleSuccess = (name: string) => {
    setSubmittedName(name);
    setStep("sent");
  };

  const handleReset = () => {
    setSubmittedName("");
    setStep("write");
  };

  const toggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      const password = prompt(
        "Ho Ho Ho! What is the secret Santa code? (Hint: hohoho)"
      );
      if (password && password.toLowerCase() === "hohoho") {
        setIsAdmin(true);
      } else if (password) {
        alert("Nice try, Grinch!");
      }
    }
  };

  if (isAdmin) {
    return <AdminPanel onExit={() => setIsAdmin(false)} />;
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 overflow-x-hidden relative">
      <Snowflakes />

      {/* Admin Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleAdmin}
        className="fixed bottom-4 right-4 bg-primary-foreground/10 hover:bg-primary-foreground/30 text-primary-foreground backdrop-blur rounded-full z-50 shadow-lg"
        title="Admin Access (Password: hohoho)"
      >
        <Lock size={20} />
      </Button>

      <div className="max-w-md w-full relative z-10 my-8">
        {/* Header */}
        {step !== "sent" && (
          <div className="text-center mb-6">
            <div className="bg-primary-foreground/20 backdrop-blur-md inline-block p-4 rounded-full mb-4 shadow-lg border-2 border-primary-foreground/30">
              <Gift size={48} className="text-primary-foreground drop-shadow-md" />
            </div>
            <h1
              className="text-4xl font-bold text-primary-foreground drop-shadow-md tracking-wide font-serif"
            >
              Dear Santa...
            </h1>
            <p className="text-primary-foreground/80 mt-2 font-medium">
              Make a wish for Christmas!
            </p>
          </div>
        )}

        {step === "write" && (
          <LetterForm
            onSuccess={handleSuccess}
            onSending={() => setStep("sending")}
          />
        )}

        {step === "sending" && <SendingAnimation />}

        {step === "sent" && (
          <SuccessMessage name={submittedName} onReset={handleReset} />
        )}
      </div>
    </div>
  );
};

export default Index;
