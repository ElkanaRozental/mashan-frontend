import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileText, Filter, MoreHorizontal, Copy, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Request } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';
import { getRequestMessage } from '@/services/requestService';

const RequestsPage = () => {
  const { submitting, updateRequestStatus, loadSubmitting, isLoading } = useAppStore();
  console.log('submitting', submitting);
  
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'true' | 'false' | 'all'>('all');
  const [madorFilter, setMadorFilter] = useState<number | 'all'>('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load submitting data when component mounts
  useEffect(() => {
    loadSubmitting();
  }, [loadSubmitting]);

  // Get unique madars for filter
const uniqueMadars = useMemo(() => {
  const madars = new Set<number>();
  submitting.forEach(request => {
    if ('incomingSoldier' in request) {
      madars.add(request.incomingSoldier.department);
    }
    if ('leavingSoldier' in request) {
      madars.add(request.leavingSoldier.department);
    }
  });
  return Array.from(madars);
}, [submitting]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return submitting.filter(request => {
      // Status filter
      if (statusFilter !== 'all' && request.isApproved.toString() !== statusFilter) {
        return false;
      }

      // Mador filter
      if (madorFilter !== 'all') {
        let requestMador = 0;
        if ('incomingSoldier' in request) {
          requestMador = request.incomingSoldier.department;
        } else if ('leavingSoldier' in request) {
          requestMador = request.leavingSoldier.department;
        }
        if (requestMador !== madorFilter) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        let soldierName = '';
          if ('incomingSoldier' in request) {
          soldierName = request.incomingSoldier.name.toLowerCase();
        } else if ('leavingSoldier' in request) {
          soldierName = request.leavingSoldier.name.toLowerCase();
        }
        
        const baseName = 'baseName' in request ? request.base.toLowerCase() : '';
        
        if (!soldierName.includes(query) && !baseName.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [submitting, statusFilter, madorFilter, searchQuery]);

  const getRequestTypeText = (type: Request['submittingType']) => {
    switch (type) {
      case 'OneDayWithoutAccommodation': return 'הצטרפות חד-יומית';
      case 'AccommodationForSeveralDays': return 'הצטרפות עם לינה';
      case 'AccommodationAndExchangeSoldiers': return 'החלפת חיילים';
      case 'BaseLeaving': return 'עזיבת בסיס';
    }
  };

  const getStatusBadge = (status: boolean) => {
    if (status) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 ml-1" />{"מאושר"}</Badge>;
    }
      else{
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 ml-1" />{"ממתין לאישור"}</Badge>;
    }
  };

  const getSoldierName = (request: Request) => {
    if ("incomingSoldier" in request && 'leavingSoldier' in request) {
      return `${request.incomingSoldier.name} ← ${request.leavingSoldier.name}`;
    } else if ('incomingSoldier' in request) {
      return request.incomingSoldier.name;
    }
    else if ('leavingSoldier' in request) {
      return request.leavingSoldier.name;
    }
    return '';
  };

  const updateStatus = (requestId: string, newStatus: boolean) => {
    updateRequestStatus(requestId, newStatus);
    toast({
      title: "סטטוס עודכן",
      description: `הבקשה עודכנה ל${newStatus}`,
    });
    setIsDialogOpen(false);
  };

  const copyMessage = async (request: Request) => {
    try {
      const message = await getRequestMessage(request.id);
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
            
            <Select value={statusFilter.toString()} onValueChange={(value: 'true' | 'false' | 'all') => setStatusFilter(value)}>
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

            <Select value={madorFilter.toString()} onValueChange={(value) => setMadorFilter(value === 'all' ? 'all' : Number(value))}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="מדור" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל המדורים</SelectItem>
                {uniqueMadars.map(mador => (
                  <SelectItem key={mador} value={mador.toString()}>{mador}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              טוען בקשות...
            </div>
          ) : (
            <TooltipProvider>
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
                          {getRequestTypeText(request.submittingType)}
                        </TableCell>
                        <TableCell>{getSoldierName(request)}</TableCell>
                        <TableCell>{request.createdRequestDate}</TableCell>
                        <TableCell>{request.submitter}</TableCell>
                        <TableCell>{getStatusBadge(request.isApproved)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyMessage(request)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>העתק מסר</p>
                              </TooltipContent>
                            </Tooltip>
                            
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedRequest(request);
                                        setIsDialogOpen(true);
                                      }}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>פרטים</p>
                                </TooltipContent>
                              </Tooltip>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>פרטי הבקשה</DialogTitle>
                                </DialogHeader>
                                {selectedRequest && (
                                  <div className="space-y-4">
                                    <div>
                                      <strong>סוג בקשה:</strong> {getRequestTypeText(selectedRequest.submittingType)}
                                    </div>
                                    <div>
                                      <strong>חייל:</strong> {getSoldierName(selectedRequest)}
                                    </div>
                                    <div>
                                      <strong>סטטוס נוכחי:</strong> {getStatusBadge(selectedRequest.isApproved)}
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        onClick={() => updateStatus(selectedRequest.id, true)}
                                        disabled={selectedRequest.isApproved === true}
                                      >
                                        אשר
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateStatus(selectedRequest.id, false)}
                                        disabled={selectedRequest.isApproved === false}
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
            </TooltipProvider>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestsPage;
