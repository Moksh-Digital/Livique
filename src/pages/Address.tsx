import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import StepsTracker from "@/components/StepsTracker";

const Address = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    pincode: "",
    houseNo: "",
    street: "",
    landmark: "",
    locality: "",
    city: "",
    state: "",
    addressType: "home",
  });

  const validateForm = () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    const pinRegex = /^\d{6}$/;
    if (!phoneRegex.test(formData.mobile)) {
      toast({ title: "Invalid Mobile Number", description: "Enter a valid 10-digit number.", variant: "destructive" });
      return false;
    }
    if (!pinRegex.test(formData.pincode)) {
      toast({ title: "Invalid Pincode", description: "Enter a valid 6-digit pincode.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    localStorage.setItem("shippingAddress", JSON.stringify(formData));
    toast({
      title: "Address Saved Successfully",
      description: "Proceeding to payment...",
    });
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
        <StepsTracker currentStep={1} />




      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Delivery Address</h1>

        <Card className="p-6 rounded-2xl shadow-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name</label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter full name"
                  className="h-12 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Mobile Number</label>
                <Input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="h-12 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Pincode</label>
                <Input
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="6-digit pincode"
                  className="h-12 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">City</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter city"
                  className="h-12 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">State</label>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Enter state"
                  className="h-12 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">House / Flat No.</label>
                <Input
                  value={formData.houseNo}
                  onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                  placeholder="E.g. 27A or Flat 501"
                  className="h-12 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Street / Apartment</label>
                <Input
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="E.g. MG Road, Sunshine Apartments"
                  className="h-12 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Locality / Area</label>
                <Input
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  placeholder="E.g. Indiranagar, Sector 21"
                  className="h-12 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Landmark (Optional)</label>
                <Input
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="E.g. Near City Mall or Opposite SBI Bank"
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">Address Type</label>
              <RadioGroup
                value={formData.addressType}
                onValueChange={(val) => setFormData({ ...formData, addressType: val })}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="home" id="home" />
                  <Label htmlFor="home">Home</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="work" id="work" />
                  <Label htmlFor="work">Work</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90">
              Continue to Payment
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default Address;
