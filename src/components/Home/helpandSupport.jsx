import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import Header from "../header";
import { Label } from "@/components/ui/label";
import { AccordionHelp } from "../LayoutComponents/Help/HelpAccord";
import CommunityLinks from "../LayoutComponents/Help/SocialMedia";


import toast, { Toaster } from 'react-hot-toast';
import { Textarea } from "@/components/ui/textarea"

const SupportCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    query: "",
  });

  // Define handleInputChange first
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Define sendEmailNotification next
  const sendEmailNotification = async (category) => {
    // Validate form data
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const emailPayload = {
        toEmail: "manager@dianaadvancedtechacademy.uk",
        toName: "Diana ATA",
        subject: "Diana Support Request",
        content: `
          <h1>Diana Support Request Regarding ${category}  </h1>
          <p><strong>Category:</strong>${category}</p>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone}</p>
          <p><strong>Query:</strong> ${formData.query}</p>
        `
      };

      const response = await fetch("https://emailw.kkbharti555.workers.dev/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(emailPayload)
      });

      if (response.ok) {
        toast.success("Support request submitted successfully");
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          category: "",
          query: ""
        });
      } else {
        toast.error("Failed to submit support request");
      }
    } catch (error) {
      console.error("Email notification error:", error);
      toast.error("An error occurred while submitting your request");
    }
  };

  // Define handleSearch
  const handleSearch = () => {
    const results = categories.filter((category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredResults(results);
  };

  const categories = [
    {
      id: 1,
      title: "Access & Tech Support",
      image: "https://ik.imagekit.io/growthx100/pexels-olly-840996.webp?updatedAt=1733506298477",
    },
    {
      id: 2,
      title: "Payments",
      image: "https://ik.imagekit.io/growthx100/pexels-olly-840996.webp?updatedAt=1733506298477",
    },
    {
      id: 3,
      title: "Refunds",
      image: "https://ik.imagekit.io/growthx100/pexels-olly-840996.webp?updatedAt=1733506298477",
    },
  ];

  const CategSer = [
    {
      id: 1,
      title: "Community",
      image: "https://ik.imagekit.io/growthx100/pexels-olly-840996.webp?updatedAt=1733506298477",
      content: <CommunityLinks/>,
    },
    {
      id: 2,
      title: "Academy Program Memberships",
      image: "https://ik.imagekit.io/growthx100/pexels-olly-840996.webp?updatedAt=1733506298477",
      content: (
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          sendEmailNotification("Academy Program Memberships");
        }}>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              placeholder="Enter your name" 
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="query">Submit your Query</Label>
            <Textarea 
              id="query" 
              type="text" 
              placeholder="Add your Query"
              value={formData.query}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      ),
    },
    {
      id: 3,
      title: "Academy Certifications",
      image: "https://ik.imagekit.io/growthx100/pexels-olly-840996.webp?updatedAt=1733506298477",
      content: (
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          sendEmailNotification("Academy Certifications");
        }}>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              placeholder="Enter your name" 
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="query">Submit your Query</Label>
            <Textarea 
              id="query" 
              type="text" 
              placeholder="Add your Query"
              value={formData.query}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      ),
    },
  ];

  return (
    <div>
      <Header />
      <div className="p-8 space-y-8 mx-48 pt-[9%]">
        {/* Add Toaster component for notifications */}
        <Toaster position="top-right" />

        <h1 className="text-12xl font-bold text-center mt-10">
          Welcome to the Diana Advanced Tech Support Centre!
        </h1>
        <h1 className="text-xl text-center font-light">
          Your one-stop solution for all your queries and support needs.
        </h1>

        {/* Search Section */}
        <div className="flex justify-center space-x-4 ">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-1/2"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={handleSearch}>Search</Button>
            </DialogTrigger>
            <DialogContent>
              <h2 className="text-lg font-bold">Search Results</h2>
              <ul className="mt-4 space-y-2">
                {filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <li key={result.id} className="p-2 border rounded-md">
                      {result.title}
                    </li>
                  ))
                ) : (
                  <p>No results found.</p>
                )}
              </ul>
            </DialogContent>
          </Dialog>
        </div>

        {/* Services Section */}
        <div className="grid grid-cols-3 gap-4">
          {CategSer.map((service) => (
            <Card
              key={service.id}
              className="cursor-pointer"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <div>
                    <img
                      src={service.image}
                      alt={service.title}
                      className="rounded-md"
                    />
                    <h3 className="text-center font-light text-xl mt-2 ">
                      {service.title}
                    </h3>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <h2 className="text-lg font-bold">{service.title}</h2>
                  {service.content}
                </DialogContent>
              </Dialog>
            </Card>
          ))}
        </div>

        {/* Support Categories Section */}
        <div className="grid grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="cursor-pointer"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <div>
                    <img
                      src={category.image}
                      alt={category.title}
                      className="rounded-md"
                    />
                    <h3 className="text-center font-light text-xl mt-2 ">
                      {category.title}
                    </h3>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <h2 className="text-lg font-bold">{category.title}</h2>
                  <form className="space-y-4 " onSubmit={(e) => {
                    e.preventDefault();
                    sendEmailNotification(category.title);
                  }}>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Enter your name" 
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="query">Submit your Query</Label>
                      <Textarea 
                        id="query" 
                        type="text" 
                        placeholder="Add your Query"
                        value={formData.query}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Button type="submit">Submit</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </Card>
          ))}
        </div>
        <AccordionHelp/>
      </div>
    </div>
  );
};

export default SupportCenterPage;