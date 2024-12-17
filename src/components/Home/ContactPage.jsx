import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Header from "../header";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    query: "",
    categories: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (category) => {
    setFormData((prev) => {
      const currentCategories = prev.categories;
      const newCategories = currentCategories.includes(category)
        ? currentCategories.filter(item => item !== category)
        : [...currentCategories, category];
      
      return { ...prev, categories: newCategories };
    });
  };

  const sendEmailNotification = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const categoryList = formData.categories.join(", ");
      const emailPayload = {
        toEmail: "manager@dianaadvancedtechacademy.uk",
        toName: "Diana ATA",
        subject: "New Contact Request",
        content: `
          <h1>New Contact Us Request</h1>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Detail Query:</strong> ${formData.query}</p>
          <p><strong>Selected Services:</strong> ${categoryList || "None"}</p>
        `
      };

      const response = await fetch("https://emailw.kkbharti555.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailPayload)
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          query: "",
          categories: []
        });
      } else {
        toast.error("Failed to send message. Try again!");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("An error occurred while sending your request");
    }
  };

  return (
    <div>
        <Header/>
    <div className="flex items-center justify-center min-h-screen bg-gray-50 pt-[130px]">
      <Toaster />
      <Card className="w-full h-full ">
        <div className="grid md:grid-cols-3">
          {/* Left Content */}
          <div className="bg-gray-100 p-[100px] md:col-span-1">
            <h2 className="text-2xl font-bold mb-4">Chat to us</h2>
            <p className="mb-4">Our friendly team is here to help.</p>
            <p>Email: <strong>dianaadvancedtechacademy@gmail.com</strong></p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Visit us</h2>
            <p className="mb-4">20th floor, 40 Bank St  <br /> London E14 5NR, United Kingdom</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Call us</h2>
            <p>+44 7441 441208</p>
          </div>

          {/* Form Section */}
          <div className="p-8 md:col-span-2">
            <div className="text-3xl text-center mb-6 font-bold">Got ideas? Let's team up.</div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendEmailNotification();
              }}
            >
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mb-4"
              />
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mb-4"
              />
              <Label htmlFor="query">Tell us more</Label>
              <Textarea
                id="query"
                placeholder="Tell us about the project..."
                name="query"
                value={formData.query}
                onChange={handleChange}
                rows={4}
                className="mb-4"
              />
              <h4 className="mb-2 font-semibold">How can we help?</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  "Courses",
                  "Academy Program Memberships",
                  "Academy Certifications",
                  "Payments",
                  "Refunds",
                  "Other"
                ].map((service, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-2 px-3 py-1 rounded-full"
                  >
                    <Checkbox
                      id={`category-${index}`}
                      checked={formData.categories.includes(service)}
                      onCheckedChange={() => handleCategoryChange(service)}
                    />
                    <Label 
                      htmlFor={`category-${index}`} 
                      className="cursor-pointer"
                    >
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
              <Button type="submit" className="w-full bg-black text-white py-2 mt-2">
                Let's get started!
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
    </div>
  );
};

export default ContactUsPage;