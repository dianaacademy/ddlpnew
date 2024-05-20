import React from "react"
import { Calendar } from "@/components/ui/calendar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

function Navbar() {
  const [date, setDate] = React.useState("")


  return (
    <div>
      <HoverCard>
  <HoverCardTrigger>Hover</HoverCardTrigger>
  <HoverCardContent>
  <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  </HoverCardContent>
</HoverCard>
    
    </div>
  )
}

export default Navbar