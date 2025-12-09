import { useState, useEffect, useMemo } from "react";
import { Phone, Mail, Trash2, Search, Filter, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Letter {
  id: string;
  name: string;
  age: number | null;
  email: string | null;
  phone: string | null;
  behavior: string;
  wishlist: string;
  image_url: string | null;
  is_read: boolean;
  created_at: string;
}

interface AdminPanelProps {
  onExit: () => void;
}

const AdminPanel = ({ onExit }: AdminPanelProps) => {
  const { toast } = useToast();
  const [letters, setLetters] = useState<Letter[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [behaviorFilter, setBehaviorFilter] = useState<string>("all");
  const [readFilter, setReadFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchLetters();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("letters-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "santa_letters" },
        () => {
          fetchLetters();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLetters = async () => {
    const { data, error } = await supabase
      .from("santa_letters")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching letters",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setLetters(data || []);
  };

  const deleteLetter = async (id: string) => {
    const { error } = await supabase.from("santa_letters").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting letter",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Letter deleted" });
  };

  const toggleRead = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("santa_letters")
      .update({ is_read: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error updating letter",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredLetters = useMemo(() => {
    let result = [...letters];

    // Search filter
    if (searchTerm) {
      result = result.filter((letter) =>
        letter.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Behavior filter
    if (behaviorFilter !== "all") {
      result = result.filter((letter) => letter.behavior === behaviorFilter);
    }

    // Read status filter
    if (readFilter !== "all") {
      result = result.filter((letter) =>
        readFilter === "read" ? letter.is_read : !letter.is_read
      );
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [letters, searchTerm, behaviorFilter, readFilter, sortOrder]);

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <span className="bg-primary text-primary-foreground p-2 rounded-lg text-2xl">
              🎅
            </span>
            Santa's Admin Panel
          </h1>
          <div className="flex gap-4 items-center">
            <span className="text-muted-foreground font-medium">
              {letters.length} Letters Received
            </span>
            <Button variant="secondary" onClick={onExit}>
              Exit Workshop
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg p-4 mb-6 shadow-sm border border-border">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              <Filter size={18} className="text-muted-foreground" />
              
              <Select value={behaviorFilter} onValueChange={setBehaviorFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Behavior" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Behavior</SelectItem>
                  <SelectItem value="nice">Nice</SelectItem>
                  <SelectItem value="naughty">Naughty</SelectItem>
                </SelectContent>
              </Select>

              <Select value={readFilter} onValueChange={setReadFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Letters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLetters.map((letter) => (
            <div
              key={letter.id}
              className={`bg-card rounded-xl shadow-md overflow-hidden border border-border flex flex-col ${
                !letter.is_read ? "ring-2 ring-primary/50" : ""
              }`}
            >
              {/* Header */}
              <div
                className={`p-4 border-b flex justify-between items-start ${
                  letter.behavior === "nice" ? "bg-accent/10" : "bg-christmas-gold/20"
                }`}
              >
                <div>
                  <h3 className="font-bold text-lg text-foreground">
                    {letter.name}{" "}
                    {letter.age && (
                      <span className="text-sm font-normal text-muted-foreground">
                        ({letter.age} y/o)
                      </span>
                    )}
                  </h3>
                  <span
                    className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                      letter.behavior === "nice"
                        ? "bg-accent/20 text-accent"
                        : "bg-christmas-gold/30 text-foreground"
                    }`}
                  >
                    {letter.behavior}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleRead(letter.id, letter.is_read)}
                    title={letter.is_read ? "Mark as unread" : "Mark as read"}
                  >
                    {letter.is_read ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this letter?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The letter from {letter.name} will be permanently deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteLetter(letter.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-muted/50 px-4 py-3 border-b text-sm space-y-2">
                {letter.phone ? (
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <Phone size={14} className="text-primary" />
                    <a href={`tel:${letter.phone}`} className="hover:underline">
                      {letter.phone}
                    </a>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-xs italic">
                    No phone provided
                  </div>
                )}

                {letter.email ? (
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <Mail size={14} className="text-primary" />
                    <a href={`mailto:${letter.email}`} className="hover:underline">
                      {letter.email}
                    </a>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-xs italic">
                    No email provided
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex-1">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Wishlist:
                </h4>
                <p className="text-foreground italic whitespace-pre-wrap font-serif text-lg leading-relaxed">
                  "{letter.wishlist}"
                </p>
              </div>

              {/* Image */}
              {letter.image_url && (
                <div
                  className="h-48 bg-muted relative group cursor-pointer border-t border-border"
                  onClick={() => setSelectedImage(letter.image_url)}
                >
                  <img
                    src={letter.image_url}
                    alt="Drawing"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-card/80 px-2 py-1 rounded text-xs font-bold">
                      View Full
                    </span>
                  </div>
                </div>
              )}

              <div className="p-2 bg-muted/50 border-t text-center text-xs text-muted-foreground">
                Received:{" "}
                {new Date(letter.created_at).toLocaleString()}
              </div>
            </div>
          ))}

          {filteredLetters.length === 0 && (
            <div className="col-span-full text-center py-20 bg-card rounded-xl border border-dashed border-border">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-foreground">
                {letters.length === 0 ? "No letters yet!" : "No matching letters"}
              </h3>
              <p className="text-muted-foreground">
                {letters.length === 0
                  ? "Wait for the children to send their wishes."
                  : "Try adjusting your filters."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Drawing / Photo</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full size drawing"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
