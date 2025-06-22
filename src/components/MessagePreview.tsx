
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessagePreviewProps {
  message: string;
  soldierPhone?: string;
}

const MessagePreview: React.FC<MessagePreviewProps> = ({ message, soldierPhone }) => {
  const { toast } = useToast();
  const [customPhone, setCustomPhone] = useState(soldierPhone || '');

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
    const phoneToUse = customPhone.trim();
    if (!phoneToUse) {
      toast({
        title: "שגיאה",
        description: "אנא הכנס מספר טלפון",
        variant: "destructive",
      });
      return;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneToUse.replace(/\D/g, '')}?text=${encodedMessage}`;
    console.log(`Opening WhatsApp with URL: ${whatsappUrl}`);
    
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
        
        <div className="space-y-2">
          <Label htmlFor="whatsapp-phone">מספר טלפון לשליחה ב-WhatsApp</Label>
          <Input
            id="whatsapp-phone"
            type="tel"
            placeholder="05xxxxxxxx"
            value={customPhone}
            onChange={(e) => setCustomPhone(e.target.value)}
            className="text-right"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={copyToClipboard}
            className="flex-1"
          >
            <Copy className="h-4 w-4 ml-2" />
            העתק ללוח
          </Button>
          
          <Button
            onClick={sendWhatsApp}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={!customPhone.trim()}
          >
            <MessageCircle className="h-4 w-4 ml-2" />
            שלח ב-WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagePreview;
