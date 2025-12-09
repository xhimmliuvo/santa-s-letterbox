import { CheckCircle, RefreshCcw, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessMessageProps {
  name: string;
  imageUrl?: string | null;
  onReset: () => void;
}

const SuccessMessage = ({ name, imageUrl, onReset }: SuccessMessageProps) => {
  return (
    <div className="relative group">
      {/* The Envelope / Success Card */}
      <div className="bg-christmas-cream p-8 rounded-lg shadow-2xl border-2 border-border relative overflow-hidden transform transition-all duration-500 hover:-rotate-1">
        {/* North Pole Stamp */}
        <div className="absolute top-4 right-4 transform rotate-12 opacity-80 border-4 border-primary rounded-full w-24 h-24 flex items-center justify-center text-primary font-bold text-xs uppercase tracking-widest text-center leading-tight p-2">
          <div className="absolute inset-0 border-2 border-primary rounded-full m-1 border-dashed" />
          North Pole
          <br />
          Post
          <br />
          DEC 25
        </div>

        {/* Official Seal */}
        <div className="absolute top-4 left-4 text-accent opacity-20">
          <Snowflake size={64} />
        </div>

        <div className="mt-8 mb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 text-accent rounded-full mb-4">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-3xl font-bold text-foreground font-serif">
            Message Sent!
          </h2>
          <p className="text-muted-foreground italic mt-2">
            Santa has received your letter.
          </p>
        </div>

        <div className="bg-card border border-border p-4 rounded shadow-sm rotate-1 max-w-xs mx-auto mb-6 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary rounded-full border-4 border-card shadow-sm z-10" />
          <p className="font-serif text-lg text-foreground leading-relaxed text-center">
            "Ho Ho Ho! Thank you for your letter,{" "}
            <span className="font-bold text-primary">{name}</span>! The elves
            will start working right away!"
          </p>
          <p
            className="text-right text-xl text-primary mt-4 pr-4 font-bold font-serif"
          >
            - Santa Claus
          </p>
        </div>

        {imageUrl && (
          <div className="mb-6 border-4 border-card shadow-lg -rotate-2 w-32 h-32 mx-auto bg-muted overflow-hidden rounded-lg">
            <img
              src={imageUrl}
              alt="Your upload"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <Button
          onClick={onReset}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3"
        >
          <RefreshCcw size={18} />
          Send Another Letter
        </Button>
      </div>

      {/* Decorative background behind card */}
      <div className="absolute -z-10 top-2 -right-2 w-full h-full bg-primary/20 rounded-lg transform rotate-2" />
    </div>
  );
};

export default SuccessMessage;
