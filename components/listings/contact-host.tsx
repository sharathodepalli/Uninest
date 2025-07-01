'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageCircle, Send } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ContactHostProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    id: string;
    host_id: string;
    title: string;
  };
  hostName: string;
}

export function ContactHost({ isOpen, onClose, listing, hostName }: ContactHostProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSendMessage = async () => {
    if (!user) {
      toast.error('Please sign in to send messages');
      router.push('/auth/signin');
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSending(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          listing_id: listing.id,
          sender_id: user.id,
          receiver_id: listing.host_id,
          content: message.trim(),
        });

      if (error) throw error;

      toast.success('Message sent successfully!');
      setMessage('');
      onClose();
      
      // Redirect to messages page
      router.push(`/messages?listing=${listing.id}&host=${listing.host_id}`);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const defaultMessage = `Hi ${hostName},

I'm interested in your listing "${listing.title}". Could you please provide more information about the property and availability?

Thank you!`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Contact {hostName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder={defaultMessage}
              value={message || defaultMessage}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="mt-2"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={sending}>
              {sending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}