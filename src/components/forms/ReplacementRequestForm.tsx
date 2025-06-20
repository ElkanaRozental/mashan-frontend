
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, Send } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Soldier } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import SoldierSearch from '@/components/SoldierSearch';
import MessagePreview from '@/components/MessagePreview';
import { useToast } from '@/hooks/use-toast';
import SelectBase from '../ui/selectBase';

const formSchema = z.object({
  incomingArrivalDate: z.date({
    required_error: "יש לבחור תאריך הגעה",
  }),
  incomingLeaveDate: z.date({
    required_error: "יש לבחור תאריך עזיבה",
  }),
  outgoingLeaveDate: z.date({
    required_error: "יש לבחור תאריך עזיבה",
  }),
  baseName: z.string().min(1, "יש למלא שם בסיס"),
}).refine((data) => data.incomingLeaveDate > data.incomingArrivalDate, {
  message: "תאריך העזיבה חייב להיות אחרי תאריך ההגעה",
  path: ["incomingLeaveDate"],
});

type FormData = z.infer<typeof formSchema>;

const ReplacementRequestForm = () => {
  const [incomingSoldier, setIncomingSoldier] = useState<Soldier | null>(null);
  const [leavingSoldier, setleavingSoldier] = useState<Soldier | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const { addRequest } = useAppStore();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const generateMessage = (data: FormData) => {
    if (!      incomingSoldier || !leavingSoldier) return '';

    const message = `בקשה להחלפת חיילים

חייל נכנס:
שם: ${      incomingSoldier.fullName}
מספר אישי: ${      incomingSoldier.militaryId}
דרגה: ${      incomingSoldier.rank}
מדור: ${      incomingSoldier.mador}
תפקיד: ${      incomingSoldier.role}
טלפון: ${      incomingSoldier.phone}

חייל עוזב:
שם: ${leavingSoldier.fullName}
מספר אישי: ${leavingSoldier.militaryId}
דרגה: ${leavingSoldier.rank}
מדור: ${leavingSoldier.mador}
תפקיד: ${leavingSoldier.role}
טלפון: ${leavingSoldier.phone}

לוח זמנים:
החייל הנכנס יגיע: ${format(data.incomingArrivalDate, 'dd/MM/yyyy')}
החייל הנכנס יעזוב: ${format(data.incomingLeaveDate, 'dd/MM/yyyy')}
החייל העוזב יסיים: ${format(data.outgoingLeaveDate, 'dd/MM/yyyy')}
בסיס: ${data.baseName}`;

    setGeneratedMessage(message);
    return message;
  };

  const onSubmit = (data: FormData) => {
    if (!      incomingSoldier || !leavingSoldier) {
      toast({
        title: "שגיאה",
        description: "יש לבחור שני חיילים",
        variant: "destructive",
      });
      return;
    }

    const message = generateMessage(data);
    addRequest({
      submittingType: 'AccommodationAndExchangeSoldiers',
      incomingSoldier,
      leavingSoldier,
      arrivelDate: data.incomingArrivalDate,
      departureDate: data.incomingLeaveDate,
      leavingSoldierExitDate: data.outgoingLeaveDate,
      base: data.baseName,
    });

    toast({
      title: "הבקשה נשמרה בהצלחה",
      description: "הבקשה נוספה למערכת",
    });

    // Reset form
    form.reset();
    setIncomingSoldier(null);
    setleavingSoldier(null);
    setGeneratedMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">חייל נכנס</h3>
          <SoldierSearch
            onSelectSoldier={setIncomingSoldier}
            selectedSoldier={      incomingSoldier}
            placeholder="בחר חייל נכנס..."
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">חייל עוזב</h3>
          <SoldierSearch
            onSelectSoldier={setleavingSoldier}
            selectedSoldier={leavingSoldier}
            placeholder="בחר חייל עוזב..."
          />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">לוח זמנים</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="incomingArrivalDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>הגעת חייל נכנס</FormLabel>
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
                name="incomingLeaveDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>עזיבת חייל נכנס</FormLabel>
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
                          disabled={(date) => {
                            const arrivalDate = form.getValues('incomingArrivalDate');
                            return date < new Date() || (arrivalDate && date <= arrivalDate);
                          }}
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
                name="outgoingLeaveDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>עזיבת חייל עוזב</FormLabel>
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
                if (      incomingSoldier && leavingSoldier && data.incomingArrivalDate && data.incomingLeaveDate && data.outgoingLeaveDate && data.baseName) {
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
          soldierPhone={      incomingSoldier?.phone}
        />
      )}
    </div>
  );
};

export default ReplacementRequestForm;
