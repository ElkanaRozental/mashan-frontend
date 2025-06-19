
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Soldier } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useToast } from '@/hooks/use-toast';

interface SoldierFormProps {
  soldier?: Soldier;
  onClose: () => void;
}

const SoldierForm: React.FC<SoldierFormProps> = ({ soldier, onClose }) => {
  const { addSoldier, updateSoldier } = useAppStore();
  const { toast } = useToast();
  
  const form = useForm<Omit<Soldier, 'id'>>({
    defaultValues: soldier ? {
      fullName: soldier.fullName,
      militaryId: soldier.militaryId,
      tz: soldier.tz,
      phone: soldier.phone,
      gender: soldier.gender,
      rank: soldier.rank,
      serviceType: soldier.serviceType,
      center: soldier.center,
      anaf: soldier.anaf,
      mador: soldier.mador,
      team: soldier.team || '',
      role: soldier.role,
      requiresYarkonirApproval: soldier.requiresYarkonirApproval,
      hasMAMGuard: soldier.hasMAMGuard,
      securityClearance: soldier.securityClearance,
      allergies: soldier.allergies,
    } : {
      fullName: '',
      militaryId: '',
      tz: '',
      phone: '',
      gender: 'ז',
      rank: '',
      serviceType: 'סדיר',
      center: '',
      anaf: '',
      mador: '',
      team: '',
      role: '',
      requiresYarkonirApproval: false,
      hasMAMGuard: false,
      securityClearance: '',
      allergies: '',
    }
  });

  const onSubmit = (data: Omit<Soldier, 'id'>) => {
    try {
      if (soldier) {
        updateSoldier(soldier.id, data);
        toast({
          title: "החייל עודכן בהצלחה",
          description: `פרטי ${data.fullName} נשמרו במערכת`,
        });
      } else {
        addSoldier(data);
        toast({
          title: "החייל נוסף בהצלחה",
          description: `${data.fullName} נוסף למערכת`,
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשמירת פרטי החייל",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>שם מלא</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="militaryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>מספר אישי</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>תעודת זהות</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>טלפון נייד</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>מגדר</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ז">זכר</SelectItem>
                      <SelectItem value="נ">נקבה</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>דרגה</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>סוג שירות</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="סדיר">סדיר</SelectItem>
                      <SelectItem value="מילואים">מילואים</SelectItem>
                      <SelectItem value="יועץ">יועץ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="center"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>מרכז</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="anaf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ענף</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="mador"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>מדור</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>צוות (אופציונלי)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>תפקיד</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="securityClearance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>סיווג בטחוני</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>אלרגיות</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="requiresYarkonirApproval"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>דרוש אישור ירקוניר</FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hasMAMGuard"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>קיים משמר אמ"ן</FormLabel>
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              ביטול
            </Button>
            <Button type="submit">
              {soldier ? 'עדכן חייל' : 'הוסף חייל'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SoldierForm;
