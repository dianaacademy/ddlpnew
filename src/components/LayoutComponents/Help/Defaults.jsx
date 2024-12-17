import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast, { Toaster } from 'react-hot-toast';

const DefaultAcc = () => {

 return ( 

      <div>
  <form className="space-y-4 " >
    <div>
      <Label htmlFor="name">Name</Label>
      <Input 
        id="name" 
        placeholder="Enter your name" 
        
      />
    </div>
    <div>
      <Label htmlFor="email">Email</Label>
      <Input 
        id="email" 
        type="email" 
        placeholder="Enter your email"
        
      />
    </div>
    <div>
      <Label htmlFor="phone">Phone Number</Label>
      <Input 
        id="phone" 
        type="tel" 
        placeholder="Enter your phone number"
       
      />
    </div>
    <div>
      <Label htmlFor="query">Submit your Query</Label>
      <Textarea 
        id="query" 
        type="text" 
        placeholder="Add your Query"
        
      />
    </div>
    <div>
      <Button type="submit">Submit</Button>
    </div>
  </form> 
  </div>

);
};

export default DefaultAcc;




