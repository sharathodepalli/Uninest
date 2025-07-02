"use client";

import { Suspense } from "react";
import { MessagesContent } from "../messages/messages-content";

export default function MessagesPage() {
  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
