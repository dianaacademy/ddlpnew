import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { useTransition } from "react";
import { db } from "@/firebase.config";
import { doc, deleteDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function DeleteAlert({ chapterId, onDelete }) {
  const { slug, moduleId } = useParams();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const chapterRef = doc(
        db,
        "courses",
        slug,
        "modules",
        moduleId,
        "chapters",
        chapterId
      );
      await deleteDoc(chapterRef);

      onDelete(chapterId);

      toast({
        title: "Chapter Deleted",
        description: "Chapter has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting chapter: ", error);
      toast({
        title: "Error",
        description: `There was an error deleting the chapter: ${error.message}`,
        status: "error",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="flex gap-2 items-center" variant="outline">
          <TrashIcon />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            chapter and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleDelete} variant="destructive">
              {isPending ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
