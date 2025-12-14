import { useState } from "react";
import { Gift, Lock } from "lucide-react";
import Snowflakes from "@/components/Snowflakes";
import LetterForm from "@/components/LetterForm";
import SendingAnimation from "@/components/SendingAnimation";
import SuccessMessage from "@/components/SuccessMessage";
import AdminPanel from "@/components/AdminPanel";
import TicketClaim from "@/components/TicketClaim";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Step = "write" | "sending" | "sent";

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [step, setStep] = useState<Step>("write");
  const [submittedName, setSubmittedName] = useState("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

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
      setShowPasswordDialog(true);
      setPassword("");
      setPasswordError(false);
    }
  };

  const handlePasswordSubmit = () => {
    if (password === "000000") {
      setIsAdmin(true);
      setShowPasswordDialog(false);
      setPassword("");
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  if (isAdmin) {
    return <AdminPanel onExit={() => setIsAdmin(false)} />;
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 overflow-x-hidden relative">
      <Snowflakes />

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock size={18} />
              Admin Access
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
              className={passwordError ? "border-destructive" : ""}
            />
            {passwordError && (
              <p className="text-sm text-destructive">Nice try, Grinch! Wrong password.</p>
            )}
            <Button onClick={handlePasswordSubmit} className="w-full">
              Enter
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Admin Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleAdmin}
        className="fixed bottom-4 right-4 bg-primary-foreground/10 hover:bg-primary-foreground/30 text-primary-foreground backdrop-blur rounded-full z-50 shadow-lg"
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
            <h1 className="text-4xl font-bold text-primary-foreground drop-shadow-md tracking-wide font-serif">
              Dear Santa...
            </h1>
            <p className="text-primary-foreground/80 mt-2 font-medium">
              Make a wish for Christmas!
            </p>
            <div className="mt-4">
              <TicketClaim />
            </div>
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

      {/* Footer Branding */}
      <div className="fixed bottom-4 left-0 right-0 text-center z-40">
        <span className="bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full text-primary-foreground/70 text-sm font-medium">
          Santa x Dynamic Edu Collab
        </span>
      </div>
    </div>
  );
};

export default Index;
