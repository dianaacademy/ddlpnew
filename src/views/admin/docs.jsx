import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const DocumentTabs = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('admin');

  // PDF URLs (replace with your actual URLs)
  const pdfUrls = {
    admin: 'https://firebasestorage.googleapis.com/v0/b/ddlp-456ce.appspot.com/o/course_content%2FAdmin%20Document%20(PDF)%20(1).pdf?alt=media&token=eae36d51-cda0-4366-b3e5-7bf6b2fe20ae',
    student: 'https://firebasestorage.googleapis.com/v0/b/ddlp-456ce.appspot.com/o/course_content%2FStudent%20Document%20(PDF)%20(1).pdf?alt=media&token=26d937a1-7df8-4cc3-bc3b-a9d0e60a33fd',
    editor: 'https://firebasestorage.googleapis.com/v0/b/ddlp-456ce.appspot.com/o/course_content%2FStudent%20Document%20(PDF)%20(1).pdf?alt=media&token=26d937a1-7df8-4cc3-bc3b-a9d0e60a33fd'
  };

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentTab}-document.pdf`;
    link.click();
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs 
        defaultValue="admin" 
        className="w-full"
        onValueChange={setCurrentTab}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="admin">Admin Docs</TabsTrigger>
          <TabsTrigger value="student">Student Docs</TabsTrigger>
          <TabsTrigger value="editor">Editor Docs</TabsTrigger>
        </TabsList>

        {Object.keys(pdfUrls).map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <div className="border rounded-lg shadow-md p-4">
              <div className="flex justify-end mb-4">
                <button 
                  onClick={() => handleDownload(pdfUrls[tab])}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Download PDF
                </button>
              </div>
              
              {isLoading && (
                <div className="flex justify-center items-center h-[600px]">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                </div>
              )}
              
              <iframe 
                src={pdfUrls[tab]} 
                width="100%" 
                height="600px" 
                title={`${tab} Documents`}
                className={`border rounded ${isLoading ? 'hidden' : 'block'}`}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DocumentTabs;