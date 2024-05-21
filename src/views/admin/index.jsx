import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"

function MainDashboard() {
  const { toast } = useToast()


  return (
    <div className="grid grid-cols-3 grid-flow-row mt-10 gap-6 mx-4">
<Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Total students</CardTitle>
      </CardHeader>
      <CardContent> 
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              234
            </div>
          </div>
        </form>
      </CardContent>
    </Card>

    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>cybersecurity students</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              134
            </div>
          </div>
        </form>
      </CardContent>
    </Card>


    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Diana junior</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              14
            </div>
          </div>
        </form>
      </CardContent>
    </Card>



    <Button
      onClick={() => {
        toast({
          title: "Scheduled: Catch up",
          description: "Friday, February 10, 2023 at 5:57 PM",
        })
      }}
    >
      Show Toast
    </Button>


    

    </div>
  )
}

export default MainDashboard;