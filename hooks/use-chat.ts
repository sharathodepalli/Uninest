'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import { useAuth } from './use-auth';

type Message = Database['public']['Tables']['messages']['Row'] & {
  sender: {
    name: string;
    photo_url: string | null;
  };
};

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

export function useChat(listingId?: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch messages for a specific listing
  const fetchMessages = useCallback(async (targetListingId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (
            name,
            photo_url
          )
        `)
        .eq('listing_id', targetListingId)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data as Message[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch chat threads
  const fetchThreads = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get all messages involving the current user
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          listings:listing_id (
            title,
            host_id
          ),
          sender:sender_id (
            id,
            name,
            photo_url
          ),
          receiver:receiver_id (
            id,
            name,
            photo_url
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Group messages by listing and other user
      const threadMap = new Map<string, ChatThread>();
      
      messagesData?.forEach((message: any) => {
        const otherUser = message.sender_id === user.id ? message.receiver : message.sender;
        const threadKey = `${message.listing_id}-${otherUser.id}`;
        
        if (!threadMap.has(threadKey)) {
          threadMap.set(threadKey, {
            listing_id: message.listing_id,
            other_user: otherUser,
            last_message: {
              content: message.content,
              created_at: message.created_at,
              sender_id: message.sender_id,
            },
            unread_count: message.sender_id !== user.id && !message.read_at ? 1 : 0,
          });
        } else {
          const thread = threadMap.get(threadKey)!;
          if (message.sender_id !== user.id && !message.read_at) {
            thread.unread_count++;
          }
        }
      });

      setThreads(Array.from(threadMap.values()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Send a message
  const sendMessage = async (listingId: string, receiverId: string, content: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          listing_id: listingId,
          sender_id: user.id,
          receiver_id: receiverId,
          content,
        })
        .select(`
          *,
          sender:sender_id (
            name,
            photo_url
          )
        `)
        .single();

      if (error) throw error;

      // Add to local messages if viewing this conversation
      if (listingId === listingId) {
        setMessages(prev => [...prev, data as Message]);
      }

      // Update threads
      fetchThreads();

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  // Mark messages as read
  const markAsRead = async (listingId: string, senderId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('listing_id', listingId)
        .eq('sender_id', senderId)
        .eq('receiver_id', user.id)
        .is('read_at', null);

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.listing_id === listingId && msg.sender_id === senderId && msg.receiver_id === user.id
          ? { ...msg, read_at: new Date().toISOString() }
          : msg
      ));

      // Update threads
      fetchThreads();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user || !listingId) return;

    const channel = supabase
      .channel(`messages:${listingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `listing_id=eq.${listingId}`,
        },
        async (payload) => {
          // Fetch the complete message with sender info
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              sender:sender_id (
                name,
                photo_url
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setMessages(prev => [...prev, data as Message]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, listingId]);

  // Initial data fetch
  useEffect(() => {
    if (listingId) {
      fetchMessages(listingId);
    } else {
      fetchThreads();
    }
  }, [listingId, fetchMessages, fetchThreads]);

  return {
    messages,
    threads,
    loading,
    error,
    sendMessage,
    markAsRead,
    refetchMessages: () => listingId && fetchMessages(listingId),
    refetchThreads: fetchThreads,
  };
}