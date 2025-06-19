
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Filter, MoreHorizontal, Copy, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Request, RequestStatus } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';

const RequestsPage = () => {
  const { submitting, updateRequestStatus } = useAppStore();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [madorFilter, setMadorFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  // Get unique madars for filter
  const uniqueMadars = useMemo(() => {
    const madars = new Set<string>();
    submitting.forEach(request => {
      if ('soldier' in request) {
        madars.add(request.soldier.mador);
      }
      if ('outgoingSoldier' in request) {
        madars.add(request.outgoingSoldier.mador);
      }
    });
    return Array.from(madars);
  }, [submitting]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return submitting.filter(request => {
      // Status filter
      if (statusFilter !== 'all' && request.status !== statusFilter) {
        return false;
      }

      // Mador filter
      if (madorFilter !== 'all') {
        let requestMador = '';
        if (request.soldier) {
          requestMador = request.soldier.mador;
        } else if ('outgoingSoldier' in request) {
          requestMador = request.outgoingSoldier.mador;
        }
        if (requestMador !== madorFilter) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        let soldierName = '';
        if (request.soldier) {
          soldierName = request.soldier.fullName.toLowerCase();
        } else if ('outgoingSoldier' in request) {
          soldierName = request.outgoingSoldier.fullName.toLowerCase();
        }
        
        const baseName = 'baseName' in request ? request.baseName.toLowerCase() : '';
        
        if (!soldierName.includes(query) && !baseName.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [submitting, statusFilter, madorFilter, searchQuery]);

  const getRequestTypeText = (type: Request['type']) => {
    switch (type) {
      case 'dayOnly': return 'הצטרפות חד-יומית';
      case 'stay': return 'הצטרפות עם לינה';
      case 'replacement': return 'החלפת חיילים';
      case 'leave': return 'עזיבת בסיס';
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'ממתינה':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 ml-1" />{status}</Badge>;
      case 'אושרה':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 ml-1" />{status}</Badge>;
      case 'נדחתה':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 ml-1" />{status}</Badge>;
    }
  };

  const getSoldierName = (request: Request) => {
    if (request.soldier && 'outgoingSoldier' in request) {
      return `${request.soldier.fullName} ← ${request.outgoingSoldier.fullName}`;
    }  if (request.soldier) {
      return request.soldier.fullName;
    }
    return '';
  };

  const updateStatus = (requestId: string, newStatus: RequestStatus) => {
    updateRequestStatus(requestId, newStatus);
    toast({
      title: "סטטוס עודכן",
      description: `הבקשה עודכנה ל${newStatus}`,
    });
  };

  const generateRequestMessage = (request: Request) => {
    // This would generate the same message as in the forms
    // For now, return a basic message
    const soldierName = getSoldierName(request);
    const type = getRequestTypeText(request.type);
    return `בקשה: ${type}\nחייל: ${soldierName}\nתאריך יצירה: ${format(request.createdAt, 'dd/MM/yyyy')}`;
  };

  const copyMessage = async (request: Request) => {
    const message = generateRequestMessage(request);
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

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ניהול בקשות</h1>
        <p className="text-gray-600">צפייה וניהול כל הבקשות במערכת</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 ml-2" />
            בקשות ({filteredRequests.length})
          </CardTitle>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="חפש לפי שם חייל או בסיס..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value: RequestStatus | 'all') => setStatusFilter(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="סטטוס" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הסטטוסים</SelectItem>
                <SelectItem value="ממתינה">ממתינה</SelectItem>
                <SelectItem value="אושרה">אושרה</SelectItem>
                <SelectItem value="נדחתה">נדחתה</SelectItem>
              </SelectContent>
            </Select>

            <Select value={madorFilter} onValueChange={setMadorFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="מדור" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל המדורים</SelectItem>
                {uniqueMadars.map(mador => (
                  <SelectItem key={mador} value={mador}>{mador}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>סוג בקשה</TableHead>
                  <TableHead>חייל/ים</TableHead>
                  <TableHead>תאריך יצירה</TableHead>
                  <TableHead>נוצר על ידי</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {getRequestTypeText(request.type)}
                    </TableCell>
                    <TableCell>{getSoldierName(request)}</TableCell>
                    <TableCell>{format(request.createdAt, 'dd/MM/yyyy HH:mm')}</TableCell>
                    <TableCell>{request.createdBy}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyMessage(request)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>פרטי הבקשה</DialogTitle>
                            </DialogHeader>
                            {selectedRequest && (
                              <div className="space-y-4">
                                <div>
                                  <strong>סוג בקשה:</strong> {getRequestTypeText(selectedRequest.type)}
                                </div>
                                <div>
                                  <strong>חייל:</strong> {getSoldierName(selectedRequest)}
                                </div>
                                <div>
                                  <strong>סטטוס נוכחי:</strong> {getStatusBadge(selectedRequest.status)}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => updateStatus(selectedRequest.id, 'אושרה')}
                                    disabled={selectedRequest.status === 'אושרה'}
                                  >
                                    אשר
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => updateStatus(selectedRequest.id, 'נדחתה')}
                                    disabled={selectedRequest.status === 'נדחתה'}
                                  >
                                    דחה
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateStatus(selectedRequest.id, 'ממתינה')}
                                    disabled={selectedRequest.status === 'ממתינה'}
                                  >
                                    החזר להמתנה
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredRequests.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                לא נמצאו בקשות המתאימות לקריטריונים
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestsPage;
