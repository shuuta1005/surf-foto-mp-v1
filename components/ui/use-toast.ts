"use client";

//import * as React from "react";
import { toast as sonnerToast } from "sonner";

export function toast(props: {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}) {
  sonnerToast(props.title, {
    description: props.description,
    className:
      props.variant === "destructive" ? "bg-red-500 text-white" : undefined,
  });
}
