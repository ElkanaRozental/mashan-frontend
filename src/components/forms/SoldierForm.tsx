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
      name: soldier.name,
      privateNumber: soldier.privateNumber,
      personalId: soldier.personalId,
      phoneNumber: soldier.phoneNumber,
      gender: soldier.gender,
      rank: soldier.rank,
      jobKind: soldier.jobKind,
      center: soldier.center,
      branch: soldier.branch,
      department: soldier.department,
      team: soldier.team ?? undefined,
      role: soldier.role,
      isRequiredYarkonirApporval: soldier.isRequiredYarkonirApporval,
      isExistsMishmarAman: soldier.isExistsMishmarAman,
      clarance: soldier.clarance,
      allergies: soldier.allergies,
      jobTitle: soldier.jobTitle,
      isOrderingCommander: soldier.isOrderingCommander,
    } : {
      name: '',
      privateNumber: '',
      personalId: '',
      phoneNumber: '',
      gender: 'MALE',
      rank: '',
      jobKind: 'SADIR',
      center: 0,
      branch: 0,
      department: 0,
      team: undefined,
      role: '',
      isRequiredYarkonirApporval: false,
      isExistsMishmarAman: false,
      clarance: 0,
      allergies: '',
      jobTitle: '',
      isOrderingCommander: false,
    }
  });

  const onSubmit = (data: Omit<Soldier, 'id'>) => {
    try {
      if (soldier) {
        updateSoldier(soldier.id, data);
        toast({
          title: "החייל עודכן בהצלחה",
          description: `פרטי ${data.name} נשמרו במערכת`,
        });
      } else {
        addSoldier(data);
        toast({
          title: "החייל נוסף בהצלחה",
          description: `${data.name} נוסף למערכת`,
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
              name="name"
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
              name="privateNumber"
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
              name="personalId"
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
              name="phoneNumber"
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
                      <SelectItem value="MALE">זכר</SelectItem>
                      <SelectItem value="FEMALE">נקבה</SelectItem>
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
              name="jobKind"
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
                      <SelectItem value="SADIR">סדיר</SelectItem>
                      <SelectItem value="SAHATZ">שירות חוץ</SelectItem>
                      <SelectItem value="MILUIM">מילואים</SelectItem>
                      <SelectItem value="YOETZ">יועץ</SelectItem>
                      <SelectItem value="KEVA">קבע</SelectItem>
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
              name="branch"
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
              name="department"
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
              name="clarance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>סיווג בטחוני</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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
              name="isRequiredYarkonirApporval"
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
              name="isExistsMishmarAman"
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
