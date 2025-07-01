'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { useChat } from '@/hooks/use-chat';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export function MessagesOverview() {
  const { threads, loading } = useChat();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentThreads = threads.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Messages</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/messages">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentThreads.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentThreads.map((thread) => (
              <div
                key={`${thread.listing_id}-${thread.other_user.id}`}
                className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
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

                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/messages?listing=${thread.listing_id}&host=${thread.other_user.id}`}>
                    Reply
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}