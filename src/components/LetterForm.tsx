import { useState } from "react";
import { Send, Star, Snowflake, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase-safe";
import { useToast } from "@/hooks/use-toast";

interface LetterFormProps {
  onSuccess: (name: string) => void;
  onSending: () => void;
}

const resizeImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 600;

        if (width > height && width > maxDim) {
          height *= maxDim / width;
          width = maxDim;
        } else if (height > maxDim) {
          width *= maxDim / height;
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Failed to resize image"));
          },
          "image/jpeg",
          0.8
        );
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const LetterForm = ({ onSuccess, onSending }: LetterFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    behavior: "nice",
    wishlist: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setBehavior = (type: "nice" | "naughty") => {
    setFormData((prev) => ({ ...prev, behavior: type }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.wishlist.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in your name and wishlist!",
        variant: "destructive",
      });
      return;
    }

    onSending();
    setIsLoading(true);

    try {
      const supabase = getSupabase();
      let imageUrl: string | null = null;

      // Upload image if exists
      if (imageFile) {
        const resizedBlob = await resizeImage(imageFile);
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("letter-images")
          .upload(fileName, resizedBlob, { contentType: "image/jpeg" });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("letter-images")
          .getPublicUrl(uploadData.path);
        
        imageUrl = urlData.publicUrl;
      }

      // Insert letter
      const { error } = await supabase.from("santa_letters").insert({
        name: formData.name.trim(),
        age: formData.age ? parseInt(formData.age) : null,
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        behavior: formData.behavior,
        wishlist: formData.wishlist.trim(),
        image_url: imageUrl,
      });

      if (error) throw error;

      setTimeout(() => {
        onSuccess(formData.name);
      }, 2000);
    } catch (error) {
      console.error("Error sending letter:", error);
      setIsLoading(false);
      toast({
        title: "Oh no!",
        description: "The snowstorm blocked the connection. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-2xl overflow-hidden border-4 border-christmas-gold">
      {/* Stamp Strip */}
      <div className="h-4 w-full flex">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-full ${i % 2 === 0 ? "bg-primary" : "bg-card"}`}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Name & Age */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Label className="text-sm font-bold text-muted-foreground mb-1">
              Your Name
            </Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Elf Buddy"
              required
            />
          </div>
          <div className="w-20">
            <Label className="text-sm font-bold text-muted-foreground mb-1">
              Age
            </Label>
            <Input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="8"
              className="text-center"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-bold text-muted-foreground mb-1">
              Phone Number
            </Label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="123-456-7890"
            />
          </div>
          <div>
            <Label className="text-sm font-bold text-muted-foreground mb-1">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="parent@example.com"
            />
          </div>
        </div>

        {/* Behavior Toggle */}
        <div>
          <Label className="text-sm font-bold text-muted-foreground mb-2 block">
            I have been...
          </Label>
          <div className="flex bg-muted p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setBehavior("nice")}
              className={`flex-1 py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                formData.behavior === "nice"
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Star
                size={16}
                className={formData.behavior === "nice" ? "fill-current" : ""}
              />
              Nice
            </button>
            <button
              type="button"
              onClick={() => setBehavior("naughty")}
              className={`flex-1 py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                formData.behavior === "naughty"
                  ? "bg-christmas-gold text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="rotate-180 transform">😈</span>
              A Bit Naughty
            </button>
          </div>
        </div>

        {/* The Wishlist */}
        <div className="relative">
          <Label className="text-sm font-bold text-muted-foreground mb-1 block">
            My Wishlist
          </Label>
          <Textarea
            name="wishlist"
            value={formData.wishlist}
            onChange={handleChange}
            placeholder="I would really like a puppy, a rocket ship, and world peace..."
            className="h-32 letter-paper leading-relaxed font-serif text-lg resize-none"
            required
          />
          <Snowflake
            className="absolute bottom-3 right-3 text-primary/20"
            size={24}
          />
        </div>

        {/* Image Upload */}
        <div>
          <Label className="text-sm font-bold text-muted-foreground mb-2 block">
            Drawings or Photos (Optional)
          </Label>
          <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:bg-muted/50 transition-colors relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {imagePreview ? (
              <div className="relative h-32 w-full rounded-lg overflow-hidden bg-muted">
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="bg-card/80 px-2 py-1 rounded text-sm font-bold">
                    Change Image
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground py-2">
                <Camera size={32} className="mb-2" />
                <span className="text-sm">Click to upload a picture</span>
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg"
        >
          <Send size={24} />
          {isLoading ? "Sending..." : "Send to North Pole"}
        </Button>
      </form>
    </div>
  );
};

export default LetterForm;
