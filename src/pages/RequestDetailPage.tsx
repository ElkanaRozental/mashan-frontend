import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Edit, Clock, CheckCircle, XCircle, Copy, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';
import { Request } from '@/types';
import MessagePreview from '@/components/MessagePreview';
import { getRequestMessage } from '@/services/requestService';

const RequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { submitting: requests, updateRequestStatus } = useAppStore();
  const [message, setMessage] = useState<string>('');
  
  const request = requests.find(r => r.id === id);
  
  if (!request) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">בקשה לא נמצאה</h1>
          <Button onClick={() => navigate('/requests')}>
            <ArrowRight className="h-4 w-4 ml-2" />
            חזרה לבקשות
          </Button>
        </div>
      </div>
    );
  }

  const getRequestTypeText = (type: Request['submittingType']) => {
    switch (type) {
      case 'OneDayWithoutAccommodation': return 'הצטרפות חד-יומית';
      case 'AccommodationForSeveralDays': return 'הצטרפות עם לינה';
      case 'AccommodationAndExchangeSoldiers': return 'החלפת חיילים';
      case 'BaseLeaving': return 'עזיבת בסיס';
    }
  };

  const getStatusBadge = (status: Boolean) => {
if (!status) {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">ממתין לאישור</Badge>;
    }
     else{
       return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 ml-1" />{"הבקשה אושרה"}</Badge>;
     }
    };

  const getSoldierName = (request: Request) => {
  if ('incomingSoldier' in request && 'leavingSoldier' in request) {
    // החלפת חיילים
    return `${request.incomingSoldier.name} ← ${request.leavingSoldier.name}`;
  } else if ('incomingSoldier' in request) {
    // הצטרפות חד-יומית או עם לינה
    return request.incomingSoldier.name;
  } else if ('leavingSoldier' in request) {
    // עזיבת בסיס
    return request.leavingSoldier.name;
  }
  return '';
};



  const getSoldierPhone = (request: Request) => {
    if ('incomingSoldier' in request && 'leavingSoldier' in request) {
      // החלפת חיילים
      return `${request.incomingSoldier.phoneNumber} / ${request.leavingSoldier.phoneNumber}`;
    } else if ('incomingSoldier' in request) {
      // הצטרפות חד-יומית או עם לינה
      return request.incomingSoldier.phoneNumber;
    } else if ('leavingSoldier' in request) {
      // עזיבת בסיס
      return request.leavingSoldier.phoneNumber;
    }
    return '';
  };

  const updateStatus = (newStatus: boolean) => {
    updateRequestStatus(request.id, newStatus);
    toast({
      title: "סטטוס עודכן",
      description: `הבקשה עודכנה ל${newStatus}`,
    });
  };

  const copyMessage = async () => {
    try {
      const fetchedMessage = await getRequestMessage(request.id);
      await navigator.clipboard.writeText(fetchedMessage);
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

  // Load message when component mounts
  React.useEffect(() => {
    const loadMessage = async () => {
      if (request) {
        try {
          const fetchedMessage = await getRequestMessage(request.id);
          setMessage(fetchedMessage);
        } catch (err) {
          console.error('Error loading message:', err);
          setMessage('שגיאה בטעינת ההודעה');
        }
      }
    };
    
    loadMessage();
  }, [request]);

  const renderRequestDetails = () => {
    if (request.submittingType === 'OneDayWithoutAccommodation' || request.submittingType === 'AccommodationForSeveralDays') {
      const typedRequest = request as any;
      return (
        <div className="grid grid-cols-2 gap-4">
          <div><strong>בסיס:</strong> {typedRequest.baseName}</div>
          <div><strong>תאריך הגעה:</strong> {format(typedRequest.arrivalDate, 'dd/MM/yyyy')}</div>
          {request.submittingType === 'AccommodationForSeveralDays' && (
            <div><strong>תאריך עזיבה:</strong> {format(typedRequest.leaveDate, 'dd/MM/yyyy')}</div>
          )}
          <div><strong>דרוש אישור בסיס:</strong> {typedRequest.requiresBaseApproval ? 'כן' : 'לא'}</div>
          <div><strong>היה בבסיס בעבר:</strong> {typedRequest.hasBeenAtBaseBefore ? 'כן' : 'לא'}</div>
        </div>
      );
    }
    
    if (request.submittingType === 'AccommodationAndExchangeSoldiers') {
      const typedRequest = request as any;
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><strong>בסיס:</strong> {typedRequest.baseName}</div>
            <div><strong>חייל נכנס:</strong> {typedRequest.soldier.fullName}</div>
            <div><strong>חייל יוצא:</strong> {typedRequest.outgoingSoldier.fullName}</div>
            <div><strong>הגעת חייל נכנס:</strong> {format(typedRequest.incomingArrivalDate, 'dd/MM/yyyy')}</div>
            <div><strong>עזיבת חייל נכנס:</strong> {format(typedRequest.incomingLeaveDate, 'dd/MM/yyyy')}</div>
            <div><strong>עזיבת חייל יוצא:</strong> {format(typedRequest.outgoingLeaveDate, 'dd/MM/yyyy')}</div>
          </div>
        </div>
      );
    }
    
    if (request.submittingType === 'BaseLeaving') {
      const typedRequest = request as any;
      return (
        <div className="grid grid-cols-2 gap-4">
          <div><strong>בסיס:</strong> {typedRequest.baseName}</div>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link to="/requests" className="text-blue-600 hover:text-blue-800 flex items-center mb-4">
          <ArrowRight className="h-4 w-4 ml-2" />
          חזרה לבקשות
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">פרטי בקשה</h1>
            <p className="text-gray-600">{getRequestTypeText(request.submittingType)} - {getSoldierName(request)}</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={copyMessage}>
              <Copy className="h-4 w-4 ml-2" />
              העתק הודעה
            </Button>
            <Button>
              <Edit className="h-4 w-4 ml-2" />
              ערוך בקשה
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Details */}
        <Card>
          <CardHeader>
            <CardTitle>פרטי הבקשה</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><strong>סוג בקשה:</strong> {getRequestTypeText(request.submittingType)}</div>
              <div><strong>סטטוס:</strong> {getStatusBadge(request.isApproved)}</div>
              <div><strong>תאריך יצירה:</strong> {format(request.createdRequestDate, 'dd/MM/yyyy HH:mm')}</div>
              <div><strong>נוצר על ידי:</strong> {request.submitter}</div>
            </div>
            
            <hr className="my-4" />
            
            {renderRequestDetails()}
          </CardContent>
        </Card>

        {/* Soldier Details */}
        <Card>
          <CardHeader>
            <CardTitle>פרטי החייל</CardTitle>
          </CardHeader>
          <CardContent>
            {request.submittingType === 'AccommodationAndExchangeSoldiers' ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">חייל נכנס</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>שם:</strong> {(request as any).soldier.fullName}</div>
                    <div><strong>מ.א.:</strong> {(request as any).soldier.militaryId}</div>
                    <div><strong>טלפון:</strong> {(request as any).soldier.phone}</div>
                    <div><strong>מדור:</strong> {(request as any).soldier.mador}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">חייל יוצא</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>שם:</strong> {(request as any).outgoingSoldier.fullName}</div>
                    <div><strong>מ.א.:</strong> {(request as any).outgoingSoldier.militaryId}</div>
                    <div><strong>טלפון:</strong> {(request as any).outgoingSoldier.phone}</div>
                    <div><strong>מדור:</strong> {(request as any).outgoingSoldier.mador}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>שם מלא:</strong> {(request as any).soldier.fullName}</div>
                <div><strong>מ.א.:</strong> {(request as any).soldier.militaryId}</div>
                <div><strong>ת.ז.:</strong> {(request as any).soldier.tz}</div>
                <div><strong>טלפון:</strong> {(request as any).soldier.phone}</div>
                <div><strong>דרגה:</strong> {(request as any).soldier.rank}</div>
                <div><strong>מדור:</strong> {(request as any).soldier.mador}</div>
                <div><strong>תפקיד:</strong> {(request as any).soldier.role}</div>
                <div><strong>סוג שירות:</strong> {(request as any).soldier.serviceType}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Management */}
        <Card>
          <CardHeader>
            <CardTitle>ניהול סטטוס</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>סטטוס נוכחי:</strong> {getStatusBadge(request.isApproved)}
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => updateStatus(true)}
                  disabled={request.isApproved === true}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 ml-2" />
                  אשר
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => updateStatus(false)}
                  disabled={request.isApproved === false}
                >
                  <XCircle className="h-4 w-4 ml-2" />
                  דחה
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Preview */}
        <Card>
          <CardHeader>
            <CardTitle>הודעה לשליחה</CardTitle>
          </CardHeader>
          <CardContent>
            <MessagePreview 
              message={message} 
              soldierPhone={getSoldierPhone(request)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestDetailPage;
