"use client";

import { Upload } from "lucide-react";

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

interface PublishDialogProps {
  title:string;
  onPublish:()=>Promise<void>;
  disabled?:boolean;
}

export default function PublishDialog({
  title,
  onPublish,
  disabled,
}:PublishDialogProps){

  return (
    <AlertDialog>

      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
        >
          <Upload className="mr-2 h-4 w-4"/>
          Publish
        </Button>
      </AlertDialogTrigger>


      <AlertDialogContent>

        <AlertDialogHeader>

          <AlertDialogTitle>
            Publish this update?
          </AlertDialogTitle>

          <AlertDialogDescription>
            You are publishing:
            <strong className="mx-1">
              {title}
            </strong>

            <br/>

            This update will become visible on your public changelog.
          </AlertDialogDescription>

        </AlertDialogHeader>


        <AlertDialogFooter>

          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>


          <AlertDialogAction
            onClick={onPublish}
          >
            Publish
          </AlertDialogAction>


        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>
  );
}