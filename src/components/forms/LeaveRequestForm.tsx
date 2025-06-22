
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Save, Send } from 'lucide-react';
import { format } from 'date-fns';


import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Soldier } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import SoldierSearch from '@/components/SoldierSearch';
import MessagePreview from '@/components/MessagePreview';
import { useToast } from '@/hooks/use-toast';
import SelectBase from '../ui/selectBase';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  base: z.string().min(1, "יש למלא שם בסיס"),
  exitDate: z.date({
    required_error: "יש לבחור תאריך עזיבה",
  }),
});

type FormData = z.infer<typeof formSchema>;

const LeaveRequestForm = () => {
  const [selectedSoldier, setSelectedSoldier] = useState<Soldier | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const { addRequest } = useAppStore();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      base: '',
    },
  });

  const generateMessage = (data: FormData) => {
    if (!selectedSoldier) return '';

    const message = `בקשה לעזיבת בסיס

חייל: ${selectedSoldier.name}
מספר אישי: ${selectedSoldier.privateNumber}
דרגה: ${selectedSoldier.rank}
מדור: ${selectedSoldier.department}
תפקיד: ${selectedSoldier.role}

פרטי הבקשה:
בסיס: ${data.base}
סוג בקשה: עזיבת בסיס

טלפון ליצירת קשר: ${selectedSoldier.phoneNumber}`;

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
      exitDate: data.exitDate.toISOString(), 
      base: data.base,
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
                name="exitDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>תאריך עזיבה</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>בחר תאריך</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="base"
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
            {/* <Button
              type="button"
              variant="outline"
              onClick={() => {
                const data = form.getValues();
                if (selectedSoldier && data.base) {
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
            </Button> */}
            
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
          soldierPhone={selectedSoldier?.phoneNumber}
        />
      )}
    </div>
  );
};

export default LeaveRequestForm;
