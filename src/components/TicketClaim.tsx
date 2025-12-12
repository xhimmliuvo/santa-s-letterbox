import { useState } from "react";
import { Ticket, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getSupabase } from "@/lib/supabase-safe";
import { useToast } from "@/hooks/use-toast";
import OfficialTicket from "./OfficialTicket";

interface TicketData {
  id: string;
  name: string;
  behavior: string;
  created_at: string;
}

const TicketClaim = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);

  const searchTicket = async () => {
    if (!phone.trim()) {
      toast({
        title: "Enter phone number",
        description: "Please enter the phone number used when submitting the letter.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("santa_letters")
        .select("id, name, behavior, created_at")
        .eq("phone", phone.trim())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        toast({
          title: "No letter found",
          description: "We couldn't find a letter with this phone number.",
          variant: "destructive",
        });
        setTicketData(null);
      } else {
        setTicketData(data);
      }
    } catch (err) {
      console.error("Error searching:", err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPhone("");
    setTicketData(null);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-christmas-gold/20 border-christmas-gold text-foreground hover:bg-christmas-gold/40"
          onClick={() => setOpen(true)}
        >
          <Ticket size={18} />
          Get Your Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Ticket size={20} />
            Claim Your Official Ticket
          </DialogTitle>
        </DialogHeader>

        {!ticketData ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter the phone number you used when sending your letter to Santa.
            </p>
            <div className="flex gap-2">
              <Input
                type="tel"
                placeholder="Your phone number..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchTicket()}
              />
              <Button onClick={searchTicket} disabled={loading}>
                <Search size={18} />
                {loading ? "..." : "Find"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <OfficialTicket
              ticketId={ticketData.id.slice(0, 8).toUpperCase()}
              name={ticketData.name}
              behavior={ticketData.behavior}
              createdAt={ticketData.created_at}
            />
            <Button variant="outline" onClick={handleClose} className="w-full">
              <X size={18} />
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TicketClaim;
