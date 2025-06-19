
import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Phone, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAppStore } from '../store/useAppStore';
import { Soldier } from '../types';

const SoldiersPage = () => {
  const { soldiers, searchSoldiers, deleteSoldier } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSoldiers, setFilteredSoldiers] = useState(soldiers);

  React.useEffect(() => {
    const results = searchSoldiers(searchQuery);
    setFilteredSoldiers(results);
  }, [searchQuery, soldiers, searchSoldiers]);

  const handleDelete = (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק את החייל?')) {
      deleteSoldier(id);
    }
  };

  const getServiceTypeBadge = (serviceType: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      'סדיר': 'default',
      'מילואים': 'secondary',
      'יועץ': 'destructive'
    };
    return variants[serviceType] || 'default';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">ניהול חיילים</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 ml-2" />
          הוסף חייל חדש
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="חפש לפי שם, מספר אישי או ת.ז..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10 text-right"
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">{soldiers.length}</div>
          <div className="text-gray-600">סה"כ חיילים</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">
            {soldiers.filter(s => s.serviceType === 'סדיר').length}
          </div>
          <div className="text-gray-600">שירות סדיר</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-2xl font-bold text-orange-600">
            {soldiers.filter(s => s.serviceType === 'מילואים').length}
          </div>
          <div className="text-gray-600">מילואים</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-2xl font-bold text-red-600">
            {soldiers.filter(s => s.requiresYarkonirApproval).length}
          </div>
          <div className="text-gray-600">דורשים אישור ירקוניר</div>
        </div>
      </div>

      {/* Soldiers Table */}
      <div className="bg-white rounded-lg shadow border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">שם מלא</TableHead>
              <TableHead className="text-right">מ.א.</TableHead>
              <TableHead className="text-right">דרגה</TableHead>
              <TableHead className="text-right">סוג שירות</TableHead>
              <TableHead className="text-right">מדור</TableHead>
              <TableHead className="text-right">תפקיד</TableHead>
              <TableHead className="text-right">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSoldiers.map((soldier) => (
              <TableRow key={soldier.id}>
                <TableCell className="font-medium">{soldier.fullName}</TableCell>
                <TableCell>{soldier.militaryId}</TableCell>
                <TableCell>{soldier.rank}</TableCell>
                <TableCell>
                  <Badge variant={getServiceTypeBadge(soldier.serviceType)}>
                    {soldier.serviceType}
                  </Badge>
                </TableCell>
                <TableCell>{soldier.mador}</TableCell>
                <TableCell>{soldier.role}</TableCell>
                <TableCell>
                  <div className="flex space-x-reverse space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl" dir="rtl">
                        <DialogHeader>
                          <DialogTitle>פרטי החייל</DialogTitle>
                          <DialogDescription>
                            מידע מלא על {soldier.fullName}
                          </DialogDescription>
                        </DialogHeader>
                        <SoldierDetails soldier={soldier} />
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(soldier.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`tel:${soldier.phone}`)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const SoldierDetails: React.FC<{ soldier: Soldier }> = ({ soldier }) => {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div><strong>שם מלא:</strong> {soldier.fullName}</div>
      <div><strong>מ.א.:</strong> {soldier.militaryId}</div>
      <div><strong>ת.ז.:</strong> {soldier.tz}</div>
      <div><strong>טלפון:</strong> {soldier.phone}</div>
      <div><strong>מגדר:</strong> {soldier.gender}</div>
      <div><strong>דרגה:</strong> {soldier.rank}</div>
      <div><strong>סוג שירות:</strong> {soldier.serviceType}</div>
      <div><strong>מרכז:</strong> {soldier.center}</div>
      <div><strong>ענף:</strong> {soldier.anaf}</div>
      <div><strong>מדור:</strong> {soldier.mador}</div>
      <div><strong>צוות:</strong> {soldier.team || 'לא מוגדר'}</div>
      <div><strong>תפקיד:</strong> {soldier.role}</div>
      <div><strong>אישור ירקוניר:</strong> {soldier.requiresYarkonirApproval ? 'נדרש' : 'לא נדרש'}</div>
      <div><strong>משמר אמ"ן:</strong> {soldier.hasMAMGuard ? 'קיים' : 'לא קיים'}</div>
      <div><strong>סיווג בטחוני:</strong> {soldier.securityClearance}</div>
      <div><strong>אלרגיות:</strong> {soldier.allergies}</div>
    </div>
  );
};

export default SoldiersPage;
