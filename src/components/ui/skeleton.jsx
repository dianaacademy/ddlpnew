import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      className={cn(" m-10 rounded-md bg-zinc-100 dark:bg-zinc-800", className)}
      {...props} />)
  );
}

export { Skeleton }
