import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  export function AccordionHelp() {
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is online Learning Like ?</AccordionTrigger>
          <AccordionContent className= "pl-[0px]">
          An online course degree is similar to taking a degree program on campus. Attending a live instructional course will be similar to attending a lecture but in the comfort of your location.  Our Academy and your course instructor will determine the format for each course and will select the best-suited curriculum and projects for your course or program.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What are the Technology requirements to take online courses?</AccordionTrigger>
          <AccordionContent className= "pl-[5px]">
          You will need a computer, a high-speed Internet connection, a newer version of a web browser, and access to common tools and software like word processors, email, etc. Some courses may have other software or technology requirements as well. If there are special labs included all you need is to follow your trainer’s instruction to log in to our virtual labs.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Can i learn at own place?</AccordionTrigger>
          <AccordionContent className= "pl-[0px]">
          We are yet to introduce courses with Self-paced learning means you can learn in your own time and schedule. There is no need to complete the assignments and take the courses at the same time as other learners.  The reason why we are choosing live instructional training over self-paced is the alignment of our students to complete and get their certifications on time for their placements or project placements at their respective organizations.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Can i found more about these courses?</AccordionTrigger>
          <AccordionContent className= "pl-[0px]">
          The courses are detailed in the course offerings under “Our Courses”  For further information, please contact DIANA ACADEMY for Online Learning.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>Does online learning really works ?</AccordionTrigger>
          <AccordionContent className= "pl-[0px]">
          Online learning is not only more effective for students, but it is also better for the environment. Online courses consume 90% less energy and release 85% less CO2 per student than traditional in-person courses, according to the Open University in the United Kingdom. Online learning and multimedia material become more effective instructional tools as a result of this. Individuals and businesses can profit from helping the environment and sticking to their own environmental goals by encouraging and engaging with this form of learning.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }
  