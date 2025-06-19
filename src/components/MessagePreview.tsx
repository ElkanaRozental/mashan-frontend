
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessagePreviewProps {
  message: string;
  soldierPhone?: string;
}

const MessagePreview: React.FC<MessagePreviewProps> = ({ message, soldierPhone }) => {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message);
      toast({
        title: "הועתק בהצלחה",
        description: "ההודעה הועתקה ללוח",
      });
    } catch (err) {
      toast({
        title: "שגיאה",
        description: "לא ניתן להעתיק ללוח",
        variant: "destructive",
      });
    }
  };

  const sendWhatsApp = () => {
    if (!soldierPhone) {
      toast({
        title: "שגיאה",
        description: "לא נמצא מספר טלפון לחייל",
        variant: "destructive",
      });
      return;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${soldierPhone.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-5 w-5 ml-2" />
          תצוגה מקדימה של ההודעה
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={message}
          readOnly
          className="min-h-[200px] font-mono text-sm"
          placeholder="ההודעה תופיע כאן לאחר מילוי הטופס..."
        />
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={copyToClipboard}
            className="flex-1"
          >
            <Copy className="h-4 w-4 ml-2" />
            העתק ללוח
          </Button>
          
          {soldierPhone && (
            <Button
              onClick={sendWhatsApp}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <MessageCircle className="h-4 w-4 ml-2" />
              שלח ב-WhatsApp
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagePreview;
