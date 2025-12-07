import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import StepsTracker from "@/components/StepsTracker";
import { Loader2, MapPin } from "lucide-react";

// ✅ AUTO SWITCH API BASE URL
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocalhost
  ? "http://localhost:5000/api"          // local dev
  : "http://64.227.146.210:5000/api";    // production = droplet IP


const USERS_URL = `${API_BASE_URL}/users`;



interface AddressType {
  _id?: string;
  fullName: string;
  mobile: string;
  pincode: string;
  houseNo: string;
  street: string;
  landmark?: string;
  locality: string;
  city: string;
  state: string;
  addressType: string;
}

const Address = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<AddressType>({
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

  const [savedAddresses, setSavedAddresses] = useState<AddressType[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingNew, setAddingNew] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Fetch saved addresses on load
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!token) return;
      try {
        const { data } = await axios.get(`${USERS_URL}/address`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedAddresses(data);
      } catch (err) {
        console.error("Error fetching addresses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [token]);

  // ✅ Use saved address
  const handleUseAddress = (addr: AddressType) => {
    localStorage.setItem("shippingAddress", JSON.stringify(addr));
    toast({ title: "Address Selected", description: "Proceeding to payment..." });
    navigate("/payment");
  };

  // ✅ Validation function
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

  // ✅ Handle new address submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      // Save to backend
      const { data } = await axios.post(`${API_BASE_URL}/address`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem("shippingAddress", JSON.stringify(formData));
      toast({ title: "Address Saved Successfully", description: "Proceeding to payment..." });
      navigate("/payment");
    } catch (error) {
      console.error("Error saving address:", error);
      toast({ title: "Error", description: "Failed to save address.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
        <p className="ml-3 text-gray-700">Loading your addresses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <StepsTracker currentStep={1} />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Delivery Address</h1>

        {/* ✅ Saved Addresses Section */}
        {savedAddresses.length > 0 && !addingNew && (
          <Card className="p-6 rounded-2xl shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
            <div className="space-y-4">
              {savedAddresses.map((addr) => (
                <div
                  key={addr._id}
                  className="border border-gray-200 p-4 rounded-lg flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="h-6 w-6 text-gray-500 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">{addr.fullName}</p>
                      <p className="text-gray-600 text-sm">{addr.mobile}</p>
                      <p className="text-gray-600 text-sm">
                        {addr.houseNo}, {addr.street}, {addr.locality}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      {addr.landmark && <p className="text-gray-500 text-sm">Landmark: {addr.landmark}</p>}
                      <p className="text-xs mt-1 text-gray-500 uppercase">{addr.addressType}</p>
                    </div>
                  </div>
                  <Button onClick={() => handleUseAddress(addr)} className="bg-primary hover:bg-primary/90">
                    Use this
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="mt-6 w-full"
              onClick={() => setAddingNew(true)}
            >
              + Add New Address
            </Button>
          </Card>
        )}

        {/* ✅ New Address Form */}
        {(addingNew || savedAddresses.length === 0) && (
          <Card className="p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
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
                Save & Continue to Payment
              </Button>
            </form>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Address;
