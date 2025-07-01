'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { ChatSidebar } from '@/components/messages/chat-sidebar';
import { ChatWindow } from '@/components/messages/chat-window';
import { useAuth } from '@/hooks/use-auth';
import { useChat } from '@/hooks/use-chat';
import { Card } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

export default function MessagesPage() {
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
    const listingId = searchParams.get('listing');
    const hostId = searchParams.get('host');
    
    if (listingId && hostId && threads.length > 0) {
      const thread = threads.find(t => 
        t.listing_id === listingId && t.other_user.id === hostId
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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view messages</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ChatSidebar
              threads={threads}
              loading={loading}
              selectedThread={selectedThread}
              onSelectThread={setSelectedThread}
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
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}