
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, Send } from 'lucide-react';
import { Soldier } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import SoldierSearch from '@/components/SoldierSearch';
import MessagePreview from '@/components/MessagePreview';
import { useToast } from '@/hooks/use-toast';
import SelectBase from '../ui/selectBase';

const formSchema = z.object({
  baseName: z.string().min(1, "יש למלא שם בסיס"),
});

type FormData = z.infer<typeof formSchema>;

const LeaveRequestForm = () => {
  const [selectedSoldier, setSelectedSoldier] = useState<Soldier | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const { addRequest } = useAppStore();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const generateMessage = (data: FormData) => {
    if (!selectedSoldier) return '';

    const message = `בקשה לעזיבת בסיס

חייל: ${selectedSoldier.fullName}
מספר אישי: ${selectedSoldier.militaryId}
דרגה: ${selectedSoldier.rank}
מדור: ${selectedSoldier.mador}
תפקיד: ${selectedSoldier.role}

פרטי הבקשה:
בסיס: ${data.baseName}
סוג בקשה: עזיבת בסיס

טלפון ליצירת קשר: ${selectedSoldier.phone}`;

    setGeneratedMessage(message);
    return message;
  };

  const onSubmit = (data: FormData) => {
    if (!selectedSoldier) {
      toast({
        title: "שגיאה",
        description: "יש לבחור חייל",
        variant: "destructive",
      });
      return;
    }

    const message = generateMessage(data);
    
    addRequest({
      submittingType: 'BaseLeaving',
      leavingSoldier: selectedSoldier,
      exitDate: new Date(), // Assuming current date for exit
      base: data.baseName,
    });

    toast({
      title: "הבקשה נשמרה בהצלחה",
      description: "הבקשה נוספה למערכת",
    });

    // Reset form
    form.reset();
    setSelectedSoldier(null);
    setGeneratedMessage('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">פרטי החייל</h3>
        <SoldierSearch
          onSelectSoldier={setSelectedSoldier}
          selectedSoldier={selectedSoldier}
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">פרטי הבקשה</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="baseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם הבסיס</FormLabel>
                    <FormControl>
                      <SelectBase field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const data = form.getValues();
                if (selectedSoldier && data.baseName) {
                  generateMessage(data);
                } else {
                  toast({
                    title: "חסרים פרטים",
                    description: "יש למלא את כל השדות הנדרשים לפני יצירת ההודעה",
                    variant: "destructive",
                  });
                }
              }}
            >
              <Send className="h-4 w-4 ml-2" />
              צור הודעה
            </Button>
            
            <Button type="submit">
              <Save className="h-4 w-4 ml-2" />
              שמור בקשה
            </Button>
          </div>
        </form>
      </Form>

      {generatedMessage && (
        <MessagePreview
          message={generatedMessage}
          soldierPhone={selectedSoldier?.phone}
        />
      )}
    </div>
  );
};

export default LeaveRequestForm;
