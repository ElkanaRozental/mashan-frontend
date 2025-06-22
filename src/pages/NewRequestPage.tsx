
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Users, ArrowRightLeft, LogOut } from 'lucide-react';
import DayOnlyRequestForm from '@/components/forms/DayOnlyRequestForm';
import StayRequestForm from '@/components/forms/StayRequestForm';
import ReplacementRequestForm from '@/components/forms/ReplacementRequestForm';
import LeaveRequestForm from '@/components/forms/LeaveRequestForm';

const NewRequestPage = () => {
  const [activeTab, setActiveTab] = useState('OneDayWithoutAccommodation');

  const requestTypes = [
    {
      id: 'OneDayWithoutAccommodation',
      name: 'הצטרפות חד-יומית',
      description: 'הצטרפות לבסיס ליום אחד ללא לינה',
      icon: FileText,
      component: DayOnlyRequestForm
    },
    {
      id: 'AccommodationForSeveralDays',
      name: 'הצטרפות עם לינה',
      description: 'הצטרפות לבסיס למספר ימים עם לינה',
      icon: Users,
      component: StayRequestForm
    },
    {
      id: 'AccommodationAndExchangeSoldiers',
      name: 'החלפת חיילים',
      description: 'החלפה בין חייל נכנס לחייל עוזב',
      icon: ArrowRightLeft,
      component: ReplacementRequestForm
    },
    {
      id: 'BaseLeaving',
      name: 'עזיבת בסיס',
      description: 'בקשה לעזיבת חייל מהבסיס',
      icon: LogOut,
      component: LeaveRequestForm
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">יצירת בקשה חדשה</h1>
        <p className="text-gray-600">בחר את סוג הבקשה ומלא את הפרטים הנדרשים</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 ml-2" />
            סוג הבקשה
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {requestTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <TabsTrigger key={type.id} value={type.id} className="flex items-center">
                    <Icon className="h-4 w-4 ml-1" />
                    <span className="hidden sm:inline">{type.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {requestTypes.map((type) => {
              const FormComponent = type.component;
              return (
                <TabsContent key={type.id} value={type.id} className="mt-6">
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900">{type.name}</h3>
                    <p className="text-blue-700 text-sm">{type.description}</p>
                  </div>
                  <FormComponent />
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewRequestPage;
