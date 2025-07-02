"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { ChatSidebar } from "@/components/messages/chat-sidebar";
import { ChatWindow } from "@/components/messages/chat-window";
import { useAuth } from "@/hooks/use-auth";
import { useChat } from "@/hooks/use-chat";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export function MessagesContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [selectedThread, setSelectedThread] = useState<{
    listingId: string;
    otherUserId: string;
    otherUserName: string;
  } | null>(null);

  const { threads, loading } = useChat();

  useEffect(() => {
    // Auto-select thread from URL params
    const listingId = searchParams.get("listing");
    const hostId = searchParams.get("host");

    if (listingId && hostId && threads.length > 0) {
      const thread = threads.find(
        (t) => t.listing_id === listingId && t.other_user.id === hostId
      );

      if (thread) {
        setSelectedThread({
          listingId: thread.listing_id,
          otherUserId: thread.other_user.id,
          otherUserName: thread.other_user.name,
        });
      }
    }
  }, [searchParams, threads]);

  if (!user) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Messages</h1>
            <p className="text-muted-foreground">
              Please sign in to view your messages.
            </p>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <ChatSidebar
              threads={threads}
              selectedThread={selectedThread}
              onSelectThread={setSelectedThread}
              loading={loading}
            />
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3">
            {selectedThread ? (
              <ChatWindow
                listingId={selectedThread.listingId}
                otherUserId={selectedThread.otherUserId}
                otherUserName={selectedThread.otherUserName}
              />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the sidebar to start messaging.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
