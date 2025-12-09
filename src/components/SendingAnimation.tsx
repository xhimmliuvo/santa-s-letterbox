import { Send } from "lucide-react";

const SendingAnimation = () => {
  return (
    <div className="bg-card/90 backdrop-blur rounded-2xl p-8 text-center shadow-2xl border-4 border-christmas-gold min-h-[400px] flex flex-col items-center justify-center">
      <div className="animate-bounce mb-6">
        <div className="bg-primary/10 p-6 rounded-full inline-block">
          <Send size={48} className="text-primary animate-pulse" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-primary mb-2">
        Sending to North Pole...
      </h2>
      <div className="w-full bg-muted rounded-full h-4 max-w-[200px] mx-auto overflow-hidden">
        <div className="bg-primary h-4 rounded-full animate-progress" />
      </div>
      <p className="text-muted-foreground mt-4 text-sm animate-pulse">
        Checking list twice...
      </p>
    </div>
  );
};

export default SendingAnimation;
