import { Snowflake, MapPin, Clock, CheckCircle } from "lucide-react";

interface OfficialTicketProps {
  ticketId: string;
  name: string;
  behavior: string;
  createdAt: string;
}

const OfficialTicket = ({ ticketId, name, behavior, createdAt }: OfficialTicketProps) => {
  return (
    <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl overflow-hidden shadow-xl relative">
      {/* Decorative dots */}
      <div className="absolute top-0 left-0 w-full h-3 flex justify-around">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-background rounded-full -mt-2" />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-3 flex justify-around">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-background rounded-full mt-2" />
        ))}
      </div>

      <div className="p-6 pt-8 pb-8">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Snowflake size={12} />
            Official Entry Ticket
          </div>
          <h3 className="text-2xl font-bold font-serif">Santa's Christmas Event</h3>
        </div>

        {/* Ticket Details */}
        <div className="bg-primary-foreground/10 rounded-lg p-4 space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-primary-foreground/70 text-sm">Ticket ID:</span>
            <span className="font-mono font-bold text-lg">#{ticketId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-primary-foreground/70 text-sm">Name:</span>
            <span className="font-bold">{name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-primary-foreground/70 text-sm">Santa's List:</span>
            <span className={`font-bold flex items-center gap-1 ${behavior === "nice" ? "text-accent" : "text-christmas-gold"}`}>
              <CheckCircle size={14} />
              {behavior === "nice" ? "NICE ✓" : "NAUGHTY (but forgiven)"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-primary-foreground/70 text-sm">Registered:</span>
            <span className="text-sm">{new Date(createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Event Details */}
        <div className="border-t border-primary-foreground/20 pt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} className="text-christmas-gold" />
            <span>Phungreitang, Opposite Electric Dept Office</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock size={16} className="text-christmas-gold" />
            <span>December 25th at Midnight</span>
          </div>
        </div>

        {/* QR Placeholder */}
        <div className="mt-4 text-center">
          <div className="inline-block bg-primary-foreground p-2 rounded-lg">
            <div className="w-16 h-16 bg-foreground/10 rounded flex items-center justify-center">
              <span className="text-2xl">🎅</span>
            </div>
          </div>
          <p className="text-xs text-primary-foreground/60 mt-2">
            Present this ticket at the event
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfficialTicket;
