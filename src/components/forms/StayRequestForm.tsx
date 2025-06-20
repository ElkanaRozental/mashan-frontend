
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  arrivalDate: z.date({
    required_error: "יש לבחור תאריך הגעה",
  }),
  leaveDate: z.date({
    required_error: "יש לבחור תאריך עזיבה",
  }),
  baseName: z.string().min(1, "יש למלא שם בסיס"),
  requiresBaseApproval: z.boolean(),
  hasBeenAtBaseBefore: z.boolean(),
}).refine((data) => data.leaveDate > data.arrivalDate, {
  message: "תאריך העזיבה חייב להיות אחרי תאריך ההגעה",
  path: ["leaveDate"],
});

type FormData = z.infer<typeof formSchema>;

const StayRequestForm = () => {
  const [selectedSoldier, setSelectedSoldier] = useState<Soldier | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const { addRequest } = useAppStore();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requiresBaseApproval: false,
      hasBeenAtBaseBefore: false,
    },
  });

  const generateMessage = (data: FormData) => {
    if (!selectedSoldier) return '';

    const daysCount = Math.ceil((data.leaveDate.getTime() - data.arrivalDate.getTime()) / (1000 * 60 * 60 * 24));

    const message = `בקשה להצטרפות עם לינה

חייל: ${selectedSoldier.fullName}
מספר אישי: ${selectedSoldier.militaryId}
דרגה: ${selectedSoldier.rank}
מדור: ${selectedSoldier.mador}
תפקיד: ${selectedSoldier.role}

פרטי הבקשה:
תאריך הגעה: ${format(data.arrivalDate, 'dd/MM/yyyy')}
תאריך עזיבה: ${format(data.leaveDate, 'dd/MM/yyyy')}
משך השהייה: ${daysCount} ימים
בסיס: ${data.baseName}
נדרש אישור בסיס: ${data.requiresBaseApproval ? 'כן' : 'לא'}
היה בבסיס בעבר: ${data.hasBeenAtBaseBefore ? 'כן' : 'לא'}

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
      submittingType: 'AccommodationForSeveralDays',
      incomingSoldier: selectedSoldier,
      arrivelDate: data.arrivalDate,
      departureDate: data.leaveDate,
      base: data.baseName,
      isAlreadyWasInBase: data.hasBeenAtBaseBefore,
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="arrivalDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>תאריך הגעה</FormLabel>
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
                name="leaveDate"
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
                          disabled={(date) => {
                            const arrivalDate = form.getValues('arrivalDate');
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

            <div className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="requiresBaseApproval"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-reverse space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>נדרש אישור בסיס</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasBeenAtBaseBefore"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-reverse space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>היה בבסיס בעבר</FormLabel>
                    </div>
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
                if (selectedSoldier && data.arrivalDate && data.leaveDate && data.baseName) {
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

export default StayRequestForm;
