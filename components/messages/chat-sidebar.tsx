'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatThread {
  listing_id: string;
  other_user: {
    id: string;
    name: string;
    photo_url: string | null;
  };
  last_message: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count: number;
}

interface ChatSidebarProps {
  threads: ChatThread[];
  loading: boolean;
  selectedThread: {
    listingId: string;
    otherUserId: string;
    otherUserName: string;
  } | null;
  onSelectThread: (thread: {
    listingId: string;
    otherUserId: string;
    otherUserName: string;
  }) => void;
}

export function ChatSidebar({ threads, loading, selectedThread, onSelectThread }: ChatSidebarProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {threads.length === 0 ? (
          <div className="p-6 text-center">
            <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {threads.map((thread) => (
              <div
                key={`${thread.listing_id}-${thread.other_user.id}`}
                className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors border-l-4 ${
                  selectedThread?.listingId === thread.listing_id && 
                  selectedThread?.otherUserId === thread.other_user.id
                    ? 'border-primary bg-muted/50'
                    : 'border-transparent'
                }`}
                onClick={() => onSelectThread({
                  listingId: thread.listing_id,
                  otherUserId: thread.other_user.id,
                  otherUserName: thread.other_user.name,
                })}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={thread.other_user.photo_url || ''} />
                    <AvatarFallback>
                      {thread.other_user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium truncate">{thread.other_user.name}</h4>
                      {thread.unread_count > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {thread.unread_count}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate">
                      {thread.last_message.content}
                    </p>
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(thread.last_message.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}